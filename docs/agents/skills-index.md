# Agent Harness 스킬 구성

## 현재 적용 범위

- `AGENTS.md`: 프로젝트 규칙과 문서 안내, 작업별 라우팅 진입점
- `.agents/skills/`: 사용 가능한 스킬 (새 스킬을 준비할 때만 `.gitkeep` 폴더를 둡니다)
- 이 문서: 스킬 목록과 도입 상태

아래 스킬을 모두 사용할 수 있습니다. 작업에 해당하는 스킬을 `AGENTS.md`의 Skill Routing에서 찾아 먼저 읽고, 스킬에 없는 작업은 Docs Map의 문서를 직접 확인합니다.

## 스킬 목록

| 스킬                | 트리거·역할                                | 상태      |
| ------------------- | ------------------------------------------ | --------- |
| `project-rule`      | 새 작업 시작 시 브랜치·구조·컨벤션 파악    | 사용 가능 |
| `app-page`          | App Router 페이지·route·화면 구현          | 사용 가능 |
| `shared-components` | 도메인과 무관한 공용 UI 구현·재사용 판단   | 사용 가능 |
| `figma`             | Figma 디자인을 코드와 디자인 토큰으로 반영 | 사용 가능 |
| `code-quality`      | 구현 마무리·리팩터링 시 코드 품질 점검     | 사용 가능 |
| `git-commit`        | 변경사항 분리·커밋 메시지 작성             | 사용 가능 |
| `git-pr`            | PR 제목·본문 작성                          | 사용 가능 |

## 기본 구조

```text
AGENTS.md
.agents/skills/
├── project-rule/SKILL.md
├── app-page/SKILL.md
├── shared-components/SKILL.md
├── figma/SKILL.md
├── code-quality/SKILL.md
├── git-commit/SKILL.md
└── git-pr/SKILL.md
docs/agents/skills-index.md
```

## 작업 흐름

`사용자 요청 → AGENTS.md → project-rule → 작업별 스킬 → 관련 문서·코드 확인 → 작업 → code-quality 점검·검증` 순서로 진행합니다.

공통 작업·검증 절차는 [AGENTS.md](../../AGENTS.md#작업-절차)를 따릅니다.

| 작업            | 스킬 흐름                                                                     |
| --------------- | ----------------------------------------------------------------------------- |
| 화면·route 구현 | `project-rule` → `app-page` (시안이 있으면 `figma`) → `code-quality`          |
| 공용 UI 구현    | `project-rule` → `shared-components` (시안이 있으면 `figma`) → `code-quality` |
| 커밋·PR         | 사용자 요청이 있을 때 `git-commit`, `git-pr`                                  |

작은 수정에는 모든 스킬을 강제하지 않고 필요한 스킬만 사용합니다.

## 스킬 추가 기준

- 스킬 원본은 `.agents/skills/`에만 작성합니다. `.claude/skills`는 해당 폴더를 가리키는 심볼릭 링크입니다.
- 스킬은 `.agents/skills/<스킬명>/SKILL.md` 한 단계 구조로 작성합니다.
- 두 도구 호환을 위해 `SKILL.md` frontmatter에는 `name`, `description`만 사용합니다.
- 각 폴더에 `SKILL.md`를 작성하고 `.gitkeep`을 제거합니다.
- 스킬에는 설명, 참조 문서, 트리거, 수행 절차, 점검 항목을 정리합니다.
- 기존 컨벤션은 복사하지 않고 원문 문서를 참조합니다.
- 실제 문서 경로와 실행 절차를 확인한 뒤 `AGENTS.md`의 라우팅과 이 문서의 상태를 함께 갱신합니다.
