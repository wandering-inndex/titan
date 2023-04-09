import { render, screen } from "@testing-library/react";
import { test, expect, describe } from "vitest";

import type { ValuesPerDay } from "~/types";
import { convertToCalendarYearData } from "~/utils";

import TitanicGrids from "./TitanicGrids";

/** Calculates the maximum value in the ValuesPerDay. */
const getMaxValue = (valuesPerDay: ValuesPerDay): number =>
  Math.max(...valuesPerDay.values());

/** Extracts the years from the mapping and returns the minimum year. */
const getMinYear = (valuesPerDay: ValuesPerDay): number => {
  const years = [...valuesPerDay.keys()].map((date) =>
    new Date(date).getFullYear()
  );
  return Math.min(...years);
};

/** With data in same year. */
const MAPPING_01: ValuesPerDay = new Map<string, number>([
  ["2022-01-01T00:00:00+00:00", 1000],
  ["2022-01-02T00:00:00+00:00", 2000],
  ["2022-04-08T00:00:00+00:00", 408],
  ["2022-12-31T00:00:00+00:00", 1231],
]);

describe("TitanicGrids", () => {
  test("renders the component", () => {
    const data = convertToCalendarYearData(MAPPING_01);
    const maxValue = getMaxValue(MAPPING_01);
    const startYear = getMinYear(MAPPING_01);

    render(
      <TitanicGrids data={data} startYear={startYear} maxValue={maxValue} />
    );

    const leva = screen.queryByTestId("titanic-grids-leva");
    expect(leva).toBeDefined();

    const canvas = screen.queryByTestId("titanic-grids-canvas");
    expect(canvas).toBeDefined();
  });
});
