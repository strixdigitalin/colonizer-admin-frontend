import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const useShapes = () => {
  const [shapes, setShapes] = useState([]);
  const [selectedTool, _setSelectedTool] = useState("normal");
  const [selectedId, setSelectedId] = useState(null);
  const [copiedShape, setCopiedShape] = useState(null);

  // console.log(shapes)

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
    } else if (selectedTool === "recttext") {
      newShape = {
        ...base,
        type: "recttext",
        width: 120,
        height: 80,
        text: "Text",
        fontSize: 20,
        fontFamily: "Arial",
        textFill: "#000",
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
    // setShapes((prev) =>
    //   prev.map((shape) =>
    //     shape.id === id ? { ...shape, ...newAttrs } : shape,
    //   ),
    // );
    setShapes((prev) => {
      const updated = prev.map((shape) =>
        shape.id === id ? { ...shape, ...newAttrs } : shape,
      );

      // isBackground wale shapes ko array ke start mein rakho (render mein pehle = neeche)
      return [
        ...updated.filter((s) => s.isBackground),
        ...updated.filter((s) => !s.isBackground),
      ];
    });
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

  const addRectText = (x, y, width, height, text = "Text", options = {}) => {
    const rectText = {
      id: uuidv4(),
      x,
      y,
      type: "recttext",
      width: Math.max(1, width),
      height: Math.max(1, height),
      text: text || "",
      fontSize: options.fontSize || 20,
      fontFamily: options.fontFamily || "Arial",
      textFill: options.fill || "#000",
      rotation: options.rotation || 0,
    };
    setShapes((prev) => [...prev, rectText]);
    setSelectedId(rectText.id);
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

  const addPolygon = (points = [], options = {}) => {
    if (!points || points.length < 6) return; // minimum 3 points
    const shape = {
      id: uuidv4(),
      x: 0,
      y: 0,
      type: options.type || "polygon",
      points,
      stroke: options.stroke || "#2b6cb0",
      strokeWidth: options.strokeWidth || 2,
      fill: options.fill || "rgba(43,108,176,0.15)",
      closed: true,
      zoneType: options.zoneType || "boundary", // boundary | park | road | water | commercial | residential | other
      isBackground: options.isBackground || false, // background layer mein shift karo
    };
    setShapes((prev) => [...prev, shape]);
    setSelectedId(shape.id);
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

  // Break a single rect into a rows×cols grid of sub-rects in-place
  const breakGridRect = (id, cols, rows, startNum = 1) => {
    setShapes((prev) => {
      const shape = prev.find((s) => s.id === id);
      if (!shape || shape.type !== "rect") return prev;

      const subW = shape.width / cols;
      const subH = shape.height / rows;
      const rotRad = ((shape.rotation || 0) * Math.PI) / 180;
      const cosR = Math.cos(rotRad);
      const sinR = Math.sin(rotRad);

      const newShapes = [];
      let num = startNum;
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const localX = col * subW;
          const localY = row * subH;
          const rotX = localX * cosR - localY * sinR;
          const rotY = localX * sinR + localY * cosR;

          newShapes.push({
            id: uuidv4(),
            type: "rect",
            x: shape.x + rotX,
            y: shape.y + rotY,
            width: subW,
            height: subH,
            fill: shape.fill,
            cornerRadius: shape.cornerRadius || 0,
            rotation: shape.rotation || 0,
            linkedText: {
              text: String(num),
              fontSize: 16,
              fontFamily: "Arial",
              fill: "#000",
              offsetX: 0,
              offsetY: 10,
            },
          });
          num++;
        }
      }

      const filtered = prev.filter((s) => s.id !== id);
      return [...filtered, ...newShapes];
    });
    setSelectedId(null);
  };

  return {
    shapes,
    addShape,
    setShapes,
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
    addRectText,
    addText,
    addLinkedText,
    updateLinkedText,
    removeLinkedText,
    addPolygon,
    breakGridRect,
  };
};

export default useShapes;
