# 버튼 컴포넌트

버튼은 `@/shared/ui`에서 가져옵니다. 모든 버튼은 `ButtonBase`의 포커스·비활성 스타일을 공유합니다. 기본 `type`은 `button`이며, 폼 제출에는 `type='submit'`을 명시합니다. 네이티브 속성, 이벤트, `ref`, `className`을 전달할 수 있습니다.

| 컴포넌트       | 주요 props                                                          | 용도                                         |
| -------------- | ------------------------------------------------------------------- | -------------------------------------------- |
| `Button`       | `size: 'large' \| 'small'`                                          | 기본 CTA. large는 부모 너비, small은 16.7rem |
| `TextButton`   | `variant: 'blue' \| 'lime'`                                         | 복사 등 짧은 동작                            |
| `LinkButton`   | `href`                                                              | 화살표가 있는 실제 링크                      |
| `IconButton`   | `aria-label`, `variant: 'plain' \| 'filled' \| 'check'`, `selected` | 아이콘 버튼. check는 선택 표시를 기본 제공   |
| `CategoryCard` | `image`, `selected`, `children`                                     | 이미지와 이름을 표시하는 선택 버튼           |
| `FeatureCard`  | `image`, `description`, `selected`, `children`                      | 이미지·제목·설명이 있는 선택 버튼            |

## 이미지와 선택 상태 주입

카드에는 모임 유형 목록이나 API가 없습니다. `image`에 SVGR 컴포넌트 등 원하는 React 요소를 넘깁니다. SVG의 크기는 전달하는 쪽에서 슬롯에 맞춥니다. CategoryCard의 이미지 슬롯은 7.6rem, FeatureCard는 11.35rem입니다. FeatureCard는 설명이 한 글자만 다음 줄로 넘어가지 않도록 너비를 17.5rem으로 조정했으며 명시한 줄바꿈을 유지합니다. 이미지가 장식용이므로 카드에서 접근성 트리에서 제외하고, 이름은 `children`으로 제공합니다. 이미지와 설명에는 별도의 버튼이나 링크를 넣지 않습니다.

```tsx
import { BirthdayIcon, HomePartyIcon } from '@/shared/assets';
import { CategoryCard } from '@/shared/ui';

// 상태와 이벤트 처리는 사용하는 Client Component에서 관리합니다.
<CategoryCard
  image={<BirthdayIcon />}
  selected={selectedCategory === 'birthday'}
  onClick={() => handleSelectCategory('birthday')}
>
  생일
</CategoryCard>;

<CategoryCard
  image={<HomePartyIcon />}
  selected={selectedCategory === 'home-party'}
  onClick={() => handleSelectCategory('home-party')}
>
  홈파티 · 집들이
</CategoryCard>;
```

카드와 선택형 아이콘 버튼은 `aria-pressed`로 상태를 전달합니다. 선택 상태는 외부에서 관리하며, 비활성 상태는 네이티브 `disabled`로 설정합니다. LinkButton은 이동을 위한 링크이며 별도의 비활성 상태를 제공하지 않습니다.

컴포넌트 자체에는 상태·브라우저 API가 없어 `use client`를 강제하지 않습니다. 클릭 이벤트를 사용하는 화면은 Client Component에서 조합합니다.

## 디자인 표현과 에셋

- 컬러·타이포그래피는 기존 토큰, 크기·간격은 rem 임의값을 사용합니다.
- 기본 버튼과 미선택 FeatureCard의 Glass 효과는 CSS의 반투명 배경, backdrop blur, 안쪽 하이라이트로 근사합니다. Figma의 굴절·분산 효과와 완전히 같지는 않습니다.
- 선택 표시와 캘린더·카메라 버튼 SVG는 원본의 고정 색상을 유지하는 장식 이미지로 `public/images/buttons/`에 보관합니다. 링크 화살표는 SVGR 생성 스크립트로 관리합니다.
- 생성 스크립트는 SVG 내부 ID에 컴포넌트명 prefix를 붙입니다. 이미지 패턴을 사용하는 서로 다른 SVGR 아이콘을 같은 화면에 표시해도 참조가 충돌하지 않도록 합니다.

## 원형 버튼과 기능 카드의 선택 상태

활성화는 `selected`로 표현합니다. 미선택 상태는 클릭할 수 있으며, 클릭 자체를 막아야 할 때만 `disabled`를 사용합니다. 캘린더·카메라는 `icon='calendar'`, `icon='camera'`로 원본 아이콘을 선택하고, 체크는 `variant='check'`로 사용합니다. 모두 사용하는 화면에서 `selected`와 `onClick`을 함께 연결합니다.

```tsx
import { EventPreparationIcon, InvitationOnlyIcon } from '@/shared/assets';
import { FeatureCard, IconButton } from '@/shared/ui';

<IconButton
  aria-label='날짜 선택'
  icon='calendar'
  selected={calendarSelected}
  onClick={() => setCalendarSelected(!calendarSelected)}
/>;

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

## 카카오 로그인 버튼

카카오 로그인 버튼은 인증 행동의 진입점이므로 `features/auth`의 `KakaoLoginButton`으로 제공합니다. 디자인의 로고, 배경색, 간격을 적용했으며 실제 인증 연동은 포함하지 않습니다. 사용하는 화면에서 클릭 동작을 전달합니다.

```tsx
import { KakaoLoginButton } from '@/features/auth';

<KakaoLoginButton onClick={handleKakaoLogin} />;
```
