import React, { useEffect, useState } from "react";
import Header from "../../components/designs/TopComponents/Header";
import NormalTable from "../../components/designs/Tables/NormalTable";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { API_URI } from "../../utils/Global/main";

const UserList = ({ token, routepath }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URI}/api/user/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res);
      const users = res.data?.data || [];
      const updatedData = users.map((user, idx) => ({
        ...user,
        index: idx + 1,
      }));
      setData(updatedData);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete user
  const handleDelete = async (user) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`${API_URI}/api/user/delete/${user._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData((prev) => prev.filter((u) => u._id !== user._id));
      } catch (error) {
        console.error("Error deleting user:", error);
        alert(error.response?.data?.message || "Something went wrong");
      }
    }
  };

  const actions = [
    {
      name: "Delete",
      handleClick: handleDelete,
      icon: <DeleteIcon />,
    },
  ];

  const userTableStructure = [
    { header: "S.NO", accessKey: "index" },
    { header: "Name", accessKey: "name" },
    { header: "Email", accessKey: "email" },
    { header: "Phone", accessKey: "mobile" },
    // { header: "Role", accessKey: "role" },
    // { header: "Status", accessKey: "status" },
    {
      header: "Created At",
      accessKey: "createdAt",
      cell: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  return (
    <div className="my-2 flex-1 md:mr-2 md:p-6 pt-[60px] px-1 md:rounded-2xl bg-white border shadow overflow-y-auto">
      <Header title={"Users"} />
      <div className="md:my-8 my-4 mx-auto md:mx-4">
        <NormalTable
          tableStructure={userTableStructure}
          data={data}
          isLoading={loading}
          // options={actions}
        />
      </div>
    </div>
  );
};

export default UserList;
