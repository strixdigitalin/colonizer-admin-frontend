const ShapeToolbar = ({
  selectedTool,
  setSelectedTool,
  onDelete,
  onCopy,
  onPaste,
  selectedShape,
  onColorChange,
}) => {
  return (
    <div className="flex gap-2 mb-3 items-center">
      <div className="flex gap-2">
        <button
          onClick={() => setSelectedTool("normal")}
          className={
            selectedTool === "normal"
              ? "bg-blue-500 text-white px-3 py-1"
              : "px-3 py-1 bg-gray-200"
          }
        >
          Rect
        </button>

        <button
          onClick={() => setSelectedTool("rounded")}
          className={
            selectedTool === "rounded"
              ? "bg-blue-500 text-white px-3 py-1"
              : "px-3 py-1 bg-gray-200"
          }
        >
          Rounded
        </button>

        <button
          onClick={() => setSelectedTool("custom")}
          className={
            selectedTool === "custom"
              ? "bg-blue-500 text-white px-3 py-1"
              : "px-3 py-1 bg-gray-200"
          }
        >
          Custom
        </button>

        <button
          onClick={() => setSelectedTool("line")}
          className={
            selectedTool === "line"
              ? "bg-blue-500 text-white px-3 py-1"
              : "px-3 py-1 bg-gray-200"
          }
        >
          Line
        </button>
        <button
          onClick={() => setSelectedTool("pencil")}
          className={
            selectedTool === "pencil"
              ? "bg-blue-500 text-white px-3 py-1"
              : "px-3 py-1 bg-gray-200"
          }
        >
          Pencil
        </button>
        <button
          onClick={() => setSelectedTool("rect-draw")}
          className={
            selectedTool === "rect-draw"
              ? "bg-blue-500 text-white px-3 py-1"
              : "px-3 py-1 bg-gray-200"
          }
        >
          Rect Draw
        </button>
        <button
          onClick={() => setSelectedTool("text")}
          className={
            selectedTool === "text"
              ? "bg-blue-500 text-white px-3 py-1"
              : "px-3 py-1 bg-gray-200"
          }
        >
          Text
        </button>
        <button
          onClick={() => setSelectedTool(null)}
          className="px-3 py-1 bg-gray-300 text-black"
        >
          Deselect
        </button>
      </div>

      <div className="flex gap-2 items-center ml-4">
        <button
          onClick={onCopy}
          className="px-3 py-1 bg-yellow-400 text-black rounded"
        >
          Copy
        </button>
        <button
          onClick={onPaste}
          className="px-3 py-1 bg-green-500 text-white rounded"
        >
          Paste
        </button>
        <button
          onClick={onDelete}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          Delete
        </button>
      </div>

      <div className="flex items-center gap-2 ml-4">
        <label className="text-sm">Color:</label>
        <input
          type="color"
          value={selectedShape?.fill || selectedShape?.stroke || "#7dd3fc"}
          onChange={(e) => onColorChange && onColorChange(e.target.value)}
          className="w-10 h-8 p-0 border-0"
        />
      </div>
    </div>
  );
};

export default ShapeToolbar;
