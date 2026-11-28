import type { ReactNode } from 'react';

import { cn } from '@/shared/utils/cn';

type ListCardTone = 'lime' | 'secondary';

interface ListCardProps {
  title: string;
  description: string;
  // 오른쪽 위 뱃지 문구 (예: 진행중·완료, 참석·불참석)
  badge: string;
  // 카드 배경과 뱃지 색. lime은 진행중·참석, secondary는 완료·불참석처럼 쓴다.
  tone?: ListCardTone;
  // 왼쪽 원 안에 들어갈 이미지·아이콘. 전달하면 원이 생기고 글자가 한 단계 작아진다.
  leading?: ReactNode;
  className?: string;
}

const TONE_STYLE: Record<ListCardTone, { card: string; badge: string }> = {
  lime: { card: 'bg-brand-lime/15', badge: 'bg-brand-lime' },
  secondary: { card: 'bg-brand-primary/15', badge: 'bg-brand-secondary' },
};

/**
 * 목록 한 줄 카드 (Figma: EventListCard, StatusListCard)
 * - leading이 있으면 이미지형(EventListCard), 없으면 텍스트형(StatusListCard) 배치를 사용한다.
 * - 이미지형은 원(6rem)이 자리를 차지하므로 제목·설명 글자를 한 단계 작게 쓴다.
 */
export const ListCard = ({
  title,
  description,
  badge,
  tone = 'lime',
  leading,
  className,
}: ListCardProps) => {
  const hasLeading = Boolean(leading);

  return (
    <div
      className={cn(
        'flex h-[8.2rem] w-full rounded-[1rem] pr-[1.4rem]',
        hasLeading ? 'pl-[1.4rem]' : 'pl-[1.7rem]',
        TONE_STYLE[tone].card,
        className,
      )}
    >
      {hasLeading ? (
        <div className='mr-[1.6rem] flex size-[6rem] shrink-0 items-center justify-center self-center overflow-hidden rounded-full bg-bg-primary'>
          {leading}
        </div>
      ) : null}
      <div
        className={cn(
          'flex min-w-0 flex-1 flex-col justify-between',
          hasLeading ? 'pt-[1.7rem] pb-[1.6rem]' : 'pt-[1.6rem] pb-[1.3rem]',
        )}
      >
        <p className={cn('truncate text-text-white', hasLeading ? 'body-md-14' : 'body-sb-16')}>
          {title}
        </p>
        <p
          className={cn(
            'truncate text-text-white/70',
            hasLeading ? 'caption-rg-10' : 'caption-rg-12',
          )}
        >
          {description}
        </p>
      </div>
      <span
        className={cn(
          'mt-[1.5rem] ml-[1rem] shrink-0 self-start rounded-[4.7rem] px-[1rem] py-[0.4rem] caption-sb-12 text-bg-primary',
          TONE_STYLE[tone].badge,
        )}
      >
        {badge}
      </span>
    </div>
  );
};
