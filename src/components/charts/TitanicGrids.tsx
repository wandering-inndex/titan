import { type FC, useMemo } from "react";
import { useControls, Leva } from "leva";
import { Canvas } from "@react-three/fiber";
import { Box, PerspectiveCamera, OrbitControls } from "@react-three/drei";

import type { CalendarYearsData, CalendarWeekData } from "~/types";

interface TitanicGridsProps {
  /** The list of number values per calendar year. */
  data: CalendarYearsData;
  /** The first year in the dataset. */
  startYear: number;
  /** The maximum value in the dataset. */
  maxValue: number;
}

/** Shows a grid of 3D bar charts to represent the number values per year. */
const TitanicGrids: FC<TitanicGridsProps> = ({ data, startYear, maxValue }) => {
  const { cellSize, cellSpacing, gridSpacing, color, unusedColor, scale } =
    useControls("Cells", {
      cellSize: 1.0,
      cellSpacing: 0.2,
      gridSpacing: 1.2,
      color: "#a0185a",
      unusedColor: "#cccccc",
      scale: {
        value: 20,
        min: 1,
      },
    });

  const { target, rotate, speed, camera } = useControls("Controls", {
    camera: [-50, 25, 32],
    target: [34, 0, 32],
    rotate: true,
    speed: {
      value: 1.0,
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
      step: 1.0,
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
      step: 1.0,
    },
    color: "#ffffff",
    enable: true,
  });

  /** The function to calculate the height of the cells. */
  const scaledHeight = useMemo(() => {
    return (value: number) => (value / maxValue) * scale;
  }, [maxValue, scale]);

  return (
    <>
      <Leva collapsed />
      <Canvas>
        <OrbitControls
          autoRotate={rotate}
          autoRotateSpeed={speed}
          target={target}
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
          const yearValue = startYear + index;
          return (
            <group key={`grid-${yearValue}`} position={gridPosition}>
              {yearData.map((week: CalendarWeekData, weekIndex: number) => {
                return week.map((value: number, dayIndex: number) => {
                  const cellHeight = scaledHeight(value);
                  const cellPosition: [number, number, number] = [
                    (cellSize + cellSpacing) * dayIndex,
                    cellHeight / 2,
                    (cellSize + cellSpacing) * weekIndex,
                  ];
                  return (
                    <Box
                      key={`${weekIndex}-${dayIndex}`}
                      args={[cellSize, cellHeight, cellSize]}
                      position={cellPosition}
                    >
                      <meshPhongMaterial
                        color={value < 0 ? unusedColor : color}
                      />
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

export default TitanicGrids;
