import React, { useEffect, useState } from "react";
import {
  FaUserCircle, FaEnvelope, FaPhoneAlt,
  FaMoneyBillWave, FaClipboardList, FaStar
} from "react-icons/fa";
import { X, Star, CheckCircle } from "lucide-react";

/* ── Star picker ──────────────────────────────────────────────────────── */
const StarPicker = ({ value, onChange }) => (
  <div className="d-flex gap-2 justify-content-center my-2">
    {[1, 2, 3, 4, 5].map((n) => (
      <Star
        key={n}
        size={32}
        fill={n <= value ? "#f59e0b" : "none"}
        color={n <= value ? "#f59e0b" : "#d1d5db"}
        style={{ cursor: "pointer", transition: "transform 0.1s" }}
        onClick={() => onChange(n)}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
      />
    ))}
  </div>
);

/* ── Rating Modal ─────────────────────────────────────────────────────── */
const RatingModal = ({ proposal, customer, onClose, onSuccess }) => {
  const [rating, setRating]   = useState(0);
  const [review, setReview]   = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]     = useState("");
  const [done, setDone]       = useState(false);

  const contractorId = proposal.contractor?._id || proposal.contractor;

  const handleSubmit = async () => {
    if (rating === 0) { setError("Please select a star rating."); return; }
    setSubmitting(true);
    setError("");

    const custId = customer?._id || customer?.id;
    const custName = customer?.name || "Customer";

    console.log("Submitting rating:", {
      contractorId,
      customerId: custId,
      rating,
      proposalId: proposal._id
    });

    try {
      const res = await fetch(`/contractor/${contractorId}/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId:   custId,
          customerName: custName,
          proposalId:   proposal._id,
          rating,
          review,
        }),
      });
      const data = await res.json();
      if (!res.ok) { 
        console.error("Rating submission failed:", data);
        setError(data.message || "Failed to submit rating."); 
      }
      else { 
        setDone(true); 
        if (onSuccess) onSuccess(proposal._id, rating); 
      }
    } catch (err) { 
      console.error("Network error during rating:", err);
      setError("Network error. Please try again."); 
    }
    finally  { setSubmitting(false); }
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ background: "rgba(0,0,0,0.55)", zIndex: 1060 }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-4 shadow-lg p-4"
        style={{ width: "min(95vw, 480px)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0">Rate Contractor</h5>
          <button className="btn p-0" onClick={onClose}><X size={20} /></button>
        </div>

        {done ? (
          <div className="text-center py-4">
            <CheckCircle size={56} color="#16a34a" />
            <h6 className="mt-3 fw-bold text-success">Rating Submitted!</h6>
            <p className="text-muted">Thanks for your feedback.</p>
            <button className="btn btn-success rounded-pill px-4" onClick={onClose}>Close</button>
          </div>
        ) : (
          <>
            <p className="text-muted mb-1" style={{ fontSize: 14 }}>
              You are rating <strong>{proposal.contractor?.name || "this contractor"}</strong> for:
            </p>
            <p className="fw-semibold mb-3" style={{ color: "#253863" }}>
              {proposal.project?.title || "Your Project"}
            </p>

            {/* Stars */}
            <label className="form-label fw-semibold">Your Rating</label>
            <StarPicker value={rating} onChange={setRating} />
            <p className="text-center mb-3" style={{ fontSize: 13, color: "#f59e0b", minHeight: 20 }}>
              {["","⭐ Poor","⭐⭐ Fair","⭐⭐⭐ Good","⭐⭐⭐⭐ Very Good","⭐⭐⭐⭐⭐ Excellent"][rating]}
            </p>

            {/* Review text */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Review <span className="text-muted fw-normal">(optional)</span></label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Share your experience…"
                value={review}
                onChange={(e) => setReview(e.target.value)}
              />
            </div>

            {error && <div className="alert alert-danger py-2">{error}</div>}

            <button
              className="btn w-100 rounded-pill fw-semibold"
              style={{ background: "#253863", color: "#fff" }}
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "Submitting…" : "Submit Rating"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

/* ── Main Page ────────────────────────────────────────────────────────── */
export const CustomerAcceptedProposals = () => {
  const customer = JSON.parse(localStorage.getItem("customer"));
  const [proposals, setProposals]       = useState([]);
  const [loading, setLoading]           = useState(true);
  const [ratingModal, setRatingModal]   = useState(null); // proposal to rate
  const [rated, setRated]               = useState({});   // { proposalId: starRating }

  useEffect(() => {
    const fetchAccepted = async () => {
      try {
        const token      = localStorage.getItem("customerToken");
        const customerId = customer?._id || customer?.id;
        if (!customerId) { setLoading(false); return; }

        const res  = await fetch(`/proposals/customer/${customerId}/accepted`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setProposals(Array.isArray(data) ? data : []);
      } catch { setProposals([]); }
      finally  { setLoading(false); }
    };

    if (customer?._id || customer?.id) fetchAccepted();
    else setLoading(false);
  }, []);

  const handleRateSuccess = (proposalId, star) => {
    setRated((prev) => ({ ...prev, [proposalId]: star }));
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 300 }}>
        <div className="spinner-border text-success" />
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="text-center mb-5 fw-bold" style={{ color: "#253863" }}>
        My Accepted Proposals
      </h2>

      {proposals.length === 0 ? (
        <div className="alert alert-info text-center">
          <h5 className="alert-heading">No Accepted Proposals!</h5>
          <p className="mb-0">You don't have any accepted proposals yet. Start by creating a project request!</p>
        </div>
      ) : (
        <div className="row">
          {proposals.map((proposal) => {
            const wasRated   = rated[proposal._id];
            const contractorId = proposal.contractor?._id || proposal.contractor;

            return (
              <div key={proposal._id} className="col-md-6 col-lg-4 mb-4">
                <div
                  className="card shadow border-0 h-100 rounded-4 overflow-hidden"
                  style={{ transition: "transform 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
                >
                  {/* Top accent */}
                  <div style={{ height: 5, background: "linear-gradient(90deg,#253863,#16a34a)" }} />

                  <div className="card-header bg-white border-0 pt-3 pb-0">
                    <h6 className="fw-bold mb-0" style={{ color: "#253863" }}>
                      {proposal.project?.title || "N/A"}
                    </h6>
                  </div>

                  <div className="card-body d-flex flex-column gap-2">
                    {/* Contractor info */}
                    <div className="p-3 rounded-3" style={{ background: "#f8fafc" }}>
                      <h6 className="text-primary mb-2" style={{ fontSize: 13 }}>Contractor Details</h6>
                      <p className="mb-1 d-flex align-items-center gap-2" style={{ fontSize: 13 }}>
                        <FaUserCircle className="text-muted" />
                        <strong>Name:</strong> {proposal.contractor?.name || "N/A"}
                      </p>
                      <p className="mb-1 d-flex align-items-center gap-2" style={{ fontSize: 13 }}>
                        <FaEnvelope className="text-muted" />
                        <strong>Email:</strong> {proposal.contractor?.email || "N/A"}
                      </p>
                      <p className="mb-0 d-flex align-items-center gap-2" style={{ fontSize: 13 }}>
                        <FaPhoneAlt className="text-muted" />
                        <strong>Phone:</strong> {proposal.contractor?.phone || "N/A"}
                      </p>
                    </div>

                    {/* Proposal info */}
                    <div className="p-3 rounded-3" style={{ background: "#f0fdf4" }}>
                      <h6 className="text-success mb-2" style={{ fontSize: 13 }}>Proposal Details</h6>
                      <p className="mb-1 d-flex align-items-center gap-2" style={{ fontSize: 13 }}>
                        <FaMoneyBillWave className="text-muted" />
                        <strong>Price:</strong> Rs. {proposal.price || "N/A"}
                      </p>
                      <p className="mb-0 d-flex align-items-center gap-2" style={{ fontSize: 13 }}>
                        <FaClipboardList className="text-muted" />
                        <strong>Message:</strong> {proposal.message || "No message"}
                      </p>
                    </div>
                  </div>

                  <div className="card-footer bg-white border-0 px-3 pb-3 d-flex gap-2">
                    {/* Status badge */}
                    <span className="badge bg-success rounded-pill px-3 py-2 d-flex align-items-center">
                      {proposal.status}
                    </span>

                    {/* Rating button */}
                    {wasRated ? (
                      <span className="ms-auto d-flex align-items-center gap-1 text-warning fw-semibold" style={{ fontSize: 13 }}>
                        <FaStar /> Rated {wasRated}/5
                      </span>
                    ) : (
                      <button
                        className="btn btn-sm rounded-pill ms-auto d-flex align-items-center gap-1"
                        style={{ background: "#253863", color: "#fff", fontSize: 12, fontWeight: 600 }}
                        onClick={() => setRatingModal(proposal)}
                        disabled={!contractorId}
                      >
                        <FaStar /> Rate Contractor
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Rating Modal */}
      {ratingModal && (
        <RatingModal
          proposal={ratingModal}
          customer={customer}
          onClose={() => setRatingModal(null)}
          onSuccess={handleRateSuccess}
        />
      )}
    </div>
  );
};
