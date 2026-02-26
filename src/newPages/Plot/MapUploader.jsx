import React from "react";

const MapUploader = ({ setMapImage }) => {
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const img = new window.Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => setMapImage(img);
  };

  return <input type="file" accept="image/*" onChange={handleUpload} />;
};

export default MapUploader;