import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { API_URI } from "../../utils/Global/main";
import Header from "../../components/designs/TopComponents/Header";
import NormalTable from "../../components/designs/Tables/NormalTable";
import HoldActionDialog from "./HoldActionDialog";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import PendingOutlinedIcon from "@mui/icons-material/PendingOutlined";


const RequestStatusBadge = ({ status }) => {
  const config = {
    pending:  { bg: "bg-yellow-100", text: "text-yellow-700", dot: "bg-yellow-500",  label: "Pending" },
    approved: { bg: "bg-green-100",  text: "text-green-700",  dot: "bg-green-500",   label: "Approved" },
    rejected: { bg: "bg-red-100",    text: "text-red-700",    dot: "bg-red-500",     label: "Rejected" },
  };
  const c = config[status] || config.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
};


const FilterTab = ({ label, value, active, count, onClick }) => (
  <button
    onClick={() => onClick(value)}
    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition border ${
      active
        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
        : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
    }`}
  >
    {label}
    <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
      active ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
    }`}>
      {count}
    </span>
  </button>
);


const ColonyHoldRequests = ({ token }) => {
  const { colonyId }         = useParams();
  const [rawData, setRawData]       = useState([]); 
  const [loading, setLoading]       = useState(false);
  const [filter, setFilter]         = useState("all");
  const [selectedRequest, setSelectedRequest] = useState(null);


  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_URI}/api/v1/plots/owner/requests/colony/${colonyId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const plots = res.data?.data || [];
      const flat = [];

      plots.forEach((plot) => {
        (plot.holdRequests || []).forEach((req) => {
          flat.push({
            ...req,
            plotId:     plot._id,
            plotNumber: plot.plotNumber,
          });
        });
      });

      setRawData(flat);
    } catch (error) {
      console.error("Error fetching hold requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (colonyId) fetchRequests();
  }, [colonyId]);


  const counts = useMemo(() => ({
    all:      rawData.length,
    pending:  rawData.filter((r) => r.status === "pending").length,
    approved: rawData.filter((r) => r.status === "approved").length,
    rejected: rawData.filter((r) => r.status === "rejected").length,
  }), [rawData]);


  const tableData = useMemo(() => {
    const filtered = filter === "all"
      ? rawData
      : rawData.filter((r) => r.status === filter);

    return filtered.map((req, index) => ({
      ...req,
      index:          index + 1,
      customerName:   req.customerId?.name  || "—",
      customerPhone:  req.customerId?.phone || "—",
      durationDisplay: `${req.duration} Day${req.duration > 1 ? "s" : ""}`,
      statusBadge:    <RequestStatusBadge status={req.status} />,
      requestedAt:    new Date(req.requestedAt).toLocaleDateString("en-IN", {
        day: "2-digit", month: "short", year: "numeric",
      }),
      noteDisplay: req.note || "—",
    }));
  }, [rawData, filter]);


  const tableStructure = [
    { header: "S.NO",       accessKey: "index" },
    { header: "Plot No.",   accessKey: "plotNumber" },
    { header: "Customer",   accessKey: "customerName" },
    { header: "Phone",      accessKey: "customerPhone" },
    { header: "Duration",   accessKey: "durationDisplay" },
    { header: "Note",       accessKey: "noteDisplay" },
    { header: "Requested",  accessKey: "requestedAt" },
    { header: "Status",     accessKey: "statusBadge" },
  ];


  const actions = [
    {
      name: "Manage",
      icon: <PendingOutlinedIcon />,
      handleClick: (req) => {
        if (req.status !== "pending") return;
        setSelectedRequest(req);
      },
      // Visually disable for non-pending
      isDisabled: (req) => req.status !== "pending",
    },
  ];

  return (
    <div className="my-2 flex-1 md:mr-2 md:p-6 pt-[60px] px-1 md:rounded-2xl bg-white border shadow overflow-y-auto">

      <Header title={"Hold Requests"} add={false} />

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mt-4 md:mt-0 md:mx-4 mb-2">
        <FilterTab label="All"      value="all"      active={filter === "all"}      count={counts.all}      onClick={setFilter} />
        <FilterTab label="Pending"  value="pending"  active={filter === "pending"}  count={counts.pending}  onClick={setFilter} />
        <FilterTab label="Approved" value="approved" active={filter === "approved"} count={counts.approved} onClick={setFilter} />
        <FilterTab label="Rejected" value="rejected" active={filter === "rejected"} count={counts.rejected} onClick={setFilter} />
      </div>

      {/* Table */}
      <div className="md:my-6 my-4 mx-auto md:mx-4">
        <NormalTable
          tableStructure={tableStructure}
          data={tableData}
          isLoading={loading}
          options={actions}
        />
      </div>

      {/* Action Dialog */}
      {selectedRequest && (
        <HoldActionDialog
          request={selectedRequest}
          token={token}
          onClose={() => setSelectedRequest(null)}
          onSuccess={fetchRequests}
        />
      )}

    </div>
  );
};

export default ColonyHoldRequests;