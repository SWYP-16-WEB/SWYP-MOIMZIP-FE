import Image from 'next/image';
import type { ComponentPropsWithRef } from 'react';

import { cn } from '@/shared/utils/cn';

import { ButtonBase } from './ButtonBase';
import { SelectionIndicator } from './SelectionIndicator';

export type IconButtonVariant = 'plain' | 'filled' | 'check';
export type IconButtonIcon = 'calendar' | 'camera';

export interface IconButtonProps extends Omit<ComponentPropsWithRef<'button'>, 'aria-label'> {
  'aria-label': string;
  variant?: IconButtonVariant;
  icon?: IconButtonIcon;
  selected?: boolean;
}

export const IconButton = ({
  variant = 'plain',
  icon,
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
    ) : icon ? (
      <Image
        src={`/images/buttons/${icon}-${selected ? 'selected' : 'unselected'}.svg`}
        alt=''
        width={24}
        height={24}
        aria-hidden='true'
        draggable={false}
      />
    ) : (
      <span aria-hidden='true' className='inline-flex items-center justify-center'>
        {children}
      </span>
    )}
  </ButtonBase>
);
