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

  const stageRef = useRef();

  useEffect(() => {
    fetchColony();
  }, []);

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
        img.src = colonyData.colonyMap || colonyData.colonyBaseMap;
        img.onload = () => setMapImage(img);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleSavePlot = (data) => {
    setPlots((prev) => [...prev, { ...pendingPlot, ...data }]);
    setPendingPlot(null);
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
      } catch (error) {
        console.error(error);
      }
      setLoading(false);

      setScale(oldScale);
      setPosition(oldPosition);
    }, 100);
  };

  return (
    <div className="my-2 flex-1 md:mr-2 md:p-6 pt-[60px] px-1 md:rounded-2xl bg-white border shadow overflow-y-auto">
      <Header title="Markers" />
      {loading && <Loader />}
      <MapUploader setMapImage={setMapImage} />

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
      />

      <button
        onClick={handleSaveColonyMap}
        className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
      >
        Save Colony Map
      </button>

      {pendingPlot && (
        <PlotFormModal
          onSave={handleSavePlot}
          onSkip={() => setPendingPlot(null)}
        />
      )}
    </div>
  );
};

export default Marker;
