import { useMemo } from "react";

import type { CalendarYearsData } from "~/types";

/** Creates a set of calculations for the grid. */
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
    const calcCellHeight = (value: number) => (value / maxValue) * scale;

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
    const center: [number, number, number] = [
      totalWidth / 2,
      0,
      totalLength / 2,
    ];

    return { calcCellHeight, calcGridPosition, calcCellPosition, center };
  }, [data, gridSpacing, cellSize, cellSpacing, maxValue, scale]);
};
