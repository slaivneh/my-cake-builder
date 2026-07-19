import axiosClient from "./axiosClient";

export const getAllCake = () => {
  return axiosClient.get("/cakes");
};

export const getCakeById = (id) => {
  return axiosClient.get(`/cakes/${id}`);
};
