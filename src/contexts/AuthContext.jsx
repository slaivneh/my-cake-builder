/*
Quản lý trạng thái đăng nhập của toàn bộ ứng dụng

Chức năng:
/*
Quản lý trạng thái đăng nhập của toàn bộ ứng dụng

Chức năng:
- Lưu currentUser
- Login
- Logout
- Register
- Kiểm tra role
*/
import { createContext } from "react";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
}
