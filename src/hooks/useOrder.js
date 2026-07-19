/*
Custom Hook quản lý đơn hàng

Bao gồm:
- Tạo đơn
- Danh sách đơn
- Chi tiết đơn
- Cập nhật trạng thái
*/
import { useEffect, useState } from "react";
import { getOrders } from "../services/orderService";

const useOrder = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const res = await getOrders();
    setOrders(res.data);
  };

  return { orders, loadOrders };
};

export default useOrder;
