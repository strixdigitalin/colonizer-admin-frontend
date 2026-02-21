import React, { useEffect, useState } from "react";
import Header from "../../components/designs/TopComponents/Header";
import NormalTable from "../../components/designs/Tables/NormalTable";
import axios from "axios";
import { API_URI } from "../../utils/Global/main";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const ColonyList = ({ token }) => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchColonies = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_URI}/api/v1/colony/owner/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const colonies = res.data?.data || [];

      const updatedData = colonies.map((colony, index) => ({
        ...colony,
        index: index + 1,
        status: colony.isActive ? "Active" : "Inactive",
        pricePerSqft: colony.pricePerSqft ? `₹${colony.pricePerSqft}` : "N/A",
        createdAt: new Date(colony.createdAt).toLocaleDateString(),
      }));

      setData(updatedData);
    } catch (error) {
      console.error("Error fetching colonies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColonies();
  }, []);

  const handleAdd = () => {
    navigate("/colony/add");
  };

  const handleEdit = (colony) => {
    navigate(`/colony/edit/${colony._id}`);
  };

  const handleUploadMap = (colony) => {
    navigate(`/colony/map/${colony._id}`);
  };

  const handleDelete = async (colony) => {
    if (window.confirm("Are you sure you want to delete this colony?")) {
      try {
        await axios.delete(`${API_URI}/api/v1/colony/owner/delete/${colony._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchColonies();
      } catch (error) {
        console.error("Error deleting colony:", error);
      }
    }
  };

  const colonyTableStructure = [
    { header: "S.NO", accessKey: "index" },
    { header: "Name", accessKey: "name" },
    { header: "Location", accessKey: "location" },
    // { header: "City", accessKey: "city" },
    { header: "Total Plots", accessKey: "totalPlots" },
    { header: "Available Plots", accessKey: "availablePlots" },
    { header: "Price/Sqft", accessKey: "pricePerSqft" },
    { header: "Status", accessKey: "status" },
    { header: "Created At", accessKey: "createdAt" },
  ];

  const actions = [
    {
      name: "Edit",
      handleClick: handleEdit,
      icon: <EditIcon />,
    },
    {
      name: "Upload Map",
      handleClick: handleUploadMap,
      icon: <EditIcon />,
    },
    {
      name: "Delete",
      handleClick: handleDelete,
      icon: <DeleteIcon />,
    },
  ];

  return (
    <div className="my-2 flex-1 md:mr-2 md:p-6 pt-[60px] px-1 md:rounded-2xl bg-white border shadow overflow-y-auto">
      <Header
        title={"Colonies"}
        handleClick={handleAdd}
        addTitle={"Colony"}
        add
      />

      <div className="md:my-8 my-4 mx-auto md:mx-4">
        <NormalTable
          tableStructure={colonyTableStructure}
          data={data}
          isLoading={loading}
          options={actions}
        />
      </div>
    </div>
  );
};

export default ColonyList;
