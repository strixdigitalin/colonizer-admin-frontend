import React from "react";
import { Rect } from "react-konva";

const EditableShape = ({ shape }) => {
  return (
    <Rect
      {...shape}
      draggable
      cornerRadius={shape.cornerRadius}
      onDragEnd={(e) => {
        shape.x = e.target.x();
        shape.y = e.target.y();
      }}
    />
  );
};

export default EditableShape;