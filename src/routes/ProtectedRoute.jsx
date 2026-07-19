import { Navigate, Outlet, useLocation } from "react-router-dom";

import useAuth from "../hooks/useAuth";

function ProtectedRoute({ role }) {
  const location = useLocation();
  const { user } = useAuth();

  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{
          from: `${location.pathname}${location.search}`,
        }}
        replace
      />
    );
  }

  // Cho phép nhiều role
  if (role) {
    const allowedRoles = Array.isArray(role) ? role : [role];

    if (!allowedRoles.includes(user.role)) {
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
}

export default ProtectedRoute;