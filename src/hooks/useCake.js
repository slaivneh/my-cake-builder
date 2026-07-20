/*
Custom Hook lấy dữ liệu bánh

Bao gồm:
- Danh sách bánh
- Chi tiết bánh
- Search
- Filter
*/
import { useEffect, useState } from "react";
import { getAllCake } from "../services/cakeService";

const useCake = () => {
  const [cakes, setCakes] = useState([]);

  useEffect(() => {
    loadCake();
  }, []);

  const loadCake = async () => {
    const res = await getAllCake();
    setCakes(res.data);
  };

  return { cakes, loadCake };
};

export default useCake;
