import { useEffect, useMemo, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import {
  CART_UPDATED_EVENT,
  getCartSummary,
  readCart,
  removeCartItem,
  updateCartQuantity,
} from "../../utils/cartStorage";

import "../../assets/styles/cart.css";

const formatCurrency = (value) => {
  return Number(value || 0).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};

function Cart() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState(() => readCart());

  useEffect(() => {
    const refreshCart = () => {
      setCartItems(readCart());
    };

    window.addEventListener(CART_UPDATED_EVENT, refreshCart);

    window.addEventListener("storage", refreshCart);

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, refreshCart);

      window.removeEventListener("storage", refreshCart);
    };
  }, []);

  const summary = useMemo(() => getCartSummary(cartItems), [cartItems]);

  const handleQuantityChange = (itemKey, quantity) => {
    const updatedCart = updateCartQuantity(itemKey, quantity);

    setCartItems(updatedCart);
  };

  const handleRemoveItem = (itemKey) => {
    const confirmed = window.confirm(
      "Bạn có chắc muốn xóa bánh này khỏi giỏ hàng?",
    );

    if (!confirmed) {
      return;
    }

    const updatedCart = removeCartItem(itemKey);

    setCartItems(updatedCart);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      return;
    }

    navigate("/checkout");
  };

  if (cartItems.length === 0) {
    return (
      <div className="pd-cart-page">
        <div className="pd-cart-empty">
          <div className="pd-cart-empty__icon">♡</div>

          <h1>Giỏ hàng đang trống</h1>

          <p>Hãy chọn những chiếc bánh nhỏ xinh mà bạn yêu thích.</p>

          <Link to="/cakes">Khám phá sản phẩm</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pd-cart-page">
      <header className="pd-cart-heading">
        <p>Petite Douceur</p>

        <h1>Giỏ hàng của bạn</h1>

        <span>{summary.totalQuantity} sản phẩm</span>
      </header>

      <div className="pd-cart-layout">
        <section className="pd-cart-items">
          <div className="pd-cart-items__header">
            <h2>Sản phẩm</h2>

            <Link to="/cakes">+ Thêm bánh khác</Link>
          </div>

          <div className="pd-cart-list">
            {cartItems.map((item) => (
              <article key={item.itemKey} className="pd-cart-item">
                <Link
                  to={`/cakes/${item.cakeId}`}
                  className="pd-cart-item__image"
                >
                  <img src={item.image} alt={item.name} />
                </Link>

                <div className="pd-cart-item__info">
                  <p>{item.category || "Bánh ngọt"}</p>

                  <h3>
                    <Link to={`/cakes/${item.cakeId}`}>{item.name}</Link>
                  </h3>

                  <span>
                    Quy cách: <strong>{item.optionLabel}</strong>
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      handleRemoveItem(item.itemKey);
                    }}
                  >
                    Xóa sản phẩm
                  </button>
                </div>

                <div className="pd-cart-item__quantity">
                  <button
                    type="button"
                    disabled={item.quantity <= 1}
                    onClick={() => {
                      handleQuantityChange(item.itemKey, item.quantity - 1);
                    }}
                  >
                    −
                  </button>

                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={item.quantity}
                    onChange={(event) => {
                      handleQuantityChange(
                        item.itemKey,
                        Number(event.target.value) || 1,
                      );
                    }}
                  />

                  <button
                    type="button"
                    disabled={item.quantity >= 99}
                    onClick={() => {
                      handleQuantityChange(item.itemKey, item.quantity + 1);
                    }}
                  >
                    +
                  </button>
                </div>

                <div className="pd-cart-item__price">
                  <span>{formatCurrency(item.price)}</span>

                  <strong>{formatCurrency(item.price * item.quantity)}</strong>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="pd-cart-summary">
          <h2>Tóm tắt giỏ hàng</h2>

          <div className="pd-cart-summary__line">
            <span>Tạm tính</span>

            <strong>{formatCurrency(summary.subtotal)}</strong>
          </div>

          <div className="pd-cart-summary__line">
            <span>Hình thức nhận bánh</span>

            <strong>Chọn ở bước sau</strong>
          </div>

          <div className="pd-cart-shipping-note">
            Phí giao hàng sẽ được tính sau khi bạn chọn{" "}
            <strong>Giao tận nơi</strong>. Tự đến lấy không mất phí.
          </div>

          <div className="pd-cart-summary__total">
            <span>Tổng tạm tính</span>

            <strong>{formatCurrency(summary.subtotal)}</strong>
          </div>

          <button type="button" onClick={handleCheckout}>
            Tiến hành đặt hàng
          </button>

          <Link to="/cakes">← Tiếp tục mua bánh</Link>

          <div className="pd-cart-summary__notes">
            <p>♡ Thanh toán chuyển khoản 100%</p>

            <p>♡ Bánh được đóng gói cẩn thận</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Cart;
