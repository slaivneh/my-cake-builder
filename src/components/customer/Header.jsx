import { Link } from "react-router-dom";

function Header() {
  return (
    <nav className="navbar navbar-light bg-light px-4">
      <Link className="navbar-brand" to="/">
        Cake Shop
      </Link>

      <div>
        <Link className="me-3" to="/">
          Home
        </Link>

        <Link className="me-3" to="/cart">
          Cart
        </Link>

        <Link to="/orders">Orders</Link>
      </div>
    </nav>
  );
}

export default Header;
