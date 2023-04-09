import { useMemo } from "react";

import type { CalendarYearsData } from "~/types";

/** The return values from the hook. */
export interface ReturnValues {
  /** Calculates the scaled height of the cells based on the maximum value. */
  calcCellHeight: (value: number) => number;
  /** Calculates the starting position of the grid. */
  calcGridPosition: (index: number) => [number, number, number];
  /** Calculates the adjusted starting position of a cell. */
  calcCellPosition: (index: number) => number;
  /** The center of the Canvas. */
  center: [number, number, number];
}

/**
 * Creates a set of calculations for the grid.
 *
 * This assumes that `data` is not empty. Handling empty data is the
 * responsibility of the caller.
 *
 * @param {CalendarYearsData} data - The data to be used for the calculations.
 * @param {number} gridSpacing - The spacing between the grids.
 * @param {number} cellSize - The length of each cell in the grid.
 * @param {number} cellSpacing - The spacing between the cells.
 * @param {number} scale - The scale of the cells.
 * @param {number} maxValue - The maximum value of the data.
 * @returns {ReturnValues} The calculations.
 */
export const useGridCalculations = (
  /** The data to be used for the calculations. */
  data: CalendarYearsData,
  /** The spacing between the grids. */
  gridSpacing: number,
  /** The length of each cell in the grid. */
  cellSize: number,
  /** The spacing between the cells. */
  cellSpacing: number,
  /** The scale of the cells. */
  scale: number,
  /** The maximum value of the data. */
  maxValue: number
) => {
  return useMemo(() => {
    /** Calculates the distance of a cell from the origin. */
    const cellDistance = (items: number): number => {
      // prettier-ignore
      return (cellSize * items) + (cellSpacing * (items - 1));
    };

    /** Calculates the distance of grid from the origin. */
    const gridDistance = (items: number): number => {
      // prettier-ignore
      return (gridWidth * items) + (gridSpacing * (items - 1));
    };

    /** Calculates the scaled height of the cells based on the maximum value. */
    const calcCellHeight = (value: number) => {
      // prettier-ignore
      return (value > 0 && maxValue > 0) ? (value / maxValue) * scale : 0;
    };

    /** Calculates the adjusted starting position of a cell. */
    const calcCellPosition = (index: number): number => {
      // prettier-ignore
      return ((cellSize + cellSpacing) * index) + (cellSize / 2);
    };

    /** Calculates the starting position of the grid. */
    const calcGridPosition = (index: number): [number, number, number] => {
      return [(cellDistance(7) + gridSpacing) * index, 0, 0];
    };

    const gridWidth = cellDistance(7);
    const gridLength = cellDistance(54);
    const totalWidth = gridDistance(data.length);
    const totalLength = gridLength;

    /** The center of the Canvas. */
    const center: [number, number, number] =
      data.length > 0 ? [totalWidth / 2, 0, totalLength / 2] : [0, 0, 0];

    const returnValues: ReturnValues = {
      calcCellHeight,
      calcGridPosition,
      calcCellPosition,
      center,
    };
    return returnValues;
  }, [data, gridSpacing, cellSize, cellSpacing, maxValue, scale]);
};
