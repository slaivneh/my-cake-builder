import { useEffect, useMemo, useState } from "react";

import { Link, useNavigate, useParams } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

import { getOrderById, updateStatus } from "../../services/orderService";

import "../../assets/styles/orders.css";

const STATUS_INFORMATION = {
  pending: {
    label: "Chờ xác nhận",
    group: "pending",
    progress: 1,
  },

  pending_confirmation: {
    label: "Chờ xác nhận",
    group: "pending",
    progress: 1,
  },

  pending_payment_verification: {
    label: "Chờ đối soát thanh toán",
    group: "pending",
    progress: 1,
  },

  confirmed: {
    label: "Đã xác nhận",
    group: "processing",
    progress: 2,
  },

  preparing: {
    label: "Đang chuẩn bị bánh",
    group: "processing",
    progress: 3,
  },

  ready: {
    label: "Sẵn sàng nhận bánh",
    group: "processing",
    progress: 4,
  },

  delivering: {
    label: "Đang giao hàng",
    group: "processing",
    progress: 4,
  },

  completed: {
    label: "Hoàn thành",
    group: "completed",
    progress: 5,
  },

  cancelled: {
    label: "Đã hủy",
    group: "cancelled",
    progress: 0,
  },
};

const formatCurrency = (value) => {
  return Number(value || 0).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};

const formatDate = (value) => {
  if (!value) {
    return "Chưa cập nhật";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const normalizeText = (value) => {
  return String(value || "")
    .trim()
    .toLowerCase();
};

const getStatusInformation = (status) => {
  return (
    STATUS_INFORMATION[normalizeText(status)] || {
      label: "Đang xử lý",
      group: "processing",
      progress: 2,
    }
  );
};

const belongsToCurrentUser = (order, user) => {
  const currentUserId = user?.id ?? user?.userId;

  const orderUserId = order?.customerId ?? order?.userId ?? order?.purchaserId;

  if (
    currentUserId !== undefined &&
    currentUserId !== null &&
    orderUserId !== undefined &&
    orderUserId !== null &&
    String(currentUserId) === String(orderUserId)
  ) {
    return true;
  }

  const currentEmail = normalizeText(user?.email);

  const orderEmail = normalizeText(
    order?.purchaserEmail || order?.contactEmail || order?.email,
  );

  return currentEmail !== "" && currentEmail === orderEmail;
};

function OrderDetail() {
  const { id } = useParams();

  const navigate = useNavigate();

  const { user } = useAuth();

  const [order, setOrder] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [cancelling, setCancelling] = useState(false);

  const [notice, setNotice] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const orderData = await getOrderById(id);

        if (!belongsToCurrentUser(orderData, user)) {
          throw new Error("Bạn không có quyền xem đơn hàng này.");
        }

        setOrder(orderData);
      } catch (fetchError) {
        console.error("Lỗi tải đơn hàng:", fetchError);

        setError(fetchError.message || "Không thể tải thông tin đơn hàng.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, user]);

  const statusInformation = useMemo(() => {
    return getStatusInformation(order?.status);
  }, [order]);

  const orderItems = useMemo(() => {
    return Array.isArray(order?.items) ? order.items : [];
  }, [order]);

  const canCancel = [
    "pending",
    "pending_confirmation",
    "pending_payment_verification",
  ].includes(normalizeText(order?.status));

  const handleCancelOrder = async () => {
    const confirmed = window.confirm(
      "Bạn có chắc muốn hủy đơn hàng này không?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancelling(true);
      setNotice("");
      setError("");

      const updatedOrder = await updateStatus(id, {
        status: "cancelled",

        cancelledAt: new Date().toISOString(),

        cancellationReason: "Khách hàng tự hủy đơn",
      });

      setOrder(updatedOrder);

      setNotice("Đơn hàng đã được hủy.");
    } catch (cancelError) {
      console.error("Lỗi hủy đơn hàng:", cancelError);

      setError(cancelError.message || "Không thể hủy đơn hàng.");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="pd-order-detail-page">
        <div className="pd-order-detail-loading">
          <div />
          <div />
        </div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="pd-order-detail-page">
        <div className="pd-orders-empty">
          <h2>Không tải được đơn hàng</h2>

          <p>{error}</p>

          <button
            type="button"
            onClick={() => {
              navigate("/orders");
            }}
          >
            Quay lại đơn hàng
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const isPickup = order.fulfillmentMethod === "pickup";

  const orderCode = order.orderCode || order.paymentCode || `#${order.id}`;

  const deliveryAddress = isPickup
    ? order.pickupAddress || order.address
    : order.deliveryAddress || order.address;

  const timelineSteps = isPickup
    ? [
        "Đã đặt hàng",
        "Đã xác nhận",
        "Đang chuẩn bị",
        "Sẵn sàng nhận",
        "Hoàn thành",
      ]
    : [
        "Đã đặt hàng",
        "Đã xác nhận",
        "Đang chuẩn bị",
        "Đang giao hàng",
        "Hoàn thành",
      ];

  return (
    <div className="pd-order-detail-page">
      <nav className="pd-order-detail-breadcrumb">
        <Link to="/home">Trang chủ</Link>

        <span>/</span>

        <Link to="/orders">Đơn hàng</Link>

        <span>/</span>

        <strong>{orderCode}</strong>
      </nav>

      <header className="pd-order-detail-heading">
        <div>
          <p>Mã đơn hàng</p>

          <h1>{orderCode}</h1>

          <span>Đặt lúc {formatDate(order.createdAt)}</span>
        </div>

        <span
          className={`pd-order-status pd-order-status--${statusInformation.group}`}
        >
          {statusInformation.label}
        </span>
      </header>

      {notice && <div className="pd-order-detail-notice">✓ {notice}</div>}

      {error && <div className="pd-order-detail-error">{error}</div>}

      {statusInformation.group !== "cancelled" && (
        <section className="pd-order-timeline">
          {timelineSteps.map((step, index) => {
            const stepNumber = index + 1;

            const completed = stepNumber <= statusInformation.progress;

            return (
              <div
                key={step}
                className={
                  completed
                    ? "pd-order-timeline__step pd-order-timeline__step--active"
                    : "pd-order-timeline__step"
                }
              >
                <span>{completed ? "✓" : stepNumber}</span>

                <strong>{step}</strong>
              </div>
            );
          })}
        </section>
      )}

      {statusInformation.group === "cancelled" && (
        <div className="pd-order-cancelled-banner">
          <strong>Đơn hàng đã được hủy</strong>

          <span>{order.cancelledAt ? formatDate(order.cancelledAt) : ""}</span>
        </div>
      )}

      <div className="pd-order-detail-layout">
        <section className="pd-order-detail-main">
          <div className="pd-order-detail-card">
            <div className="pd-order-detail-card__heading">
              <h2>Sản phẩm đã đặt</h2>

              <span>
                {orderItems.reduce(
                  (total, item) => total + Number(item.quantity || 0),
                  0,
                )}{" "}
                sản phẩm
              </span>
            </div>

            <div className="pd-order-detail-products">
              {orderItems.map((item, index) => (
                <article key={item.itemKey || `${item.cakeId}-${index}`}>
                  <Link to={`/cakes/${item.cakeId}`}>
                    <img src={item.image} alt={item.name} />
                  </Link>

                  <div className="pd-order-detail-product__info">
                    <p>{item.category || "Bánh ngọt"}</p>

                    <h3>
                      <Link to={`/cakes/${item.cakeId}`}>{item.name}</Link>
                    </h3>

                    <span>
                      {item.optionLabel}
                      {" × "}
                      {item.quantity}
                    </span>
                  </div>

                  <div className="pd-order-detail-product__price">
                    <span>{formatCurrency(item.price)}</span>

                    <strong>
                      {formatCurrency(
                        item.lineTotal ||
                          Number(item.price) * Number(item.quantity),
                      )}
                    </strong>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="pd-order-information-grid">
            <article>
              <h2>Thông tin người nhận</h2>

              <div>
                <span>Người nhận</span>

                <strong>{order.recipientName || order.customerName}</strong>
              </div>

              <div>
                <span>Số điện thoại</span>

                <strong>{order.recipientPhone || order.phone}</strong>
              </div>

              <div>
                <span>Email</span>

                <strong>
                  {order.contactEmail || order.email || "Không có"}
                </strong>
              </div>
            </article>

            <article>
              <h2>Hình thức nhận bánh</h2>

              <div>
                <span>Phương thức</span>

                <strong>{isPickup ? "Tự đến lấy" : "Giao tận nơi"}</strong>
              </div>

              <div>
                <span>Địa chỉ</span>

                <strong>{deliveryAddress || "Chưa cập nhật"}</strong>
              </div>

              <div>
                <span>Thời gian nhận</span>

                <strong>
                  {order.scheduledDate || order.deliveryDate}
                  {" · "}
                  {order.scheduledTime || order.deliveryTime}
                </strong>
              </div>
            </article>
          </div>

          {order.note && (
            <div className="pd-order-note">
              <h2>Ghi chú đơn hàng</h2>

              <p>{order.note}</p>
            </div>
          )}
        </section>

        <aside className="pd-order-detail-summary">
          <h2>Thanh toán</h2>

          <div className="pd-order-payment-information">
            <div>
              <span>Phương thức</span>

              <strong>Chuyển khoản online</strong>
            </div>

            <div>
              <span>Nội dung chuyển khoản</span>

              <strong>{order.paymentCode || orderCode}</strong>
            </div>

            <div>
              <span>Mã giao dịch</span>

              <strong>{order.paymentReference || "Chưa cập nhật"}</strong>
            </div>

            <div>
              <span>Trạng thái thanh toán</span>

              <strong>
                {order.paymentStatus === "paid"
                  ? "Đã thanh toán"
                  : order.paymentStatus === "verified"
                    ? "Đã đối soát"
                    : "Chờ đối soát"}
              </strong>
            </div>
          </div>

          <div className="pd-order-summary-line">
            <span>Tạm tính</span>

            <strong>{formatCurrency(order.subtotal)}</strong>
          </div>

          <div className="pd-order-summary-line">
            <span>Phí giao hàng</span>

            <strong>
              {Number(order.shippingFee || 0) === 0
                ? "Miễn phí"
                : formatCurrency(order.shippingFee)}
            </strong>
          </div>

          <div className="pd-order-summary-total">
            <span>Tổng thanh toán</span>

            <strong>{formatCurrency(order.totalAmount || order.total)}</strong>
          </div>

          {canCancel && (
            <button
              type="button"
              className="pd-order-cancel-button"
              disabled={cancelling}
              onClick={handleCancelOrder}
            >
              {cancelling ? "Đang hủy đơn..." : "Hủy đơn hàng"}
            </button>
          )}

          <Link to="/orders" className="pd-order-back-button">
            ← Quay lại danh sách
          </Link>
        </aside>
      </div>
    </div>
  );
}

export default OrderDetail;
