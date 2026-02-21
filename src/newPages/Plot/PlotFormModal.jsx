import React, { useState } from "react";

const PlotFormModal = ({ onSave, onSkip }) => {
  const [form, setForm] = useState({
    plotId: "",
    size: "",
    price: "",
    ownerName: "",
    ownerPhone: "",
    status: "available",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-96">
        <h2 className="font-bold mb-4">Plot Details</h2>

        <input
          name="plotId"
          placeholder="Plot ID"
          onChange={handleChange}
          className="border p-2 w-full mb-2"
        />

        <input
          name="size"
          placeholder="Size"
          onChange={handleChange}
          className="border p-2 w-full mb-2"
        />

        <input
          name="price"
          placeholder="Price"
          onChange={handleChange}
          className="border p-2 w-full mb-2"
        />

        <input
          name="ownerName"
          placeholder="Owner Name"
          onChange={handleChange}
          className="border p-2 w-full mb-2"
        />

        <input
          name="ownerPhone"
          placeholder="Owner Phone"
          onChange={handleChange}
          className="border p-2 w-full mb-2"
        />

        <select
          name="status"
          onChange={handleChange}
          className="border p-2 w-full mb-4"
        >
          <option value="available">Available</option>
          <option value="hold">Hold</option>
          <option value="sold">Sold</option>
        </select>

        <div className="flex justify-between">
          <button
            onClick={() => onSave(form)}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Save
          </button>

          <button
            onClick={onSkip}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlotFormModal;
