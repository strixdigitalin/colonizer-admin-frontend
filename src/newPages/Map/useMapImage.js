import { useEffect, useState } from "react";
import axios from "axios";
import { API_URI } from "../../utils/Global/main";

const useMapImage = (colonyId, token) => {
  const [mapImage, setMapImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `${API_URI}/api/v1/colony/owner/${colonyId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const imageUrl =
          res.data?.data?.colonyBaseMap ||
          res.data?.data?.colonyMap;

        if (imageUrl) {
          const img = new window.Image();
          img.crossOrigin = "anonymous";
          img.src = imageUrl;
          img.onload = () => setMapImage(img);
        }
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    };

    fetchImage();
  }, [colonyId, token]);

  return { mapImage, loading };
};

export default useMapImage;