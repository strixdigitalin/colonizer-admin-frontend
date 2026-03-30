import { useEffect, useState } from "react";
import axios from "axios";
import { API_URI } from "../../utils/Global/main";

const useMapImage = (colonyId, token) => {
  const [mapImage, setMapImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadMapImage = async (file) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", file);
      await axios.post(
        `${API_URI}/api/v1/colony/upload/${colonyId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      await fetchImage();
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

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
        res.data?.data?.colonyMap ||
        res.data?.data?.colonyBaseMap;

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

  useEffect(() => {

    fetchImage();
  }, [colonyId, token]);

  return { mapImage, loading, uploadMapImage };
};

export default useMapImage;