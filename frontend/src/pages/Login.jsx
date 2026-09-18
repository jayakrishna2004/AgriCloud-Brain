import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sprout,
  Lock,
  Mail,
  UserRound
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("FARMER");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Validate fields
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      // Send email, password and selected role
      // to the Spring Boot backend
      const user = await login(
        email,
        password,
        role
      );

      // Redirect based on actual backend role
      if (user.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/farmer");
      }

    } catch (error) {
      setError(
        error.message ||
        "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        {/* Logo */}
        <div className="auth-logo">
          <Sprout size={45} />
        </div>

        {/* Title */}
        <h1>AgriCloud-Brain</h1>

        <p className="auth-subtitle">
          AI-Powered Agricultural Cloud Platform
        </p>

        {/* Error message */}
        {error && (
          <div
            style={{
              background: "#fee2e2",
              color: "#b91c1c",
              padding: "10px 12px",
              borderRadius: "8px",
              marginBottom: "15px",
              fontSize: "14px",
              textAlign: "center"
            }}
          >
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>

          {/* Email */}
          <div className="input-group">

            <label htmlFor="email">
              Email
            </label>

            <div className="input-wrapper">

              <Mail size={18} />

              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                autoComplete="email"
              />

            </div>

          </div>

          {/* Password */}
          <div className="input-group">

            <label htmlFor="password">
              Password
            </label>

            <div className="input-wrapper">

              <Lock size={18} />

              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                autoComplete="current-password"
              />

            </div>

          </div>

          {/* Login Role */}
          <div className="input-group">

            <label htmlFor="role">
              Login as
            </label>

            <div className="input-wrapper">

              <UserRound size={18} />

              <select
                id="role"
                value={role}
                onChange={(e) =>
                  setRole(e.target.value)
                }
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: "16px",
                  cursor: "pointer"
                }}
              >

                <option value="FARMER">
                  Farmer
                </option>

                <option value="ADMIN">
                  Administrator
                </option>

              </select>

            </div>

          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >

            {loading
              ? "Logging in..."
              : "Login"}

          </button>

        </form>

        {/* Register */}
        <p className="auth-footer">

          Don't have an account?{" "}

          <Link to="/register">
            Register
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Login;