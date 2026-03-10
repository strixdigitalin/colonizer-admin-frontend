import React from "react";
import { Stage, Layer, Rect } from "react-konva";
import MapLayer from "./MapLayer";

const STAGE_WIDTH = 900;
const STAGE_HEIGHT = 600;

const MapStage = ({
  stageRef,
  mapImage,
  scale,
  position,
  handleWheel,
  children,
  onStageMouseDown,
  onStageMouseMove,
  onStageMouseUp,
}) => {
  return (
    <div
      style={{
        width: STAGE_WIDTH,
        height: STAGE_HEIGHT,
        border: "2px solid #2563eb",
        overflow: "hidden",
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
        onWheel={handleWheel}
        onContextMenu={(e) => {
          // prevent default right-click menu on stage
          e.evt.preventDefault();
          if (onStageRightClick) {
            const pointer = stageRef.current.getPointerPosition();
            onStageRightClick(pointer.x, pointer.y, e.target);
          }
        }}
        onMouseDown={(e) => {
          // only treat left button
          if (e.evt.button !== 0) return;
          const pointer = stageRef.current.getPointerPosition();
          // Apply inverse transformation to account for zoom and pan
          const transformedX = (pointer.x - position.x) / scale;
          const transformedY = (pointer.y - position.y) / scale;
          if (onStageMouseDown) {
            // forward target so caller can decide what to do
            onStageMouseDown(transformedX, transformedY, e.target);
          }
        }}
        onMouseMove={(e) => {
          if (e.evt.button !== 0) return;
          const pointer = stageRef.current.getPointerPosition();
          // Apply inverse transformation to account for zoom and pan
          const transformedX = (pointer.x - position.x) / scale;
          const transformedY = (pointer.y - position.y) / scale;
          if (onStageMouseMove) {
            onStageMouseMove(transformedX, transformedY, e.target);
          }
        }}
        onMouseUp={(e) => {
          if (e.evt.button !== 0) return;
          const pointer = stageRef.current.getPointerPosition();
          // Apply inverse transformation to account for zoom and pan
          const transformedX = (pointer.x - position.x) / scale;
          const transformedY = (pointer.y - position.y) / scale;
          if (onStageMouseUp) {
            onStageMouseUp(transformedX, transformedY, e.target);
          }
        }}
      >
        {/* Background */}
        <Layer>
          <Rect
            x={0}
            y={0}
            width={STAGE_WIDTH}
            height={STAGE_HEIGHT}
            fill="white"
          />
          <MapLayer mapImage={mapImage} />
        </Layer>

        {/* Drawing Layer (Future Proof) */}
        <Layer>{children}</Layer>
      </Stage>
    </div>
  );
};

export default MapStage;
