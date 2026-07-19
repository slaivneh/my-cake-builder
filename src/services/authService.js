/*
API đăng nhập

Bao gồm:
- Login
- Register
- Logout
*/
import axiosClient from "./axiosClient";

export const login = (data) => {
  return axiosClient.get(
    `/users?email=${data.email}&password=${data.password}`,
  );
};

export const register = (data) => {
  return axiosClient.post("/users", data);
};

export const getUser = (id) => {
  return axiosClient.get(`/users/${id}`);
};
