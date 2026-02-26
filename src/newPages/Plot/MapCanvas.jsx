import React from "react";
import { Stage, Layer, Line, Image as KonvaImage, Text, Circle } from "react-konva";

const MapCanvas = ({
  stageRef,
  mapImage,
  plots,
  drawingPoints,
  setDrawingPoints,
  digitalMode,
}) => {
  const handleClick = (e) => {
    if (digitalMode) return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    setDrawingPoints((prev) => [...prev, point]);
  };

  const getCenter = (points) => {
    const x = points.reduce((sum, p) => sum + p.x, 0) / points.length;
    const y = points.reduce((sum, p) => sum + p.y, 0) / points.length;
    return { x, y };
  };

  return (
    <Stage
      width={window.innerWidth - 40}
      height={700}
      ref={stageRef}
      onClick={handleClick}
      draggable
    >
      <Layer>
        {/* Base image only in tracing mode */}
        {mapImage && (
          <KonvaImage
            image={mapImage}
            width={mapImage.width}
            height={mapImage.height}
          />
        )}

        {/* Render all plots */}
        {plots.map((plot) => {
          const center = getCenter(plot.points);

          return (
            <React.Fragment key={plot.id}>
              <Line
                points={plot.points.flatMap((p) => [p.x, p.y])}
                closed
                fill="green"   // ALL PLOTS GREEN
                stroke="black"
              />

              {/* Only Plot Number Visible */}
              <Text
                x={center.x - 15}
                y={center.y - 8}
                text={plot.plotNumber}
                fontSize={14}
                fill="white"
              />
            </React.Fragment>
          );
        })}

        {/* Drawing line only in tracing mode */}
        {!digitalMode && (
          <>
            <Line
              points={drawingPoints.flatMap((p) => [p.x, p.y])}
              stroke="blue"
            />
            {drawingPoints.map((p, i) => (
              <Circle key={i} x={p.x} y={p.y} radius={4} fill="red" />
            ))}
          </>
        )}
      </Layer>
    </Stage>
  );
};

export default MapCanvas;