'use client';

import type { KeyboardEvent } from 'react';
import { useEffect, useId, useRef, useState } from 'react';

import * as datePickerUtils from './datePickerUtils';

interface UseDatePickerOptions {
  value: string | null;
  defaultMonth: string;
  minDate?: string;
  maxDate?: string;
}

export const useDatePicker = ({
  value: valueString,
  defaultMonth,
  minDate: minDateString,
  maxDate: maxDateString,
}: UseDatePickerOptions) => {
  const { value, initialMonth, minDate, maxDate } = datePickerUtils.getDatePickerDates(
    valueString,
    defaultMonth,
    minDateString,
    maxDateString,
  );
  const [requestedMonth, setMonth] = useState(() =>
    datePickerUtils.getMonthStart(
      datePickerUtils.clampDate(value ?? initialMonth, minDate, maxDate),
    ),
  );
  const [previousValue, setPreviousValue] = useState(valueString);
  const [focusedDate, setFocusedDate] = useState<Date | null>(null);
  const dateButtons = useRef(new Map<string, HTMLButtonElement>());
  const pendingFocus = useRef<Date | null>(null);
  const headingId = useId();

  // 새 선택값은 해당 월에 표시하고, 선택 해제 시에는 탐색 중인 월을 유지한다.
  if (previousValue !== valueString) {
    setPreviousValue(valueString);
    if (value)
      setMonth(datePickerUtils.getMonthStart(datePickerUtils.clampDate(value, minDate, maxDate)));
    setFocusedDate(null);
  }

  const month = datePickerUtils.getMonthStart(
    datePickerUtils.clampDate(requestedMonth, minDate, maxDate),
  );
  const weeks = datePickerUtils.getMonthWeeks(month);
  const selectedKey = value ? datePickerUtils.getDateKey(value) : null;
  const availableDates = weeks.flatMap(({ days }) =>
    days.flatMap(({ date }) =>
      date && datePickerUtils.hasSelectableDate(date, minDate, maxDate) ? [date] : [],
    ),
  );
  const tabDate = [focusedDate, value, availableDates[0]].find(
    (date) =>
      date &&
      datePickerUtils.hasSameMonth(date, month) &&
      datePickerUtils.hasSelectableDate(date, minDate, maxDate),
  );
  const tabDateKey = tabDate ? datePickerUtils.getDateKey(tabDate) : null;
  const monthKey = datePickerUtils.getDateKey(month);
  const focusedKey = focusedDate ? datePickerUtils.getDateKey(focusedDate) : null;

  // 새 월의 버튼이 DOM에 반영된 후에만 포커스를 이동한다.
  useEffect(() => {
    const target = pendingFocus.current;
    pendingFocus.current = null;
    if (target) dateButtons.current.get(datePickerUtils.getDateKey(target))?.focus();
  }, [monthKey, focusedKey]);

  const handleMonthChange = (direction: number) => {
    pendingFocus.current = null;
    setMonth((current) =>
      datePickerUtils.getMonthStart(
        datePickerUtils.clampDate(
          datePickerUtils.shiftMonth(
            datePickerUtils.clampDate(current, minDate, maxDate),
            direction,
          ),
          minDate,
          maxDate,
        ),
      ),
    );
    setFocusedDate(null);
  };

  const handleDateKeyDown = (event: KeyboardEvent<HTMLButtonElement>, date: Date) => {
    const nextDate = datePickerUtils.getKeyboardDate(
      pendingFocus.current ?? date,
      event.key,
      event.shiftKey,
    );
    if (!nextDate) return;
    event.preventDefault();
    const target = datePickerUtils.clampDate(nextDate, minDate, maxDate);
    pendingFocus.current = target;
    setFocusedDate(target);
    setMonth(datePickerUtils.getMonthStart(target));
  };

  const setDateButton = (key: string, element: HTMLButtonElement | null) => {
    if (element) {
      dateButtons.current.set(key, element);
      return;
    }
    dateButtons.current.delete(key);
  };

  return {
    month,
    weeks,
    selectedKey,
    tabDateKey,
    headingId,
    hasPreviousMonth: datePickerUtils.hasAvailableMonth(month, -1, minDate, maxDate),
    hasNextMonth: datePickerUtils.hasAvailableMonth(month, 1, minDate, maxDate),
    hasDisabledDate: (date: Date) => !datePickerUtils.hasSelectableDate(date, minDate, maxDate),
    setFocusedDate,
    handleMonthChange,
    handleDateKeyDown,
    setDateButton,
  };
};
