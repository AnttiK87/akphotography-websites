import { AppError } from '../errors/AppError.js';

const currentYear = new Date().getFullYear();
const currentmonth = new Date().getMonth() + 1;

export const formatMonthYear = (year: number, month: number): number => {
  if (!year || !month) {
    throw new AppError({ en: 'Year or month missing' });
  }
  if (year < 2020 || year > currentYear || month < 1 || month > 12) {
    throw new AppError({ en: 'Invalid year or month' });
  }
  if (year === currentYear && month > currentmonth) {
    throw new AppError({ en: 'Invalid month' });
  }
  return Number(year) * 100 + Number(month);
};
