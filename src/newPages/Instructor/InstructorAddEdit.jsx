import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../../components/designs/TopComponents/Header";
import axios from "axios";
import { API_URI, logoutUtil } from "../../utils/Global/main";
import Loader from "../../Loader/Loader";

const InstructorAddEdit = ({ token, routepath }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    profession: "",
    bio: "",
    facebook: "",
    twitter: "",
    linkedin: "",
    instagram: "",
    image: null,
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInstructor = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URI}/api/instructor/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const instructor = res.data?.data;

        setFormData({
          name: instructor?.name || "",
          profession: instructor?.profession || "",
          bio: instructor?.bio || "",
          facebook: instructor?.socialLinks?.facebook || "",
          twitter: instructor?.socialLinks?.twitter || "",
          linkedin: instructor?.socialLinks?.linkedin || "",
          instagram: instructor?.socialLinks?.instagram || "",
          image: null,
        });

        setPreviewImage(instructor?.imageUrl || null);
      } catch (err) {
        if ([401, 403].includes(err.response?.status)) logoutUtil();
      } finally {
        setLoading(false);
      }
    };

    if (isEdit) fetchInstructor();
  }, [id, isEdit, token]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      if (file) setPreviewImage(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) form.append(key, value);
    });

    try {
      if (isEdit) {
        await axios.put(`${API_URI}/api/instructor/${id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${API_URI}/api/instructor`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      navigate(-1);
    } catch (err) {
      if ([401, 403].includes(err.response?.status)) logoutUtil();
      else alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-2 flex-1 md:mr-2 md:p-6 pt-[60px] px-1 md:rounded-2xl bg-white border shadow overflow-y-auto">
      {loading && <Loader />}

      <Header
        title={isEdit ? "Edit Instructor" : "Add Instructor"}
        handleClick={() => navigate(`${routepath}instructor`)}
        addTitle="Back"
      />

      <div
        // onSubmit={handleSubmit}
        className="mt-6 max-w-4xl bg-gray-50 border rounded-xl p-6 space-y-5"
      >
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="font-medium">Name *</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full mt-1 border px-4 py-2 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="font-medium">Profession *</label>
            <input
              name="profession"
              value={formData.profession}
              onChange={handleChange}
              className="w-full mt-1 border px-4 py-2 rounded-lg"
              required
            />
          </div>
        </div>

        <div>
          <label className="font-medium">Bio</label>
          <textarea
            name="bio"
            rows="4"
            value={formData.bio}
            onChange={handleChange}
            className="w-full mt-1 border px-4 py-2 rounded-lg"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            name="facebook"
            placeholder="Facebook URL"
            value={formData.facebook}
            onChange={handleChange}
            className="border px-4 py-2 rounded-lg"
          />
          <input
            name="twitter"
            placeholder="Twitter URL"
            value={formData.twitter}
            onChange={handleChange}
            className="border px-4 py-2 rounded-lg"
          />
          <input
            name="linkedin"
            placeholder="LinkedIn URL"
            value={formData.linkedin}
            onChange={handleChange}
            className="border px-4 py-2 rounded-lg"
          />
          <input
            name="instagram"
            placeholder="Instagram URL"
            value={formData.instagram}
            onChange={handleChange}
            className="border px-4 py-2 rounded-lg"
          />
        </div>

        <div>
          <label className="font-medium">Profile Image</label>
          <input type="file" accept="image/*" onChange={handleChange} />
          {previewImage && (
            <img
              src={previewImage}
              alt="preview"
              className="mt-3 h-28 rounded-lg border"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-8 py-2 rounded-lg"
        >
          {loading
            ? "Saving..."
            : isEdit
            ? "Update Instructor"
            : "Add Instructor"}
        </button>
      </div>
    </div>
  );
};

export default InstructorAddEdit;
