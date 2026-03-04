import { useState } from "react";
import axios from "axios";
import { API_URI } from "../../utils/Global/main";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";

const UpdatePlotDialog = ({ plot, token, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    plotNumber:   plot.plotNumber   || "",
    plotArea:     plot.plotArea     || "",
    plotSize:     plot.plotSize     || "",
    facing:       plot.facing       || "",
    pricePerSqft: plot.pricePerSqft || "",
    description:  plot.description  || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");
      await axios.put(
        `${API_URI}/api/v1/plots/owner/update/${plot._id}`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Update failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-fadeIn">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Update Plot</h2>
            <p className="text-xs text-gray-400 mt-0.5">Plot #{plot.plotNumber}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition"
          >
            <CloseIcon fontSize="small" />
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-5 grid grid-cols-2 gap-4">

          <div className="col-span-2 md:col-span-1">
            <label className="block text-xs font-semibold text-gray-500 mb-1">Plot Number</label>
            <input
              name="plotNumber"
              value={form.plotNumber}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="col-span-2 md:col-span-1">
            <label className="block text-xs font-semibold text-gray-500 mb-1">Plot Area (e.g. 20x20)</label>
            <input
              name="plotArea"
              value={form.plotArea}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="col-span-2 md:col-span-1">
            <label className="block text-xs font-semibold text-gray-500 mb-1">Plot Size (sq ft)</label>
            <input
              name="plotSize"
              type="number"
              value={form.plotSize}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="col-span-2 md:col-span-1">
            <label className="block text-xs font-semibold text-gray-500 mb-1">Price / Sqft (₹)</label>
            <input
              name="pricePerSqft"
              type="number"
              value={form.pricePerSqft}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="col-span-2 md:col-span-1">
            <label className="block text-xs font-semibold text-gray-500 mb-1">Facing</label>
            <select
              name="facing"
              value={form.facing}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">— Select —</option>
              <option value="North">North</option>
              <option value="South">South</option>
              <option value="East">East</option>
              <option value="West">West</option>
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-semibold text-gray-500 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {error && (
            <div className="col-span-2 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg px-3 py-2">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 text-sm rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default UpdatePlotDialog;