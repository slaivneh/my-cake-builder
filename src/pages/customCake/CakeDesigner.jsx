import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import CakeOptions from '../../components/customCake/CakeOptions';
import CustomizationSummary from '../../components/customCake/CustomizationSummary';
import PriceSummary from '../../components/customCake/PriceSummary';
import CakeGallery from '../../components/customCake/CakeGallery';
import cartService from '../../services/cartService';
import '../../components/customCake/CustomCake.css';

const CakeDesigner = () => {
  const { currentUser } = useContext(AuthContext);

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
    deliveryDate: '',
    deliveryTime: '10:00-12:00',
  });

  const handleAddToCart = async () => {
    // Lấy userId từ AuthContext, nếu chưa có (do Thành viên 3 chưa làm xong) thì dùng tạm ID 4
    const userId = currentUser?.id || 4; 

    // Nếu sau này bắt buộc đăng nhập mới cho mua, mở comment đoạn dưới ra:
    // if (!userId) {
    //   alert('Vui lòng đăng nhập để thêm bánh vào giỏ hàng.');
    //   return;
    // }

    try {
      const cartItem = {
        userId: userId,
        type: 'custom',
        customConfig: {
          sizeId: selections.size,
          layerId: selections.layer,
          baseId: selections.sponge,
          fillingId: selections.filling,
          creamId: selections.cream,
          colorId: selections.color,
          toppingIds: selections.toppings,
          message: selections.text,
          referenceImage: selections.referenceImage,
        },
        quantity: 1,
        // Calculate price can be done via priceCalculator if needed, or left to Cart
        note: `Giao lúc: ${selections.deliveryTime}, ngày ${selections.deliveryDate}`
      };

      await cartService.addItem(cartItem);
      
      alert('Đã thêm vào giỏ hàng thành công!');
    } catch (error) {
      console.error(error);
      alert('Có lỗi xảy ra khi thêm vào giỏ hàng.');
    }
  };

  return (
    <div className="cake-designer-page">
      <div className="designer-header">
        <h1>Petite Douceur</h1>
        <p>Bạn vẽ ý tưởng – Tiệm thêm yêu thương. 💕</p>
      </div>

      <div className="designer-content">
        <div className="left-panel">
          <CustomizationSummary selections={selections} />
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
