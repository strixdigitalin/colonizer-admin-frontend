import React from "react";
import { Rect } from "react-konva";

const RectPreview = ({ rect }) => {
  if (!rect) return null;
  const x = rect.width < 0 ? rect.x + rect.width : rect.x;
  const y = rect.height < 0 ? rect.y + rect.height : rect.y;
  const width = Math.abs(rect.width);
  const height = Math.abs(rect.height);

  return (
    <Rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill="rgba(34,197,94,0.15)"
      stroke="#22c55e"
      strokeWidth={2}
    />
  );
};

export default RectPreview;
