import type { ComponentPropsWithRef } from 'react';

import { cn } from '@/shared/utils/cn';

import { ButtonBase } from './ButtonBase';

type PrimaryButtonSize = 'large' | 'small';

interface PrimaryButtonProps extends ComponentPropsWithRef<'button'> {
  size?: PrimaryButtonSize;
}

export const PrimaryButton = ({
  size = 'large',
  className,
  children,
  ...props
}: PrimaryButtonProps) => (
  <ButtonBase
    {...props}
    className={cn(
      'glass',
      'max-w-full rounded-[1rem] bg-text-white/15 py-[1.4rem] text-center body-sb-16 text-text-white',
      size === 'large' ? 'px-[4.7rem]' : 'px-[2.4rem]',
      className,
    )}
  >
    {children}
  </ButtonBase>
);
