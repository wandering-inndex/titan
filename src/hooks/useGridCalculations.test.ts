import { expect, test, describe, beforeAll } from "vitest";
import { renderHook } from "@testing-library/react";

import type { CalendarYearsData, ValuesPerDay } from "~/types";

import { useGridCalculations, type ReturnValues } from "./useGridCalculations";
import { convertToCalendarYearData } from "../utils";

/** Calculates the maximum value in the ValuesPerDay. */
const getMaxValue = (valuesPerDay: ValuesPerDay): number =>
  Math.max(...valuesPerDay.values());

/** With data in same year. */
const MAPPING_01: ValuesPerDay = new Map<string, number>([
  ["2022-01-01T00:00:00+00:00", 1000],
  ["2022-01-02T00:00:00+00:00", 2000],
  ["2022-04-08T00:00:00+00:00", 408],
  ["2022-12-31T00:00:00+00:00", 1231],
]);

/** With data across multiple years. */
const MAPPING_02: ValuesPerDay = new Map<string, number>([
  ["2020-01-01T00:00:00+00:00", 300],
  ["2021-06-02T00:00:00+00:00", 600],
  ["2022-04-08T00:00:00+00:00", 908],
  ["2023-12-31T00:00:00+00:00", 1500],
]);

/** With no data. */
const MAPPING_03: ValuesPerDay = new Map<string, number>();

describe("useGridCalculations", () => {
  let data: CalendarYearsData;
  let maxValue: number;
  let gridSpacing: number;
  let cellSize: number;
  let cellSpacing: number;
  let scale: number;
  let returnValues: ReturnValues;

  describe("calcCellHeight", () => {
    beforeAll(() => {
      data = convertToCalendarYearData(MAPPING_01);
      maxValue = getMaxValue(MAPPING_01);
      gridSpacing = 10;
      cellSize = 20;
      cellSpacing = 5;
      scale = 1;

      const { result } = renderHook(() =>
        useGridCalculations(
          data,
          gridSpacing,
          cellSize,
          cellSpacing,
          scale,
          maxValue
        )
      );

      returnValues = result.current;
    });

    test("returns a scaled value", () => {
      const value = 300;
      const got = returnValues.calcCellHeight(value);
      const want = 0.15;

      expect(got).toEqual(want);
    });

    test("returns 0 for negative numbers", () => {
      const value = -10000;
      const got = returnValues.calcCellHeight(value);
      const want = 0;

      expect(got).toEqual(want);
    });

    test("returns the value of `scale` for the maximum value", () => {
      const value = maxValue;
      const got = returnValues.calcCellHeight(value);
      const want = scale;

      expect(got).toEqual(want);
    });

    test("returns a value greater than 1 if exceeds maximum value", () => {
      const value = maxValue * 2;
      const got = returnValues.calcCellHeight(value);

      expect(got).toBeGreaterThan(1);
    });
  });

  describe("calcGridPosition", () => {
    beforeAll(() => {
      data = convertToCalendarYearData(MAPPING_02);
      maxValue = getMaxValue(MAPPING_02);
      gridSpacing = 1.4;
      cellSize = 1;
      cellSpacing = 0.2;
      scale = 20;

      const { result } = renderHook(() =>
        useGridCalculations(
          data,
          gridSpacing,
          cellSize,
          cellSpacing,
          scale,
          maxValue
        )
      );

      returnValues = result.current;
    });

    test("returns the origin for the first grid", () => {
      const index = 0;
      const got = returnValues.calcGridPosition(index);
      const want = [0, 0, 0];

      expect(got).toEqual(want);
    });

    test("returns the adjusted x-axis value for the second grid", () => {
      const index = 1;
      const got = returnValues.calcGridPosition(index);
      const want = [9.6, 0, 0];

      expect(got).toEqual(want);
    });

    test("returns the adjusted x-axis value for the third grid", () => {
      const index = 2;
      const got = returnValues.calcGridPosition(index);
      const want = [19.2, 0, 0];

      expect(got).toEqual(want);
    });
  });

  describe("calcCellPosition", () => {
    beforeAll(() => {
      data = convertToCalendarYearData(MAPPING_01);
      maxValue = getMaxValue(MAPPING_01);
      gridSpacing = 1.4;
      cellSize = 1;
      cellSpacing = 0.2;
      scale = 20;

      const { result } = renderHook(() =>
        useGridCalculations(
          data,
          gridSpacing,
          cellSize,
          cellSpacing,
          scale,
          maxValue
        )
      );

      returnValues = result.current;
    });

    test("returns zero + half the cellSize for the first cell", () => {
      const index = 0;
      const got = returnValues.calcCellPosition(index);
      const want = cellSize / 2;

      expect(got).toEqual(want);
    });

    test("returns adjusted value for another cell", () => {
      const index = 15;
      const got = returnValues.calcCellPosition(index);
      const want = 18.5;

      expect(got).toEqual(want);
    });
  });

  describe("center", () => {
    test("with one year", () => {
      data = convertToCalendarYearData(MAPPING_01);
      maxValue = getMaxValue(MAPPING_01);
      gridSpacing = 1.4;
      cellSize = 1;
      cellSpacing = 0.2;
      scale = 20;

      const { result } = renderHook(() =>
        useGridCalculations(
          data,
          gridSpacing,
          cellSize,
          cellSpacing,
          scale,
          maxValue
        )
      );

      returnValues = result.current;

      const got = returnValues.center;
      const want = [4.1, 0, 32.3];

      expect(got).toEqual(want);
    });

    test("with two years", () => {
      data = convertToCalendarYearData(MAPPING_02);
      maxValue = getMaxValue(MAPPING_02);
      gridSpacing = 1.4;
      cellSize = 1;
      cellSpacing = 0.2;
      scale = 20;

      const { result } = renderHook(() =>
        useGridCalculations(
          data,
          gridSpacing,
          cellSize,
          cellSpacing,
          scale,
          maxValue
        )
      );

      returnValues = result.current;

      const got = returnValues.center;
      const want = [18.5, 0, 32.3];

      expect(got).toEqual(want);
    });
  });

  describe("empty data", () => {
    beforeAll(() => {
      data = convertToCalendarYearData(MAPPING_03);
      maxValue = getMaxValue(MAPPING_03);
      gridSpacing = 10;
      cellSize = 20;
      cellSpacing = 5;
      scale = 1;

      const { result } = renderHook(() =>
        useGridCalculations(
          data,
          gridSpacing,
          cellSize,
          cellSpacing,
          scale,
          maxValue
        )
      );

      returnValues = result.current;
    });

    test("calcCellHeight returns default values", () => {
      const value = 300;
      const got = returnValues.calcCellHeight(value);
      const want = 0;

      expect(got).toEqual(want);
    });

    test("calcGridPosition returns default values", () => {
      const index = 0;
      const got = returnValues.calcGridPosition(index);
      const want = [0, 0, 0];

      expect(got).toEqual(want);
    });

    test("calcCellPosition returns default values", () => {
      const index = 0;
      const got = returnValues.calcCellPosition(index);
      const want = cellSize / 2;

      expect(got).toEqual(want);
    });

    test("center returns default values", () => {
      const got = returnValues.center;
      const want = [0, 0, 0];

      expect(got).toEqual(want);
    });
  });
});
