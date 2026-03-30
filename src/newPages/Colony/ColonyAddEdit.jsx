import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Header from "../../components/designs/TopComponents/Header";
import axios from "axios";
import { API_URI } from "../../utils/Global/main";
import Loader from "../../Loader/Loader";

const ColonyAddEdit = ({ token, routepath }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    city: "",
    state: "",
    pincode: "",
    totalPlots: "",
    availablePlots: "",
    pricePerSqft: "",
    description: "",
    isActive: true,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch Single Colony (Edit Mode)
  useEffect(() => {
    if (isEdit) {
      const fetchColony = async () => {
        try {
          setLoading(true);
          const res = await axios.get(
            `${API_URI}/api/v1/colony/owner/${id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          const colony = res.data?.data;

          setFormData({
            name: colony?.name || "",
            location: colony?.location || "",
            city: colony?.city || "",
            state: colony?.state || "",
            pincode: colony?.pincode || "",
            totalPlots: colony?.totalPlots || "",
            availablePlots: colony?.availablePlots || "",
            pricePerSqft: colony?.pricePerSqft || "",
            description: colony?.description || "",
            isActive: colony?.isActive ?? true,
          });

          if (colony?.colonyMap) {
            setExistingImage(colony.colonyMap);
          }
        } catch (error) {
          console.error("Error fetching colony:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchColony();
    }
  }, [id, isEdit, token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setExistingImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, location, totalPlots, availablePlots, pricePerSqft } = formData;

    if (!name || !location || !totalPlots || !availablePlots || !pricePerSqft) {
      alert("Required fields are missing");
      return;
    }

    if (Number(availablePlots) > Number(totalPlots)) {
      alert("Available plots cannot exceed total plots");
      return;
    }

    try {
      setLoading(true);

      const payload = new FormData();
      Object.entries(formData).forEach(([key, val]) => payload.append(key, val));
      if (imageFile) payload.append("image", imageFile);

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      };

      if (isEdit) {
        await axios.put(`${API_URI}/api/v1/colony/owner/update/${id}`, payload, { headers });
      } else {
        await axios.post(`${API_URI}/api/v1/colony/create`, payload, { headers });
      }

      navigate(-1);
    } catch (error) {
      console.error("Error saving colony:", error);
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const displayImage = imagePreview || existingImage;

  return (
    <div className="my-2 flex-1 md:mr-2 md:p-6 pt-[60px] px-1 md:rounded-2xl bg-white border shadow overflow-y-auto">
      {loading && <Loader />}

      <Header
        title={isEdit ? "Edit Colony" : "Add Colony"}
        handleClick={() => navigate(`${routepath}colony`)}
        addTitle={"Back"}
      />

      <form onSubmit={handleSubmit} className="mt-6 space-y-5 ">
        {/* Basic Info */}
        <div>
          <label className="block mb-2 font-medium">Colony Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Location *</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
            required
          />
        </div>

        {/* City / State / Pincode */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            className="border px-3 py-2 rounded-lg"
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
            className="border px-3 py-2 rounded-lg"
          />
          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            value={formData.pincode}
            onChange={handleChange}
            className="border px-3 py-2 rounded-lg"
          />
        </div>

        {/* Plot Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="number"
            name="totalPlots"
            placeholder="Total Plots *"
            value={formData.totalPlots}
            onChange={handleChange}
            className="border px-3 py-2 rounded-lg"
            required
          />
          <input
            type="number"
            name="availablePlots"
            placeholder="Available Plots *"
            value={formData.availablePlots}
            onChange={handleChange}
            className="border px-3 py-2 rounded-lg"
            required
          />
          <input
            type="number"
            name="pricePerSqft"
            placeholder="Price Per Sqft *"
            value={formData.pricePerSqft}
            onChange={handleChange}
            className="border px-3 py-2 rounded-lg"
            required
          />
        </div>

        {/* Description */}
        <div>
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
            rows={3}
          />
        </div>

        {/* Colony Image Upload */}
        <div>
          <label className="block mb-2 font-medium">Colony Image</label>

          {displayImage ? (
            <div className="relative w-fit">
              <img
                src={displayImage}
                alt="Colony"
                className="w-64 h-40 object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded"
              >
                Remove
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-64 h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm text-gray-500">Click to upload image</span>
              <span className="text-xs text-gray-400 mt-1">JPG, PNG, GIF</span>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif"
            onChange={handleImageChange}
            className="hidden"
          />

          {!displayImage && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 text-sm text-blue-600 underline"
            >
              Browse file
            </button>
          )}
        </div>

        {/* Active Toggle */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
          />
          <span>Active</span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          {loading ? "Saving..." : isEdit ? "Update Colony" : "Add Colony"}
        </button>
      </form>
    </div>
  );
};

export default ColonyAddEdit;
