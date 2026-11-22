---
name: shared-components
description: 이 저장소에서 도메인과 무관한 공용 UI(버튼, 입력, 바텀시트, 캘린더, 토스트, 헤더, 레이아웃 컴포넌트 등)를 `src/shared/ui`·`src/shared/layout`에 만들거나 고치고, 기존 공용 컴포넌트를 재사용할지 판단할 때 사용합니다. "공통 버튼 만들어줘", "인풋 컴포넌트", "바텀시트 공용으로", "이거 shared로 빼도 돼?"처럼 말하면 사용합니다.
---

# 공용 UI 구현

여러 화면에서 쓰는 도메인 무관 UI를 `shared`에 만들고, 이미 있는 공용 컴포넌트를 우선 재사용합니다. 공용 컴포넌트는 많은 화면이 의존하므로 props 설계와 접근성을 처음부터 맞춥니다.

## 참조 문서

아래 링크는 이 스킬 파일 기준 상대 경로입니다. 명령은 저장소 루트에서 실행합니다.

- [레이어 구조·`shared/ui` 후보 목록](../../../docs/architecture/fsd.md)
- [코딩·스타일링 컨벤션](../../../docs/conventions/dev-convention.md)
- [디자인 토큰](../../../docs/design/design-tokens.md)
- [barrel export·아이콘 생성 스크립트](../../../docs/conventions/tooling.md)
- 기존 구현: `src/shared/ui/`, `src/shared/layout/`, `src/shared/assets/`, `src/shared/utils/cn.ts`

## 트리거

- 공용 컴포넌트를 새로 만들거나 기존 컴포넌트에 variant·props를 추가할 때
- 화면 구현 중 어떤 UI를 `shared`로 둘지 판단할 때

## 해야 할 일

1. `shared`에 둘 코드인지 판단합니다.
   - 이벤트, 초대장, 응답 같은 도메인 용어나 데이터가 들어가면 `shared`가 아닙니다. 도메인 데이터를 보여주면 `entities`, 사용자 행동이면 `features`에 둡니다.
   - 사용 화면 수보다 역할과 바뀌는 이유로 판단합니다. 버튼·입력·바텀시트처럼 디자인 시스템의 기반 UI는 처음 쓰는 화면이 하나뿐이어도 `shared`에 둡니다. 반대로 특정 화면의 배치·문구에 묶여 그 화면과 함께 바뀌는 조합 UI는 그 화면의 `views` 슬라이스 안에 둡니다.
   - `fsd.md`의 `shared/ui` 후보 목록과 기존 `src/shared/ui`를 먼저 확인해 이미 있는 컴포넌트를 재사용하거나 확장합니다.
2. 디자인이 확정 전이면 목록 전체를 미리 만들지 않고, 그 컴포넌트를 처음 쓰는 화면을 구현할 때 필요한 variant만 만듭니다. 시안이 바뀌면 다시 만들게 되기 때문입니다. Figma 시안이 있으면 `figma` 스킬로 값과 variant를 확인합니다.
3. 폴더와 공개 경계를 맞춥니다.
   - `src/shared/ui/<kebab-case-폴더>/`에 컴포넌트 파일(PascalCase)과 `index.ts`를 만듭니다. 레이아웃 컴포넌트는 `src/shared/layout/`에 같은 방식으로 둡니다. (폴더가 아직 없으면 첫 컴포넌트를 추가할 때 만듭니다. barrel 스크립트는 두 폴더를 모두 대상으로 합니다)
   - `pnpm barrels`로 상위 `index.ts`를 다시 만듭니다. 생성된 `index.ts`는 직접 수정하지 않습니다.
   - 사용하는 곳에서는 `@/shared/ui`로 import합니다.
4. props를 설계합니다.
   - Props 타입은 `컴포넌트명Props` interface로 컴포넌트 바로 위에 선언합니다. variant는 union type으로 정의합니다.
   - 내용은 `children`으로 받고, 외부에서 스타일을 조정할 수 있게 `className`을 받아 `cn`으로 병합합니다.
   - 네이티브 요소를 감싸면 해당 요소의 기본 속성(`ButtonHTMLAttributes` 등)을 이어받아 `disabled`, `aria-*` 등이 그대로 전달되게 합니다.
   - 저장·제출처럼 화면마다 달라지는 동작은 콜백 props로 받고, 컴포넌트 안에서 API를 호출하지 않습니다.
5. 스타일은 컬러 토큰과 타이포그래피 유틸리티를 쓰고, 수치는 rem 임의값으로 씁니다. 시안 값이 토큰에 없으면 임의 값을 넣기 전에 토큰 추가가 필요한지 확인합니다. 아이콘은 `@/shared/assets`의 컴포넌트를 쓰고, 없으면 `tooling.md` 아이콘 규칙대로 추가합니다.
6. 접근성을 처리합니다. 의미에 맞는 태그(`button`, `label`, `dialog` 등)를 쓰고, `button`에는 `type`을 명시합니다. 아이콘만 있는 버튼에는 접근 가능한 이름을 붙이고, 입력에는 라벨과 에러 문구를 연결합니다. 바텀시트·모달은 포커스 이동과 닫기 동작(배경 클릭, ESC)을 확인합니다.

## 점검해야 할 내용

- 컴포넌트에 도메인 용어·데이터·API 호출이 들어가지 않았는지 확인합니다.
- `shared`가 상위 레이어(`app`, `views`, `features`, `entities`)를 import하지 않는지 확인합니다.
- barrel `index.ts`가 스크립트로 갱신되었고 import 경로가 `@/shared/ui`인지 확인합니다.
- 기존 공용 컴포넌트와 역할이 겹치는 컴포넌트를 새로 만들지 않았는지 확인합니다.
- 사용하는 화면에서 렌더링과 상태별 모양(기본, 비활성, 에러 등)을 확인하고, `pnpm format:check` → `pnpm lint` → `pnpm build`를 실행합니다.
