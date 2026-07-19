import { useEffect, useMemo, useState } from "react";

import { Link } from "react-router-dom";

import CakeCard from "../../components/customer/CakeCard";

import { getAllCakes } from "../../services/cakeService";

import {
  CUSTOMIZE_BANNER_IMAGE,
  getBestSellerCakes,
  HOME_CATEGORIES,
  HOME_HERO_IMAGE,
} from "../../utils/homeCakeData";

function Home() {
  const [cakes, setCakes] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCakes = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAllCakes();

        setCakes(Array.isArray(data) ? data : []);
      } catch (fetchError) {
        console.error("Lỗi tải danh sách bánh:", fetchError);

        setError("Không thể tải danh sách bánh. Hãy kiểm tra JSON Server.");
      } finally {
        setLoading(false);
      }
    };

    fetchCakes();
  }, []);

  const bestSellerCakes = useMemo(() => {
    return getBestSellerCakes(cakes);
  }, [cakes]);

  return (
    <div className="pd-home">
      {/* ================= HERO ================= */}

      <section className="pd-home-hero">
        <img
          className="pd-home-hero__image"
          src={HOME_HERO_IMAGE}
          alt=""
          aria-hidden="true"
        />

        <div className="pd-home-hero__overlay" />

        <Link
          to="/cakes"
          className="pd-home-hero__image-link"
          aria-label="Xem danh sách bánh"
        />

        <div className="pd-home-hero__content">
          <h1>
            <span>Ngọt ngào</span>

            <span> mỗi khoảnh khắc</span>
          </h1>

          <p className="pd-home-hero__description">
            Những chiếc bánh được làm bằng cả trái tim, dành tặng cho những điều
            đáng yêu nhất.
          </p>

          <Link to="/cakes" className="pd-button pd-button--primary">
            Khám phá ngay
          </Link>
        </div>
      </section>

      {/* ================= CATEGORY ================= */}

      <section className="pd-home-section">
        <div className="pd-section-title">
          <span />

          <h2>Danh mục bánh</h2>

          <span />
        </div>

        <div className="pd-category-grid">
          {HOME_CATEGORIES.map((category) => (
            <Link
              key={category.label}
              to={`/cakes?category=${encodeURIComponent(category.label)}`}
              className="pd-category-card"
            >
              <span className="pd-category-card__image">
                <img src={category.image} alt={category.label} />
              </span>

              <strong>{category.label}</strong>

              <span className="pd-category-card__link">Khám phá →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= BEST SELLER ================= */}

      <section className="pd-home-section">
        <div className="pd-section-title">
          <span />

          <h2>Bánh bán chạy</h2>

          <span />
        </div>

        {loading && (
          <div className="pd-home-loading">
            <span />
            <span />
            <span />
            <span />
          </div>
        )}

        {!loading && error && (
          <div className="pd-home-message pd-home-message--error">
            <h3>Không tải được danh sách bánh</h3>

            <p>{error}</p>
          </div>
        )}

        {!loading && !error && bestSellerCakes.length > 0 && (
          <div className="pd-cake-grid">
            {bestSellerCakes.map((cake) => (
              <CakeCard key={cake.id} cake={cake} showBestSellerBadge />
            ))}
          </div>
        )}
      </section>

      {/* ================= CUSTOM CAKE ================= */}

      <section className="pd-custom-section">
        <Link to="/custom-cake" className="pd-custom-banner">
          <img
            className="pd-custom-banner__image"
            src={CUSTOMIZE_BANNER_IMAGE}
            alt="Thiết kế bánh theo yêu cầu"
          />

          <div className="pd-custom-banner__overlay" />

          <div className="pd-custom-banner__content">
            <p className="pd-home-eyebrow">Một chiếc bánh dành riêng cho bạn</p>

            <h2>
              Tự tay tạo nên
              <br />
              chiếc bánh của bạn
            </h2>

            <p>Chọn kích thước, hương vị, màu sắc và lời nhắn theo sở thích.</p>

            <span className="pd-button pd-button--primary">
              Đặt bánh custom →
            </span>
          </div>
        </Link>
      </section>

      {/* ================= WHY CHOOSE ================= */}

      <section className="pd-why-section">
        <div className="pd-section-title">
          <span />

          <h2>Vì sao chọn Petite Douceur?</h2>

          <span />
        </div>

        <div className="pd-why-grid">
          <article className="pd-why-item">
            <div className="pd-why-item__icon">♡</div>

            <h3>Nguyên liệu tươi ngon</h3>

            <p>Nguyên liệu được chọn lọc và bánh được làm mới mỗi ngày.</p>
          </article>

          <article className="pd-why-item">
            <div className="pd-why-item__icon">🎀</div>

            <h3>Làm bằng cả trái tim</h3>

            <p>Chăm chút tỉ mỉ trong từng chi tiết của chiếc bánh.</p>
          </article>

          <article className="pd-why-item">
            <div className="pd-why-item__icon">🚚</div>

            <h3>Miễn phí giao hàng</h3>

            <p>Miễn phí vận chuyển cho đơn hàng từ 300.000đ.</p>
          </article>

          <article className="pd-why-item">
            <div className="pd-why-item__icon">✓</div>

            <h3>An toàn và đảm bảo</h3>

            <p>Quy trình sạch sẽ, thông tin nguyên liệu rõ ràng.</p>
          </article>
        </div>
      </section>
    </div>
  );
}

export default Home;
