import React, { useEffect, useState } from "react";
import { RxCrossCircled } from "react-icons/rx";
import { API_URI, handleChange } from "../../../utils/Global/main";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const initialState = {
  title: "",
  description: "",
  content: "",
  author: "",
  image: "",
  isActive: true,
};

const BlogCard = ({ handleToggle, fetchBlogs, isEdit, editData, loading, setLoading }) => {
  const [data, setData] = useState(initialState);

  useEffect(() => {
    if (isEdit) {
      setData(editData);
    } else {
      setData(initialState);
    }
  }, [isEdit, editData]);

  const handleSubmit = async () => {
    if (!data.title || !data.content) {
      alert("Title and Content are required.");
      return;
    }

    setLoading(true);
    try {
      let formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("content", data.content);
      formData.append("author", data.author);
      formData.append("isActive", data.isActive);

      if (data.image instanceof File) {
        formData.append("image", data.image);
      }

      let res;
      if (isEdit) {
        res = await axios.post(`${API_URI}/api/blog/update/${editData._id}`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("estate_admin_token")}`
          }
        });
      } else {
        res = await axios.post(`${API_URI}/api/blog/add`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("estate_admin_token")}`
          }
        });
      }

      if (res.status === 200) {
        fetchBlogs();
        handleToggle();
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden max-w-3xl mx-4 w-full absolute">
      <div className="text-blue-500 uppercase font-medium text-sm bg-blue-100 py-4 px-4 flex items-center justify-between">
        {isEdit ? "Edit Blog" : "Add Blog"}
        <div
          className="text-lg cursor-pointer hover:text-red-500"
          onClick={handleToggle}
        >
          <RxCrossCircled />
        </div>
      </div>
      <div className="flex flex-col gap-4 px-8 my-6 max-h-[80vh] overflow-y-auto">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-500">Title*</label>
          <input
            name="title"
            value={data?.title}
            onChange={(e) => handleChange(e, setData)}
            className="outline-none border p-2 rounded-md focus-within:border-blue-400 placeholder:text-sm text-gray-500"
            type="text"
            placeholder="Enter blog title"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-500">Description</label>
          <ReactQuill
            theme="snow"
            value={data?.description}
            onChange={(val) => setData((prev) => ({ ...prev, description: val }))}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-500">Content*</label>
          <ReactQuill
            theme="snow"
            value={data?.content}
            onChange={(val) => setData((prev) => ({ ...prev, content: val }))}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-500">Author</label>
          <input
            name="author"
            value={data?.author}
            onChange={(e) => handleChange(e, setData)}
            className="outline-none border p-2 rounded-md focus-within:border-blue-400 text-gray-500"
            type="text"
            placeholder="Enter author name"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-500">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setData((prev) => ({ ...prev, image: e.target.files[0] }))
            }
          />
          {data?.image && !(data.image instanceof File) && (
            <img
              src={data.image}
              alt="preview"
              className="w-20 h-20 object-cover mt-2"
            />
          )}
        </div>

        {/* <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-500">Status</label>
          <select
            name="isActive"
            value={data?.isActive}
            onChange={(e) => setData((prev) => ({ ...prev, isActive: e.target.value === "true" }))}
            className="outline-none border p-2 rounded-md focus-within:border-blue-400 text-gray-500"
          >
            <option value={true}>Active</option>
            <option value={false}>Inactive</option>
          </select>
        </div> */}

        <div className="mt-4">
          <button
            className="flex items-center justify-center gap-2 w-full border p-2 rounded-lg text-gray-500 hover:text-white hover:bg-blue-500 cursor-pointer bg-gray-200"
            onClick={handleSubmit}
            disabled={loading}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
