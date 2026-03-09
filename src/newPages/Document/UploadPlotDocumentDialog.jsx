import React, { useState } from "react";
import axios from "axios";
import { API_URI } from "../../utils/Global/main";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import CloseIcon from "@mui/icons-material/Close";

const DOCUMENT_TYPES = [
  { value: "sale_agreement", label: "Sale Agreement" },
  { value: "registry", label: "Registry" },
  { value: "payment_receipt", label: "Payment Receipt" },
  { value: "id_proof", label: "ID Proof" },
  { value: "other", label: "Other" },
];

const UploadPlotDocumentDialog = ({ plotId, token, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    title: "",
    documentType: "",
    note: "",
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    }
  };

  const handleSubmit = async () => {
    if (!form.title) return setError("Title required hai.");
    if (!file) return setError("File select karo.");

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("file", file);
      formData.append("title", form.title);
      formData.append("documentType", form.documentType);
      formData.append("note", form.note);
      formData.append("plotId", plotId);

      await axios.post(`${API_URI}/api/v1/documents/owner/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-base font-bold">Upload Plot Document</h2>
          <button onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*,application/pdf"
          />

          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Document Title"
            className="w-full border p-2 rounded"
          />

          <select
            name="documentType"
            value={form.documentType}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Type</option>
            {DOCUMENT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>

          <textarea
            name="note"
            value={form.note}
            onChange={handleChange}
            placeholder="Note"
            className="w-full border p-2 rounded"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        <div className="flex gap-2 p-4 border-t">
          <button onClick={onClose} className="flex-1 border rounded p-2">
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-blue-600 text-white rounded p-2"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadPlotDocumentDialog;
