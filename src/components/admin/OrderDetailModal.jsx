import React, { useState } from "react";
import "../../assets/styles/OrderDetailModal.css";

// Dùng chung cách lấy ảnh với trang chủ: ảnh được import tĩnh và match theo tên bánh,
// KHÔNG dùng thẳng field "image" dạng string trong data vì file ảnh đó không tồn tại thật trong project
import { getCakeHomeImage } from "../../utils/homeCakeData";

// Modal hiển thị chi tiết 1 đơn hàng: thông tin khách, giao hàng, sản phẩm, lịch sử trạng thái và các nút xử lý đơn
function OrderDetailModal({
  show,
  order,
  cakes,
  onClose,
  onUpdateStatus,
  getNextStatus,
  getStatusBadge,
  getStatusText,
  metadata,
}) {
  const [zoomImage, setZoomImage] = useState(null); // Ảnh/SVG đang được phóng to xem chi tiết

  if (!show || !order) return null;

  /* ---------- Lấy ảnh bánh từ danh sách cakes theo cakeId ---------- */
  const getCakeImage = (cakeId) => {
    if (!cakes || !Array.isArray(cakes)) return null;
    const cake = cakes.find((c) => c.id === cakeId);
    if (!cake) return null;
    return getCakeHomeImage(cake);
  };

  // Các hàm tra tên từ metadata theo id (dùng cho bánh custom), có fallback nếu không tìm thấy
  const getSizeName = (id) => metadata.sizes.find((s) => s.id === id)?.name || `Size #${id}`;
  const getLayerName = (id) => metadata.layers.find((l) => l.id === id)?.name || `${id} tầng`;
  const getBaseName = (id) => metadata.bases.find((b) => b.id === id)?.name || `Cốt #${id}`;
  const getFillingName = (id) => metadata.fillings.find((f) => f.id === id)?.name || `Nhân #${id}`;
  const getCreamName = (id) => metadata.creams.find((c) => c.id === id)?.name || `Kem #${id}`;
  const getColorName = (id) => metadata.colors.find((c) => c.id === id)?.name || `Màu #${id}`;
  const getColorHex = (id) => metadata.colors.find((c) => c.id === id)?.hex || "#f5dce2";
  const getToppingsNames = (ids) => {
    if (!ids || ids.length === 0) return "Không chọn";
    return ids.map((id) => metadata.toppings.find((t) => t.id === id)?.name || `Topping #${id}`).join(", ");
  };

  /* ---------- Vẽ hình ảnh minh hoạ (SVG) cho bánh custom, vì bánh custom không có ảnh thật ---------- */
  const renderCustomSVG = (config) => {
    if (!config) return null;
    const colorHex = getColorHex(config.colorId);
    const layerCount = config.layerId || 1;
    const height = 60 + layerCount * 25;

    return (
      <svg viewBox="0 0 200 160" className="odm-svg-preview">
        {/* Đĩa đặt bánh */}
        <ellipse cx="100" cy="145" rx="80" ry="10" fill="#e8e8e8" />

        {/* Các tầng bánh, vẽ theo số tầng đã chọn */}
        {Array.from({ length: layerCount }).map((_, i) => (
          <g key={i}>
            <rect
              x="50"
              y={height - 30 - i * 28}
              width="100"
              height="26"
              rx="4"
              fill={colorHex === "MULTI" ? (i % 2 === 0 ? "#f8bbd0" : "#d0e1fd") : colorHex}
              stroke="#c97a85"
              strokeWidth="1"
            />
            {i < layerCount - 1 && (
              <rect
                x="48"
                y={height - 32 - i * 28}
                width="104"
                height="4"
                rx="2"
                fill="#fff"
                stroke="#f5dce2"
                strokeWidth="0.5"
              />
            )}
          </g>
        ))}

        {/* Vệt kem chảy trang trí */}
        <path
          d={`M 50 ${height - 30} Q 60 ${height - 15} 70 ${height - 30} Q 80 ${height - 10} 90 ${height - 30} Q 100 ${height - 18} 110 ${height - 30} Q 120 ${height - 12} 130 ${height - 30} Q 140 ${height - 20} 150 ${height - 30}`}
          fill="none"
          stroke="#fff"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Các chấm tròn tượng trưng cho topping */}
        {config.toppingIds?.map((_, i) => (
          <circle
            key={i}
            cx={70 + (i % 4) * 20 + (i * 7) % 15}
            cy={height - 45 - Math.floor(i / 4) * 15}
            r="4"
            fill={["#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff"][i % 4]}
          />
        ))}

        {/* Thông điệp trên bánh (cắt ngắn nếu quá dài) */}
        {config.message && (
          <text
            x="100"
            y={height - 50 - layerCount * 5}
            textAnchor="middle"
            fill="#5c4b4f"
            fontSize="10"
            fontFamily="Segoe UI"
            fontWeight="600"
          >
            {config.message.length > 15 ? config.message.slice(0, 15) + "..." : config.message}
          </text>
        )}
      </svg>
    );
  };

  return (
    <>
      {/* Lớp phóng to ảnh/SVG khi click vào hình sản phẩm */}
      {zoomImage && (
        <div className="odm-zoom-overlay" onClick={() => setZoomImage(null)}>
          <div className="odm-zoom-content" onClick={(e) => e.stopPropagation()}>
            <button className="odm-zoom-close" onClick={() => setZoomImage(null)}>×</button>
            {zoomImage.type === "image" ? (
              <img src={zoomImage.src} alt={zoomImage.alt} className="odm-zoom-img" />
            ) : (
              <div className="odm-zoom-svg">{zoomImage.svg}</div>
            )}
            <p className="odm-zoom-label">{zoomImage.alt}</p>
          </div>
        </div>
      )}

      {/* Nền mờ phía sau modal, click ra ngoài để đóng */}
      <div className="odm-overlay" onClick={onClose}>
        <div className="odm-dialog" onClick={(e) => e.stopPropagation()}>
          <div className="odm-content">
            {/* Header: mã đơn + nút đóng */}
            <div className="odm-header">
              <h5 className="odm-header_title">
                Chi tiết đơn hàng
                <span className="odm-header_code">{order.orderCode}</span>
              </h5>
              <button type="button" className="odm-close" onClick={onClose}>×</button>
            </div>

            {/* Nội dung chính */}
            <div className="odm-body">
              {/* Thanh hiển thị trạng thái hiện tại của đơn */}
              <div className="odm-status-bar">
                <span className="odm-status-bar_label">Trạng thái hiện tại:</span>
                {getStatusBadge(order.status)}
              </div>

              {/* Lưới thông tin: khách hàng + giao hàng/thanh toán */}
              <div className="odm-grid">
                {/* Thông tin khách hàng */}
                <div className="odm-card">
                  <h6 className="odm-card_title">Thông tin khách hàng</h6>
                  <div className="odm-field">
                    <span className="odm-field_label">Họ tên</span>
                    <span className="odm-field_value">{order.customerName}</span>
                  </div>
                  <div className="odm-field">
                    <span className="odm-field_label">Số điện thoại</span>
                    <span className="odm-field_value">{order.phone}</span>
                  </div>
                  <div className="odm-field">
                    <span className="odm-field_label">Ngày nhận</span>
                    <span className="odm-field_value">
                      {order.deliveryDate} | {order.deliveryTime}
                    </span>
                  </div>
                  <div className="odm-field">
                    <span className="odm-field_label">Ghi chú</span>
                    <span className="odm-field_value odm-field_value--italic">
                      {order.note ? `"${order.note}"` : "Không có ghi chú"}
                    </span>
                  </div>
                </div>

                {/* Thông tin giao hàng và thanh toán */}
                <div className="odm-card">
                  <h6 className="odm-card_title">Giao hàng & Thanh toán</h6>
                  <div className="odm-field">
                    <span className="odm-field_label">Hình thức nhận</span>
                    <span className="odm-field_value">
                      {order.receiveMethod === "delivery" ? "Giao hàng" : "Nhận tại tiệm"}
                    </span>
                  </div>
                  <div className="odm-field">
                    <span className="odm-field_label">Địa chỉ</span>
                    <span className="odm-field_value">{order.shippingAddress || order.address || "—"}</span>
                  </div>
                  <div className="odm-field">
                    <span className="odm-field_label">Phương thức thanh toán</span>
                    <span className="odm-field_value">{order.paymentMethod}</span>
                  </div>
                  <div className="odm-field">
                    <span className="odm-field_label">Trạng thái thanh toán</span>
                    <span className={`odm-payment odm-payment--${order.paymentStatus}`}>
                      {order.paymentStatus === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Danh sách sản phẩm đặt mua kèm ảnh */}
              <div className="odm-card odm-card--full">
                <h6 className="odm-card_title">Sản phẩm đặt mua</h6>

                {/* Danh sách card từng sản phẩm trong đơn */}
                <div className="odm-item-cards">
                  {order.items?.map((item, index) => {
                    const isCustom = item.type === "custom";
                    const cakeImage = !isCustom ? getCakeImage(item.cakeId) : null;

                    return (
                      <div className="odm-item-card" key={index}>
                        {/* Ảnh sản phẩm hoặc placeholder */}
                        <div className="odm-item-card_visual">
                          {isCustom ? (
                            // Bánh custom: hiện SVG minh hoạ, click để phóng to
                            <div
                              className="odm-item-card_placeholder"
                              onClick={() => setZoomImage({
                                type: "svg",
                                svg: renderCustomSVG(item.customConfig),
                                alt: item.name || "Bánh custom"
                              })}
                            >
                              {renderCustomSVG(item.customConfig)}
                              <span className="odm-item-card_placeholder-text">Custom</span>
                            </div>
                          ) : cakeImage ? (
                            // Bánh có sẵn: hiện ảnh thật, click để phóng to
                            <div
                              className="odm-item-card_img-wrap"
                              onClick={() => setZoomImage({
                                type: "image",
                                src: cakeImage,
                                alt: item.cakeName
                              })}
                            >
                              <img
                                src={cakeImage}
                                alt={item.cakeName}
                                className="odm-item-card_img"
                              />
                            </div>
                          ) : (
                            // Không có ảnh
                            <div className="odm-item-card_placeholder odm-item-card_placeholder--empty">
                              <span className="odm-item-card_placeholder-text">Không có ảnh</span>
                            </div>
                          )}
                        </div>

                        {/* Thông tin sản phẩm */}
                        <div className="odm-item-card_info">
                          <div className="odm-item-card_header">
                            <div>
                              {isCustom ? (
                                <>
                                  <span className="odm-custom_badge">Bánh thiết kế riêng</span>
                                  <div className="odm-item-card_name">{item.name || "Bánh custom"}</div>
                                </>
                              ) : (
                                <div className="odm-item-card_name">{item.cakeName}</div>
                              )}
                              {item.optionLabel && (
                                <div className="odm-item-card_option">{item.optionLabel}</div>
                              )}
                            </div>
                            <div className="odm-item-card_price">
                              <span className="odm-item-card_qty">x{item.quantity}</span>
                              <span className="odm-item-card_total">{item.lineTotal?.toLocaleString("vi-VN")} đ</span>
                            </div>
                          </div>

                          {/* Chi tiết cấu hình bánh custom (size, cốt, nhân, kem, màu, topping, thông điệp...) */}
                          {isCustom && item.customConfig && (
                            <div className="odm-custom_config">
                              <div className="odm-config-row">
                                <span>Kích thước:</span> {getSizeName(item.customConfig.sizeId)} ({getLayerName(item.customConfig.layerId)})
                              </div>
                              <div className="odm-config-row">
                                <span>Cốt bánh:</span> {getBaseName(item.customConfig.baseId)}
                              </div>
                              <div className="odm-config-row">
                                <span>Nhân bánh:</span> {getFillingName(item.customConfig.fillingId)}
                              </div>
                              <div className="odm-config-row">
                                <span>Lớp kem:</span> {getCreamName(item.customConfig.creamId)}
                              </div>
                              <div className="odm-config-row">
                                <span>Màu chủ đạo:</span> {getColorName(item.customConfig.colorId)}
                              </div>
                              <div className="odm-config-row">
                                <span>Toppings:</span> {getToppingsNames(item.customConfig.toppingIds)}
                              </div>
                              {item.customConfig.message && (
                                <div className="odm-config-row odm-config-row--highlight">
                                  Thông điệp: "{item.customConfig.message}"
                                </div>
                              )}
                              {item.customConfig.specialRequest && (
                                <div className="odm-config-row odm-config-row--note">
                                  Yêu cầu đặc biệt: "{item.customConfig.specialRequest}"
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bảng tính tiền: tạm tính, phí ship, giảm giá, tổng cộng */}
                <div className="odm-pricing">
                  <div className="odm-pricing_row">
                    <span>Tạm tính</span>
                    <span>{order.subtotal?.toLocaleString("vi-VN")} đ</span>
                  </div>
                  <div className="odm-pricing_row">
                    <span>Phí giao hàng</span>
                    <span>{order.shippingFee?.toLocaleString("vi-VN")} đ</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="odm-pricing_row odm-pricing_row--discount">
                      <span>Giảm giá</span>
                      <span>-{order.discount?.toLocaleString("vi-VN")} đ</span>
                    </div>
                  )}
                  <div className="odm-pricing_row odm-pricing_row--total">
                    <span>Tổng cộng</span>
                    <span>{order.total?.toLocaleString("vi-VN")} đ</span>
                  </div>
                </div>
              </div>

              {/* Dòng thời gian lịch sử thay đổi trạng thái đơn */}
              <div className="odm-card odm-card--full">
                <h6 className="odm-card_title">Lịch sử trạng thái</h6>
                {order.statusHistory?.length > 0 ? (
                  <div className="odm-timeline">
                    {order.statusHistory.map((history, idx) => (
                      <div className="odm-timeline_item" key={idx}>
                        <div className="odm-timeline_dot" />
                        <div className="odm-timeline_content">
                          <div className="odm-timeline_status">{getStatusText(history.status)}</div>
                          <div className="odm-timeline_time">
                            {new Date(history.time).toLocaleString("vi-VN", {
                              year: "numeric", month: "2-digit", day: "2-digit",
                              hour: "2-digit", minute: "2-digit", second: "2-digit",
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="odm-empty-text">Không ghi nhận lịch sử trạng thái.</p>
                )}
              </div>
            </div>

            {/* Footer: các nút hành động xử lý đơn */}
            <div className="odm-footer">
              <div className="odm-footer_actions">
                <button className="odm-btn odm-btn--secondary" onClick={onClose}>
                  Đóng
                </button>

                {/* Đơn đang chờ xác nhận -> hiện nút xác nhận */}
                {order.status === "Pending" && (
                  <button
                    className="odm-btn odm-btn--primary"
                    onClick={() => onUpdateStatus(order.id, order.status, "confirm")}
                  >
                    Xác nhận đơn
                  </button>
                )}

                {/* Đơn đang xử lý (chưa hoàn thành/huỷ) -> hiện nút chuyển sang trạng thái kế tiếp */}
                {order.status !== "Pending" &&
                  order.status !== "Completed" &&
                  order.status !== "Cancelled" &&
                  order.status !== "Cancel" &&
                  getNextStatus(order.status) && (
                    <button
                      className="odm-btn odm-btn--success"
                      onClick={() => onUpdateStatus(order.id, order.status, "next")}
                    >
                      {getStatusText(getNextStatus(order.status))}
                    </button>
                  )}

                {/* Đơn chưa hoàn thành/huỷ -> luôn cho phép huỷ đơn */}
                {order.status !== "Completed" &&
                  order.status !== "Cancelled" &&
                  order.status !== "Cancel" && (
                    <button
                      className="odm-btn odm-btn--danger"
                      onClick={() => onUpdateStatus(order.id, order.status, "cancel")}
                    >
                      Hủy đơn
                    </button>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderDetailModal;