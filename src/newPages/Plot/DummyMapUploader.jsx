import React from "react";

const MapUploader = ({ setMapImage }) => {
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.src = reader.result;
      img.onload = () => setMapImage(img);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="my-4">
      <input type="file" accept="image/*" onChange={handleUpload} />
    </div>
  );
};

export default MapUploader;
