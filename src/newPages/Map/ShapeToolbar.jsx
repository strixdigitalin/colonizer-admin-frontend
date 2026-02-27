const ShapeToolbar = ({ selectedTool, setSelectedTool }) => {
  return (
    <div className="flex gap-2 mb-3">
      <button
        onClick={() => setSelectedTool("normal")}
        className={selectedTool === "normal" ? "bg-blue-500 text-white px-3 py-1" : "px-3 py-1 bg-gray-200"}
      >
        Normal
      </button>

      <button
        onClick={() => setSelectedTool("rounded")}
        className={selectedTool === "rounded" ? "bg-blue-500 text-white px-3 py-1" : "px-3 py-1 bg-gray-200"}
      >
        Rounded
      </button>

      <button
        onClick={() => setSelectedTool("custom")}
        className={selectedTool === "custom" ? "bg-blue-500 text-white px-3 py-1" : "px-3 py-1 bg-gray-200"}
      >
        Custom Corners
      </button>
    </div>
  );
};

export default ShapeToolbar;