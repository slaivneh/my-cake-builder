import React, { useRef } from 'react';
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

const CakeOptions = ({ selections, onChange }) => {
  const fileInputRef = useRef(null);
  const hasReference = !!selections.referenceImage;

  // Calculate minimum delivery date (2 days from now)
  const today = new Date();
  today.setDate(today.getDate() + 2);
  const minDate = today.toISOString().split('T')[0];

  const handleChange = (field, value) => {
    onChange({ ...selections, [field]: value });
  };

  const handleToppingToggle = (toppingId) => {
    const currentToppings = selections.toppings || [];
    if (currentToppings.includes(toppingId)) {
      handleChange('toppings', currentToppings.filter(t => t !== toppingId));
    } else {
      handleChange('toppings', [...currentToppings, toppingId]);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      handleChange('referenceImage', reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    handleChange('referenceImage', null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="cake-options-container">
      <h2 className="options-title">Thiết Kế Bánh</h2>

      {/* Size Selection */}
      <div className="option-group">
        <label>Kích thước</label>
        <div className="radio-group">
          {CAKE_SIZES.map(size => (
            <button
              key={size.id}
              className={`option-btn ${selections.size === size.id ? 'active' : ''}`}
              onClick={() => handleChange('size', size.id)}
            >
              {size.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conditional rendering for detailed options */}
      {!hasReference && (
        <>
          {/* Layers Selection */}
          <div className="option-group">
            <label>Số tầng</label>
            <div className="radio-group">
              {CAKE_LAYERS.map(layer => (
                <button
                  key={layer.id}
                  className={`option-btn ${selections.layer === layer.id ? 'active' : ''}`}
                  onClick={() => handleChange('layer', layer.id)}
                >
                  {layer.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sponge Selection */}
          <div className="option-group">
            <label>Cốt bánh</label>
            <select
              className="select-input"
              value={selections.sponge}
              onChange={(e) => handleChange('sponge', e.target.value)}
            >
              {CAKE_SPONGES.map(sponge => (
                <option key={sponge.id} value={sponge.id}>{sponge.label}</option>
              ))}
            </select>
          </div>

          {/* Filling Selection */}
          <div className="option-group">
            <label>Nhân bánh</label>
            <select
              className="select-input"
              value={selections.filling}
              onChange={(e) => handleChange('filling', e.target.value)}
            >
              {CAKE_FILLINGS.map(filling => (
                <option key={filling.id} value={filling.id}>{filling.label}</option>
              ))}
            </select>
          </div>

          {/* Cream Selection */}
          <div className="option-group">
            <label>Loại kem</label>
            <select
              className="select-input"
              value={selections.cream}
              onChange={(e) => handleChange('cream', e.target.value)}
            >
              {CAKE_CREAMS.map(cream => (
                <option key={cream.id} value={cream.id}>{cream.label}</option>
              ))}
            </select>
          </div>

          {/* Color Selection */}
          <div className="option-group">
            <label>Màu sắc chủ đạo</label>
            <div className="color-picker-group">
              {CAKE_COLORS.map(color => (
                <button
                  key={color.id}
                  className={`color-btn ${selections.color === color.value ? 'active' : ''}`}
                  style={{ backgroundColor: color.value }}
                  title={color.label}
                  onClick={() => handleChange('color', color.value)}
                />
              ))}
            </div>
          </div>

          {/* Toppings Selection */}
          <div className="option-group">
            <label>Trang trí thêm (Toppings)</label>
            <div className="checkbox-group">
              {CAKE_TOPPINGS.map(topping => (
                <label key={topping.id} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={(selections.toppings || []).includes(topping.id)}
                    onChange={() => handleToppingToggle(topping.id)}
                  />
                  {topping.label} (+{topping.price.toLocaleString()}đ)
                </label>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Custom Text */}
      <div className="option-group">
        <label>Nội dung ghi trên bánh (Tùy chọn)</label>
        <input
          type="text"
          className="text-input"
          placeholder="Ví dụ: Happy Birthday..."
          value={selections.text || ''}
          onChange={(e) => handleChange('text', e.target.value)}
          maxLength={30}
        />
      </div>

      {/* Reference Image Upload */}
      <div className="option-group">
        <label>📸 Ảnh mẫu tham khảo (Tùy chọn)</label>
        <p className="upload-hint">Gửi ảnh mẫu bánh bạn mong muốn, Petite Douceur sẽ tham khảo và làm theo nhé!</p>
        <div className="upload-area" onClick={() => fileInputRef.current?.click()}>
          {selections.referenceImage ? (
            <div className="uploaded-preview">
              <img src={selections.referenceImage} alt="Ảnh mẫu" className="uploaded-img" />
              <button
                className="remove-img-btn"
                onClick={(e) => { e.stopPropagation(); handleRemoveImage(); }}
              >
                ✕ Xóa ảnh
              </button>
            </div>
          ) : (
            <div className="upload-placeholder">
              <span className="upload-icon">🖼️</span>
              <span>Nhấn để chọn ảnh từ máy tính</span>
              <span className="upload-hint-small">Hỗ trợ: JPG, PNG, WEBP</span>
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleImageUpload}
        />
      </div>

      {/* Delivery Info */}
      <div className="option-group">
        <label>📅 Thời gian nhận bánh</label>
        <div className="radio-group" style={{ display: 'flex' }}>
          <input
            type="date"
            className="text-input"
            value={selections.deliveryDate || ''}
            min={minDate}
            onChange={(e) => handleChange('deliveryDate', e.target.value)}
            style={{ flex: 1 }}
          />
          <select
            className="select-input"
            value={selections.deliveryTime || '10:00-12:00'}
            onChange={(e) => handleChange('deliveryTime', e.target.value)}
            style={{ flex: 1 }}
          >
            <option value="08:00-10:00">08:00 - 10:00</option>
            <option value="10:00-12:00">10:00 - 12:00</option>
            <option value="13:00-15:00">13:00 - 15:00</option>
            <option value="15:00-17:00">15:00 - 17:00</option>
            <option value="17:00-19:00">17:00 - 19:00</option>
            <option value="19:00-21:00">19:00 - 21:00</option>
          </select>
        </div>
        <p className="upload-hint" style={{ marginTop: '4px' }}>
          🌸 Quý khách vui lòng chọn ngày nhận bánh sau ít nhất 2 ngày kể từ hôm nay để Petite Douceur có đủ thời gian chuẩn bị chiếc bánh thật xinh và chu đáo nhé! 🍰
        </p>
      </div>
    </div>
  );
};

export default CakeOptions;
