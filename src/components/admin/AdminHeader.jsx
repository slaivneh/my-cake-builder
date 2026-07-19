import { Link } from "react-router-dom";

function AdminHeader() {
  return (
    <nav className="navbar navbar-dark bg-dark px-4">
      <Link className="navbar-brand text-white" to="/admin/orders">
        Admin
      </Link>
    </nav>
  );
}

export default AdminHeader;
