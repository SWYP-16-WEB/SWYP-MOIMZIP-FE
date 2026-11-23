import type { ComponentPropsWithRef } from 'react';

import { cn } from '@/shared/utils/cn';

import { ButtonBase } from './ButtonBase';

export type TextButtonVariant = 'blue' | 'lime';

export interface TextButtonProps extends ComponentPropsWithRef<'button'> {
  variant?: TextButtonVariant;
}

export const TextButton = ({
  variant = 'blue',
  className,
  children,
  ...props
}: TextButtonProps) => (
  <ButtonBase
    {...props}
    className={cn(
      'rounded-[4.7rem] px-[1rem] py-[0.4rem] caption-sb-12 text-bg-primary',
      variant === 'blue' ? 'bg-brand-secondary' : 'bg-brand-lime',
      className,
    )}
  >
    {children}
  </ButtonBase>
);
