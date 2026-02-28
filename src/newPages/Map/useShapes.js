import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const useShapes = () => {
  const [shapes, setShapes] = useState([]);
  const [selectedTool, _setSelectedTool] = useState("normal");
  const [selectedId, setSelectedId] = useState(null);
  const [copiedShape, setCopiedShape] = useState(null);

  const setSelectedTool = (tool) => {
    setSelectedId(null);
    _setSelectedTool(tool);
  };

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
    const newX = copiedShape.x + offset.x;
    const newY = copiedShape.y + offset.y;
    const dx = newX - copiedShape.x;
    const dy = newY - copiedShape.y;

    let newShape = {
      ...copiedShape,
      id: uuidv4(),
      x: newX,
      y: newY,
    };

    // For line/polygon shapes, adjust points array along with x/y
    if (copiedShape.type === "line" && copiedShape.points) {
      newShape.points = copiedShape.points.map((p, idx) =>
        idx % 2 === 0 ? p + dx : p + dy,
      );
    }

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

  const addText = (x, y, text = "Text", options = {}) => {
    const txt = {
      id: uuidv4(),
      x,
      y,
      type: "text",
      text,
      fontSize: options.fontSize || 20,
      fontFamily: options.fontFamily || "Arial",
      fill: options.fill || "#000",
    };
    setShapes((prev) => [...prev, txt]);
    setSelectedId(txt.id);
  };

  const addLinkedText = (shapeId, text = "", options = {}) => {
    setShapes((prev) =>
      prev.map((shape) =>
        shape.id === shapeId
          ? {
              ...shape,
              linkedText: {
                text: text || "",
                fontSize: options.fontSize || 16,
                fontFamily: options.fontFamily || "Arial",
                fill: options.fill || "#000",
                offsetX: options.offsetX || 0,
                offsetY: options.offsetY || 10,
              },
            }
          : shape,
      ),
    );
  };

  const updateLinkedText = (shapeId, text) => {
    setShapes((prev) =>
      prev.map((shape) =>
        shape.id === shapeId
          ? {
              ...shape,
              linkedText: {
                ...shape.linkedText,
                text,
              },
            }
          : shape,
      ),
    );
  };

  const removeLinkedText = (shapeId) => {
    setShapes((prev) =>
      prev.map((shape) =>
        shape.id === shapeId ? { ...shape, linkedText: null } : shape,
      ),
    );
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
    addText,
    addLinkedText,
    updateLinkedText,
    removeLinkedText,
  };
};

export default useShapes;
