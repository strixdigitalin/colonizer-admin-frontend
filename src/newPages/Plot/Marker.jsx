import React, { useEffect, useState } from "react";
import Header from "../../components/designs/TopComponents/Header";
import MapUploader from "./MapUploader";
import ColorSelector from "./ColorSelector";
import PlotCanvas from "./PlotCanvas";
import PlotFormModal from "./PlotFormModal";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URI } from "../../utils/Global/main";
import { useRef } from "react";
import Loader from "../../Loader/Loader";

const Marker = ({ token }) => {
  const { id } = useParams();
  const [colony, setColony] = useState(null);
  const [mapImage, setMapImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const [selectedColor, setSelectedColor] = useState("green");
  const [pendingPlot, setPendingPlot] = useState(null);
  const [plots, setPlots] = useState([]);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [editingPlot, setEditingPlot] = useState(null);

  const stageRef = useRef();

  useEffect(() => {
    fetchColony();
    fetchPlots();
  }, []);

  const fetchPlots = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URI}/api/v1/plot/owner/all/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status == 200) {
        setPlots(res.data.data);
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const fetchColony = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URI}/api/v1/colony/owner/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const colonyData = res.data?.data;
      setColony(colonyData);

      // Base image load
      if (colonyData?.colonyMap || colonyData?.colonyBaseMap) {
        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.src = colonyData.colonyBaseMap || colonyData.colonyMap;
        img.onload = () => setMapImage(img);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleSaveColonyMap = async () => {
    if (!stageRef.current) return;

    const stage = stageRef.current;

    const oldScale = scale;
    const oldPosition = position;

    setScale(1);
    setPosition({ x: 0, y: 0 });

    // Wait for React render
    setTimeout(async () => {
      const uri = stage.toDataURL({
        pixelRatio: 2,
      });

      const blob = await (await fetch(uri)).blob();
      const formData = new FormData();
      formData.append("image", blob);

      setLoading(true);
      try {
        await axios.post(`${API_URI}/api/v1/colony/upload/${id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        alert("Colony Map Updated Successfully");

        fetchColony();
      } catch (error) {
        console.error(error);
      }
      setLoading(false);

      setScale(oldScale);
      setPosition(oldPosition);
    }, 100);
  };

  const updateColonyMapFromCanvas = async () => {
    if (!stageRef.current) return;

    const stage = stageRef.current;
    const oldScale = scale;
    const oldPosition = position;

    setScale(1);
    setPosition({ x: 0, y: 0 });
    setTimeout(async () => {
      setLoading(true);
      try {
        const uri = stage.toDataURL({ pixelRatio: 2 });
        const blob = await (await fetch(uri)).blob();

        const formData = new FormData();
        formData.append("image", blob);

        await axios.post(`${API_URI}/api/v1/colony/upload/${id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        console.log("Colony map synced");
        fetchColony();
      } catch (error) {
        console.error(error);
      }

      setLoading(false);
      setScale(oldScale);
      setPosition(oldPosition);
    }, 100);
  };

  const handleSavePlot = async (data) => {
    try {
      if (!pendingPlot && !editingPlot) return;

      const payload = {
        colonyId: id,
        plotNumber: data.plotNumber,
        plotArea: data.plotArea,
        plotSize: Number(data.plotSize),
        pricePerSqft: Number(data.pricePerSqft),
        facing: data.facing,
        status: data.status,
        description: data.description,

        coordinates: {
          x: pendingPlot?.x ?? editingPlot.coordinates.x,
          y: pendingPlot?.y ?? editingPlot.coordinates.y,
          width: pendingPlot?.width ?? editingPlot.coordinates.width,
          height: pendingPlot?.height ?? editingPlot.coordinates.height,
        },
      };
      setLoading(true);
      // const res = await axios.post(`${API_URI}/api/v1/plot/create`, payload, {
      //   headers: { Authorization: `Bearer ${token}` },
      // });
      let res;
      if (editingPlot) {
        // UPDATE
        res = await axios.put(
          `${API_URI}/api/v1/plot/owner/update/${editingPlot._id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        setPlots((prev) =>
          prev.map((p) => (p._id === editingPlot._id ? res.data.data : p)),
        );
      } else {
        // CREATE
        res = await axios.post(`${API_URI}/api/v1/plot/create`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPlots((prev) => [...prev, res.data.data]);
      }

      // setPlots((prev) => [...prev, res.data.data]);
      setPendingPlot(null);
      setEditingPlot(null);

      await updateColonyMapFromCanvas();
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const handleDelete = async (plotId) => {
    try {
      setLoading(true);
      await axios.delete(`${API_URI}/api/v1/plot/owner/delete/${plotId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPlots((prev) => prev.filter((p) => p._id !== plotId));
      await updateColonyMapFromCanvas();
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const handleUpdate = async (plot) => {
    try {
      setLoading(true);
      const res = await axios.put(
        `${API_URI}/api/v1/plot/owner/update/${plot._id}`,
        { status: "sold" },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setPlots((prev) =>
        prev.map((p) => (p._id === plot._id ? res.data.data : p)),
      );
      await updateColonyMapFromCanvas();
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  return (
    <div className="my-2 flex-1 md:mr-2 md:p-6 pt-[60px] px-1 md:rounded-2xl bg-white border shadow overflow-y-auto">
      <Header title="Markers" />
      {loading && <Loader />}
      {!colony?.colonyMap && colony?.colonyBaseMap && (
        <MapUploader setMapImage={setMapImage} />
      )}

      {/* <ColorSelector
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
      /> */}

      <PlotCanvas
        stageRef={stageRef}
        mapImage={mapImage}
        selectedColor={selectedColor}
        plots={plots}
        setPendingPlot={setPendingPlot}
        scale={scale}
        setScale={setScale}
        position={position}
        setPosition={setPosition}
        handleDelete={handleDelete}
        handleUpdate={handleUpdate}
      />

      {!colony?.colonyMap && colony?.colonyBaseMap && (
        <button
          onClick={handleSaveColonyMap}
          className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
        >
          Save Colony Map
        </button>
      )}

      {pendingPlot && (
        <PlotFormModal
          initialData={editingPlot}
          onSave={handleSavePlot}
          onSkip={() => {
            setPendingPlot(null);
            setEditingPlot(null);
          }}
        />
      )}

      <div className="mt-6 border-t pt-4">
        <h3 className="font-bold mb-3">All Plots</h3>

        {plots.length === 0 && <p>No plots available</p>}

        {plots.map((plot) => (
          <div
            key={plot._id}
            className="flex justify-between items-center border p-2 mb-2 rounded"
          >
            <div>
              <div>
                <strong>Plot:</strong> {plot.plotNumber}
              </div>
              <div>
                <strong>Status:</strong> {plot.status}
              </div>
              <div>
                <strong>Price:</strong> ₹{plot.totalPrice}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditingPlot(plot);
                  setPendingPlot(plot.coordinates);
                }}
                className="bg-blue-500 text-white px-2 py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(plot._id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marker;
