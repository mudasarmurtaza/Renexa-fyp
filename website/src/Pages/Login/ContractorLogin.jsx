import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, NavLink } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa6";

export const ContractorLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [contractor, setContractor] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:5000/contractor/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("contractor", JSON.stringify(data.contractor));
        window.dispatchEvent(new Event("authChange"));
        setContractor(data.contractor);
        alert("Login successful!");
        navigate("/contractor-profile");
      } else {
        setError(data.msg || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "#bdc5ccff",
        overflow: "hidden",
        padding: "1rem"
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
          color: "#ffffff"
        }}
      >
        <h3
          className="text-center fw-bold mb-4"
          style={{ color: "#fbbf24", textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}
        >
          Contractor Login
        </h3>

        <form onSubmit={handleLogin}>
          {/* Email */}
          <div className="mb-3 position-relative">
            <FaEnvelope style={{ position: "absolute", top: "50%", left: "15px", transform: "translateY(-50%)", color: "#fbbf24" }} />
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
                color: "#ffffff"
              }}
            />
          </div>

          {/* Password */}
          <div className="mb-3 position-relative">
            <FaLock style={{ position: "absolute", top: "50%", left: "15px", transform: "translateY(-50%)", color: "#fbbf24" }} />
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
                color: "#ffffff"
              }}
            />
          </div>

          {/* Error Message */}
          {error && <p className="text-warning text-center">{error}</p>}

          {/* Forgot Password */}
          <div className="mb-3 text-end">
            <NavLink
              to="/contractor-forgot-password"
              className="text-decoration-none"
              style={{ color: "#fbbf24", fontSize: "14px" }}
            >
              Forgot Password?
            </NavLink>
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
              boxShadow: "0 8px 20px rgba(0,0,0,0.3)"
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-3px)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            Login
          </button>
        </form>

        {/* Signup Link */}
        <p className="text-center mt-3 mb-0" style={{ fontSize: "14px", color: "#fbbf24" }}>
          Don’t have an account?{' '}
          <NavLink
            to="/contractor-signup"
            className="fw-bold text-decoration-none"
            style={{ color: "#fbbf24" }}
          >
            Signup
          </NavLink>
        </p>

        {/* Show contractor info after login */}
        {contractor && (
          <div className="mt-4 text-center">
            <h6 style={{ color: "#ffffff" }}>Welcome, {contractor.name}!</h6>
            {contractor.profilePic && (
              <img
                src={`http://localhost:5000${contractor.profilePic}`}
                alt="Profile"
                className="rounded-circle mt-2"
                style={{ width: "80px", height: "80px", objectFit: "cover", border: "2px solid #fbbf24" }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};