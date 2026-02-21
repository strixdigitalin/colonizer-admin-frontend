import React, { useEffect, useState } from "react";
import { RxCrossCircled } from "react-icons/rx";
import { API_URI, handleChange } from "../../../utils/Global/main";
import axios from "axios";

const initialState = {
  name: "",
  description: "",
  image: ""
};

const CategoryCard = ({ handleToggle, fetchCategories, isEdit, editData, loading, setLoading }) => {
  const [data, setData] = useState(initialState);

  useEffect(() => {
    if (isEdit) {
      setData(editData);
    }
  }, [isEdit, editData]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      if (data.image instanceof File) {
        formData.append("image", data.image);
      }

      let res;
      if (isEdit) {
        res = await axios.post(
          `${API_URI}/api/category/update/${editData._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(
                "estate_admin_token"
              )}`
            }
          }
        );
      } else {
        res = await axios.post(`${API_URI}/api/category/add`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("estate_admin_token")}`
          }
        });
      }

      if (res.status === 200) {
        fetchCategories();
        handleToggle();
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden max-w-xl mx-4 w-full absolute">
      <div className="text-blue-500 uppercase font-medium text-sm bg-blue-100 py-4 px-4 flex items-center justify-between">
        {isEdit ? "Edit Category" : "Add Category"}
        <div
          className="text-lg cursor-pointer hover:text-red-500"
          onClick={handleToggle}
        >
          <RxCrossCircled />
        </div>
      </div>
      <div className="flex flex-col gap-4 px-8 my-6 max-h-[80vh] overflow-y-auto">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-500">Category Name*</label>
          <input
            name="name"
            value={data?.name}
            onChange={(e) => handleChange(e, setData)}
            className="outline-none border p-2 rounded-md focus-within:border-blue-400 placeholder:text-sm text-gray-500"
            type="text"
            placeholder="Enter category name"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-500">Description</label>
          <textarea
            name="description"
            value={data?.description}
            onChange={(e) => handleChange(e, setData)}
            className="outline-none border p-2 rounded-md focus-within:border-blue-400 placeholder:text-sm text-gray-500"
            placeholder="Enter description"
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

export default CategoryCard;
