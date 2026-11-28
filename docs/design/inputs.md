# 입력 컴포넌트

공용 입력 컴포넌트는 `@/shared/ui`에서 가져옵니다. 모든 입력칸은 같은 폴더의 `InputBase`를 기반으로 하며, 네이티브 `input` 속성·이벤트·`ref`를 그대로 전달할 수 있습니다. `InputBase`는 입력칸끼리 공유하는 내부 기반이라 외부에 공개하지 않습니다.

| 컴포넌트         | Figma              | 주요 props         | 용도                                     |
| ---------------- | ------------------ | ------------------ | ---------------------------------------- |
| `FilledInput`    | `Input_Color`      | `invalid`          | 어두운 배경 위의 배경이 채워진 입력칸    |
| `InfoField`      | `InfoField`        | `label`, `value`   | 라벨과 값을 보여주는 읽기 전용 정보 칸   |
| `InfoFieldInput` | `InfoField_Button` | `label`, `onClear` | 라벨이 붙은 수정용 정보 칸 (지우기 버튼) |
| `LineInput`      | `Input_Line`       | `action`           | 흰 배경(초대장 카드) 위의 테두리 입력칸  |

## 공통 규칙

- **접근 가능한 이름**: 화면에 라벨이 보이지 않는 입력칸(`FilledInput`, `LineInput`)은 `aria-label`을 전달하거나, 바깥 `label`과 `id`/`htmlFor`로 연결합니다. `InfoFieldInput`은 `label` 문구가 입력칸과 자동으로 연결됩니다.
- **에러 상태**: `invalid`를 전달하면 `aria-invalid`가 붙습니다. 현재 에러 모양은 `FilledInput`(빨간 테두리)에만 정의되어 있습니다. 에러 문구를 함께 보여줄 때는 문구 요소의 `id`를 입력칸의 `aria-describedby`로 연결합니다.
- **상태 관리**: 컴포넌트에는 상태가 없어 `use client`가 필요 없습니다. 서버 컴포넌트에서는 `defaultValue`로 쓰고, 값을 직접 관리할 때는 `'use client'` 컴포넌트에서 `value`와 `onChange`를 전달합니다.
- **크기**: 높이는 고정하지 않고 글자와 패딩으로 정합니다. 너비는 부모를 꽉 채우며, 필요하면 `className`으로 조정합니다.

## FilledInput

배경이 채워진 입력칸입니다. 에러 테두리가 생겨도 높이와 글자 위치가 바뀌지 않습니다.

```tsx
import { FilledInput } from '@/shared/ui';

// 기본: placeholder만 보이는 상태
<FilledInput aria-label='이름' placeholder='이름을 입력하세요.' />;

// 입력됨: 값이 들어간 상태 (서버 컴포넌트에서는 defaultValue)
<FilledInput aria-label='이름' defaultValue='스위프' />;

// 에러: 빨간 테두리 + aria-invalid, 에러 문구는 aria-describedby로 연결
<FilledInput
  aria-label='이름'
  value={name}
  onChange={handleNameChange}
  invalid
  aria-describedby='name-error'
/>;
<p id='name-error' className='caption-rg-12 text-text-error'>
  올바른 이름을 입력해 주세요.
</p>;
```

## InfoField / InfoFieldInput

마이페이지처럼 라벨과 값을 한 줄로 보여주는 칸입니다. 보기 모드는 `InfoField`, 수정 모드는 `InfoFieldInput`을 사용하며 두 컴포넌트는 같은 크기(4.7rem)와 배치를 가집니다.

```tsx
import { InfoField } from '@/shared/ui';

// 보기 모드 (dl/dt/dd로 렌더링)
<InfoField label='이름' value='스위프' />;
<InfoField label='정산정보' value='카카오뱅크 - 123456789123' />;
```

`onClear`를 전달하면 오른쪽에 지우기 버튼이 생깁니다. 버튼의 접근 가능한 이름은 `"{label} 지우기"`입니다. 지우기 동작은 사용하는 쪽에서 값을 비우도록 연결합니다.

```tsx
'use client';

import { useState } from 'react';

import { InfoFieldInput } from '@/shared/ui';

export const ProfileNameField = () => {
  const [name, setName] = useState('스위프');

  return (
    <InfoFieldInput
      label='이름'
      value={name}
      onChange={(event) => setName(event.target.value)}
      onClear={() => setName('')}
    />
  );
};
```

```tsx
// 지우기 버튼이 필요 없으면 onClear를 생략합니다. 높이는 같습니다.
<InfoFieldInput label='이메일' type='email' defaultValue='000000@naver.com' />
```

## LineInput

초대장 카드처럼 밝은 배경 위에서 쓰는 테두리 입력칸입니다. 오른쪽 버튼은 `action`으로 받으며, 캘린더·카메라처럼 시안의 파란 원형 버튼은 `IconButton`의 선택 상태로 표현합니다.

```tsx
import { CalendarIcon, CameraIcon } from '@/shared/assets';
import { IconButton, LineInput } from '@/shared/ui';

// 기본 / 입력됨
<LineInput aria-label='제목' placeholder='제목을 입력해주세요.' />;
<LineInput aria-label='장소' value={place} onChange={handlePlaceChange} />;

// 오른쪽 버튼 포함
<LineInput
  aria-label='일시'
  placeholder='날짜를 선택해주세요.'
  value={dateText}
  readOnly
  action={
    <IconButton
      aria-label='날짜 선택'
      icon={<CalendarIcon width={20} height={20} />}
      selected
      onClick={handleOpenCalendar}
    />
  }
/>;

<LineInput
  aria-label='제목'
  value={title}
  onChange={handleTitleChange}
  action={
    <IconButton
      aria-label='대표 사진 선택'
      icon={<CameraIcon width={20} height={20} />}
      selected
      onClick={handleOpenPhotoFrame}
    />
  }
/>;
```

## 미정 사항

- 포커스 상태: 시안에 없어 입력칸 모양은 바뀌지 않고 커서만 표시됩니다. 디자인이 정해지면 `focus-visible:` 스타일을 추가합니다.
- `LineInput`의 에러 모양: 시안에 없어 `invalid`를 전달해도 `aria-invalid`만 붙습니다.
- 라벨·필수 표시·에러 문구·글자 수 카운터를 묶은 입력 필드(`Input_Line/Header_1` 등)는 이 컴포넌트들을 조합해 별도로 구현합니다.
