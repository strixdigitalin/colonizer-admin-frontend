import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../../components/designs/TopComponents/Header";
import axios from "axios";
import { API_URI, logoutUtil } from "../../utils/Global/main";
import Loader from "../../Loader/Loader";

const BlogAddEdit = ({ token, routepath }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    content: "",
    author: "",
    tags: "",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    isPublished: false,
    image: null,
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isEdit) return;

    const fetchBlog = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URI}/api/blog/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const blog = res.data?.data;
        setFormData({
          title: blog?.title || "",
          subtitle: blog?.subtitle || "",
          content: blog?.content || "",
          author: blog?.author || "",
          tags: blog?.tags?.join(", ") || "",
          seoTitle: blog?.seoTitle || "",
          seoDescription: blog?.seoDescription || "",
          seoKeywords: blog?.seoKeywords?.join(", ") || "",
          isPublished: blog?.isPublished || false,
          image: null,
        });
        setPreviewImage(blog?.imageUrl || null);
      } catch (err) {
        if ([401, 403].includes(err.response?.status)) logoutUtil();
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, isEdit, token]);

  const handleChange = (e) => {
    const { name, value, type, files, checked } = e.target;

    if (type === "file") {
      const file = files[0];
      setFormData((p) => ({ ...p, image: file }));
      if (file) setPreviewImage(URL.createObjectURL(file));
    } else if (type === "checkbox") {
      setFormData((p) => ({ ...p, [name]: checked }));
    } else {
      setFormData((p) => ({ ...p, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData();
    Object.entries(formData).forEach(([k, v]) => {
      if (k === "image") {
        if (v) form.append("image", v);
      } else {
        form.append(k, v);
      }
    });

    try {
      isEdit
        ? await axios.put(`${API_URI}/api/blog/${id}`, form, {
            headers: { Authorization: `Bearer ${token}` },
          })
        : await axios.post(`${API_URI}/api/blog`, form, {
            headers: { Authorization: `Bearer ${token}` },
          });

      navigate(-1);
    } catch (err) {
      if ([401, 403].includes(err.response?.status)) logoutUtil();
      else alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-4 md:p-6 pt-[60px] bg-gray-50 overflow-y-auto">
      {loading && <Loader />}

      <Header
        title={isEdit ? "Edit Blog" : "Add Blog"}
        handleClick={() => navigate(`${routepath}blog`)}
        addTitle="Back"
      />

      {/* SINGLE BOX */}
      <form
        onSubmit={handleSubmit}
        className="mt-6  bg-white rounded-2xl border shadow-sm p-6 space-y-6"
      >
        {/* Title */}
        <div>
          <label className="font-medium">Title</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full mt-1 border px-4 py-2 rounded-lg"
            required
          />
        </div>

        {/* Subtitle */}
        <div>
          <label className="font-medium">Subtitle</label>
          <input
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            className="w-full mt-1 border px-4 py-2 rounded-lg"
          />
        </div>

        {/* Content */}
        <div>
          <label className="font-medium">Content</label>
          <textarea
            name="content"
            rows="6"
            value={formData.content}
            onChange={handleChange}
            className="w-full mt-1 border px-4 py-2 rounded-lg"
            required
          />
        </div>

        {/* Author & Tags */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="font-medium">Author</label>
            <input
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="w-full mt-1 border px-4 py-2 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="font-medium">Tags</label>
            <input
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="comma separated"
              className="w-full mt-1 border px-4 py-2 rounded-lg"
            />
          </div>
        </div>

        {/* SEO */}
        <div className="border-t pt-5 space-y-4">
          <h3 className="font-semibold text-gray-700">SEO Information</h3>

          <input
            name="seoTitle"
            placeholder="SEO Title"
            value={formData.seoTitle}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-lg"
          />

          <textarea
            name="seoDescription"
            placeholder="SEO Description"
            value={formData.seoDescription}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-lg"
          />

          <input
            name="seoKeywords"
            placeholder="SEO Keywords"
            value={formData.seoKeywords}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-lg"
          />
        </div>

        {/* Image */}
        <div className="border-t pt-5">
          <label className="font-medium">Featured Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="block mt-2"
          />
          {previewImage && (
            <img
              src={previewImage}
              alt="preview"
              className="mt-3 h-40 rounded-lg border object-cover"
            />
          )}
        </div>

        {/* Publish */}
        <div className="flex items-center justify-between border-t pt-5">
          <span className="font-medium">Publish Blog</span>
          <label className="relative inline-flex cursor-pointer">
            <input
              type="checkbox"
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-600"></div>
            <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition peer-checked:translate-x-5"></div>
          </label>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2 border rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg"
          >
            {loading ? "Saving..." : isEdit ? "Update Blog" : "Add Blog"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogAddEdit;
