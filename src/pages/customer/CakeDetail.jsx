import { useEffect, useMemo, useState } from "react";

import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

import { getCakeById } from "../../services/cakeService";

import { getCakeImage } from "../../utils/cakeImage";

import { addItemToCart } from "../../utils/cartStorage";

import "../../assets/styles/cake-detail.css";

const FALLBACK_IMAGE =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(`
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="900"
      height="900"
      viewBox="0 0 900 900"
    >
      <rect
        width="900"
        height="900"
        fill="#fff3f6"
      />

      <circle
        cx="450"
        cy="355"
        r="170"
        fill="#f7bfd0"
      />

      <rect
        x="280"
        y="355"
        width="340"
        height="180"
        rx="38"
        fill="#ef91ad"
      />

      <text
        x="450"
        y="680"
        text-anchor="middle"
        font-family="Arial, sans-serif"
        font-size="50"
        fill="#9c6674"
      >
        Petite Douceur
      </text>
    </svg>
  `);

const formatCurrency = (value) => {
  return Number(value || 0).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};

const getPriceOptions = (cake) => {
  if (Array.isArray(cake?.priceOptions) && cake.priceOptions.length > 0) {
    return cake.priceOptions.map((option, index) => {
      return {
        id: String(option.id ?? index + 1),

        label:
          option.label || option.name || option.size || `Lựa chọn ${index + 1}`,

        price: Number(option.price) || 0,
      };
    });
  }

  return [
    {
      id: "default",

      label: cake?.size || "Mặc định",

      price: Number(cake?.price) || 0,
    },
  ];
};

function CakeDetail() {
  const { id } = useParams();

  const navigate = useNavigate();

  const location = useLocation();

  const { user } = useAuth();

  const [cake, setCake] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [selectedOptionId, setSelectedOptionId] = useState("");

  const [quantity, setQuantity] = useState(1);

  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchCake = async () => {
      try {
        setLoading(true);
        setError("");
        setMessage("");

        const result = await getCakeById(id);

        setCake(result);
      } catch (fetchError) {
        console.error("Không tải được chi tiết bánh:", fetchError);

        setError(fetchError.message || "Không tìm thấy sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    fetchCake();
  }, [id]);

  const priceOptions = useMemo(() => {
    return getPriceOptions(cake);
  }, [cake]);

  useEffect(() => {
    if (priceOptions.length > 0) {
      setSelectedOptionId(priceOptions[0].id);
    }
  }, [priceOptions]);

  const selectedOption = useMemo(() => {
    return (
      priceOptions.find((option) => {
        return option.id === selectedOptionId;
      }) || priceOptions[0]
    );
  }, [priceOptions, selectedOptionId]);

  const displayImage = useMemo(() => {
    if (!cake) {
      return FALLBACK_IMAGE;
    }

    return getCakeImage(cake.image) || FALLBACK_IMAGE;
  }, [cake]);

  const requireCustomerLogin = () => {
    if (!user) {
      navigate("/login", {
        state: {
          from: location.pathname + location.search,
        },
      });

      return false;
    }

    if (
      String(user.role || "")
        .trim()
        .toLowerCase() !== "customer"
    ) {
      setMessage("Chỉ tài khoản khách hàng mới có thể mua bánh.");

      return false;
    }

    return true;
  };

  const addCakeToCart = () => {
    if (!requireCustomerLogin()) {
      return false;
    }

    if (!cake || !selectedOption || cake.isAvailable === false) {
      return false;
    }

    addItemToCart({
      cake,

      selectedOption,

      quantity,

      image: displayImage,
    });

    return true;
  };

  const handleAddToCart = () => {
    const added = addCakeToCart();

    if (!added) {
      return;
    }

    setMessage("✓ Đã thêm bánh vào giỏ hàng.");
  };

  const handleBuyNow = () => {
    const added = addCakeToCart();

    if (added) {
      navigate("/cart");
    }
  };

  if (loading) {
    return (
      <main className="pd-cake-detail-page">
        <div className="pd-detail-loading">Đang tải thông tin bánh...</div>
      </main>
    );
  }

  if (error || !cake) {
    return (
      <main className="pd-cake-detail-page">
        <div className="pd-cake-empty">
          <h1>Không tìm thấy sản phẩm</h1>

          <p>{error || "Sản phẩm không tồn tại."}</p>

          <Link to="/cakes">Quay lại danh sách bánh</Link>
        </div>
      </main>
    );
  }

  const isAvailable = cake.isAvailable !== false;

  const optionTitle =
    cake.pricingType === "quantity" ? "Chọn quy cách" : "Chọn kích thước";

  return (
    <main className="pd-cake-detail-page">
      <nav className="pd-cake-breadcrumb">
        <Link to="/home">Trang chủ</Link>

        <span>/</span>

        <Link to="/cakes">Sản phẩm</Link>

        <span>/</span>

        <strong>{cake.name}</strong>
      </nav>

      <section className="pd-cake-detail pd-single-image-detail">
        <div className="pd-single-image-gallery">
          <div className="pd-single-image-gallery__image">
            <img
              src={displayImage}
              alt={cake.name || "Bánh Petite Douceur"}
              onError={(event) => {
                event.currentTarget.onerror = null;

                event.currentTarget.src = FALLBACK_IMAGE;
              }}
            />

            {!isAvailable && (
              <span className="pd-detail-sold-out">Tạm hết</span>
            )}
          </div>
        </div>

        <div className="pd-cake-info pd-single-image-info">
          <p className="pd-cake-info__category">
            {cake.category || "Bánh ngọt"}
          </p>

          <h1>{cake.name}</h1>

          <div className="pd-cake-info__price">
            {selectedOption ? formatCurrency(selectedOption.price) : "Liên hệ"}
          </div>

          <p className="pd-cake-info__description">
            {cake.description ||
              "Một chiếc bánh nhỏ xinh được làm từ những nguyên liệu chọn lọc."}
          </p>

          <div className="pd-cake-option-group">
            <h3>{optionTitle}</h3>

            <div className="pd-cake-option-list">
              {priceOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={
                    option.id === selectedOptionId
                      ? "pd-cake-option pd-cake-option--active"
                      : "pd-cake-option"
                  }
                  onClick={() => {
                    setSelectedOptionId(option.id);
                  }}
                >
                  <strong>{option.label}</strong>

                  <span>{formatCurrency(option.price)}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pd-cake-quantity-group">
            <h3>Số lượng đặt</h3>

            <div className="pd-cake-quantity">
              <button
                type="button"
                disabled={quantity <= 1}
                onClick={() => {
                  setQuantity((current) => Math.max(1, current - 1));
                }}
              >
                −
              </button>

              <input
                type="number"
                min="1"
                max="20"
                value={quantity}
                onChange={(event) => {
                  const nextQuantity = Number(event.target.value);

                  setQuantity(Math.max(1, Math.min(20, nextQuantity || 1)));
                }}
              />

              <button
                type="button"
                disabled={quantity >= 20}
                onClick={() => {
                  setQuantity((current) => Math.min(20, current + 1));
                }}
              >
                +
              </button>
            </div>
          </div>

          <div className="pd-cake-detail-actions">
            <button
              type="button"
              className="pd-detail-add-cart"
              disabled={!isAvailable}
              onClick={handleAddToCart}
            >
              Thêm vào giỏ hàng
            </button>

            <button
              type="button"
              className="pd-detail-buy-now"
              disabled={!isAvailable}
              onClick={handleBuyNow}
            >
              Mua ngay
            </button>
          </div>

          {message && <div className="pd-detail-message">{message}</div>}

          <div className="pd-single-product-notes">
            <div>
              <span>♡</span>

              <p>Bánh được làm mới trong ngày</p>
            </div>

            <div>
              <span>♡</span>

              <p>Đóng gói cẩn thận và xinh xắn</p>
            </div>

            <div>
              <span>♡</span>

              <p>Bảo quản trong ngăn mát tủ lạnh</p>
            </div>

            <div>
              <span>♡</span>

              <p>Miễn phí giao hàng từ 300.000đ</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default CakeDetail;
