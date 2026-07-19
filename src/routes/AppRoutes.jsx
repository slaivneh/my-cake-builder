import { Routes, Route } from "react-router-dom";
import CustomerLayout from "../layouts/CustomerLayout";

import Home from "../pages/customer/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import CakeDetail from "../pages/customer/CakeDetail";
import Cart from "../pages/customer/Cart";
import Checkout from "../pages/customer/Checkout";
import OrderHistory from "../pages/customer/OrderHistory";
import CustomerOrderDetail from "../pages/customer/CustomerOrderDetail";
import Profile from "../pages/customer/Profile";
import CakeDesigner from "../pages/customCake/CakeDesigner";

import Dashboard from "../pages/admin/Dashboard";
import Orders from "../pages/admin/Orders";
import OrderDetail from "../pages/admin/OrderDetail";
import Revenue from "../pages/admin/Revenue";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Customer Routes with Layout */}
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/cakes/:id" element={<CakeDetail />} />
        <Route path="/custom-cake" element={<CakeDesigner />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="/orders/:id" element={<CustomerOrderDetail />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/orders" element={<Orders />} />
      <Route path="/dashboard/orders/:id" element={<OrderDetail />} />
      <Route path="/dashboard/revenue" element={<Revenue />} />
    </Routes>
  );
}
