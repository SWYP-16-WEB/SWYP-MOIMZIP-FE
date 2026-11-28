import type { ComponentPropsWithRef, ReactNode } from 'react';

import { cn } from '@/shared/utils/cn';

import { ButtonBase } from './ButtonBase';

type IconButtonVariant = 'filled' | 'plain';

interface IconButtonProps extends Omit<ComponentPropsWithRef<'button'>, 'aria-label' | 'children'> {
  'aria-label': string;
  icon: ReactNode;
  variant?: IconButtonVariant;
  selected?: boolean;
}

export const IconButton = ({
  icon,
  variant = 'filled',
  selected,
  className,
  ...props
}: IconButtonProps) => {
  const pressed = selected ?? props['aria-pressed'];
  const isSelected = pressed === true || pressed === 'true';

  return (
    <ButtonBase
      {...props}
      aria-pressed={pressed}
      className={cn(
        'size-[2.4rem] rounded-full text-text-white',
        variant === 'filled' && (isSelected ? 'bg-brand-secondary' : 'bg-bg-primary/60'),
        className,
      )}
    >
      <span aria-hidden='true' className='inline-flex items-center justify-center'>
        {icon}
      </span>
    </ButtonBase>
  );
};
