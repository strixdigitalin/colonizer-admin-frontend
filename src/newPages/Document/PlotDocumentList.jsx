import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { API_URI } from "../../utils/Global/main";
import Header from "../../components/designs/TopComponents/Header";
import NormalTable from "../../components/designs/Tables/NormalTable";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadPlotDocumentDialog from "./UploadPlotDocumentDialog";

const DocTypeBadge = ({ type }) => {
  const config = {
    sale_agreement: { bg: "bg-blue-100", text: "text-blue-700", label: "Sale Agreement" },
    registry: { bg: "bg-purple-100", text: "text-purple-700", label: "Registry" },
    payment_receipt: { bg: "bg-green-100", text: "text-green-700", label: "Payment Receipt" },
    id_proof: { bg: "bg-yellow-100", text: "text-yellow-700", label: "ID Proof" },
    other: { bg: "bg-gray-100", text: "text-gray-600", label: "Other" },
  };

  const c = config[type] || config.other;

  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
};

const PlotDocumentList = ({ token }) => {
  const { plotId } = useParams();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  const fetchDocuments = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API_URI}/api/v1/documents/owner/plot/${plotId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const docs = res.data?.data || [];

      const formatted = docs.map((doc, index) => ({
        ...doc,
        index: index + 1,
        docTypeBadge: (
          <span
            onClick={() => doc.fileUrl && window.open(doc.fileUrl, "_blank")}
            className="cursor-pointer"
          >
            <DocTypeBadge type={doc.documentType} />
          </span>
        ),
        noteDisplay: doc.note || "—",
        uploadedAt: new Date(doc.createdAt).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        fileIcon: (
          <div className="flex items-center gap-1.5 text-blue-600">
            <InsertDriveFileOutlinedIcon fontSize="small" />
            <span className="text-xs font-medium truncate max-w-[140px]">
              {doc.title}
            </span>
          </div>
        ),
      }));

      setData(formatted);
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (plotId) fetchDocuments();
  }, [plotId]);

  const handleOpenFile = (doc) => {
    if (doc.fileUrl) {
      window.open(doc.fileUrl, "_blank");
    }
  };

  const handleDelete = async (doc) => {
    if (window.confirm(`"${doc.title}" ko delete karna chahte ho?`)) {
      try {
        await axios.delete(
          `${API_URI}/api/v1/documents/owner/${doc._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchDocuments();
      } catch (error) {
        console.error("Error deleting document:", error);
      }
    }
  };

  const tableStructure = [
    { header: "S.NO", accessKey: "index" },
    { header: "File", accessKey: "fileIcon" },
    { header: "Type", accessKey: "docTypeBadge" },
    { header: "Note", accessKey: "noteDisplay" },
    { header: "Uploaded", accessKey: "uploadedAt" },
  ];

  const actions = [
    {
      name: "Open",
      icon: <OpenInNewIcon />,
      handleClick: handleOpenFile,
    },
    {
      name: "Delete",
      icon: <DeleteIcon />,
      handleClick: handleDelete,
    },
  ];

  return (
    <div className="my-2 flex-1 md:mr-2 md:p-6 pt-[60px] px-1 md:rounded-2xl bg-white border shadow overflow-y-auto h-screen">
      <Header
        title={"Plot Documents"}
        add
        addTitle={"Upload Document"}
        handleClick={() => setShowUpload(true)}
      />

      <div className="md:my-8 my-4 mx-auto md:mx-4">
        <NormalTable
          tableStructure={tableStructure}
          data={data}
          isLoading={loading}
          options={actions}
        />
      </div>

      {showUpload && (
        <UploadPlotDocumentDialog
          plotId={plotId}
          token={token}
          onClose={() => setShowUpload(false)}
          onSuccess={fetchDocuments}
        />
      )}
    </div>
  );
};

export default PlotDocumentList;