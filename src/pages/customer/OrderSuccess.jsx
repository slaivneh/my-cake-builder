import { useEffect, useState } from "react";

import { Link, useLocation, useParams } from "react-router-dom";

import { getOrderById } from "../../services/orderService";

import "../../assets/styles/order-success.css";

const formatCurrency = (value) => {
  return Number(value || 0).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};

function OrderSuccess() {
  const { id } = useParams();

  const location = useLocation();

  const [order, setOrder] = useState(location.state?.order || null);

  const [loading, setLoading] = useState(!location.state?.order);

  const [error, setError] = useState("");

  useEffect(() => {
    if (order) {
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const orderData = await getOrderById(id);

        setOrder(orderData);
      } catch (fetchError) {
        console.error("Không tải được đơn hàng:", fetchError);

        setError("Không thể tải thông tin đơn hàng.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, order]);

  if (loading) {
    return (
      <div className="pd-order-success-page">
        <div className="pd-order-success-card">
          <p>Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="pd-order-success-page">
        <div className="pd-order-success-card">
          <h1>Không tìm thấy đơn hàng</h1>

          <p>{error || "Đơn hàng không tồn tại."}</p>

          <Link to="/orders">Xem đơn hàng của tôi</Link>
        </div>
      </div>
    );
  }

  const isPickup = order.fulfillmentMethod === "pickup";

  return (
    <div className="pd-order-success-page">
      <section className="pd-order-success-card">
        <div className="pd-order-success-icon">✓</div>

        <p className="pd-order-success-eyebrow">Petite Douceur</p>

        <h1>Đặt hàng thành công!</h1>

        <p className="pd-order-success-description">
          Cảm ơn bạn đã đặt bánh. Cửa hàng sẽ kiểm tra giao dịch và xác nhận đơn
          hàng sớm nhất.
        </p>

        <div className="pd-order-success-code">
          <span>Mã đơn hàng</span>

          <strong>
            {order.orderCode || order.paymentCode || `#${order.id}`}
          </strong>
        </div>

        <div className="pd-order-success-information">
          <div>
            <span>Người nhận</span>

            <strong>{order.recipientName || order.customerName}</strong>
          </div>

          <div>
            <span>Số điện thoại</span>

            <strong>{order.recipientPhone || order.phone}</strong>
          </div>

          <div>
            <span>Hình thức nhận</span>

            <strong>{isPickup ? "Tự đến lấy" : "Giao tận nơi"}</strong>
          </div>

          <div>
            <span>Ngày nhận bánh</span>

            <strong>{order.scheduledDate || order.deliveryDate}</strong>
          </div>

          <div>
            <span>Khung giờ</span>

            <strong>{order.scheduledTime || order.deliveryTime}</strong>
          </div>

          <div>
            <span>Tổng thanh toán</span>

            <strong>{formatCurrency(order.totalAmount || order.total)}</strong>
          </div>
        </div>

        <div className="pd-order-success-status">
          <span>Trạng thái</span>

          <strong>Đang chờ cửa hàng xác nhận thanh toán</strong>
        </div>

        <p className="pd-order-success-email">
          Thông tin xác nhận sẽ được gửi đến{" "}
          <strong>{order.contactEmail || order.email}</strong>.
        </p>

        <div className="pd-order-success-actions">
          <Link to={`/orders/${order.id}`}>Xem chi tiết đơn</Link>

          <Link to="/cakes" className="pd-order-success-secondary">
            Tiếp tục mua bánh
          </Link>
        </div>
      </section>
    </div>
  );
}

export default OrderSuccess;
