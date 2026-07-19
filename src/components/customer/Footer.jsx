import { Link } from "react-router-dom";

import logo from "../../assets/images/auth/logo.png";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="pd-footer">
      <div className="pd-footer__container">
        <div className="pd-footer__brand">
          <Link to="/home" className="pd-footer__logo">
            <img src={logo} alt="Petite Douceur" />
          </Link>

          <p>
            Ngọt ngào trong từng chiếc bánh, trao yêu thương trong từng khoảnh
            khắc.
          </p>
        </div>

        <div className="pd-footer__column">
          <h3>Liên kết nhanh</h3>

          <Link to="/home">Trang chủ</Link>

          <Link to="/cakes">Sản phẩm</Link>

          <Link to="/custom-cake">Bánh custom</Link>
        </div>

        <div className="pd-footer__column">
          <h3>Hỗ trợ</h3>

          <Link to="/orders">Đơn hàng của tôi</Link>

          <Link to="/cart">Giỏ hàng</Link>

          <Link to="/checkout">Thanh toán</Link>
        </div>

        <div className="pd-footer__column">
          <h3>Liên hệ</h3>

          <p>☎ 0901 234 567</p>
          <p>✉ petite@douceur.vn</p>

          <p>123 Đường Hoa Hồng, TP.Hà Nội</p>
        </div>
      </div>

      <div className="pd-footer__bottom">
        © {currentYear} Petite Douceur. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
