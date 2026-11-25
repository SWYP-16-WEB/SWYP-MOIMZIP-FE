import type { ComponentPropsWithRef } from 'react';

import { ArrowRightUpIcon } from '@/shared/assets';
import { cn } from '@/shared/utils/cn';

import { BUTTON_FOCUS_CLASS_NAME } from './buttonStyles';

export interface LinkButtonProps extends ComponentPropsWithRef<'a'> {
  href: string;
}

export const LinkButton = ({ className, children, target, rel, ...props }: LinkButtonProps) => (
  <a
    {...props}
    target={target}
    rel={target === '_blank' ? `${rel ?? ''} noopener noreferrer`.trim() : rel}
    className={cn(
      BUTTON_FOCUS_CLASS_NAME,
      'relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-[0.2rem] rounded-[2.8rem] bg-text-white py-[0.4rem] pr-[1rem] pl-[1.5rem] caption-sb-12 text-brand-secondary',
      className,
    )}
  >
    {children}
    <ArrowRightUpIcon aria-hidden='true' focusable='false' />
  </a>
);
