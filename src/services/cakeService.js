import axiosClient from "./axiosClient";

/*
  Lấy tất cả bánh từ JSON Server.

  Home sẽ tự chọn:
  - 6 bánh bán chạy
  - 6 bánh thuộc danh mục
*/
export const getAllCakes = async () => {
  const cakes = await axiosClient.get("/cakes");

  return Array.isArray(cakes) ? cakes : [];
};

/*
  Lấy chi tiết bánh theo id.
*/
export const getCakeById = async (id) => {
  return axiosClient.get(`/cakes/${id}`);
};

/*
  Tìm kiếm bánh.
*/
export const searchCakes = async (keyword) => {
  const cakes = await axiosClient.get("/cakes", {
    params: {
      q: keyword.trim(),
    },
  });

  return Array.isArray(cakes) ? cakes : [];
};
