export const formatCurrency = (value) => {
  return Number(value).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};
