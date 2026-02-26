import React, { useState, useRef } from "react";
import { v4 as uuid } from "uuid";
import BoundaryPreviewCanvas from "./BoundaryPreviewCanvas";
import AutoBoundaryDetector from "./AutoBoundaryDetector";

const Marker = () => {
  const [mapImage, setMapImage] = useState(null);
  const [plots, setPlots] = useState([]);
  const canvasRef = useRef();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
      const img = new Image();
      img.src = event.target.result;

      img.onload = function () {
        setMapImage(img);
        detectPlots(img);
      };
    };

    reader.readAsDataURL(file);
  };

  const detectPlots = (img) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Simple rectangle scan (basic version)
    const detected = [];

    for (let y = 0; y < canvas.height; y += 50) {
      for (let x = 0; x < canvas.width; x += 50) {
        const index = (y * canvas.width + x) * 4;

        const r = data[index];
        const g = data[index + 1];
        const b = data[index + 2];

        // detect light colored plot blocks
        if (r > 200 && g > 200 && b < 200) {
          detected.push({
            id: uuid(),
            plotNumber: "",
            boundary: [
              { x, y },
              { x: x + 40, y },
              { x: x + 40, y: y + 40 },
              { x, y: y + 40 },
            ],
          });
        }
      }
    }

    setPlots(detected);
    // console.log("Detected Plots JSON:", detected);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Auto Digital Map Builder</h2>

      <input type="file" accept="image/*" onChange={handleImageUpload} />

      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* {mapImage && (
        <img
          src={mapImage.src}
          alt="Uploaded Map"
          style={{ maxWidth: "100%", marginTop: 20 }}
        />
      )} */}

      {/* <h3>Generated JSON:</h3>
      <pre style={{ maxHeight: 300, overflow: "auto", background: "#eee" }}>
        {JSON.stringify(plots, null, 2)}
      </pre> */}

      {/* <BoundaryPreviewCanvas plots={plots} image={mapImage} /> */}
      <AutoBoundaryDetector
        imageSrc={mapImage?.src}
        onDetect={(plots) => setPlots(plots)}
      />
    </div>
  );
};

export default Marker;
