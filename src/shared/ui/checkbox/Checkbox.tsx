import type { InputHTMLAttributes } from 'react';

import { cn } from '@/shared/utils/cn';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  className?: string;
}

export const Checkbox = ({ className, ...props }: CheckboxProps) => (
  <span className={cn('relative inline-flex size-[1.4rem] shrink-0', className)}>
    <input
      type='checkbox'
      className='peer absolute -inset-[0.5rem] cursor-pointer opacity-0 disabled:cursor-not-allowed'
      {...props}
    />
    <span
      aria-hidden='true'
      className='pointer-events-none size-full border border-brand-primary peer-checked:bg-brand-primary peer-focus-visible:outline-[0.2rem] peer-focus-visible:outline-offset-[0.2rem] peer-focus-visible:outline-brand-primary'
    />
  </span>
);
