import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettierConfig from 'eslint-config-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';

// 2단계 이상 상위 경로 금지 (docs/conventions/dev-convention.md > Import)
const relativeImportPattern = {
  group: ['../../*'],
  message: '2단계 이상 상위 경로 대신 절대 경로(@/)를 사용하세요.',
};

// 각 레이어가 참조할 수 없는 상위 레이어 (docs/architecture/fsd.md > 의존성 규칙)
const LAYER_ORDER = ['app', 'views', 'features', 'entities', 'shared'];
const layerBoundaries = LAYER_ORDER.slice(1).map((layer, index) => ({
  layer,
  upperLayers: LAYER_ORDER.slice(0, index + 1),
}));

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
    },
    rules: {
      // docs/conventions/dev-convention.md
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-template': 'error',

      'no-restricted-imports': ['error', { patterns: [relativeImportPattern] }],

      // import/export 정렬 (side effect -> 외부 패키지 -> @/ 절대 경로 -> 상대 경로)
      'simple-import-sort/imports': [
        'error',
        {
          groups: [['^\\u0000'], ['^node:', '^(?!@/)@?\\w'], ['^@/'], ['^\\.']],
        },
      ],
      'simple-import-sort/exports': 'error',

      // 타입스크립트
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': 'warn',

      // no-unused-vars 대신 unused-imports로 대체 (자동 삭제 가능)
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          vars: 'all',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },

  // react·import 플러그인은 eslint-config-next가 등록하는 파일 범위에서만 적용 (.cjs 제외)
  {
    files: ['**/*.{js,jsx,mjs,ts,tsx,mts,cts}'],
    rules: {
      'react/jsx-pascal-case': 'error',
      'react/button-has-type': 'error',
      'react/no-array-index-key': 'warn',
      'import/no-default-export': 'error',
    },
  },

  // Next.js 특수 파일과 설정 파일은 default export 허용
  {
    files: [
      'src/app/**/{page,layout,loading,error,not-found,global-error,template,default,route}.{ts,tsx}',
      'src/app/**/{opengraph-image,twitter-image,icon,apple-icon,sitemap,robots,manifest}.{ts,tsx}',
      'src/{middleware,proxy,instrumentation}.ts',
      '*.config.{js,mjs,ts}',
    ],
    rules: {
      'import/no-default-export': 'off',
    },
  },

  // 레이어 의존 방향: app -> views -> features -> entities -> shared (docs/architecture/fsd.md)
  ...layerBoundaries.map(({ layer, upperLayers }) => ({
    files: [`src/${layer}/**`],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            relativeImportPattern,
            {
              group: upperLayers.flatMap((upperLayer) => [`@/${upperLayer}`, `@/${upperLayer}/*`]),
              message: `${layer}에서 상위 레이어(${upperLayers.join(', ')})를 참조할 수 없습니다.`,
            },
          ],
        },
      ],
    },
  })),

  prettierConfig,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
]);

export default eslintConfig;
