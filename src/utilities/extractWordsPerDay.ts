import { addDays, formatISO, getDay, getDaysInYear } from "date-fns";

import type { CalendarYearData, Chapter, TotalWordsPerDay } from "~/types";

interface ReturnData {
  allYearData: Array<CalendarYearData>;
  minYear: number;
  maxYear: number;
  minValue: number;
  maxValue: number;
}

/**
 * Extracts the total words per day from the chapters.
 *
 * @param chapters The chapters to extract the data from.
 * @returns The extracted data.
 */
export const extractWordsPerDay = (chapters: Chapter[]): ReturnData => {
  let minYear = Number.POSITIVE_INFINITY;
  let maxYear = Number.NEGATIVE_INFINITY;
  let minValue = Number.POSITIVE_INFINITY;
  let maxValue = Number.NEGATIVE_INFINITY;

  const mapTotalWords: TotalWordsPerDay = new Map<string, number>();
  chapters
    .filter((chapter) => chapter.meta.show === true)
    .filter((chapter) => (chapter.partOf.webNovel?.ref || 0) > 0)
    .forEach((chapter) => {
      const date =
        (chapter.partOf.webNovel?.published || "").split("T")[0] || "";
      const year = parseInt(date.split("-")[0] ?? "") ?? 0;
      const wordCount = chapter.partOf.webNovel?.totalWords || 0;

      minYear = Math.min(minYear, year);
      maxYear = Math.max(maxYear, year);
      minValue = Math.min(minValue, wordCount);
      maxValue = Math.max(maxValue, wordCount);

      const currentValue = mapTotalWords.has(date)
        ? mapTotalWords.get(date) ?? 0
        : 0;
      mapTotalWords.set(date, currentValue + wordCount);
    });

  const allYearData: Array<CalendarYearData> = [];
  for (let year = minYear; year <= maxYear; year++) {
    const startDay = new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0));
    const endDay = new Date(Date.UTC(year, 11, 31, 0, 0, 0, 0));
    const totalDays = getDaysInYear(startDay);
    const firstWeekPadding = getDay(startDay);
    const lastWeekPadding = 7 - (getDay(endDay) + 1);
    const flatYearData: Array<number> = new Array<number>(
      firstWeekPadding + totalDays + lastWeekPadding
    ).fill(0);

    for (
      let index = firstWeekPadding, daysToAdd = 0;
      daysToAdd <= totalDays;
      index++, daysToAdd++
    ) {
      const date = formatISO(addDays(startDay, daysToAdd), {
        representation: "date",
      });

      const wordCount = mapTotalWords.has(date)
        ? mapTotalWords.get(date) ?? 0
        : 0;
      flatYearData[index] = wordCount;
    }

    const yearData: CalendarYearData = [];
    // Originally `flatYearData.length` but some years have 54 weeks instead.
    // TODO: Troubleshoot and fix the bug.
    const maxWeeks = 53;
    for (let week = 0; week < maxWeeks; week++) {
      const startIndex = week * 7;
      const endIndex = startIndex + 7;
      yearData.push(flatYearData.slice(startIndex, endIndex));
    }

    allYearData.push(yearData);
  }

  return {
    allYearData,
    minYear,
    maxYear,
    minValue,
    maxValue,
  };
};
