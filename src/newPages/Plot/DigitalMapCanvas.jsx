import React from "react";
import { Stage, Layer, Line, Image as KonvaImage, Text } from "react-konva";

const DigitalMapCanvas = ({
  stageRef,
  mapImage,
  entities,
  drawingPoints,
  setDrawingPoints,
}) => {
  const handleClick = (e) => {
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
      height={600}
      ref={stageRef}
      onClick={handleClick}
      draggable
    >
      <Layer>
        {mapImage && (
          <KonvaImage image={mapImage} width={mapImage.width} height={mapImage.height} />
        )}

        {entities.map((entity) => {
          const center = getCenter(entity.points);

          return (
            <React.Fragment key={entity.id}>
              <Line
                points={entity.points.flatMap((p) => [p.x, p.y])}
                closed
                fill={entity.style.fill}
                stroke={entity.style.stroke}
              />
              <Text
                x={center.x - 20}
                y={center.y - 10}
                text={entity.label}
                fontSize={14}
                fill="black"
              />
            </React.Fragment>
          );
        })}

        <Line
          points={drawingPoints.flatMap((p) => [p.x, p.y])}
          stroke="blue"
        />
      </Layer>
    </Stage>
  );
};

export default DigitalMapCanvas;