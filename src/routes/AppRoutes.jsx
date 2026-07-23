import { Navigate, Route, Routes } from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout";
import CustomerLayout from "../layouts/CustomerLayout";
import AdminLayout from "../layouts/AdminLayout";

import ProtectedRoute from "./ProtectedRoute";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import Home from "../pages/customer/Home";

/*
  Ghi rõ đuôi .jsx để tránh lấy nhầm
  CakeList.js hoặc CakeDetail.js sau khi merge.
*/
import CakeList from "../pages/customer/CakeList.jsx";
import CakeDetail from "../pages/customer/CakeDetail.jsx";

import Cart from "../pages/customer/Cart";
import Checkout from "../pages/customer/Checkout";
import OrderHistory from "../pages/customer/OrderHistory";
import OrderDetail from "../pages/customer/OrderDetail";
import OrderSuccess from "../pages/customer/OrderSuccess";
import Profile from "../pages/customer/Profile";

import CakeDesigner from "../pages/customCake/CakeDesigner";

import OrderManagement from "../pages/admin/OrderManagement";
import FeedbackManagement from "../pages/admin/FeedbackManagement";

import NotFound from "../pages/NotFound";

import useAuth from "../hooks/useAuth";

function DynamicLayout() {
  const { user } = useAuth();

  const normalizedRole = String(user?.role || "")
    .trim()
    .toLowerCase();

  if (normalizedRole === "owner" || normalizedRole === "staff") {
    return <AdminLayout />;
  }

  return <CustomerLayout />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Trang mặc định */}
      <Route path="/" element={<Navigate to="/home" replace />} />

      {/* ================= AUTH ================= */}

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />
      </Route>

      {/* ================= CUSTOMER ================= */}

      <Route element={<CustomerLayout />}>
        <Route path="/home" element={<Home />} />

        {/* Danh sách bánh */}
        <Route path="/cakes" element={<CakeList />} />

        {/* Chi tiết đúng một bánh */}
        <Route path="/cakes/:id" element={<CakeDetail />} />

        {/* Customer phải đăng nhập */}
        <Route element={<ProtectedRoute role="customer" />}>
          <Route path="/custom-cake" element={<CakeDesigner />} />

          <Route path="/cart" element={<Cart />} />

          <Route path="/checkout" element={<Checkout />} />

          <Route path="/order-success/:id" element={<OrderSuccess />} />

          <Route path="/orders" element={<OrderHistory />} />

          <Route path="/orders/:id" element={<OrderDetail />} />
        </Route>
      </Route>

      {/* ================= PROFILE ================= */}

      <Route element={<ProtectedRoute role={["customer", "owner", "staff"]} />}>
        <Route element={<DynamicLayout />}>
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      {/* ================= OWNER ================= */}

      <Route element={<ProtectedRoute role="owner" />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/orders" element={<OrderManagement />} />

          <Route path="/admin/feedbacks" element={<FeedbackManagement />} />
        </Route>
      </Route>

      {/* ================= NOT FOUND ================= */}

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
