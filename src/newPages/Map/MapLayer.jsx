import React from "react";
import { Image as KonvaImage } from "react-konva";

const STAGE_WIDTH = 900;
const STAGE_HEIGHT = 600;

const MapLayer = ({ mapImage }) => {
  if (!mapImage) return null;

  return (
    <KonvaImage
      image={mapImage}
      width={STAGE_WIDTH}
      height={STAGE_HEIGHT}
      listening={false}
    />
  );
};

export default MapLayer;