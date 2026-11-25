import type { ComponentPropsWithRef } from 'react';

import { KakaoIcon } from '@/shared/assets';
import { ButtonBase } from '@/shared/ui';
import { cn } from '@/shared/utils/cn';

interface KakaoLoginButtonProps extends ComponentPropsWithRef<'button'> {
  children?: string;
}

export const KakaoLoginButton = ({
  className,
  children = '카카오 계정으로 로그인',
  ...props
}: KakaoLoginButtonProps) => (
  <ButtonBase
    {...props}
    className={cn(
      'min-h-[5.2rem] w-full gap-[0.5rem] rounded-[1rem] bg-kakao-background px-[2rem] py-[1.4rem] body-sb-16 text-bg-primary',
      className,
    )}
  >
    <KakaoIcon aria-hidden='true' focusable='false' />
    <span>{children}</span>
  </ButtonBase>
);
