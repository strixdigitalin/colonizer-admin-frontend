import { useState } from "react";
import axios from "axios";
import { API_URI } from "../../utils/Global/main";
import CloseIcon from "@mui/icons-material/Close";
import SystemUpdateAltIcon from "@mui/icons-material/SystemUpdateAlt";

const FACING_OPTIONS = ["North", "South", "East", "West", "North-East", "North-West", "South-East", "South-West"];

const BulkUpdatePlotDialog = ({ selectedPlots, token, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    plotArea:     "",
    plotSize:     "",
    facing:       "",
    pricePerSqft: "",
    description:  "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const filledCount = Object.values(form).filter((v) => v !== "").length;

  const handleSubmit = async () => {
    if (filledCount === 0) {
      setError("Please fill at least one field to update.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      await axios.put(
        `${API_URI}/api/v1/plots/owner/bulk-update`,
        {
          plotIds: selectedPlots.map((p) => p._id),
          updates: form,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Bulk update failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <SystemUpdateAltIcon fontSize="small" className="text-blue-600" />
              Bulk Update Plots
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {selectedPlots.length} plot{selectedPlots.length > 1 ? "s" : ""} selected —
              only filled fields will be applied
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition"
          >
            <CloseIcon fontSize="small" />
          </button>
        </div>

        {/* Selected plot chips */}
        <div className="px-6 pt-4 flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
          {selectedPlots.map((p) => (
            <span
              key={p._id}
              className="bg-blue-50 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full border border-blue-200"
            >
              #{p.plotNumber || p._id.slice(-4)}
            </span>
          ))}
        </div>

        {/* Form */}
        <div className="px-6 py-5 grid grid-cols-2 gap-4">

          <div className="col-span-2 md:col-span-1">
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              Plot Area <span className="text-gray-300">(e.g. 20x30)</span>
            </label>
            <input
              name="plotArea"
              value={form.plotArea}
              onChange={handleChange}
              placeholder="Leave blank to skip"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="col-span-2 md:col-span-1">
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              Plot Size (sq ft)
            </label>
            <input
              name="plotSize"
              type="number"
              value={form.plotSize}
              onChange={handleChange}
              placeholder="Leave blank to skip"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="col-span-2 md:col-span-1">
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              Price / Sqft (₹)
            </label>
            <input
              name="pricePerSqft"
              type="number"
              value={form.pricePerSqft}
              onChange={handleChange}
              placeholder="Leave blank to skip"
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
              <option value="">— Skip —</option>
              {FACING_OPTIONS.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-semibold text-gray-500 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Leave blank to skip"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {filledCount > 0 && (
            <div className="col-span-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs rounded-lg px-3 py-2">
              {filledCount} field{filledCount > 1 ? "s" : ""} will be applied to {selectedPlots.length} plot{selectedPlots.length > 1 ? "s" : ""}
            </div>
          )}

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
            disabled={loading || filledCount === 0}
            className="px-5 py-2 text-sm rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? "Updating..." : `Update ${selectedPlots.length} Plot${selectedPlots.length > 1 ? "s" : ""}`}
          </button>
        </div>

      </div>
    </div>
  );
};

export default BulkUpdatePlotDialog;
