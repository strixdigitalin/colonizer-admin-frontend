import React, { useState, useRef, useEffect } from "react";
import Header from "../../components/designs/TopComponents/Header";
import { Stage, Layer, Rect, Text, Image as KonvaImage } from "react-konva";
import { v4 as uuidv4 } from "uuid";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;


const STATUS_COLOR = {
  available: "green",
  hold: "yellow",
  sold: "red",
};

const Marker = () => {
  const stageRef = useRef(null);

  const [plots, setPlots] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const [newRect, setNewRect] = useState(null);
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);

  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.src = reader.result;
      img.onload = () => {
        setBackgroundImage(img);
      };
    };
    reader.readAsDataURL(file);
  };

  const handlePdfUpload = async (file) => {
    const fileReader = new FileReader();
    fileReader.onload = async function () {
      const typedArray = new Uint8Array(this.result);
      const pdf = await pdfjsLib.getDocument(typedArray).promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1.5 });

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({
        canvasContext: context,
        viewport: viewport,
      }).promise;

      const img = new window.Image();
      img.src = canvas.toDataURL();
      img.onload = () => {
        setBackgroundImage(img);
      };
    };
    fileReader.readAsArrayBuffer(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type.includes("image")) {
      handleImageUpload(file);
    } else if (file.type === "application/pdf") {
      handlePdfUpload(file);
    } else {
      alert("Only image or PDF allowed");
    }
  };

  // Drawing Logic
  const handleMouseDown = (e) => {
    if (!backgroundImage) return alert("Upload map first");

    const pos = e.target.getStage().getPointerPosition();
    setDrawing(true);
    setNewRect({
      x: pos.x,
      y: pos.y,
      width: 0,
      height: 0,
    });
  };

  const handleMouseMove = (e) => {
    if (!drawing) return;
    const pos = e.target.getStage().getPointerPosition();

    setNewRect((prev) => ({
      ...prev,
      width: pos.x - prev.x,
      height: pos.y - prev.y,
    }));
  };

  const handleMouseUp = () => {
    if (!newRect) return;

    const plotId = prompt("Enter Plot ID (ex: A-101)");
    if (!plotId) return;

    const newPlot = {
      id: uuidv4(),
      plotId,
      ...newRect,
      status: "available",
    };

    setPlots([...plots, newPlot]);
    setDrawing(false);
    setNewRect(null);
  };

  const changeStatus = (plotId) => {
    const status = prompt("Enter status: available / hold / sold");
    if (!STATUS_COLOR[status]) return alert("Invalid Status");

    setPlots((prev) =>
      prev.map((plot) =>
        plot.id === plotId ? { ...plot, status } : plot
      )
    );
  };

  return (
    <div className="my-2 flex-1 md:mr-2 md:p-6 pt-[60px] px-1 md:rounded-2xl bg-white border shadow overflow-y-auto">
      <Header title={"Markers"} />

      {/* Upload Section */}
      <div className="my-4">
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={handleFileChange}
          className="border p-2"
        />
      </div>

      <div className="mt-4 border">
        <Stage
          width={900}
          height={600}
          ref={stageRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{ background: "#f0f0f0" }}
        >
          <Layer>
            {/* Background Image */}
            {backgroundImage && (
              <KonvaImage
                image={backgroundImage}
                width={900}
                height={600}
              />
            )}

            {/* Existing Plots */}
            {plots.map((plot) => (
              <React.Fragment key={plot.id}>
                <Rect
                  x={plot.x}
                  y={plot.y}
                  width={plot.width}
                  height={plot.height}
                  fill={STATUS_COLOR[plot.status]}
                  opacity={0.6}
                  stroke="black"
                  onClick={() => {
                    setSelectedPlot(plot);
                    changeStatus(plot.id);
                  }}
                />
                <Text
                  text={plot.plotId}
                  x={plot.x + 5}
                  y={plot.y + 5}
                  fontSize={14}
                  fill="black"
                />
              </React.Fragment>
            ))}

            {/* Drawing Rectangle */}
            {newRect && (
              <Rect
                {...newRect}
                stroke="blue"
                dash={[4, 4]}
              />
            )}
          </Layer>
        </Stage>
      </div>

      {selectedPlot && (
        <div className="mt-4 p-3 border rounded">
          <h3 className="font-bold">Selected Plot</h3>
          <p>ID: {selectedPlot.plotId}</p>
          <p>Status: {selectedPlot.status}</p>
        </div>
      )}
    </div>
  );
};

export default Marker;
