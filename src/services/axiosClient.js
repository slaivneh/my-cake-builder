/*
Cấu hình Axios

Thiết lập:
- Base URL
- Header
- Interceptor (nếu cần)
*/
import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;
