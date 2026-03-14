import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URI } from "../../utils/Global/main";
import Header from "../../components/designs/TopComponents/Header";
import { useNavigate, useParams } from "react-router-dom";
import UpdatePlotDialog from "./UpdatePlotDialog";
import BulkUpdatePlotDialog from "./BulkUpdatePlotDialog";
import PlotTable from "./PlotTable";

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
    rect:    "bg-blue-100 text-blue-700",
    custom:  "bg-purple-100 text-purple-700",
    rounded: "bg-indigo-100 text-indigo-700",
    polygon: "bg-orange-100 text-orange-700",
    line:    "bg-gray-100 text-gray-700",
    text:    "bg-pink-100 text-pink-700",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${colors[type] || "bg-gray-100 text-gray-600"}`}>
      {type || "—"}
    </span>
  );
};

const PlotList = ({ token }) => {
  const navigate = useNavigate();
  const { colonyId } = useParams();
  const [data, setData]                   = useState([]);
  const [loading, setLoading]             = useState(false);
  const [editPlot, setEditPlot]           = useState(null);
  const [bulkPlots, setBulkPlots]         = useState(null); // array when open

  const fetchPlots = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_URI}/api/v1/plots/owner/all/${colonyId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const plots = res.data?.data || [];

      const updatedData = plots
        .filter((plot) => ["rect", "custom", "rounded"].includes(plot.shapeData?.type))
        .map((plot, index) => ({
          ...plot,
          index: index + 1,
          statusBadge:         <StatusBadge status={plot.status} />,
          shapeTypeBadge:      <ShapeTypeBadge type={plot.shapeData?.type} />,
          plotSizeDisplay:     plot.plotSize     ? `${plot.plotSize} sq ft` : "—",
          pricePerSqftDisplay: plot.pricePerSqft ? `₹${plot.pricePerSqft}` : "—",
          totalPriceDisplay:   plot.totalPrice   ? `₹${plot.totalPrice.toLocaleString()}` : "—",
          facingDisplay:       plot.facing       || "—",
          plotAreaDisplay:     plot.plotArea     || "—",
          createdAt:           new Date(plot.createdAt).toLocaleDateString(),
          plotNumber:          plot?.shapeData?.linkedText?.text || "",
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

  return (
    <div className="my-2 flex-1 md:mr-2 md:p-6 pt-[60px] px-1 md:rounded-2xl bg-white border shadow overflow-y-auto">
      <Header title={"Plots"} addTitle={"Plot"} add={false} />

      <div className="md:my-8 my-4 mx-auto md:mx-4">
        <PlotTable
          data={data}
          isLoading={loading}
          onEdit={(plot) => setEditPlot(plot)}
          onDocuments={(plot) => navigate(`/plot/documents/${plot?._id}`)}
          onBulkUpdate={(plots) => setBulkPlots(plots)}
        />
      </div>

      {/* Single Edit Dialog */}
      {editPlot && (
        <UpdatePlotDialog
          plot={editPlot}
          token={token}
          onClose={() => setEditPlot(null)}
          onSuccess={fetchPlots}
        />
      )}

      {/* Bulk Update Dialog */}
      {bulkPlots && (
        <BulkUpdatePlotDialog
          selectedPlots={bulkPlots}
          token={token}
          onClose={() => setBulkPlots(null)}
          onSuccess={() => { setBulkPlots(null); fetchPlots(); }}
        />
      )}
    </div>
  );
};

export default PlotList;
