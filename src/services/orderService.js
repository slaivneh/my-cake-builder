import axiosClient from "./axiosClient";

export const createOrder = async (orderData) => {
  if (!orderData) {
    throw new Error("Dữ liệu đơn hàng không hợp lệ.");
  }

  return axiosClient.post("/orders", orderData);
};

export const getOrders = async () => {
  const orders = await axiosClient.get("/orders");

  return Array.isArray(orders) ? orders : [];
};

export const getOrderById = async (id) => {
  if (id === undefined || id === null || id === "") {
    throw new Error("Thiếu mã đơn hàng.");
  }

  return axiosClient.get(`/orders/${id}`);
};

export const updateStatus = async (id, statusOrData) => {
  if (id === undefined || id === null || id === "") {
    throw new Error("Thiếu mã đơn hàng.");
  }

  if (
    statusOrData === undefined ||
    statusOrData === null ||
    statusOrData === ""
  ) {
    throw new Error("Thiếu trạng thái cần cập nhật.");
  }

  const updateData =
    typeof statusOrData === "object" && !Array.isArray(statusOrData)
      ? {
          ...statusOrData,

          updatedAt: new Date().toISOString(),
        }
      : {
          status: statusOrData,

          updatedAt: new Date().toISOString(),
        };

  return axiosClient.patch(`/orders/${id}`, updateData);
};

export const sendOrderConfirmationEmail = async (emailData) => {
  return axiosClient.post("/email/order-confirmation", emailData);
};
