---
name: app-page
description: 이 저장소에서 Next.js App Router 페이지·route·화면을 만들거나 고칠 때 사용합니다. `src/app`의 page·layout·loading·error·not-found·route group·동적 route 추가, `src/views` 화면 슬라이스 구현, 화면에서 서버 데이터 조회·제출 연결, Server/Client Component 경계 판단이 포함됩니다. "2-1 화면 만들어줘", "내 모임 페이지 구현", "라우트 추가", "이 화면 로딩/에러 처리"처럼 화면 번호나 페이지 이름만 말해도 사용합니다.
---

# App Router 페이지·화면 구현

`app`은 라우팅만, `views`는 화면 구현을 담당하는 구조에 맞춰 페이지를 만듭니다. 이 프로젝트의 Next.js는 학습 데이터와 API·동작이 다를 수 있으므로, 쓰려는 기능은 설치된 문서로 확인한 뒤 구현합니다.

## 참조 문서

아래 링크는 이 스킬 파일 기준 상대 경로입니다. 명령은 저장소 루트에서 실행합니다.

- [작업·검증 절차](../../../AGENTS.md)
- [레이어 구조·슬라이스 배치 기준](../../../docs/architecture/fsd.md)
- [코딩·스타일링 컨벤션](../../../docs/conventions/dev-convention.md)
- [디자인 토큰](../../../docs/design/design-tokens.md)
- Next.js 문서: `node_modules/next/dist/docs/01-app/`
  - 시작하기(`01-getting-started/`): 프로젝트 구조, 레이아웃·페이지, Server/Client Component, 데이터 조회, 캐싱, 에러 처리, 메타데이터
  - 파일 규칙(`03-api-reference/03-file-conventions/`): `page`, `layout`, `loading`, `error`, `not-found`, `route-groups`, `dynamic-routes`
- 현재 설정: `next.config.ts`, 루트 레이아웃 `src/app/layout.tsx`

## 트리거

- 새 화면(기능명세 화면 번호 기준)이나 route를 추가할 때
- 기존 화면의 구성·데이터 연동·로딩/에러/빈 상태를 고칠 때
- 레이아웃, route group, 동적 route, 메타데이터를 바꿀 때

## 해야 할 일

1. 브랜치·범위 확인과 배치 판단은 `project-rule` 스킬을 먼저 따릅니다. 디자인 시안을 구현하면 `figma` 스킬도 함께 읽습니다.
2. URL을 정합니다. 게스트 링크, 호스트 관리 코드처럼 URL 설계가 확정되지 않은 route는 경로를 임의로 정하지 말고 사용자에게 확인합니다. 회원 전용 화면처럼 같은 레이아웃을 공유하는 route는 route group으로 묶습니다.
3. `app/**/page.tsx`는 `views` 슬라이스의 public API(`index.ts`)를 불러와 렌더링하고, route에서만 얻을 수 있는 값(`params`, `searchParams`)을 props로 넘깁니다. 화면 마크업과 로직은 `page.tsx`에 쓰지 않습니다. 같은 화면을 생성·수정처럼 두 route에서 쓰면 view 하나에 `mode` 같은 props를 다르게 넘깁니다.
4. `views/<화면-슬라이스>/`에 화면을 구현합니다. 한 화면 전용 컴포넌트·훅은 슬라이스 안에 두고, 여러 화면이 쓰는 코드는 `fsd.md` 기준으로 `features`·`entities`·`shared`에서 가져옵니다. 여러 feature를 함께 써야 하면 이 view에서 조합합니다.
5. Server/Client 경계를 정합니다. 기본은 Server Component로 두고, 상태·이벤트·브라우저 API·TanStack Query 훅이 필요한 가장 작은 컴포넌트에만 `'use client'`를 붙입니다. 클라이언트에 비밀값이나 서버 전용 코드가 넘어가지 않게 합니다.
6. 이 프로젝트는 `next.config.ts`에서 Cache Components를 켜 두었습니다. 캐시되지 않는 데이터나 요청 시점 데이터(`cookies()`, `headers()`, 캐시 없는 fetch)를 쓰는 부분은 `<Suspense>`나 `loading.tsx`로 감싸야 빌드 오류가 나지 않습니다. `params`·`searchParams`는 Promise이므로 `await`해서 씁니다. 페이지·레이아웃 props 타입은 전역 헬퍼 `PageProps<'/경로'>`, `LayoutProps<'/경로'>`를 사용합니다.
7. 서버 연동은 API 명세와 기존 요청 코드(`shared/api`, `entities/*/api`)를 확인한 뒤 연결합니다. 명세가 없으면 응답 형태를 임의로 정하지 말고 확인을 요청합니다. 로딩, 에러, 빈 결과, 중복 제출 방지를 화면마다 처리합니다.
8. 공통 배경과 페이지 여백(최대 너비·좌우·상하 패딩)은 루트 레이아웃과 `src/styles/layout.css`에 이미 적용되어 있습니다. 화면에서 다시 넣지 않습니다. 화면 높이를 채워야 하면 `min-h-screen` 대신 `flex-1`을 씁니다. `min-h-screen`은 레이아웃 여백만큼 스크롤을 만듭니다. 바텀시트처럼 화면 전체를 덮는 요소는 `fixed`로 띄웁니다.
9. 화면 제목 등 메타데이터가 필요하면 Next.js 메타데이터 규칙을 따릅니다.

## 점검해야 할 내용

- `page.tsx`가 라우팅·연결만 하고, 화면 구현은 `views` public API를 통해 가져오는지 확인합니다.
- `views` 슬라이스가 다른 `views` 슬라이스를 import하지 않는지 확인합니다.
- `'use client'` 범위가 필요한 컴포넌트로만 좁혀져 있는지 확인합니다.
- 캐시되지 않는 데이터 접근이 `<Suspense>`·`loading.tsx` 경계 안에 있는지 `pnpm build`로 확인합니다.
- 로딩·에러·빈 상태와 중복 제출 방지가 처리되었는지 확인합니다.
- 화면을 실제로 띄워 확인합니다. 이미 실행 중인 개발 서버가 있으면 끄지 말고 그 서버를 사용합니다. 시안 기준인 모바일 폭(390px)과 넓은 화면에서 레이아웃·스크롤을 확인합니다.
- 실행하지 못한 검증과 확인하지 못한 기기·브라우저는 결과에 명시합니다.
