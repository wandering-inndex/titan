/**
 * Represents a tuple of a given type `T` and fixed length `N`.
 *
 * @see https://stackoverflow.com/a/74801694
 */
type Tuple<T, N extends number, R extends T[] = []> = number extends N
  ? T[]
  : R["length"] extends N
  ? R
  : Tuple<T, N, [T, ...R]>;

/**
 * An array that represents values per day of the week.
 *
 * For this project, the first day of the week will be Monday, as per ISO 8601:
 *
 * - INDEX 0: MON
 * - INDEX 1: TUE
 * - INDEX 2: WED
 * - INDEX 3: THU
 * - INDEX 4: FRI
 * - INDEX 5: SAT
 * - INDEX 6: SUN
 *
 * @see https://en.wikipedia.org/wiki/ISO_8601
 *
 * If there are no values for that specific day, it will be 0.
 * If that day is not part of the calendar year, it will be -1.
 *
 * @example
 * const week: CalendarWeekData = [1000, 2000, 3000, 4000, 5000, 6000, 7000];
 * const weekWithoutValues: CalendarYearData = [0, 0, 0, 0, 0, 0, 0];
 * const weekWithDaysNotInYear: CalendarYearData = [-1, -1, -1, -1, -1, -1, -1];
 * const weekMixed: CalendarYearData = [-1, -1, 0, 0, 5000, 0, 7000];
 */
export type CalendarWeekData = Tuple<number, 7>;

/**
 * An array that represents values per week of the year.
 * Most years have 52 weeks, but if the year starts on a Thursday or is a leap
 * year that starts on a Wednesday, that particular year will have 53 weeks.
 *
 * In ISO 8601, if January 1 is on a Monday, Tuesday, Wednesday, or Thursday, it
 * is in week 1. If January 1 is on a Friday, Saturday or Sunday, it is in week
 * 52 or 53 of the previous year (there is no week 0). December 28 will always
 * be in the last week of its year.
 *
 * @see https://en.wikipedia.org/wiki/ISO_8601
 *
 * For this project:
 *
 * - We will *ALWAYS* create a 54-week year.
 * - If a date's month is January and its week number is greater than 50, it
 *   will be changed to week 0.
 * - If a date's month is December and its week number is less than 10, it
 *   will be changed to the number of ISO 8601 weeks in that year + 1. The total
 *   weeks will be coming from to `date-fns`.
 *   {@link https://date-fns.org/docs/getISOWeeksInYear}
 *
 * The substitution will look like this:
 *
 * - 2006: 52 weeks
 * - 2006-01-01 SUN: 2006 W52 => 2006 W00
 * - 2006-12-31 SUN: 2006 W52
 *
 * - 2007: 52 weeks
 * - 2007-01-01 MON: 2007 W01
 * - 2007-12-31 MON: 2007 W01 => 2007 W53
 *
 * - 2008: 52 weeks
 * - 2008-01-01 TUE: 2008 W01
 * - 2008-12-31 WED: 2008 W01 => 2008 W53
 *
 * - 2009: 53 weeks
 * - 2009-01-01 THU: 2009 W01
 * - 2009-12-31 THU: 2009 W53
 *
 * - 2010: 52 weeks
 * - 2010-01-01 FRI: 2010 W53 => 2010 W00
 * - 2010-12-31 FRI: 2010 W52
 *
 * - 2011: 52 weeks
 * - 2011-01-01 SAT: 2011 W52 => 2011 W00
 * - 2011-12-31 SAT: 2011 W52
 *
 * - 2012: 52 weeks
 * - 2012-01-01 SUN: 2012 W52 => 2012 W00
 * - 2012-12-31 MON: 2012 W01 => 2012 W53
 *
 * - 2013: 52 weeks
 * - 2013-01-01 TUE: 2013 W01
 * - 2013-12-31 TUE: 2013 W01 => 2013 W53
 *
 * - 2014: 52 weeks
 * - 2014-01-01 WED: 2014 W01
 * - 2014-12-31 WED: 2014 W01 => 2013 W53
 *
 * - 2015: 53 weeks
 * - 2015-01-01 THU: 2015 W01
 * - 2015-12-31 THU: 2015 W53
 *
 * - 2016: 52 weeks
 * - 2016-01-01 FRI: 2016 W53 => 2016 W00
 * - 2016-12-31 SAT: 2016 W52
 *
 * - 2017: 52 weeks
 * - 2017-01-01 SUN: 2017 W52 => 2017 W00
 * - 2017-12-31 SUN: 2017 W52
 *
 * - 2018: 52 weeks
 * - 2018-01-01 MON: 2018 W01
 * - 2018-12-31 MON: 2018 W01 => 2018 W53
 *
 * - 2019: 52 weeks
 * - 2019-01-01 TUE: 2019 W01
 * - 2019-12-31 TUE: 2019 W01 => 2019 W53
 *
 * - 2020: 53 weeks
 * - 2020-01-01 WED: 2020 W01
 * - 2020-12-31 THU: 2020 W53
 *
 * - 2021: 52 weeks
 * - 2021-01-01 FRI: 2021 W53 => 2021 W00
 * - 2021-12-31 FRI: 2021 W52
 *
 * - 2022: 52 weeks
 * - 2022-01-01 SAT: 2022 W52 => 2022 W00
 * - 2022-12-31 SAT: 2022 W52
 *
 */
export type CalendarYearData = Array<CalendarWeekData>;

/**
 * A multidimensional array that represents values per year.
 */
export type CalendarYearsData = Array<CalendarYearData>;

/**
 * Maps a value per date string.
 * The date string must be in a valid ISO 8601 format.
 *
 * @see https://en.wikipedia.org/wiki/ISO_8601
 *
 * @example
 * const map: ValuesPerDay = new Map<string, number>([
 *  ["2021-01-01", 1000],
 *  ["2021-01-02", 2000],
 *  ["2021-01-03", 3000],
 * ]); */
export type ValuesPerDay = Map<string, number>;
