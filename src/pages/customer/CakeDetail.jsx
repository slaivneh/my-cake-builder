import { useEffect, useMemo, useState } from "react";

import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import CakeCard from "../../components/customer/CakeCard";

import useAuth from "../../hooks/useAuth";

import { getAllCakes, getCakeById } from "../../services/cakeService";

import { getCakeHomeImage, normalizeCakeText } from "../../utils/homeCakeData";

import { addItemToCart } from "../../utils/cartStorage";

import "../../assets/styles/cake.css";
import "../../assets/styles/cake-detail.css";

const formatCurrency = (value) => {
  return Number(value).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};

const createPriceOptions = (cake) => {
  if (Array.isArray(cake?.priceOptions) && cake.priceOptions.length > 0) {
    return cake.priceOptions.map((option, index) => ({
      id: String(option.id ?? index),

      label:
        option.label || option.size || option.name || `Lựa chọn ${index + 1}`,

      price: Number(option.price) || 0,
    }));
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

  const [allCakes, setAllCakes] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [selectedOptionId, setSelectedOptionId] = useState("");

  const [quantity, setQuantity] = useState(1);

  const [notice, setNotice] = useState(null);

  useEffect(() => {
    const fetchCakeDetail = async () => {
      try {
        setLoading(true);
        setError("");
        setNotice(null);

        const [cakeData, cakeListData] = await Promise.all([
          getCakeById(id),
          getAllCakes(),
        ]);

        setCake(cakeData);

        setAllCakes(Array.isArray(cakeListData) ? cakeListData : []);
      } catch (fetchError) {
        console.error("Lỗi tải chi tiết bánh:", fetchError);

        setError("Không tìm thấy thông tin bánh.");
      } finally {
        setLoading(false);
      }
    };

    fetchCakeDetail();
  }, [id]);

  const priceOptions = useMemo(() => createPriceOptions(cake), [cake]);

  useEffect(() => {
    if (priceOptions.length > 0) {
      setSelectedOptionId(priceOptions[0].id);
    }
  }, [priceOptions]);

  const selectedOption = useMemo(() => {
    return (
      priceOptions.find((option) => option.id === selectedOptionId) ||
      priceOptions[0]
    );
  }, [priceOptions, selectedOptionId]);

  const displayImage = useMemo(() => {
    if (!cake) {
      return "";
    }

    return getCakeHomeImage(cake) || cake.image || "";
  }, [cake]);

  const relatedCakes = useMemo(() => {
    if (!cake) {
      return [];
    }

    const currentCategory = normalizeCakeText(cake.category || "");

    return allCakes
      .filter((item) => {
        return (
          String(item.id) !== String(cake.id) &&
          normalizeCakeText(item.category || "") === currentCategory &&
          item.isAvailable !== false
        );
      })
      .slice(0, 4);
  }, [allCakes, cake]);

  const redirectToLogin = () => {
    navigate("/login", {
      state: {
        from: location.pathname + location.search,
      },
    });
  };

  const addCurrentCakeToCart = () => {
    /*
        Chưa đăng nhập:
        không thêm vào localStorage.
      */
    if (!user) {
      redirectToLogin();

      return false;
    }

    if (user.role !== "customer") {
      setNotice({
        type: "error",

        text: "Chỉ tài khoản khách hàng mới có thể mua bánh.",
      });

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
    const added = addCurrentCakeToCart();

    if (!added) {
      return;
    }

    setNotice({
      type: "success",

      text: "Đã thêm bánh vào giỏ hàng.",
    });

    window.setTimeout(() => {
      setNotice(null);
    }, 2500);
  };

  const handleBuyNow = () => {
    const added = addCurrentCakeToCart();

    if (added) {
      navigate("/cart");
    }
  };

  if (loading) {
    return (
      <div className="pd-cake-detail-page">
        <div className="pd-detail-loading">
          <div />
          <div />
        </div>
      </div>
    );
  }

  if (error || !cake) {
    return (
      <div className="pd-cake-detail-page">
        <div className="pd-cake-empty">
          <h2>Không tìm thấy sản phẩm</h2>

          <p>{error || "Sản phẩm không tồn tại."}</p>

          <Link to="/cakes">Quay lại danh sách bánh</Link>
        </div>
      </div>
    );
  }

  const isAvailable = cake.isAvailable !== false;

  const optionTitle =
    cake.pricingType === "quantity" ? "Chọn quy cách" : "Chọn kích thước";

  return (
    <div className="pd-cake-detail-page">
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
            <img src={displayImage} alt={cake.name || "Bánh Petite Douceur"} />

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
                  setQuantity((previous) => Math.max(1, previous - 1));
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
                  const value = Number(event.target.value);

                  setQuantity(Math.max(1, Math.min(20, value || 1)));
                }}
              />

              <button
                type="button"
                disabled={quantity >= 20}
                onClick={() => {
                  setQuantity((previous) => Math.min(20, previous + 1));
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

          {notice && (
            <div
              className={`pd-detail-message ${
                notice.type === "error" ? "pd-detail-message--error" : ""
              }`}
            >
              {notice.type === "success" ? "✓ " : ""}
              {notice.text}
            </div>
          )}

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

      {relatedCakes.length > 0 && (
        <section className="pd-related-section">
          <div className="pd-related-heading">
            <p>Có thể bạn cũng thích</p>

            <h2>Bánh cùng danh mục</h2>
          </div>

          <div className="pd-related-grid">
            {relatedCakes.map((relatedCake) => (
              <CakeCard key={relatedCake.id} cake={relatedCake} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default CakeDetail;
