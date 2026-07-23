import axiosClient from "./axiosClient";

/*
  Lấy danh sách bánh.

  getCakes được giữ lại để tương thích với
  OrderManagement và code cũ sau khi merge.
*/
export const getCakes = async (params = {}) => {
  const cakes = await axiosClient.get("/cakes", {
    params,
  });

  if (!Array.isArray(cakes)) {
    return [];
  }

  return [...cakes].sort((first, second) => {
    const firstOrder = Number(first.displayOrder ?? first.id ?? 0);

    const secondOrder = Number(second.displayOrder ?? second.id ?? 0);

    return firstOrder - secondOrder;
  });
};

/*
  Tên mới sử dụng ở CakeList và các màn hình mới.
*/
export const getAllCakes = async (params = {}) => {
  return getCakes(params);
};

/*
  Lấy chi tiết bánh.
*/
export const getCakeById = async (id) => {
  if (id === undefined || id === null || id === "") {
    throw new Error("Thiếu mã bánh.");
  }

  return axiosClient.get(`/cakes/${id}`);
};

/*
  Tạo bánh mới.
*/
export const createCake = async (cakeData) => {
  if (!cakeData || typeof cakeData !== "object") {
    throw new Error("Dữ liệu bánh không hợp lệ.");
  }

  if (!cakeData.name?.trim()) {
    throw new Error("Tên bánh không được để trống.");
  }

  if (!cakeData.image?.trim()) {
    throw new Error("Ảnh bánh không được để trống.");
  }

  if (
    !Array.isArray(cakeData.priceOptions) ||
    cakeData.priceOptions.length === 0
  ) {
    throw new Error("Bánh phải có ít nhất một lựa chọn giá.");
  }

  const newCake = {
    ...cakeData,

    name: cakeData.name.trim(),

    description: cakeData.description?.trim() || "",

    image: cakeData.image.trim(),

    isAvailable: cakeData.isAvailable !== false,

    isBestSeller: Boolean(cakeData.isBestSeller),

    isFeatured: Boolean(cakeData.isFeatured),

    createdAt: cakeData.createdAt || new Date().toISOString(),

    updatedAt: new Date().toISOString(),
  };

  return axiosClient.post("/cakes", newCake);
};

/*
  Cập nhật bánh.
*/
export const updateCake = async (id, cakeData) => {
  if (id === undefined || id === null || id === "") {
    throw new Error("Thiếu mã bánh.");
  }

  if (!cakeData || typeof cakeData !== "object") {
    throw new Error("Dữ liệu cập nhật không hợp lệ.");
  }

  return axiosClient.patch(`/cakes/${id}`, {
    ...cakeData,
    updatedAt: new Date().toISOString(),
  });
};

/*
  Xóa bánh.
*/
export const deleteCake = async (id) => {
  if (id === undefined || id === null || id === "") {
    throw new Error("Thiếu mã bánh.");
  }

  return axiosClient.delete(`/cakes/${id}`);
};
