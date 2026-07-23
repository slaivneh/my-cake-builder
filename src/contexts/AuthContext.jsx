import { createContext, useCallback, useMemo, useState } from "react";

import { loginUser, registerUser } from "../services/authService";

const AuthContext = createContext(null);

const STORAGE_KEY = "user";

/*
  Đọc user đã đăng nhập từ localStorage
  hoặc sessionStorage.
*/
const getStoredUser = () => {
  const storedUser =
    localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch (error) {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);

    return null;
  }
};

/*
  Không lưu password trong trình duyệt.
*/
const removePassword = (userData) => {
  const { password, ...safeUser } = userData;

  return {
    ...safeUser,

    fullName: safeUser.fullName || safeUser.name || "",
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);

  /*
    User được đọc trực tiếp từ storage,
    không cần loading bất đồng bộ.
  */
  const loading = false;

  /*
    Đăng nhập.
  */
  const login = useCallback(async ({ email, password, remember = true }) => {
    const userData = await loginUser({
      email,
      password,
    });

    const safeUser = removePassword(userData);

    /*
        Xóa phiên đăng nhập trước đó.
      */
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);

    /*
        remember = true:
        lưu bằng localStorage.

        remember = false:
        lưu bằng sessionStorage.
      */
    const storage = remember ? localStorage : sessionStorage;

    storage.setItem(STORAGE_KEY, JSON.stringify(safeUser));

    setUser(safeUser);

    return safeUser;
  }, []);

  /*
    Đăng ký chỉ tạo tài khoản mới.
    Không tự động đăng nhập.
  */
  const register = useCallback(async (formData) => {
    return registerUser(formData);
  }, []);

  /*
    Đăng xuất.
  */
  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);

    setUser(null);
  }, []);

  /*
    Cập nhật thông tin user hiện tại trong session.
  */
  const updateCurrentUser = useCallback((updatedUser) => {
    const safeUser = removePassword(updatedUser);

    if (localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser));
    } else if (sessionStorage.getItem(STORAGE_KEY)) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser));
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser));
    }

    setUser(safeUser);
  }, []);

  const contextValue = useMemo(
    () => ({
      user,

      isAuthenticated: Boolean(user),

      loading,

      login,
      register,
      logout,
      updateCurrentUser,
    }),
    [user, login, register, logout, updateCurrentUser, loading],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
