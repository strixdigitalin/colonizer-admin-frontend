import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/designs/TopComponents/Header";
import NormalTable from "../../components/designs/Tables/NormalTable";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { API_URI } from "../../utils/Global/main";
import { axiosInstance } from "../../utils/authUtil";

const TopCategoryList = ({ token, routepath, permissions = [] }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isSubAdmin = routepath === "/office/";

  // PERMISSION FLAGS
  const canAdd = !isSubAdmin || permissions.includes("top_category_management_add");
  const canEdit = !isSubAdmin || permissions.includes("top_category_management_edit");
  const canDelete = canEdit; // DELETE = EDIT permission

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`${API_URI}/api/top-category/all`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const categories = res.data?.data || [];
      const updated = categories.map((cat, idx) => ({
        ...cat,
        index: idx + 1,
        isActive: cat.isActive ? "Active" : "Inactive",
      }));

      setData(updated);
    } catch (error) {
      console.error("Error fetching top categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = () => {
    if (canAdd) navigate(`${routepath}top-category/add`);
  };

  const handleEdit = (cat) => {
    if (canEdit) navigate(`${routepath}top-category/edit/${cat._id}`);
  };

  const handleDelete = async (cat) => {
    if (!canDelete) return;

    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await axiosInstance.delete(`${API_URI}/api/top-category/delete/${cat._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setData((prev) => prev.filter((c) => c._id !== cat._id));
      } catch (error) {
        console.error("Error deleting:", error);
        alert(error.response?.data?.message || "Delete failed");
      }
    }
  };

  // Actions based on permission
  const actions = [
    canEdit && {
      name: "Edit",
      handleClick: handleEdit,
      icon: <EditIcon />,
    },
    canDelete && {
      name: "Delete",
      handleClick: handleDelete,
      icon: <DeleteIcon />,
    },
  ].filter(Boolean);

  const categoryTableStructure = [
    { header: "S.NO", accessKey: "index" },
    {
      header: "Image",
      accessKey: "image",
      cell: (value) => (
        <img
          src={value}
          alt="Top Category"
          className="h-12 w-12 object-cover rounded-lg border"
        />
      ),
    },
    { header: "Name", accessKey: "name" },
    { header: "Description", accessKey: "description" },
    { header: "Status", accessKey: "isActive" },
    {
      header: "Created At",
      accessKey: "createdAt",
      cell: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  return (
    <div className="my-2 flex-1 md:mr-2 md:p-6 pt-[60px] px-1 md:rounded-2xl bg-white border shadow overflow-y-auto">
      <Header
        title={"Top Categories"}
        add={canAdd}
        handleClick={handleAdd}
        addTitle={"Top Category"}
      />

      <div className="md:my-8 my-4 mx-auto md:mx-4">
        <NormalTable
          tableStructure={categoryTableStructure}
          data={data}
          isLoading={loading}
          options={actions}
        />
      </div>
    </div>
  );
};

export default TopCategoryList;
