'use client';

import type { ComponentPropsWithRef, KeyboardEvent } from 'react';
import { useId, useRef, useState } from 'react';

import { BackIcon, NextIcon } from '@/shared/assets';
import { cn } from '@/shared/utils/cn';

import {
  clampDate,
  createDate,
  getDateKey,
  getMonthLabel,
  getMonthStart,
  getMonthWeeks,
  hasSameMonth,
  hasSelectableDate,
  parseDate,
  shiftDate,
  shiftMonth,
  WEEKDAY_LABELS,
  WEEKDAYS,
} from './datePickerUtils';

const FOCUS_CLASS_NAME =
  'focus-visible:outline-[0.2rem] focus-visible:outline-offset-[0.2rem] focus-visible:outline-brand-secondary';

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
  const value = valueString === null ? null : parseDate(valueString);
  const initialMonth = parseDate(defaultMonth);
  // 공개 날짜 형식이 지원하는 0001~9999년 밖으로 이동하지 않게 한다.
  const minDate = parseDate(minDateString ?? '0001-01-01');
  const maxDate = parseDate(maxDateString ?? '9999-12-31');
  if (minDate > maxDate) {
    throw new RangeError('DatePicker의 minDate는 maxDate보다 늦을 수 없습니다.');
  }
  const [requestedMonth, setMonth] = useState(() =>
    getMonthStart(clampDate(value ?? initialMonth, minDate, maxDate)),
  );
  const month = getMonthStart(clampDate(requestedMonth, minDate, maxDate));
  const [focusedDate, setFocusedDate] = useState<Date | null>(null);
  const dateButtons = useRef(new Map<string, HTMLButtonElement>());
  const headingId = useId();
  const weeks = getMonthWeeks(month);
  const selectedKey = value ? getDateKey(value) : null;
  const availableDates = weeks.flatMap(({ days }) =>
    days.flatMap(({ date }) => (date && hasSelectableDate(date, minDate, maxDate) ? [date] : [])),
  );
  const tabDate = [focusedDate, value, availableDates[0]].find(
    (date) => date && hasSameMonth(date, month) && hasSelectableDate(date, minDate, maxDate),
  );
  const tabDateKey = tabDate ? getDateKey(tabDate) : null;

  const hasAvailableMonth = (direction: number) => {
    const candidate = shiftMonth(month, direction);
    const first = getMonthStart(candidate);
    const last = createDate(candidate.getUTCFullYear(), candidate.getUTCMonth() + 1, 0);
    return last >= minDate && first <= maxDate;
  };

  const handleMonthChange = (direction: number) => {
    setMonth(getMonthStart(shiftMonth(month, direction)));
    setFocusedDate(null);
  };

  const handleDateKeyDown = (event: KeyboardEvent<HTMLButtonElement>, date: Date) => {
    const movements: Record<string, () => Date> = {
      ArrowLeft: () => shiftDate(date, -1),
      ArrowRight: () => shiftDate(date, 1),
      ArrowUp: () => shiftDate(date, -7),
      ArrowDown: () => shiftDate(date, 7),
      Home: () => shiftDate(date, -date.getUTCDay()),
      End: () => shiftDate(date, 6 - date.getUTCDay()),
      PageUp: () => shiftMonth(date, event.shiftKey ? -12 : -1),
      PageDown: () => shiftMonth(date, event.shiftKey ? 12 : 1),
    };
    const nextDate = movements[event.key]?.();
    if (!nextDate) return;
    event.preventDefault();
    const target = clampDate(nextDate, minDate, maxDate);
    setFocusedDate(target);
    setMonth(getMonthStart(target));
    // 월이 바뀌어 새 버튼이 마운트된 다음 포커스를 옮긴다.
    requestAnimationFrame(() => dateButtons.current.get(getDateKey(target))?.focus());
  };

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
          {getMonthLabel(month)}
        </span>
        <div className='flex gap-[1.2rem]'>
          <button
            type='button'
            aria-label='이전 달'
            disabled={disabled || !hasAvailableMonth(-1)}
            onClick={() => handleMonthChange(-1)}
            className={cn(
              FOCUS_CLASS_NAME,
              GLASS_CLASS_NAME,
              'flex size-[2rem] cursor-pointer items-center justify-center rounded-full bg-bg-primary/40 backdrop-blur-[0.4rem] disabled:cursor-not-allowed disabled:opacity-40',
            )}
          >
            <BackIcon width={20} height={20} aria-hidden='true' focusable='false' />
          </button>
          <button
            type='button'
            aria-label='다음 달'
            disabled={disabled || !hasAvailableMonth(1)}
            onClick={() => handleMonthChange(1)}
            className={cn(
              FOCUS_CLASS_NAME,
              GLASS_CLASS_NAME,
              'flex size-[2rem] cursor-pointer items-center justify-center rounded-full bg-bg-primary/40 backdrop-blur-[0.4rem] disabled:cursor-not-allowed disabled:opacity-40',
            )}
          >
            <NextIcon width={20} height={20} aria-hidden='true' focusable='false' />
          </button>
        </div>
      </div>
      <table role='grid' aria-labelledby={headingId} className='w-full table-fixed border-collapse'>
        <thead>
          <tr>
            {WEEKDAY_LABELS.map((label, weekday) => (
              <th
                key={label}
                scope='col'
                aria-label={`${WEEKDAYS[weekday]}요일`}
                className='h-[2.6rem] pb-[0.6rem] text-center caption-rg-10 text-[0.7rem] font-medium text-text-white/70'
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
                  aria-disabled={
                    date ? disabled || !hasSelectableDate(date, minDate, maxDate) : undefined
                  }
                  className='h-[2.5rem] p-0 text-center [tr:last-child_&]:h-[2rem]'
                >
                  {date ? (
                    <button
                      ref={(element) => {
                        if (element) {
                          dateButtons.current.set(dateKey, element);
                          return;
                        }
                        dateButtons.current.delete(dateKey);
                      }}
                      type='button'
                      tabIndex={dateKey === tabDateKey ? 0 : -1}
                      aria-label={`${date.getUTCFullYear()}년 ${date.getUTCMonth() + 1}월 ${date.getUTCDate()}일 ${WEEKDAYS[date.getUTCDay()]}요일`}
                      disabled={disabled || !hasSelectableDate(date, minDate, maxDate)}
                      onFocus={() => setFocusedDate(date)}
                      onClick={() => onChange(getDateKey(date))}
                      onKeyDown={(event) => handleDateKeyDown(event, date)}
                      className='group/date flex w-full cursor-pointer items-center justify-center rounded-full focus-visible:outline-none disabled:cursor-not-allowed'
                    >
                      <span
                        className={cn(
                          FOCUS_CLASS_NAME,
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
