import type { Config } from '@svgr/core';
import { transform } from '@svgr/core';
import { mkdir, readdir, readFile, rm, writeFile } from 'fs/promises';
import { join } from 'path';
import prettier from 'prettier';

const ROOT_DIR = process.cwd();
const ASSET_DIR = join(ROOT_DIR, 'src/shared/assets');
const SVG_DIR = join(ASSET_DIR, 'svg');
const ICON_DIR = join(ASSET_DIR, 'icons');
const INDEX_FILE = join(ASSET_DIR, 'index.ts');

const HEADER_COMMENT = ['/**', ' * ⚠️ 자동 생성된 파일입니다. 직접 수정하지 마세요.', ' */'].join(
  '\n',
);

interface GeneratedIcon {
  file: string;
  componentName: string;
}

// 프로젝트 컨벤션(named export)에 맞춰 `export const HomeIcon = (props) => <svg />` 형태로 생성한다.
const iconTemplate: Config['template'] = (variables, { tpl }) => tpl`
${variables.imports};

${variables.interfaces};

export const ${variables.componentName} = (${variables.props}) => (
  ${variables.jsx}
);
`;

// SVG 파일명은 영어 소문자 kebab-case만 허용한다. (home.svg, arrow-left.svg)
// 한글 파일명은 OS별 유니코드 정규화(NFC/NFD) 차이로 컴포넌트 이름이 달라질 수 있어 막는다.
const SVG_FILENAME_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*\.svg$/;

// home.svg → HomeIcon, arrow-left.svg → ArrowLeftIcon
const toComponentName = (filename: string) => {
  const pascalName = filename
    .replace(/\.svg$/i, '')
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('');

  return pascalName.endsWith('Icon') ? pascalName : `${pascalName}Icon`;
};

// fill/stroke 색상을 currentColor로 바꿔 Tailwind `text-*`로 색을 제어할 수 있게 한다.
// "none"과 "url(#...)"(그라디언트/패턴 참조)는 색상이 아니라 구조적 값이므로 유지한다.
// `fill = "#f00"`처럼 등호 앞뒤에 공백이 있는 속성도 유효한 SVG이므로 함께 변환한다.
const normalizeColorAttributes = (svg: string) =>
  svg.replace(/\b(fill|stroke)\s*=\s*(["'])(?!none\2|url\()[^"']*\2/gi, '$1="currentColor"');

const extractViewBox = (svg: string) => svg.match(/\bviewBox\s*=\s*["']([^"']+)["']/i)?.[1] ?? null;

const formatWithPrettier = async (code: string, filePath: string) => {
  const projectPrettierConfig = (await prettier.resolveConfig(filePath)) ?? {};
  return prettier.format(code, { ...projectPrettierConfig, parser: 'typescript' });
};

const writeIfChanged = async (path: string, content: string) => {
  const previous = await readFile(path, 'utf-8').catch((error: NodeJS.ErrnoException) => {
    if (error.code === 'ENOENT') return null;
    throw error;
  });
  if (previous === content) return;
  await writeFile(path, content, 'utf-8');
};

// 폴더를 통째로 삭제하지 않고, 원본에서 제거된 생성 아이콘만 정리한다.
const removeStaleIcons = async (icons: GeneratedIcon[]) => {
  const expectedFiles = new Set(icons.map(({ componentName }) => `${componentName}.tsx`));
  const files = await readdir(ICON_DIR);
  await Promise.all(
    files
      .filter(
        (file) => /^(?:Icon|[A-Z][A-Za-z0-9]*Icon)\.tsx$/.test(file) && !expectedFiles.has(file),
      )
      .map(async (file) => {
        const path = join(ICON_DIR, file);
        const content = await readFile(path, 'utf-8');
        if (content.startsWith(HEADER_COMMENT)) await rm(path);
      }),
  );
};

const generateIconComponent = async (file: string): Promise<GeneratedIcon> => {
  const componentName = toComponentName(file);
  const svgPath = join(SVG_DIR, file);
  const outputPath = join(ICON_DIR, `${componentName}.tsx`);

  const svgRaw = await readFile(svgPath, 'utf-8');
  const viewBox = extractViewBox(svgRaw);

  const jsCode = await transform(
    normalizeColorAttributes(svgRaw),
    {
      typescript: true,
      jsxRuntime: 'automatic',
      expandProps: 'end',
      template: iconTemplate,
      svgoConfig: {
        plugins: [
          { name: 'preset-default', params: { overrides: { removeViewBox: false } } },
          { name: 'prefixIds', params: { prefix: componentName } },
        ],
      },
      plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
    },
    { componentName, filePath: svgPath },
  );

  // svgo 설정과 별개로, 변환 과정에서 viewBox가 빠졌다면 원본 값을 다시 주입한다.
  const codeWithViewBox =
    viewBox && !jsCode.includes('viewBox')
      ? jsCode.replace(/<svg(\s|>)/, `<svg viewBox="${viewBox}"$1`)
      : jsCode;

  // babel 템플릿이 빈 줄을 지우므로 import 다음 줄바꿈을 직접 보정한다.
  const formatted = (await formatWithPrettier(codeWithViewBox, outputPath)).replace(
    /(from 'react';\n)(?!\n)/,
    '$1\n',
  );
  await writeIfChanged(outputPath, `${HEADER_COMMENT}\n${formatted}`);

  return { file, componentName };
};

const generateIndexFile = async (icons: GeneratedIcon[]) => {
  // 파일명 순(home-party.svg → home.svg)이 아닌 export 경로 순으로 정렬해 simple-import-sort와 맞춘다.
  const exportLines = [...icons]
    .sort((a, b) => a.componentName.localeCompare(b.componentName, 'en'))
    .map(({ componentName }) => `export { ${componentName} } from './icons/${componentName}';`)
    .join('\n');

  const rawContent = [
    HEADER_COMMENT,
    `import type { SVGProps } from 'react';`,
    '',
    'export type IconProps = SVGProps<SVGSVGElement>;',
    '',
    exportLines,
    '',
  ].join('\n');

  await writeIfChanged(INDEX_FILE, await formatWithPrettier(rawContent, INDEX_FILE));
};

const generate = async () => {
  try {
    const files = await readdir(SVG_DIR);
    const svgFiles = files.filter((file) => file.toLowerCase().endsWith('.svg')).sort();

    const invalidFiles = svgFiles.filter((file) => !SVG_FILENAME_PATTERN.test(file));
    if (invalidFiles.length > 0) {
      throw new Error(
        `SVG 파일명은 영어 소문자 kebab-case로 작성해주세요. (예: arrow-left.svg)\n${invalidFiles.join('\n')}`,
      );
    }

    const duplicated = svgFiles
      .map(toComponentName)
      .filter((name, index, names) => names.indexOf(name) !== index);
    if (duplicated.length > 0) {
      throw new Error(`컴포넌트 이름이 중복됩니다: ${[...new Set(duplicated)].join(', ')}`);
    }

    await mkdir(ICON_DIR, { recursive: true });
    const icons = await Promise.all(svgFiles.map(generateIconComponent));
    await generateIndexFile(icons);
    await removeStaleIcons(icons);

    console.info(`✅ SVG ${icons.length}개를 React 컴포넌트로 변환했습니다.`);
  } catch (error) {
    console.error('❌ 아이콘 생성 실패:', error);
    process.exit(1);
  }
};

void generate();
