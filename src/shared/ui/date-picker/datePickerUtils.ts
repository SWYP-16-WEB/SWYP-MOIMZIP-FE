export const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
export const WEEKDAY_LABELS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

// 날짜 전용 문자열을 UTC 기준 계산용 Date로 다룬다. 실행 환경의 시간대는 사용하지 않는다.
export const createDate = (year: number, month: number, day = 1) => {
  const date = new Date(0);
  date.setUTCFullYear(year, month, day);
  date.setUTCHours(0, 0, 0, 0);
  return date;
};

export const normalizeDate = (date: Date) =>
  createDate(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());

export const getDateKey = (date: Date) =>
  `${String(date.getUTCFullYear()).padStart(4, '0')}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;

export const parseDate = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new RangeError('DatePicker 날짜는 YYYY-MM-DD 형식이어야 합니다.');
  }
  const [year, month, day] = value.split('-').map(Number);
  const date = createDate(year, month - 1, day);
  if (year < 1 || getDateKey(date) !== value) {
    throw new RangeError('DatePicker에는 유효한 날짜를 전달해야 합니다.');
  }
  return date;
};

export const getMonthStart = (date: Date) => createDate(date.getUTCFullYear(), date.getUTCMonth());

export const getMonthLabel = (date: Date) =>
  `${date.getUTCFullYear()}.${String(date.getUTCMonth() + 1).padStart(2, '0')}`;

export const shiftDate = (date: Date, days: number) =>
  createDate(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + days);

export const shiftMonth = (date: Date, months: number) => {
  const month = createDate(date.getUTCFullYear(), date.getUTCMonth() + months);
  const lastDay = createDate(month.getUTCFullYear(), month.getUTCMonth() + 1, 0).getUTCDate();
  return createDate(
    month.getUTCFullYear(),
    month.getUTCMonth(),
    Math.min(date.getUTCDate(), lastDay),
  );
};

export const hasSameMonth = (first: Date, second: Date) =>
  first.getUTCFullYear() === second.getUTCFullYear() &&
  first.getUTCMonth() === second.getUTCMonth();

export const hasSelectableDate = (date: Date, minDate?: Date, maxDate?: Date) =>
  (!minDate || date >= normalizeDate(minDate)) && (!maxDate || date <= normalizeDate(maxDate));

export const clampDate = (date: Date, minDate?: Date, maxDate?: Date) =>
  minDate && date < normalizeDate(minDate)
    ? normalizeDate(minDate)
    : maxDate && date > normalizeDate(maxDate)
      ? normalizeDate(maxDate)
      : date;

export const getMonthWeeks = (month: Date) => {
  const first = getMonthStart(month);
  const lastDay = createDate(month.getUTCFullYear(), month.getUTCMonth() + 1, 0).getUTCDate();
  return Array.from({ length: 6 }, (_, week) => ({
    key: getDateKey(shiftDate(first, week * 7 - first.getUTCDay())),
    days: Array.from({ length: 7 }, (_, weekday) => {
      const day = week * 7 + weekday - first.getUTCDay() + 1;
      return {
        key: getDateKey(shiftDate(first, day - 1)),
        date:
          day > 0 && day <= lastDay
            ? createDate(month.getUTCFullYear(), month.getUTCMonth(), day)
            : null,
      };
    }),
  }));
};

const getValidDate = (value?: string | null) => {
  if (!value) return null;
  try {
    return parseDate(value);
  } catch {
    return null;
  }
};

export const getDatePickerDates = (
  valueString: string | null,
  defaultMonth: string,
  minDateString?: string,
  maxDateString?: string,
) => {
  const value = getValidDate(valueString);
  const supportedMin = createDate(1, 0, 1);
  const supportedMax = createDate(9999, 11, 31);
  const requestedMin = getValidDate(minDateString) ?? supportedMin;
  const requestedMax = getValidDate(maxDateString) ?? supportedMax;
  const hasReversedRange = requestedMin > requestedMax;
  return {
    value,
    initialMonth: getValidDate(defaultMonth) ?? value ?? createDate(1970, 0, 1),
    minDate: hasReversedRange ? supportedMin : requestedMin,
    maxDate: hasReversedRange ? supportedMax : requestedMax,
  };
};

export const hasAvailableMonth = (month: Date, direction: number, minDate: Date, maxDate: Date) => {
  const candidate = shiftMonth(month, direction);
  const first = getMonthStart(candidate);
  const last = createDate(candidate.getUTCFullYear(), candidate.getUTCMonth() + 1, 0);
  return last >= minDate && first <= maxDate;
};

export const getKeyboardDate = (date: Date, key: string, shiftKey = false) => {
  const movements: Record<string, () => Date> = {
    ArrowLeft: () => shiftDate(date, -1),
    ArrowRight: () => shiftDate(date, 1),
    ArrowUp: () => shiftDate(date, -7),
    ArrowDown: () => shiftDate(date, 7),
    Home: () => shiftDate(date, -date.getUTCDay()),
    End: () => shiftDate(date, 6 - date.getUTCDay()),
    PageUp: () => shiftMonth(date, shiftKey ? -12 : -1),
    PageDown: () => shiftMonth(date, shiftKey ? 12 : 1),
  };
  return Object.hasOwn(movements, key) ? movements[key]() : null;
};

export const getDateLabel = (date: Date) =>
  `${date.getUTCFullYear()}년 ${date.getUTCMonth() + 1}월 ${date.getUTCDate()}일 ${WEEKDAYS[date.getUTCDay()]}요일`;
