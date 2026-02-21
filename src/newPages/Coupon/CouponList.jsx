import React, { useEffect, useState } from "react";
import Header from "../../components/designs/TopComponents/Header";
import NormalTable from "../../components/designs/Tables/NormalTable";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import { API_URI } from "../../utils/Global/main";
import { useNavigate } from "react-router-dom";
import { ViewList } from "@mui/icons-material";

const CouponList = ({ token, routepath, permissions = [] }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isSubAdmin = routepath === "/office/";

  // Permission checks
  const canAdd = !isSubAdmin || permissions.includes("coupon_management_add");
  const canEdit = !isSubAdmin || permissions.includes("coupon_management_edit");
  const canDelete = canEdit;
  const canViewOrders = !isSubAdmin || permissions.includes("order_management_list");

  const fetchCoupons = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_URI}/api/coupon/all?couponType=Admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const coupons = res.data?.data || [];

      const updatedData = coupons.map((c, idx) => ({
        ...c,
        index: idx + 1,
        discount:
          c.type === "percentage"
            ? `${c.value}%`
            : `₹${c.value} Flat`,
        validity: `${new Date(c.startDate).toLocaleDateString()} - ${new Date(
          c.expiryDate
        ).toLocaleDateString()}`,
        status: c.isActive ? "Active" : "Inactive",
      }));

      setData(updatedData);
    } catch (error) {
      console.error("Error fetching coupons:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleAdd = () => {
    if (canAdd) navigate(`${routepath}coupons/add`);
  };

  const handleEdit = (coupon) => {
    if (canEdit) navigate(`${routepath}coupons/edit/${coupon._id}`);
  };

  const handleDelete = async (coupon) => {
    if (!canDelete) return;

    if (!window.confirm("Are you sure you want to delete this coupon?")) return;

    try {
      await axios.delete(`${API_URI}/api/coupon/delete/${coupon._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setData((prev) => prev.filter((c) => c._id !== coupon._id));
    } catch (error) {
      console.error("Error deleting coupon:", error);
      alert(error.response?.data?.message || "Something went wrong");
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
    // canViewOrders && {
    //   name: "Coupon Order",
    //   handleClick: (coupon) =>
    //     navigate(`${routepath}orders/coupon/${coupon.code}`),
    //   icon: <ViewList />,
    // }
  ].filter(Boolean);

  const couponTableStructure = [
    { header: "S.NO", accessKey: "index" },
    { header: "Code", accessKey: "code" },
    { header: "Discount", accessKey: "discount" },
    { header: "Validity", accessKey: "validity" },
    { header: "Status", accessKey: "status" },
    {
      header: "Created At",
      accessKey: "createdAt",
      cell: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  return (
    <div className="my-2 flex-1 md:mr-2 md:p-6 pt-[60px] px-1 md:rounded-2xl bg-white border shadow overflow-y-auto">
      <Header
        title={"Coupons"}
        handleClick={handleAdd}
        addTitle={"Coupon"}
        add={canAdd}
      />

      <div className="md:my-8 my-4 mx-auto md:mx-4">
        <NormalTable
          tableStructure={couponTableStructure}
          data={data}
          isLoading={loading}
          options={actions}
        />
      </div>
    </div>
  );
};

export default CouponList;
