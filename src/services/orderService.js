/*
API đơn hàng

- Tạo đơn
- Lấy đơn
- Cập nhật trạng thái
*/
import axiosClient from "./axiosClient";

export const getOrders = () => {
  return axiosClient.get("/orders");
};

export const getOrderById = (id) => {
  return axiosClient.get(`/orders/${id}`);
};

export const createOrder = (data) => {
  return axiosClient.post("/orders", data);
};

export const updateStatus = (id, data) => {
  return axiosClient.patch(`/orders/${id}`, data);
};
