import React, { useEffect, useState } from "react";
import Header from "../../components/designs/TopComponents/Header";
import NormalTable from "../../components/designs/Tables/NormalTable";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { API_URI } from "../../utils/Global/main";

const LeadList = ({token}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URI}/api/contact`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const leads = res.data?.data || [];
      const updatedData = leads.map((lead, idx) => ({
        ...lead,
        index: idx + 1,
        name : `${lead.firstName} ${lead.lastName}`
      }));
      setData(updatedData);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleDelete = async (lead) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      setLoading(true);
      try {
        await axios.delete(`${API_URI}/api/lead/delete/${lead._id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        fetchLeads();
      } catch (error) {
        console.error("Delete failed:", error);
      }
      setLoading(false);
    }
  };

  const actions = [
    { name: "Delete", handleClick: handleDelete, icon: <DeleteIcon /> }
  ];

  const leadTableStructure = [
    { header: "S.NO", accessKey: "index" },
    { header: "Name", accessKey: "name" },
    { header: "Email", accessKey: "email" },
    { header: "Phone", accessKey: "phoneNumber" },
    { header: "Message", accessKey: "message" },
    {
      header: "Created At",
      accessKey: "createdAt",
      cell: (value) => new Date(value).toLocaleDateString()
    }
  ];

  return (
    <div className="my-2 flex-1 md:mr-2 md:p-6 pt-[60px] px-1 md:rounded-2xl bg-white border shadow overflow-y-auto">
      <Header
        title={"Leads"}
        add={false} 
      />
      <div className="md:my-8 my-4 mx-auto md:mx-4">
        <NormalTable
          tableStructure={leadTableStructure}
          data={data}
          isLoading={loading}
          // options={actions}
        />
      </div>
    </div>
  );
};

export default LeadList;
