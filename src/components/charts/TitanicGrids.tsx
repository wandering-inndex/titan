import { type FC, useId } from "react";
import { useControls, Leva } from "leva";
import { Canvas } from "@react-three/fiber";
import { Box, PerspectiveCamera, OrbitControls } from "@react-three/drei";

import type { CalendarYearsData, CalendarWeekData } from "~/types";
import { useGridCalculations } from "~/hooks";

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
  const id = useId();

  const { cellSize, cellSpacing, gridSpacing, color, unusedColor, scale } =
    useControls("Cells", {
      /** The length of each cell in the grid. */
      cellSize: {
        value: 1.0,
        step: 0.05,
        min: 1.0,
      },
      /** The spacing between each cell in the grid. */
      cellSpacing: {
        value: 0.2,
        step: 0.05,
        min: 0.1,
      },
      /** The spacing between each grid in the scene. */
      gridSpacing: {
        value: 1.4,
        step: 0.05,
        min: 0.1,
      },
      /** The color of the regular cells. */
      color: "#a0185a",
      /** The color of the unused cells. */
      unusedColor: "#cccccc",
      /** The scale of the cells. */
      scale: {
        value: 20.0,
        step: 1.0,
        min: 0.0,
      },
    });

  const { rotate, speed, camera } = useControls("Controls", {
    /** The position of the camera. */
    camera: [-50, 25, 29],
    /** Whether the camera should rotate or not. */
    rotate: true,
    /** The speed of the camera rotation. */
    speed: {
      value: 1.0,
      step: 0.1,
      min: 0.0,
    },
  });

  const light1 = useControls("Light 1", {
    /** The position of the light. */
    position: {
      value: [90, 0, 0],
      step: 10,
    },
    /** The intensity of the light. */
    intensity: {
      value: 0.8,
      step: 1.0,
    },
    /** The color of the light. */
    color: "#ffffff",
    /** Whether the light is enabled or not. */
    enable: true,
  });

  const light2 = useControls("Light 2", {
    /** The position of the light. */
    position: {
      value: [-180, 0, 0],
      step: 10,
    },
    /** The intensity of the light. */
    intensity: {
      value: 0.8,
      step: 1.0,
    },
    /** The color of the light. */
    color: "#ffffff",
    /** Whether the light is enabled or not. */
    enable: true,
  });

  const { calcCellHeight, calcGridPosition, calcCellPosition, center } =
    useGridCalculations(
      data,
      gridSpacing,
      cellSize,
      cellSpacing,
      scale,
      maxValue
    );

  return (
    <>
      <Leva collapsed />
      <Canvas>
        <OrbitControls
          autoRotate={rotate}
          autoRotateSpeed={speed}
          target={center}
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

        {data.map((yearData, yearIndex) => {
          const forYear = startYear + yearIndex;
          const gridPosition = calcGridPosition(yearIndex);
          return (
            <group key={`${id}-grid-${forYear}`} position={gridPosition}>
              {yearData.map((week: CalendarWeekData, weekIndex: number) => {
                return week.map((value: number, dayIndex: number) => {
                  const cellHeight = calcCellHeight(value);
                  const cellPosition: [number, number, number] = [
                    calcCellPosition(dayIndex),
                    cellHeight / 2,
                    calcCellPosition(weekIndex),
                  ];

                  return (
                    <Box
                      key={`${id}-grid-${weekIndex}-${dayIndex}`}
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
