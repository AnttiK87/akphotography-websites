import type { Language } from "../types/types";

export const monthNamesEn = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const monthNamesFi = [
  "Tammikuu",
  "Helmikuu",
  "Maaliskuu",
  "Huhtikuu",
  "Toukokuu",
  "Kesäkuu",
  "Heinäkuu",
  "Elokuu",
  "Syyskuu",
  "Lokakuu",
  "Marraskuu",
  "Joulukuu",
];

export const formatMonthYear = (
  monthYear: number | null,
  language: Language
) => {
  if (!monthYear) return;
  const year = Math.floor(monthYear / 100);
  const month = Number(String(monthYear).slice(-2));
  const monthNames = language === "fin" ? monthNamesFi : monthNamesEn;
  return `${monthNames[month - 1]} ${year}`;
};
