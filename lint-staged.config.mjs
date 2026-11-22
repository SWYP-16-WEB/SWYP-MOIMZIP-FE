// eslint --fix(import 정렬 등)가 만든 결과까지 Prettier가 다시 정리하도록 ESLint -> Prettier 순서로 실행한다.
const lintStagedConfig = {
  '*.{js,jsx,mjs,cjs,ts,tsx}': ['eslint --fix', 'prettier --write'],
  '*.{json,css,md,yml,yaml}': 'prettier --write',
};

export default lintStagedConfig;
