# 디자인 토큰

## 기준

- 디자인 시스템의 컬러·텍스트 스타일을 기준으로 합니다.
- 컬러는 `src/styles/color.token.css`, 폰트 패밀리·타이포그래피는 `src/styles/font.token.css`에서 관리합니다. 두 파일 모두 `globals.css`에서 불러옵니다.
- Tailwind CSS 4의 `@theme`로 컬러를, `@theme inline`으로 폰트 패밀리를, `@utility`로 타이포그래피를 연결합니다.
- 루트 `62.5%`는 유지합니다. 기본 브라우저 폰트가 16px일 때 `1rem = 10px`이며, 사용자가 기본 글자 크기를 바꾸면 함께 확대됩니다.
- 크기·간격·둥글기는 기존 컨벤션대로 rem 임의값을 사용합니다. 디자인 시스템의 타이포그래피는 아래 조합 유틸리티를 사용합니다.

## 컬러

`color.token.css`의 현재 토큰명을 기준으로 사용합니다.

| 디자인 스타일      | CSS 토큰                  | 값        | 사용 예시                |
| ------------------ | ------------------------- | --------- | ------------------------ |
| Brand/Primary      | `--color-brand-primary`   | `#A7C5FB` | `bg-brand-primary`       |
| Brand/Secondary    | `--color-brand-secondary` | `#80ABF9` | `border-brand-secondary` |
| Brand/Lime         | `--color-brand-lime`      | `#DAF99D` | `bg-brand-lime`          |
| Brand/Light        | `--color-brand-light`     | `#F4F4F4` | `bg-brand-light`         |
| Text/White         | `--color-text-white`      | `#FFFFFF` | `text-text-white`        |
| Background/Primary | `--color-bg-primary`      | `#081412` | `bg-bg-primary`          |

`--color-calendar-shadow`는 캘린더 내부 그림자용 검정 20%(`rgb(0 0 0 / 20%)`) 토큰입니다.

토큰 이름의 `brand-*`는 브랜드 컬러, `text-*`는 텍스트 컬러, `bg-*`는 배경 컬러의 역할을 나타냅니다.

Tailwind 클래스는 **속성 접두사 + `--color-` 뒤의 토큰 이름**으로 작성합니다. 따라서 `--color-bg-primary`의 배경색 클래스는 `bg-bg-primary`, `--color-text-white`의 텍스트색 클래스는 `text-text-white`입니다.

```tsx
<section className='bg-bg-primary text-text-white'>
  <h1 className='title-b-24'>모임 준비하기</h1>
  <p className='body-md-14 text-brand-primary'>모임을 함께 준비해 보세요.</p>
</section>
```

컬러는 `bg-*`, `text-*`, `border-*` 등 필요한 속성에서 사용할 수 있습니다. 토큰의 역할과 화면의 용도에 맞춰 선택합니다.

## 폰트

- Pretendard Variable v1.3.9를 `next/font/local`로 로드합니다.
- 폰트 파일과 SIL Open Font License는 `src/app/fonts/`에 함께 보관합니다.
- 루트 레이아웃에서 `--font-pretendard`를 등록하고 `font-sans`로 연결해 본문에 적용합니다.
- 로컬 폰트는 앱에서 직접 제공하며, 런타임에 외부 폰트 CDN을 요청하지 않습니다.
- 웨이트 범위는 원본의 `45 920`, 표시 정책은 `swap`입니다.
- [폰트 원본](https://github.com/orioncactus/pretendard/blob/v1.3.9/packages/pretendard/dist/web/variable/woff2/PretendardVariable.woff2)

## 타이포그래피

글자 크기·굵기·행간·자간을 한 클래스에 묶었습니다. 모든 스타일의 자간은 0이고, 행간은 단위 없는 `1.5`로 글자 크기의 150%를 적용합니다.

클래스 이름은 `<역할>-<굵기>-<px 크기>`입니다. `b`는 Bold, `sb`는 SemiBold, `md`는 Medium, `rg`는 Regular를 뜻합니다. 이름의 숫자는 디자인 기준 px이며 실제 CSS 글자 크기는 rem으로 정의합니다.

| 디자인 스타일     | 클래스          | 글자 크기 | 굵기 | 행간 |
| ----------------- | --------------- | --------- | ---- | ---- |
| head - bold 28    | `head-b-28`     | `2.8rem`  | 700  | 150% |
| title1 - bold 24  | `title-b-24`    | `2.4rem`  | 700  | 150% |
| title2 - sb 20    | `title-sb-20`   | `2rem`    | 600  | 150% |
| title2 - bold 20  | `title-b-20`    | `2rem`    | 700  | 150% |
| body1 - sb 16     | `body-sb-16`    | `1.6rem`  | 600  | 150% |
| body2 - med 14    | `body-md-14`    | `1.4rem`  | 500  | 150% |
| caption1 - reg 12 | `caption-rg-12` | `1.2rem`  | 400  | 150% |
| caption2 - sb 12  | `caption-sb-12` | `1.2rem`  | 600  | 150% |
| caption3 - reg 10 | `caption-rg-10` | `1rem`    | 400  | 150% |

Caption2의 보조 설명에는 regular로 적혀 있지만 실제 연결된 스타일은 SemiBold 600이므로 실제 스타일 값을 따릅니다.

```tsx
<h1 className='title-b-24'>모임 준비하기</h1>

<p className='body-md-14'>모임을 함께 준비해 보세요.</p>

<span className='caption-rg-12 md:body-sb-16'>화면 너비에 따라 변경되는 텍스트</span>
```

`@utility`로 정의해 `md:`, `hover:`, `focus:` 등 Tailwind variant와 함께 사용할 수 있습니다. 기존 `--font-size-*`, `--line-height-*` 변수와 이를 참조하는 클래스 대신 위 유틸리티를 사용합니다. `text-sm`, `text-xl` 등 기본 글자 크기 스케일은 사용하지 않습니다.

```tsx
<button type='button' className='rounded-[1rem] bg-brand-primary px-[3rem] py-[1.6rem] body-sb-16'>
  초대장 만들기
</button>
```

## 클래스 병합

조건부 클래스 또는 외부 `className` 병합은 `@/shared/utils/cn`을 사용합니다. `cn`에 타이포그래피 그룹을 등록해 같은 variant 안에서는 뒤에 지정한 타이포그래피가 앞의 타이포그래피를 대체합니다.

```tsx
cn('body-md-14', 'title-b-24'); // 'title-b-24'
cn('body-md-14', 'md:title-b-24'); // 두 클래스 모두 유지
```

기본 타이포그래피의 일부 속성만 변경하려면 `cn('body-md-14', 'font-bold')`처럼 개별 유틸리티를 뒤에 지정합니다. 새 타이포그래피가 추가되면 `font.token.css`, `cn`의 타이포그래피 그룹, 이 문서의 표를 함께 갱신합니다.
