import React, { useState, useEffect } from "react";
import { getOrders, updateStatus } from "../../services/orderService";
import axiosClient from "../../services/axiosClient";
import Loading from "../../components/common/Loading";

/**
 * OrderManagement Component
 * Handles the order list dashboard for staff and owners.
 * Provides searching, status filtering, details viewing, and status transition workflows.
 */
function OrderManagement() {
  // --- States ---
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchOrder, setSearchOrder] = useState("");
  const [searchCustomer, setSearchCustomer] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Metadata states for mapping custom cake configurator IDs to readable Vietnamese names
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
      // Handle potential axios response wrapper vs raw data structure
      const data = response.data || response;
      if (Array.isArray(data)) {
        // Sort orders by newest first (descending ID)
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
      console.error("Error fetching cake custom metadata config:", error);
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

  // Maps order status to a specific styling object matching pink pastel theme vibe
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

  // Helpers to resolve custom cake configuration IDs into Vietnamese text descriptions
  const getSizeName = (id) => metadata.sizes.find((s) => s.id === id)?.name || `Size #${id}`;
  const getLayerName = (id) => metadata.layers.find((l) => l.id === id)?.name || `${id} tầng`;
  const getBaseName = (id) => metadata.bases.find((b) => b.id === id)?.name || `Cốt #${id}`;
  const getFillingName = (id) => metadata.fillings.find((f) => f.id === id)?.name || `Nhân #${id}`;
  const getCreamName = (id) => metadata.creams.find((c) => c.id === id)?.name || `Kem #${id}`;
  const getColorName = (id) => metadata.colors.find((c) => c.id === id)?.name || `Màu #${id}`;
  const getToppingsNames = (ids) => {
    if (!ids || ids.length === 0) return "Không chọn";
    return ids
      .map((id) => metadata.toppings.find((t) => t.id === id)?.name || `Topping #${id}`)
      .join(", ");
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

    // Confirm dialog
    const confirmMessage = `Bạn có chắc chắn muốn chuyển trạng thái đơn hàng này sang "${getStatusText(
      nextStatus
    )}"?`;
    if (!window.confirm(confirmMessage)) return;

    // Find original order to extract history or initialize it
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

      // Refresh list
      await fetchOrders();

      // Keep detail modal details updated if open
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

  // --- Filtering Logic ---
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
      {/* Full-screen background image setup with overlay */}
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

      {/* Main dashboard content container placed in a white pastel rounded-4 card */}
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

        {/* Filter & Search Dashboard Header Controls */}
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

        {/* Responsive Table Dashboard */}
        {loading && orders.length === 0 ? (
          <Loading />
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-5 border rounded-3 bg-light text-muted">
            No matching orders found.
          </div>
        ) : (
          <div className="table-responsive rounded-3 border overflow-hidden shadow-sm bg-white">
            <table className="table table-hover align-middle mb-0">
              <thead style={{ backgroundColor: "#FFF8FA" }}>
                <tr>
                  <th className="py-3 px-4 text-secondary fw-semibold border-bottom-0">Order Code</th>
                  <th className="py-3 px-3 text-secondary fw-semibold border-bottom-0">Customer</th>
                  <th className="py-3 px-3 text-secondary fw-semibold border-bottom-0">Phone</th>
                  <th className="py-3 px-3 text-secondary fw-semibold border-bottom-0">Method</th>
                  <th className="py-3 px-3 text-secondary fw-semibold border-bottom-0">Delivery Date</th>
                  <th className="py-3 px-3 text-secondary fw-semibold border-bottom-0 text-end">Total Amount</th>
                  <th className="py-3 px-3 text-secondary fw-semibold border-bottom-0 text-center">Status</th>
                  <th className="py-3 px-4 text-secondary fw-semibold border-bottom-0 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const nextState = getNextStatus(order.status);
                  const isFinalState = order.status === "Completed" || order.status === "Cancelled" || order.status === "Cancel";

                  return (
                    <tr key={order.id}>
                      <td className="py-3 px-4 fw-bold" style={{ color: "#E91E63" }}>
                        {order.orderCode}
                      </td>
                      <td className="py-3 px-3 fw-semibold text-dark">{order.customerName}</td>
                      <td className="py-3 px-3 text-muted">{order.phone}</td>
                      <td className="py-3 px-3">
                        {order.receiveMethod === "delivery" ? (
                          <span className="badge bg-light text-secondary border">🚚 Delivery</span>
                        ) : (
                          <span className="badge bg-light text-secondary border">🏪 Pickup</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-secondary">
                        <small>
                          {order.deliveryDate} ({order.deliveryTime})
                        </small>
                      </td>
                      <td className="py-3 px-3 fw-bold text-end text-dark">
                        {order.total?.toLocaleString("vi-VN")} ₫
                      </td>
                      <td className="py-3 px-3 text-center">{getStatusBadge(order.status)}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="d-flex gap-2 justify-content-center flex-wrap">
                          {/* View Button */}
                          <button
                            className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                            onClick={() => handleOpenDetailModal(order)}
                          >
                            👁️ View
                          </button>

                          {/* Confirm Button for Pending */}
                          {order.status === "Pending" && (
                            <button
                              className="btn btn-sm text-white rounded-pill px-3"
                              style={{ backgroundColor: "#F48FB1", borderColor: "#F48FB1" }}
                              onClick={() => handleUpdateStatus(order.id, order.status, "confirm")}
                            >
                              ✅ Confirm
                            </button>
                          )}

                          {/* Next Status Button */}
                          {!isFinalState && order.status !== "Pending" && nextState && (
                            <button
                              className="btn btn-sm btn-success rounded-pill px-3"
                              onClick={() => handleUpdateStatus(order.id, order.status, "next")}
                            >
                              ➡️ {getStatusText(nextState)}
                            </button>
                          )}

                          {/* Cancel Button */}
                          {!isFinalState && (
                            <button
                              className="btn btn-sm btn-danger rounded-pill px-3"
                              onClick={() => handleUpdateStatus(order.id, order.status, "cancel")}
                            >
                              ❌ Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Controlled Detail Modal Dialog */}
      {showModal && selectedOrder && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
              {/* Modal Header */}
              <div className="modal-header border-0 p-4" style={{ backgroundColor: "#FFF8FA", borderBottom: "2px solid #F48FB1" }}>
                <h5 className="modal-title fw-bold text-dark fs-4 d-flex align-items-center">
                  <span className="me-2">📋</span> Details of Order{" "}
                  <span className="ms-2 fw-bold" style={{ color: "#F48FB1" }}>
                    {selectedOrder.orderCode}
                  </span>
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedOrder(null);
                  }}
                ></button>
              </div>

              {/* Modal Body */}
              <div className="modal-body p-4" style={{ maxHeight: "calc(100vh - 210px)", overflowY: "auto" }}>
                {/* Status bar */}
                <div className="mb-4 d-flex justify-content-between align-items-center bg-light p-3 rounded-3">
                  <span className="fw-semibold text-secondary">Current Status:</span>
                  {getStatusBadge(selectedOrder.status)}
                </div>

                <div className="row g-4 mb-4">
                  {/* Customer Information Column */}
                  <div className="col-12 col-md-6">
                    <div className="card h-100 border rounded-3 p-3">
                      <h6 className="fw-bold text-dark border-bottom pb-2 mb-3">👤 Customer Information</h6>
                      <div className="mb-2">
                        <small className="text-muted d-block">Full Name</small>
                        <span className="fw-semibold">{selectedOrder.customerName}</span>
                      </div>
                      <div className="mb-2">
                        <small className="text-muted d-block">Phone Number</small>
                        <span>{selectedOrder.phone}</span>
                      </div>
                      <div className="mb-2">
                        <small className="text-muted d-block">Delivery / Pickup Slot</small>
                        <span className="fw-semibold text-danger">
                          📅 {selectedOrder.deliveryDate} &nbsp;|&nbsp; ⏰ {selectedOrder.deliveryTime}
                        </span>
                      </div>
                      <div className="mb-0">
                        <small className="text-muted d-block">Customer Note</small>
                        <span className="fst-italic text-secondary">
                          {selectedOrder.note ? `"${selectedOrder.note}"` : "Không có ghi chú"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Delivery & Payment Information Column */}
                  <div className="col-12 col-md-6">
                    <div className="card h-100 border rounded-3 p-3">
                      <h6 className="fw-bold text-dark border-bottom pb-2 mb-3">🚚 Delivery & Payment</h6>
                      <div className="mb-2">
                        <small className="text-muted d-block">Receive Method</small>
                        <span className="fw-semibold">
                          {selectedOrder.receiveMethod === "delivery" ? "🚚 Giao hàng" : "🏪 Nhận tại tiệm"}
                        </span>
                      </div>
                      <div className="mb-2">
                        <small className="text-muted d-block">Address</small>
                        <span className="text-wrap">{selectedOrder.shippingAddress}</span>
                      </div>
                      <div className="mb-2">
                        <small className="text-muted d-block">Payment Method</small>
                        <span>{selectedOrder.paymentMethod}</span>
                      </div>
                      <div className="mb-0">
                        <small className="text-muted d-block">Payment Status</small>
                        <span
                          className={`badge px-2.5 py-1 ${
                            selectedOrder.paymentStatus === "paid" ? "bg-success" : "bg-warning text-dark"
                          }`}
                        >
                          {selectedOrder.paymentStatus === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items Table section */}
                <div className="card border rounded-3 p-3 mb-4">
                  <h6 className="fw-bold text-dark border-bottom pb-2 mb-3">🍰 Ordered Items</h6>
                  <div className="table-responsive">
                    <table className="table align-middle">
                      <thead className="table-light">
                        <tr>
                          <th className="py-2">Item Name / Config</th>
                          <th className="py-2 text-center" style={{ width: "80px" }}>Qty</th>
                          <th className="py-2 text-end" style={{ width: "120px" }}>Unit Price</th>
                          <th className="py-2 text-end" style={{ width: "130px" }}>Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items &&
                          selectedOrder.items.map((item, index) => {
                            const isCustom = item.type === "custom";
                            return (
                              <tr key={index}>
                                <td className="py-3">
                                  {isCustom ? (
                                    <div>
                                      <span className="badge bg-danger-subtle text-danger border border-danger-subtle rounded-pill mb-1">
                                        ✨ Custom Cake Design
                                      </span>
                                      <div className="fw-bold text-dark">{item.name || "Bánh thiết kế riêng"}</div>
                                      {item.customConfig ? (
                                        <div className="text-muted" style={{ fontSize: "0.85rem" }}>
                                          <div className="row g-1 mt-1">
                                            <div className="col-6">
                                              📍 <strong>Kích thước:</strong> {getSizeName(item.customConfig.sizeId)} ({getLayerName(item.customConfig.layerId)})
                                            </div>
                                            <div className="col-6">
                                              🍞 <strong>Cốt bánh:</strong> {getBaseName(item.customConfig.baseId)}
                                            </div>
                                            <div className="col-6">
                                              🍯 <strong>Nhân bánh:</strong> {getFillingName(item.customConfig.fillingId)}
                                            </div>
                                            <div className="col-6">
                                              🥛 <strong>Lớp kem:</strong> {getCreamName(item.customConfig.creamId)}
                                            </div>
                                            <div className="col-12">
                                              🎨 <strong>Màu chủ đạo:</strong> {getColorName(item.customConfig.colorId)}
                                            </div>
                                            <div className="col-12 text-wrap">
                                              🧁 <strong>Toppings:</strong> {getToppingsNames(item.customConfig.toppingIds)}
                                            </div>
                                            {item.customConfig.message && (
                                              <div className="col-12 mt-1 bg-light p-1.5 rounded border border-light-subtle">
                                                ✍️ <strong>Thông điệp ghi lên bánh:</strong>{" "}
                                                <span className="text-danger fw-semibold">
                                                  "{item.customConfig.message}"
                                                </span>
                                              </div>
                                            )}
                                            {item.customConfig.specialRequest && (
                                              <div className="col-12 mt-1 text-secondary fst-italic">
                                                📌 <strong>Yêu cầu đặc biệt:</strong> "{item.customConfig.specialRequest}"
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      ) : (
                                        <span className="text-muted italic">No config specified.</span>
                                      )}
                                    </div>
                                  ) : (
                                    <div>
                                      <div className="fw-bold text-dark">{item.cakeName}</div>
                                      {item.optionLabel && (
                                        <small className="text-secondary">Size / Option: {item.optionLabel}</small>
                                      )}
                                    </div>
                                  )}
                                </td>
                                <td className="py-3 text-center fw-semibold text-secondary">{item.quantity}</td>
                                <td className="py-3 text-end">{item.unitPrice?.toLocaleString("vi-VN")} ₫</td>
                                <td className="py-3 text-end fw-bold text-dark">
                                  {item.lineTotal?.toLocaleString("vi-VN")} ₫
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>

                  {/* Order Pricing Breakdown section */}
                  <div className="row justify-content-end mt-3 border-top pt-3 g-2">
                    <div className="col-8 col-md-5 text-end text-muted">Subtotal:</div>
                    <div className="col-4 col-md-3 text-end fw-semibold">
                      {selectedOrder.subtotal?.toLocaleString("vi-VN")} ₫
                    </div>

                    <div className="col-8 col-md-5 text-end text-muted">Shipping Fee:</div>
                    <div className="col-4 col-md-3 text-end fw-semibold">
                      {selectedOrder.shippingFee?.toLocaleString("vi-VN")} ₫
                    </div>

                    {selectedOrder.discount > 0 && (
                      <>
                        <div className="col-8 col-md-5 text-end text-muted">Discount:</div>
                        <div className="col-4 col-md-3 text-end text-danger fw-semibold">
                          -{selectedOrder.discount?.toLocaleString("vi-VN")} ₫
                        </div>
                      </>
                    )}

                    <div className="col-8 col-md-5 text-end fw-bold fs-5" style={{ color: "#F48FB1" }}>
                      Total Amount:
                    </div>
                    <div className="col-4 col-md-3 text-end fw-bold fs-5 text-dark border-top pt-1">
                      {selectedOrder.total?.toLocaleString("vi-VN")} ₫
                    </div>
                  </div>
                </div>

                {/* Timeline History Track */}
                <div className="card border rounded-3 p-3">
                  <h6 className="fw-bold text-dark border-bottom pb-2 mb-3">🕒 Status Update Log</h6>
                  {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 ? (
                    <div className="ps-3 border-start border-2 border-pink ms-2 position-relative">
                      {selectedOrder.statusHistory.map((history, idx) => (
                        <div className="mb-3 position-relative" key={idx}>
                          {/* Dot accent marker */}
                          <div
                            className="position-absolute"
                            style={{
                              left: "-25px",
                              top: "4px",
                              width: "12px",
                              height: "12px",
                              borderRadius: "50%",
                              backgroundColor: "#F48FB1",
                              border: "2.5px solid #fff",
                              boxShadow: "0 0 0 2px #F48FB1",
                            }}
                          />
                          <div className="fw-bold text-dark" style={{ fontSize: "0.92rem" }}>
                            {getStatusText(history.status)}
                          </div>
                          <small className="text-secondary">
                            {new Date(history.time).toLocaleString("vi-VN", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })}
                          </small>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <small className="text-muted italic">Không ghi nhận lịch sử trạng thái.</small>
                  )}
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="modal-footer border-0 p-4 bg-light">
                <div className="d-flex gap-2 w-100 justify-content-end">
                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-pill px-4"
                    onClick={() => {
                      setShowModal(false);
                      setSelectedOrder(null);
                    }}
                  >
                    Close Window
                  </button>

                  {/* Actions inside Detail Dialog */}
                  {selectedOrder.status === "Pending" && (
                    <button
                      className="btn text-white rounded-pill px-4"
                      style={{ backgroundColor: "#F48FB1", borderColor: "#F48FB1" }}
                      onClick={() => handleUpdateStatus(selectedOrder.id, selectedOrder.status, "confirm")}
                    >
                      Confirm Order
                    </button>
                  )}

                  {selectedOrder.status !== "Pending" &&
                    selectedOrder.status !== "Completed" &&
                    selectedOrder.status !== "Cancelled" &&
                    selectedOrder.status !== "Cancel" &&
                    getNextStatus(selectedOrder.status) && (
                      <button
                        className="btn btn-success rounded-pill px-4"
                        onClick={() => handleUpdateStatus(selectedOrder.id, selectedOrder.status, "next")}
                      >
                        Advance status to: {getStatusText(getNextStatus(selectedOrder.status))}
                      </button>
                    )}

                  {selectedOrder.status !== "Completed" &&
                    selectedOrder.status !== "Cancelled" &&
                    selectedOrder.status !== "Cancel" && (
                      <button
                        className="btn btn-danger rounded-pill px-4"
                        onClick={() => handleUpdateStatus(selectedOrder.id, selectedOrder.status, "cancel")}
                      >
                        Cancel Order
                      </button>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default OrderManagement;
