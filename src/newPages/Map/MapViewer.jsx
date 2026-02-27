import React, { useRef, useState } from "react";
import { Line } from "react-konva";
import { useParams } from "react-router-dom";
import useMapImage from "./useMapImage";
import useZoom from "./useZoom";
import ZoomControls from "./ZoomControls";
import MapStage from "./MapStage";
import useShapes from "./useShapes";
import RectPreview from "./RectPreview";
import ShapeToolbar from "./ShapeToolbar";
import EditableShape from "./EditableShape";

const MapViewer = ({ token }) => {
  const { id: colonyId } = useParams();
  const stageRef = useRef();

  const { mapImage, loading } = useMapImage(colonyId, token);

  const {
    shapes,
    addShape,
    selectedTool,
    setSelectedTool,
    selectedId,
    selectShape,
    updateShape,
    removeShape,
    copySelected,
    pasteCopied,
    addFreehand,
    addRect,
    addText,
  } = useShapes();

  const { scale, position, zoomIn, zoomOut, resetZoom, handleWheel } =
    useZoom(stageRef);

  const [drawingPoints, setDrawingPoints] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // rectangle draw state
  const [rectStart, setRectStart] = useState(null);
  const [rectPreview, setRectPreview] = useState(null);

  // keyboard shortcuts (Delete, Ctrl/Cmd+C, Ctrl/Cmd+V)
  React.useEffect(() => {
    const handler = (e) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const meta = isMac ? e.metaKey : e.ctrlKey;

      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedId) removeShape(selectedId);
      }

      if ((meta && e.key === "c") || (meta && e.key === "C")) {
        if (selectedId) copySelected(selectedId);
      }

      if ((meta && e.key === "v") || (meta && e.key === "V")) {
        pasteCopied();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedId, removeShape, copySelected, pasteCopied]);

  if (loading) return <p>Loading map...</p>;

  return (
    <div className="border p-4 bg-white rounded-xl shadow">
      <ZoomControls zoomIn={zoomIn} zoomOut={zoomOut} resetZoom={resetZoom} />

      <ShapeToolbar
        selectedTool={selectedTool}
        setSelectedTool={setSelectedTool}
        onDelete={() => selectedId && removeShape(selectedId)}
        onCopy={() => selectedId && copySelected(selectedId)}
        onPaste={() => pasteCopied()}
        selectedShape={shapes.find((s) => s.id === selectedId)}
        onColorChange={(color) =>
          selectedId && updateShape(selectedId, { fill: color, stroke: color })
        }
        onFontSizeChange={(size) =>
          selectedId && updateShape(selectedId, { fontSize: size })
        }
        onFontFamilyChange={(family) =>
          selectedId && updateShape(selectedId, { fontFamily: family })
        }
      />

      <MapStage
        stageRef={stageRef}
        mapImage={mapImage}
        scale={scale}
        position={position}
        handleWheel={handleWheel}
        onStageRightClick={(x, y) => {
          // right click clears selection (and prevents default menu)
          selectShape(null);
        }}
        onStageMouseDown={(x, y) => {
          // clicking background should clear any selected shape
          selectShape(null);

          if (!selectedTool) {
            // no active tool, do nothing
            return;
          }

          if (selectedTool === "pencil") {
            setDrawingPoints([x, y]);
            setIsDrawing(true);
            return;
          }

          if (selectedTool === "rect-draw") {
            setRectStart({ x, y });
            setRectPreview({ x, y, width: 0, height: 0 });
            return;
          }

          if (selectedTool === "text") {
            const txt = window.prompt("Enter text", "Text");
            if (txt != null) {
              addText(x, y, txt, { fontSize: 20, fill: "#000" });
            }
            return;
          }

          addShape(x, y);
        }}
        onStageMouseMove={(x, y) => {
          if (isDrawing) {
            setDrawingPoints((prev) => (prev ? [...prev, x, y] : [x, y]));
            return;
          }

          if (rectStart) {
            const sx = rectStart.x;
            const sy = rectStart.y;
            const w = x - sx;
            const h = y - sy;
            setRectPreview({ x: sx, y: sy, width: w, height: h });
            return;
          }
        }}
        onStageMouseUp={(x, y) => {
          if (isDrawing) {
            const pts = drawingPoints || [];
            // include final point
            const finalPts = pts.concat([x, y]);
            const dx = finalPts[0] - finalPts[finalPts.length - 2];
            const dy = finalPts[1] - finalPts[finalPts.length - 1];
            const dist = Math.hypot(dx, dy);
            const closed = dist < 10;
            addFreehand(finalPts, {
              closed,
              stroke: "#2b6cb0",
              fill: closed ? "rgba(43,108,176,0.15)" : undefined,
            });
            setDrawingPoints(null);
            setIsDrawing(false);
            return;
          }

          if (rectStart && rectPreview) {
            const rx =
              rectPreview.width < 0
                ? rectPreview.x + rectPreview.width
                : rectPreview.x;
            const ry =
              rectPreview.height < 0
                ? rectPreview.y + rectPreview.height
                : rectPreview.y;
            const rw = Math.abs(rectPreview.width);
            const rh = Math.abs(rectPreview.height);
            // add rectangle via useShapes helper
            if (rw > 2 && rh > 2) {
              // import addRect from hooks
              try {
                addRect(rx, ry, rw, rh, { fill: "lightgreen" });
              } catch (err) {
                // fallback: use addShape at top-left
                addShape(rx, ry);
              }
            }

            setRectStart(null);
            setRectPreview(null);
            return;
          }
        }}
      >
        {shapes.map((shape) => (
          <EditableShape
            key={shape.id}
            shape={shape}
            isSelected={selectedId === shape.id}
            onSelect={() => selectShape(shape.id)}
            updateShape={(id, attrs) => updateShape(id, attrs)}
            removeShape={() => removeShape(shape.id)}
            copyShape={() => copySelected(shape.id)}
          />
        ))}

        {rectPreview && <RectPreview rect={rectPreview} />}

        {drawingPoints && (
          <Line
            points={drawingPoints}
            stroke="#2b6cb0"
            strokeWidth={2}
            tension={0.4}
            lineCap="round"
            lineJoin="round"
          />
        )}
      </MapStage>
    </div>
  );
};

export default MapViewer;
