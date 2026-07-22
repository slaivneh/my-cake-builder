import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { getUserById, updateUser } from "../../services/authService";
import FormInput from "../../components/common/Input";
import "../../assets/styles/profile.css";

function Profile() {
  const { user, updateCurrentUser } = useAuth();

  const [formData, setFormData] = useState({
    fullName: user?.fullName || user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setSubmitError("");
    setSubmitSuccess("");
  };

  const validateForm = () => {
    const newErrors = {};
    const normalizedPhone = formData.phone.replace(/\s+/g, "");

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Vui lòng nhập họ và tên.";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Họ tên phải có ít nhất 2 ký tự.";
    }

    if (!normalizedPhone) {
      newErrors.phone = "Vui lòng nhập số điện thoại.";
    } else if (!/^0\d{9}$/.test(normalizedPhone)) {
      newErrors.phone = "Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setSubmitError("");
      setSubmitSuccess("");

      // Lấy toàn bộ thông tin user từ server để tránh ghi đè mất mật khẩu
      const fullUser = await getUserById(user.id);

      const updatedUserData = {
        ...fullUser,
        fullName: formData.fullName.trim(),
        name: formData.fullName.trim(), // Đồng bộ name và fullName
        phone: formData.phone.trim(),
        address: formData.address.trim(),
      };

      // Cập nhật lên json-server
      const response = await updateUser(user.id, updatedUserData);

      // Cập nhật context và storage ngay lập tức
      updateCurrentUser(response);

      setSubmitSuccess("Cập nhật hồ sơ thành công.");
    } catch (error) {
      setSubmitError(error.message || "Cập nhật hồ sơ thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: user?.fullName || user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
    });

    setErrors({});
    setSubmitError("");
    setSubmitSuccess("");
  };

  return (
    <div className="pd-profile-page">
      <header className="pd-profile-heading">
        <p>Petite Douceur</p>
        <h1>Thông tin cá nhân</h1>
        <span>Quản lý thông tin tài khoản của bạn</span>
      </header>

      <div className="pd-profile-card">
        {submitSuccess && (
          <div className="pd-profile-alert pd-profile-alert--success" role="alert">
            {submitSuccess}
          </div>
        )}

        {submitError && (
          <div className="pd-profile-alert pd-profile-alert--error" role="alert">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="pd-profile-form" noValidate>
          <div className="pd-profile-field">
            <FormInput
              label={
                <>
                  Họ và tên <strong>*</strong>
                </>
              }
              id="profile-fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Nguyễn Thảo Vy"
              className={errors.fullName ? "is-invalid" : ""}
            />
            {errors.fullName && (
              <small className="pd-profile-error-text">{errors.fullName}</small>
            )}
          </div>

          <div className="pd-profile-field">
            <FormInput
              label="Email"
              id="profile-email"
              name="email"
              type="email"
              value={formData.email}
              readOnly
              disabled
              placeholder="you@example.com"
            />
            <span style={{ fontSize: "12px", color: "#92766f", marginTop: "-12px", marginBottom: "8px" }}>
              Email đăng ký là cố định và không thể thay đổi.
            </span>
          </div>

          <div className="pd-profile-field">
            <FormInput
              label={
                <>
                  Số điện thoại <strong>*</strong>
                </>
              }
              id="profile-phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="0901234567"
              className={errors.phone ? "is-invalid" : ""}
            />
            {errors.phone && (
              <small className="pd-profile-error-text">{errors.phone}</small>
            )}
          </div>

          <div className="pd-profile-field">
            <FormInput
              label="Địa chỉ"
              id="profile-address"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
              placeholder="Nhập địa chỉ của bạn"
            />
          </div>

          <div className="pd-profile-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="pd-profile-btn pd-profile-btn--secondary"
              disabled={loading}
            >
              Hủy
            </button>

            <button
              type="submit"
              className="pd-profile-btn pd-profile-btn--primary"
              disabled={loading}
            >
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;
