import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import NotificationBell from '../components/notification/NotificationBell';


const CustomerLayout = () => {
  return (
    <div className="customer-layout">
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 32px', background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div className="logo">
          <Link to="/" style={{ textDecoration: 'none', color: '#ff69b4', fontWeight: 'bold', fontSize: '1.5rem' }}>🍰 My Cake</Link>
        </div>
        <nav style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
          <Link to="/custom-cake" style={{ textDecoration: 'none', color: '#555', fontWeight: 500 }}>Thiết Kế Bánh</Link>
          <Link to="/orders" style={{ textDecoration: 'none', color: '#555', fontWeight: 500 }}>Đơn Hàng</Link>
          <NotificationBell />
        </nav>
      </header>
      <main style={{ minHeight: 'calc(100vh - 80px)', backgroundColor: '#fcfcfc' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default CustomerLayout;
