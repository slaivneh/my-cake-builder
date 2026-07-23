import { Link, useNavigate } from "react-router-dom";

import { getCakeImage } from "../../utils/cakeImage";

import "../../assets/styles/cake-card.css";

const FALLBACK_IMAGE =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(`
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="600"
      height="500"
      viewBox="0 0 600 500"
    >
      <rect
        width="600"
        height="500"
        fill="#fff3f6"
      />

      <circle
        cx="300"
        cy="205"
        r="95"
        fill="#f7bfd0"
      />

      <rect
        x="205"
        y="205"
        width="190"
        height="100"
        rx="22"
        fill="#ef91ad"
      />

      <text
        x="300"
        y="395"
        text-anchor="middle"
        font-family="Arial, sans-serif"
        font-size="30"
        fill="#9c6674"
      >
        Petite Douceur
      </text>
    </svg>
  `);

const getMinimumPrice = (cake) => {
  if (cake?.price !== undefined && cake?.price !== null) {
    const price = Number(cake.price);

    if (!Number.isNaN(price)) {
      return price;
    }
  }

  const collections = [cake?.priceOptions, cake?.sizePrices, cake?.prices];

  for (const collection of collections) {
    if (!Array.isArray(collection) || collection.length === 0) {
      continue;
    }

    const prices = collection
      .map((item) => {
        return Number(item?.price ?? item?.value ?? item?.amount);
      })
      .filter((price) => {
        return !Number.isNaN(price) && price >= 0;
      });

    if (prices.length > 0) {
      return Math.min(...prices);
    }
  }

  return null;
};

const formatCurrency = (value) => {
  return Number(value || 0).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};

function CakeCard({ cake, showBestSellerBadge = false }) {
  const navigate = useNavigate();

  if (!cake) {
    return null;
  }

  const minimumPrice = getMinimumPrice(cake);

  const resolvedImage = getCakeImage(cake.image);

  const displayImage = resolvedImage || FALLBACK_IMAGE;

  const hasCakeId = cake.id !== undefined && cake.id !== null && cake.id !== "";

  const detailPath = hasCakeId
    ? `/cakes/${encodeURIComponent(cake.id)}`
    : "/cakes";

  const showBadge = showBestSellerBadge || cake.isBestSeller === true;

  const handleViewDetail = (event) => {
    /*
      Ngăn sự kiện chạy lên Link hoặc onClick
      của phần tử cha trong Home.jsx.
    */
    event.preventDefault();
    event.stopPropagation();

    if (!hasCakeId) {
      console.error("Bánh không có id:", cake);

      return;
    }

    navigate(detailPath);
  };

  return (
    <article className="pd-product-card">
      <Link
        to={detailPath}
        className="pd-product-card__image-wrapper"
        aria-label={`Xem ${cake.name || "bánh"}`}
        onClick={(event) => {
          /*
            Ngăn onClick của card cha điều hướng
            trở lại trang /cakes.
          */
          event.stopPropagation();
        }}
      >
        <img
          className="pd-product-card__image"
          src={displayImage}
          alt={cake.name || "Bánh Petite Douceur"}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.onerror = null;

            event.currentTarget.src = FALLBACK_IMAGE;
          }}
        />

        {showBadge && <span className="pd-product-card__badge">Bán chạy</span>}

        {cake.isAvailable === false && (
          <span className="pd-product-card__sold-out">Tạm hết</span>
        )}
      </Link>

      <div className="pd-product-card__content">
        <p className="pd-product-card__category">
          {cake.category || "Bánh ngọt"}
        </p>

        <h2 className="pd-product-card__name">
          <Link
            to={detailPath}
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            {cake.name || "Bánh Petite Douceur"}
          </Link>
        </h2>

        {cake.description && (
          <p className="pd-product-card__description">{cake.description}</p>
        )}

        <div className="pd-product-card__divider" />

        <div className="pd-product-card__footer">
          <div className="pd-product-card__price">
            {minimumPrice !== null ? (
              <>
                <span>Giá từ</span>

                <strong>{formatCurrency(minimumPrice)}</strong>
              </>
            ) : (
              <strong>Liên hệ</strong>
            )}
          </div>

          <button
            type="button"
            className="pd-product-card__button"
            onClick={handleViewDetail}
            disabled={!hasCakeId}
          >
            Xem chi tiết
          </button>
        </div>
      </div>
    </article>
  );
}

export default CakeCard;
