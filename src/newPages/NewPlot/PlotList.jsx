import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URI } from "../../utils/Global/main";
import Header from "../../components/designs/TopComponents/Header";
import NormalTable from "../../components/designs/Tables/NormalTable";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { useParams } from "react-router-dom";
import UpdatePlotDialog from "./UpdatePlotDialog";

const StatusBadge = ({ status }) => {
  const config = {
    available: { bg: "bg-green-100", text: "text-green-700", dot: "bg-green-500", label: "Available" },
    hold:      { bg: "bg-yellow-100", text: "text-yellow-700", dot: "bg-yellow-500", label: "Hold" },
    sold:      { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500", label: "Sold" },
  };
  const c = config[status] || config.available;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
};

const ShapeTypeBadge = ({ type }) => {
  const colors = {
    rect:     "bg-blue-100 text-blue-700",
    custom:   "bg-purple-100 text-purple-700",
    rounded:  "bg-indigo-100 text-indigo-700",
    polygon:  "bg-orange-100 text-orange-700",
    line:     "bg-gray-100 text-gray-700",
    text:     "bg-pink-100 text-pink-700",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${colors[type] || "bg-gray-100 text-gray-600"}`}>
      {type || "—"}
    </span>
  );
};



const PlotList = ({ token }) => {
  const { colonyId } = useParams();
  const [data, setData]           = useState([]);
  const [loading, setLoading]     = useState(false);
  const [editPlot, setEditPlot]   = useState(null);

  const fetchPlots = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_URI}/api/v1/plots/owner/all/${colonyId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const plots = res.data?.data || [];

      const updatedData = plots.filter((plot) =>["rect", "custom", "rounded"].includes(plot.shapeData?.type)).map((plot, index) => ({
        ...plot,
        index: index + 1,
        statusBadge:    <StatusBadge status={plot.status} />,
        shapeTypeBadge: <ShapeTypeBadge type={plot.shapeData?.type} />,
        plotSizeDisplay:     plot.plotSize     ? `${plot.plotSize} sq ft` : "—",
        pricePerSqftDisplay: plot.pricePerSqft ? `₹${plot.pricePerSqft}` : "—",
        totalPriceDisplay:   plot.totalPrice   ? `₹${plot.totalPrice.toLocaleString()}` : "—",
        facingDisplay:       plot.facing       || "—",
        plotAreaDisplay:     plot.plotArea     || "—",
        createdAt: new Date(plot.createdAt).toLocaleDateString(),
        plotNumber:plot?.shapeData?.linkedText?.text||""
      }));

      setData(updatedData);
    } catch (error) {
      console.error("Error fetching plots:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (colonyId) fetchPlots();
  }, [colonyId]);

  const handleEdit = (plot) => setEditPlot(plot);

  const handleDelete = async (plot) => {
    if (window.confirm(`Are you sure you want to delete Plot #${plot.plotNumber}?`)) {
      try {
        await axios.delete(
          `${API_URI}/api/v1/plots/owner/delete/${plot._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchPlots();
      } catch (error) {
        console.error("Error deleting plot:", error);
      }
    }
  };

  const plotTableStructure = [
    { header: "S.NO",        accessKey: "index" },
    { header: "Status",      accessKey: "statusBadge" },
    { header: "Shape Type",  accessKey: "shapeTypeBadge" },
    { header: "Plot No.",    accessKey: "plotNumber" },
    { header: "Area",        accessKey: "plotAreaDisplay" },
    { header: "Size",        accessKey: "plotSizeDisplay" },
    { header: "Facing",      accessKey: "facingDisplay" },
    { header: "Price/Sqft",  accessKey: "pricePerSqftDisplay" },
    { header: "Total Price", accessKey: "totalPriceDisplay" },
    { header: "Created At",  accessKey: "createdAt" },
  ];

  const actions = [
    {
      name: "Edit",
      handleClick: handleEdit,
      icon: <EditIcon />,
    },
    // {
    //   name: "Delete",
    //   handleClick: handleDelete,
    //   icon: <DeleteIcon />,
    // },
  ];

  return (
    <div className="my-2 flex-1 md:mr-2 md:p-6 pt-[60px] px-1 md:rounded-2xl bg-white border shadow overflow-y-auto">
      <Header
        title={"Plots"}
        addTitle={"Plot"}
        add={false}
      />

      <div className="md:my-8 my-4 mx-auto md:mx-4">
        <NormalTable
          tableStructure={plotTableStructure}
          data={data}
          isLoading={loading}
          options={actions}
        />
      </div>

      {/* Update Dialog */}
      {editPlot && (
        <UpdatePlotDialog
          plot={editPlot}
          token={token}
          onClose={() => setEditPlot(null)}
          onSuccess={fetchPlots}
        />
      )}
    </div>
  );
};

export default PlotList;