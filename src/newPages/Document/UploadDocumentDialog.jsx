import React, { useState } from "react";
import axios from "axios";
import { API_URI } from "../../utils/Global/main";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import CloseIcon from "@mui/icons-material/Close";

const DOCUMENT_TYPES = [
  { value: "sale_agreement",  label: "Sale Agreement" },
  { value: "registry",        label: "Registry" },
  { value: "payment_receipt", label: "Payment Receipt" },
  { value: "id_proof",        label: "ID Proof" },
  { value: "other",           label: "Other" },
];

const UploadDocumentDialog = ({ customerId, token, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    title:        "",
    documentType: "",
    plotId:       "",
    note:         "",
  });
  const [file, setFile]       = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    if (selected.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(selected);
    } else {
      setPreview(null);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreview(null);
  };

  const handleSubmit = async () => {
    if (!form.title) return setError("Title required hai.");
    if (!file)       return setError("File select karo.");

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("file",         file);
      formData.append("title",        form.title);
      formData.append("documentType", form.documentType);
      formData.append("note",         form.note);
      if (form.plotId) formData.append("plotId", form.plotId);

      await axios.post(
        `${API_URI}/api/v1/documents/owner/upload/${customerId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-base font-bold text-gray-800">Upload Document</h2>
            <p className="text-xs text-gray-400 mt-0.5">Customer ka document upload karo</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition"
          >
            <CloseIcon fontSize="small" />
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-5 space-y-4">

          {/* File Upload Zone */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2">
              File <span className="text-red-400">*</span>
            </label>

            {!file ? (
              <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition">
                <UploadFileOutlinedIcon className="text-gray-300 mb-2" style={{ fontSize: 36 }} />
                <p className="text-sm text-gray-400 font-medium">Click to upload</p>
                <p className="text-xs text-gray-300 mt-1">Image ya PDF</p>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="flex items-center gap-4 p-3 border border-gray-200 rounded-2xl bg-gray-50">
                {preview ? (
                  <img src={preview} alt="preview" className="w-14 h-14 object-cover rounded-xl border" />
                ) : (
                  <div className="w-14 h-14 flex items-center justify-center bg-blue-100 rounded-xl">
                    <UploadFileOutlinedIcon className="text-blue-500" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-700 truncate">{file.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                <button
                  onClick={handleRemoveFile}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition"
                >
                  <CloseIcon fontSize="small" />
                </button>
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Sale Agreement - Plot 12"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Document Type */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Document Type</label>
            <select
              name="documentType"
              value={form.documentType}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">— Select Type —</option>
              {DOCUMENT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* Plot ID */}
          {/* <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              Plot ID <span className="text-gray-300 font-normal">(optional)</span>
            </label>
            <input
              name="plotId"
              value={form.plotId}
              onChange={handleChange}
              placeholder="Plot ka MongoDB ID"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div> */}

          {/* Note */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Note</label>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              rows={3}
              placeholder="Koi additional info..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-4 py-2.5">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t bg-gray-50 rounded-b-2xl sticky bottom-0">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? "Uploading..." : "Upload Document"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default UploadDocumentDialog;