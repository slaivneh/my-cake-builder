/*
Layout dành cho khách hàng

Header
Navbar
Footer
*/
import { Outlet } from "react-router-dom";
import Header from "../components/customer/Header";
import Footer from "../components/customer/Footer";

function CustomerLayout() {
  return (
    <>
      <Header />
      <main className="container mt-4">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default CustomerLayout;
