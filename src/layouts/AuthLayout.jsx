import { Outlet } from "react-router-dom";

import "../assets/styles/auth.css";

function AuthLayout() {
  return (
    <main className="auth-layout">
      <div className="auth-layout__overlay" aria-hidden="true" />

      <section className="auth-layout__content">
        <Outlet />
      </section>
    </main>
  );
}

export default AuthLayout;
