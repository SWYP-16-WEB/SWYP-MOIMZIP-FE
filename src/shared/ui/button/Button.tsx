import type { ComponentPropsWithRef } from 'react';

import { cn } from '@/shared/utils/cn';

import styles from './Button.module.css';
import { ButtonBase } from './ButtonBase';

export type ButtonSize = 'large' | 'small';

export interface ButtonProps extends ComponentPropsWithRef<'button'> {
  size?: ButtonSize;
}

export const Button = ({ size = 'large', className, children, ...props }: ButtonProps) => (
  <ButtonBase
    {...props}
    className={cn(
      styles.glass,
      'min-h-[5.2rem] rounded-[1rem] bg-text-white/15 px-[4.7rem] py-[1.4rem] text-center body-sb-16 text-text-white',
      size === 'large' ? 'w-full' : 'w-[16.7rem] max-w-full',
      className,
    )}
  >
    {children}
  </ButtonBase>
);
