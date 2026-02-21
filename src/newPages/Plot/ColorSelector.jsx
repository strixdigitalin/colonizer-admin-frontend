import React from "react";

const colors = ["green", "yellow", "red"];

const ColorSelector = ({ selectedColor, setSelectedColor }) => {
  return (
    <div className="flex gap-4 my-4">
      {colors.map((color) => (
        <button
          key={color}
          onClick={() => setSelectedColor(color)}
          className={`w-8 h-8 rounded-full border-2 ${
            selectedColor === color ? "border-black" : "border-gray-300"
          }`}
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
};

export default ColorSelector;
