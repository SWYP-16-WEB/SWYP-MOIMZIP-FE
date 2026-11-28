import type { ComponentProps, ReactNode } from 'react';

import { cn } from '@/shared/utils/cn';

import { InputBase } from './InputBase';

interface LineInputProps extends Omit<ComponentProps<typeof InputBase>, 'className'> {
  action?: ReactNode;
  className?: string;
}

export const LineInput = ({ action, className, ...props }: LineInputProps) => (
  <div
    className={cn(
      'flex w-full items-center gap-[0.8rem] rounded-[0.8rem] border-[0.15rem] border-bg-primary/20 px-[1.1rem] py-[0.4rem]',
      className,
    )}
  >
    <InputBase {...props} className='body-md-14 text-bg-primary placeholder:text-bg-primary/50' />
    {action ? <span className='inline-flex shrink-0'>{action}</span> : null}
  </div>
);
