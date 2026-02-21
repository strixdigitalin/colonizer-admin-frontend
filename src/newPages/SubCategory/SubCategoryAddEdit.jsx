import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../../components/designs/TopComponents/Header";
import axios from "axios";
import { API_URI } from "../../utils/Global/main";
import Loader from "../../Loader/Loader";
import { axiosInstance } from "../../utils/authUtil";

const SubCategoryAddEdit = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null,
    isActive: true,
    categoryId: "",
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get(`${API_URI}/api/category/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCategories(res.data?.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, [token]);

  useEffect(() => {
    const fetchSubCategory = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`${API_URI}/api/subcategory/single/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const subCat = res.data?.data;
        setFormData({
          name: subCat?.name || "",
          description: subCat?.description || "",
          image: null,
          isActive: subCat?.isActive ?? true,
          categoryId: subCat?.categoryId?._id || "",
        });
        setPreviewImage(subCat?.image || null);
      } catch (error) {
        console.error("Error fetching subcategory:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isEdit) fetchSubCategory();
  }, [id, isEdit, token]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));
      if (file) setPreviewImage(URL.createObjectURL(file));
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData();
    form.append("name", formData.name);
    form.append("description", formData.description);
    form.append("isActive", formData.isActive);
    form.append("categoryId", formData.categoryId);
    if (formData.image) form.append("image", formData.image);

    try {
      if (isEdit) {
        await axiosInstance.post(`${API_URI}/api/subcategory/update/${id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axiosInstance.post(`${API_URI}/api/subcategory/add`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      navigate(-1);
    } catch (error) {
      console.error("Error saving subcategory:", error);
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-2 flex-1 md:mr-2 md:p-6 pt-[60px] px-1 md:rounded-2xl bg-white border shadow overflow-y-auto">
      {loading && <Loader />}
      <Header
        title={isEdit ? "Edit SubCategory" : "Add SubCategory"}
        handleClick={() => navigate(`${routepath}subcategory`)}
        addTitle={"Back"}
      />

      <form onSubmit={handleSubmit} className="mt-6 space-y-5 max-w-2xl">
        <div>
          <label className="block mb-2 font-medium">Name</label>
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
          <label className="block mb-2 font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Select Category</label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
            required
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 font-medium">Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full"
          />
          {previewImage && (
            <div className="mt-3">
              <p className="text-sm text-gray-500 mb-1">Preview:</p>
              <img
                src={previewImage}
                alt="Preview"
                className="h-24 w-24 object-cover rounded-lg border"
              />
            </div>
          )}
        </div>

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
          {loading
            ? "Saving..."
            : isEdit
              ? "Update SubCategory"
              : "Add SubCategory"}
        </button>
      </form>
    </div>
  );
};

export default SubCategoryAddEdit;
