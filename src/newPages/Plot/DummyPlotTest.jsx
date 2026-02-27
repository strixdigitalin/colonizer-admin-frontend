import React, { useState, useRef, useEffect } from "react";
import {
  Stage,
  Layer,
  Rect,
  Line,
  Image as KonvaImage,
  Transformer,
} from "react-konva";
import useImage from "use-image";
import { v4 as uuidv4 } from "uuid";

const WIDTH = 900;
const HEIGHT = 600;

export default function AdvancedCanvas({ imageUrl }) {
  const stageRef = useRef();
  const trRef = useRef();
  const [image] = useImage(imageUrl);

  const [tool, setTool] = useState("select"); 
  const [drawing, setDrawing] = useState(false);
  const [shapes, setShapes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [color, setColor] = useState("#0080ff");

  /* -------------------- MOUSE DOWN -------------------- */
  const handleMouseDown = (e) => {
    if (tool === "select") {
      if (e.target === e.target.getStage()) {
        setSelectedId(null);
      } else {
        setSelectedId(e.target.id());
      }
      return;
    }

    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    const id = uuidv4();

    if (tool === "rect" || tool === "square") {
      setShapes((prev) => [
        ...prev,
        {
          id,
          type: "rect",
          x: pos.x,
          y: pos.y,
          width: 0,
          height: 0,
          fill: color,
        },
      ]);
    }

    if (tool === "line") {
      setShapes((prev) => [
        ...prev,
        {
          id,
          type: "line",
          points: [pos.x, pos.y, pos.x, pos.y],
          stroke: color,
          strokeWidth: 3,
        },
      ]);
    }

    if (tool === "free") {
      setShapes((prev) => [
        ...prev,
        {
          id,
          type: "free",
          points: [pos.x, pos.y],
          stroke: color,
          strokeWidth: 3,
        },
      ]);
    }

    setDrawing(true);
  };

  /* -------------------- MOUSE MOVE -------------------- */
  const handleMouseMove = (e) => {
    if (!drawing) return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();

    setShapes((prev) => {
      const last = prev[prev.length - 1];

      if (last.type === "rect") {
        let width = point.x - last.x;
        let height = point.y - last.y;

        if (tool === "square") {
          const size = Math.max(Math.abs(width), Math.abs(height));
          width = width < 0 ? -size : size;
          height = height < 0 ? -size : size;
        }

        last.width = width;
        last.height = height;
      }

      if (last.type === "line") {
        last.points = [last.points[0], last.points[1], point.x, point.y];
      }

      if (last.type === "free") {
        last.points = last.points.concat([point.x, point.y]);
      }

      return [...prev.slice(0, -1), last];
    });
  };

  const handleMouseUp = () => setDrawing(false);

  /* -------------------- TRANSFORMER -------------------- */
  useEffect(() => {
    const transformer = trRef.current;
    const stage = stageRef.current;
    const selectedNode = stage.findOne(`#${selectedId}`);

    if (selectedNode) {
      transformer.nodes([selectedNode]);
      transformer.getLayer().batchDraw();
    } else {
      transformer.nodes([]);
    }
  }, [selectedId]);

  /* -------------------- DELETE -------------------- */
  const handleDelete = () => {
    setShapes((prev) => prev.filter((s) => s.id !== selectedId));
    setSelectedId(null);
  };

  return (
    <div className="p-4">
      {/* TOOLBAR */}
      <div className="flex gap-2 mb-3 flex-wrap">
        <button onClick={() => setTool("select")}>Select</button>
        <button onClick={() => setTool("rect")}>Rectangle</button>
        <button onClick={() => setTool("square")}>Square</button>
        <button onClick={() => setTool("line")}>Line</button>
        <button onClick={() => setTool("free")}>Free Draw</button>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        <button onClick={handleDelete} className="bg-red-500 text-white px-2">
          Delete
        </button>
      </div>

      {/* CANVAS */}
      <Stage
        width={WIDTH}
        height={HEIGHT}
        ref={stageRef}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ border: "2px solid #1e40af" }}
      >
        <Layer>
          {image && (
            <KonvaImage
              image={image}
              width={WIDTH}
              height={HEIGHT}
              listening={false}
            />
          )}

          {shapes.map((shape) => {
            if (shape.type === "rect") {
              return (
                <Rect
                  key={shape.id}
                  id={shape.id}
                  {...shape}
                  draggable
                  onClick={() => setSelectedId(shape.id)}
                />
              );
            }

            return (
              <Line
                key={shape.id}
                id={shape.id}
                {...shape}
                lineCap="round"
                lineJoin="round"
                draggable
                onClick={() => setSelectedId(shape.id)}
              />
            );
          })}

          <Transformer ref={trRef} />
        </Layer>
      </Stage>
    </div>
  );
}