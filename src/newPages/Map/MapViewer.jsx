import React, { useRef, useState } from "react";
import { Line, Circle } from "react-konva";
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
  const [polygonPoints, setPolygonPoints] = useState([]);
  const [mousePos, setMousePos] = useState(null); 
  const SNAP_DISTANCE = 20;

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
    addLinkedText,
    updateLinkedText,
    removeLinkedText,
    addPolygon,
  } = useShapes();

  const { scale, position, zoomIn, zoomOut, resetZoom, handleWheel } =
    useZoom(stageRef);

  const [drawingPoints, setDrawingPoints] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [includeBackground, setIncludeBackground] = useState(true);

  // rectangle draw state
  const [rectStart, setRectStart] = useState(null);
  const [rectPreview, setRectPreview] = useState(null);

  const exportCanvas = () => {
    if (!stageRef.current) return;
    const stage = stageRef.current;

    // Toggle background visibility based on user choice
    const bgLayer = stage.children[0];
    if (bgLayer) {
      bgLayer.visible(!includeBackground);
      stage.draw();
    }

    const dataURL = stage.toDataURL({ pixelRatio: 2 });

    // restore background visibility
    if (bgLayer) {
      bgLayer.visible(true);
      stage.draw();
    }

    // download the image
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = `canvas-export-${Date.now()}.png`;
    link.click();
  };

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
        onExport={exportCanvas}
        selectedShape={shapes.find((s) => s.id === selectedId)}
        onColorChange={(color) =>
          // selectedId && updateShape(selectedId, { fill: color, stroke: color })
          {
            if (!selectedId) return;
            const shape = shapes.find((s) => s.id === selectedId);
            if (shape?.type === "polygon") {
              // Polygon ke liye fill alag se update karo, stroke alag
              updateShape(selectedId, { fill: color });
            } else {
              updateShape(selectedId, { fill: color, stroke: color });
            }
          }
        }
        onFontSizeChange={(size) =>
          selectedId && updateShape(selectedId, { fontSize: size })
        }
        onFontFamilyChange={(family) =>
          selectedId && updateShape(selectedId, { fontFamily: family })
        }
        includeBackground={includeBackground}
        onBackgroundToggle={setIncludeBackground}
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

          if (selectedTool === "polygon") {
            if (polygonPoints.length >= 4) {
              // Check karo kya pehle point ke paas click kiya
              const firstX = polygonPoints[0];
              const firstY = polygonPoints[1];

              // adjust threshold for current zoom so the hit area stays
              // approximately SNAP_DISTANCE pixels on screen
              const snapDist = SNAP_DISTANCE / scale;
              const dist = Math.hypot(x - firstX, y - firstY);

              if (dist <= snapDist) {
                // Close the polygon!
                addPolygon(polygonPoints, {
                  stroke: "#2b6cb0",
                  fill: "rgba(43,108,176,0.15)",
                });
                setPolygonPoints([]); // reset
                setMousePos(null);
                return;
              }
            }
            // Naya point add karo
            setPolygonPoints((prev) => [...prev, x, y]);
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

          if (selectedTool === "polygon") {
            setMousePos({ x, y });
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
        {selectedTool === "polygon" &&
          polygonPoints.length >= 2 &&
          mousePos && (
            <>
              {/* Confirmed lines + live preview line */}
              <Line
                points={[...polygonPoints, mousePos.x, mousePos.y]}
                stroke="#2b6cb0"
                strokeWidth={2}
                dash={[6, 3]}
                lineCap="round"
                lineJoin="round"
                listening={false} // so that the preview doesn't intercept clicks
              />

              {/* Placed points (dots) */}
              {polygonPoints.reduce((acc, val, idx) => {
                if (idx % 2 === 0) {
                  const isFirst = idx === 0;
                  const px = val;
                  const py = polygonPoints[idx + 1];
                  const snapDist = SNAP_DISTANCE / scale;
                  const nearFirst =
                    isFirst &&
                    mousePos &&
                    Math.hypot(mousePos.x - px, mousePos.y - py) <=
                      snapDist;

                  acc.push(
                    <Circle
                      key={idx}
                      x={px}
                      y={py}
                      radius={isFirst ? 8 : 5}
                      fill={nearFirst ? "#22c55e" : "white"}
                      stroke={nearFirst ? "#16a34a" : "#2b6cb0"}
                      strokeWidth={2}
                      listening={false}
                    />,
                  );
                }
                return acc;
              }, [])}
            </>
          )}
      </MapStage>
    </div>
  );
};

export default MapViewer;
