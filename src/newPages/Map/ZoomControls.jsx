import React from "react";

const ZoomControls = ({ zoomIn, zoomOut, resetZoom }) => {
  return (
    <div className="flex gap-2 mb-3">
      <button onClick={zoomIn} className="px-3 py-1 bg-blue-500 text-white rounded">
        Zoom +
      </button>
      <button onClick={zoomOut} className="px-3 py-1 bg-blue-500 text-white rounded">
        Zoom -
      </button>
      <button onClick={resetZoom} className="px-3 py-1 bg-gray-300 rounded">
        Reset
      </button>
    </div>
  );
};

export default ZoomControls;