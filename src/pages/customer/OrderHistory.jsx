import React, { useState, useEffect, useContext } from 'react';
import { getOrdersByUserId } from '../../services/orderService';
import AuthContext from '../../contexts/AuthContext';
import '../../components/order/OrderHistory.css';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    // If not logged in or missing id, fallback to a generic or mock ID for demo
    const userId = user?.id || 'user123';
    
    getOrdersByUserId(userId).then(data => {
      // The new axiosClient interceptor returns data directly (or an axios response if not configured)
      // Usually json-server returns an array for this query
      setOrders(Array.isArray(data) ? data : (data.data || []));
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setOrders([]);
      setLoading(false);
    });
  }, [user]);

  if (loading) return <div className="loading-state">Đang tải lịch sử đơn hàng...</div>;

  return (
    <div className="order-history-page">
      <h1>Lịch Sử Đơn Hàng</h1>
      {orders.length === 0 ? (
        <p>Bạn chưa có đơn hàng nào.</p>
      ) : (
        <div className="table-responsive">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Mã Đơn</th>
                <th>Ngày Đặt</th>
                <th>Tổng Tiền</th>
                <th>Trạng Thái</th>
                <th>Thanh Toán</th>
                <th>Chi Tiết</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td><strong>{order.id}</strong></td>
                  <td>{new Date(order.date).toLocaleDateString('vi-VN')}</td>
                  <td>{order.total.toLocaleString()} ₫</td>
                  <td>
                    <span className={`status-badge status-${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{order.paymentStatus}</td>
                  <td>
                    <a href={`/orders/${order.id}`} className="view-detail-btn">
                      Xem
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
