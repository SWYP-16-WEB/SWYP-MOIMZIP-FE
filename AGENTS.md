# SWYP-MOIMZIP-FE Agent Guide

이 저장소에서 작업하는 AI Agent의 공통 진입점입니다. 세부 규칙은 아래 프로젝트 문서를 참조합니다.

## 기본 규칙

- 요청에 해당하는 문서와 기존 코드를 먼저 읽습니다.
- 현재 적용하는 구조는 `app → views → features → entities → shared`입니다. `widgets` 등 추가 레이어는 팀 합의 후 도입합니다.
- 사용자 변경사항을 임의로 되돌리거나 요청과 무관한 수정을 섞지 않습니다.
- 실제 환경변수 값과 비밀키를 커밋하지 않습니다.
- 커밋·푸시는 사용자가 요청한 범위에서만 진행합니다.

## Repository

- Stack: Next.js 16.4.6 (App Router), React 19.3.0, TypeScript 5.9.3, Tailwind CSS 4.3.3
- 서버 상태 관리: TanStack Query
- 서버 API 통신: Axios
- 서버 연동 도구는 별도 작업 브랜치에서 세팅했습니다. 작업 브랜치의 `package.json`과 기존 연동 코드에 반영되었는지 확인한 뒤 사용합니다.
- 버전 기준: `package.json`과 `pnpm-lock.yaml`을 확인하고, 의존성 변경 시 이 안내도 갱신합니다.
- Package manager: `package.json`의 `packageManager`에 지정된 pnpm
- 개발 통합 브랜치: `develop`
- 배포 브랜치: `main`
- 서버 API와 연동하는 웹 프로젝트입니다. API 계약과 기존 연동 코드를 확인하고, 미확정 응답·인증 정책을 임의로 확정하지 않습니다.

## Docs Map

| 내용                  | 경로                                                         |
| --------------------- | ------------------------------------------------------------ |
| 코딩·스타일링 컨벤션  | [dev-convention.md](docs/conventions/dev-convention.md)      |
| 프로젝트 구조·의존성  | [fsd.md](docs/architecture/fsd.md)                           |
| 포맷팅·Lint·Git hook  | [tooling.md](docs/conventions/tooling.md)                    |
| 디자인 토큰·사용 예시 | [design-tokens.md](docs/design/design-tokens.md)             |
| 커밋 메시지·분리 기준 | [commit.md](docs/conventions/commit.md)                      |
| 브랜치·PR 규칙        | [git-convention.md](docs/conventions/git-convention.md)      |
| PR 본문 템플릿        | [pull_request_template.md](.github/pull_request_template.md) |
| 스킬 구성·도입 상태   | [skills-index.md](docs/agents/skills-index.md)               |

## Skill Routing

아래 스킬을 모두 사용할 수 있습니다. 새 작업을 시작하거나 코드 배치를 판단할 때는 `project-rule`을 먼저 읽고, 작업별 스킬로 구현한 뒤 마무리 단계에서 `code-quality`로 점검합니다.

| 작업                     | 스킬 경로                                   | 현재 참조                              |
| ------------------------ | ------------------------------------------- | -------------------------------------- |
| 새 작업·구조·컨벤션 확인 | `.agents/skills/project-rule/SKILL.md`      | 구조 문서, Docs Map, 관련 코드         |
| 페이지·route·화면 구현   | `.agents/skills/app-page/SKILL.md`          | 구조·코딩 컨벤션, 설치된 Next.js 문서  |
| 공용 UI 구현             | `.agents/skills/shared-components/SKILL.md` | 구조·코딩 컨벤션, 기존 공용 UI         |
| Figma 디자인 구현        | `.agents/skills/figma/SKILL.md`             | 디자인 토큰 문서·CSS, 구조·코딩 컨벤션 |
| 코드 품질 점검           | `.agents/skills/code-quality/SKILL.md`      | 코딩 컨벤션, tooling                   |
| 커밋                     | `.agents/skills/git-commit/SKILL.md`        | commit                                 |
| PR 작성                  | `.agents/skills/git-pr/SKILL.md`            | git-convention, PR 템플릿              |

해당하는 작업은 먼저 `SKILL.md`를 읽고 참조 문서와 절차를 따릅니다. 스킬에 등록되지 않은 작업은 관련 문서와 기존 코드를 기준으로 진행합니다.

## 역할별 에이전트

- 역할과 사용 흐름은 [agents-index.md](docs/agents/agents-index.md)를 참조합니다.
- Codex는 `.codex/agents/`의 TOML 설정을, Claude는 `.claude/agents`를 통해 공통 역할 지침을 읽습니다.
- Claude의 스킬 경로 `.claude/skills`는 `.agents/skills`를 가리키는 심볼릭 링크입니다.
- 역할별 위임은 사용자가 요청한 경우 사용하며, 작은 작업에 모든 역할을 강제하지 않습니다.

## 작업 절차

1. 현재 브랜치와 `git status`, `git diff`, `git diff --cached`를 확인해 기존 변경사항을 파악합니다.
2. 요청 범위와 완료 기준을 정하고, Skill Routing에 따라 관련 문서와 기존 구현을 읽습니다.
3. 현재 폴더 구조와 코딩·스타일링 컨벤션에 맞춰 필요한 부분만 수정합니다.
4. 서버 연동 작업은 API 명세와 기존 요청 코드를 확인하고, 로딩·에러·빈 상태를 처리합니다. 미확정 사항은 사용자에게 확인합니다.
5. 구조나 규칙이 바뀌었다면 관련 문서를 함께 갱신합니다.
6. 아래 검증을 마친 뒤 `git status`, `git diff`, `git diff --cached`로 최종 변경사항을 확인합니다. `git status`에 표시된 새 파일은 내용을 직접 검토하고, 변경 내용, 검증 결과, 남은 사항을 전달합니다.

## 검증 절차

| 변경 범위           | 검증                                                                           |
| ------------------- | ------------------------------------------------------------------------------ |
| 문서만 변경         | 변경 문서에 `pnpm exec prettier --check <파일 경로>` 실행, 링크·참조 경로 확인 |
| 코드·설정 변경      | `pnpm format:check` → `pnpm lint` → `pnpm build` 순서로 실행                   |
| UI·사용자 흐름 변경 | 코드 검증과 함께 변경 화면과 주요 동작 확인                                    |
| 서버 연동 변경      | 코드 검증과 함께 성공·실패 응답, 로딩·빈 상태 확인                             |

- 자동 수정이 필요하면 변경 파일에 한해 ESLint `--fix`, Prettier `--write`를 적용하고 해당 검증을 다시 실행합니다.
- 오류를 해결하기 위해 검사 규칙을 임의로 끄지 않습니다.
- 실행하지 못한 검증은 이유와 함께 알리고, 통과한 것으로 보고하지 않습니다.
- 최종 diff에 충돌 마커, 중복·미사용 import, 임시 코드, 디버그 출력이 남지 않았는지 확인합니다.
- 커밋·PR 요청이 있으면 각각 `commit.md`, `git-convention.md`와 PR 템플릿을 따릅니다.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
