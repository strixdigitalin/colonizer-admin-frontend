import React, { useState } from "react";

const PlotModal = ({ onSave, onClose }) => {
  const [plotNumber, setPlotNumber] = useState("");

  return (
    <div style={{
      position: "fixed",
      top: "30%",
      left: "40%",
      background: "#fff",
      padding: 20,
      border: "1px solid #ccc"
    }}>
      <h3>Enter Plot Number</h3>

      <input
        value={plotNumber}
        onChange={(e) => setPlotNumber(e.target.value)}
        placeholder="Plot Number"
      />

      <br /><br />
      <button onClick={() => onSave(plotNumber)}>Save</button>
      <button onClick={onClose} style={{ marginLeft: 10 }}>
        Cancel
      </button>
    </div>
  );
};

export default PlotModal;