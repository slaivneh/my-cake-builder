import React, { useState, useEffect } from 'react';
import orderService from '../../services/orderService';
import OrderStatusTracker from '../../components/order/OrderStatusTracker';
import '../../components/order/OrderHistory.css';

const CustomerOrderDetail = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Mocking ID extraction from URL
    const pathParts = window.location.pathname.split('/');
    const orderId = pathParts[pathParts.length - 1] || 'ORD-002'; // fallback to ORD-002 for demo

    orderService.getById(orderId)
      .then(data => {
        setOrder(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Không tìm thấy đơn hàng');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading-state">Đang tải chi tiết đơn hàng...</div>;
  if (error) return <div className="error-state">{error}</div>;
  if (!order) return null;

  return (
    <div className="order-detail-page">
      <div className="detail-header">
        <h1>Chi Tiết Đơn Hàng #{order.id}</h1>
        <a href="/orders" className="back-link">← Quay lại danh sách</a>
      </div>

      <div className="tracker-section">
        <OrderStatusTracker currentStatus={order.status} />
      </div>

      <div className="detail-content">
        <div className="detail-card info-card">
          <h3>Thông Tin Đơn Hàng</h3>
          <p><strong>Ngày đặt:</strong> {new Date(order.date).toLocaleString('vi-VN')}</p>
          <p><strong>Trạng thái:</strong> {order.status}</p>
          <p><strong>Thanh toán:</strong> {order.paymentStatus}</p>
          <p className="total-price"><strong>Tổng tiền:</strong> {order.total.toLocaleString()} ₫</p>
        </div>

        <div className="detail-card items-card">
          <h3>Sản Phẩm</h3>
          {order.items.map((item, idx) => (
            <div key={idx} className="order-item">
              {item.type === 'custom' ? (
                <div>
                  <h4>Bánh Thiết Kế Custom</h4>
                  <ul className="cake-specs">
                    <li><strong>Size:</strong> {item.details.size}</li>
                    <li><strong>Số tầng:</strong> {item.details.layer}</li>
                    <li><strong>Cốt bánh:</strong> {item.details.sponge}</li>
                    <li><strong>Màu sắc:</strong> 
                      <span className="color-swatch" style={{backgroundColor: item.details.color}}></span> 
                      ({item.details.color})
                    </li>
                    {item.details.text && <li><strong>Nội dung:</strong> {item.details.text}</li>}
                    {item.details.toppings && item.details.toppings.length > 0 && (
                      <li><strong>Toppings:</strong> {item.details.toppings.join(', ')}</li>
                    )}
                  </ul>
                </div>
              ) : (
                <div>Sản phẩm thường</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerOrderDetail;
