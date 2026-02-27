import { useState } from "react";

const STAGE_WIDTH = 900;
const STAGE_HEIGHT = 600;

const MIN_SCALE = 0.5;
const MAX_SCALE = 3;
const ZOOM_STEP = 0.2;

const useZoom = (stageRef) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

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

  /* =======================
     Mouse Wheel Zoom
  ======================== */
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

    setPosition(constrainPosition(newPos, newScale));
  };

  /* =======================
     Button Zoom (Center)
  ======================== */
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

    setPosition(constrainPosition(newPos, newScale));
  };

  const zoomIn = () => zoom(1);
  const zoomOut = () => zoom(-1);

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return {
    scale,
    position,
    zoomIn,
    zoomOut,
    resetZoom,
    handleWheel,
  };
};

export default useZoom;