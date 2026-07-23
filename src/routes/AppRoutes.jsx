import { Navigate, Route, Routes } from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout";
import CustomerLayout from "../layouts/CustomerLayout";
import AdminLayout from "../layouts/AdminLayout";

import ProtectedRoute from "./ProtectedRoute";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import Home from "../pages/customer/Home";
import CakeList from "../pages/customer/CakeList";
import CakeDetail from "../pages/customer/CakeDetail";
import Cart from "../pages/customer/Cart";
import Checkout from "../pages/customer/Checkout";
import OrderHistory from "../pages/customer/OrderHistory";
import OrderDetail from "../pages/customer/OrderDetail";
import OrderSuccess from "../pages/customer/OrderSuccess";

import CakeDesigner from "../pages/customCake/CakeDesigner";

import OrderManagement from "../pages/admin/OrderManagement";

import Profile from "../pages/customer/Profile";
import useAuth from "../hooks/useAuth";

import NotFound from "../pages/NotFound";
import FeedbackManagement from "../pages/admin/FeedbackManagement";

function DynamicLayout() {
  const { user } = useAuth();

  if (user?.role === "owner" || user?.role === "staff") {
    return <AdminLayout />;
  }

  return <CustomerLayout />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />

      {/* Auth */}

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />
      </Route>

      {/* Customer public */}

      <Route element={<CustomerLayout />}>
        <Route path="/home" element={<Home />} />

        <Route path="/cakes" element={<CakeList />} />

        <Route path="/cakes/:id" element={<CakeDetail />} />

        {/* Customer protected */}

        <Route element={<ProtectedRoute role="customer" />}>
          <Route path="/custom-cake" element={<CakeDesigner />} />
          <Route path="/cart" element={<Cart />} />

          <Route path="/checkout" element={<Checkout />} />

          <Route path="/order-success/:id" element={<OrderSuccess />} />

          <Route path="/orders" element={<OrderHistory />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
        </Route>
      </Route>

      {/* Profile (accessible by customer, staff, and owner) */}
      <Route element={<ProtectedRoute role={["customer", "owner", "staff"]} />}>
        <Route element={<DynamicLayout />}>
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      {/* Owner */}

      <Route element={<ProtectedRoute role="owner" />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/orders" element={<OrderManagement />} />
          <Route path="/admin/feedbacks" element={<FeedbackManagement />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
