import React, { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Box } from "@react-three/drei";
import { type CalendarYearData, type CalendarWeekData } from "~/types";

interface DailyContributionChartProps {
  data: CalendarYearData;
}

const DailyContributionChart: React.FC<DailyContributionChartProps> = ({
  data,
}) => {
  const cellSize = 1;
  const cellSpacing = 0.2;

  const heightScale = useMemo(() => {
    const maxWords = Math.max(...data.flatMap((week) => week));
    return (words: number) => (words / maxWords) * 10;
  }, [data]);

  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[20, 20, 20]} />
      <OrbitControls />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />

      {data.map((week: CalendarWeekData, weekIndex: number) => {
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
    </Canvas>
  );
};

export default DailyContributionChart;
