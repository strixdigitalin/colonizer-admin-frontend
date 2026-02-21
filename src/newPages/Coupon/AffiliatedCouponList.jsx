import React, { useEffect, useState } from "react";
import Header from "../../components/designs/TopComponents/Header";
import NormalTable from "../../components/designs/Tables/NormalTable";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import { API_URI } from "../../utils/Global/main";
import { useNavigate } from "react-router-dom";
import { ViewList } from "@mui/icons-material";

const AffiliatedCouponList = ({ token, routepath, permissions = [] }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isSubAdmin = routepath === "/office/";

  const canAdd = !isSubAdmin || permissions.includes("coupon_management_add");
  const canEdit = !isSubAdmin || permissions.includes("coupon_management_edit");
  const canDelete = canEdit; 
  const canViewOrders = !isSubAdmin || permissions.includes("order_management_list");

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URI}/api/coupon/all?couponType=Affiliated`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const coupons = res.data?.data || [];

      const updatedData = coupons.map((c, idx) => ({
        ...c,
        index: idx + 1,
        discount:
          c.discountType === "percentage"
            ? `${c.discountValue}%`
            : `₹${c.discountValue} Flat`,
        validity: `${new Date(c.validFrom).toLocaleDateString()} - ${new Date(
          c.validTill
        ).toLocaleDateString()}`,
        status: c.isActive ? "Active" : "Inactive",
        ownerName: c.name || "N/A",
        location: c.location || "N/A",
        contact: c.number || "N/A",
      }));

      setData(updatedData);
    } catch (error) {
      console.error("Error fetching affiliated coupons:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleDelete = async (coupon) => {
    if (!canDelete) return;

    if (window.confirm("Are you sure you want to delete this coupon?")) {
      try {
        await axios.delete(`${API_URI}/api/coupon/delete/${coupon._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setData((prev) => prev.filter((c) => c._id !== coupon._id));
      } catch (error) {
        alert(error.response?.data?.message || "Delete failed");
      }
    }
  };

  // -------------------- Actions --------------------
  const actions = [
    canEdit && {
      name: "Edit",
      handleClick: (coupon) =>
        navigate(`${routepath}coupons/edit/${coupon._id}`),
      icon: <EditIcon />,
    },
    canDelete && {
      name: "Delete",
      handleClick: handleDelete,
      icon: <DeleteIcon />,
    },
    canViewOrders && {
      name: "Coupon Order",
      handleClick: (coupon) =>
        navigate(`${routepath}orders/coupon/${coupon.code}`),
      icon: <ViewList />,
    },
  ].filter(Boolean);
  // -------------------------------------------------

  const couponTableStructure = [
    { header: "S.NO", accessKey: "index" },
    { header: "Code", accessKey: "code" },
    { header: "Discount", accessKey: "discount" },
    { header: "Validity", accessKey: "validity" },
    { header: "Owner Name", accessKey: "ownerName" },
    { header: "Location", accessKey: "location" },
    { header: "Contact", accessKey: "contact" },
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
        title={"Affiliated Coupons"}
        handleClick={() => canAdd && navigate(`${routepath}coupons/add`)}
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

export default AffiliatedCouponList;
