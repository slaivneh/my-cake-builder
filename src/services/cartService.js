/*
API giỏ hàng

- Thêm
- Sửa
- Xóa
- Lấy giỏ hàng
*/
import axiosClient from "./axiosClient";

export const getCart = () => {
  return axiosClient.get("/carts");
};

export const addCart = (data) => {
  return axiosClient.post("/carts", data);
};

export const updateCart = (id, data) => {
  return axiosClient.put(`/carts/${id}`, data);
};

export const deleteCart = (id) => {
  return axiosClient.delete(`/carts/${id}`);
};
