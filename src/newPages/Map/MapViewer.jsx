import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import useMapImage from "./useMapImage";
import useZoom from "./useZoom";
import ZoomControls from "./ZoomControls";
import MapStage from "./MapStage";
import useShapes from "./useShapes";
import ShapeToolbar from "./ShapeToolbar";
import EditableShape from "./EditableShape";

const MapViewer = ({ token }) => {
  const { id: colonyId } = useParams();
  const stageRef = useRef();

  const { mapImage, loading } = useMapImage(colonyId, token);

  const { shapes, addShape, selectedTool, setSelectedTool } = useShapes();

  const { scale, position, zoomIn, zoomOut, resetZoom, handleWheel } =
    useZoom(stageRef);

  if (loading) return <p>Loading map...</p>;

  return (
    <div className="border p-4 bg-white rounded-xl shadow">
      <ZoomControls zoomIn={zoomIn} zoomOut={zoomOut} resetZoom={resetZoom} />

      <ShapeToolbar
        selectedTool={selectedTool}
        setSelectedTool={setSelectedTool}
      />

      <MapStage
        stageRef={stageRef}
        mapImage={mapImage}
        scale={scale}
        position={position}
        handleWheel={handleWheel}
        onStageClick={(x, y) => addShape(x, y)}
      >
        {shapes.map((shape) => (
          <EditableShape key={shape.id} shape={shape} />
        ))}
      </MapStage>
    </div>
  );
};

export default MapViewer;
