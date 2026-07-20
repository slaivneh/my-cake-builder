import { Link } from "react-router-dom";

import { getCakeHomeImage } from "../../utils/homeCakeData";

const getMinimumPrice = (cake) => {
  if (cake.price !== undefined && cake.price !== null) {
    const price = Number(cake.price);

    if (!Number.isNaN(price)) {
      return price;
    }
  }

  const priceCollections = [cake.priceOptions, cake.sizePrices, cake.prices];

  for (const collection of priceCollections) {
    if (Array.isArray(collection) && collection.length > 0) {
      const prices = collection
        .map((item) => Number(item.price ?? item.value ?? item.amount))
        .filter((price) => !Number.isNaN(price));

      if (prices.length > 0) {
        return Math.min(...prices);
      }
    }
  }

  return null;
};

const formatCurrency = (value) => {
  return Number(value).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};

function CakeCard({ cake, showBestSellerBadge = false }) {
  const price = getMinimumPrice(cake);

  const image = getCakeHomeImage(cake);

  return (
    <article className="pd-cake-card">
      <Link to={`/cakes/${cake.id}`} className="pd-cake-card__image-link">
        <img
          className="pd-cake-card__image"
          src={image}
          alt={cake.name || "Bánh Petite Douceur"}
        />

        {showBestSellerBadge && (
          <span className="pd-cake-card__badge">Bán chạy</span>
        )}

        {cake.isAvailable === false && (
          <span className="pd-cake-card__sold-out">Tạm hết</span>
        )}
      </Link>

      <div className="pd-cake-card__content">
        <p className="pd-cake-card__category">{cake.category || "Bánh ngọt"}</p>

        <h3 className="pd-cake-card__name">
          <Link to={`/cakes/${cake.id}`}>
            {cake.name || "Bánh Petite Douceur"}
          </Link>
        </h3>

        {cake.description && (
          <p className="pd-cake-card__description">{cake.description}</p>
        )}

        <div className="pd-cake-card__footer">
          <div className="pd-cake-card__price">
            {price !== null ? (
              <>
                <span>Từ</span>

                <strong>{formatCurrency(price)}</strong>
              </>
            ) : (
              <strong>Liên hệ</strong>
            )}
          </div>

          <Link to={`/cakes/${cake.id}`} className="pd-cake-card__view">
            Xem bánh
          </Link>
        </div>
      </div>
    </article>
  );
}

export default CakeCard;
