import type { ComponentPropsWithRef } from 'react';

import { cn } from '@/shared/utils/cn';

interface TextFieldInputProps extends Omit<
  ComponentPropsWithRef<'textarea'>,
  'className' | 'value' | 'maxLength' | 'rows'
> {
  // 현재 값. 글자 수 카운터와 높이를 계산하므로 value로만 받는다.
  value: string;
  // 최대 글자 수. 카운터 분모와 textarea의 maxLength에 함께 쓰인다.
  maxLength: number;
  invalid?: boolean;
  // 바깥 칸에 적용된다. (배치·여백 조정용)
  className?: string;
}

const TEXT_STYLE = 'col-start-1 row-start-1 caption-rg-12 whitespace-pre-wrap wrap-break-word';

/**
 * 어두운 배경의 테두리 입력칸 + 글자 수 카운터 (Figma: Input_Line_Black)
 * - 처음에는 한 줄(3.7rem)이고, 내용이 길어지거나 줄을 바꾸면 아래로 늘어난다.
 * - 높이는 같은 칸에 겹친 숨김 텍스트가 정한다. (JS 없이 동작하므로 'use client' 불필요)
 * - 카운터는 시각 정보라 aria-hidden 처리하고, 글자 수 제한은 maxLength로 전달한다.
 */
export const TextFieldInput = ({
  value,
  maxLength,
  invalid,
  placeholder,
  className,
  ...props
}: TextFieldInputProps) => (
  <div
    className={cn(
      'flex w-full items-end gap-[1rem] rounded-[1.5rem] border-[0.05rem] border-brand-primary bg-bg-primary px-[1.2rem] py-[0.9rem]',
      className,
    )}
  >
    <div className='grid min-w-0 flex-1'>
      {/* 높이 계산용: 마지막 줄바꿈도 높이에 반영되도록 끝에 공백을 붙인다. */}
      <span aria-hidden className={cn(TEXT_STYLE, 'invisible')}>
        {value || placeholder}{' '}
      </span>
      <textarea
        {...props}
        rows={1}
        value={value}
        maxLength={maxLength}
        placeholder={placeholder}
        aria-invalid={invalid || undefined}
        className={cn(
          TEXT_STYLE,
          'resize-none overflow-hidden bg-transparent text-text-white outline-none placeholder:text-text-white/50 disabled:cursor-not-allowed',
        )}
      />
    </div>
    <span aria-hidden className='shrink-0 caption-rg-10 text-text-white/50'>
      {value.length} / {maxLength}자
    </span>
  </div>
);
