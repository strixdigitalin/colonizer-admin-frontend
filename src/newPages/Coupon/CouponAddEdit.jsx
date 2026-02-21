import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../../components/designs/TopComponents/Header";
import axios from "axios";
import { API_URI } from "../../utils/Global/main";
import Loader from "../../Loader/Loader";

const CouponAddEdit = ({ token, routepath }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    code: "",
    type: "percentage",
    value: "",
    minAmount: "",
    maxDiscount: "",
    startDate: "",
    expiryDate: "",
    usageLimit: "",
    isActive: true,
    couponType: "Admin",
    name: "",
    location: "",
    number: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const fetchCoupon = async () => {
        try {
          setLoading(true);
          const res = await axios.get(`${API_URI}/api/coupon/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const c = res.data?.data;
          setFormData({
            code: c?.code || "",
            type: c?.type || "percentage",
            value: c?.value || "",
            minAmount: c?.minAmount || "",
            maxDiscount: c?.maxDiscount || "",
            startDate: c?.startDate ? c.startDate.split("T")[0] : "",
            expiryDate: c?.expiryDate ? c.expiryDate.split("T")[0] : "",
            usageLimit: c?.usageLimit || "",
            isActive: c?.isActive ?? true,
            couponType: c?.couponType || "Admin",
            name: c?.name || "",
            location: c?.location || "",
            number: c?.number || "",
          });
        } catch (error) {
          console.error("Error fetching coupon:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchCoupon();
    }
  }, [id, isEdit, token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name == "code") {
      setFormData((prev) => ({
        ...prev,
        [name]: value.toUpperCase().trim(),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.code || !formData.value || !formData.minAmount || !formData.startDate || !formData.expiryDate) {
      alert("All fields are required");
      return;
    }
    if (formData.couponType === "Affiliate") {
      if (!formData.name || !formData.location || !formData.number) {
        alert("Name, Location and Number are required for Affiliate Coupon");
        return;
      }
    }
    setLoading(true);
    try {
      if (isEdit) {
        await axios.put(`${API_URI}/api/coupon/update/${id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${API_URI}/api/coupon/create`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      navigate(-1);
    } catch (error) {
      console.error("Error saving coupon:", error);
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-2 flex-1 md:mr-2 md:p-6 pt-[60px] px-1 md:rounded-2xl bg-white border shadow overflow-y-auto">
      {loading && <Loader />}
      <Header
        title={isEdit ? "Edit Coupon" : "Add Coupon"}
        handleClick={() => navigate(`${routepath}coupon`)}
        addTitle={"Back"}
      />

      <form onSubmit={handleSubmit} className="mt-6 space-y-5 max-w-3xl">
        <div>
          <label className="block mb-2 font-medium">Coupon Code</label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-medium">Discount Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg"
              required
            >
              <option value="percentage">Percentage</option>
              <option value="fixedAmount">Fixed Amount</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 font-medium">Discount Value</label>
            <input
              type="number"
              name="value"
              value={formData.value}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-medium">Min Purchase Amount</label>
            <input
              type="number"
              name="minAmount"
              value={formData.minAmount}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Max Discount Amount</label>
            <input
              type="number"
              name="maxDiscount"
              value={formData.maxDiscount}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-medium">Valid From</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Valid Till</label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div>
            <label className="block mb-2 font-medium">Usage Limit</label>
            <input
              type="number"
              name="usageLimit"
              value={formData.usageLimit}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg"
            />
          </div>
          <div className="flex items-center gap-2 mt-6">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
            />
            <span>Active</span>
          </div>
        </div>

        {/* <div>
          <label className="block mb-2 font-medium">Coupon Type</label>
          <select
            name="couponType"
            value={formData.couponType}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
            required
          >
            <option value="Admin">Admin</option>
            <option value="Affiliated">Affiliated</option>
          </select>
        </div> */}

        {/* Affiliated fields (conditionally visible if Coupon Type is Affiliated) */}
        {formData.couponType === "Affiliated" && (
          <div className="space-y-4">
            <div>
              <label className="block mb-2 font-medium">Owner Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg"
                placeholder="Enter owner name"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg"
                placeholder="Enter location"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">Contact Number</label>
              <input
                type="text"
                name="number"
                value={formData.number}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg"
                placeholder="Enter contact number"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          {loading ? "Saving..." : isEdit ? "Update Coupon" : "Add Coupon"}
        </button>
      </form>
    </div>
  );
};

export default CouponAddEdit;
