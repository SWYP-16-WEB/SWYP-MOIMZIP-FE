import type { ComponentPropsWithRef } from 'react';

import { ArrowRightUpIcon } from '@/shared/assets';
import { cn } from '@/shared/utils/cn';

import { ButtonBase } from './ButtonBase';

export interface LinkButtonProps extends ComponentPropsWithRef<'a'> {
  href: string;
}

export const LinkButton = ({ className, children, ...props }: LinkButtonProps) => (
  <ButtonBase
    {...props}
    as='a'
    className={cn(
      'min-h-[2.6rem] gap-[0.2rem] rounded-[2.8rem] bg-text-white py-[0.4rem] pr-[1rem] pl-[1.5rem] caption-sb-12 text-brand-secondary',
      className,
    )}
  >
    {children}
    <ArrowRightUpIcon aria-hidden='true' focusable='false' />
  </ButtonBase>
);
