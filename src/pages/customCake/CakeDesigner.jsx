import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../contexts/AuthContext';
import CakeOptions from '../../components/customCake/CakeOptions';
import CustomizationSummary from '../../components/customCake/CustomizationSummary';
import PriceSummary from '../../components/customCake/PriceSummary';
import CakeGallery from '../../components/customCake/CakeGallery';
import { readCart, writeCart } from "../../utils/cartStorage";
import calculatePrice from "../../utils/priceCalculator";
import { generateCakeSvgString } from "../../utils/generateCakeSvg";
import '../../components/customCake/CustomCake.css';

const CakeDesigner = () => {
  const { user } = useContext(AuthContext);
  const currentUser = user;
  const navigate = useNavigate();

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
      const currentCart = readCart();
      const itemKey = `custom-${Date.now()}`;
      const price = calculatePrice(selections);
      const cartItem = {
        itemKey,
        cakeId: 'custom',
        name: 'Bánh Thiết Kế Custom',
        category: 'Bánh thiết kế riêng',
        image: selections.referenceImage || CUSTOM_CAKE_SVG,
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
          message: selections.text,
          referenceImage: selections.referenceImage,
        },
        quantity: 1,
        // Calculate price can be done via priceCalculator if needed, or left to Cart
        note: `Giao lúc: ${selections.deliveryTime}, ngày ${selections.deliveryDate}`
      };

      await addCart(cartItem);

      alert('Đã thêm vào giỏ hàng thành công! Đang chuyển đến giỏ hàng...');
      navigate('/cart');
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
