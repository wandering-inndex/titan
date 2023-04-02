import {
  getISODay,
  getISOWeek,
  getISOWeeksInYear,
  getYear,
  parseISO,
} from "date-fns";

import type {
  CalendarWeekData,
  CalendarYearData,
  CalendarYearsData,
  ValuesPerDay,
} from "~/types";

/** Creates a UTC date. */
export const createUtcDate = (year: number, month: number, day: number) =>
  new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));

/**
 * Extracts the minimum and maximum years from the given `ValuesPerDay`
 * object.
 *
 * @param valuesPerDay - The `ValuesPerDay` object to extract the year
 * range from.
 * @returns An object containing the `minimumYear` and `maximumYear`.
 */
export const extractYearRange = (
  valuesPerDay: ValuesPerDay
): { minimumYear: number; maximumYear: number } => {
  let minimumYear = Infinity;
  let maximumYear = -Infinity;

  for (const dateString of valuesPerDay.keys()) {
    const year = getYear(parseISO(dateString));

    minimumYear = Math.min(minimumYear, year);
    maximumYear = Math.max(maximumYear, year);
  }

  return { minimumYear, maximumYear };
};

/**
 * Given a date, get its adjusted ISO week number based on the project
 * requirements:
 *
 * - If a date's month is January and its week number is greater than 50, it
 *   will be changed to week 0.
 * - If a date's month is December and its week number is less than 10, it
 *   will be changed to the number of ISO 8601 weeks in that year + 1.
 *
 * @param {Date} date - The date to get the adjusted ISO week number for.
 * @returns {number} - The adjusted ISO week number.
 */
export const getAdjustedISOWeek = (date: Date): number => {
  const month = date.getMonth();
  const isoWeek = getISOWeek(date);
  const isoWeeksInYear = getISOWeeksInYear(date);

  if (month === 0 && isoWeek > 50) {
    return 0;
  } else if (month === 11 && isoWeek < 10) {
    return isoWeeksInYear + 1;
  }

  return isoWeek;
};

/**
 * Initializes an empty `CalendarYearData`.
 *
 * If there are no values for that specific day, it will be `0`. If that day is
 * not part of the calendar year, it will be `-1`.
 *
 * @param {number} year - The year to initialize the data for.
 * @returns {CalendarYearData} a `CalendarYearData` with default values.
 */
export const initializeEmptyCalendarYearData = (
  year: number
): CalendarYearData => {
  const firstDateOfYear = createUtcDate(year, 1, 1);
  const lastDateOfYear = createUtcDate(year, 12, 31);
  const firstWeekOfYearAdjusted = getAdjustedISOWeek(firstDateOfYear);
  const lastWeekOfYearAdjusted = getAdjustedISOWeek(lastDateOfYear);
  const firstDayOfYear = getISODay(firstDateOfYear) - 1;
  const lastDayOfYear = getISODay(lastDateOfYear) - 1;

  const yearData: CalendarYearData = [
    ...(Array.from(
      { length: 54 },
      (_, weekIndex) =>
        Array.from({ length: 7 }, (_, dayIndex) => {
          if (
            (weekIndex === firstWeekOfYearAdjusted &&
              dayIndex < firstDayOfYear) ||
            (weekIndex === lastWeekOfYearAdjusted && dayIndex > lastDayOfYear)
          ) {
            return -1;
          } else if (
            weekIndex < firstWeekOfYearAdjusted ||
            weekIndex > lastWeekOfYearAdjusted
          ) {
            return -1;
          } else {
            return 0;
          }
        }) as CalendarWeekData
    ) as CalendarYearData),
  ];

  return yearData;
};

/**
 * Converts a `ValuesPerDay` object to a `CalendarYearsData` object.
 *
 * @param valuesPerDay - The `ValuesPerDay` object to convert.
 * @returns The converted `CalendarYearsData` object.
 */
export const convertToCalendarYearData = (
  valuesPerDay: ValuesPerDay
): CalendarYearsData => {
  const { minimumYear, maximumYear } = extractYearRange(valuesPerDay);
  const yearsData: CalendarYearsData = [];

  for (let year = minimumYear; year <= maximumYear; year++) {
    yearsData.push(initializeEmptyCalendarYearData(year));
  }

  for (const [dateString, value] of valuesPerDay) {
    const date = parseISO(dateString);
    const year = getYear(date);

    const yearIndex = year - minimumYear;
    const weekIndex = getAdjustedISOWeek(date);
    const dayIndex = getISODay(date) - 1;

    const yearData = yearsData[yearIndex];
    if (!yearData) continue;

    const weekData = yearData[weekIndex];
    if (!weekData || weekData[dayIndex] === -1) continue;
    weekData[dayIndex] = (weekData[dayIndex] ?? 0) + value;
  }

  return yearsData;
};
