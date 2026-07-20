import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import AuthContext from "../../contexts/AuthContext";
import "../../assets/styles/AdminHeader.css";

import logo from "../../assets/images/auth/logo.png";

function AdminHeader() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {mobileOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <button
        className="admin-mobile-toggle"
        onClick={() => setMobileOpen(true)}
        aria-label="Mở menu"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Đã xóa class collapsed và biến collapsed */}
      <aside className={`admin-sidebar ${mobileOpen ? "mobile-open" : ""}`}>

        {/* Đã xóa nút <button className="admin-sidebar-toggle"> ... </button> */}

        <div className="admin-sidebar-top">
          <Link to="/home" className="pd-header__logo" aria-label="Petite Douceur">
            <img src={logo} alt="Petite Douceur" />
          </Link>

          <nav className="admin-nav">
            <Link
              to="/admin/orders"
              className={`admin-nav-item ${isActive("/admin/orders") ? "active" : ""}`}
            >
              <span className="admin-nav-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </span>
              <span className="admin-nav-label">Quản lý đơn hàng</span>
            </Link>
          </nav>
        </div>

        <div className="admin-sidebar-bottom">
          <div className="admin-user-card">
            <div className="admin-user-avatar">
              {getInitials(user?.fullName || user?.name)}
            </div>
            <div className="admin-user-info">
              <span className="admin-user-name">
                {user?.fullName || user?.name || "Admin"}
              </span>
              <span className="admin-user-role">
                {user?.role === "owner" ? "Chủ cửa hàng" : "Nhân viên"}
              </span>
            </div>
          </div>

          <button onClick={handleLogout} className="admin-logout-btn">
            <span className="admin-logout-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </span>
            <span className="admin-logout-label">Đăng xuất</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default AdminHeader;