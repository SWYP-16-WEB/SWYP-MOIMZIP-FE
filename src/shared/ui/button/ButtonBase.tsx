import type { ComponentPropsWithRef } from 'react';

import { cn } from '@/shared/utils/cn';

import { BUTTON_FOCUS_CLASS_NAME } from './buttonStyles';

type ButtonBaseProps = ComponentPropsWithRef<'button'>;

export const ButtonBase = ({ type = 'button', className, ...props }: ButtonBaseProps) => (
  <button
    {...props}
    type={type === 'submit' ? 'submit' : type === 'reset' ? 'reset' : 'button'}
    className={cn(
      BUTTON_FOCUS_CLASS_NAME,
      'relative inline-flex shrink-0 cursor-pointer items-center justify-center select-none disabled:cursor-not-allowed disabled:opacity-40',
      className,
    )}
  />
);
