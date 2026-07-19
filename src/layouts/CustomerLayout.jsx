import { useEffect } from "react";

import { Outlet, useLocation } from "react-router-dom";

import Header from "../components/customer/Header";
import Footer from "../components/customer/Footer";

import "../assets/styles/home.css";
import "../assets/styles/header.css";

function CustomerLayout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "auto",
    });
  }, [location.pathname]);

  return (
    <div className="pd-customer-layout">
      <Header />

      <main className="pd-customer-main">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default CustomerLayout;
