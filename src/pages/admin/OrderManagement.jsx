import React, { useState, useEffect } from "react";
import { getOrders, updateStatus } from "../../services/orderService";
import axiosClient from "../../services/axiosClient";
import Loading from "../../components/common/Loading";
import OrderTable from "../../components/admin/OrderTable";
import OrderDetailModal from "../../components/admin/OrderDetailModal";

function OrderManagement() {
  // --- States ---
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchOrder, setSearchOrder] = useState("");
  const [searchCustomer, setSearchCustomer] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Metadata states for mapping custom cake configurations
  const [metadata, setMetadata] = useState({
    sizes: [],
    layers: [],
    bases: [],
    fillings: [],
    creams: [],
    colors: [],
    toppings: [],
  });

  // --- Fetching Data ---
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await getOrders();
      const data = response.data || response;
      if (Array.isArray(data)) {
        const sorted = [...data].sort((a, b) => b.id - a.id);
        setOrders(sorted);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMetadata = async () => {
    try {
      const [sizesRes, layersRes, basesRes, fillingsRes, creamsRes, colorsRes, toppingsRes] = await Promise.all([
        axiosClient.get("/cakeSizes").catch(() => ({ data: [] })),
        axiosClient.get("/layerOptions").catch(() => ({ data: [] })),
        axiosClient.get("/cakeBases").catch(() => ({ data: [] })),
        axiosClient.get("/fillings").catch(() => ({ data: [] })),
        axiosClient.get("/creamTypes").catch(() => ({ data: [] })),
        axiosClient.get("/cakeColors").catch(() => ({ data: [] })),
        axiosClient.get("/toppings").catch(() => ({ data: [] })),
      ]);

      setMetadata({
        sizes: sizesRes.data || [],
        layers: layersRes.data || [],
        bases: basesRes.data || [],
        fillings: fillingsRes.data || [],
        creams: creamsRes.data || [],
        colors: colorsRes.data || [],
        toppings: toppingsRes.data || [],
      });
    } catch (error) {
      console.error("Error fetching metadata config:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchMetadata();
  }, []);

  // --- Helper Functions ---
  const getNextStatus = (currentStatus) => {
    const flow = ["Pending", "Confirmed", "Preparing", "Ready", "Shipping", "Completed"];
    const index = flow.indexOf(currentStatus);
    if (index !== -1 && index < flow.length - 1) {
      return flow[index + 1];
    }
    return null;
  };

  const getStatusText = (status) => {
    switch (status) {
      case "Pending":
        return "Chờ xác nhận";
      case "Confirmed":
        return "Đã xác nhận";
      case "Preparing":
        return "Đang chuẩn bị bánh";
      case "Ready":
        return "Bánh đã sẵn sàng";
      case "Shipping":
        return "Đang giao hàng";
      case "Completed":
        return "Đã hoàn thành";
      case "Cancelled":
      case "Cancel":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const getStatusBadge = (status) => {
    let bg = "";
    let text = "";
    switch (status) {
      case "Pending":
        bg = "#FFEEC1"; // soft yellow
        text = "#B27A00";
        break;
      case "Confirmed":
        bg = "#D0E1FD"; // soft blue
        text = "#1C4E9E";
        break;
      case "Preparing":
        bg = "#F3D4FC"; // soft purple
        text = "#7B1FA2";
        break;
      case "Ready":
        bg = "#E8F5E9"; // soft green
        text = "#2E7D32";
        break;
      case "Shipping":
        bg = "#E0F7FA"; // soft cyan
        text = "#006064";
        break;
      case "Completed":
        bg = "#D4EDDA"; // pastel green success
        text = "#155724";
        break;
      case "Cancelled":
      case "Cancel":
        bg = "#F8D7DA"; // pastel red
        text = "#721C24";
        break;
      default:
        bg = "#E2E8F0";
        text = "#4A5568";
    }
    return (
      <span
        className="badge px-3 py-2 rounded-pill fw-semibold"
        style={{ backgroundColor: bg, color: text, fontSize: "0.85rem" }}
      >
        {getStatusText(status)}
      </span>
    );
  };

  // --- Actions ---
  const handleUpdateStatus = async (orderId, currentStatus, actionType) => {
    let nextStatus = "";
    if (actionType === "confirm") {
      nextStatus = "Confirmed";
    } else if (actionType === "next") {
      nextStatus = getNextStatus(currentStatus);
    } else if (actionType === "cancel") {
      nextStatus = "Cancelled";
    }

    if (!nextStatus) return;

    const confirmMessage = `Bạn có chắc chắn muốn chuyển trạng thái đơn hàng này sang "${getStatusText(
      nextStatus
    )}"?`;
    if (!window.confirm(confirmMessage)) return;

    const orderToUpdate = orders.find((o) => o.id === orderId);
    if (!orderToUpdate) return;

    const updatedHistory = [
      ...(orderToUpdate.statusHistory || []),
      {
        status: nextStatus,
        time: new Date().toISOString(),
      },
    ];

    try {
      setLoading(true);
      await updateStatus(orderId, {
        status: nextStatus,
        statusHistory: updatedHistory,
        updatedAt: new Date().toISOString(),
      });

      await fetchOrders();

      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => ({
          ...prev,
          status: nextStatus,
          statusHistory: updatedHistory,
          updatedAt: new Date().toISOString(),
        }));
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Đã xảy ra lỗi khi cập nhật trạng thái đơn hàng!");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetailModal = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseDetailModal = () => {
    setSelectedOrder(null);
    setShowModal(false);
  };

  // --- Filtering ---
  const filteredOrders = orders.filter((order) => {
    const matchCode = (order.orderCode || "")
      .toLowerCase()
      .includes(searchOrder.toLowerCase().trim());
    const matchCustomer = (order.customerName || "")
      .toLowerCase()
      .includes(searchCustomer.toLowerCase().trim());
    const matchStatus = statusFilter === "" || order.status === statusFilter;
    return matchCode && matchCustomer && matchStatus;
  });

  return (
    <>
      {/* Background configurations */}
      <div
        style={{
          backgroundImage: "url('/images/background (2).jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -2,
          minHeight: "100vh",
        }}
      />
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.6)",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
          minHeight: "100vh",
        }}
      />

      {/* Main card panel */}
      <div className="card border-0 rounded-4 shadow-sm bg-white p-4 p-md-5 my-2">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
          <h2 className="fw-bold mb-3 mb-md-0" style={{ color: "#F48FB1" }}>
            Order Management
          </h2>
          <button
            className="btn text-white rounded-pill px-4"
            style={{ backgroundColor: "#F48FB1", borderColor: "#F48FB1" }}
            onClick={fetchOrders}
            disabled={loading}
          >
            🔄 Refresh List
          </button>
        </div>

        {/* Filters and Searches Row */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-md-4">
            <label className="form-label text-secondary fw-semibold">Search Order Code</label>
            <input
              type="text"
              className="form-control rounded-pill px-3 border"
              placeholder="🔍 E.g. ORD000001"
              value={searchOrder}
              onChange={(e) => setSearchOrder(e.target.value)}
            />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label text-secondary fw-semibold">Search Customer</label>
            <input
              type="text"
              className="form-control rounded-pill px-3 border"
              placeholder="👤 Customer name..."
              value={searchCustomer}
              onChange={(e) => setSearchCustomer(e.target.value)}
            />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label text-secondary fw-semibold">Filter Status</label>
            <select
              className="form-select rounded-pill px-3 border"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Pending">Chờ xác nhận (Pending)</option>
              <option value="Confirmed">Đã xác nhận (Confirmed)</option>
              <option value="Preparing">Đang chuẩn bị bánh (Preparing)</option>
              <option value="Ready">Bánh đã sẵn sàng (Ready)</option>
              <option value="Shipping">Đang giao hàng (Shipping)</option>
              <option value="Completed">Đã hoàn thành (Completed)</option>
              <option value="Cancelled">Đã hủy (Cancelled)</option>
            </select>
          </div>
        </div>

        {/* Responsive Orders Table */}
        {loading && orders.length === 0 ? (
          <Loading />
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-5 border rounded-3 bg-light text-muted">
            No matching orders found.
          </div>
        ) : (
          <OrderTable
            orders={filteredOrders}
            onView={handleOpenDetailModal}
            onUpdateStatus={handleUpdateStatus}
            getNextStatus={getNextStatus}
            getStatusBadge={getStatusBadge}
            getStatusText={getStatusText}
          />
        )}
      </div>

      {/* Details Modal */}
      <OrderDetailModal
        show={showModal}
        order={selectedOrder}
        onClose={handleCloseDetailModal}
        onUpdateStatus={handleUpdateStatus}
        getNextStatus={getNextStatus}
        getStatusBadge={getStatusBadge}
        getStatusText={getStatusText}
        metadata={metadata}
      />
    </>
  );
}

export default OrderManagement;
