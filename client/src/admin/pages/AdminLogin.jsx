import "../../pages/auth.css";
import { useState } from "react";
import {
  Navigate,
  useLocation,
  useNavigate
} from "react-router-dom";

import {
  useAuth
} from "../../context/AuthContext";

function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    adminLogin,
    isAdmin,
    loading: authLoading
  } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (authLoading) {
    return (
      <div className="auth-page">
        Loading...
      </div>
    );
  }

  if (isAdmin) {
    return (
      <Navigate
        to="/admin"
        replace
      />
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await adminLogin(
        formData.email,
        formData.password
      );

      const redirectTo =
        location.state?.from || "/admin";

      navigate(redirectTo, {
        replace: true
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page admin-login-page">
      <div className="auth-card">
        <h1>Admin Login</h1>

        <p className="auth-subtitle">
          Sign in to manage your ecommerce store.
        </p>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>Admin Email</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter admin email"
              required
            />
          </div>

          <div className="auth-field">
            <label>Password</label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Admin Login"}
          </button>
        </form>

        <div className="auth-back">
          <a href="/">
            ← Back to Store
          </a>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;