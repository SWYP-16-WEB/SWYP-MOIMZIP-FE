import type { ComponentPropsWithRef } from 'react';

import { cn } from '@/shared/utils/cn';

import { ButtonBase } from './ButtonBase';
import { BUTTON_GLASS_CLASS_NAME } from './buttonStyles';

export type ButtonSize = 'large' | 'small';

export interface ButtonProps extends ComponentPropsWithRef<'button'> {
  size?: ButtonSize;
}

export const Button = ({ size = 'large', className, children, ...props }: ButtonProps) => (
  <ButtonBase
    {...props}
    className={cn(
      BUTTON_GLASS_CLASS_NAME,
      'max-w-full rounded-[1rem] bg-text-white/15 py-[1.4rem] text-center body-sb-16 text-text-white',
      size === 'large' ? 'px-[4.7rem]' : 'px-[2.4rem]',
      className,
    )}
  >
    {children}
  </ButtonBase>
);
