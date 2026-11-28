# 버튼 컴포넌트

공용 버튼은 `@/shared/ui`에서 가져옵니다. `ButtonBase`는 네이티브 `button`만 감싸며 기본 `type`은 `button`입니다. 폼 제출에는 `type='submit'`을 명시합니다. 네이티브 속성, 이벤트, `ref`, `className`을 전달할 수 있습니다.

| 컴포넌트             | 주요 props                                                       | 용도                                                                |
| -------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------- |
| `Button`             | `size: 'large' \| 'small'`                                       | 기본 CTA. 크기는 패딩으로 구분하며 너비는 사용하는 화면에서 지정    |
| `TextButton`         | `variant: 'secondary' \| 'lime'`                                 | 각각 `brand-secondary`, `brand-lime` 컬러 토큰을 사용하는 짧은 동작 |
| `LinkButton`         | `href`, `target`, `rel`                                          | 화살표가 있는 외부 링크                                             |
| `IconButton`         | `aria-label`, `icon`, `variant: 'filled' \| 'plain'`, `selected` | 임의의 아이콘 React 요소를 받는 버튼. `plain`은 배경 없음           |
| `SelectionIndicator` | `selected`, `className`                                          | `CheckIcon`과 토큰 기반 원형 배경으로 표시하는 장식용 선택 상태     |

## 버튼 크기와 스타일 덮어쓰기

Button은 너비나 높이를 고정하지 않고 글자와 패딩으로 크기를 정합니다. 한 줄짜리 기본 버튼은 글자 높이 2.4rem과 위아래 패딩 각 1.4rem으로 높이가 5.2rem이 됩니다. 큰 버튼은 좌우 패딩 4.7rem, 작은 버튼은 2.4rem을 사용합니다. 전체 너비가 필요한 화면은 `className='w-full'`을 전달합니다.

Glass 효과는 CSS Module 대신 Tailwind의 backdrop blur·shadow 임의값으로 표현합니다. `cn`이 같은 속성의 클래스를 병합하므로 `className='backdrop-blur-none shadow-none'`으로 효과를 제거할 수 있습니다. 포커스 스타일은 버튼과 링크가 동일한 클래스 정의를 공유합니다.

## 원형 버튼의 아이콘과 선택 상태

아이콘은 `icon={<CameraIcon />}`처럼 React 요소로 받습니다. 새 아이콘을 추가해도 공용 컴포넌트의 타입이나 상태별 이미지 파일을 수정할 필요가 없습니다. 배경과 아이콘 색은 CSS 토큰으로 처리하며, 선택 상태는 외부에서 관리합니다. 미선택 상태는 클릭할 수 있고, 클릭 자체를 막아야 할 때만 `disabled`를 사용합니다.

```tsx
import { CalendarIcon, CameraIcon, CheckIcon } from '@/shared/assets';
import { IconButton } from '@/shared/ui';

<IconButton
  aria-label='날짜 선택'
  icon={<CalendarIcon width={20} height={20} />}
  selected={calendarSelected}
  onClick={() => setCalendarSelected(!calendarSelected)}
/>;

<IconButton aria-label='사진 선택' icon={<CameraIcon />} selected={cameraSelected} />;

<IconButton aria-label='선택 전환' icon={<CheckIcon />} selected={checked} />;
```

`selected`를 우선 사용하고, 생략하면 `aria-pressed`의 boolean·문자열 값을 선택 표시에도 반영합니다. 접근성 상태와 배경색에 같은 기준을 사용합니다. 아이콘은 장식으로 처리하고 버튼 이름은 필수 `aria-label`로 전달합니다.

### 배경 없는 아이콘 버튼 (`variant='plain'`)

지우기(X), 뒤로가기처럼 배경 없이 아이콘만 있는 버튼은 `variant='plain'`을 사용합니다. 기본값은 원형 배경이 있는 `filled`입니다. `selected`는 `filled`의 배경색에만 반영되므로, 토글이 아닌 단순 동작 버튼에는 전달하지 않습니다.

```tsx
import { BackIcon, SmallXIcon } from '@/shared/assets';
import { IconButton } from '@/shared/ui';

<IconButton variant='plain' aria-label='이름 지우기' icon={<SmallXIcon />} onClick={handleClear} />;

<IconButton variant='plain' aria-label='뒤로 가기' icon={<BackIcon />} onClick={handleBack} />;
```

## 생성 화면 전용 카드

`CategoryCard`와 `FeatureCard`는 생성 화면의 유형·준비 옵션을 보여주므로 `shared` 대신 `views/create-event/ui`에 배치합니다. 슬라이스 외부에서는 `@/views/create-event`로 가져옵니다. 다른 `views` 슬라이스에서 직접 재사용하지 않습니다.

카드는 이미지·문구·선택 상태를 props로 받습니다. 이미지 슬롯은 CategoryCard가 7.6rem, FeatureCard가 11.35rem이며 원하는 SVGR 요소를 전달할 수 있습니다. 이미지와 설명 안에는 별도의 버튼이나 링크를 넣지 않습니다. 선택 전후 이미지 위치는 고정하고 배경·글자색·체크 표시만 바뀝니다. 설명의 명시적 줄바꿈을 유지하면서 긴 문구도 자동으로 줄바꿈합니다.

```tsx
import { BirthdayIcon, EventPreparationIcon, InvitationOnlyIcon } from '@/shared/assets';
import { CategoryCard, FeatureCard } from '@/views/create-event';

<CategoryCard
  image={<BirthdayIcon />}
  selected={selectedCategory === 'birthday'}
  onClick={() => handleSelectCategory('birthday')}
>
  생일
</CategoryCard>;

<FeatureCard
  image={<EventPreparationIcon />}
  description={'초대장 생성 및\n이벤트 준비까지 도와드려요.'}
  selected={selectedMode === 'preparation'}
  onClick={() => handleSelectMode('preparation')}
>
  준비까지 한 번에
</FeatureCard>;

<FeatureCard
  image={<InvitationOnlyIcon />}
  description={'초대장 생성 및 배포만 해요.\n준비보드는 없어요.'}
  selected={selectedMode === 'invitation'}
  onClick={() => handleSelectMode('invitation')}
>
  초대장만
</FeatureCard>;
```

상태·이벤트 처리는 사용하는 Client Component에서 관리합니다. 버튼·카드 자체에는 상태나 브라우저 API가 없어 `use client`를 강제하지 않습니다.

## 외부 링크

LinkButton은 외부 링크를 위한 네이티브 `a`를 직접 렌더링합니다. 앱 내부 페이지 이동에는 Next.js의 `Link`를 사용합니다. 높이는 글자와 패딩으로 정하며 별도 최소 높이를 고정하지 않습니다.

새 탭 여부는 세부 명세와 사용하는 화면에서 정합니다. `target='_blank'`를 전달하면 `rel`에 `noopener noreferrer`를 함께 적용합니다. 공용 컴포넌트에서 모든 링크의 열기 방식을 임의로 고정하지 않습니다.

```tsx
<LinkButton href={externalUrl} target='_blank'>
  저장링크 바로가기
</LinkButton>
```

## 카카오 로그인 버튼

카카오 로그인 버튼은 인증 행동의 진입점이므로 `features/auth`의 `KakaoLoginButton`으로 제공합니다. 디자인의 로고, 배경색, 간격을 적용했으며 실제 인증 연동은 포함하지 않습니다. 사용하는 화면에서 클릭 동작을 전달합니다.

```tsx
import { KakaoLoginButton } from '@/features/auth';

<KakaoLoginButton onClick={handleKakaoLogin} />;
```

## 에셋 위치

- UI 아이콘 원본은 `src/shared/assets/svg/`에 추가하고 `pnpm build:icons`로 `src/shared/assets/icons/`와 export를 생성합니다. 생성 파일을 직접 수정하지 않습니다.
- 단색 아이콘은 `currentColor`를 사용하므로 `text-*` 토큰으로 색을 제어합니다. 선택 상태마다 SVG 파일을 추가하지 않습니다.
- `public/`은 URL로 직접 제공할 배경 등 정적 자원을 둡니다. 원형 버튼의 배경과 상태 색은 CSS로 표현하므로 별도의 `public/images/buttons/` 에셋은 사용하지 않습니다.
- SVG 내부 ID에는 컴포넌트명 prefix를 붙여 서로 다른 일러스트를 함께 표시할 때 참조가 충돌하지 않도록 합니다.
