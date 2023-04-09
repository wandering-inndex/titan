import React, { type FC } from "react";
import ReactDOM from "react-dom";
import { expect, test, describe, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";

import type { ValuesPerDay } from "~/types";
import { convertToCalendarYearData } from "~/utils";
import HomePage from "~/pages/index";

interface HeadMockProps {
  children: React.ReactNode;
}

const HeadMock: FC<HeadMockProps> = ({ children }) => {
  return (
    // eslint-disable-next-line @next/next/no-head-element
    <head data-testid="mock-head">
      {ReactDOM.createPortal(children, document.head)}
    </head>
  );
};

/**
 * Mock the next/head component.
 *
 * @see {@link https://github.com/vercel/next.js/discussions/11060}
 */
vi.mock("next/head", () => {
  const head = ({ children }: HeadMockProps) => <HeadMock>{children}</HeadMock>;
  return { Head: head, default: head };
});

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

describe("HomePage", () => {
  test("renders the home page", () => {
    const data = convertToCalendarYearData(MAPPING_01);
    const maxValue = getMaxValue(MAPPING_01);
    const minYear = getMinYear(MAPPING_01);

    render(<HomePage data={data} minYear={minYear} maxValue={maxValue} />);

    const pageTitle = document.title;
    expect(pageTitle).toBe("3D Word Count Visualizer | The Wandering Inndex");

    const ogTitle =
      document
        .querySelector("meta[property='og:title']")
        ?.getAttribute("content") ?? "";
    expect(ogTitle).toBe("3D Word Count Visualizer | The Wandering Inndex");

    const ogDescription =
      document
        .querySelector("meta[property='og:description']")
        ?.getAttribute("content") ?? "";
    expect(ogDescription).toBe(
      "Visualizing the Word Count of The Wandering Inn, a short story by pirateaba."
    );

    const siteHeader = screen.queryByTestId("site-header");
    expect(siteHeader).toBeDefined();

    const main = within(screen.getByRole("main"));
    expect(main).toBeDefined();
  });
});
