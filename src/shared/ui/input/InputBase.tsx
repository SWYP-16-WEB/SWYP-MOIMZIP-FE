import type { ComponentPropsWithRef } from 'react';

import { cn } from '@/shared/utils/cn';

interface InputBaseProps extends ComponentPropsWithRef<'input'> {
  invalid?: boolean;
}

export const InputBase = ({ invalid, type = 'text', className, ...props }: InputBaseProps) => (
  <input
    {...props}
    type={type}
    aria-invalid={invalid || undefined}
    className={cn(
      'w-full min-w-0 bg-transparent outline-none disabled:cursor-not-allowed',
      className,
    )}
  />
);
