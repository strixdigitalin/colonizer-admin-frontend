import React, { useRef, useEffect } from "react";
import { Rect, Transformer, Line, Circle, Text } from "react-konva";

const STATUS_COLORS = {
  available: "rgba(0, 238, 87, 0.9)",
  hold: "rgba(243, 187, 19, 0.4)",
  sold: "rgba(252, 66, 66, 0.4)",
};

const EditableShape = ({
  shape,
  isSelected,
  currentTool = "normal", // tool currently active in parent
  onSelect,
  updateShape,
  removeShape,
  copyShape,
}) => {
  const shapeRef = useRef();
  const trRef = useRef();

  const resolvedFill = shape.status ? STATUS_COLORS[shape.status] : shape.fill;

  // when a drawing tool is active we don't want shapes to steal
  // single-clicks; also polygons should require a double-click to
  // become selected even in 'normal' mode.
  const allowSingleClick =
    currentTool === "normal" &&
    shape.type !== "polygon" &&
    shape.type !== "custom";

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
          // fill={shape.fill}
          fill={resolvedFill}
          draggable
          onClick={() => {
            if (allowSingleClick) onSelect(shape.id);
          }}
          onTap={() => {
            if (allowSingleClick) onSelect(shape.id);
          }}
          onDblClick={() => {
            onSelect(shape.id);
          }}
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
          id={shape.id}
          text={shape.text}
          x={shape.x}
          y={shape.y}
          fontSize={shape.fontSize}
          fontFamily={shape.fontFamily}
          fill={shape.fill}
          ref={shapeRef}
          draggable
          onClick={() => {
            if (allowSingleClick) onSelect(shape.id);
          }}
          onTap={() => {
            if (allowSingleClick) onSelect(shape.id);
          }}
          onDblClick={() => {
            // ensure selection then open edit prompt
            onSelect(shape.id);
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

  if (shape.type === "polygon" || shape.type === "custom") {
    // compute bounding box from points for centered text
    const xs = shape.points.filter((_, i) => i % 2 === 0);
    const ys = shape.points.filter((_, i) => i % 2 !== 0);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const bboxW = maxX - minX;
    const bboxH = maxY - minY;

    return (
      <>
        <Line
          points={shape.points}
          ref={shapeRef}
          stroke={shape.stroke}
          strokeWidth={shape.strokeWidth || 2}
          closed={true}
          fill={shape.fill}
          // fill={resolvedFill}
          draggable
          x={shape.x || 0}
          y={shape.y || 0}
          rotation={shape.rotation || 0}
          // draggable={!shape.isBackground}
          // listening={!shape.isBackground}
          // opacity={shape.isBackground ? 0.8 : 1}
          onClick={() => {
            if (allowSingleClick) onSelect(shape.id);
          }}
          onTap={() => {
            if (allowSingleClick) onSelect(shape.id);
          }}
          onDblClick={() => {
            onSelect(shape.id);
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
                },
              });
            }
          }}
          onDragEnd={(e) => {
            const dx = e.target.x();
            const dy = e.target.y();
            updateShape(shape.id, { x: dx, y: dy });
          }}
          onTransformEnd={(e) => {
            const node = shapeRef.current;
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();
            node.scaleX(1);
            node.scaleY(1);
            const newPoints = shape.points.map((p, idx) =>
              idx % 2 === 0 ? p * scaleX : p * scaleY,
            );
            updateShape(shape.id, {
              points: newPoints,
              x: node.x(),
              y: node.y(),
              rotation: node.rotation(),
            });
          }}
        />

        {shape.linkedText && shape.linkedText.text && (
          <Text
            text={shape.linkedText.text}
            x={shape.x || 0}
            y={shape.y || 0}
            offsetX={-minX}
            offsetY={-minY}
            width={bboxW}
            height={bboxH}
            rotation={shape.rotation || 0}
            fontSize={Math.max(8, Math.min(bboxW, bboxH) * 0.25)}
            fontFamily={shape.linkedText.fontFamily || "Arial"}
            fill={shape.linkedText.fill || "#000"}
            align="center"
            verticalAlign="middle"
            listening={false}
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
            ]}
          />
        )}
      </>
    );
  }

  return (
    <>
      <Rect
        id={shape.id}
        {...{
          x: shape.x,
          y: shape.y,
          width: shape.width,
          height: shape.height,
          // fill: shape.fill,
          fill: resolvedFill,
          cornerRadius: shape.cornerRadius,
          rotation: shape.rotation,
        }}
        ref={shapeRef}
        draggable
        onClick={() => {
          if (allowSingleClick) onSelect(shape.id);
        }}
        onTap={() => {
          if (allowSingleClick) onSelect(shape.id);
        }}
        onDblClick={() => {
          onSelect(shape.id);
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
          fontSize={Math.max(4, Math.min(shape.width, shape.height) * 0.25)}
          fontFamily={shape.linkedText.fontFamily || "Arial"}
          fill={shape.linkedText.fill || "#000"}
          align="center"
          verticalAlign="middle"
          rotation={shape.rotation}
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
