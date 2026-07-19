/*
API thông báo

Thông báo thay đổi trạng thái đơn hàng
*/
import axiosClient from "./axiosClient";

const notificationService = {
  getByUser(userId) {
    return axiosClient.get(`/notifications?userId=${userId}&_sort=createdAt&_order=desc`)
      .then(res => res.data);
  },

  create(notification) {
    const newNotif = {
      isRead: false,
      createdAt: new Date().toISOString(),
      ...notification
    };
    return axiosClient.post('/notifications', newNotif)
      .then(res => res.data);
  },

  markAsRead(id) {
    return axiosClient.patch(`/notifications/${id}`, { isRead: true })
      .then(res => res.data);
  },
};

export default notificationService;

