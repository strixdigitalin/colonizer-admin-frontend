import React, { useState } from "react";

const EntityModal = ({ onSave, onClose }) => {
  const [form, setForm] = useState({
    plotNumber: "",
    area: "",
    status: "available",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div style={{
      position: "fixed",
      top: "30%",
      left: "40%",
      background: "#fff",
      padding: 20,
      border: "1px solid #ccc"
    }}>
      <h3>Plot Details</h3>

      <input name="plotNumber" placeholder="Plot Number" onChange={handleChange} />
      <br />
      <input name="area" placeholder="Area" onChange={handleChange} />
      <br />
      <select name="status" onChange={handleChange}>
        <option value="available">Available</option>
        <option value="sold">Sold</option>
      </select>

      <br /><br />
      <button onClick={() => onSave(form)}>Save</button>
      <button onClick={onClose} style={{ marginLeft: 10 }}>Cancel</button>
    </div>
  );
};

export default EntityModal;