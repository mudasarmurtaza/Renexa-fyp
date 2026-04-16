import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { NavLink, useNavigate } from "react-router-dom";
import { FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaLock } from "react-icons/fa";

export const CustomerSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });
  const [profilePic, setProfilePic] = useState(null);
  // handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // handle file change
  const handleFileChange = (e) => {
    setProfilePic(e.target.files[0]);
  };

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const formDataToSend = new FormData(); // ✅ multipart form
      Object.keys(formData).forEach((key) => {
        if (key !== "confirmPassword") {
          formDataToSend.append(key, formData[key]);
        }
      });
      if (profilePic) {
        formDataToSend.append("profilePic", profilePic); // ✅ add image
        console.log("Attached profile Pic to FormData:", profilePic.name);
      } else {
        console.log("No profile Pic selected to attach.");
      }

      const res = await fetch("/customer/signup", { // ✅ fixed absolute API
        method: "POST",
        body: formDataToSend,
      });

      const data = await res.json();

      if (res.ok) {
        alert("Customer Signup successful!");
        navigate("/customer-login"); // ✅ redirect to login
      } else {
        alert(data.error || "Signup failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Try again.");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{
        background: "#bdc5ccff",
        overflow: "hidden",
        padding: "2rem 1rem",
      }}
    >
      <div
        className="card p-4 shadow-lg"
        style={{
          width: "100%",
          maxWidth: "1000px",
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
          Customer Signup
        </h3>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Row 1: Name, Phone, Email */}
          <div className="row mb-3">
            <div className="col-md-4 position-relative mb-3 mb-md-0">
              <FaUser style={{ position: "absolute", top: "50%", left: "25px", transform: "translateY(-50%)", color: "#fbbf24" }} />
              <input type="text" className="form-control ps-5" name="name" placeholder="Enter your name" value={formData.name} onChange={handleChange} style={{ borderRadius: "50px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#ffffff" }} />
            </div>
            <div className="col-md-4 position-relative mb-3 mb-md-0">
              <FaPhone style={{ position: "absolute", top: "50%", left: "25px", transform: "translateY(-50%)", color: "#fbbf24" }} />
              <input type="text" className="form-control ps-5" name="phone" placeholder="Enter your phone number" value={formData.phone} onChange={handleChange} style={{ borderRadius: "50px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#ffffff" }} />
            </div>
            <div className="col-md-4 position-relative">
              <FaEnvelope style={{ position: "absolute", top: "50%", left: "25px", transform: "translateY(-50%)", color: "#fbbf24" }} />
              <input type="email" className="form-control ps-5" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} style={{ borderRadius: "50px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#ffffff" }} />
            </div>
          </div>

          {/* Row 2: Address, Password, Confirm Password */}
          <div className="row mb-3">
            <div className="col-md-4 position-relative mb-3 mb-md-0">
              <FaMapMarkerAlt style={{ position: "absolute", top: "50%", left: "25px", transform: "translateY(-50%)", color: "#fbbf24" }} />
              <input type="text" className="form-control ps-5" name="address" placeholder="Enter your address" value={formData.address} onChange={handleChange} style={{ borderRadius: "50px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#ffffff" }} />
            </div>
            <div className="col-md-4 position-relative mb-3 mb-md-0">
              <FaLock style={{ position: "absolute", top: "50%", left: "25px", transform: "translateY(-50%)", color: "#fbbf24" }} />
              <input type="password" className="form-control ps-5" name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} style={{ borderRadius: "50px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#ffffff" }} />
            </div>
            <div className="col-md-4 position-relative">
              <FaLock style={{ position: "absolute", top: "50%", left: "25px", transform: "translateY(-50%)", color: "#fbbf24" }} />
              <input type="password" className="form-control ps-5" name="confirmPassword" placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange} style={{ borderRadius: "50px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#ffffff" }} />
            </div>
          </div>

          {/* Row 3: Gender & Profile Pic */}
          <div className="row mb-3 align-items-center">
            <div className="col-md-6 mb-3 mb-md-0">
              <label className="form-label fw-semibold me-3 mb-0" style={{ color: "#fbbf24" }}>Gender</label>
              <div className="d-inline-block">
                <div className="form-check form-check-inline">
                  <input className="form-check-input" type="radio" name="gender" value="Male" checked={formData.gender === "Male"} onChange={handleChange} />
                  <label className="form-check-label text-white">Male</label>
                </div>
                <div className="form-check form-check-inline">
                  <input className="form-check-input" type="radio" name="gender" value="Female" checked={formData.gender === "Female"} onChange={handleChange} />
                  <label className="form-check-label text-white">Female</label>
                </div>
                <div className="form-check form-check-inline">
                  <input className="form-check-input" type="radio" name="gender" value="Other" checked={formData.gender === "Other"} onChange={handleChange} />
                  <label className="form-check-label text-white">Other</label>
                </div>
              </div>
            </div>
            <div className="col-md-6 d-flex align-items-center">
              <label className="form-label fw-semibold me-2 mb-0 text-nowrap" style={{ color: "#fbbf24" }}>Profile Picture (Optional)</label>
              <input type="file" className="form-control form-control-sm" name="profilePic" accept="image/*" onChange={handleFileChange} style={{ borderRadius: "50px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#ffffff" }} />
            </div>
          </div>

          <div className="d-grid mt-4">
            <button
              type="submit"
              className="btn fw-bold py-2"
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
              Signup
            </button>
          </div>

          <p className="text-center mt-3 mb-0" style={{ fontSize: "14px", color: "#fbbf24" }}>
            Already have an account?{" "}
            <NavLink
              to="/customer-login"
              className="fw-bold text-decoration-none"
              style={{ color: "#fbbf24" }}
            >
              Login
            </NavLink>
          </p>
        </form>
      </div>
    </div>
  );
};
