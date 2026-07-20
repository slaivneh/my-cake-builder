import React, { useState, useEffect } from "react";
import { getOrders, updateStatus } from "../../services/orderService";
import { getCakes } from "../../services/cakeService";
import axiosClient from "../../services/axiosClient";
import notificationService from "../../services/notificationService";
import Loading from "../../components/common/Loading";
import OrderTable from "../../components/admin/OrderTable";
import OrderDetailModal from "../../components/admin/OrderDetailModal";
import "../../assets/styles/OrderManagement.css";

// Trang quản lý đơn hàng cho admin: xem danh sách, lọc/tìm kiếm, xem chi tiết và cập nhật trạng thái đơn
function OrderManagement() {
  const [orders, setOrders] = useState([]); // Danh sách đơn hàng
  const [cakes, setCakes] = useState([]); // Danh sách bánh (dùng để hiển thị thông tin trong modal chi tiết)
  const [loading, setLoading] = useState(true);
  const [searchOrder, setSearchOrder] = useState(""); // Từ khoá tìm theo mã đơn
  const [searchCustomer, setSearchCustomer] = useState(""); // Từ khoá tìm theo tên khách hàng
  const [statusFilter, setStatusFilter] = useState(""); // Trạng thái đang lọc
  const [selectedOrder, setSelectedOrder] = useState(null); // Đơn đang được chọn để xem chi tiết
  const [showModal, setShowModal] = useState(false); // Hiện/ẩn modal chi tiết đơn

  // Dữ liệu phụ trợ (size, tầng, đế bánh, nhân, kem, màu, topping...) để hiển thị trong modal chi tiết
  const [metadata, setMetadata] = useState({
    sizes: [], layers: [], bases: [], fillings: [],
    creams: [], colors: [], toppings: [],
  });

  /* ---------- Fetch ---------- */

  // Lấy danh sách đơn hàng, sắp xếp mới nhất lên đầu
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getOrders();
      const data = res.data || res;
      setOrders(Array.isArray(data) ? [...data].sort((a, b) => b.id - a.id) : []);
    } catch (err) {
      console.error("Fetch orders error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Lấy danh sách bánh
  const fetchCakes = async () => {
    try {
      const res = await getCakes();
      const data = res.data || res;
      setCakes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch cakes error:", err);
    }
  };

  // Lấy các dữ liệu metadata song song (mỗi loại nếu lỗi thì trả về mảng rỗng)
  const fetchMetadata = async () => {
    try {
      const [sizes, layers, bases, fillings, creams, colors, toppings] =
        await Promise.all([
          axiosClient.get("/cakeSizes").catch(() => ({ data: [] })),
          axiosClient.get("/layerOptions").catch(() => ({ data: [] })),
          axiosClient.get("/cakeBases").catch(() => ({ data: [] })),
          axiosClient.get("/fillings").catch(() => ({ data: [] })),
          axiosClient.get("/creamTypes").catch(() => ({ data: [] })),
          axiosClient.get("/cakeColors").catch(() => ({ data: [] })),
          axiosClient.get("/toppings").catch(() => ({ data: [] })),
        ]);
      setMetadata({
        sizes: sizes.data || [], layers: layers.data || [],
        bases: bases.data || [], fillings: fillings.data || [],
        creams: creams.data || [], colors: colors.data || [],
        toppings: toppings.data || [],
      });
    } catch (err) {
      console.error("Metadata error:", err);
    }
  };

  // Gọi các API cần thiết ngay khi component được mount
  useEffect(() => {
    fetchOrders();
    fetchCakes();
    fetchMetadata();
  }, []);

  /* ---------- Helpers ---------- */

  // Xác định trạng thái kế tiếp trong quy trình xử lý đơn (dùng cho nút "chuyển bước tiếp theo")
  const getNextStatus = (current) => {
    const flow = ["Pending", "Confirmed", "Preparing", "Ready", "Shipping", "Completed"];
    const idx = flow.indexOf(current);
    return idx !== -1 && idx < flow.length - 1 ? flow[idx + 1] : null;
  };

  // Chuyển mã trạng thái (tiếng Anh) sang text hiển thị tiếng Việt
  const getStatusText = (status) => {
    const map = {
      Pending: "Chờ xác nhận",
      Confirmed: "Đã xác nhận",
      Preparing: "Đang chuẩn bị bánh",
      Ready: "Bánh đã sẵn sàng",
      Shipping: "Đang giao hàng",
      Completed: "Đã hoàn thành",
      Cancelled: "Đã hủy",
      Cancel: "Đã hủy",
    };
    return map[status] || status;
  };

  // Render badge màu tương ứng với từng trạng thái đơn hàng
  const getStatusBadge = (status) => {
    const styles = {
      Pending: { bg: "#FFEEC1", text: "#B27A00" },
      Confirmed: { bg: "#D0E1FD", text: "#1C4E9E" },
      Preparing: { bg: "#F3D4FC", text: "#7B1FA2" },
      Ready: { bg: "#E8F5E9", text: "#2E7D32" },
      Shipping: { bg: "#E0F7FA", text: "#006064" },
      Completed: { bg: "#D4EDDA", text: "#155724" },
      Cancelled: { bg: "#F8D7DA", text: "#721C24" },
      Cancel: { bg: "#F8D7DA", text: "#721C24" },
    };
    const s = styles[status] || { bg: "#E2E8F0", text: "#4A5568" };
    return (
      <span className="om-badge" style={{ backgroundColor: s.bg, color: s.text }}>
        {getStatusText(status)}
      </span>
    );
  };

  /* ---------- Actions ---------- */

  // Cập nhật trạng thái đơn hàng (xác nhận / chuyển bước tiếp theo / huỷ), có hỏi xác nhận trước khi thực hiện
  const handleUpdateStatus = async (orderId, currentStatus, actionType) => {
    let nextStatus = "";
    if (actionType === "confirm") nextStatus = "Confirmed";
    else if (actionType === "next") nextStatus = getNextStatus(currentStatus);
    else if (actionType === "cancel") nextStatus = "Cancelled";

    if (!nextStatus) return;
    if (!window.confirm(`Chuyển trạng thái sang "${getStatusText(nextStatus)}"?`)) return;

    const orderToUpdate = orders.find((o) => o.id === orderId);
    if (!orderToUpdate) return;

    // Thêm bản ghi mới vào lịch sử trạng thái của đơn
    const updatedHistory = [
      ...(orderToUpdate.statusHistory || []),
      { status: nextStatus, time: new Date().toISOString() },
    ];

    try {
      setLoading(true);
      await updateStatus(orderId, {
        status: nextStatus,
        statusHistory: updatedHistory,
        updatedAt: new Date().toISOString(),
      });
      
      try {
        await notificationService.create({
          userId: orderToUpdate.userId || orderToUpdate.customerId || 4,
          title: "Cập nhật đơn hàng",
          content: `Đơn hàng ${orderToUpdate.orderCode || orderToUpdate.id} của bạn đã chuyển sang trạng thái: ${getStatusText(nextStatus)}.`
        });
      } catch (err) {
        console.warn("Không thể tạo thông báo:", err);
      }

      await fetchOrders();
      // Nếu đơn vừa cập nhật đang được mở trong modal chi tiết thì đồng bộ luôn state của modal
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => ({
          ...prev,
          status: nextStatus,
          statusHistory: updatedHistory,
          updatedAt: new Date().toISOString(),
        }));
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Lỗi khi cập nhật trạng thái!");
    } finally {
      setLoading(false);
    }
  };

  // Mở modal xem chi tiết đơn hàng
  const handleOpenDetail = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  /* ---------- Filter + attach badge ---------- */

  // Lọc đơn theo mã đơn, tên khách hàng và trạng thái, đồng thời gắn kèm badge trạng thái để truyền xuống bảng
  const filteredOrders = orders.filter((order) => {
    const matchCode = (order.orderCode || "")
      .toLowerCase()
      .includes(searchOrder.toLowerCase().trim());
    const matchCustomer = (order.customerName || "")
      .toLowerCase()
      .includes(searchCustomer.toLowerCase().trim());
    const matchStatus = statusFilter === "" || order.status === statusFilter;
    return matchCode && matchCustomer && matchStatus;
  }).map((order) => ({
    ...order,
    statusBadge: getStatusBadge(order.status),
  }));

  return (
    <div className="om-page">
      {/* Tiêu đề trang + nút làm mới dữ liệu */}
      <div className="om-header">
        <h1 className="om-header_title">Quản lý đơn hàng</h1>
        <button
          className="om-btn om-btn--primary"
          onClick={() => { fetchOrders(); fetchCakes(); }}
          disabled={loading}
        >
          Làm mới
        </button>
      </div>

      {/* Khu vực bộ lọc: mã đơn, tên khách hàng, trạng thái */}
      <div className="om-filters">
        <div className="om-filter">
          <label className="om-filter_label">Tìm theo mã đơn</label>
          <input
            type="text"
            className="om-input"
            placeholder="VD: ORD000001"
            value={searchOrder}
            onChange={(e) => setSearchOrder(e.target.value)}
          />
        </div>
        <div className="om-filter">
          <label className="om-filter_label">Tìm theo khách hàng</label>
          <input
            type="text"
            className="om-input"
            placeholder="Nhập tên khách hàng..."
            value={searchCustomer}
            onChange={(e) => setSearchCustomer(e.target.value)}
          />
        </div>
        <div className="om-filter">
          <label className="om-filter_label">Lọc theo trạng thái</label>
          <select
            className="om-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="Pending">Chờ xác nhận</option>
            <option value="Confirmed">Đã xác nhận</option>
            <option value="Preparing">Đang chuẩn bị bánh</option>
            <option value="Ready">Bánh đã sẵn sàng</option>
            <option value="Shipping">Đang giao hàng</option>
            <option value="Completed">Đã hoàn thành</option>
            <option value="Cancelled">Đã hủy</option>
          </select>
        </div>
      </div>

      {/* Bảng danh sách đơn hàng: hiện loading khi đang tải lần đầu, hiện thông báo khi không có kết quả */}
      {loading && orders.length === 0 ? (
        <Loading />
      ) : filteredOrders.length === 0 ? (
        <div className="om-empty">
          <p>Không tìm thấy đơn hàng nào.</p>
        </div>
      ) : (
        <OrderTable
          orders={filteredOrders}
          onView={handleOpenDetail}
        />
      )}

      {/* Modal xem/xử lý chi tiết đơn hàng */}
      {showModal && selectedOrder && (
        <OrderDetailModal
          show={showModal}
          order={selectedOrder}
          cakes={cakes}
          onClose={() => {
            setShowModal(false);
            setSelectedOrder(null);
          }}
          onUpdateStatus={handleUpdateStatus}
          getNextStatus={getNextStatus}
          getStatusBadge={getStatusBadge}
          getStatusText={getStatusText}
          metadata={metadata}
        />
      )}
    </div>
  );
}

export default OrderManagement;