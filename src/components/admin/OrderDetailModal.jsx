import React from "react";

function OrderDetailModal({
  show,
  order,
  onClose,
  onUpdateStatus,
  getNextStatus,
  getStatusBadge,
  getStatusText,
  metadata,
}) {
  if (!show || !order) return null;

  // Resolving metadata lookups
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

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden bg-white">
          {/* Modal Header */}
          <div className="modal-header border-0 p-4" style={{ backgroundColor: "#FFF8FA", borderBottom: "2px solid #F48FB1" }}>
            <h5 className="modal-title fw-bold text-dark fs-4 d-flex align-items-center">
              <span className="me-2">📋</span> Details of Order{" "}
              <span className="ms-2 fw-bold" style={{ color: "#F48FB1" }}>
                {order.orderCode}
              </span>
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          {/* Modal Body */}
          <div className="modal-body p-4" style={{ maxHeight: "calc(100vh - 210px)", overflowY: "auto" }}>
            {/* Status bar */}
            <div className="mb-4 d-flex justify-content-between align-items-center bg-light p-3 rounded-3">
              <span className="fw-semibold text-secondary">Current Status:</span>
              {getStatusBadge(order.status)}
            </div>

            <div className="row g-4 mb-4">
              {/* Customer Info */}
              <div className="col-12 col-md-6">
                <div className="card h-100 border rounded-3 p-3">
                  <h6 className="fw-bold text-dark border-bottom pb-2 mb-3">👤 Customer Information</h6>
                  <div className="mb-2">
                    <small className="text-muted d-block">Full Name</small>
                    <span className="fw-semibold">{order.customerName}</span>
                  </div>
                  <div className="mb-2">
                    <small className="text-muted d-block">Phone Number</small>
                    <span>{order.phone}</span>
                  </div>
                  <div className="mb-2">
                    <small className="text-muted d-block">Delivery / Pickup Slot</small>
                    <span className="fw-semibold text-danger">
                      📅 {order.deliveryDate} &nbsp;|&nbsp; ⏰ {order.deliveryTime}
                    </span>
                  </div>
                  <div className="mb-0">
                    <small className="text-muted d-block">Customer Note</small>
                    <span className="fst-italic text-secondary">
                      {order.note ? `"${order.note}"` : "Không có ghi chú"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="col-12 col-md-6">
                <div className="card h-100 border rounded-3 p-3">
                  <h6 className="fw-bold text-dark border-bottom pb-2 mb-3">🚚 Delivery & Payment</h6>
                  <div className="mb-2">
                    <small className="text-muted d-block">Receive Method</small>
                    <span className="fw-semibold">
                      {order.receiveMethod === "delivery" ? "🚚 Giao hàng" : "🏪 Nhận tại tiệm"}
                    </span>
                  </div>
                  <div className="mb-2">
                    <small className="text-muted d-block">Address</small>
                    <span className="text-wrap">{order.shippingAddress}</span>
                  </div>
                  <div className="mb-2">
                    <small className="text-muted d-block">Payment Method</small>
                    <span>{order.paymentMethod}</span>
                  </div>
                  <div className="mb-0">
                    <small className="text-muted d-block">Payment Status</small>
                    <span className={`badge px-2.5 py-1 ${order.paymentStatus === "paid" ? "bg-success" : "bg-warning text-dark"}`}>
                      {order.paymentStatus === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Table */}
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
                    {order.items &&
                      order.items.map((item, index) => {
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

              {/* Pricing Breakdown */}
              <div className="row justify-content-end mt-3 border-top pt-3 g-2">
                <div className="col-8 col-md-5 text-end text-muted">Subtotal:</div>
                <div className="col-4 col-md-3 text-end fw-semibold">
                  {order.subtotal?.toLocaleString("vi-VN")} ₫
                </div>

                <div className="col-8 col-md-5 text-end text-muted">Shipping Fee:</div>
                <div className="col-4 col-md-3 text-end fw-semibold">
                  {order.shippingFee?.toLocaleString("vi-VN")} ₫
                </div>

                {order.discount > 0 && (
                  <>
                    <div className="col-8 col-md-5 text-end text-muted">Discount:</div>
                    <div className="col-4 col-md-3 text-end text-danger fw-semibold">
                      -{order.discount?.toLocaleString("vi-VN")} ₫
                    </div>
                  </>
                )}

                <div className="col-8 col-md-5 text-end fw-bold fs-5" style={{ color: "#F48FB1" }}>
                  Total Amount:
                </div>
                <div className="col-4 col-md-3 text-end fw-bold fs-5 text-dark border-top pt-1">
                  {order.total?.toLocaleString("vi-VN")} ₫
                </div>
              </div>
            </div>

            {/* Timeline history */}
            <div className="card border rounded-3 p-3">
              <h6 className="fw-bold text-dark border-bottom pb-2 mb-3">🕒 Status Update Log</h6>
              {order.statusHistory && order.statusHistory.length > 0 ? (
                <div className="ps-3 border-start border-2 border-pink ms-2 position-relative">
                  {order.statusHistory.map((history, idx) => (
                    <div className="mb-3 position-relative" key={idx}>
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

          {/* Footer actions */}
          <div className="modal-footer border-0 p-4 bg-light">
            <div className="d-flex gap-2 w-100 justify-content-end">
              <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={onClose}>
                Close Window
              </button>

              {order.status === "Pending" && (
                <button
                  className="btn text-white rounded-pill px-4"
                  style={{ backgroundColor: "#F48FB1", borderColor: "#F48FB1" }}
                  onClick={() => onUpdateStatus(order.id, order.status, "confirm")}
                >
                  Confirm Order
                </button>
              )}

              {order.status !== "Pending" &&
                order.status !== "Completed" &&
                order.status !== "Cancelled" &&
                order.status !== "Cancel" &&
                getNextStatus(order.status) && (
                  <button
                    className="btn btn-success rounded-pill px-4"
                    onClick={() => onUpdateStatus(order.id, order.status, "next")}
                  >
                    Advance to: {getStatusText(getNextStatus(order.status))}
                  </button>
                )}

              {order.status !== "Completed" &&
                order.status !== "Cancelled" &&
                order.status !== "Cancel" && (
                  <button
                    className="btn btn-danger rounded-pill px-4"
                    onClick={() => onUpdateStatus(order.id, order.status, "cancel")}
                  >
                    Cancel Order
                  </button>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailModal;
