import { Routes, Route } from "react-router-dom";
import CustomerLayout from "../layouts/CustomerLayout";

import AuthLayout from "../layouts/AuthLayout";
import CustomerLayout from "../layouts/CustomerLayout";
import AdminLayout from "../layouts/AdminLayout";

import ProtectedRoute from "./ProtectedRoute";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import Home from "../pages/customer/Home";
import CakeDetail from "../pages/customer/CakeDetail";
import Cart from "../pages/customer/Cart";
import Checkout from "../pages/customer/Checkout";
import OrderHistory from "../pages/customer/OrderHistory";
import CustomerOrderDetail from "../pages/customer/CustomerOrderDetail";
import Profile from "../pages/customer/Profile";
import CakeDesigner from "../pages/customCake/CakeDesigner";
import OrderDetail from "../pages/customer/OrderDetail";

import CustomCake from "../pages/customCake/CustomCake";

import OrderManagement from "../pages/admin/OrderManagement";

import NotFound from "../pages/NotFound";

function AppRoutes() {
  return (
    <Routes>
      {/* Auth */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Customer */}
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/cakes/:id" element={<CakeDetail />} />

        <Route element={<ProtectedRoute role="customer" />}>
          <Route path="/custom-cake" element={<CustomCake />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<OrderHistory />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
        </Route>
      </Route>

      {/* Admin */}
      <Route element={<ProtectedRoute role="staff" />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/orders" element={<OrderManagement />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
