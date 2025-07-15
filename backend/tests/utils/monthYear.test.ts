import { formatMonthYear } from '../../src/utils/formatMonthYear.js';

describe('formatMonthYear', () => {
  test('fails if month is missing', () => {
    expect(() => formatMonthYear(2025, null as unknown as number)).toThrow(
      'Year or month missing',
    );
  });

  test('fails if year is missing', () => {
    expect(() => formatMonthYear(null as unknown as number, 4)).toThrow(
      'Year or month missing',
    );
  });

  test('fails if year is below 2020', () => {
    expect(() => formatMonthYear(2019, 4)).toThrow('Invalid year or month');
  });

  test('fails if year is in the future', () => {
    const futureYear = new Date().getFullYear() + 1;
    expect(() => formatMonthYear(futureYear, 4)).toThrow(
      'Invalid year or month',
    );
  });

  test('fails if month is above 12', () => {
    expect(() => formatMonthYear(2025, 13)).toThrow('Invalid year or month');
  });

  test('fails if month is below 1', () => {
    expect(() => formatMonthYear(2025, -3)).toThrow('Invalid year or month');
  });

  test('fails if month is in future of current year', () => {
    const currentYear = new Date().getFullYear();
    const nextMonth = new Date().getMonth() + 2; // getMonth is 0-based
    if (nextMonth <= 12) {
      expect(() => formatMonthYear(currentYear, nextMonth)).toThrow(
        'Invalid month',
      );
    }
  });

  test('returns formatted number for valid inputs', () => {
    expect(formatMonthYear(2024, 6)).toBe(202406);
  });
});
