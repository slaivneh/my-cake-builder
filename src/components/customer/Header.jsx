import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

import logo from "../../assets/images/auth/logo.png";
import "../../assets/styles/header.css";
function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);

  const displayName = user?.fullName || user?.name || "Tài khoản";

  const avatarText = displayName
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/home");
  };

  const getNavClass = ({ isActive }) => {
    return isActive
      ? "pd-header__link pd-header__link--active"
      : "pd-header__link";
  };

  return (
    <header className="pd-header">
      <div className="pd-header__container">
        {/* Menu bên trái */}
        <nav
          className={`pd-header__nav ${menuOpen ? "pd-header__nav--open" : ""}`}
        >
          <NavLink to="/home" end className={getNavClass} onClick={closeMenu}>
            Trang chủ
          </NavLink>

          <NavLink to="/cakes" className={getNavClass} onClick={closeMenu}>
            Sản phẩm
          </NavLink>

          <NavLink
            to="/custom-cake"
            className={getNavClass}
            onClick={closeMenu}
          >
            Bánh custom
          </NavLink>
        </nav>

        {/* Logo chính giữa */}
        <Link
          to="/home"
          className="pd-header__logo"
          onClick={closeMenu}
          aria-label="Petite Douceur"
        >
          <img src={logo} alt="Petite Douceur" />
        </Link>

        {/* Khu vực bên phải */}
        <div
          className={`pd-header__actions ${menuOpen ? "pd-header__actions--open" : ""
            }`}
        >
          {!user ? (
            /* Chưa đăng nhập */
            <div className="pd-header__auth">
              <Link
                to="/login"
                className="pd-header__login"
                onClick={closeMenu}
              >
                Đăng nhập
              </Link>

              <Link
                to="/register"
                className="pd-header__register"
                onClick={closeMenu}
              >
                Đăng ký
              </Link>
            </div>
          ) : (
            /* Đã đăng nhập */
            <div className="pd-header__logged-in">
              {user.role === "customer" && (
                <div className="pd-header__customer-links">
                  <NavLink
                    to="/orders"
                    className={getNavClass}
                    onClick={closeMenu}
                  >
                    Đơn hàng
                  </NavLink>

                  <NavLink
                    to="/cart"
                    className={getNavClass}
                    onClick={closeMenu}
                  >
                    Giỏ hàng
                  </NavLink>
                </div>
              )}

              {user.role === "owner" && (
                <NavLink
                  to="/admin/orders"
                  className={getNavClass}
                  onClick={closeMenu}
                >
                  Quản lý đơn
                </NavLink>
              )}

              <div className="pd-header__account">
                <div className="pd-header__avatar">{avatarText}</div>

                <div className="pd-header__account-info">
                  <span>Xin chào</span>

                  <strong title={displayName}>{displayName}</strong>
                </div>
              </div>

              <button
                type="button"
                className="pd-header__logout"
                onClick={handleLogout}
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>

        {/* Nút menu mobile */}
        <button
          type="button"
          className={`pd-header__menu-button ${menuOpen ? "pd-header__menu-button--open" : ""
            }`}
          onClick={() => {
            setMenuOpen((previous) => !previous);
          }}
          aria-label="Mở menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}

export default Header;
