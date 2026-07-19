import { Outlet } from "react-router-dom";
import AdminHeader from "../components/admin/AdminHeader";

function AdminLayout() {
  return (
    <>
      <AdminHeader />
      <main className="container mt-4">
        <Outlet />
      </main>
    </>
  );
}

export default AdminLayout;
