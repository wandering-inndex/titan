import React, { useMemo } from "react";
import { useControls, Leva } from "leva";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Box } from "@react-three/drei";
import type { CalendarYearsData, CalendarWeekData } from "~/types";

interface SkylinesChartProps {
  /** The list of number values per calendar year. */
  data: CalendarYearsData;
  /** The minimum year in the dataset. */
  minYear: number;
  /** The maximum year in the dataset. */
  maxYear: number;
  /** The minimum value in the dataset. */
  minValue: number;
  /** The maximum value in the dataset. */
  maxValue: number;
}

/** Shows a grid of 3D bar charts to represent the number values per year. */
const SkylinesChart: React.FC<SkylinesChartProps> = ({
  data,
  minYear,
  maxValue,
}) => {
  const { cellSize, cellSpacing, gridSpacing, color, invalidColor, scale } =
    useControls("Cells", {
      cellSize: 1.0,
      cellSpacing: 0.2,
      gridSpacing: 1.2,
      color: "#a0185a",
      invalidColor: "#cccccc",
      scale: {
        value: 20,
        min: 1,
      },
    });

  const { target, rotate, speed, camera } = useControls("Controls", {
    camera: [-49, 17, 30],
    target: [30, 2, 32],
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

  const heightScale = useMemo(() => {
    return (value: number) => (value / maxValue) * scale;
  }, [maxValue, scale]);

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
                return week.map((value: number, dayIndex: number) => {
                  const height = heightScale(value);
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
                      <meshPhongMaterial
                        color={value < 0 ? invalidColor : color}
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

export default SkylinesChart;
