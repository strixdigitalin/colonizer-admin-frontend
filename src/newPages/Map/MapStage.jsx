import React from "react";
import { Stage, Layer } from "react-konva";
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
          if (e.target === e.target.getStage() && onStageRightClick) {
            const pointer = stageRef.current.getPointerPosition();
            onStageRightClick(pointer.x, pointer.y);
          }
        }}
        onMouseDown={(e) => {
          // only treat left button
          if (e.evt.button !== 0) return;
          if (e.target === e.target.getStage() && onStageMouseDown) {
            const pointer = stageRef.current.getPointerPosition();
            onStageMouseDown(pointer.x, pointer.y);
          }
        }}
        onMouseMove={(e) => {
          if (e.evt.button !== 0) return;
          if (e.target === e.target.getStage() && onStageMouseMove) {
            const pointer = stageRef.current.getPointerPosition();
            onStageMouseMove(pointer.x, pointer.y);
          }
        }}
        onMouseUp={(e) => {
          if (e.evt.button !== 0) return;
          if (e.target === e.target.getStage() && onStageMouseUp) {
            const pointer = stageRef.current.getPointerPosition();
            onStageMouseUp(pointer.x, pointer.y);
          }
        }}
      >
        {/* Background */}
        <Layer>
          <MapLayer mapImage={mapImage} />
        </Layer>

        {/* Drawing Layer (Future Proof) */}
        <Layer>{children}</Layer>
      </Stage>
    </div>
  );
};

export default MapStage;
