import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

import logo from "../../assets/images/auth/logo.png";

const initialForm = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
  password: "",
  confirmPassword: "",
};

function Register() {
  const navigate = useNavigate();

  const { register } = useAuth();

  const [formData, setFormData] = useState(initialForm);

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({});

  const [submitError, setSubmitError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

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

    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Email không đúng định dạng.";
    }

    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu.";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không trùng khớp.";
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
      setIsSubmitting(true);
      setSubmitError("");

      await register({
        fullName: formData.fullName,

        phone: formData.phone.replace(/\s+/g, ""),

        email: formData.email,
        address: formData.address,
        password: formData.password,
      });

      navigate("/login", {
        replace: true,

        state: {
          registeredEmail: formData.email.trim().toLowerCase(),

          message: "Đăng ký thành công. Bạn có thể đăng nhập ngay.",
        },
      });
    } catch (error) {
      setSubmitError(error.message || "Đăng ký thất bại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="auth-card auth-card--register">
      <div className="auth-card__inner-border" aria-hidden="true" />

      <div className="auth-logo-frame">
        <img src={logo} alt="Petite Douceur" />
      </div>

      <header className="auth-heading">
        <p className="auth-eyebrow">Trở thành một phần của Petite Douceur</p>

        <h1>Đăng ký tài khoản</h1>

        <p>Tạo tài khoản để đặt bánh và theo dõi đơn hàng của bạn.</p>
      </header>

      {submitError && (
        <div className="auth-alert auth-alert--error" role="alert">
          {submitError}
        </div>
      )}

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="auth-grid">
          <div className="auth-field">
            <label htmlFor="register-name">Họ và tên</label>

            <div
              className={`auth-input ${
                errors.fullName ? "auth-input--error" : ""
              }`}
            >
              <span className="auth-input__icon" aria-hidden="true">
                ♡
              </span>

              <input
                id="register-name"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Nguyễn Thảo Vy"
                autoComplete="name"
              />
            </div>

            {errors.fullName && (
              <small className="auth-error-text">{errors.fullName}</small>
            )}
          </div>

          <div className="auth-field">
            <label htmlFor="register-phone">Số điện thoại</label>

            <div
              className={`auth-input ${
                errors.phone ? "auth-input--error" : ""
              }`}
            >
              <span className="auth-input__icon" aria-hidden="true">
                ☎
              </span>

              <input
                id="register-phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="0901234567"
                autoComplete="tel"
              />
            </div>

            {errors.phone && (
              <small className="auth-error-text">{errors.phone}</small>
            )}
          </div>
        </div>

        <div className="auth-field">
          <label htmlFor="register-email">Email</label>

          <div
            className={`auth-input ${errors.email ? "auth-input--error" : ""}`}
          >
            <span className="auth-input__icon" aria-hidden="true">
              ✉
            </span>

            <input
              id="register-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          {errors.email && (
            <small className="auth-error-text">{errors.email}</small>
          )}
        </div>

        <div className="auth-field">
          <label htmlFor="register-address">
            Địa chỉ <span className="auth-optional">(không bắt buộc)</span>
          </label>

          <div className="auth-input">
            <span className="auth-input__icon" aria-hidden="true">
              ⌖
            </span>

            <input
              id="register-address"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
              placeholder="Địa chỉ nhận bánh"
              autoComplete="street-address"
            />
          </div>
        </div>

        <div className="auth-grid">
          <div className="auth-field">
            <label htmlFor="register-password">Mật khẩu</label>

            <div
              className={`auth-input ${
                errors.password ? "auth-input--error" : ""
              }`}
            >
              <span className="auth-input__icon" aria-hidden="true">
                ♡
              </span>

              <input
                id="register-password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Tối thiểu 6 ký tự"
                autoComplete="new-password"
              />

              <button
                className="auth-eye-button"
                type="button"
                onClick={() => {
                  setShowPassword((previous) => !previous);
                }}
              >
                {showPassword ? "Ẩn" : "Hiện"}
              </button>
            </div>

            {errors.password && (
              <small className="auth-error-text">{errors.password}</small>
            )}
          </div>

          <div className="auth-field">
            <label htmlFor="register-confirm">Xác nhận mật khẩu</label>

            <div
              className={`auth-input ${
                errors.confirmPassword ? "auth-input--error" : ""
              }`}
            >
              <span className="auth-input__icon" aria-hidden="true">
                ♡
              </span>

              <input
                id="register-confirm"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Nhập lại mật khẩu"
                autoComplete="new-password"
              />

              <button
                className="auth-eye-button"
                type="button"
                onClick={() => {
                  setShowConfirmPassword((previous) => !previous);
                }}
              >
                {showConfirmPassword ? "Ẩn" : "Hiện"}
              </button>
            </div>

            {errors.confirmPassword && (
              <small className="auth-error-text">
                {errors.confirmPassword}
              </small>
            )}
          </div>
        </div>

        <button className="auth-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Đang tạo tài khoản..." : "Đăng ký"}
        </button>
      </form>

      <p className="auth-switch">
        Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
      </p>
    </section>
  );
}

export default Register;
