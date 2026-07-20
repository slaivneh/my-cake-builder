import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import logo from "../../assets/images/auth/logo.png";

const initialForm = {
  email: "",
  password: "",
  remember: true,
};

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();

  const [formData, setFormData] = useState(initialForm);

  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({});

  const [submitError, setSubmitError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  /*
    Sau khi đăng ký thành công,
    tự động điền email vào form Login.
  */
  useEffect(() => {
    const registeredEmail = location.state?.registeredEmail;

    if (registeredEmail) {
      setFormData((previous) => ({
        ...previous,
        email: registeredEmail,
      }));
    }
  }, [location.state]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,

      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setSubmitError("");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Email không đúng định dạng.";
    }

    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu.";
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

      const loggedInUser = await login({
        email: formData.email,
        password: formData.password,
        remember: formData.remember,
      });

      /*
        Owner luôn chuyển tới trang quản lý.
      */
      if (loggedInUser.role === "owner") {
        navigate("/admin/orders", {
          replace: true,
        });

        return;
      }

      /*
        Customer quay lại trang đã yêu cầu trước đó.
        Ví dụ: /cart hoặc /checkout.
      */
      const previousPath = location.state?.from;

      navigate(previousPath || "/", {
        replace: true,
      });
    } catch (error) {
      setSubmitError(error.message || "Đăng nhập thất bại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="auth-card">
      <div className="auth-card__inner-border" aria-hidden="true" />

      <div className="auth-logo-frame">
        <img src={logo} alt="Petite Douceur" />
      </div>

      <header className="auth-heading">
        <p className="auth-eyebrow">Chào mừng bạn quay trở lại</p>

        <h1>Đăng nhập</h1>

        <p>Đăng nhập để tiếp tục mua những chiếc bánh ngọt ngào.</p>
      </header>

      {location.state?.message && (
        <div className="auth-alert auth-alert--success">
          {location.state.message}
        </div>
      )}

      {submitError && (
        <div className="auth-alert auth-alert--error" role="alert">
          {submitError}
        </div>
      )}

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="auth-field">
          <label htmlFor="login-email">Email</label>

          <div
            className={`auth-input ${errors.email ? "auth-input--error" : ""}`}
          >
            <span className="auth-input__icon" aria-hidden="true">
              ✉
            </span>

            <input
              id="login-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="customer@gmail.com"
              autoComplete="email"
            />
          </div>

          {errors.email && (
            <small className="auth-error-text">{errors.email}</small>
          )}
        </div>

        <div className="auth-field">
          <label htmlFor="login-password">Mật khẩu</label>

          <div
            className={`auth-input ${
              errors.password ? "auth-input--error" : ""
            }`}
          >
            <span className="auth-input__icon" aria-hidden="true">
              ♡
            </span>

            <input
              id="login-password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu"
              autoComplete="current-password"
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

        <label className="auth-checkbox">
          <input
            name="remember"
            type="checkbox"
            checked={formData.remember}
            onChange={handleChange}
          />

          <span>Ghi nhớ đăng nhập</span>
        </label>

        <button className="auth-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>

      <p className="auth-switch">
        Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
      </p>
    </section>
  );
}

export default Login;
