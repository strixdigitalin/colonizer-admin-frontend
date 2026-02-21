import React, { useEffect, useState } from "react";
import Header from "../../components/designs/TopComponents/Header";
import NormalTable from "../../components/designs/Tables/NormalTable";
import axios from "axios";
import { API_URI } from "../../utils/Global/main";
import { useNavigate } from "react-router-dom";

const BrokerList = ({ token, routepath }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchBrokers = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API_URI}/api/v1/broker/owner/all`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const brokers = res.data?.data || [];

      const updatedData = brokers.map((broker, index) => ({
        ...broker,
        index: index + 1,
        status: broker.isActive ? "Active" : "Inactive",
        lastLogin: broker.lastLogin
          ? new Date(broker.lastLogin).toLocaleDateString()
          : "Never",
        createdAt: new Date(broker.createdAt).toLocaleDateString(),
      }));

      setData(updatedData);
    } catch (error) {
      console.error("Error fetching brokers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrokers();
  }, []);

  const brokerTableStructure = [
    { header: "S.NO", accessKey: "index" },
    { header: "Name", accessKey: "name" },
    { header: "Email", accessKey: "email" },
    { header: "Phone", accessKey: "phone" },
    { header: "Role", accessKey: "role" },
    { header: "Status", accessKey: "status" },
    { header: "Last Login", accessKey: "lastLogin" },
    { header: "Created At", accessKey: "createdAt" },
  ];

  return (
    <div className="my-2 flex-1 md:mr-2 md:p-6 pt-[60px] px-1 md:rounded-2xl bg-white border shadow overflow-y-auto">
      <Header title={"Brokers"} />

      <div className="md:my-8 my-4 mx-auto md:mx-4">
        <NormalTable
          tableStructure={brokerTableStructure}
          data={data}
          isLoading={loading}
        />
      </div>
    </div>
  );
};

export default BrokerList;
