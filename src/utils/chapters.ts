import { isMatch, formatISO, parseISO } from "date-fns";

import type { Chapter, ValuesPerDay, CalendarYearsData } from "~/types";
import { convertToCalendarYearData } from "./calendar";

/**
 * Checks if a chapter should be included based on the given conditions.
 *
 * @param {Chapter} chapter - The chapter to check.
 * @returns {boolean} - `true` if the chapter should be included, `false`
 * otherwise.
 */
export const shouldIncludeChapter = (chapter: Chapter): boolean => {
  const shouldShow = chapter.meta.show === true;
  const hasValidWebNovelRef = (chapter.partOf.webNovel?.ref ?? 0) > 0;
  const hasValidPublishedDate = isMatch(
    chapter.partOf.webNovel?.published ?? "",
    "yyyy-MM-dd'T'HH:mm:ssXXX"
  );

  return shouldShow && hasValidWebNovelRef && hasValidPublishedDate;
};

/** The return data from the `convertChaptersToMapping` function. */
export interface ConvertChaptersToMappingOutput {
  /** This maps a date string to the number of words written on that day. */
  mapping: ValuesPerDay;
  /** The minimum year in the dataset. */
  minYear: number;
  /** The maximum year in the dataset. */
  maxYear: number;
  /** The minimum value in the dataset. */
  minValue: number;
  /** The maximum value in the dataset. */
  maxValue: number;
}

/**
 * Converts an array of `Chapter` objects to a `ConvertChaptersToMappingOutput`.
 *
 * @param {Chapter[]} chapters - The array of `Chapter` objects.
 * @returns {ConvertChaptersToMappingOutput} - The output of the conversion.
 */
export const convertChaptersToMapping = (
  chapters: Chapter[]
): ConvertChaptersToMappingOutput => {
  const mapping: ValuesPerDay = new Map();

  let minYear = Number.POSITIVE_INFINITY;
  let maxYear = Number.NEGATIVE_INFINITY;
  let minValue = Number.POSITIVE_INFINITY;
  let maxValue = Number.NEGATIVE_INFINITY;

  for (const chapter of chapters) {
    if (!shouldIncludeChapter(chapter)) {
      continue;
    }

    const publishedDate = chapter.partOf.webNovel?.published ?? "";
    const totalWords = chapter.partOf.webNovel?.totalWords ?? 0;

    if (publishedDate) {
      const date = parseISO(publishedDate);
      const dateKey = formatISO(date, {
        representation: "date",
      });

      const existingWordCount = mapping.get(dateKey) ?? 0;
      const newWordCount = existingWordCount + totalWords;
      mapping.set(dateKey, newWordCount);

      const year = date.getFullYear();
      minYear = Math.min(minYear, year);
      maxYear = Math.max(maxYear, year);
      minValue = Math.min(minValue, newWordCount);
      maxValue = Math.max(maxValue, newWordCount);
    }
  }

  return { mapping, minYear, maxYear, minValue, maxValue };
};

/** The return data from the `convertChaptersToCalendarYearData` function. */
export interface ConvertChaptersToCalendarYearDataOutput {
  /** The list of word counts per calendar year. */
  data: CalendarYearsData;
  /** The minimum year in the dataset. */
  minYear: number;
  /** The maximum year in the dataset. */
  maxYear: number;
  /** The minimum value in the dataset. */
  minValue: number;
  /** The maximum value in the dataset. */
  maxValue: number;
}

/**
 * Converts an array of `Chapter` objects to a
 * `ConvertChaptersToCalendarYearDataOutput` object.
 *
 * @param {Chapter[]} chapters - The array of `Chapter` objects.
 * @returns {ConvertChaptersToCalendarYearDataOutput} - The output of the
 * conversion.
 */
export const convertChaptersToCalendarYearData = (
  chapters: Chapter[]
): ConvertChaptersToCalendarYearDataOutput => {
  const { mapping, minYear, maxYear, minValue, maxValue } =
    convertChaptersToMapping(chapters);
  const calendarYearsData = convertToCalendarYearData(mapping);

  return {
    data: calendarYearsData,
    minYear,
    maxYear,
    minValue,
    maxValue,
  };
};
