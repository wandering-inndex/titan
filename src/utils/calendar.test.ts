import { expect, test, describe } from "vitest";

import type {
  CalendarYearData,
  CalendarYearsData,
  ValuesPerDay,
} from "~/types";

import {
  getAdjustedISOWeek,
  initializeEmptyCalendarYearData,
  convertToCalendarYearData,
  extractYearRange,
  createUtcDate,
} from "./calendar";

describe("(createUtcDate)", () => {
  test("creates a UTC date", () => {
    const got = createUtcDate(2020, 1, 1);
    const want = new Date(Date.UTC(2020, 0, 1, 0, 0, 0, 0));
    expect(got).toEqual(want);
  });
});

describe("(extractYearRange)", () => {
  test("extracts the year range from a single year", () => {
    const valuesPerDay: ValuesPerDay = new Map([
      ["2020-01-01", 1],
      ["2020-01-02", 1],
    ]);
    const got = extractYearRange(valuesPerDay);
    const want = { minimumYear: 2020, maximumYear: 2020 };
    expect(got).toEqual(want);
  });

  test("extracts the year range from multiple years", () => {
    const valuesPerDay: ValuesPerDay = new Map([
      ["2020-01-01", 1],
      ["2020-01-02", 1],
      ["2021-01-01", 1],
      ["2024-01-02", 1],
    ]);
    const got = extractYearRange(valuesPerDay);
    const want = { minimumYear: 2020, maximumYear: 2024 };
    expect(got).toEqual(want);
  });

  test("extracts the year range from an empty map", () => {
    const valuesPerDay: ValuesPerDay = new Map([]);
    const got = extractYearRange(valuesPerDay);
    const want = { minimumYear: Infinity, maximumYear: -Infinity };
    expect(got).toEqual(want);
  });
});

describe("(getAdjustedISOWeek)", () => {
  const createDates = (year: number): { first: Date; last: Date } => {
    return {
      first: new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0)),
      last: new Date(Date.UTC(year, 11, 31, 0, 0, 0, 0)),
    };
  };

  test("adjusts a year with a different first and last ISO week like 2012", () => {
    const { first, last } = createDates(2012);
    expect(getAdjustedISOWeek(first)).toBe(0);
    expect(getAdjustedISOWeek(last)).toBe(53);
  });

  test("adjusts a year with a different last ISO week like 2013", () => {
    const { first, last } = createDates(2013);
    expect(getAdjustedISOWeek(first)).toBe(1);
    expect(getAdjustedISOWeek(last)).toBe(53);
  });

  test("adjusts a year with a different first ISO week like 2016", () => {
    const { first, last } = createDates(2016);
    expect(getAdjustedISOWeek(first)).toBe(0);
    expect(getAdjustedISOWeek(last)).toBe(52);
  });

  test("does not adjust a year with default ISO weeks like 2020", () => {
    const { first, last } = createDates(2020);
    expect(getAdjustedISOWeek(first)).toBe(1);
    expect(getAdjustedISOWeek(last)).toBe(53);
  });
});

describe("(initializeEmptyCalendarYearData)", () => {
  test("adjusts a year with a different first and last ISO week like 2012", () => {
    const year = 2012;
    const got = initializeEmptyCalendarYearData(year);
    const want: CalendarYearData = [
      [-1, -1, -1, -1, -1, -1, 0],
      ...(Array.from({ length: 52 }, () =>
        Array<number>(7).fill(0)
      ) as CalendarYearData),
      [0, -1, -1, -1, -1, -1, -1],
    ];

    expect(got).toEqual(want);
  });

  test("adjusts a year with a different last ISO week like 2013", () => {
    const year = 2013;
    const got = initializeEmptyCalendarYearData(year);
    const want: CalendarYearData = [
      [-1, -1, -1, -1, -1, -1, -1],
      [-1, 0, 0, 0, 0, 0, 0],
      ...(Array.from({ length: 51 }, () =>
        Array<number>(7).fill(0)
      ) as CalendarYearData),
      [0, 0, -1, -1, -1, -1, -1],
    ];

    expect(got).toEqual(want);
  });

  test("adjusts a year with a different first ISO week like 2016", () => {
    const year = 2016;
    const got = initializeEmptyCalendarYearData(year);
    const want: CalendarYearData = [
      [-1, -1, -1, -1, 0, 0, 0],
      ...(Array.from({ length: 51 }, () =>
        Array<number>(7).fill(0)
      ) as CalendarYearData),
      [0, 0, 0, 0, 0, 0, -1],
      [-1, -1, -1, -1, -1, -1, -1],
    ];

    expect(got).toEqual(want);
  });

  test("does not adjust a year with default ISO weeks like 2020", () => {
    const year = 2020;
    const got = initializeEmptyCalendarYearData(year);
    const want: CalendarYearData = [
      [-1, -1, -1, -1, -1, -1, -1],
      [-1, -1, 0, 0, 0, 0, 0],
      ...(Array.from({ length: 51 }, () =>
        Array<number>(7).fill(0)
      ) as CalendarYearData),
      [0, 0, 0, 0, -1, -1, -1],
    ];

    expect(got).toEqual(want);
  });
});

describe("(convertToCalendarYearData)", () => {
  test("valid dates of 2022", () => {
    const data: Map<string, number> = new Map([
      ["2022-01-01T00:00:00+00:00", 1000],
      ["2022-01-02T00:00:00+00:00", 2000],
      ["2022-04-08T00:00:00+00:00", 408],
      ["2022-12-31T00:00:00+00:00", 1231],
    ]);

    const got = convertToCalendarYearData(data);
    const want: CalendarYearsData = [
      [
        [-1, -1, -1, -1, -1, 1000, 2000],
        ...(Array.from({ length: 13 }, () =>
          Array<number>(7).fill(0)
        ) as CalendarYearData),
        [0, 0, 0, 0, 408, 0, 0],
        ...(Array.from({ length: 37 }, () =>
          Array<number>(7).fill(0)
        ) as CalendarYearData),
        [0, 0, 0, 0, 0, 1231, -1],
        [-1, -1, -1, -1, -1, -1, -1],
      ],
    ];

    expect(got).toEqual(want);
  });
});
