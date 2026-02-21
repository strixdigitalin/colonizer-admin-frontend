import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../../components/designs/TopComponents/Header";
import axios from "axios";
import { API_URI } from "../../utils/Global/main";
import Loader from "../../Loader/Loader";

const ColonyAddEdit = ({ token, routepath }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      name,
      location,
      totalPlots,
      availablePlots,
      pricePerSqft,
    } = formData;

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

      if (isEdit) {
        await axios.put(
          `${API_URI}/api/v1/colony/owner/update/${id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `${API_URI}/api/v1/colony/create`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      navigate(-1);
    } catch (error) {
      console.error("Error saving colony:", error);
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

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
