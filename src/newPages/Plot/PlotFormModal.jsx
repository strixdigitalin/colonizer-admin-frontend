import React, { useEffect, useState } from "react";

const PlotFormModal = ({ onSave, onSkip, initialData }) => {
  const [form, setForm] = useState({
    plotNumber: "",
    plotArea: "",
    plotSize: "",
    pricePerSqft: "",
    facing: "North",
    status: "available",
    description: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        plotNumber: initialData.plotNumber || "",
        plotArea: initialData.plotArea || "",
        plotSize: initialData.plotSize || "",
        pricePerSqft: initialData.pricePerSqft || "",
        facing: initialData.facing || "North",
        status: initialData.status || "available",
        description: initialData.description || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const payload = {
      ...form,
      plotSize: Number(form.plotSize),
      pricePerSqft: Number(form.pricePerSqft),
    };

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-96 shadow-lg">
        <h2 className="font-bold mb-4 text-lg">Plot Details</h2>

        <input
          name="plotNumber"
          placeholder="Plot Number"
          value={form.plotNumber}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
        />

        <input
          name="plotArea"
          placeholder="Plot Area (e.g. 20x20)"
          value={form.plotArea}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
        />

        <input
          name="plotSize"
          type="number"
          placeholder="Plot Size (sqft)"
          value={form.plotSize}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
        />

        <input
          name="pricePerSqft"
          type="number"
          placeholder="Price Per Sqft"
          value={form.pricePerSqft}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
        />

        <select
          name="facing"
          value={form.facing}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
        >
          <option value="North">North</option>
          <option value="South">South</option>
          <option value="East">East</option>
          <option value="West">West</option>
        </select>

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
        >
          <option value="available">Available</option>
          <option value="hold">Hold</option>
          <option value="sold">Sold</option>
        </select>

        <textarea
          name="description"
          placeholder="Description (optional)"
          value={form.description}
          onChange={handleChange}
          className="border p-2 w-full mb-4"
        />

        <div className="flex justify-between">
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Save
          </button>

          <button
            onClick={onSkip}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlotFormModal;
