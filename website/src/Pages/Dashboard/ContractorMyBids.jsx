import React, { useEffect, useState } from "react";
import { FaProjectDiagram, FaUser, FaMoneyBillWave, FaTrash, FaClock } from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";

export const ContractorMyBids = () => {
  const contractor = JSON.parse(localStorage.getItem("contractor"));
  const token = localStorage.getItem("token");
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBids();
  }, [contractor]);

  const fetchBids = async () => {
    try {
      const contractorId = contractor?.id || contractor?._id;
      if (!contractorId) return;

      const res = await fetch(`/proposals/contractor/${contractorId}`);
      if (!res.ok) throw new Error("Failed to fetch bids");
      const data = await res.json();
      setBids(data);
    } catch (error) {
      console.error("Error fetching bids:", error);
      toast.error("Could not load your bids");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bidId) => {
    if (!window.confirm("Are you sure you want to delete this bid? This action cannot be undone.")) return;

    try {
      const res = await fetch(`/proposals/${bidId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete bid");
      }

      toast.success("Bid deleted successfully");
      setBids((prev) => prev.filter((b) => b._id !== bidId));
    } catch (error) {
      console.error("Error deleting bid:", error);
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading your bids...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <Toaster position="top-right" />
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h2 className="fw-bold text-white mb-0">
          My <span style={{ color: "#fbbf24" }}>Submitted Bids</span>
        </h2>
        <span className="badge bg-warning text-dark px-3 py-2 rounded-pill">
          {bids.length} Active Bids
        </span>
      </div>

      {bids.length === 0 ? (
        <div className="text-center p-5 rounded-4" style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px dashed rgba(255,255,255,0.2)" }}>
          <FaProjectDiagram size={50} className="mb-3 text-muted" />
          <h4 className="text-white">No active bids found</h4>
          <p className="text-muted">You haven't submitted any proposals yet. Check open projects to get started!</p>
        </div>
      ) : (
        <div className="row">
          {bids.map((bid) => (
            <div key={bid._id} className="col-md-6 col-lg-4 mb-4">
              <div 
                className="card h-100 shadow-sm border-0" 
                style={{ 
                  backgroundColor: "#ffffff", 
                  borderRadius: "16px",
                  overflow: "hidden",
                  transition: "transform 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
              >
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="card-title fw-bold text-dark mb-0">{bid.project?.title || "Untitled Project"}</h5>
                    <span className={`badge ${
                      bid.status === "accepted" ? "bg-success" : 
                      bid.status === "shortlisted" ? "bg-info" : 
                      bid.status === "rejected" ? "bg-danger" : "bg-warning text-dark"
                    } rounded-pill`}>
                      {bid.status}
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="d-flex align-items-center text-muted mb-2">
                      <FaUser className="me-2" size={14} />
                      <span>{bid.customer?.name || "N/A"}</span>
                    </div>
                    <div className="d-flex align-items-center text-muted mb-2">
                      <FaMoneyBillWave className="me-2 text-success" size={14} />
                      <span className="fw-bold text-dark">Rs. {bid.price}</span>
                    </div>
                    <div className="d-flex align-items-center text-muted">
                      <FaClock className="me-2" size={14} />
                      <span>{new Date(bid.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {bid.message && (
                    <div className="mb-4 p-2 rounded bg-light">
                      <small className="text-muted d-block mb-1">Your Message:</small>
                      <p className="mb-0 text-dark" style={{ fontSize: "0.9rem", display: "-webkit-box", WebkitLineClamp: "3", WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {bid.message}
                      </p>
                    </div>
                  )}

                  <div className="mt-auto d-flex gap-2">
                    <button 
                      onClick={() => handleDelete(bid._id)}
                      className="btn btn-outline-danger w-100 rounded-pill d-flex align-items-center justify-content-center gap-2"
                      style={{ transition: "all 0.3s" }}
                      disabled={bid.status === "accepted"}
                    >
                      <FaTrash size={14} />
                      {bid.status === "accepted" ? "Cannot Delete" : "Delete Bid"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
