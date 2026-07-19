import React from "react";

function OrderTable({
  orders,
  onView,
  onUpdateStatus,
  getNextStatus,
  getStatusBadge,
  getStatusText,
}) {
  return (
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
          {orders.map((order) => {
            const nextState = getNextStatus(order.status);
            const isFinalState =
              order.status === "Completed" ||
              order.status === "Cancelled" ||
              order.status === "Cancel";

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
                      onClick={() => onView(order)}
                    >
                      👁️ View
                    </button>

                    {/* Confirm Button for Pending */}
                    {order.status === "Pending" && (
                      <button
                        className="btn btn-sm text-white rounded-pill px-3"
                        style={{ backgroundColor: "#F48FB1", borderColor: "#F48FB1" }}
                        onClick={() => onUpdateStatus(order.id, order.status, "confirm")}
                      >
                        ✅ Confirm
                      </button>
                    )}

                    {/* Next Status Button */}
                    {!isFinalState && order.status !== "Pending" && nextState && (
                      <button
                        className="btn btn-sm btn-success rounded-pill px-3"
                        onClick={() => onUpdateStatus(order.id, order.status, "next")}
                      >
                        ➡️ {getStatusText(nextState)}
                      </button>
                    )}

                    {/* Cancel Button */}
                    {!isFinalState && (
                      <button
                        className="btn btn-sm btn-danger rounded-pill px-3"
                        onClick={() => onUpdateStatus(order.id, order.status, "cancel")}
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
  );
}

export default OrderTable;
