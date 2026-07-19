import React, { useState } from 'react';
import './CakeGallery.css';

// Mẫu bánh cửa hàng — dùng Unsplash vì ảnh local chưa có
const SAMPLE_CAKES = [
  {
    id: 1,
    name: 'Bánh Dâu Tươi',
    category: 'Kem tươi',
    imageUrl: 'https://i.pinimg.com/1200x/59/6a/36/596a36440d0e3bb3cb5f0994aedfd70c.jpg',
  },
  {
    id: 2,
    name: 'Bánh Socola Đen',
    category: 'Socola',
    imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop',
  },
  {
    id: 3,
    name: 'Bánh Matcha Nhật',
    category: 'Matcha',
    imageUrl: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&h=400&fit=crop',
  },
  {
    id: 4,
    name: 'Bánh Vanilla Pastel',
    category: 'Vanilla',
    imageUrl: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=400&h=400&fit=crop',
  },
  {
    id: 5,
    name: 'Bánh Sinh Nhật Tím',
    category: 'Cream cheese',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
  },
  {
    id: 6,
    name: 'Bánh Trái Cây Nhiều Tầng',
    category: 'Fresh fruit',
    imageUrl: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=400&h=400&fit=crop',
  },
  {
    id: 7,
    name: 'Bánh Fondant Cưới',
    category: 'Fondant',
    imageUrl: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=400&h=400&fit=crop',
  },
  {
    id: 8,
    name: 'Bánh Macaron Pastel',
    category: 'Macaron',
    imageUrl: 'https://images.unsplash.com/photo-1519869325930-281384150729?w=400&h=400&fit=crop',
  },
  {
    id: 9,
    name: 'Bánh Carrot Cinnamon',
    category: 'Đặc biệt',
    imageUrl: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400&h=400&fit=crop',
  },
  {
    id: 10,
    name: 'Bánh Hoa Anh Đào',
    category: 'Kem tươi',
    imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=400&fit=crop',
  },
];

const CakeGallery = ({ selectedImageUrl, onSelect }) => {
  const [filter, setFilter] = useState('Tất cả');
  const categories = ['Tất cả', ...new Set(SAMPLE_CAKES.map(c => c.category))];

  const filtered = filter === 'Tất cả'
    ? SAMPLE_CAKES
    : SAMPLE_CAKES.filter(c => c.category === filter);

  return (
    <div className="cake-gallery-section">
      <div className="gallery-header">
        <div className="gallery-title-block">
          <h2 className="gallery-title">✨ Chọn mẫu bánh để tham khảo</h2>
          <p className="gallery-subtitle">Click vào mẫu bạn thích — tiệm sẽ custom theo phong cách đó cho bạn!</p>
        </div>
        {/* Category filter */}
        <div className="gallery-filters">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="gallery-grid">
        {filtered.map(cake => {
          const isSelected = selectedImageUrl === cake.imageUrl;
          return (
            <div
              key={cake.id}
              className={`gallery-item ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelect(isSelected ? null : cake.imageUrl)}
              title={isSelected ? 'Bỏ chọn' : `Chọn mẫu: ${cake.name}`}
            >
              <div className="gallery-img-wrapper">
                <img src={cake.imageUrl} alt={cake.name} className="gallery-img" loading="lazy" />
                {isSelected && (
                  <div className="gallery-check">✓</div>
                )}
                <div className="gallery-overlay">
                  <span>{isSelected ? 'Đang chọn — Click để bỏ' : 'Chọn mẫu này'}</span>
                </div>
              </div>
              <div className="gallery-info">
                <div className="gallery-name">{cake.name}</div>
                <div className="gallery-category">{cake.category}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CakeGallery;
