import React from 'react';
import calculatePrice from '../../utils/priceCalculator';
import './CustomCake.css';

const PriceSummary = ({ selections, onAddToCart }) => {
  const totalPrice = calculatePrice(selections);
  const isCustomImage = selections.referenceImage && selections.referenceImage.startsWith('data:image/');

  return (
    <div className="price-summary-container">
      <h3>Tạm Tính</h3>

      <div className="price-row total-row" style={isCustomImage ? { flexDirection: 'column', alignItems: 'center', gap: '8px', borderTop: 'none', paddingTop: 0 } : {}}>
        {!isCustomImage ? (
          <>
            <span>Tổng cộng:</span>
            <span className="price-val">{totalPrice.toLocaleString()} ₫</span>
          </>
        ) : (
          <span style={{ fontSize: '0.85rem', fontWeight: '400', color: '#f06285', fontStyle: 'italic', textAlign: 'center', lineHeight: '1.4' }}>
            * Đừng lo nha~ Petite Douceur sẽ xem ảnh mẫu và báo giá chính xác cho bạn trong thời gian sớm nhất. 💌
          </span>
        )}
      </div>

      <button
        className="add-to-cart-btn"
        onClick={onAddToCart}
      >
        Thêm Vào Giỏ Hàng
      </button>
    </div>
  );
};

export default PriceSummary;
