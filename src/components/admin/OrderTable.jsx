import React from "react";
import "../../assets/styles/OrderTable.css";

function OrderTable({
  orders,
  onView,
}) {
  return (
    <div className="ot-table-wrap">
      <table className="ot-table">
        <thead>
          <tr>
            <th className="ot-tc-center">Mã đơn</th>
            <th>Khách hàng</th>
            <th className="ot-tc-center">SĐT</th>
            <th className="ot-tc-center">Hình thức</th>
            <th className="ot-tc-center">Ngày nhận</th>
            <th className="ot-tc-right">Tổng tiền</th>
            <th className="ot-tc-center">Trạng thái</th>
            <th className="ot-tc-center">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="ot-tc-center ot-code">{order.orderCode}</td>
              <td className="ot-name">{order.customerName}</td>
              <td className="ot-tc-center ot-phone">{order.phone}</td>
              <td className="ot-tc-center">
                <span className={`ot-method ot-method--${order.receiveMethod}`}>
                  {order.receiveMethod === "delivery" ? "Giao hàng" : "Nhận tại tiệm"}
                </span>
              </td>
              <td className="ot-tc-center ot-date">
                {order.deliveryDate} <span className="ot-time">({order.deliveryTime})</span>
              </td>
              <td className="ot-tc-right ot-price">
                {order.total?.toLocaleString("vi-VN")} đ
              </td>
              <td className="ot-tc-center">{order.statusBadge}</td>
              <td className="ot-tc-center">
                <button
                  className="ot-btn ot-btn--view"
                  onClick={() => onView(order)}
                >
                  Xem
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderTable;