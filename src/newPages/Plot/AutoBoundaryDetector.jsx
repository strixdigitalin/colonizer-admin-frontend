import React, { useRef, useEffect, useState } from "react";

const AutoBoundaryDetector = ({ imageSrc, onDetect }) => {
    console.log(imageSrc)
  const canvasRef = useRef(null);
  const [cvReady, setCvReady] = useState(false);

  useEffect(() => {
    if (window.cv) {
      window.cv["onRuntimeInitialized"] = () => {
        setCvReady(true);
      };
    }
  }, []);

  useEffect(() => {
    if (!cvReady || !imageSrc) return;

    const img = new Image();
    img.src = imageSrc;

    img.onload = () => {
      detectContours(img);
    };
  }, [cvReady, imageSrc]);

  const detectContours = (img) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);

    const src = cv.imread(canvas);
    const gray = new cv.Mat();
    const blurred = new cv.Mat();
    const edges = new cv.Mat();
    const contours = new cv.MatVector();
    const hierarchy = new cv.Mat();

    // Convert to grayscale
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

    // Blur
    cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0);

    // Edge detection
    cv.Canny(blurred, edges, 50, 150);

    // Find contours
    cv.findContours(
      edges,
      contours,
      hierarchy,
      cv.RETR_EXTERNAL,
      cv.CHAIN_APPROX_SIMPLE
    );

    const detectedPlots = [];

    for (let i = 0; i < contours.size(); i++) {
      const cnt = contours.get(i);

      const area = cv.contourArea(cnt);

      // 🔥 IMPORTANT: Ignore very small areas
      if (area < 2000) continue;

      const approx = new cv.Mat();
      cv.approxPolyDP(
        cnt,
        approx,
        0.02 * cv.arcLength(cnt, true),
        true
      );

      // Only quadrilateral shapes
      if (approx.rows === 4) {
        const boundary = [];

        for (let j = 0; j < 4; j++) {
          boundary.push({
            x: approx.intPtr(j, 0)[0],
            y: approx.intPtr(j, 0)[1],
          });
        }

        detectedPlots.push({
          id: i,
          plotNumber: "",
          boundary,
        });
      }

      approx.delete();
    }

    src.delete();
    gray.delete();
    blurred.delete();
    edges.delete();
    contours.delete();
    hierarchy.delete();

    console.log("Detected:", detectedPlots);
    onDetect(detectedPlots);
  };

  return (
    <div>
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default AutoBoundaryDetector;