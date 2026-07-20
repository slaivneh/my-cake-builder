/*
Custom Hook quản lý giỏ hàng

Bao gồm:
- Lấy giỏ hàng
- Thêm sản phẩm
- Xóa sản phẩm
- Cập nhật số lượng
*/
import { useContext } from "react";
import CartContext from "../contexts/CartContext";

const useCart = () => {
  return useContext(CartContext);
};

export default useCart;
