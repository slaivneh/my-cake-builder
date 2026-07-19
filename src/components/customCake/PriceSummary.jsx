import React from 'react';
import calculatePrice from '../../utils/priceCalculator';
import './CustomCake.css';

const PriceSummary = ({ selections, onAddToCart }) => {
  const totalPrice = calculatePrice(selections);

  return (
    <div className="price-summary-container">
      <h3>Tạm Tính</h3>
      
      <div className="price-row total-row">
        <span>Tổng cộng:</span>
        <span className="price-val">{totalPrice.toLocaleString()} ₫</span>
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
