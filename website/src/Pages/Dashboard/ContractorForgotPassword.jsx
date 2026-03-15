import React, { useState } from "react";

export const ContractorForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [step, setStep] = useState(1); 
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");

  // STEP 1 → SEND OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/contractor/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name })
    });

    const data = await res.json();
    setMsg(data.msg);

    if (res.ok) setStep(2);
  };

  // STEP 2 → VERIFY OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/contractor/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp })
    });

    const data = await res.json();
    setMsg(data.msg);

    if (res.ok) setStep(3);
  };

  // STEP 3 → RESET PASSWORD
  const handleResetPassword = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/contractor/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, newPassword })
    });

    const data = await res.json();
    setMsg(data.msg);

    if (res.ok) {
      alert("Password reset successfully!");
      window.location.href = "/contractor-login";
    }
  };

  return (
    <div className="container mt-5">
      <h3>Contractor Forgot Password</h3>
      <p className="text-success">{msg}</p>

      {step === 1 && (
        <form onSubmit={handleSendOTP}>
          <input className="form-control my-2" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="form-control my-2" placeholder="Enter Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <button className="btn btn-primary">Send OTP</button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOTP}>
          <input className="form-control my-2" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
          <button className="btn btn-primary">Verify OTP</button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleResetPassword}>
          <input className="form-control my-2" type="password" placeholder="Enter New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
          <button className="btn btn-success">Reset Password</button>
        </form>
      )}
    </div>
  );
};
