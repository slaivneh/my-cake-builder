import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import AuthContext from "../../contexts/AuthContext";
import { getOrderById, updateStatus } from "../../services/orderService";
import axiosClient from "../../services/axiosClient";
import Loading from "../../components/common/Loading";
import "../../assets/styles/OrderDetail.css";

function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [metadata, setMetadata] = useState({
    sizes: [], layers: [], bases: [], fillings: [],
    creams: [], colors: [], toppings: [],
  });

  /* ---------- Fetch order ---------- */
  const fetchOrder = async () => {
    setLoading(true);
    try {
      const res = await getOrderById(id);
      const data = res.data || res;
      setOrder(data);
    } catch (err) {
      console.error("Error fetching order:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Fetch metadata ---------- */
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

  useEffect(() => {
    fetchOrder();
    fetchMetadata();
  }, [id]);

  /* ---------- Helpers ---------- */
  const getNextStatus = (current) => {
    const flow = ["Pending", "Confirmed", "Preparing", "Ready", "Shipping", "Completed"];
    const idx = flow.indexOf(current);
    return idx !== -1 && idx < flow.length - 1 ? flow[idx + 1] : null;
  };

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
      <span
        className="od-status-badge"
        style={{ backgroundColor: s.bg, color: s.text }}
      >
        {getStatusText(status)}
      </span>
    );
  };

  const getSizeName = (id) => metadata.sizes.find((s) => s.id === id)?.name || `Size #${id}`;
  const getLayerName = (id) => metadata.layers.find((l) => l.id === id)?.name || `${id} tầng`;
  const getBaseName = (id) => metadata.bases.find((b) => b.id === id)?.name || `Cốt #${id}`;
  const getFillingName = (id) => metadata.fillings.find((f) => f.id === id)?.name || `Nhân #${id}`;
  const getCreamName = (id) => metadata.creams.find((c) => c.id === id)?.name || `Kem #${id}`;
  const getColorName = (id) => metadata.colors.find((c) => c.id === id)?.name || `Màu #${id}`;
  const getToppingsNames = (ids) => {
    if (!ids || ids.length === 0) return "Không chọn";
    return ids.map((id) => metadata.toppings.find((t) => t.id === id)?.name || `Topping #${id}`).join(", ");
  };

  /* ---------- Actions ---------- */
  const handleUpdateStatus = async (actionType) => {
    if (!order) return;
    let nextStatus = "";
    if (actionType === "confirm") nextStatus = "Confirmed";
    else if (actionType === "next") nextStatus = getNextStatus(order.status);
    else if (actionType === "cancel") nextStatus = "Cancelled";

    if (!nextStatus) return;
    if (!window.confirm(`Chuyển trạng thái sang "${getStatusText(nextStatus)}"?`)) return;

    const updatedHistory = [
      ...(order.statusHistory || []),
      { status: nextStatus, time: new Date().toISOString() },
    ];

    try {
      setLoading(true);
      await updateStatus(order.id, {
        status: nextStatus,
        statusHistory: updatedHistory,
        updatedAt: new Date().toISOString(),
      });
      await fetchOrder();
    } catch (err) {
      console.error("Update error:", err);
      alert("Lỗi khi cập nhật trạng thái!");
    } finally {
      setLoading(false);
    }
  };

  const isFinal = order && (["Completed", "Cancelled", "Cancel"].includes(order.status));
  const nextState = order ? getNextStatus(order.status) : null;

  if (loading) return <Loading />;
  if (!order) return (
    <div className="od-empty">
      <h3>Không tìm thấy đơn hàng</h3>
      <button className="od-btn od-btn--primary" onClick={() => navigate("/admin/orders")}>
        Quay lại danh sách
      </button>
    </div>
  );

  return (
    <div className="od-page">
      {/* Header */}
      <div className="od-header">
        <button className="od-back" onClick={() => navigate("/admin/orders")}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Quay lại
        </button>
        <h1 className="od-title">
          Chi tiết đơn hàng
          <span className="od-code">{order.orderCode}</span>
        </h1>
        <div className="od-status-wrap">
          <span className="od-status-label">Trạng thái:</span>
          {getStatusBadge(order.status)}
        </div>
      </div>

      {/* Content Grid */}
      <div className="od-grid">
        {/* Customer Info */}
        <div className="od-card">
          <h3 className="od-card_title">Thông tin khách hàng</h3>
          <div className="od-field">
            <span className="od-field_label">Họ tên</span>
            <span className="od-field_value">{order.customerName}</span>
          </div>
          <div className="od-field">
            <span className="od-field_label">Số điện thoại</span>
            <span className="od-field_value">{order.phone}</span>
          </div>
          <div className="od-field">
            <span className="od-field_label">Ngày nhận</span>
            <span className="od-field_value">{order.deliveryDate} | {order.deliveryTime}</span>
          </div>
          <div className="od-field">
            <span className="od-field_label">Ghi chú</span>
            <span className="od-field_value od-field_value--italic">
              {order.note ? `"${order.note}"` : "Không có ghi chú"}
            </span>
          </div>
        </div>

        {/* Delivery & Payment */}
        <div className="od-card">
          <h3 className="od-card_title">Giao hàng & Thanh toán</h3>
          <div className="od-field">
            <span className="od-field_label">Hình thức nhận</span>
            <span className="od-field_value">
              {order.receiveMethod === "delivery" ? "Giao hàng" : "Nhận tại tiệm"}
            </span>
          </div>
          <div className="od-field">
            <span className="od-field_label">Địa chỉ</span>
            <span className="od-field_value">{order.shippingAddress || order.address || "—"}</span>
          </div>
          <div className="od-field">
            <span className="od-field_label">Phương thức thanh toán</span>
            <span className="od-field_value">{order.paymentMethod}</span>
          </div>
          <div className="od-field">
            <span className="od-field_label">Trạng thái thanh toán</span>
            <span className={`od-payment od-payment--${order.paymentStatus}`}>
              {order.paymentStatus === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
            </span>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="od-card od-card--full">
        <h3 className="od-card_title">Sản phẩm đặt mua</h3>
        <div className="od-table-wrap">
          <table className="od-table">
            <thead>
              <tr>
                <th>Sản phẩm / Cấu hình</th>
                <th className="od-tc-center">SL</th>
                <th className="od-tc-right">Đơn giá</th>
                <th className="od-tc-right">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item, idx) => {
                const isCustom = item.type === "custom";
                return (
                  <tr key={idx}>
                    <td>
                      {isCustom ? (
                        <div className="od-custom">
                          <span className="od-custom_badge">Bánh thiết kế riêng</span>
                          <div className="od-custom_name">{item.name || "Bánh custom"}</div>
                          {item.customConfig && (
                            <div className="od-custom_config">
                              <div className="od-config-row">
                                <span>Kích thước:</span> {getSizeName(item.customConfig.sizeId)} ({getLayerName(item.customConfig.layerId)})
                              </div>
                              <div className="od-config-row">
                                <span>Cốt bánh:</span> {getBaseName(item.customConfig.baseId)}
                              </div>
                              <div className="od-config-row">
                                <span>Nhân bánh:</span> {getFillingName(item.customConfig.fillingId)}
                              </div>
                              <div className="od-config-row">
                                <span>Lớp kem:</span> {getCreamName(item.customConfig.creamId)}
                              </div>
                              <div className="od-config-row">
                                <span>Màu chủ đạo:</span> {getColorName(item.customConfig.colorId)}
                              </div>
                              <div className="od-config-row">
                                <span>Toppings:</span> {getToppingsNames(item.customConfig.toppingIds)}
                              </div>
                              {item.customConfig.message && (
                                <div className="od-config-row od-config-row--highlight">
                                  Thông điệp: "{item.customConfig.message}"
                                </div>
                              )}
                              {item.customConfig.specialRequest && (
                                <div className="od-config-row od-config-row--note">
                                  Yêu cầu đặc biệt: "{item.customConfig.specialRequest}"
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          <div className="od-item_name">{item.cakeName}</div>
                          {item.optionLabel && (
                            <div className="od-item_option">Size: {item.optionLabel}</div>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="od-tc-center">{item.quantity}</td>
                    <td className="od-tc-right">{item.unitPrice?.toLocaleString("vi-VN")} đ</td>
                    <td className="od-tc-right od-total">{item.lineTotal?.toLocaleString("vi-VN")} đ</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pricing */}
        <div className="od-pricing">
          <div className="od-pricing_row">
            <span>Tạm tính</span>
            <span>{order.subtotal?.toLocaleString("vi-VN")} đ</span>
          </div>
          <div className="od-pricing_row">
            <span>Phí giao hàng</span>
            <span>{order.shippingFee?.toLocaleString("vi-VN")} đ</span>
          </div>
          {order.discount > 0 && (
            <div className="od-pricing_row od-pricing_row--discount">
              <span>Giảm giá</span>
              <span>-{order.discount?.toLocaleString("vi-VN")} đ</span>
            </div>
          )}
          <div className="od-pricing_row od-pricing_row--total">
            <span>Tổng cộng</span>
            <span>{order.total?.toLocaleString("vi-VN")} đ</span>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="od-card od-card--full">
        <h3 className="od-card_title">Lịch sử trạng thái</h3>
        {order.statusHistory?.length > 0 ? (
          <div className="od-timeline">
            {order.statusHistory.map((h, idx) => (
              <div className="od-timeline_item" key={idx}>
                <div className="od-timeline_dot" />
                <div className="od-timeline_content">
                  <div className="od-timeline_status">{getStatusText(h.status)}</div>
                  <div className="od-timeline_time">
                    {new Date(h.time).toLocaleString("vi-VN", {
                      year: "numeric", month: "2-digit", day: "2-digit",
                      hour: "2-digit", minute: "2-digit", second: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="od-empty-text">Không ghi nhận lịch sử trạng thái.</p>
        )}
      </div>

      {/* Action Buttons */}
      {!isFinal && (
        <div className="od-actions">
          {order.status === "Pending" && (
            <button
              className="od-btn od-btn--primary"
              onClick={() => handleUpdateStatus("confirm")}
            >
              Xác nhận đơn
            </button>
          )}

          {order.status !== "Pending" && nextState && (
            <button
              className="od-btn od-btn--success"
              onClick={() => handleUpdateStatus("next")}
            >
              Chuyển sang: {getStatusText(nextState)}
            </button>
          )}

          <button
            className="od-btn od-btn--danger"
            onClick={() => handleUpdateStatus("cancel")}
          >
            Hủy đơn hàng
          </button>
        </div>
      )}
    </div>
  );
}

export default OrderDetail;