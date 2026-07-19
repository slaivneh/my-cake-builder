/*
API thông báo

Thông báo thay đổi trạng thái đơn hàng
*/
import axiosClient from "./axiosClient";

// Mock data for notifications
let mockNotifications = [
  {
    id: 'NOTIF-1',
    userId: 'user123',
    title: 'Order Confirmed',
    message: 'Your order ORD-002 has been confirmed and is now baking.',
    isRead: false,
    date: '2026-07-18T15:00:00Z'
  },
  {
    id: 'NOTIF-2',
    userId: 'user123',
    title: 'Welcome!',
    message: 'Welcome to My Cake Builder.',
    isRead: true,
    date: '2026-07-10T09:00:00Z'
  }
];

const notificationService = {
  getByUser(userId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockNotifications.filter(n => n.userId === userId));
      }, 300);
    });
  },

  create(notification) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newNotif = {
          id: `NOTIF-${Math.floor(Math.random() * 10000)}`,
          isRead: false,
          date: new Date().toISOString(),
          ...notification
        };
        mockNotifications.unshift(newNotif);
        resolve(newNotif);
      }, 300);
    });
  },

  markAsRead(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockNotifications = mockNotifications.map(n => 
          n.id === id ? { ...n, isRead: true } : n
        );
        resolve(true);
      }, 200);
    });
  },
};

export default notificationService;
