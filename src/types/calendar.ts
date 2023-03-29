/** Maps the datestring to the total word count. */
export type TotalWordsPerDay = Map<string, number>;

/**
 * An array of numbers per week. First index is the start of the week.
 * Max of 7 items.
 *
 * [
 *   - 0 SUN
 *   - 1 MON
 *   - 2 TUE
 *   - 3 WED
 *   - 4 THU
 *   - 5 FRI
 *   - 6 SAT
 * ]
 */
export type CalendarWeekData = Array<number>;

/**
 * An array of arrays per year. First index is the start of the year.
 * Max of 53 items.
 */
export type CalendarYearData = Array<CalendarWeekData>;
