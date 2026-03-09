import React from "react";

const ZoomControls = ({ zoomIn, zoomOut, resetZoom, uploadMapImage }) => {
  return (
    <div className="flex gap-2 mb-3">
      <button
        onClick={zoomIn}
        className="px-3 py-1 bg-blue-500 text-white rounded"
      >
        Zoom +
      </button>
      <button
        onClick={zoomOut}
        className="px-3 py-1 bg-blue-500 text-white rounded"
      >
        Zoom -
      </button>
      <button onClick={resetZoom} className="px-3 py-1 bg-gray-300 rounded">
        Reset
      </button>
      <label className="flex items-center px-4 py-2 bg-white rounded-md shadow-md">
        <span className="mr-2">Upload Map Image</span>
        <input type="file" accept="image/*" onChange={e => uploadMapImage(e.target.files?.[0])} />
      </label>
    </div>
  );
};

export default ZoomControls;
