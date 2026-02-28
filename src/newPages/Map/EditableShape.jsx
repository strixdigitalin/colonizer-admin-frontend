import React, { useRef, useEffect } from "react";
import { Rect, Transformer, Line, Circle, Text } from "react-konva";

const EditableShape = ({
  shape,
  isSelected,
  onSelect,
  updateShape,
  removeShape,
  copyShape,
}) => {
  const shapeRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  if (shape.type === "line") {
    return (
      <>
        <Line
          points={shape.points}
          ref={shapeRef}
          stroke={shape.stroke}
          strokeWidth={shape.strokeWidth || 2}
          closed={shape.closed}
          fill={shape.fill}
          draggable
          onClick={() => onSelect(shape.id)}
          onTap={() => onSelect(shape.id)}
          onDragEnd={(e) => {
            const dx = e.target.x() - (shape.x || 0);
            const dy = e.target.y() - (shape.y || 0);
            const newPoints = shape.points.map((p, idx) =>
              idx % 2 === 0 ? p + dx : p + dy,
            );
            updateShape(shape.id, {
              points: newPoints,
              x: e.target.x(),
              y: e.target.y(),
            });
          }}
          onTransformEnd={(e) => {
            const node = shapeRef.current;
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();

            const x = node.x();
            const y = node.y();

            node.scaleX(1);
            node.scaleY(1);

            const newPoints = shape.points.map((p, idx) =>
              idx % 2 === 0 ? p * scaleX : p * scaleY,
            );

            updateShape(shape.id, { points: newPoints, x, y });
          }}
        />
        {isSelected &&
          shape.points.reduce((acc, val, idx) => {
            if (idx % 2 === 0) {
              const vx = val;
              const vy = shape.points[idx + 1];
              acc.push(
                <Circle
                  key={idx}
                  x={vx}
                  y={vy}
                  radius={6}
                  fill="white"
                  stroke="black"
                  strokeWidth={1}
                  draggable
                  onDragMove={(e) => {
                    const pos = e.target.position();
                    const pts = [...shape.points];
                    pts[idx] = pos.x;
                    pts[idx + 1] = pos.y;
                    updateShape(shape.id, { points: pts });
                  }}
                />,
              );
            }
            return acc;
          }, [])}
        {isSelected && (
          <Transformer
            ref={trRef}
            rotateEnabled
            enabledAnchors={[
              "top-left",
              "top-right",
              "bottom-left",
              "bottom-right",
              "middle-left",
              "middle-right",
              "top-center",
              "bottom-center",
            ]}
          />
        )}
      </>
    );
  }
  if (shape.type === "text") {
    return (
      <>
        <Text
          text={shape.text}
          x={shape.x}
          y={shape.y}
          fontSize={shape.fontSize}
          fontFamily={shape.fontFamily}
          fill={shape.fill}
          ref={shapeRef}
          draggable
          onClick={() => onSelect(shape.id)}
          onTap={() => onSelect(shape.id)}
          onDblClick={() => {
            const newText = window.prompt("Edit text", shape.text);
            if (newText != null) {
              updateShape(shape.id, { text: newText });
            }
          }}
          onDragEnd={(e) => {
            updateShape(shape.id, { x: e.target.x(), y: e.target.y() });
          }}
          onTransformEnd={(e) => {
            const node = shapeRef.current;
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();
            // apply scale to font size
            const newFontSize = Math.max(5, shape.fontSize * scaleY);
            node.scaleX(1);
            node.scaleY(1);
            updateShape(shape.id, {
              x: node.x(),
              y: node.y(),
              fontSize: newFontSize,
            });
          }}
        />
        {isSelected && (
          <Transformer
            ref={trRef}
            enabledAnchors={[
              "top-left",
              "top-right",
              "bottom-left",
              "bottom-right",
            ]}
          />
        )}
      </>
    );
  }

  return (
    <>
      <Rect
        {...{
          x: shape.x,
          y: shape.y,
          width: shape.width,
          height: shape.height,
          fill: shape.fill,
          cornerRadius: shape.cornerRadius,
          rotation: shape.rotation,
        }}
        ref={shapeRef}
        draggable
        onClick={() => onSelect(shape.id)}
        onTap={() => onSelect(shape.id)}
        onDblClick={() => {
          const txt = window.prompt(
            "Add text to shape",
            shape.linkedText?.text || "",
          );
          if (txt != null) {
            updateShape(shape.id, {
              linkedText: {
                ...shape.linkedText,
                text: txt,
                fontSize: shape.linkedText?.fontSize || 16,
                fontFamily: shape.linkedText?.fontFamily || "Arial",
                fill: shape.linkedText?.fill || "#000",
                offsetX: shape.linkedText?.offsetX || 0,
                offsetY: shape.linkedText?.offsetY || 10,
              },
            });
          }
        }}
        onDragEnd={(e) => {
          updateShape(shape.id, { x: e.target.x(), y: e.target.y() });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          // reset scale back to 1
          node.scaleX(1);
          node.scaleY(1);

          updateShape(shape.id, {
            x: node.x(),
            y: node.y(),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(5, node.height() * scaleY),
            rotation: node.rotation(),
          });
        }}
      />

      {shape.linkedText && shape.linkedText.text && (
        <Text
          text={shape.linkedText.text}
          x={shape.x}
          y={shape.y}
          width={shape.width}
          height={shape.height}
          fontSize={Math.max(8, Math.min(shape.width, shape.height) * 0.25)}
          fontFamily={shape.linkedText.fontFamily || "Arial"}
          fill={shape.linkedText.fill || "#000"}
          align="center"
          verticalAlign="middle"
          rotation={0}
          listening={false}
          onDblClick={() => {
            const newText = window.prompt("Edit text", shape.linkedText.text);
            if (newText != null) {
              updateShape(shape.id, {
                linkedText: {
                  ...shape.linkedText,
                  text: newText,
                },
              });
            }
          }}
        />
      )}

      {isSelected && (
        <Transformer
          ref={trRef}
          rotateEnabled
          enabledAnchors={[
            "top-left",
            "top-right",
            "bottom-left",
            "bottom-right",
            "middle-left",
            "middle-right",
            "top-center",
            "bottom-center",
          ]}
        />
      )}
    </>
  );
};

export default EditableShape;
