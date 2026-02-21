import React, { useEffect, useState } from "react";
import Header from "../../components/designs/TopComponents/Header";
import NormalTable from "../../components/designs/Tables/NormalTable";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { API_URI, logoutUtil } from "../../utils/Global/main";
import { useNavigate } from "react-router-dom";

const FaqList = ({ token, routepath, permissions = [] }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isSubAdmin = routepath === "/office/";
  // Permissions
  const canAdd = !isSubAdmin || permissions.includes("faq_management_add");
  const canEdit = !isSubAdmin || permissions.includes("faq_management_edit");
  const canDelete = canEdit;

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URI}/api/faq?admin=true`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const faqs = res.data?.data || [];
      const formatted = faqs.map((faq, index) => ({
        ...faq,
        index: index + 1,
      }));

      setData(formatted);
    } catch (err) {
      if ([401, 403].includes(err.response?.status)) logoutUtil();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleDelete = async (faq) => {
    if (!window.confirm("Are you sure you want to delete this FAQ?")) return;

    try {
      await axios.delete(`${API_URI}/api/faq/${faq._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData((prev) => prev.filter((f) => f._id !== faq._id));
    } catch (err) {
      if ([401, 403].includes(err.response?.status)) logoutUtil();
      else alert("Failed to delete FAQ");
    }
  };

  const handleEdit = (faq) => {
    if (canEdit) navigate(`${routepath}faq/edit/${faq._id}`);
  };

  const handleAdd = () => {
    if (canAdd) navigate(`${routepath}faq/add`);
  };

  const actions = [
    canAdd && {
      name: "Edit",
      handleClick: handleEdit,
      icon: <EditIcon />,
    },
    canDelete && {
      name: "Delete",
      handleClick: handleDelete,
      icon: <DeleteIcon />,
    },
  ];

  const tableStructure = [
    { header: "S.No", accessKey: "index" },
    { header: "Question", accessKey: "question" },
    { header: "Order", accessKey: "order" },
    {
      header: "Created At",
      accessKey: "createdAt",
      cell: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  return (
    <div className="my-2 flex-1 md:mr-2 md:p-6 pt-[60px] px-1 md:rounded-2xl bg-white border shadow overflow-y-auto">
      <Header
        title="FAQs"
        handleClick={handleAdd}
        addTitle="FAQ"
        add={canAdd}
      />

      <div className="md:my-8 my-4 mx-auto md:mx-4">
        <NormalTable
          tableStructure={tableStructure}
          data={data}
          isLoading={loading}
          options={actions}
        />
      </div>
    </div>
  );
};

export default FaqList;
