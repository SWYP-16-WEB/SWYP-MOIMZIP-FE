import type { ComponentProps } from 'react';

import { SmallXIcon } from '@/shared/assets';
import { IconButton } from '@/shared/ui/button';
import { cn } from '@/shared/utils/cn';

import { InputBase } from './InputBase';

interface InfoFieldInputProps extends Omit<ComponentProps<typeof InputBase>, 'className'> {
  label: string;
  // 지우기 버튼을 눌렀을 때 호출된다. 전달하지 않으면 지우기 버튼을 표시하지 않는다.
  onClear?: () => void;
  // 바깥 칸에 적용된다. (배치·여백 조정용)
  className?: string;
}

export const InfoFieldInput = ({ label, onClear, className, ...props }: InfoFieldInputProps) => (
  <div
    className={cn(
      'flex w-full items-center gap-[0.8rem] rounded-[1rem] bg-brand-primary/10 px-[1.6rem] py-[1.3rem]',
      className,
    )}
  >
    <label className='flex min-w-0 flex-1 items-center'>
      <span className='w-[5.7rem] shrink-0 caption-rg-12 text-text-white/50'>{label}</span>
      <InputBase {...props} className='body-md-14 text-text-white placeholder:text-text-white/50' />
    </label>
    {onClear ? (
      <IconButton
        variant='plain'
        aria-label={`${label} 지우기`}
        icon={<SmallXIcon focusable='false' />}
        onClick={onClear}
        className='my-[-0.15rem]'
      />
    ) : null}
  </div>
);
