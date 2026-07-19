import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5001",

  timeout: 10000,

  headers: {
    "Content-Type": "application/json",
  },
});

/*
  Trả thẳng response.data.

  Ví dụ:
  const users = await axiosClient.get("/users");

  users lúc này là dữ liệu thật,
  không cần users.data.
*/
axiosClient.interceptors.response.use(
  (response) => response.data,

  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Không thể kết nối đến máy chủ.";

    return Promise.reject(new Error(message));
  },
);

export default axiosClient;
