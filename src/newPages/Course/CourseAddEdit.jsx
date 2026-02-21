import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../../components/designs/TopComponents/Header";
import axios from "axios";
import { API_URI, logoutUtil } from "../../utils/Global/main";
import Loader from "../../Loader/Loader";

const CourseAddEdit = ({ token, routepath }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    subName: "",
    timing: "",
    startTime: "",
    endTime: "",
    numberOfLessons: "",
    description: "",
    price: "",
    images: [],
  });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URI}/api/course/single/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const course = res.data?.data;

        setFormData({
          name: course?.name || "",
          subName: course?.subName || "",
          timing: course?.timing || "",
          startTime: course?.startTime || "",
          endTime: course?.endTime || "",
          numberOfLessons: course?.numberOfLessons || "",
          description: course?.description || "",
          price: course?.price || "",
          images: [],
        });

        setPreviewImages(course?.images || []);
      } catch (err) {
        if ([401, 403].includes(err.response?.status)) logoutUtil();
      } finally {
        setLoading(false);
      }
    };

    if (isEdit) fetchCourse();
  }, [id, isEdit, token]);

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    if (type === "file") {
      const selectedFiles = Array.from(files).slice(0, 5);
      setFormData((prev) => ({ ...prev, images: selectedFiles }));
      setPreviewImages(selectedFiles.map((f) => URL.createObjectURL(f)));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    if (
      !formData.name ||
      // !formData.timing ||
      !formData.startTime ||
      !formData.endTime ||
      !formData.numberOfLessons ||
      !formData.description ||
      !formData.price
    ) {
      return alert("Please fill all required fields");
    }

    setLoading(true);
    const form = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "images") {
        value.forEach((img) => form.append("images", img));
      } else {
        form.append(key, value);
      }
    });

    try {
      if (isEdit) {
        await axios.put(`${API_URI}/api/course/${id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${API_URI}/api/course`, form, {
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
    <div className="my-2 flex-1 md:mr-2 md:p-6 pt-[60px] px-1 md:rounded-2xl bg-white border shadow overflow-y-auto h-screen">
      {loading && <Loader />}

      <Header
        title={isEdit ? "Edit Course" : "Add Course"}
        handleClick={() => navigate(`${routepath}course`)}
        addTitle="Back"
      />

      <div className="mt-6  bg-gray-50 border rounded-xl p-6 space-y-5">
        <div className="grid md:grid-cols-2 gap-4">
          <Input label="Course Name *" name="name" value={formData.name} onChange={handleChange} />
          <Input label="Sub Name" name="subName" value={formData.subName} onChange={handleChange} />
          <Input label="Start Time *" name="startTime" type="time" value={formData.startTime} onChange={handleChange} />
          <Input label="End Time *" name="endTime" type="time" value={formData.endTime} onChange={handleChange} />
          {/* <Input label="Timing *" name="timing" value={formData.timing} onChange={handleChange} /> */}
          <Input label="No. of Lessons *" name="numberOfLessons" type="number" value={formData.numberOfLessons} onChange={handleChange} />
          <Input label="Price *" name="price" type="number" value={formData.price} onChange={handleChange} />
        </div>

        <Textarea
          label="Description *"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />

        <div>
          <label className="font-medium">Course Images (max 5)</label>
          <input type="file" multiple accept="image/*" onChange={handleChange} />
          <div className="flex flex-wrap gap-3 mt-3">
            {previewImages.map((img, idx) => (
              <img key={idx} src={img} alt="" className="h-24 w-32 object-cover rounded border" />
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 text-white px-8 py-2 rounded-lg"
        >
          {loading ? "Saving..." : isEdit ? "Update Course" : "Add Course"}
        </button>
      </div>
    </div>
  );
};


const Input = ({ label, ...props }) => (
  <div>
    <label className="font-medium">{label}</label>
    <input {...props} className="w-full mt-1 border px-4 py-2 rounded-lg" />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div>
    <label className="font-medium">{label}</label>
    <textarea {...props} rows="4" className="w-full mt-1 border px-4 py-2 rounded-lg" />
  </div>
);

export default CourseAddEdit;
