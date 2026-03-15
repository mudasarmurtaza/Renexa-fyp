import React, { useEffect, useState } from "react";
import { FaUserCircle, FaEnvelope, FaPhoneAlt, FaMoneyBillWave, FaClipboardList } from "react-icons/fa";

export const CustomerAcceptedProposals = () => {
  const customer = JSON.parse(localStorage.getItem("customer"));
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccepted = async () => {
      try {
        const token = localStorage.getItem("customerToken");
        const customerId = customer?._id || customer?.id;

        if (!customerId) {
          console.error("Customer ID not found in localStorage");
          setLoading(false); // Ensure loading is set to false even if ID is missing
          return;
        }

        const res = await fetch(
          `http://localhost:5000/proposals/customer/${customerId}/accepted`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        if (Array.isArray(data)) {
          setProposals(data);
        } else {
          setProposals([]);
        }
      } catch (error) {
        console.error("Error fetching accepted proposals:", error);
        setProposals([]);
      } finally {
        setLoading(false);
      }
    };

    if (customer?._id || customer?.id) {
      fetchAccepted();
    }
  }, [customer?._id, customer?.id]); // Added customer?._id and customer?.id to dependency array

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading accepted proposals...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="text-center mb-5 fw-bold text-success">My Accepted Proposals</h2>
      {proposals.length === 0 ? (
        <div className="alert alert-info text-center" role="alert">
          <h4 className="alert-heading">No Accepted Proposals!</h4>
          <p>You currently don't have any accepted proposals from contractors.</p>
          <hr />
          <p className="mb-0">Start by creating a new project request!</p>
        </div>
      ) : (
        <div className="row">
          {proposals.map((proposal) => (
            <div key={proposal._id} className="col-md-6 col-lg-4 mb-4">
              <div
                className="card shadow-lg border-success h-100"
                style={{
                  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                  "&:hover": { transform: "translateY(-5px)", boxShadow: "0 1rem 3rem rgba(0,0,0,0.175)" },
                }}
              >
                <div className="card-header bg-success text-white py-3">
                  <h5 className="card-title mb-0 text-white">{proposal.project?.title || "N/A"}</h5>
                </div>
                <div className="card-body d-flex flex-column">
                  <div className="mb-3 pb-3 border-bottom">
                    <h6 className="text-primary mb-2">Contractor Details:</h6>
                    <p className="mb-1">
                      <FaUserCircle className="me-2 text-muted" />
                      <strong>Name:</strong> {proposal.contractor?.name || "N/A"}
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

                  <div className="mt-auto text-end">
                    <span className="badge bg-success fs-6 p-2">{proposal.status}</span>
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
