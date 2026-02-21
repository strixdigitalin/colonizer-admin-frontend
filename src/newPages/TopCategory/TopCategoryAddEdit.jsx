import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../../components/designs/TopComponents/Header";
import axios from "axios";
import { API_URI } from "../../utils/Global/main";
import Loader from "../../Loader/Loader";
import { axiosInstance } from "../../utils/authUtil";

const TopCategoryAddEdit = ({ token, routepath }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        image: null,
        isActive: true,
    });
    const [previewImage, setPreviewImage] = useState(null);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const fetchCategory = async () => {
            try {
                setLoading(true);
                const res = await axiosInstance.get(`${API_URI}/api/top-category/single/${id}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                const cat = res.data?.data;
                setFormData({
                    name: cat?.name || "",
                    description: cat?.description || "",
                    image: null,
                    isActive: cat?.isActive ?? true,
                });
                setPreviewImage(cat?.image || null);
            } catch (error) {
                console.error("Error fetching category:", error);
            } finally {
                setLoading(false);
            }
        };

        if (isEdit) fetchCategory();
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
        if (formData.image) form.append("image", formData.image);

        try {
            if (isEdit) {
                await axiosInstance.post(`${API_URI}/api/top-category/update/${id}`, form, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else {
                await axiosInstance.post(`${API_URI}/api/top-category/add`, form, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }
            navigate(-1);
        } catch (error) {
            console.error("Error saving category:", error);
            alert(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-2 flex-1 md:mr-2 md:p-6 pt-[60px] px-1 md:rounded-2xl bg-white border shadow overflow-y-auto">
            {loading && <Loader />}
            <Header
                title={isEdit ? "Edit Top Category" : "Add Top Category"}
                handleClick={() => navigate(`${routepath}categories`)}
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
                            ? "Update Category"
                            : "Add Category"}
                </button>
            </form>
        </div>
    );
};

export default TopCategoryAddEdit;
