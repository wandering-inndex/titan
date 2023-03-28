import React, { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Box } from "@react-three/drei";
import type { CalendarYearData, CalendarWeekData } from "~/types";

interface DailyContributionChartProps {
  data: Array<CalendarYearData>;
  minYear: number;
  maxYear: number;
  minValue: number;
  maxValue: number;
}

const DailyContributionChart: React.FC<DailyContributionChartProps> = ({
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
      <PerspectiveCamera makeDefault position={[-40, 20, 100]} />
      <OrbitControls target={[centerX, 0, 0]} />
      <ambientLight />
      <pointLight position={[5, 10, 0]} />
      <pointLight position={[200, 100, 100]} />

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

export default DailyContributionChart;
