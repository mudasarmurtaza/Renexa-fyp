import React, { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export const ContractorSendProposal = () => {
  const { projectId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const contractor = JSON.parse(localStorage.getItem("contractor"));
  const contractorId = location.state?.contractorId || contractor?._id;

  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractorId, projectId, price, message }),
      });

      const data = await res.json();
if (res.ok) {
  toast.success("Proposal sent successfully!");
  setTimeout(() => {
    navigate("/All-pending-projects-list");
  }, 1500); // wait 1.5 seconds so toast is visible
} else {
  toast.error(data.error || "Failed to send proposal");
}

    } catch (error) {
      console.error("Error sending proposal:", error);
    }
  };

  return (
    <div className="container mt-4">
       <Toaster />
      <div className="card p-4 shadow-sm">
        <h3 className="mb-3 text-primary">Send Proposal</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Proposed Price (Rs.)</label>
            <input
              type="number"
              className="form-control"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Message</label>
            <textarea
              className="form-control"
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>

          <button type="submit" className="btn btn-success">
            Submit Proposal
          </button>
        </form>
      </div>
    </div>
  );
};
