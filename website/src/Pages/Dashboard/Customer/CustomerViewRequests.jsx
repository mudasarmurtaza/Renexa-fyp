import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaRulerCombined, FaMoneyBillWave, FaCalendarAlt, FaTrash, FaTag, FaInfoCircle } from "react-icons/fa";
import { MdCategory } from "react-icons/md";
import Swal from "sweetalert2";

export const CustomerViewRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const result = JSON.parse(localStorage.getItem("customer"));
      const customerId = result?.id || result?._id;

      if (!customerId) {
        console.error("Customer ID not found in localStorage");
        setLoading(false);
        return;
      }

      const res = await fetch(`http://localhost:5000/customer/projects/${customerId}`);
      const data = await res.json();

      if (res.ok) {
        setRequests(data.projects);
      } else {
        setRequests([]);
      }
    } catch (error) {
      console.error(error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // ✅ Delete request handler
  const handleDelete = async (requestId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`http://localhost:5000/customer/projects/${requestId}`, {
            method: "DELETE",
          });

          const data = await res.json();
          if (res.ok) {
            Swal.fire("Deleted!", data.message, "success");
            setRequests(requests.filter((r) => r._id !== requestId));
          } else {
            Swal.fire("Error!", data.message || "Error deleting request", "error");
          }
        } catch (err) {
          console.error(err);
          Swal.fire("Error!", "Something went wrong", "error");
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading requests...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="text-center mb-5 fw-bold text-primary">Your Project Requests</h2>

      {requests.length === 0 ? (
        <div className="alert alert-info text-center" role="alert">
          <h4 className="alert-heading">No Project Requests Submitted!</h4>
          <p>You have not submitted any project requests yet.</p>
          <hr />
          <p className="mb-0">Click the "Create New Project" button to get started.</p>
        </div>
      ) : (
        <div className="row">
          {requests.map((req) => (
            <div key={req._id} className="col-md-6 col-lg-4 mb-4">
              <div
                className="card shadow-lg h-100"
                style={{
                  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                  "&:hover": { transform: "translateY(-5px)", boxShadow: "0 1rem 3rem rgba(0,0,0,0.175)" },
                }}
              >
                <div className="card-header bg-primary text-white py-3">
                  <h5 className="card-title mb-0 text-white">{req.title}</h5>
                </div>
                <div className="card-body d-flex flex-column">
                  <div className="flex-grow-1 mb-3">
                    <p className="card-text mb-2">
                      <MdCategory className="text-muted me-2" />
                      <strong>Category:</strong> {req.category}
                    </p>
                    <p className="card-text mb-2">
                      <FaMapMarkerAlt className="text-muted me-2" />
                      <strong>Location:</strong> {req.location}
                    </p>
                    <p className="card-text mb-2">
                      <FaRulerCombined className="text-muted me-2" />
                      <strong>Plot Size:</strong> {req.plotSize}
                    </p>
                    <p className="card-text mb-2">
                      <FaMoneyBillWave className="text-muted me-2" />
                      <strong>Budget:</strong> {req.budget ? `Rs. ${req.budget}` : "N/A"}
                    </p>
                    <p className="card-text mb-2">
                      <FaCalendarAlt className="text-muted me-2" />
                      <strong>Deadline:</strong> {req.deadline ? new Date(req.deadline).toLocaleDateString("en-GB") : "N/A"}
                    </p>
                    <p className="card-text mb-2">
                      <FaInfoCircle className="me-2 text-muted" />
                      <strong>Description:</strong> {req.description || "N/A"}
                    </p>
                    <p className="card-text mb-0">
                      <FaTag className="me-2 text-muted" />
                      <strong>Status:</strong>{" "}
                      <span
                        className={`badge ${
                          req.status === "pending" ? "bg-warning text-dark" : "bg-success"
                        }`}
                      >
                        {req.status}
                      </span>
                    </p>
                  </div>

                  {req.attachments?.length > 0 && (
                    <div className="mt-3">
                      <h6 className="fw-bold mb-2">Attachments:</h6>
                      <div className="d-flex flex-wrap gap-2">
                        {req.attachments.map((img, i) => (
                          <img
                            key={i}
                            src={`http://localhost:5000${img}`}
                            alt="attachment"
                            className="img-thumbnail rounded shadow-sm"
                            style={{ width: "100px", height: "100px", objectFit: "cover" }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Delete button */}
                  <div className="mt-4 text-end">
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(req._id)}
                    >
                      <FaTrash className="me-1" /> Delete Request
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
