import { useState, useCallback } from "react";
import axios from "axios";
import { API_URI } from "../../utils/Global/main";

const usePlotSync = (colonyId, token) => {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadPlots = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_URI}/api/v1/plots/owner/all/${colonyId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const plots = res.data?.data || [];

      // Backend plots → frontend shapes format
      const shapes = plots.map((plot) => ({
        ...plot.shapeData,
        id: plot._id,
        status: plot.status,
        plotNumber: plot.plotNumber,
        _plotData: {
          plotNumber: plot.plotNumber,
          plotArea: plot.plotArea,
          plotSize: plot.plotSize,
          pricePerSqft: plot.pricePerSqft,
          totalPrice: plot.totalPrice,
          status: plot.status,
          facing: plot.facing,
        },
      }));

      return shapes;
    } catch (err) {
      console.error("Load plots error:", err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [colonyId, token]);

  const bulkSave = useCallback(
    async (shapes) => {
      try {
        setSaving(true);

        const plots = shapes.map((shape) => {
          const { id, status, plotNumber, _plotData, ...shapeData } = shape;
          const isMongoId = /^[a-f\d]{24}$/i.test(id);

          return {
            id: isMongoId ? id : undefined,
            plotNumber:
              plotNumber || _plotData?.plotNumber || `P-${id.slice(0, 6)}`,
            status: status || "available",
            shapeData: {
              ...shapeData,
              type: shapeData.type || "rect",
            },
            ...(_plotData || {}),
          };
        });

        await axios.post(
          `${API_URI}/api/v1/plots/bulk-save`,
          { colonyId, plots },
          { headers: { Authorization: `Bearer ${token}` } },
        );

        return true;
      } catch (err) {
        console.error("Bulk save error:", err);
        return false;
      } finally {
        setSaving(false);
      }
    },
    [colonyId, token],
  );

  const updateStatus = useCallback(
    async (plotId, status, note = "") => {
      try {
        await axios.put(
          `${API_URI}/api/v1/plots/owner/status/${plotId}`,
          { status, note },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        return true;
      } catch (err) {
        console.error("Status update error:", err);
        return false;
      }
    },
    [token],
  );

  const deletePlot = useCallback(
    async (plotId) => {
      try {
        await axios.delete(`${API_URI}/api/v1/plots/owner/delete/${plotId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return true;
      } catch (err) {
        console.error("Delete plot error:", err);
        return false;
      }
    },
    [token],
  );

  return { saving, loading, loadPlots, bulkSave, updateStatus, deletePlot };
};

export default usePlotSync;
