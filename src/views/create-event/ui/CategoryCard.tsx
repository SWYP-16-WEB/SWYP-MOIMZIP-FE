import type { ComponentPropsWithRef, ReactNode } from 'react';

import { ButtonBase } from '@/shared/ui';
import { cn } from '@/shared/utils/cn';

interface CategoryCardProps extends ComponentPropsWithRef<'button'> {
  image: ReactNode;
  selected?: boolean;
}

export const CategoryCard = ({
  image,
  selected = false,
  className,
  children,
  ...props
}: CategoryCardProps) => (
  <ButtonBase
    {...props}
    aria-pressed={selected}
    className={cn(
      'h-[11.5rem] w-[16.7rem] max-w-full flex-col justify-start gap-[0.4rem] overflow-hidden rounded-[1rem] pt-[1rem]',
      selected ? 'bg-brand-primary text-bg-primary' : 'bg-brand-primary/10 text-text-white',
      className,
    )}
  >
    <span
      aria-hidden='true'
      className='inline-flex size-[7.6rem] shrink-0 items-center justify-center'
    >
      {image}
    </span>
    <span className='min-h-[2.5rem] w-full text-center body-md-14'>{children}</span>
  </ButtonBase>
);
