import React, { useState } from "react";
import { Stage, Layer, Rect, Image as KonvaImage, Text } from "react-konva";
import { v4 as uuidv4 } from "uuid";

const STATUS_COLOR = {
  available: "yellow",
  sold: "red",
  hold: "green",
};

const PlotCanvas = ({ mapImage, plots, setPendingPlot, stageRef  }) => {
  const [drawing, setDrawing] = useState(false);
  const [newRect, setNewRect] = useState(null);

  const handleMouseDown = (e) => {
    if (!mapImage) return;
    const pos = e.target.getStage().getPointerPosition();
    setDrawing(true);
    setNewRect({ x: pos.x, y: pos.y, width: 0, height: 0 });
  };

  const handleMouseMove = (e) => {
    if (!drawing) return;
    const pos = e.target.getStage().getPointerPosition();
    setNewRect((prev) => ({
      ...prev,
      width: pos.x - prev.x,
      height: pos.y - prev.y,
    }));
  };

  const handleMouseUp = () => {
    if (!newRect) return;

    setPendingPlot({
      id: uuidv4(),
      ...newRect,
    });

    setDrawing(false);
    setNewRect(null);
  };

  return (
    <div className="border">
      <Stage
        ref={stageRef}
        width={900}
        height={600}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer>
          {mapImage && (
            <KonvaImage image={mapImage} width={900} height={600} />
          )}

          {plots.map((plot) => (
            <React.Fragment key={plot.id}>
              <Rect
                x={plot.x}
                y={plot.y}
                width={plot.width}
                height={plot.height}
                fill={STATUS_COLOR[plot.status] || "yellow"}
                opacity={0.6}
                stroke="black"
              />
              <Text
                // fill="black"
                text={plot.plotId}
                x={plot.x}
                y={plot.y}
                fontSize={10}
                opacity={0.6}
              />
            </React.Fragment>
          ))}

          {newRect && (
            <Rect {...newRect} stroke="blue" dash={[4, 4]} />
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default PlotCanvas;
