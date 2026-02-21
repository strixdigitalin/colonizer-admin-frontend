import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/designs/TopComponents/Header";
import NormalTable from "../../components/designs/Tables/NormalTable";
import EditIcon from "@mui/icons-material/Edit";
import Receipt from "@mui/icons-material/Receipt";
import axios from "axios";
import { API_URI } from "../../utils/Global/main";
import UpdateStatusDialog from "./UpdateStatusDialog";
import { generateOrderInvoice } from "../../utils/invoiceGenerator";

const OrdersByCoupon = ({ token, routepath }) => {
    const { coupon } = useParams();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const fetchOrdersByCoupon = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URI}/api/order/coupon/${coupon}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const formatted = res.data?.data?.map((order, index) => ({
                ...order,
                _id: order._id,
                index: index + 1,
                orderId: order._id.slice(-6).toUpperCase(),
                customerName: order.userId?.name || "N/A",
                email: order.userId?.email || "N/A",
                totalAmount: order.finalAmount,
                paymentStatus:
                    order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1),
                orderStatus:
                    order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1),
                createdAt: order.createdAt,
            }));

            setData(formatted || []);
        } catch (err) {
            console.error("Error fetching orders:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrdersByCoupon();
    }, [coupon]);

    // const handleOpenUpdate = (order) => {
    //     setSelectedOrder(order);
    //     setOpenDialog(true);
    // };

    const handleStatusUpdated = () => {
        fetchOrdersByCoupon();
    };

    const actions = [
        // {
        //   name: "Update Status",
        //   handleClick: handleOpenUpdate,
        //   icon: <EditIcon />,
        // },
        {
            name: "Invoice",
            handleClick: (order) => generateOrderInvoice(order),
            icon: <Receipt />,
        },
    ];

    const orderTableStructure = [
        { header: "S.NO", accessKey: "index" },
        { header: "Order ID", accessKey: "orderId" },
        { header: "Customer", accessKey: "customerName" },
        { header: "Email", accessKey: "email" },
        { header: "Total Amount", accessKey: "totalAmount" },
        {
            header: "Payment Status",
            accessKey: "paymentStatus",
            cell: (value) => (
                <span
                    className={`px-2 py-1 rounded text-xs font-medium ${value === "Paid"
                            ? "bg-green-100 text-green-700"
                            : value === "Pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                        }`}
                >
                    {value}
                </span>
            ),
        },
        {
            header: "Order Status",
            accessKey: "orderStatus",
            cell: (value) => (
                <span
                    className={`px-2 py-1 rounded text-xs font-medium ${value === "Delivered"
                            ? "bg-green-100 text-green-700"
                            : value === "Shipped"
                                ? "bg-blue-100 text-blue-700"
                                : value === "Confirmed"
                                    ? "bg-indigo-100 text-indigo-700"
                                    : value === "Cancelled"
                                        ? "bg-red-100 text-red-700"
                                        : "bg-gray-100 text-gray-700"
                        }`}
                >
                    {value}
                </span>
            ),
        },
        {
            header: "Created At",
            accessKey: "createdAt",
            cell: (value) => new Date(value).toLocaleDateString(),
        },
    ];

    return (
        <div className="my-2 flex-1 md:mr-2 md:p-6 pt-[60px] px-1 md:rounded-2xl bg-white border shadow overflow-y-auto">
            <Header title={`Orders for Coupon: ${coupon.toUpperCase()}`} />
            <div className="md:my-8 my-4 mx-auto md:mx-4">
                <NormalTable
                    tableStructure={orderTableStructure}
                    data={data}
                    isLoading={loading}
                    options={actions}
                />
            </div>

            {/* {selectedOrder && (
        <UpdateStatusDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          order={selectedOrder}
          token={token}
          onUpdated={handleStatusUpdated}
        />
      )} */}
        </div>
    );
};

export default OrdersByCoupon;
