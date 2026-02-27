import React, { useState, useEffect } from "react";
import {
  Stage,
  Layer,
  Rect,
  Image as KonvaImage,
  Text,
} from "react-konva";
import { v4 as uuidv4 } from "uuid";

const STATUS_COLOR = {
  available: "green",
  sold: "red",
  hold: "yellow",
};

const STAGE_WIDTH = 900;
const STAGE_HEIGHT = 600;

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
  const [isPanning, setIsPanning] = useState(false);

  const MIN_SCALE = 0.5;
  const MAX_SCALE = 3;
  const ZOOM_STEP = 0.2;

  /* =========================
     SPACE KEY PAN MODE
  ========================== */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        setIsPanning(true);
        document.body.style.cursor = "grab";
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === "Space") {
        setIsPanning(false);
        document.body.style.cursor = "default";
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  /* =========================
     BOUNDARY CONSTRAINT
  ========================== */
  const constrainPosition = (pos, newScale) => {
    const scaledWidth = STAGE_WIDTH * newScale;
    const scaledHeight = STAGE_HEIGHT * newScale;

    const minX = Math.min(0, STAGE_WIDTH - scaledWidth);
    const minY = Math.min(0, STAGE_HEIGHT - scaledHeight);

    return {
      x: Math.max(minX, Math.min(0, pos.x)),
      y: Math.max(minY, Math.min(0, pos.y)),
    };
  };

  /* =========================
     POINTER POSITION
  ========================== */
  const getRelativePointerPosition = () => {
    const stage = stageRef.current;
    const pointer = stage.getPointerPosition();
    return {
      x: (pointer.x - position.x) / scale,
      y: (pointer.y - position.y) / scale,
    };
  };

  /* =========================
     DRAW HANDLERS
  ========================== */
  const handleMouseDown = () => {
    if (!mapImage) return;

    const stage = stageRef.current;

    if (isPanning) {
      stage.startDrag();
      return;
    }

    const pos = getRelativePointerPosition();
    setDrawing(true);
    setNewRect({ x: pos.x, y: pos.y, width: 0, height: 0 });
  };

  const handleMouseMove = () => {
    if (isPanning || !drawing) return;

    const pos = getRelativePointerPosition();
    setNewRect((prev) => ({
      ...prev,
      width: pos.x - prev.x,
      height: pos.y - prev.y,
    }));
  };

  const handleMouseUp = () => {
    const stage = stageRef.current;

    if (isPanning) {
      stage.stopDrag();
      const constrained = constrainPosition(
        { x: stage.x(), y: stage.y() },
        scale
      );
      setPosition(constrained);
      return;
    }

    if (!newRect) return;

    setPendingPlot({
      id: uuidv4(),
      ...newRect,
    });

    setDrawing(false);
    setNewRect(null);
  };

  /* =========================
     MOUSE WHEEL ZOOM
  ========================== */
  const handleWheel = (e) => {
    e.evt.preventDefault();

    const stage = stageRef.current;
    const oldScale = scale;
    const pointer = stage.getPointerPosition();

    const mousePointTo = {
      x: (pointer.x - position.x) / oldScale,
      y: (pointer.y - position.y) / oldScale,
    };

    const direction = e.evt.deltaY > 0 ? -1 : 1;

    const newScale = Math.min(
      MAX_SCALE,
      Math.max(MIN_SCALE, oldScale + direction * 0.1)
    );

    setScale(newScale);

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    const constrained = constrainPosition(newPos, newScale);
    setPosition(constrained);
  };

  /* =========================
     BUTTON ZOOM
  ========================== */
  const zoom = (direction) => {
    const stage = stageRef.current;
    const oldScale = scale;

    const center = {
      x: STAGE_WIDTH / 2,
      y: STAGE_HEIGHT / 2,
    };

    const pointTo = {
      x: (center.x - position.x) / oldScale,
      y: (center.y - position.y) / oldScale,
    };

    const newScale = Math.min(
      MAX_SCALE,
      Math.max(MIN_SCALE, oldScale + direction * ZOOM_STEP)
    );

    setScale(newScale);

    const newPos = {
      x: center.x - pointTo.x * newScale,
      y: center.y - pointTo.y * newScale,
    };

    const constrained = constrainPosition(newPos, newScale);
    setPosition(constrained);
  };

  const zoomIn = () => zoom(1);
  const zoomOut = () => zoom(-1);

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div className="border p-2">
      {/* Controls */}
      <div className="flex gap-2 mb-2">
        {/* <button onClick={zoomIn} className="px-3 py-1 bg-gray-200">
          Zoom +
        </button>
        <button onClick={zoomOut} className="px-3 py-1 bg-gray-200">
          Zoom -
        </button> */}
        <button onClick={handleReset} className="px-3 py-1 bg-red-200">
          Reset
        </button>
        <span className="text-sm text-gray-500">
          (Hold SPACE + Drag to move)
        </span>
      </div>

      {/* Fixed Container */}
      <div
        style={{
          width: `${STAGE_WIDTH}px`,
          height: `${STAGE_HEIGHT}px`,
          overflow: "hidden",
          border: "2px solid #1e40af",
        }}
      >
        <Stage
          ref={stageRef}
          width={STAGE_WIDTH}
          height={STAGE_HEIGHT}
          x={position.x}
          y={position.y}
          scaleX={scale}
          scaleY={scale}
          draggable={isPanning}
          onWheel={handleWheel}
          onDragEnd={(e) => {
            const constrained = constrainPosition(
              { x: e.target.x(), y: e.target.y() },
              scale
            );
            setPosition(constrained);
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <Layer>
            {mapImage && (
              <KonvaImage
                image={mapImage}
                width={STAGE_WIDTH}
                height={STAGE_HEIGHT}
              />
            )}

            {plots.map((plot) => {
              const { x, y, width, height } = plot.coordinates || {};
              const fontSize = Math.min(14, Math.min(width, height) / 2);
              const strokeWidth = Math.max(
                0.5,
                Math.min(width, height) / 25
              );

              return (
                <React.Fragment key={plot._id}>
                  <Rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    fill={STATUS_COLOR[plot.status] || "yellow"}
                    stroke="black"
                    strokeWidth={strokeWidth}
                    onClick={() => handleDelete(plot._id)}
                  />
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
                  />
                </React.Fragment>
              );
            })}

            {newRect && <Rect {...newRect} stroke="blue" dash={[4, 4]} />}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default PlotCanvas;