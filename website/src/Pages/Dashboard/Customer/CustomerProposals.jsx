import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { FaUserCircle, FaEnvelope, FaPhoneAlt, FaMoneyBillWave, FaClipboardList, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export const CustomerProposals = () => {
  const customer = JSON.parse(localStorage.getItem("customer"));
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Handle shortlist / reject API calls
  const handleAction = async (id, action) => {
    try {
      const token = localStorage.getItem("customerToken");

      const res = await fetch(`http://localhost:5000/proposals/${id}/${action}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: `Proposal ${action}ed successfully!`,
          timer: 1500,
          showConfirmButton: false,
        });

        // ✅ Remove the proposal from the list after action
        setProposals((prev) =>
          prev.filter((p) => p._id !== id)
        );
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: data.error || "Failed to update proposal",
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong. Please try again.",
      });
    }
  };

  // ✅ Confirmation popup before calling API
  const confirmAction = async (id, action) => {
    const actionText = action === "accept" ? "shortlist" : "reject";

    const result = await Swal.fire({
      title: `Are you sure you want to ${actionText} this proposal?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: action === "accept" ? "#28a745" : "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    if (result.isConfirmed) {
      handleAction(id, action);
    }
  };

  // ✅ Fetch proposals on load
  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const token = localStorage.getItem("customerToken");
        const customerId = customer?._id || customer?.id;

        if (!customerId) {
          console.error("Customer ID not found in localStorage");
          setLoading(false);
          return;
        }

        const res = await fetch(
          `http://localhost:5000/proposals/customer/${customerId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        console.log("Fetched proposals:", data);

        if (Array.isArray(data)) {
          setProposals(data.filter((p) => p.status === "pending"));
        } else {
          setProposals([]);
        }
      } catch (error) {
        console.error("Error fetching proposals:", error);
        setProposals([]);
      } finally {
        setLoading(false);
      }
    };

    if (customer?._id || customer?.id) {
      fetchProposals();
    }
  }, [customer?._id, customer?.id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading proposals...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="text-center mb-5 fw-bold text-primary">Proposals Received</h2>
      {proposals.length === 0 ? (
        <div className="alert alert-info text-center" role="alert">
          <h4 className="alert-heading">No Proposals Yet!</h4>
          <p>You haven't received any proposals for your projects yet.</p>
          <hr />
          <p className="mb-0">Contractors will send proposals once they find your project interesting.</p>
        </div>
      ) : (
        <div className="row">
          {proposals.map((proposal) => (
            <div key={proposal._id} className="col-md-6 col-lg-4 mb-4">
              <div
                className="card shadow-lg h-100"
                style={{
                  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                  "&:hover": { transform: "translateY(-5px)", boxShadow: "0 1rem 3rem rgba(0,0,0,0.175)" },
                }}
              >
                <div className="card-header bg-primary text-white py-3">
                  <h5 className="card-title mb-0 text-white">{proposal.project?.title || "N/A"}</h5>
                </div>
                <div className="card-body d-flex flex-column">
                  <div className="mb-3 pb-3 border-bottom">
                    <h6 className="text-primary mb-2">Contractor Details:</h6>
                    <p className="mb-1">
                      <FaUserCircle className="me-2 text-muted" />
                      <strong>Name:</strong>{" "}
                      <Link
                        to={`/contractor/${proposal.contractor?._id}`}
                        className="text-decoration-none text-primary fw-semibold"
                      >
                        {proposal.contractor?.name || "N/A"}
                      </Link>
                    </p>
                    <p className="mb-1">
                      <FaEnvelope className="me-2 text-muted" />
                      <strong>Email:</strong> {proposal.contractor?.email || "N/A"}
                    </p>
                    <p className="mb-0">
                      <FaPhoneAlt className="me-2 text-muted" />
                      <strong>Phone:</strong> {proposal.contractor?.phone || "N/A"}
                    </p>
                  </div>

                  <div className="flex-grow-1 mb-3">
                    <h6 className="text-primary mb-2">Proposal Details:</h6>
                    <p className="mb-1">
                      <FaMoneyBillWave className="me-2 text-muted" />
                      <strong>Proposed Price:</strong> Rs. {proposal.price || "N/A"}
                    </p>
                    <p className="mb-0">
                      <FaClipboardList className="me-2 text-muted" />
                      <strong>Message:</strong> {proposal.message || "No message"}
                    </p>
                  </div>

                  <div className="mt-auto d-flex gap-2 justify-content-end">
                    <button
                      className="btn btn-success btn-sm d-flex align-items-center"
                      onClick={() => confirmAction(proposal._id, "accept")}
                    >
                      <FaCheckCircle className="me-1" /> Shortlist
                    </button>
                    <button
                      className="btn btn-danger btn-sm d-flex align-items-center"
                      onClick={() => confirmAction(proposal._id, "reject")}
                    >
                      <FaTimesCircle className="me-1" /> Reject
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
}