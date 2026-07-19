import React, { useState } from 'react';
import './CakeGallery.css';

// Mẫu bánh cửa hàng — dùng Unsplash vì ảnh local chưa có
const SAMPLE_CAKES = [
  { id: 1, name: 'Bánh Kem Dâu Tươi', category: 'Kem Tươi', price: 350000, imageUrl: 'https://i.pinimg.com/1200x/59/6a/36/596a36440d0e3bb3cb5f0994aedfd70c.jpg', desc: 'Cốt vani, nhân mứt dâu, kem tươi' },
  { id: 2, name: 'Bánh Kem Socola Chảy', category: 'Kem Socola', price: 400000, imageUrl: 'https://i.pinimg.com/1200x/12/07/fb/1207fb5c9e4c5a5149a8fb1f8ae69114.jpg', desc: 'Cốt socola, nhân socola chảy, kem bơ socola' },
  { id: 3, name: 'Bánh Kem Matcha Nhật', category: 'Kem Matcha', price: 380000, imageUrl: 'https://i.pinimg.com/736x/1e/93/2d/1e932dbab3528aa199e59cfc3d362ca8.jpg', desc: 'Cốt matcha, nhân đậu đỏ, kem matcha' },
  { id: 4, name: 'Bánh Kem Sữa Tươi Vanilla', category: 'Kem Tươi', price: 320000, imageUrl: 'https://i.pinimg.com/1200x/72/50/dc/7250dc81c1aeaf43050707693466ae22.jpg', desc: 'Cốt vani, không nhân, kem sữa tươi nguyên chất' },
  { id: 5, name: 'Bánh Kem Phô Mai Việt Quất', category: 'Kem Phô Mai', price: 450000, imageUrl: 'https://i.pinimg.com/1200x/5f/7b/8c/5f7b8c781ff49692026822730f2e1312.jpg', desc: 'Cốt vani, nhân mứt việt quất, kem phô mai creamcheese' },
  { id: 6, name: 'Bánh Kem Bơ Hoa Cổ Điển', category: 'Kem Bơ', price: 420000, imageUrl: 'https://i.pinimg.com/1200x/d4/b8/85/d4b885dd4ccd37e04cb938efa078f9b2.jpg', desc: 'Cốt vani sữa, nhân dâu tây, kem bơ Pháp' },
  { id: 7, name: 'Bánh Kem Tươi Trái Cây', category: 'Kem Trái Cây', price: 390000, imageUrl: 'https://i.pinimg.com/736x/d7/e2/da/d7e2da6a9811c8e56174f743ca5a30f1.jpg', desc: 'Cốt vani, nhân trái cây thập cẩm, kem tươi' },
  { id: 8, name: 'Bánh Kem Sữa Chua', category: 'Kem Tươi', price: 360000, imageUrl: 'https://i.pinimg.com/1200x/29/23/6a/29236ab5d3cd77337b90a1aa6564f331.jpg', desc: 'Cốt vani, nhân mứt dâu, kem sữa chua chua ngọt' },
  { id: 9, name: 'Bánh Kem Bắp', category: 'Kem Tươi', price: 340000, imageUrl: 'https://i.pinimg.com/1200x/56/ba/df/56badf6647b02f018b5372411e160130.jpg', desc: 'Cốt bông lan bắp, nhân bắp hạt, kem tươi' },
  { id: 10, name: 'Bánh Kem Hoa Anh Đào', category: 'Kem Bơ', price: 410000, imageUrl: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-mct7v6wbpxzw9a_tn', desc: 'Cốt vani, nhân đào, kem bơ Hàn Quốc' },
  { id: 11, name: 'Bánh Kem Red Velvet', category: 'Kem Phô Mai', price: 430000, imageUrl: 'https://i.pinimg.com/1200x/d7/52/c7/d752c7806fc741eb2ef9a2192f85c01d.jpg', desc: 'Cốt Red Velvet đỏ, nhân phô mai, kem phô mai' },
  { id: 12, name: 'Bánh Kem Tiramisu', category: 'Kem Phô Mai', price: 450000, imageUrl: 'https://i.pinimg.com/1200x/13/ac/0a/13ac0ada17777f4c85adc824a055e8c5.jpg', desc: 'Cốt cà phê, kem mascarpone, bột cacao' },
  { id: 13, name: 'Bánh Kem Sữa Dừa', category: 'Kem Tươi', price: 350000, imageUrl: 'https://i.pinimg.com/1200x/36/97/8e/36978e3d44fcddba41ace35d8b5f48e2.jpg', desc: 'Cốt lá dứa, nhân dừa sợi, kem cốt dừa' },
  { id: 14, name: 'Bánh Kem Trà Đen Macchiato', category: 'Kem Trà', price: 370000, imageUrl: 'https://i.pinimg.com/1200x/cc/6b/59/cc6b596e20d50544060f04a45d2af02e.jpg', desc: 'Cốt trà đen bá tước, nhân trân châu, kem macchiato' },
  { id: 15, name: 'Bánh Kem Socola Hạnh Nhân', category: 'Kem Socola', price: 420000, imageUrl: 'https://i.pinimg.com/1200x/17/b1/fd/17b1fdabb2860d9f1609df83d732f8cc.jpg', desc: 'Cốt socola, nhân hạnh nhân rang, kem socola đen' },
  { id: 16, name: 'Bánh Kem Phô Mai Basque', category: 'Kem Phô Mai', price: 480000, imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8qstwJys6ICKzfbQr3RSupda3ZaMp8QHlZNsAuh7xMPU8CE_OFYC6TAA&s=10', desc: 'Bánh phô mai nướng cháy mặt, cốt phô mai đặc' },
  { id: 17, name: 'Bánh Kem Dứa Cốt Dừa', category: 'Kem Trái Cây', price: 360000, imageUrl: 'https://cdn.tgdd.vn/2021/12/CookRecipe/GalleryStep/thanh-pham-183.jpg', desc: 'Cốt dừa, nhân dứa sên, kem tươi cốt dừa' },
  { id: 18, name: 'Bánh Kem Trứng Muối', category: 'Kem Đặc Biệt', price: 450000, imageUrl: 'https://i.pinimg.com/736x/24/9e/dc/249edc891f145fc83e914455a19082a9.jpg', desc: 'Cốt bông lan mềm, nhân phô mai trứng muối, xốt phô mai' },
  { id: 19, name: 'Bánh Kem Mousse Dâu Tây', category: 'Kem Mousse', price: 380000, imageUrl: 'https://i.pinimg.com/1200x/81/c3/52/81c35271675c5434498212ddb91ef226.jpg', desc: 'Lớp mousse dâu tây mát lạnh, đế bánh quy bơ' },
  { id: 20, name: 'Bánh Kem Cà Phê Cốt Dừa', category: 'Kem Cà Phê', price: 390000, imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6saPmTwE2vUMcl3b3R7-L8_fxbbJguGyjZbOIx62cXQ&s', desc: 'Cốt cà phê, nhân dừa non, kem bơ cà phê' },
  { id: 21, name: 'Bánh Kem Cầu Vồng', category: 'Kem Tươi', price: 420000, imageUrl: 'https://i.pinimg.com/1200x/2c/83/b1/2c83b12743beced6b6f16d15769a82be.jpg', desc: 'Cốt 6 màu cầu vồng, nhân chanh dây, kem tươi' },
  { id: 22, name: 'Bánh Kem Bơ Hàn Quốc', category: 'Kem Bơ', price: 460000, imageUrl: 'https://www.huongnghiepaau.com/wp-content/uploads/2019/01/banh-kem-bo-han-quoc-1.jpg', desc: 'Cốt vani, kem bơ trong suốt kiểu Hàn Quốc' },
  { id: 23, name: 'Bánh Kem Earl Grey', category: 'Kem Trà', price: 380000, imageUrl: 'https://cdn.hstatic.net/products/200000247827/earlgrey_1_b632fd7d01f54662a60bbe7577d1875d.jpg', desc: 'Cốt Earl grey, nhân kem trà, kem tươi Earl grey' },
  { id: 24, name: 'Bánh Kem Oreo', category: 'Kem Đặc Biệt', price: 400000, imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQX2JHy7-MZ6QTVGMDRzxuKgvJiC1pegTJGn2vKeEVWYn5A_otQvdnr-gdD&s=10', desc: 'Cốt socola đen, nhân vụn Oreo, kem tươi Oreo' },
  { id: 25, name: 'Bánh Kem Sầu Riêng', category: 'Kem Trái Cây', price: 490000, imageUrl: 'https://birthdaylovecake.com/wp-content/uploads/2020/11/Banh-kem-sau-rieng.jpg', desc: 'Cốt vani, nhân thịt sầu riêng non, kem tươi sầu riêng' },
  { id: 26, name: 'Bánh Kem Mousse Xoài', category: 'Kem Mousse', price: 370000, imageUrl: 'https://origato.com.vn/wp-content/uploads/2025/04/4.jpg', desc: 'Mousse xoài chua ngọt, đế gato mỏng, phủ jelly xoài' },
  { id: 27, name: 'Bánh Kem Khoai Môn', category: 'Kem Đặc Biệt', price: 380000, imageUrl: 'https://sweethome.com.vn/wp-content/uploads/2025/11/Khoai-Mon4-scaled.png', desc: 'Cốt khoai môn, nhân sên khoai môn sữa, kem tươi' },
  { id: 28, name: 'Bánh Kem Mocha', category: 'Kem Cà Phê', price: 390000, imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrmzYcrpdoLEe0BE6IdM85ejs81K0DCu8HJ47aPy2dmdqj1ykYoaKHNcfY&s=10', desc: 'Cốt mocha, nhân phô mai cacao, kem mocha bơ' },
  { id: 29, name: 'Bánh Kem Đậu Đỏ Matcha', category: 'Kem Matcha', price: 360000, imageUrl: 'https://imrorwxhrqjojn5q-static.micyjz.com/cloud/jlBpnKlnjqSRkkjnnpinjq/a9bb229b7f51fecade2b3197a0737d3.jpg', desc: 'Cốt matcha, nhân đậu đỏ sên, kem tươi matcha' },
  { id: 30, name: 'Bánh Kem Bơ Đậu Phộng', category: 'Kem Đặc Biệt', price: 380000, imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCZ8N6ICpF41Kfv0L3dP2UNwd_iknCVStXXdhwGsfaPC9-HJDg88qLqmI&s=10', desc: 'Cốt socola, nhân bơ đậu phộng giòn, kem bơ mặn' },
];

const CakeGallery = ({ selectedImageUrl, onSelect }) => {
  const [filter, setFilter] = useState('Tất cả');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const categories = ['Tất cả', ...new Set(SAMPLE_CAKES.map(c => c.category))];

  const handleFilterChange = (cat) => {
    setFilter(cat);
    setCurrentPage(1);
  };

  const filtered = filter === 'Tất cả'
    ? SAMPLE_CAKES
    : SAMPLE_CAKES.filter(c => c.category === filter);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCakes = filtered.slice(startIndex, startIndex + itemsPerPage);

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
              onClick={() => handleFilterChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="gallery-grid">
        {paginatedCakes.map(cake => {
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
                <div className="gallery-category-price">
                  <span className="gallery-category">{cake.category}</span>
                  <span className="gallery-price">Từ {cake.price.toLocaleString()}đ</span>
                </div>
                <div className="gallery-desc">{cake.desc}</div>
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            className="page-btn" 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            &laquo; Trước
          </button>
          
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button 
            className="page-btn" 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Sau &raquo;
          </button>
        </div>
      )}
    </div>
  );
};

export default CakeGallery;
