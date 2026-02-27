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
  onStageClick,
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
        onMouseDown={(e) => {
          if (e.target === e.target.getStage()) {
            const pointer = stageRef.current.getPointerPosition();
            onStageClick(pointer.x, pointer.y);
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
