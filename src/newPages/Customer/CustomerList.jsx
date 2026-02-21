import React, { useEffect, useState } from "react";
import Header from "../../components/designs/TopComponents/Header";
import NormalTable from "../../components/designs/Tables/NormalTable";
import axios from "axios";
import { API_URI } from "../../utils/Global/main";

const CustomerList = ({ token }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCustomers = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API_URI}/api/v1/customer/owner/all`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const customers = res.data?.data || [];

      const updatedData = customers.map((customer, index) => ({
        ...customer,
        index: index + 1,
        status: customer.isActive ? "Active" : "Inactive",
        lastLogin: customer.lastLogin
          ? new Date(customer.lastLogin).toLocaleDateString()
          : "Never",
        createdAt: new Date(customer.createdAt).toLocaleDateString(),
      }));

      setData(updatedData);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const customerTableStructure = [
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
      <Header title={"Customers"} />

      <div className="md:my-8 my-4 mx-auto md:mx-4">
        <NormalTable
          tableStructure={customerTableStructure}
          data={data}
          isLoading={loading}
        />
      </div>
    </div>
  );
};

export default CustomerList;
