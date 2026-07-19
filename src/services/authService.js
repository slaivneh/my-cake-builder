import axiosClient from "./axiosClient";

/*
  Chuẩn hóa email trước khi tìm kiếm hoặc lưu vào DB.
*/
const normalizeEmail = (email = "") => {
  return email.trim().toLowerCase();
};

/*
  Tìm user theo email.
*/
export const getUserByEmail = async (email) => {
  const users = await axiosClient.get("/users", {
    params: {
      email: normalizeEmail(email),
    },
  });

  if (!Array.isArray(users)) {
    return null;
  }

  return users[0] || null;
};

/*
  Đăng nhập.
*/
export const loginUser = async ({ email, password }) => {
  const user = await getUserByEmail(email);

  if (!user || user.password !== password) {
    throw new Error("Email hoặc mật khẩu không chính xác.");
  }

  if (user.isActive === false) {
    throw new Error("Tài khoản đã bị khóa. Vui lòng liên hệ cửa hàng.");
  }

  /*
    Hệ thống chỉ chấp nhận customer và owner.
  */
  if (user.role !== "customer" && user.role !== "owner") {
    throw new Error("Vai trò của tài khoản không hợp lệ.");
  }

  return user;
};

/*
  Đăng ký tài khoản mới.
*/
export const registerUser = async ({
  fullName,
  email,
  phone,
  address,
  password,
}) => {
  const existedUser = await getUserByEmail(email);

  if (existedUser) {
    throw new Error("Email này đã được sử dụng.");
  }

  const normalizedName = fullName.trim();

  const newUser = {
    /*
      Giữ cả fullName và name để tương thích
      với các phần code khác trong project.
    */
    fullName: normalizedName,
    name: normalizedName,

    email: normalizeEmail(email),
    phone: phone.trim(),
    address: address?.trim() || "",
    password,

    /*
      Người tự đăng ký luôn là customer.
    */
    role: "customer",

    isActive: true,
    createdAt: new Date().toISOString(),
  };

  return axiosClient.post("/users", newUser);
};

/*
  Lấy user theo id.
*/
export const getUserById = async (id) => {
  return axiosClient.get(`/users/${id}`);
};
