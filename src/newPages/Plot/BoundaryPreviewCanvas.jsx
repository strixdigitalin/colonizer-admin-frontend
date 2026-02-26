import React, { useEffect, useRef } from "react";

const BoundaryPreviewCanvas = ({ plots = [], image }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!image) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // IMPORTANT: same size as original image
    canvas.width = image.width;
    canvas.height = image.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw original image
    ctx.drawImage(image, 0, 0);

    // Draw boundaries on top
    plots.forEach((plot) => {
      if (!plot.boundary || plot.boundary.length < 3) return;

      ctx.beginPath();
      ctx.moveTo(plot.boundary[0].x, plot.boundary[0].y);

      for (let i = 1; i < plot.boundary.length; i++) {
        ctx.lineTo(plot.boundary[i].x, plot.boundary[i].y);
      }

      ctx.closePath();

      ctx.fillStyle = "rgba(0, 255, 0, 0.4)";
      ctx.fill();

      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }, [plots, image]);

  return (
    <div style={{ overflow: "auto", border: "1px solid #ccc" }}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default BoundaryPreviewCanvas;