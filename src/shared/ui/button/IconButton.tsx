import type { ComponentPropsWithRef } from 'react';

import { cn } from '@/shared/utils/cn';

import { ButtonBase } from './ButtonBase';
import { SelectionIndicator } from './SelectionIndicator';

export type IconButtonVariant = 'plain' | 'filled' | 'check';

export interface IconButtonProps extends Omit<ComponentPropsWithRef<'button'>, 'aria-label'> {
  'aria-label': string;
  variant?: IconButtonVariant;
  selected?: boolean;
}

export const IconButton = ({
  variant = 'plain',
  selected,
  className,
  children,
  ...props
}: IconButtonProps) => (
  <ButtonBase
    {...props}
    aria-pressed={selected ?? props['aria-pressed']}
    className={cn(
      'rounded-full',
      variant === 'check' ? 'size-[2.5rem]' : 'size-[2.4rem]',
      variant === 'filled'
        ? selected
          ? 'bg-brand-secondary text-text-white'
          : 'bg-bg-primary text-text-white'
        : 'text-text-white',
      className,
    )}
  >
    {variant === 'check' ? (
      <SelectionIndicator selected={selected ?? false} />
    ) : (
      <span aria-hidden='true' className='inline-flex items-center justify-center'>
        {children}
      </span>
    )}
  </ButtonBase>
);
