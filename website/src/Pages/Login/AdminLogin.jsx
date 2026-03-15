import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { FaEnvelope, FaLock } from "react-icons/fa6";

export const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/admin/login", {
        email,
        password,
      });
      localStorage.setItem("adminToken", res.data.token); // save JWT
      setMessage("Login successful!");
      navigate("/admin");
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "#bdc5ccff",
        overflow: "hidden",
        padding: "1rem",
      }}
    >
      <div
        className="card p-5 shadow-lg"
        style={{
          width: "100%",
          maxWidth: "400px",
          borderRadius: "1.5rem",
          background: "rgba(15, 23, 42, 0.85)",
          backdropFilter: "blur(15px)",
          border: "1px solid rgba(251, 191, 36, 0.4)",
          color: "#ffffff",
        }}
      >
        <h3
          className="text-center fw-bold mb-4"
          style={{ color: "#fbbf24", textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}
        >
          Admin Login
        </h3>

        <form onSubmit={handleLogin}>
          {/* Email */}
          <div className="mb-3 position-relative">
            <FaEnvelope
              style={{
                position: "absolute",
                top: "50%",
                left: "15px",
                transform: "translateY(-50%)",
                color: "#fbbf24",
              }}
            />
            <input
              type="email"
              className="form-control ps-5"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                borderRadius: "50px",
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#ffffff",
              }}
            />
          </div>

          {/* Password */}
          <div className="mb-3 position-relative">
            <FaLock
              style={{
                position: "absolute",
                top: "50%",
                left: "15px",
                transform: "translateY(-50%)",
                color: "#fbbf24",
              }}
            />
            <input
              type="password"
              className="form-control ps-5"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                borderRadius: "50px",
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#ffffff",
              }}
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="btn w-100 fw-bold mb-3"
            style={{
              background: "linear-gradient(135deg, #fbbf24 0%, #d97706 100%)",
              color: "#0f172a",
              borderRadius: "50px",
              fontSize: "1rem",
              transition: "all 0.3s ease",
              boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-3px)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            Login
          </button>
        </form>

        {message && (
          <p className="text-center mt-3" style={{ color: "#fbbf24" }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};