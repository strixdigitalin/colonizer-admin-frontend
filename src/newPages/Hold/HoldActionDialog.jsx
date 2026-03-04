import React, { useState } from "react";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import { API_URI } from "../../utils/Global/main";

const HoldActionDialog = ({ request, token, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleAction = async (action) => {
    try {
      setLoading(true);
      setError("");
      await axios.put(
        `${API_URI}/api/v1/plots/owner/hold/${request.plotId}/${request._id}`,
        { action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Action failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-base font-bold text-gray-800">Hold Request Action</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition"
          >
            <CloseIcon fontSize="small" />
          </button>
        </div>

        {/* Details */}
        <div className="px-6 py-5 space-y-3">

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <HomeWorkOutlinedIcon className="text-blue-500" fontSize="small" />
            <div>
              <p className="text-xs text-gray-400">Plot Number</p>
              <p className="text-sm font-semibold text-gray-700">{request.plotNumber}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <PersonOutlineIcon className="text-purple-500" fontSize="small" />
            <div>
              <p className="text-xs text-gray-400">Customer</p>
              <p className="text-sm font-semibold text-gray-700">
                {request.customerId?.name || "—"}
              </p>
              <p className="text-xs text-gray-400">{request.customerId?.phone || ""}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <AccessTimeIcon className="text-yellow-500" fontSize="small" />
            <div>
              <p className="text-xs text-gray-400">Hold Duration</p>
              <p className="text-sm font-semibold text-gray-700">{request.duration} Days</p>
            </div>
          </div>

          {request.note && (
            <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-xl">
              <p className="text-xs text-gray-400 mb-0.5">Note</p>
              <p className="text-sm text-gray-600">{request.note}</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-3 py-2">
              {error}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-6 py-4 border-t bg-gray-50 rounded-b-2xl">
          <button
            onClick={() => handleAction("rejected")}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-red-600 font-semibold text-sm hover:bg-red-50 disabled:opacity-50 transition"
          >
            <CancelOutlinedIcon fontSize="small" />
            Reject
          </button>
          <button
            onClick={() => handleAction("approved")}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-green-600 text-white font-semibold text-sm hover:bg-green-700 disabled:opacity-50 transition"
          >
            <CheckCircleOutlineIcon fontSize="small" />
            {loading ? "Processing..." : "Approve"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default HoldActionDialog;