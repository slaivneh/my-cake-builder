import React from 'react';
import {
  CAKE_SIZES,
  CAKE_LAYERS,
  CAKE_SPONGES,
  CAKE_FILLINGS,
  CAKE_CREAMS,
  CAKE_TOPPINGS,
  CAKE_COLORS
} from '../../utils/constants';
import './CustomCake.css';

const CustomizationSummary = ({ selections }) => {
  const getLabel = (array, id) => {
    const item = array.find(item => item.id === id);
    return item ? item.label : id;
  };

  const getColorLabel = (value) => {
    const item = CAKE_COLORS.find(item => item.value === value);
    return item ? item.label : value;
  };

  const isCustomImage = selections.referenceImage && selections.referenceImage.startsWith('data:image/');
  const hasReference = !!selections.referenceImage;

  return (
    <div className="customization-summary-container">
      {hasReference ? (
        <div className="reference-image-section">
          <span className="reference-label">Ảnh mẫu tham khảo</span>
          <img src={selections.referenceImage} alt="Reference" className="reference-img" />
          {isCustomImage && (
             <p className="summary-note-text">*Ảnh do khách hàng cung cấp</p>
          )}
        </div>
      ) : (
        <div className="empty-reference-section">
          <span className="empty-reference-icon">📸</span>
          <p>Bạn chưa chọn ảnh mẫu</p>
          <small>Vui lòng chọn từ thư viện bên dưới hoặc tải ảnh của bạn lên!</small>
        </div>
      )}

      <div className="summary-details">
        <h3 className="summary-title">Thông tin bánh</h3>
        <ul className="summary-list">
          <li><strong>Kích thước:</strong> {getLabel(CAKE_SIZES, selections.size)}</li>
          {!hasReference ? (
            <>
              <li><strong>Số tầng:</strong> {getLabel(CAKE_LAYERS, selections.layer)}</li>
              <li><strong>Cốt bánh:</strong> {getLabel(CAKE_SPONGES, selections.sponge)}</li>
              <li><strong>Nhân bánh:</strong> {getLabel(CAKE_FILLINGS, selections.filling)}</li>
              <li><strong>Loại kem:</strong> {getLabel(CAKE_CREAMS, selections.cream)}</li>
              <li className="summary-color-item">
                <strong>Màu chủ đạo:</strong> 
                <span className="summary-color-badge" style={{ backgroundColor: selections.color }}></span>
                {getColorLabel(selections.color)}
              </li>
              {selections.toppings && selections.toppings.length > 0 && (
                <li>
                  <strong>Toppings:</strong> 
                  {selections.toppings.map(t => getLabel(CAKE_TOPPINGS, t)).join(', ')}
                </li>
              )}
            </>
          ) : (
            <li>
              <strong>Chi tiết thiết kế:</strong> 
              <span style={{color: '#f06285', fontStyle: 'italic'}}>Thực hiện theo ảnh mẫu tham khảo của bạn.</span>
            </li>
          )}
          {selections.text && (
            <li><strong>Chữ trên bánh:</strong> "{selections.text}"</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default CustomizationSummary;
