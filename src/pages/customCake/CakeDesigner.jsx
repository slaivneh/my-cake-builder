import React, { useState } from 'react';
import CakeOptions from '../../components/customCake/CakeOptions';
import CakePreview from '../../components/customCake/CakePreview';
import PriceSummary from '../../components/customCake/PriceSummary';
import CakeGallery from '../../components/customCake/CakeGallery';
import orderService from '../../services/orderService';
import '../../components/customCake/CustomCake.css';

const CakeDesigner = () => {
  const [selections, setSelections] = useState({
    size: 'small',
    layer: 1,
    sponge: 'vanilla',
    filling: 'none',
    cream: 'buttercream',
    color: '#f8f9fa',
    toppings: [],
    text: '',
    referenceImage: null,
  });

  const handleAddToCart = async () => {
    try {
      const order = await orderService.create({
        items: [{
          type: 'custom',
          details: selections
        }]
      });
      alert(`Đã thêm vào giỏ hàng thành công! Mã đơn: ${order.id}`);
    } catch (error) {
      console.error(error);
      alert('Có lỗi xảy ra khi thêm vào giỏ hàng.');
    }
  };

  return (
    <div className="cake-designer-page">
      <div className="designer-header">
        <h1>Xưởng Thiết Kế Bánh Custom</h1>
        <p>Tạo chiếc bánh độc nhất vô nhị của riêng bạn!</p>
      </div>
      
      <div className="designer-content">
        <div className="left-panel">
          <CakePreview selections={selections} />
          <PriceSummary selections={selections} onAddToCart={handleAddToCart} />
        </div>
        
        <div className="right-panel">
          <CakeOptions selections={selections} onChange={setSelections} />
        </div>
      </div>

      {/* Gallery mẫu bánh cửa hàng */}
      <CakeGallery
        selectedImageUrl={selections.referenceImage}
        onSelect={(url) => setSelections(prev => ({ ...prev, referenceImage: url }))}
      />
    </div>
  );
};

export default CakeDesigner;
