import React, { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Box } from "@react-three/drei";
import type { CalendarYearData, CalendarWeekData } from "~/types";

interface WordCountsChartProps {
  /** The list of word counts per calendar year. */
  data: Array<CalendarYearData>;
  /** The minimum year in the dataset. */
  minYear: number;
  /** The maximum year in the dataset. */
  maxYear: number;
  /** The minimum value in the dataset. */
  minValue: number;
  /** The maximum value in the dataset. */
  maxValue: number;
}

/** Shows a grid of 3D bar charts to represent the words written per year. */
const WordCountsChart: React.FC<WordCountsChartProps> = ({
  data,
  minYear,
  maxValue,
}) => {
  const cellSize = 1;
  const cellSpacing = 0.2;
  const gridSpacing = 1.2;

  const heightScale = useMemo(() => {
    return (words: number) => (words / maxValue) * 10;
  }, [maxValue]);

  const centerX =
    ((data.length - 1) * gridSpacing * (cellSize + cellSpacing) * 7) / 2;

  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[-30, 20, 1]} />
      <OrbitControls
        target={[centerX, 0, 25]}
        autoRotate
        autoRotateSpeed={0.5}
      />

      <ambientLight />
      <pointLight position={[0, 10, 0]} intensity={0.8} />
      <pointLight position={[200, 10, 20]} intensity={0.8} />
      <pointLight position={[100, 10, 0]} intensity={0.8} />

      {data.map((yearData, index) => {
        const gridPosition: [number, number, number] = [
          index * (gridSpacing * (cellSize + cellSpacing) * 7),
          0,
          0,
        ];
        return (
          <group key={`${minYear + index}`} position={gridPosition}>
            {yearData.map((week: CalendarWeekData, weekIndex: number) => {
              return week.map((words: number, dayIndex: number) => {
                const height = heightScale(words);
                const position: [number, number, number] = [
                  (cellSize + cellSpacing) * dayIndex,
                  height / 2,
                  (cellSize + cellSpacing) * weekIndex,
                ];
                return (
                  <Box
                    key={`${weekIndex}-${dayIndex}`}
                    args={[cellSize, height, cellSize]}
                    position={position}
                  >
                    <meshStandardMaterial color="blue" />
                  </Box>
                );
              });
            })}
          </group>
        );
      })}
    </Canvas>
  );
};

export default WordCountsChart;
