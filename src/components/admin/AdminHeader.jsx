import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../contexts/AuthContext";

function AdminHeader() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4 py-3 border-bottom border-3" style={{ borderBottomColor: "#F48FB1" }}>
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold text-dark d-flex align-items-center" to="/admin/orders">
          <span className="me-2 fs-4">🎂</span>
          <span style={{ color: "#F48FB1" }}>Cake Builder Admin</span>
        </Link>
        
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#adminNavbar"
          aria-controls="adminNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="adminNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active fw-semibold" to="/admin/orders" style={{ color: "#F48FB1" }}>
                Order Management
              </Link>
            </li>
          </ul>
          
          <div className="d-flex align-items-center">
            {user && (
              <span className="me-3 text-secondary">
                Hello, <strong>{user.name}</strong> ({user.role})
              </span>
            )}
            <button
              onClick={handleLogout}
              className="btn btn-outline-danger btn-sm rounded-pill px-3"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default AdminHeader;
