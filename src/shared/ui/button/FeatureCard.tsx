import type { ComponentPropsWithRef, ReactNode } from 'react';

import { cn } from '@/shared/utils/cn';

import styles from './Button.module.css';
import { ButtonBase } from './ButtonBase';
import { SelectionIndicator } from './SelectionIndicator';

export interface FeatureCardProps extends ComponentPropsWithRef<'button'> {
  image: ReactNode;
  description: ReactNode;
  selected?: boolean;
}

export const FeatureCard = ({
  image,
  description,
  selected = false,
  className,
  children,
  ...props
}: FeatureCardProps) => (
  <ButtonBase
    {...props}
    aria-pressed={selected}
    className={cn(
      'h-[26.1rem] w-[16.7rem] max-w-full flex-col items-stretch justify-start overflow-hidden rounded-[1.5rem] px-[1.7rem] pb-[2rem] text-left',
      selected
        ? 'bg-brand-primary pt-[4.7rem] text-bg-primary'
        : [styles.glass, 'bg-brand-primary/15 pt-[4.4rem] text-text-white'],
      className,
    )}
  >
    <span aria-hidden='true' className='absolute top-[1.2rem] right-[1.1rem]'>
      <SelectionIndicator selected={selected} />
    </span>
    <span
      aria-hidden='true'
      className={cn(
        'inline-flex size-[11.35rem] shrink-0 items-center justify-center self-center',
        selected ? 'mb-[1.25rem]' : 'mb-[1.55rem]',
      )}
    >
      {image}
    </span>
    <span className='body-sb-16'>{children}</span>
    <span className='mt-[0.8rem] caption-rg-12 whitespace-pre-line'>{description}</span>
  </ButtonBase>
);
