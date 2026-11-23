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
      'min-h-[26.1rem] w-[17.5rem] max-w-full flex-col items-stretch justify-start overflow-hidden rounded-[1.5rem] px-[1.2rem] pt-[4.4rem] pb-[2rem] text-left',
      selected
        ? 'bg-brand-primary text-bg-primary'
        : [styles.glass, 'bg-brand-primary/15 text-text-white'],
      className,
    )}
  >
    <span aria-hidden='true' className='absolute top-[1.2rem] right-[1.1rem]'>
      <SelectionIndicator selected={selected} />
    </span>
    <span
      aria-hidden='true'
      className='mb-[1.55rem] inline-flex size-[11.35rem] shrink-0 items-center justify-center self-center'
    >
      {image}
    </span>
    <span className='body-sb-16'>{children}</span>
    <span className='mt-[0.8rem] caption-rg-12 whitespace-pre-wrap'>{description}</span>
  </ButtonBase>
);
