import React, { useMemo } from "react";
import { useControls, Leva } from "leva";
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

const DEFAULT_CELL_SIZE = 1;
const DEFAULT_CELL_SPACING = 0.2;
const DEFAULT_GRID_SPACING = 1.2;

/** Shows a grid of 3D bar charts to represent the words written per year. */
const WordCountsChart: React.FC<WordCountsChartProps> = ({
  data,
  minYear,
  maxValue,
}) => {
  const { cellSize, cellSpacing, gridSpacing, color } = useControls("Cells", {
    cellSize: DEFAULT_CELL_SIZE,
    cellSpacing: DEFAULT_CELL_SPACING,
    gridSpacing: DEFAULT_GRID_SPACING,
    color: "#0000ff",
  });

  const { target, rotate, speed, camera } = useControls("Controls", {
    camera: [-49, 11, 30],
    target: [30, 2, 32],
    rotate: true,
    speed: {
      value: 0.5,
      step: 0.1,
    },
  });

  const light1 = useControls("Light 1", {
    position: {
      value: [90, 0, 0],
      step: 10,
    },
    intensity: {
      value: 0.8,
      step: 1,
    },
    color: "#ffffff",
    enable: true,
  });

  const light2 = useControls("Light 2", {
    position: {
      value: [-180, 0, 0],
      step: 10,
    },
    intensity: {
      value: 0.8,
      step: 1,
    },
    color: "#ffffff",
    enable: true,
  });

  const heightScale = useMemo(() => {
    return (words: number) => (words / maxValue) * 10;
  }, [maxValue]);

  return (
    <>
      <Leva collapsed />
      <Canvas>
        <OrbitControls
          target={target}
          autoRotate={rotate}
          autoRotateSpeed={speed}
        />
        <PerspectiveCamera makeDefault position={camera} />

        <hemisphereLight />

        {light1.enable && (
          <directionalLight
            position={light1.position}
            intensity={light1.intensity}
            color={light1.color}
          />
        )}
        {light2.enable && (
          <directionalLight
            position={light2.position}
            intensity={light2.intensity}
            color={light2.color}
          />
        )}

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
                      <meshPhongMaterial color={color} />
                    </Box>
                  );
                });
              })}
            </group>
          );
        })}
      </Canvas>
    </>
  );
};

export default WordCountsChart;
