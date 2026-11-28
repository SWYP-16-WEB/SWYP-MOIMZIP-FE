import Link, { type LinkProps } from 'next/link';
import type { ReactNode } from 'react';

import { cn } from '@/shared/utils/cn';

import { BUTTON_FOCUS_CLASS_NAME } from '../button/buttonStyles';

type ListCardTone = 'lime' | 'secondary';

interface ListCardProps {
  title: string;
  description: string;
  badge: string;
  tone?: ListCardTone;
  leading?: ReactNode;
  href?: LinkProps['href'];
  className?: string;
}

const TONE_STYLE: Record<ListCardTone, { card: string; badge: string }> = {
  lime: { card: 'bg-brand-lime/15', badge: 'bg-brand-lime' },
  secondary: { card: 'bg-brand-primary/15', badge: 'bg-brand-secondary' },
};

export const ListCard = ({
  title,
  description,
  badge,
  tone = 'lime',
  leading,
  href,
  className,
}: ListCardProps) => {
  const hasLeading = Boolean(leading);
  const cardClassName = cn(
    'flex h-[8.2rem] w-full rounded-[1rem] pr-[1.4rem]',
    hasLeading ? 'pl-[1.4rem]' : 'pl-[1.7rem]',
    TONE_STYLE[tone].card,
    className,
  );

  const content = (
    <>
      {hasLeading ? (
        <div className='mr-[1.6rem] flex size-[6rem] shrink-0 items-center justify-center self-center overflow-hidden rounded-full bg-bg-primary'>
          {leading}
        </div>
      ) : null}
      <div
        className={cn(
          'flex min-w-0 flex-1 flex-col justify-between pt-[1.5rem]',
          hasLeading ? 'pb-[1.6rem]' : 'pb-[1.3rem]',
        )}
      >
        <div className='flex items-center gap-[1rem]'>
          <p
            className={cn(
              'min-w-0 flex-1 truncate text-text-white',
              hasLeading ? 'body-md-14' : 'body-sb-16',
            )}
          >
            {title}
          </p>
          <span
            className={cn(
              'shrink-0 rounded-[4.7rem] px-[1rem] py-[0.4rem] caption-sb-12 text-bg-primary',
              TONE_STYLE[tone].badge,
            )}
          >
            {badge}
          </span>
        </div>
        <p
          className={cn(
            'truncate text-text-white/70',
            hasLeading ? 'caption-rg-10' : 'caption-rg-12',
          )}
        >
          {description}
        </p>
      </div>
    </>
  );

  return href ? (
    <Link href={href} className={cn(BUTTON_FOCUS_CLASS_NAME, cardClassName)}>
      {content}
    </Link>
  ) : (
    <div className={cardClassName}>{content}</div>
  );
};
