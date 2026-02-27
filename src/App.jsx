import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Auth from "./pages/Auth";
import BlogList from "./newPages/Blog/BlogList.jsx";
import Dashboard from "./pages/Home/Dashboard.jsx";
import OrderList from "./newPages/Order/OrderList.jsx";
import CouponList from "./newPages/Coupon/CouponList.jsx";
import SubAdminList from "./newPages/Subadmin/SubAdminList.jsx";
import CouponAddEdit from "./newPages/Coupon/CouponAddEdit.jsx";
import AddOrEditSubadmin from "./newPages/Subadmin/AddOrEditSubadmin.jsx";




// logout utils import 
import { setupInterceptors } from "./utils/authUtil";
import { logoutUtil } from "./utils/logoutUtil.js";
import { useEffect } from "react";
import BlogAddEdit from "./newPages/Blog/BlogAddEdit.jsx";
import FaqList from "./newPages/Faq/FaqList.jsx";
import FaqAddEdit from "./newPages/Faq/FaqAddEdit.jsx";

import BrokerList from "./newPages/Broker/BrokerList.jsx";
import CustomerList from "./newPages/Customer/CustomerList.jsx";
import ColonyList from "./newPages/Colony/ColonyList.jsx";
import ColonyAddEdit from "./newPages/Colony/ColonyAddEdit.jsx";
import Marker from "./newPages/Plot/Marker.jsx";
import MainMarker from "./newPages/Plot/MainMarker.jsx";
import MapViewer from "./newPages/Map/MapViewer.jsx";

// Get subadmin permissions from localStorage
const getSubadminPermissions = () => {
  try {
    const subadminData = localStorage.getItem('adc_aspirants_subadmin');
    if (subadminData) {
      const parsed = JSON.parse(subadminData);
      return parsed.permissions || [];
    }
    return [];
  } catch (error) {
    return [];
  }
};

function App() {
  const subadminPermissions = getSubadminPermissions();
  const adminToken = localStorage.getItem("colonizer_admin_token");
  const subAdminToken = localStorage.getItem("adc_aspirants_subadmin_token");
  useEffect(() => {
    setupInterceptors(logoutUtil);
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Layout with ProtectedRoute */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<Dashboard token={adminToken} routepath="/" />} />
          <Route path="blog" element={<BlogList token={adminToken} routepath="/" />} />
          <Route path="blog/add" element={<BlogAddEdit token={adminToken} routepath="/" />} />
          <Route path="blog/edit/:id" element={<BlogAddEdit token={adminToken} routepath="/" />} />
          {/* ==========new Routes================== */}
          <Route path="brokers" element={<BrokerList token={adminToken} routepath="/" />} />
          <Route path="customers" element={<CustomerList token={adminToken} routepath="/" />} />
          <Route path="marker" element={<Marker token={adminToken} routepath="/" />} />
          <Route path="colony" element={<ColonyList token={adminToken} routepath="/" />} />
          <Route path="colony/add" element={<ColonyAddEdit token={adminToken} routepath="/" />} />
          <Route path="colony/edit/:id" element={<ColonyAddEdit token={adminToken} routepath="/" />} />
          <Route path="colony/map/:id" element={<MapViewer token={adminToken} routepath="/" />} />

          {/* ==========new Routes================== */}
          <Route path="orders" element={<OrderList token={adminToken} routepath="/" />} />
          <Route path="coupons" element={<CouponList token={adminToken} routepath="/" />} />
          <Route path="coupons/add" element={<CouponAddEdit token={adminToken} routepath="/" />} />
          <Route path="coupons/edit/:id" element={<CouponAddEdit token={adminToken} routepath="/" />} />
          <Route path="faq" element={<FaqList token={adminToken} routepath="/" />} />
          <Route path="faq/add" element={<FaqAddEdit token={adminToken} routepath="/" />} />
          <Route path="faq/edit/:id" element={<FaqAddEdit token={adminToken} routepath="/" />} />
          <Route path="subadmin" element={<SubAdminList token={adminToken} routepath="/" />} />
          <Route path="subadmin/add" element={<AddOrEditSubadmin token={adminToken} routepath="/" />} />
          <Route path="subadmin/edit/:id" element={<AddOrEditSubadmin token={adminToken} routepath="/" />} />

        </Route>
        {/* Auth routes */}
        <Route path="/auth/signin" element={<Auth />} />
        <Route path="*" element={<Navigate to="/auth/signin" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
