import React, { useEffect, useState } from "react";
import Header from "../../components/designs/TopComponents/Header";
import NormalTable from "../../components/designs/Tables/NormalTable";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { API_URI } from "../../utils/Global/main";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../utils/authUtil";

const SubCategoryList = ({ token, routepath, permissions = [] }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isSubAdmin = routepath === "/office/";

  // Permissions
  const canAdd = !isSubAdmin || permissions.includes("subcategory_management_add");
  const canEdit = !isSubAdmin || permissions.includes("subcategory_management_edit");
  const canDelete = canEdit;

  const fetchSubCategories = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`${API_URI}/api/subcategory/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const subCategories = res.data?.data?.subCategories || [];

      const updatedData = subCategories.map((sub, idx) => ({
        ...sub,
        index: idx + 1,
        categoryName: sub.categoryId?.name || "N/A",
        isActive: sub.isActive ? "Active" : "Inactive",
      }));

      setData(updatedData);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubCategories();
  }, []);

  const handleAdd = () => {
    if (canAdd) navigate(`${routepath}subcategory/add`);
  };

  const handleEdit = (subCat) => {
    if (canEdit) navigate(`${routepath}subcategory/edit/${subCat._id}`);
  };

  const handleDelete = async (subCat) => {
    if (!canDelete) return;

    if (window.confirm("Are you sure you want to delete this subcategory?")) {
      try {
        await axiosInstance.delete(`${API_URI}/api/subcategory/delete/${subCat._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setData((prev) => prev.filter((s) => s._id !== subCat._id));
      } catch (error) {
        console.error("Error deleting subcategory:", error);
        alert(error.response?.data?.message || "Something went wrong");
      }
    }
  };

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

  const subCategoryTableStructure = [
    { header: "S.NO", accessKey: "index" },
    { header: "Image", accessKey: "image" },
    { header: "Name", accessKey: "name" },
    { header: "Category", accessKey: "categoryName" },
    { header: "Status", accessKey: "isActive" },
    { header: "Description", accessKey: "description" },
    {
      header: "Created At",
      accessKey: "createdAt",
      cell: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  return (
    <div className="my-2 flex-1 md:mr-2 md:p-6 pt-[60px] px-1 md:rounded-2xl bg-white border shadow overflow-y-auto">
      <Header
        title={"SubCategories"}
        handleClick={handleAdd}
        addTitle={"SubCategory"}
        add={canAdd}
      />

      <div className="md:my-8 my-4 mx-auto md:mx-4">
        <NormalTable
          tableStructure={subCategoryTableStructure}
          data={data}
          isLoading={loading}
          options={actions}
        />
      </div>
    </div>
  );
};

export default SubCategoryList;
