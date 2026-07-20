import React, { useState, useContext } from 'react';
import AuthContext from '../../contexts/AuthContext';
import CakeOptions from '../../components/customCake/CakeOptions';
import CustomizationSummary from '../../components/customCake/CustomizationSummary';
import PriceSummary from '../../components/customCake/PriceSummary';
import CakeGallery from '../../components/customCake/CakeGallery';
import { readCart, writeCart } from "../../utils/cartStorage";
import calculatePrice from "../../utils/priceCalculator";
import '../../components/customCake/CustomCake.css';

const CakeDesigner = () => {
  const { user } = useContext(AuthContext);
  const currentUser = user;

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
    if (!selections.deliveryDate) {
      alert('Vui lòng chọn ngày nhận bánh (ít nhất sau 2 ngày)!');
      return;
    }

    try {
      const currentCart = readCart();
      const itemKey = `custom-${Date.now()}`;
      const price = calculatePrice(selections);

      const CUSTOM_CAKE_PLACEHOLDER = "data:image/svg+xml;charset=utf-8," + encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'><rect width='400' height='400' fill='#fff0f4'/><text x='50%' y='45%' font-family='sans-serif' font-size='60' text-anchor='middle' fill='#e95077'>🎨</text><text x='50%' y='60%' font-family='sans-serif' font-size='24' font-weight='bold' text-anchor='middle' fill='#e95077'>Thiết Kế Riêng</text></svg>");

      const cartItem = {
        itemKey,
        cakeId: 'custom',
        name: 'Bánh Thiết Kế Custom',
        category: 'Bánh thiết kế riêng',
        image: selections.referenceImage || CUSTOM_CAKE_PLACEHOLDER,
        optionId: 'custom',
        optionLabel: 'Thiết kế riêng',
        price: price,
        quantity: 1,
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
        deliveryDate: selections.deliveryDate,
        deliveryTime: selections.deliveryTime,
        note: `Giao lúc: ${selections.deliveryTime}, ngày ${selections.deliveryDate}`
      };

      const updatedCart = [...currentCart, cartItem];
      writeCart(updatedCart);

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
