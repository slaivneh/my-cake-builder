import { useMemo, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

import {
  createOrder,
  sendOrderConfirmationEmail,
} from "../../services/orderService";

import { clearCart, getCartSummary, readCart } from "../../utils/cartStorage";

import paymentQr from "../../assets/images/payment/qr.png";

import "../../assets/styles/checkout.css";

const PAYMENT_CODE_STORAGE_KEY = "petite-douceur-payment-code";

const formatCurrency = (value) => {
  return Number(value || 0).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};

const getTodayString = () => {
  const currentDate = new Date();

  const timezoneOffset = currentDate.getTimezoneOffset() * 60000;

  return new Date(currentDate.getTime() - timezoneOffset)
    .toISOString()
    .split("T")[0];
};

const createPaymentCode = () => {
  const now = new Date();

  const datePart = [
    now.getFullYear(),

    String(now.getMonth() + 1).padStart(2, "0"),

    String(now.getDate()).padStart(2, "0"),
  ].join("");

  const randomPart = Math.random().toString(36).slice(2, 7).toUpperCase();

  return `PD${datePart}${randomPart}`;
};

const getOrCreatePaymentCode = () => {
  const savedCode = sessionStorage.getItem(PAYMENT_CODE_STORAGE_KEY);

  if (savedCode) {
    return savedCode;
  }

  const newCode = createPaymentCode();

  sessionStorage.setItem(PAYMENT_CODE_STORAGE_KEY, newCode);

  return newCode;
};

const STORE_PICKUP_ADDRESS =
  process.env.REACT_APP_STORE_ADDRESS || "Địa chỉ cửa hàng Petite Douceur";

function Checkout() {
  const navigate = useNavigate();

  const { user } = useAuth();

  const [cartItems] = useState(() => readCart());

  const [paymentCode] = useState(() => getOrCreatePaymentCode());

  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    recipientName: "",
    recipientPhone: "",

    contactEmail: user?.email || "",

    fulfillmentMethod: "pickup",

    deliveryAddress: "",

    scheduledDate: "",

    scheduledTime: "08:00 - 11:00",

    note: "",

    paymentReference: "",

    paymentConfirmed: false,
  });

  const [errors, setErrors] = useState({});

  const [submitError, setSubmitError] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const cartSummary = useMemo(() => getCartSummary(cartItems), [cartItems]);

  const checkoutSummary = useMemo(() => {
    const subtotal = cartSummary.subtotal;

    const shippingFee =
      formData.fulfillmentMethod === "pickup"
        ? 0
        : subtotal >= 300000
          ? 0
          : 30000;

    return {
      subtotal,
      shippingFee,

      total: subtotal + shippingFee,
    };
  }, [cartSummary.subtotal, formData.fulfillmentMethod]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    const nextValue = type === "checkbox" ? checked : value;

    setFormData((previous) => ({
      ...previous,
      [name]: nextValue,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setSubmitError("");
  };

  const handleCopyPaymentCode = async () => {
    try {
      await navigator.clipboard.writeText(paymentCode);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch (error) {
      console.error("Không sao chép được:", error);
    }
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.recipientName.trim()) {
      nextErrors.recipientName = "Vui lòng nhập tên người nhận.";
    }

    const normalizedPhone = formData.recipientPhone.replace(/\s/g, "").trim();

    if (!normalizedPhone) {
      nextErrors.recipientPhone = "Vui lòng nhập số điện thoại.";
    } else if (!/^(0\d{9}|\+84\d{9})$/.test(normalizedPhone)) {
      nextErrors.recipientPhone = "Số điện thoại không hợp lệ.";
    }

    if (!formData.contactEmail.trim()) {
      nextErrors.contactEmail = "Vui lòng nhập email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      nextErrors.contactEmail = "Email không hợp lệ.";
    }

    if (
      formData.fulfillmentMethod === "delivery" &&
      !formData.deliveryAddress.trim()
    ) {
      nextErrors.deliveryAddress = "Vui lòng nhập địa chỉ giao bánh.";
    }

    if (!formData.scheduledDate) {
      nextErrors.scheduledDate = "Vui lòng chọn ngày nhận bánh.";
    }

    if (!formData.scheduledTime) {
      nextErrors.scheduledTime = "Vui lòng chọn giờ nhận bánh.";
    }

    if (!formData.paymentReference.trim()) {
      nextErrors.paymentReference = "Vui lòng nhập mã giao dịch.";
    }

    if (!formData.paymentConfirmed) {
      nextErrors.paymentConfirmed = "Vui lòng xác nhận đã chuyển khoản.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitting) {
      return;
    }

    if (cartItems.length === 0) {
      setSubmitError("Giỏ hàng đang trống.");

      return;
    }

    const formIsValid = validateForm();

    if (!formIsValid) {
      setSubmitError(
        "Vui lòng kiểm tra và điền đầy đủ các thông tin bắt buộc.",
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    try {
      setSubmitting(true);
      setSubmitError("");

      const now = new Date().toISOString();

      const receivingAddress =
        formData.fulfillmentMethod === "delivery"
          ? formData.deliveryAddress.trim()
          : STORE_PICKUP_ADDRESS;

      const orderData = {
        orderCode: paymentCode,

        customerId: user?.id || null,

        userId: user?.id || null,

        purchaserId: user?.id || null,

        purchaserName: user?.fullName || user?.name || "",

        purchaserEmail: user?.email || "",

        customerName: formData.recipientName.trim(),

        recipientName: formData.recipientName.trim(),

        phone: formData.recipientPhone.trim(),

        recipientPhone: formData.recipientPhone.trim(),

        email: formData.contactEmail.trim(),

        contactEmail: formData.contactEmail.trim(),

        fulfillmentMethod: formData.fulfillmentMethod,

        deliveryAddress:
          formData.fulfillmentMethod === "delivery" ? receivingAddress : "",

        pickupAddress:
          formData.fulfillmentMethod === "pickup" ? receivingAddress : "",

        address: receivingAddress,

        scheduledDate: formData.scheduledDate,

        deliveryDate: formData.scheduledDate,

        scheduledTime: formData.scheduledTime,

        deliveryTime: formData.scheduledTime,

        note: formData.note.trim(),

        paymentMethod: "bank_transfer",

        paymentCode,

        paymentReference: formData.paymentReference.trim(),

        paymentStatus: "pending_verification",

        status: "pending_confirmation",

        items: cartItems.map((item) => ({
          cakeId: item.cakeId,

          name: item.name,

          image: item.image,

          category: item.category,

          optionId: item.optionId,

          optionLabel: item.optionLabel,

          price: Number(item.price),

          quantity: Number(item.quantity),

          lineTotal: Number(item.price) * Number(item.quantity),
        })),

        subtotal: checkoutSummary.subtotal,

        shippingFee: checkoutSummary.shippingFee,

        total: checkoutSummary.total,

        totalAmount: checkoutSummary.total,

        createdAt: now,
        updatedAt: now,
      };

      const createdOrder = await createOrder(orderData);

      if (!createdOrder?.id) {
        throw new Error("Máy chủ không trả về mã đơn hàng.");
      }

      /*
        Không chờ gửi email để tránh
        email làm nút đặt hàng bị treo.
      */
      if (process.env.REACT_APP_ENABLE_ORDER_EMAIL === "true") {
        sendOrderConfirmationEmail({
          to: formData.contactEmail.trim(),

          orderId: createdOrder.id,

          orderCode: paymentCode,

          recipientName: formData.recipientName.trim(),

          fulfillmentMethod: formData.fulfillmentMethod,

          scheduledDate: formData.scheduledDate,

          scheduledTime: formData.scheduledTime,

          total: checkoutSummary.total,
        }).catch((emailError) => {
          console.warn("Đơn đã tạo nhưng chưa gửi được email:", emailError);
        });
      }

      clearCart();

      sessionStorage.removeItem(PAYMENT_CODE_STORAGE_KEY);

      navigate(`/order-success/${createdOrder.id}`, {
        replace: true,

        state: {
          order: createdOrder,
        },
      });
    } catch (error) {
      console.error("Lỗi tạo đơn hàng:", error);

      setSubmitError(
        error.message || "Không thể tạo đơn hàng. Vui lòng thử lại.",
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="pd-checkout-page">
        <div className="pd-checkout-empty">
          <h1>Chưa có sản phẩm để đặt hàng</h1>

          <p>Hãy thêm bánh vào giỏ hàng trước khi thanh toán.</p>

          <Link to="/cakes">Xem danh sách bánh</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pd-checkout-page">
      <header className="pd-checkout-heading">
        <p>Petite Douceur</p>

        <h1>Thông tin đặt hàng</h1>

        <span>Điền thông tin người nhận và hoàn tất chuyển khoản.</span>
      </header>

      <form className="pd-checkout-layout" onSubmit={handleSubmit} noValidate>
        <section className="pd-checkout-form">
          {submitError && (
            <div className="pd-checkout-error">{submitError}</div>
          )}

          <div className="pd-checkout-orderer">
            <span>Tài khoản đặt bánh</span>

            <strong>{user?.fullName || user?.name || "Khách hàng"}</strong>

            <p>{user?.email || ""}</p>
          </div>

          <div className="pd-checkout-section-heading">
            <span>1</span>

            <div>
              <h2>Thông tin người nhận</h2>

              <p>Có thể nhập thông tin của bạn hoặc người được tặng.</p>
            </div>
          </div>

          <div className="pd-checkout-fields">
            <div className="pd-checkout-field">
              <label htmlFor="recipientName">
                Tên người nhận
                <strong>*</strong>
              </label>

              <input
                id="recipientName"
                name="recipientName"
                type="text"
                value={formData.recipientName}
                placeholder="Nhập tên người nhận"
                onChange={handleChange}
              />

              {errors.recipientName && <small>{errors.recipientName}</small>}
            </div>

            <div className="pd-checkout-field">
              <label htmlFor="recipientPhone">
                Số điện thoại
                <strong>*</strong>
              </label>

              <input
                id="recipientPhone"
                name="recipientPhone"
                type="tel"
                value={formData.recipientPhone}
                placeholder="Ví dụ: 0912345678"
                onChange={handleChange}
              />

              {errors.recipientPhone && <small>{errors.recipientPhone}</small>}
            </div>

            <div className="pd-checkout-field pd-checkout-field--full">
              <label htmlFor="contactEmail">
                Email nhận xác nhận
                <strong>*</strong>
              </label>

              <input
                id="contactEmail"
                name="contactEmail"
                type="email"
                value={formData.contactEmail}
                placeholder="Nhập email nhận xác nhận"
                onChange={handleChange}
              />

              {errors.contactEmail && <small>{errors.contactEmail}</small>}
            </div>
          </div>

          <div className="pd-checkout-divider" />

          <div className="pd-checkout-section-heading">
            <span>2</span>

            <div>
              <h2>Hình thức nhận bánh</h2>

              <p>Chọn tự đến lấy hoặc giao bánh tận nơi.</p>
            </div>
          </div>

          <div className="pd-fulfillment-options">
            <label
              className={
                formData.fulfillmentMethod === "pickup"
                  ? "pd-fulfillment-card pd-fulfillment-card--active"
                  : "pd-fulfillment-card"
              }
            >
              <input
                type="radio"
                name="fulfillmentMethod"
                value="pickup"
                checked={formData.fulfillmentMethod === "pickup"}
                onChange={handleChange}
              />

              <span>⌂</span>

              <div>
                <strong>Tự đến lấy</strong>

                <p>Nhận tại cửa hàng, không mất phí.</p>
              </div>
            </label>

            <label
              className={
                formData.fulfillmentMethod === "delivery"
                  ? "pd-fulfillment-card pd-fulfillment-card--active"
                  : "pd-fulfillment-card"
              }
            >
              <input
                type="radio"
                name="fulfillmentMethod"
                value="delivery"
                checked={formData.fulfillmentMethod === "delivery"}
                onChange={handleChange}
              />

              <span>♡</span>

              <div>
                <strong>Giao tận nơi</strong>

                <p>Giao đến địa chỉ người nhận.</p>
              </div>
            </label>
          </div>

          {formData.fulfillmentMethod === "delivery" ? (
            <div className="pd-checkout-field pd-checkout-delivery-address">
              <label htmlFor="deliveryAddress">
                Địa chỉ giao bánh
                <strong>*</strong>
              </label>

              <textarea
                id="deliveryAddress"
                name="deliveryAddress"
                value={formData.deliveryAddress}
                placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                rows="3"
                onChange={handleChange}
              />

              {errors.deliveryAddress && (
                <small>{errors.deliveryAddress}</small>
              )}
            </div>
          ) : (
            <div className="pd-pickup-address">
              <strong>Địa điểm nhận bánh</strong>

              <p>{STORE_PICKUP_ADDRESS}</p>
            </div>
          )}

          <div className="pd-checkout-fields pd-checkout-schedule">
            <div className="pd-checkout-field">
              <label htmlFor="scheduledDate">
                Ngày nhận bánh
                <strong>*</strong>
              </label>

              <input
                id="scheduledDate"
                name="scheduledDate"
                type="date"
                min={getTodayString()}
                value={formData.scheduledDate}
                onChange={handleChange}
              />

              {errors.scheduledDate && <small>{errors.scheduledDate}</small>}
            </div>

            <div className="pd-checkout-field">
              <label htmlFor="scheduledTime">
                Khung giờ nhận bánh
                <strong>*</strong>
              </label>

              <select
                id="scheduledTime"
                name="scheduledTime"
                value={formData.scheduledTime}
                onChange={handleChange}
              >
                <option value="08:00 - 11:00">08:00 - 11:00</option>

                <option value="11:00 - 14:00">11:00 - 14:00</option>

                <option value="14:00 - 17:00">14:00 - 17:00</option>

                <option value="17:00 - 20:00">17:00 - 20:00</option>
              </select>
            </div>

            <div className="pd-checkout-field pd-checkout-field--full">
              <label htmlFor="note">Ghi chú đơn hàng</label>

              <textarea
                id="note"
                name="note"
                value={formData.note}
                placeholder="Lời nhắn trên bánh, lưu ý giao hàng..."
                rows="4"
                maxLength="500"
                onChange={handleChange}
              />

              <span>{formData.note.length}/500</span>
            </div>
          </div>

          <div className="pd-checkout-divider" />

          <div className="pd-checkout-section-heading">
            <span>3</span>

            <div>
              <h2>Thanh toán online</h2>

              <p>Thanh toán 100% trước khi cửa hàng xác nhận đơn.</p>
            </div>
          </div>

          <div className="pd-online-payment">
            <div className="pd-online-payment__qr">
              <img src={paymentQr} alt="Mã QR thanh toán Petite Douceur" />
            </div>

            <div className="pd-online-payment__info">
              <span>Số tiền cần chuyển</span>

              <strong>{formatCurrency(checkoutSummary.total)}</strong>

              <p>Nội dung chuyển khoản</p>

              <button type="button" onClick={handleCopyPaymentCode}>
                {paymentCode}
                {" · "}
                {copied ? "Đã sao chép" : "Sao chép"}
              </button>

              <small>
                Mỗi đơn có một mã riêng. Vui lòng chuyển đúng nội dung này.
              </small>
            </div>
          </div>

          <div className="pd-checkout-field pd-payment-reference">
            <label htmlFor="paymentReference">
              Mã tham chiếu giao dịch
              <strong>*</strong>
            </label>

            <input
              id="paymentReference"
              name="paymentReference"
              type="text"
              value={formData.paymentReference}
              placeholder="Nhập mã giao dịch từ ứng dụng ngân hàng"
              onChange={handleChange}
            />

            {errors.paymentReference && (
              <small>{errors.paymentReference}</small>
            )}
          </div>

          <label className="pd-payment-confirmation">
            <input
              type="checkbox"
              name="paymentConfirmed"
              checked={formData.paymentConfirmed}
              onChange={handleChange}
            />

            <span />

            <p>Tôi xác nhận đã chuyển khoản đủ số tiền.</p>
          </label>

          {errors.paymentConfirmed && (
            <small className="pd-payment-confirmation-error">
              {errors.paymentConfirmed}
            </small>
          )}
        </section>

        <aside className="pd-checkout-summary">
          <h2>Đơn hàng của bạn</h2>

          <div className="pd-checkout-products">
            {cartItems.map((item) => (
              <article key={item.itemKey}>
                <div className="pd-checkout-product__image">
                  <img src={item.image} alt={item.name} />

                  <span>{item.quantity}</span>
                </div>

                <div className="pd-checkout-product__info">
                  <strong>{item.name}</strong>

                  <span>{item.optionLabel}</span>
                </div>

                <b>{formatCurrency(item.price * item.quantity)}</b>
              </article>
            ))}
          </div>

          <div className="pd-checkout-summary__line">
            <span>Tạm tính</span>

            <strong>{formatCurrency(checkoutSummary.subtotal)}</strong>
          </div>

          <div className="pd-checkout-summary__line">
            <span>
              {formData.fulfillmentMethod === "pickup"
                ? "Phí tự đến lấy"
                : "Phí giao hàng"}
            </span>

            <strong>
              {checkoutSummary.shippingFee === 0
                ? "Miễn phí"
                : formatCurrency(checkoutSummary.shippingFee)}
            </strong>
          </div>

          <div className="pd-checkout-summary__total">
            <span>Tổng thanh toán</span>

            <strong>{formatCurrency(checkoutSummary.total)}</strong>
          </div>

          {submitError && (
            <div className="pd-checkout-error">{submitError}</div>
          )}

          <button type="submit" disabled={submitting}>
            {submitting ? "Đang tạo đơn hàng..." : "Xác nhận đặt hàng"}
          </button>

          <Link to="/cart">← Quay lại giỏ hàng</Link>

          <p className="pd-checkout-policy">
            Cửa hàng sẽ kiểm tra giao dịch trước khi xác nhận đơn.
          </p>
        </aside>
      </form>
    </div>
  );
}

export default Checkout;
