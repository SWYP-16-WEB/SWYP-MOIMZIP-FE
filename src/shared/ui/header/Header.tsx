import type { ComponentPropsWithRef, MouseEventHandler } from 'react';

import { BackIcon, LogoIcon, UserIcon } from '@/shared/assets';
import { cn } from '@/shared/utils/cn';

import { ButtonBase } from '../button';

type HeaderElementProps = Omit<ComponentPropsWithRef<'header'>, 'children'>;

interface BackHeaderProps extends HeaderElementProps {
  variant: 'back-logo' | 'back';
  onBack: MouseEventHandler<HTMLButtonElement>;
  onMyPage?: never;
}

interface UserHeaderProps extends HeaderElementProps {
  variant: 'logo-user';
  onMyPage?: MouseEventHandler<HTMLButtonElement>;
  onBack?: never;
}

type HeaderProps = BackHeaderProps | UserHeaderProps;

export const Header = ({ variant, onBack, onMyPage, className, ...props }: HeaderProps) => (
  <header
    {...props}
    className={cn(
      'grid h-[2.4rem] w-full grid-cols-[2.4rem_minmax(0,1fr)_2.4rem] items-center',
      className,
    )}
  >
    {variant === 'logo-user' ? (
      <span aria-hidden='true' />
    ) : (
      <ButtonBase aria-label='뒤로가기' onClick={onBack} className='size-[2.4rem] text-text-white'>
        <BackIcon aria-hidden='true' focusable='false' />
      </ButtonBase>
    )}
    {variant === 'back' ? (
      <span aria-hidden='true' />
    ) : (
      <LogoIcon
        role='img'
        aria-label='모임집'
        focusable='false'
        className={cn(
          'h-[2.2815rem] w-[6.8497rem] translate-x-[0.025rem] justify-self-center text-brand-primary',
          variant === 'back-logo' ? 'translate-y-[0.02rem] self-start' : 'translate-y-[0.041rem]',
        )}
      />
    )}
    {variant === 'logo-user' ? (
      <ButtonBase
        aria-label='마이페이지'
        onClick={onMyPage}
        className='size-[2.4rem] text-text-white'
      >
        <UserIcon aria-hidden='true' focusable='false' />
      </ButtonBase>
    ) : (
      <span aria-hidden='true' />
    )}
  </header>
);
