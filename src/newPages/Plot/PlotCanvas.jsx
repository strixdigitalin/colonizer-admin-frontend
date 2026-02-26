import React, { useState } from "react";
import {
  Stage,
  Layer,
  Rect,
  Image as KonvaImage,
  Text,
  Group,
} from "react-konva";
import { v4 as uuidv4 } from "uuid";

const STATUS_COLOR = {
  available: "green",
  sold: "red",
  hold: "yellow",
};

const PlotCanvas = ({
  mapImage,
  plots,
  setPendingPlot,
  stageRef,
  setScale,
  scale,
  position,
  setPosition,
  handleDelete,
}) => {
  const [drawing, setDrawing] = useState(false);
  const [newRect, setNewRect] = useState(null);

  const MIN_SCALE = 0.5;
  const MAX_SCALE = 3;
  const ZOOM_STEP = 0.2;
  const MOVE_STEP = 30;

  const zoomIn = () =>
    setScale((prev) => Math.min(prev + ZOOM_STEP, MAX_SCALE));

  const zoomOut = () =>
    setScale((prev) => Math.max(prev - ZOOM_STEP, MIN_SCALE));

  const moveStage = (dx, dy) => {
    setPosition((prev) => ({
      x: prev.x + dx,
      y: prev.y + dy,
    }));
  };

  const getRelativePointerPosition = () => {
    const stage = stageRef.current;
    const pointer = stage.getPointerPosition();
    return {
      x: (pointer.x - position.x) / scale,
      y: (pointer.y - position.y) / scale,
    };
  };

  const handleMouseDown = () => {
    if (!mapImage) return;
    const pos = getRelativePointerPosition();
    setDrawing(true);
    setNewRect({ x: pos.x, y: pos.y, width: 0, height: 0 });
  };

  const handleMouseMove = () => {
    if (!drawing) return;
    const pos = getRelativePointerPosition();
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
    <div className="border p-2">
      <div className="flex flex-wrap gap-2 mb-2">
        <button onClick={zoomIn} className="px-3 py-1 bg-gray-200">
          Zoom +
        </button>
        <button onClick={zoomOut} className="px-3 py-1 bg-gray-200">
          Zoom -
        </button>

        <button onClick={() => moveStage(0, MOVE_STEP)}>⬇</button>
        <button onClick={() => moveStage(0, -MOVE_STEP)}>⬆</button>
        <button onClick={() => moveStage(MOVE_STEP, 0)}>➡</button>
        <button onClick={() => moveStage(-MOVE_STEP, 0)}>⬅</button>
      </div>

      <Stage ref={stageRef} width={900} height={600}>
        <Layer>
          <Group
            x={position.x}
            y={position.y}
            scaleX={scale}
            scaleY={scale}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            {mapImage && (
              <KonvaImage image={mapImage} width={900} height={600} />
            )}

            {/* {plots.map((plot) => (
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
                <Text text={plot.plotId} x={plot.x} y={plot.y} fontSize={12} />
              </React.Fragment>
            ))} */}
            {/* {plots.map((plot) => (
              <React.Fragment key={plot._id}>
                <Rect
                  x={plot.coordinates?.x}
                  y={plot.coordinates?.y}
                  width={plot.coordinates?.width}
                  height={plot.coordinates?.height}
                  fill={STATUS_COLOR[plot.status] || "yellow"}
                  opacity={0.6}
                  stroke="black"
                  onClick={() => handleDelete(plot._id)}
                />
              </React.Fragment>
            ))} */}
            {plots.map((plot) => {
              const { x, y, width, height } = plot.coordinates || {};
              const fontSize = Math.min(6, Math.min(width, height) / 1.4);
              const strokeWidth = Math.max(
                0.5,
                Math.min(width, height) / 25,
              );
              return (
                <React.Fragment key={plot._id}>
                  {/* Plot Box */}
                  <Rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    fill={STATUS_COLOR[plot.status] || "yellow"}
                    opacity={1}
                    stroke="black"
                    strokeWidth={strokeWidth}
                    onClick={() => handleDelete(plot._id)}
                  />

                  {/* Plot Text */}
                  <Text
                    text={`${plot.plotNumber}`}
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    align="center"
                    verticalAlign="middle"
                    fontSize={fontSize}
                    fill="black"
                    wrap="word"
                  />
                </React.Fragment>
              );
            })}

            {newRect && <Rect {...newRect} stroke="blue" dash={[4, 4]} />}
          </Group>
        </Layer>
      </Stage>
    </div>
  );
};

export default PlotCanvas;
