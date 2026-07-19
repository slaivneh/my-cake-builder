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

  if (role && user.role !== role) {
    return (
      <Navigate to={user.role === "owner" ? "/admin/orders" : "/"} replace />
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;
