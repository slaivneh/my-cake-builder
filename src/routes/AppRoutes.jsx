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

import CustomCake from "../pages/customCake/CustomCake";

import OrderManagement from "../pages/admin/OrderManagement";

import NotFound from "../pages/NotFound";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<CustomerLayout />}>
        <Route path="/home" element={<Home />} />

        <Route path="/cakes" element={<CakeList />} />

        <Route path="/cakes/:id" element={<CakeDetail />} />

        <Route element={<ProtectedRoute role="customer" />}>
          <Route path="/custom-cake" element={<CustomCake />} />

          <Route path="/cart" element={<Cart />} />

          <Route path="/checkout" element={<Checkout />} />

          <Route path="/orders" element={<OrderHistory />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute role="owner" />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/orders" element={<OrderManagement />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
