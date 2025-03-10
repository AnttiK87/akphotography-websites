// utils/dateUtils.js

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

// General function to format month and year
export const formatMonthYear = (monthYear, language) => {
  const year = Math.floor(monthYear / 100);
  const month = Number(String(monthYear).slice(-2));
  const monthNames = language === "fin" ? monthNamesFi : monthNamesEn;
  return `${monthNames[month - 1]} ${year}`;
};
