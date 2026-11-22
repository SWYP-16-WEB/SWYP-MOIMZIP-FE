# 역할별 에이전트 구성

## 역할

| 에이전트       | 책임                                   | 산출물                                |
| -------------- | -------------------------------------- | ------------------------------------- |
| `fe-architect` | 기획·요청을 구현 가능한 명세로 정리    | 화면·컴포넌트·API 계약·완료 기준      |
| `fe-developer` | 합의된 명세에 따라 구현                | 변경 코드·검증 결과                   |
| `fe-reviewer`  | 정확성·구조·접근성·성능·보안 리뷰      | 근거와 위치를 포함한 문제·수정 방향   |
| `qa`           | 요구사항 기준 주요 동작·예외 흐름 검증 | 시나리오별 결과·재현 절차·미검증 범위 |

## 도구별 연결

- 공통 역할 지침: `.agents/agents/<역할>.md`
- Claude: `.claude/agents` → `../.agents/agents` 심볼릭 링크
- Codex: `.codex/agents/<역할>.toml`의 `developer_instructions`에서 공통 역할 지침을 참조
- Claude의 `CLAUDE.md`는 `@AGENTS.md`로 공통 규칙을 읽습니다.
- 모델과 권한은 별도로 고정하지 않고 실행 환경의 설정을 따릅니다. 코드 수정 금지는 역할 지침이며 별도의 읽기 전용 샌드박스 설정은 아닙니다.

## 사용 흐름

사용자가 역할별 위임을 요청하면 `fe-architect → fe-developer → fe-reviewer / qa` 순서로 진행합니다. 메인 에이전트가 명세와 결과를 전달하고 최종 결과를 취합합니다. 작은 작업은 필요한 역할만 사용합니다.

예시: “fe-architect로 구현 명세를 정리하고 fe-developer로 구현한 뒤, fe-reviewer와 qa에 점검을 맡겨줘.”

- 설계·구현은 순서대로 진행하고, 리뷰·QA는 필요할 때 독립적으로 진행합니다.
- 각 역할은 작업에 해당하는 프로젝트 스킬을 먼저 읽습니다.
- 설정 파일 추가만으로 역할이 순서대로 자동 실행되지는 않습니다.
- 실행 중인 세션에서 역할이 보이지 않으면 새 세션에서 확인합니다.

## 참고

- [Codex custom agents](https://learn.chatgpt.com/docs/agent-configuration/subagents#custom-agents)
- [Claude Code subagents](https://code.claude.com/docs/en/sub-agents)
