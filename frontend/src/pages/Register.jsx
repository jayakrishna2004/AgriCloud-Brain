import { useState } from "react";
import {
  Link,
  useNavigate
} from "react-router-dom";

import { Sprout } from "lucide-react";

import { useAuth } from "../context/AuthContext";

function Register() {

  const navigate = useNavigate();

  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "FARMER"
  });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    if (
      !form.name ||
      !form.email ||
      !form.password
    ) {

      setError(
        "Please fill all fields"
      );

      return;
    }

    try {

      setLoading(true);

      await register(form);

      alert(
        "Registration successful. Please login."
      );

      navigate("/login");

    } catch (error) {

      setError(
        error.message ||
        "Registration failed"
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-logo">
          <Sprout size={45} />
        </div>

        <h1>Create Account</h1>

        <p className="auth-subtitle">
          Join AgriCloud-Brain
        </p>

        {error && (
          <div
            style={{
              background: "#fee2e2",
              color: "#b91c1c",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "15px"
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="input-group">

            <label>Name</label>

            <input
              name="name"
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={handleChange}
            />

          </div>

          <div className="input-group">

            <label>Email</label>

            <input
              name="email"
              type="email"
              placeholder="Your email"
              value={form.email}
              onChange={handleChange}
            />

          </div>

          <div className="input-group">

            <label>Password</label>

            <input
              name="password"
              type="password"
              placeholder="Create password"
              value={form.password}
              onChange={handleChange}
            />

          </div>

          <div className="input-group">

            <label>Role</label>

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
            >

              <option value="FARMER">
                Farmer
              </option>

              <option value="ADMIN">
                Administrator
              </option>

            </select>

          </div>

          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >

            {loading
              ? "Creating..."
              : "Create Account"}

          </button>

        </form>

        <p className="auth-footer">

          Already have an account?{" "}

          <Link to="/login">
            Login
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Register;