# Coding Convention

이 문서는 파일명, 컴포넌트, 타입, 변수, 함수 등 이 프로젝트에서 지켜야 할 코딩 컨벤션을 정리하는 문서입니다.

## 폴더 / 파일

- 폴더명은 케밥 케이스로 작성한다. (`page-header`)
- 파일명은 종류에 따라 다르게 작성한다.
  - 상수, 타입, 유틸 등: 카멜 케이스 (`userType.ts`)
  - 컴포넌트, 페이지 단위: 파스칼 케이스 (`PageHeader.tsx`)

## 네이밍

- 상수는 대문자 스네이크 케이스로 작성한다. (`API_KEY`)
- 컴포넌트(함수형)는 파스칼 케이스로 작성한다. (`MainHeader`)
- 변수명은 줄임말 없이, 의미가 명확히 드러나도록 작성한다. 이름이 길어지더라도 정확한 쪽을 택한다. (`arr1` 같은 이름 금지)
- Props 타입은 `컴포넌트명 + Props`로 선언한다. (`PageHeaderProps`)

## 변수

- `var`는 금지하고 `const`를 기본으로 사용하며, 재할당이 필요할 때만 `let`을 쓴다.
- 문자열을 조합할 때는 `+` 대신 템플릿 리터럴만 사용한다. (`` `${a} ${b}` ``)
- props, 객체 등은 구조분해할당으로 받는다. (함수 인자에서 바로 `{ a, b, c }`로 받기)

## 타입

- 컴포넌트 props 타입은 컴포넌트 바로 위에 선언한다.
- 객체 구조와 컴포넌트 Props는 확장성을 위해 `interface`를 사용한다. (`interface PageHeaderProps`)
- 서버 응답처럼 형태가 고정된 타입, Union·Tuple·유틸리티 타입은 `type`을 사용한다. (`type ButtonVariant = 'primary' | 'secondary'`)

## 함수

- 기본적으로 화살표 함수를 사용한다.
- 함수명은 역할이 드러나도록 짓는다. `get`(값을 얻음), `create`(새 값 생성), `check`(로직 확인) 등.
- 이벤트 핸들러는 `handle`로 시작한다. (`handleOnClick`, `handleSubmit`)
- boolean을 반환하는 유틸 함수는 `has+명사`로 짓는다. (`hasEmail`)
- 여러 곳에서 쓰이는 함수는 `utils`로 모으고, 프로젝트 전역에서 쓰인다면 `shared/utils`로 옮긴다.
- 가능한 경우 early return을 적극 활용한다.

## 제어문 / 반복문

- 조건문은 삼항 연산자로 작성한다. (`조건 ? 참 : 거짓`)
- `switch-case`는 `break`를 반드시 붙이고, `case` 사이는 가독성을 위해 한 줄씩 띄운다.
- `for` 대신 `forEach`, `map`을 사용한다.
- `map` 사용 시 `key`는 `index`가 아닌 고유한 값을 사용한다.

## 비동기 처리

- `axios`는 `.then` / `.catch`로 처리한다.
- `async/await`는 `try/catch`로 처리한다.

## 주석

- 주석은 설명하려는 코드 바로 위에 작성한다. (코드 아래에 다는 것은 금지)
- 한 줄짜리 설명은 코드 끝에 붙이는 것도 허용한다.

## 컴포넌트

- `button` 태그에는 `type`을 명시한다. (`<button type="button">`)
- 버튼, 헤더 등 공용 컴포넌트는 `children`을 적극 활용한다.

## 스타일링 (Tailwind)

- 루트 폰트 크기를 `62.5%`로 설정해 `1rem = 10px`로 사용한다. (`src/styles/layout.css`)
- 크기·간격·둥글기·글자 크기 등 수치가 들어가는 값은 Tailwind 기본 스케일(`p-4`, `text-sm`, `rounded-lg` 등) 대신 **rem 단위 임의값**으로 작성한다. 디자인 시안의 px 값을 10으로 나눠 rem으로 옮긴다.
  - ✅ `rounded-[1rem] rounded-[6rem] px-[3rem] py-[1.6rem] gap-[0.8rem] text-[1.4rem]`
  - ❌ `rounded-lg px-12 py-4 gap-2 text-sm`
- 디자인 시스템의 타이포그래피는 `src/styles/font.token.css`의 조합 유틸리티(`title-b-24`, `body-sb-16` 등)를 사용한다. 유틸리티 내부 글자 크기는 rem, 공통 행간은 단위 없는 `1.5`로 정의한다.
- 수치가 없는 유틸리티(`flex`, `items-center`, `font-bold`, `w-full`, `min-h-screen` 등)는 그대로 사용한다.
- 클래스를 조건부로 합치거나 외부에서 `className`을 받아 덮어쓸 때는 `cn` 유틸(`@/shared/utils/cn`)을 사용한다.

## Export

- `page.tsx`, `layout.tsx`, `loading.tsx` 등 Next.js가 default export를 요구하는 특수 파일을 제외하고는, 파일에 내보낼 요소가 하나뿐이어도 `named export`를 사용한다. (`export const Header = () => {}`)
- barrel(`export * from './x'`)로 재수출하는 `shared/ui`, `shared/layout` 등에서는 named export를 써야 하위 `index.ts`가 `default as` 없이 그대로 재수출할 수 있고, import 시 이름도 항상 고정된다.

## Import

- 다른 폴더의 코드를 가져올 때 2단계(`../../`) 이상 상위로 올라가야 한다면 상대 경로 대신 절대 경로(`@/`)를 사용한다. (`@/shared/utils/cn`)
- 같은 페이지/기능 폴더 안에서 한 단계(`../`) 이내로 옮겨가는 경우는 상대 경로를 그대로 써도 된다.

---

- 포맷팅/Lint 자동화, 아이콘(SVGR), Barrel Export 등 도구/스크립트 관련 내용은 [`tooling.md`](./tooling.md)를 참고하세요.
- Git 커밋 메시지와 브랜치 규칙은 [`git-convention.md`](./git-convention.md)를 참고하세요.
