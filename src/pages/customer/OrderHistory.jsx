import { useEffect, useMemo, useState } from "react";

import { Link, useLocation } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

import { getOrders } from "../../services/orderService";

import "../../assets/styles/orders.css";

const PAGE_SIZE = 6;

const STATUS_INFORMATION = {
  pending: {
    label: "Chờ xác nhận",
    group: "pending",
  },


  confirmed: {
    label: "Đã xác nhận",
    group: "processing",
  },

  preparing: {
    label: "Đang chuẩn bị",
    group: "processing",
  },

  ready: {
    label: "Sẵn sàng nhận",
    group: "processing",
  },

  delivering: {
    label: "Đang giao hàng",
    group: "processing",
  },

  completed: {
    label: "Hoàn thành",
    group: "completed",
  },

  cancelled: {
    label: "Đã hủy",
    group: "cancelled",
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

function OrderHistory() {
  const { user } = useAuth();

  const location = useLocation();

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [keyword, setKeyword] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const orderData = await getOrders();

        const customerOrders = orderData
          .filter((order) => belongsToCurrentUser(order, user))
          .sort((first, second) => {
            const firstTime = new Date(first.createdAt || 0).getTime();

            const secondTime = new Date(second.createdAt || 0).getTime();

            return secondTime - firstTime;
          });

        setOrders(customerOrders);
      } catch (fetchError) {
        console.error("Lỗi tải đơn hàng:", fetchError);

        setError(fetchError.message || "Không thể tải lịch sử đơn hàng.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  useEffect(() => {
    setCurrentPage(1);
  }, [keyword, statusFilter]);

  const filteredOrders = useMemo(() => {
    const normalizedKeyword = normalizeText(keyword);

    return orders.filter((order) => {
      const statusInformation = getStatusInformation(order.status);

      const matchesStatus =
        statusFilter === "all" || statusInformation.group === statusFilter;

      const searchableContent = [
        order.orderCode,
        order.paymentCode,
        order.id,
        order.recipientName,
        order.customerName,
        order.recipientPhone,
        order.phone,
      ]
        .map(normalizeText)
        .join(" ");

      const matchesKeyword =
        !normalizedKeyword || searchableContent.includes(normalizedKeyword);

      return matchesStatus && matchesKeyword;
    });
  }, [orders, keyword, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedOrders = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * PAGE_SIZE;

    return filteredOrders.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredOrders, safeCurrentPage]);

  const orderCounts = useMemo(() => {
    return orders.reduce(
      (result, order) => {
        const group = getStatusInformation(order.status).group;

        return {
          ...result,

          all: result.all + 1,

          [group]: (result[group] || 0) + 1,
        };
      },
      {
        all: 0,
        pending: 0,
        processing: 0,
        completed: 0,
        cancelled: 0,
      },
    );
  }, [orders]);

  const clearFilters = () => {
    setKeyword("");
    setStatusFilter("all");
  };

  return (
    <div className="pd-orders-page">
      <header className="pd-orders-heading">
        <p>Petite Douceur</p>

        <h1>Đơn hàng của tôi</h1>

        <span>
          Theo dõi trạng thái và thông tin những chiếc bánh bạn đã đặt.
        </span>
      </header>

      {location.state?.orderCreated && (
        <div className="pd-orders-success-notice">
          ✓ Đơn hàng đã được tạo thành công.
        </div>
      )}

      <section className="pd-orders-filter">
        <div className="pd-orders-search">
          <span aria-hidden="true">⌕</span>

          <input
            type="text"
            value={keyword}
            placeholder="Tìm theo mã đơn, người nhận..."
            onChange={(event) => {
              setKeyword(event.target.value);
            }}
          />
        </div>

        <div className="pd-orders-tabs">
          <button
            type="button"
            className={
              statusFilter === "all"
                ? "pd-orders-tab pd-orders-tab--active"
                : "pd-orders-tab"
            }
            onClick={() => {
              setStatusFilter("all");
            }}
          >
            Tất cả
            <span>{orderCounts.all}</span>
          </button>

          <button
            type="button"
            className={
              statusFilter === "pending"
                ? "pd-orders-tab pd-orders-tab--active"
                : "pd-orders-tab"
            }
            onClick={() => {
              setStatusFilter("pending");
            }}
          >
            Chờ xác nhận
            <span>{orderCounts.pending}</span>
          </button>

          <button
            type="button"
            className={
              statusFilter === "processing"
                ? "pd-orders-tab pd-orders-tab--active"
                : "pd-orders-tab"
            }
            onClick={() => {
              setStatusFilter("processing");
            }}
          >
            Đang xử lý
            <span>{orderCounts.processing}</span>
          </button>

          <button
            type="button"
            className={
              statusFilter === "completed"
                ? "pd-orders-tab pd-orders-tab--active"
                : "pd-orders-tab"
            }
            onClick={() => {
              setStatusFilter("completed");
            }}
          >
            Hoàn thành
            <span>{orderCounts.completed}</span>
          </button>

          <button
            type="button"
            className={
              statusFilter === "cancelled"
                ? "pd-orders-tab pd-orders-tab--active"
                : "pd-orders-tab"
            }
            onClick={() => {
              setStatusFilter("cancelled");
            }}
          >
            Đã hủy
            <span>{orderCounts.cancelled}</span>
          </button>
        </div>
      </section>

      {loading && (
        <div className="pd-orders-loading">
          {Array.from({
            length: 3,
          }).map((_, index) => (
            <span key={index} />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="pd-orders-empty">
          <h2>Không tải được đơn hàng</h2>

          <p>{error}</p>
        </div>
      )}

      {!loading && !error && paginatedOrders.length === 0 && (
        <div className="pd-orders-empty">
          <div className="pd-orders-empty__icon">♡</div>

          <h2>
            {orders.length === 0
              ? "Bạn chưa có đơn hàng nào"
              : "Không tìm thấy đơn hàng phù hợp"}
          </h2>

          <p>
            {orders.length === 0
              ? "Hãy chọn một chiếc bánh nhỏ xinh cho khoảnh khắc ngọt ngào của bạn."
              : "Hãy thử từ khóa hoặc trạng thái khác."}
          </p>

          {orders.length === 0 ? (
            <Link to="/cakes">Khám phá sản phẩm</Link>
          ) : (
            <button type="button" onClick={clearFilters}>
              Xóa bộ lọc
            </button>
          )}
        </div>
      )}

      {!loading && !error && paginatedOrders.length > 0 && (
        <div className="pd-orders-list">
          {paginatedOrders.map((order) => {
            const statusInformation = getStatusInformation(order.status);

            const items = Array.isArray(order.items) ? order.items : [];

            const displayItems = items.slice(0, 3);

            const remainingItems = Math.max(0, items.length - 3);

            const orderCode =
              order.orderCode || order.paymentCode || `#${order.id}`;

            const isPickup = order.fulfillmentMethod === "pickup";

            return (
              <article key={order.id} className="pd-order-card">
                <div className="pd-order-card__header">
                  <div>
                    <span>Mã đơn hàng</span>

                    <strong>{orderCode}</strong>
                  </div>

                  <div className="pd-order-card__date">
                    <span>Ngày đặt</span>

                    <strong>{formatDate(order.createdAt)}</strong>
                  </div>

                  <span
                    className={`pd-order-status pd-order-status--${statusInformation.group}`}
                  >
                    {statusInformation.label}
                  </span>
                </div>

                <div className="pd-order-card__body">
                  <div className="pd-order-card__products">
                    {displayItems.map((item, index) => (
                      <div
                        key={item.itemKey || `${item.cakeId}-${index}`}
                        className="pd-order-product"
                      >
                        <img src={item.image} alt={item.name} />

                        <div>
                          <strong>{item.name}</strong>

                          <span>
                            {item.optionLabel}
                            {" × "}
                            {item.quantity}
                          </span>
                        </div>
                      </div>
                    ))}

                    {remainingItems > 0 && (
                      <div className="pd-order-more-items">
                        +{remainingItems} sản phẩm khác
                      </div>
                    )}
                  </div>

                  <div className="pd-order-card__information">
                    <div>
                      <span>Người nhận</span>

                      <strong>
                        {order.recipientName ||
                          order.customerName ||
                          "Chưa cập nhật"}
                      </strong>
                    </div>

                    <div>
                      <span>Hình thức nhận</span>

                      <strong>
                        {isPickup ? "Tự đến lấy" : "Giao tận nơi"}
                      </strong>
                    </div>

                    <div>
                      <span>Ngày nhận</span>

                      <strong>
                        {order.scheduledDate ||
                          order.deliveryDate ||
                          "Chưa cập nhật"}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="pd-order-card__footer">
                  <div>
                    <span>Tổng thanh toán</span>

                    <strong>
                      {formatCurrency(order.totalAmount || order.total)}
                    </strong>
                  </div>

                  <Link to={`/orders/${order.id}`}>Xem chi tiết</Link>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {!loading && !error && totalPages > 1 && (
        <nav className="pd-orders-pagination">
          <button
            type="button"
            disabled={safeCurrentPage === 1}
            onClick={() => {
              setCurrentPage(safeCurrentPage - 1);
            }}
          >
            ←
          </button>

          {Array.from(
            {
              length: totalPages,
            },
            (_, index) => index + 1,
          ).map((page) => (
            <button
              key={page}
              type="button"
              className={
                page === safeCurrentPage ? "pd-orders-pagination__active" : ""
              }
              onClick={() => {
                setCurrentPage(page);
              }}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            disabled={safeCurrentPage === totalPages}
            onClick={() => {
              setCurrentPage(safeCurrentPage + 1);
            }}
          >
            →
          </button>
        </nav>
      )}
    </div>
  );
}

export default OrderHistory;
