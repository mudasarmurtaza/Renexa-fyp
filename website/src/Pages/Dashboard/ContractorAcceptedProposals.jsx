import React, { useEffect, useState } from "react";
import { FaUserCircle, FaEnvelope, FaPhoneAlt, FaMoneyBillWave, FaClipboardList } from "react-icons/fa";

export const ContractorAcceptedProposals = () => {
  const contractor = JSON.parse(localStorage.getItem("contractor"));
  console.log("Contractor from localStorage:", contractor);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccepted = async () => {
      try {
        const contractorId = contractor?.id || contractor?._id;
        if (!contractorId) {
          console.error("No contractor ID found in localStorage");
          setLoading(false); // Ensure loading is set to false even if ID is missing
          return;
        }

        const res = await fetch(`http://localhost:5000/contractor/${contractorId}/accepted`);
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        const data = await res.json();

        if (Array.isArray(data)) {
          setProposals(data);
        } else if (Array.isArray(data.proposals)) {
          setProposals(data.proposals);
        } else {
          setProposals([]);
        }
      } catch (error) {
        console.error("Error fetching contractor accepted proposals:", error);
        setProposals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAccepted();
  }, [contractor]);

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
          <h4 className="alert-heading">No Accepted Proposals Yet!</h4>
          <p>You haven't had any proposals accepted by customers yet.</p>
          <hr />
          <p className="mb-0">Keep an eye on new projects and send compelling proposals!</p>
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
                    <h6 className="text-primary mb-2">Customer Details:</h6>
                    <p className="mb-1">
                      <FaUserCircle className="me-2 text-muted" />
                      <strong>Name:</strong> {proposal.customer?.name || "N/A"}
                    </p>
                    <p className="mb-1">
                      <FaEnvelope className="me-2 text-muted" />
                      <strong>Email:</strong> {proposal.customer?.email || "N/A"}
                    </p>
                    <p className="mb-0">
                      <FaPhoneAlt className="me-2 text-muted" />
                      <strong>Phone:</strong> {proposal.customer?.phone || "N/A"}
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
                    <span className="badge bg-success fs-6 p-2">Accepted</span>
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
