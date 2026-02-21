import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URI } from "../../utils/Global/main";
import Header from "../../components/designs/TopComponents/Header";
import NormalTable from "../../components/designs/Tables/NormalTable";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { availablePermissions } from "./permissionhelper";
import { Delete, Edit } from "@mui/icons-material";

const SubadminList = ({ token, routepath, permissions = [] }) => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const isSubAdmin = routepath === "/office/";

  const canAdd = !isSubAdmin || permissions.includes("subadmin_management_add");
  const canEdit = !isSubAdmin || permissions.includes("subadmin_management_edit");
  const canDelete = canEdit; 

  const fetchSubadmins = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URI}/api/subadmin/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {
        const rawData = res?.data?.data || [];
        const permissionMap = new Map(availablePermissions.map(p => [p.key, p.label]));

        const transformed = rawData.map((item, index) => ({
          index: index + 1,
          id: item._id,
          name: item.name,
          email: item.email,
          assignedArea: item.assignedArea || "Not Assigned",
          permissions:
            item.permissions
              ?.map(key => permissionMap.get(key))
              .filter(Boolean)
              .join(", ") || "No Permissions",
          isActive: item.isActive ? "Active" : "Inactive",
          createdAt: new Date(item.createdAt).toLocaleDateString()
        }));

        setData(transformed);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch subadmins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubadmins();
  }, []);

  const handleDelete = async (id) => {
    if (!canDelete) return;

    if (!window.confirm("Are you sure to delete this subadmin?")) return;

    try {
      const res = await axios.delete(`${API_URI}/api/subadmin/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {
        toast.success("Subadmin deleted successfully");
        fetchSubadmins();
      }
    } catch (error) {
      toast.error("Failed to delete subadmin");
    }
  };

  const tableStructure = [
    { header: "S.NO", accessKey: "index" },
    { header: "Name", accessKey: "name" },
    { header: "Email", accessKey: "email" },
    // { header: "Assigned Area", accessKey: "assignedArea" },
    { header: "Permissions", accessKey: "permissions" },
    { header: "Status", accessKey: "isActive" },
    { header: "Created At", accessKey: "createdAt" }
  ];

  const actions = [
    canEdit && {
      name: "Edit",
      handleClick: (row) => navigate(`${routepath}subadmin/edit/${row.id}`),
      icon: <Edit />
    },
    canDelete && {
      name: "Delete",
      handleClick: (row) => handleDelete(row.id),
      icon: <Delete />
    }
  ].filter(Boolean);

  return (
    <div className="my-2 flex-1 md:mr-2 md:p-6 pt-[60px] px-1 md:rounded-2xl bg-white border shadow overflow-y-auto">
      
      <Header title={"Subadmin List"} />

      {canAdd && (
        <div className="text-right my-3">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={() => canAdd && navigate(`${routepath}subadmin/add`)}
          >
            + Add New Subadmin
          </button>
        </div>
      )}

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

export default SubadminList;
