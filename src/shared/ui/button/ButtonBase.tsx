import type { ComponentPropsWithRef } from 'react';

import { cn } from '@/shared/utils/cn';

interface NativeButtonBaseProps extends ComponentPropsWithRef<'button'> {
  as?: 'button';
}

interface AnchorButtonBaseProps extends ComponentPropsWithRef<'a'> {
  as: 'a';
  disabled?: boolean;
}

export type ButtonBaseProps = NativeButtonBaseProps | AnchorButtonBaseProps;

const BASE_CLASS_NAME =
  'relative inline-flex shrink-0 items-center justify-center cursor-pointer select-none focus-visible:outline-[0.2rem] focus-visible:outline-offset-[0.3rem] focus-visible:outline-brand-secondary disabled:cursor-not-allowed disabled:opacity-40 aria-disabled:cursor-not-allowed aria-disabled:opacity-40';

export const ButtonBase = (props: ButtonBaseProps) => {
  if (props.as === 'a') {
    const { as: _as, disabled = false, className, href, onClick, tabIndex, ...anchorProps } = props;

    return (
      <a
        {...anchorProps}
        href={disabled ? undefined : href}
        aria-disabled={disabled ? true : anchorProps['aria-disabled']}
        tabIndex={disabled ? -1 : tabIndex}
        onClick={disabled ? undefined : onClick}
        className={cn(BASE_CLASS_NAME, className)}
      />
    );
  }

  const { as: _as, type = 'button', className, ...buttonProps } = props;

  return (
    <button
      {...buttonProps}
      type={type === 'submit' ? 'submit' : type === 'reset' ? 'reset' : 'button'}
      className={cn(BASE_CLASS_NAME, className)}
    />
  );
};
