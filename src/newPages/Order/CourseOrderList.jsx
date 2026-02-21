import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/designs/TopComponents/Header";
import NormalTable from "../../components/designs/Tables/NormalTable";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import { API_URI } from "../../utils/Global/main";
import UpdateStatusDialog from "./UpdateStatusDialog";

const CourseOrderList = ({ token, routepath, permissions = [] }) => {
  const { courseId } = useParams();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const isSubAdmin = routepath === "/office/";
  const canList = !isSubAdmin || permissions.includes("order_management_list");
  const canEdit = !isSubAdmin || permissions.includes("order_management_edit");

  useEffect(() => {
    if (!canList || !courseId) return;
    fetchOrders();
  }, [courseId]);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API_URI}/api/course/order/admin/by-course/${courseId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const formatted = res.data?.data?.map((order, index) => ({
        _id: order._id,
        index: index + 1,
        orderId: order.orderId || order._id.slice(-6).toUpperCase(),
        customerName: order.user?.name || "N/A",
        email: order.user?.email || "N/A",
        courseName: order?.items?.course?.name || "N/A",
        amount: order.amount,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        isActive: order.isActive?"Active":"Inactive",
        createdAt: order.createdAt,
        raw: order,
      }));

      setData(formatted || []);
    } catch (err) {
      console.error("Error fetching course orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenUpdate = (order) => {
    if (!canEdit) return;
    setSelectedOrder(order.raw);
    setOpenDialog(true);
  };

  const handleUpdated = () => {
    setOpenDialog(false);
    fetchOrders();
  };

  const actions = [
    canEdit && {
      name: "Update",
      handleClick: handleOpenUpdate,
      icon: <EditIcon />,
    },
  ];

  const tableStructure = [
    { header: "S.NO", accessKey: "index" },
    { header: "Order ID", accessKey: "orderId" },
    { header: "Customer", accessKey: "customerName" },
    { header: "Email", accessKey: "email" },
    { header: "Amount", accessKey: "amount" },
    {
      header: "Payment Status",
      accessKey: "paymentStatus",
      cell: (value) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            value === "paid"
              ? "bg-green-100 text-green-700"
              : value === "pending"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {value}
        </span>
      ),
    },
    { header: "Payment Method", accessKey: "paymentMethod" },
    {
      header: "Active",
      accessKey: "isActive",
      cell: (value) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            value ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {value ? "Yes" : "No"}
        </span>
      ),
    },
    {
      header: "Created At",
      accessKey: "createdAt",
      cell: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  if (!canList) {
    return (
      <div className="p-10 text-center text-red-600 text-xl font-semibold">
        You do not have permission to view orders.
      </div>
    );
  }

  return (
    <div className="my-2 flex-1 md:mr-2 md:p-6 pt-[60px] px-1 md:rounded-2xl bg-white border shadow overflow-y-auto">
      <Header title={"Course Orders"} />

    {
        data && data.length > 0 && data[0]?.courseName && (
            <div>
                <p className="text-gray-500">{data[0]?.courseName}</p>
            </div>
        )
    }
      <div className="md:my-8 my-4 mx-auto md:mx-4">
        <NormalTable
          tableStructure={tableStructure}
          data={data}
          isLoading={loading}
          options={actions}
        />
      </div>

      {selectedOrder && (
        <UpdateStatusDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          order={selectedOrder}
          token={token}
          onUpdated={handleUpdated}
        />
      )}
    </div>
  );
};

export default CourseOrderList;
