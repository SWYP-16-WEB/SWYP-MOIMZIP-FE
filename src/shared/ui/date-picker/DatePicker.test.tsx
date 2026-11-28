import assert from 'node:assert/strict';
import { test } from 'node:test';
import { renderToString } from 'react-dom/server';

import { DatePicker } from './DatePicker';
import {
  getDateKey,
  getDatePickerDates,
  getKeyboardDate,
  getMonthWeeks,
  parseDate,
  shiftDate,
  shiftMonth,
} from './datePickerUtils';

test('서버와 브라우저 시간대가 달라도 같은 날짜와 월을 렌더링한다', () => {
  const previousTimezone = process.env.TZ;
  try {
    const renders = ['UTC', 'Asia/Seoul', 'America/New_York'].map((timezone) => {
      process.env.TZ = timezone;
      return renderToString(
        <DatePicker value='2027-01-01' defaultMonth='2027-01-01' onChange={() => {}} />,
      );
    });
    assert.equal(renders[0], renders[1]);
    assert.equal(renders[0], renders[2]);
    assert.match(renders[0], /2027년 1월 1일 금요일/);
  } finally {
    if (previousTimezone === undefined) {
      delete process.env.TZ;
    } else {
      process.env.TZ = previousTimezone;
    }
  }
});

test('선택값이 없어도 명시한 최초 월을 표시한다', () => {
  const html = renderToString(
    <DatePicker value={null} defaultMonth='2028-02-01' onChange={() => {}} />,
  );
  assert.match(html, /2028년 2월 29일 화요일/);
  assert.doesNotMatch(html, /aria-selected="true"/);
});

test('잘못된 형식과 존재하지 않는 날짜를 거부한다', () => {
  ['2027-02-29', '2027-13-01', '2027-01-00', '2027-1-1', '0000-01-01', ''].forEach((date) => {
    assert.throws(() => parseDate(date), RangeError);
  });
});

test('월말, 윤년, 연도 경계를 보존한다', () => {
  assert.equal(getDateKey(shiftMonth(parseDate('2027-01-31'), 1)), '2027-02-28');
  assert.equal(getDateKey(shiftMonth(parseDate('2028-01-31'), 1)), '2028-02-29');
  assert.equal(getDateKey(shiftMonth(parseDate('2028-02-29'), 12)), '2029-02-28');
  assert.equal(getDateKey(shiftDate(parseDate('2027-12-31'), 1)), '2028-01-01');
});

test('6주 셀을 중복 없이 만들고 월 첫날의 요일을 맞춘다', () => {
  const weeks = getMonthWeeks(parseDate('2027-01-01'));
  const cells = weeks.flatMap(({ days }) => days);
  assert.equal(new Set(cells.map(({ key }) => key)).size, 42);
  assert.equal(cells.filter(({ date }) => date !== null).length, 31);
  assert.equal(getDateKey(weeks[0].days[5].date!), '2027-01-01');
});

test('지원 연도 경계 밖으로 월 이동하지 않는다', () => {
  const first = renderToString(
    <DatePicker value='0001-01-01' defaultMonth='0001-01-01' onChange={() => {}} />,
  );
  const last = renderToString(
    <DatePicker value='9999-12-31' defaultMonth='9999-12-01' onChange={() => {}} />,
  );
  assert.match(first, /aria-label="이전 달" disabled=""/);
  assert.match(last, /aria-label="다음 달" disabled=""/);
});

test('날짜 범위가 역전되면 제한을 무시하고 달력을 렌더링한다', () => {
  const html = renderToString(
    <DatePicker
      value={null}
      defaultMonth='2027-01-01'
      minDate='2027-01-20'
      maxDate='2027-01-10'
      onChange={() => {}}
    />,
  );
  assert.match(html, /2027년 1월 1일 금요일/);
  assert.doesNotMatch(html, /aria-disabled="true"/);
});

test('잘못된 선택값과 범위는 페이지 렌더링을 중단하지 않는다', () => {
  const html = renderToString(
    <DatePicker
      value='2027-02-29'
      defaultMonth='2027-03-01'
      minDate='invalid'
      maxDate='invalid'
      onChange={() => {}}
    />,
  );
  assert.match(html, /2027년 3월 1일 월요일/);
  assert.doesNotMatch(html, /aria-selected="true"/);
  assert.equal(getDateKey(getDatePickerDates(null, 'invalid').initialMonth), '1970-01-01');
});

test('키보드 이동은 월말과 연도 경계를 보존한다', () => {
  const date = parseDate('2028-01-31');
  assert.equal(getDateKey(getKeyboardDate(date, 'PageDown')!), '2028-02-29');
  assert.equal(getDateKey(getKeyboardDate(date, 'PageDown', true)!), '2029-01-31');
  assert.equal(getDateKey(getKeyboardDate(date, 'ArrowRight')!), '2028-02-01');
  assert.equal(getKeyboardDate(date, 'Enter'), null);
  assert.equal(getKeyboardDate(date, 'toString'), null);
});
