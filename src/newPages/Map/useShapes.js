import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const useShapes = () => {
  const [shapes, setShapes] = useState([]);
  const [selectedTool, setSelectedTool] = useState("normal");
  const [selectedId, setSelectedId] = useState(null);
  const [copiedShape, setCopiedShape] = useState(null);

  const addShape = (x, y) => {
    const base = {
      id: uuidv4(),
      x,
      y,
      rotation: 0,
    };

    let newShape;

    if (selectedTool === "line") {
      newShape = {
        ...base,
        type: "line",
        points: [x, y, x + 100, y],
        stroke: "#2b6cb0",
        strokeWidth: 3,
      };
    } else {
      // default to rect-like
      newShape = {
        ...base,
        type: "rect",
        width: 120,
        height: 80,
        fill: "lightgreen",
        cornerRadius:
          selectedTool === "rounded"
            ? 15
            : selectedTool === "custom"
              ? [0, 20, 40, 60]
              : 0,
      };
    }

    setShapes((prev) => [...prev, newShape]);
    setSelectedId(newShape.id);
  };

  const removeShape = (id) => {
    setShapes((prev) => prev.filter((s) => s.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const updateShape = (id, newAttrs) => {
    setShapes((prev) =>
      prev.map((shape) =>
        shape.id === id ? { ...shape, ...newAttrs } : shape,
      ),
    );
  };

  const copySelected = (id) => {
    const s = shapes.find((sh) => sh.id === id);
    if (s) setCopiedShape({ ...s });
  };

  const pasteCopied = (offset = { x: 20, y: 20 }) => {
    if (!copiedShape) return;
    const newShape = {
      ...copiedShape,
      id: uuidv4(),
      x: copiedShape.x + offset.x,
      y: copiedShape.y + offset.y,
    };
    setShapes((prev) => [...prev, newShape]);
    setSelectedId(newShape.id);
  };

  const addFreehand = (points = [], options = {}) => {
    if (!points || points.length < 4) return;
    const closed = options.closed || false;
    const base = {
      id: uuidv4(),
      x: points[0],
      y: points[1],
      type: "line",
      points,
      stroke: options.stroke || "#222222",
      strokeWidth: options.strokeWidth || 2,
      closed,
      fill: closed ? options.fill || "rgba(0,0,0,0.1)" : undefined,
    };

    setShapes((prev) => [...prev, base]);
    setSelectedId(base.id);
  };

  const addRect = (x, y, width, height, options = {}) => {
    const rect = {
      id: uuidv4(),
      x,
      y,
      type: "rect",
      width: Math.max(1, width),
      height: Math.max(1, height),
      fill: options.fill || "lightgreen",
      cornerRadius: options.cornerRadius || 0,
      rotation: options.rotation || 0,
    };

    setShapes((prev) => [...prev, rect]);
    setSelectedId(rect.id);
  };

  const selectShape = (id) => {
    setSelectedId(id);
  };

  return {
    shapes,
    addShape,
    removeShape,
    updateShape,
    selectedTool,
    setSelectedTool,
    selectedId,
    selectShape,
    copySelected,
    pasteCopied,
    addFreehand,
    addRect,
  };
};

export default useShapes;
