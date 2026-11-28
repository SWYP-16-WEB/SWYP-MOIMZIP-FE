'use client';

import type { ComponentPropsWithRef } from 'react';

import { BackIcon, NextIcon } from '@/shared/assets';
import { cn } from '@/shared/utils/cn';

import { IconButton } from '../button';
import * as datePickerUtils from './datePickerUtils';
import { useDatePicker } from './useDatePicker';

// Figma의 GLASS 굴절 효과는 배경 블러와 안쪽 하이라이트로 근사한다.
const GLASS_CLASS_NAME = 'inset-ring-[0.05rem] inset-ring-text-white/15';

interface DatePickerProps extends Omit<
  ComponentPropsWithRef<'div'>,
  'onChange' | 'defaultValue' | 'children'
> {
  // 모든 날짜는 시간대가 없는 YYYY-MM-DD 형식으로 전달한다.
  value: string | null;
  onChange: (date: string) => void;
  // 최초 선택값이 없을 때 사용할 월을 명시하여 서버·브라우저의 초기 출력을 맞춘다.
  defaultMonth: string;
  minDate?: string;
  maxDate?: string;
  disabled?: boolean;
}

export const DatePicker = ({
  value: valueString,
  onChange,
  defaultMonth,
  minDate: minDateString,
  maxDate: maxDateString,
  disabled = false,
  className,
  'aria-label': ariaLabel = '날짜 선택',
  ...props
}: DatePickerProps) => {
  const {
    month,
    weeks,
    selectedKey,
    tabDateKey,
    headingId,
    hasPreviousMonth,
    hasNextMonth,
    hasDisabledDate,
    setFocusedDate,
    handleMonthChange,
    handleDateKeyDown,
    setDateButton,
  } = useDatePicker({
    value: valueString,
    defaultMonth,
    minDate: minDateString,
    maxDate: maxDateString,
  });

  return (
    <div
      {...props}
      role={props.role ?? 'group'}
      aria-label={ariaLabel}
      className={cn(
        GLASS_CLASS_NAME,
        'w-[24.3rem] max-w-full rounded-[0.8rem] bg-bg-primary/40 px-[0.9rem] pt-[1rem] pb-[0.4rem] text-text-white shadow-[inset_0_0_0.6rem_var(--color-calendar-shadow)] backdrop-blur-[0.7rem]',
        className,
      )}
    >
      <div className='mb-[1rem] flex h-[2.1rem] items-center justify-between pr-[0.6rem]'>
        <span
          id={headingId}
          aria-live='polite'
          aria-atomic='true'
          className={cn(
            GLASS_CLASS_NAME,
            'rounded-[1.2rem] bg-bg-primary/40 px-[0.8rem] py-[0.3rem] caption-rg-10 backdrop-blur-[0.4rem]',
          )}
        >
          <span className='sr-only'>{ariaLabel} </span>
          {datePickerUtils.getMonthLabel(month)}
        </span>
        <div className='flex gap-[1.2rem]'>
          <IconButton
            aria-label='이전 달'
            disabled={disabled || !hasPreviousMonth}
            onClick={() => handleMonthChange(-1)}
            icon={<BackIcon className='size-[2rem]' focusable='false' />}
            className={cn(GLASS_CLASS_NAME, 'size-[2rem] bg-bg-primary/40 backdrop-blur-[0.4rem]')}
          />
          <IconButton
            aria-label='다음 달'
            disabled={disabled || !hasNextMonth}
            onClick={() => handleMonthChange(1)}
            icon={<NextIcon className='size-[2rem]' focusable='false' />}
            className={cn(GLASS_CLASS_NAME, 'size-[2rem] bg-bg-primary/40 backdrop-blur-[0.4rem]')}
          />
        </div>
      </div>
      <table role='grid' aria-labelledby={headingId} className='w-full table-fixed border-collapse'>
        <thead>
          <tr>
            {datePickerUtils.WEEKDAY_LABELS.map((label, weekday) => (
              <th
                key={label}
                scope='col'
                aria-label={`${datePickerUtils.WEEKDAYS[weekday]}요일`}
                className='h-[2.6rem] pb-[0.6rem] text-center caption-md-7 text-text-white/70'
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map(({ key, days }) => (
            <tr key={key}>
              {days.map(({ key: dateKey, date }) => (
                <td
                  key={dateKey}
                  aria-selected={date ? dateKey === selectedKey : undefined}
                  aria-disabled={date ? disabled || hasDisabledDate(date) : undefined}
                  className='h-[2.5rem] p-0 text-center [tr:last-child_&]:h-[2rem]'
                >
                  {date ? (
                    <button
                      ref={(element) => setDateButton(dateKey, element)}
                      type='button'
                      tabIndex={dateKey === tabDateKey ? 0 : -1}
                      aria-label={datePickerUtils.getDateLabel(date)}
                      disabled={disabled || hasDisabledDate(date)}
                      onFocus={() => setFocusedDate(date)}
                      onClick={() => onChange(datePickerUtils.getDateKey(date))}
                      onKeyDown={(event) => handleDateKeyDown(event, date)}
                      className='group/date flex w-full cursor-pointer items-center justify-center rounded-full focus-visible:outline-none disabled:cursor-not-allowed'
                    >
                      <span
                        className={cn(
                          'flex size-[2rem] items-center justify-center rounded-full caption-rg-10',
                          dateKey === selectedKey
                            ? 'bg-text-white text-bg-primary group-disabled/date:text-bg-primary/50'
                            : 'text-text-white group-disabled/date:text-text-white/50',
                          'in-focus-visible:outline-[0.2rem] in-focus-visible:outline-offset-[0.2rem] in-focus-visible:outline-brand-secondary',
                        )}
                      >
                        {date.getUTCDate()}
                      </span>
                    </button>
                  ) : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
