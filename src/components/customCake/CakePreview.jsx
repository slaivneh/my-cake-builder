import React from 'react';
import './CustomCake.css';
import { CAKE_TOPPINGS } from '../../utils/constants';

const CakePreview = ({ selections }) => {
  const {
    color = '#f8f9fa',
    layer = 1,
    text = '',
    size = 'small',
    toppings = [],
    referenceImage = null
  } = selections;

  let scale = 1;
  if (size === 'medium') scale = 1.15;
  if (size === 'large') scale = 1.3;

  const layerHeight = 60;
  const topLayerWidth = 240 - ((layer - 1) * 40);
  const topY = 300 - layer * layerHeight;
  const rimRx = topLayerWidth / 2;
  const rimRy = topLayerWidth / 6;

  const selectedToppingLabels = CAKE_TOPPINGS
    .filter(t => toppings.includes(t.id))
    .map(t => t.label);

  return (
    <div className="cake-preview-container">
      <div className="preview-background">
        <svg viewBox="0 0 400 400" width="100%" height="100%">
          <defs>
            <linearGradient id="shadowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
              <stop offset="25%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="75%" stopColor="#000000" stopOpacity="0" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
            </linearGradient>
            <linearGradient id="baseShadow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </linearGradient>
          </defs>

          <g style={{
            transform: `scale(${scale})`,
            transformOrigin: '200px 340px',
            transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}>
            {/* Base plate */}
            <ellipse cx="200" cy="340" rx="160" ry="40" fill="#e0e0e0" />
            <ellipse cx="200" cy="335" rx="150" ry="35" fill="#fdfdfd" />
            <ellipse cx="200" cy="335" rx="130" ry="30" fill="url(#baseShadow)" />

            {/* Cake Layers - bottom to top */}
            {[...Array(layer)].map((_, i) => {
              const w = 240 - i * 40;
              const yPos = 300 - i * layerHeight;
              return (
                <g key={`layer-${i}`}>
                  <rect x={200 - w / 2} y={yPos - layerHeight} width={w} height={layerHeight} fill={color} />
                  <path d={`M ${200 - w / 2} ${yPos} A ${w / 2} ${w / 6} 0 0 0 ${200 + w / 2} ${yPos}`} fill={color} />
                  <rect x={200 - w / 2} y={yPos - layerHeight} width={w} height={layerHeight} fill="url(#shadowGradient)" />
                  <path d={`M ${200 - w / 2} ${yPos} A ${w / 2} ${w / 6} 0 0 0 ${200 + w / 2} ${yPos}`} fill="url(#shadowGradient)" />
                  <ellipse cx="200" cy={yPos - layerHeight} rx={w / 2} ry={w / 6} fill={color} />
                  <ellipse cx="200" cy={yPos - layerHeight} rx={w / 2} ry={w / 6} fill="#ffffff" opacity="0.15" />
                </g>
              );
            })}

            {/* Cake text */}
            {text && layer > 0 && (
              <text
                x="200"
                y={topY + 8}
                textAnchor="middle"
                fill="#555"
                fontSize="14"
                fontFamily="Inter, sans-serif"
                fontWeight="bold"
              >
                {text}
              </text>
            )}
          </g>
        </svg>
      </div>

      <div className="preview-label">Xem Trước Trực Tiếp</div>

      {/* Topping note */}
      {selectedToppingLabels.length > 0 && (
        <div className="topping-note">
          <span className="topping-note-icon">🎂</span>
          <div className="topping-note-content">
            <div className="topping-note-title">Trang trí thêm:</div>
            <div className="topping-note-tags">
              {selectedToppingLabels.map((label, i) => (
                <span key={i} className="topping-tag">{label}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reference image */}
      {referenceImage && (
        <div className="reference-image-section">
          <div className="reference-label">📸 Ảnh mẫu bạn muốn</div>
          <img src={referenceImage} alt="Mẫu tham khảo" className="reference-img" />
        </div>
      )}
    </div>
  );
};

export default CakePreview;
