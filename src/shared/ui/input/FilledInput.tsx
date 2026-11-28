import type { ComponentProps } from 'react';

import { cn } from '@/shared/utils/cn';

import { InputBase } from './InputBase';

export const FilledInput = ({ className, ...props }: ComponentProps<typeof InputBase>) => (
  <InputBase
    {...props}
    className={cn(
      'rounded-[1rem] border border-transparent bg-brand-primary/15 px-[1.9rem] py-[1.3rem] body-sb-16 text-text-white placeholder:text-text-white/50 aria-invalid:border-text-error',
      className,
    )}
  />
);
