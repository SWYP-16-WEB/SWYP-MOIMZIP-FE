import type { ComponentPropsWithRef } from 'react';

import { cn } from '@/shared/utils/cn';

interface TextFieldInputProps extends Omit<
  ComponentPropsWithRef<'textarea'>,
  'className' | 'value' | 'maxLength' | 'rows'
> {
  value: string;
  maxLength: number;
  invalid?: boolean;
  className?: string;
}

const TEXT_STYLE = 'col-start-1 row-start-1 caption-rg-12 whitespace-pre-wrap wrap-break-word';

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
