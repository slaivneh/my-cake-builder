import React, { useState, useEffect } from "react";
import { getOrderById } from "../../services/orderService";
import {
  getFeedbackByOrderId,
  createFeedback,
} from "../../services/feedbackService";
import OrderStatusTracker from "../../components/order/OrderStatusTracker";
import "../../components/order/OrderHistory.css";

const CustomerOrderDetail = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [feedback, setFeedback] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const pathParts = window.location.pathname.split("/");
    const orderId = Number(pathParts[pathParts.length - 1]);

    const loadData = async () => {
      try {
        const orderData = await getOrderById(orderId);

        setOrder(orderData);

        if (orderData) {
          const fb = await getFeedbackByOrderId(orderData.id);

          if (fb) {
            setFeedback(fb);
          }
        }
      } catch (err) {
        console.error(err);
        setError("Không tìm thấy đơn hàng.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSubmitFeedback = async () => {
    if (!comment.trim()) {
      alert("Vui lòng nhập nhận xét.");
      return;
    }

    try {
      const newFeedback = {
        orderId: order.id,
        userId: order.userId,
        customerName: order.customerName,
        cakeName:
          order.items?.[0]?.cakeName ||
          (order.items?.[0]?.details?.cakeName ?? "Bánh thiết kế"),
        rating,
        comment: comment.trim(),
        createdAt: new Date().toISOString(),
      };

      const savedFeedback = await createFeedback(newFeedback);

      setFeedback(savedFeedback);

      setComment("");
      setRating(5);

      alert("Cảm ơn bạn đã đánh giá!");
    } catch (err) {
      console.error(err);
      alert(err.message || "Không thể gửi đánh giá.");
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        Đang tải chi tiết đơn hàng...
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        {error}
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (<div className="order-detail-page">
    <div className="detail-header">
      <h1>Chi Tiết Đơn Hàng #{order.id}</h1>

      <a href="/orders" className="back-link">
        ← Quay lại danh sách
      </a>
    </div>

    <div className="tracker-section">
      <OrderStatusTracker currentStatus={order.status} />
    </div>

    <div className="detail-content">

      {/* Thông tin đơn hàng */}
      <div className="detail-card info-card">
        <h3>Thông Tin Đơn Hàng</h3>

        <p>
          <strong>Ngày đặt:</strong>{" "}
          {order.createdAt
            ? new Date(order.createdAt).toLocaleString("vi-VN")
            : "-"}
        </p>

        <p>
          <strong>Trạng thái:</strong> {order.status}
        </p>

        <p>
          <strong>Thanh toán:</strong> {order.paymentStatus}
        </p>

        <p className="total-price">
          <strong>Tổng tiền:</strong>{" "}
          {order.total?.toLocaleString("vi-VN")} ₫
        </p>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="detail-card items-card">
        <h3>Sản phẩm</h3>

        {order.items?.map((item, idx) => (
          <div key={idx} className="order-item">

            {item.type === "custom" ? (

              <div>

                <h4>Bánh Thiết Kế Custom</h4>

                <ul className="cake-specs">

                  <li>
                    <strong>Size:</strong> {item.details.size}
                  </li>

                  <li>
                    <strong>Số tầng:</strong> {item.details.layer}
                  </li>

                  <li>
                    <strong>Cốt bánh:</strong> {item.details.sponge}
                  </li>

                  <li>
                    <strong>Màu sắc:</strong>

                    <span
                      className="color-swatch"
                      style={{
                        backgroundColor: item.details.color,
                      }}
                    />

                    ({item.details.color})

                  </li>

                  {item.details.text && (
                    <li>
                      <strong>Nội dung:</strong> {item.details.text}
                    </li>
                  )}

                  {item.details.toppings?.length > 0 && (
                    <li>
                      <strong>Toppings:</strong>{" "}
                      {item.details.toppings.join(", ")}
                    </li>
                  )}

                </ul>

              </div>

            ) : (

              <div>

                <h4>{item.cakeName}</h4>

                <p>Số lượng: {item.quantity}</p>

                <p>
                  Giá: {item.unitPrice?.toLocaleString("vi-VN")} ₫
                </p>

                {item.optionLabel && (
                  <p>Phân loại: {item.optionLabel}</p>
                )}

              </div>

            )}

          </div>
        ))}
      </div>

      {/* Feedback */}
      {order.status === "Completed" && (
        <div className="detail-card">

          <h3>Đánh giá đơn hàng</h3>

          {feedback ? (
            <>
              <div
                style={{
                  fontSize: 28,
                  color: "#f5b301",
                  marginBottom: 15,
                }}
              >
                {"★".repeat(feedback.rating)}
                {"☆".repeat(5 - feedback.rating)}
              </div>

              <p>{feedback.comment}</p>

              <small>
                {new Date(feedback.createdAt).toLocaleString("vi-VN")}
              </small>
            </>
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginBottom: 20,
                }}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => setRating(star)}
                    style={{
                      cursor: "pointer",
                      fontSize: 32,
                      color:
                        star <= rating
                          ? "#f5b301"
                          : "#d9d9d9",
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>

              <textarea
                rows={4}
                value={comment}
                onChange={(e) =>
                  setComment(e.target.value)
                }
                placeholder="Hãy chia sẻ cảm nhận của bạn..."
                style={{
                  width: "100%",
                  padding: 12,
                  borderRadius: 8,
                  marginBottom: 16,
                }}
              />

              <button
                onClick={handleSubmitFeedback}
                style={{
                  padding: "10px 18px",
                  background: "#ff8c42",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                }}
              >
                Gửi đánh giá
              </button>
            </>
          )}

        </div>
      )}

    </div>
  </div>
  );
};

export default CustomerOrderDetail;