import { existsSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from 'fs';
import { join, relative } from 'path';

const ROOT_DIR = process.cwd();
const INDEX_FILENAME = 'index.ts';

// 배럴 파일을 자동 생성할 대상 폴더. 하위 폴더가 자체 index.ts를 가지고 있을 때만 export한다.
const BARREL_TARGET_DIRS = [join(ROOT_DIR, 'src/shared/ui'), join(ROOT_DIR, 'src/shared/layout')];

const HEADER_COMMENT = '// ⚠️ 자동 생성된 파일입니다. 직접 수정하지 마세요.';

const toDisplayPath = (path: string) => relative(ROOT_DIR, path);

const generateBarrelIndex = (targetDir: string) => {
  if (!existsSync(targetDir)) {
    console.log(`ℹ️ ${toDisplayPath(targetDir)} 폴더가 없어 건너뜁니다.`);
    return;
  }

  const indexPath = join(targetDir, INDEX_FILENAME);
  const exportLines = readdirSync(targetDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .filter((entry) => existsSync(join(targetDir, entry.name, INDEX_FILENAME)))
    .map((entry) => entry.name)
    .sort()
    .map((name) => `export * from './${name}';`);

  if (exportLines.length === 0) {
    if (existsSync(indexPath)) {
      unlinkSync(indexPath);
      console.log(`🗑️ ${toDisplayPath(indexPath)} 삭제 완료 (export할 하위 모듈 없음)`);
      return;
    }
    console.log(`ℹ️ ${toDisplayPath(targetDir)}에 export할 하위 모듈이 없습니다.`);
    return;
  }

  const content = `${HEADER_COMMENT}\n${exportLines.join('\n')}\n`;
  const prevContent = existsSync(indexPath) ? readFileSync(indexPath, 'utf-8') : '';

  if (prevContent === content) {
    console.log(`ℹ️ ${toDisplayPath(indexPath)} 변경 사항 없음`);
    return;
  }

  writeFileSync(indexPath, content, 'utf-8');
  console.log(`✅ ${toDisplayPath(indexPath)} 생성/갱신 완료`);
};

BARREL_TARGET_DIRS.forEach(generateBarrelIndex);
