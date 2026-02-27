import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const useShapes = () => {
  const [shapes, setShapes] = useState([]);
  const [selectedTool, setSelectedTool] = useState("normal");

  const addShape = (x, y) => {
    const newShape = {
      id: uuidv4(),
      x,
      y,
      width: 120,
      height: 80,
      fill: "lightgreen",
      type: selectedTool,
      cornerRadius:
        selectedTool === "rounded"
          ? 15
          : selectedTool === "custom"
          ? [0, 20, 40, 60]
          : 0,
    };

    setShapes((prev) => [...prev, newShape]);
  };

  const removeShape = (id) => {
    setShapes((prev) => prev.filter((s) => s.id !== id));
  };

  const updateShape = (id, newAttrs) => {
    setShapes((prev) =>
      prev.map((shape) =>
        shape.id === id ? { ...shape, ...newAttrs } : shape
      )
    );
  };

  return {
    shapes,
    addShape,
    removeShape,
    updateShape,
    selectedTool,
    setSelectedTool,
  };
};

export default useShapes;