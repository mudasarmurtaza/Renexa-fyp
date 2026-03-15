import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export const ContractorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contractor, setContractor] = useState(null);

  useEffect(() => {
    const fetchContractor = async () => {
      try {
        const res = await fetch(`http://localhost:5000/contractor/${id}`);
        const data = await res.json();
        setContractor(data);
      } catch (err) {
        console.error("Error fetching contractor:", err);
      }
    };

    fetchContractor();
  }, [id]);

  const approveContractor = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `http://localhost:5000/admin/contractors/${id}/approve`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert("✅ Contractor Approved!");
        setContractor({ ...contractor, status: "approved" });
      } else {
        alert(result.message || "Approval failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const rejectContractor = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `http://localhost:5000/admin/contractors/${id}/reject`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert("❌ Contractor Rejected!");
        setContractor({ ...contractor, status: "rejected" });
      } else {
        alert(result.message || "Rejection failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!contractor) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">
            Loading contractor details...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="card shadow-lg border-0 rounded-3">
        <div className="card-header text-white bg-primary text-center rounded-top-3 py-3">
          <h3 className="mb-0">Contractor Profile</h3>
        </div>

        <div className="card-body p-4">
          <div className="row align-items-center">
            {/** Profile Image + Name **/}
            <div className="col-md-4 text-center mb-3">
              {contractor.profilePic ? (
                <img
                  src={`http://localhost:5000${contractor.profilePic}`}
                  alt="Profile"
                  className="rounded-circle border border-3 border-primary"
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  className="rounded-circle bg-secondary d-flex justify-content-center align-items-center text-white"
                  style={{
                    width: "150px",
                    height: "150px",
                    fontSize: "2rem",
                  }}
                >
                  {contractor.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <h4 className="mt-3 text-primary fw-bold">{contractor.name}</h4>
              <span className="badge bg-info text-dark px-3 py-2 rounded-pill">
                {contractor.gender || "Not specified"}
              </span>
            </div>

            {/** Contractor Info Table **/}
            <div className="col-md-8">
              <table className="table table-bordered table-striped table-hover mt-3">
                <tbody>
                  <tr>
                    <th className="bg-light text-secondary">📧 Email</th>
                    <td>{contractor.email}</td>
                  </tr>

                  <tr>
                    <th className="bg-light text-secondary">📞 Phone</th>
                    <td>{contractor.phone}</td>
                  </tr>

                  <tr>
                    <th className="bg-light text-secondary">🏠 Address</th>
                    <td>{contractor.address || "N/A"}</td>
                  </tr>

                  <tr>
                    <th className="bg-light text-secondary">🆔 CNIC Number</th>
                    <td>{contractor.cnicNumber || "N/A"}</td>
                  </tr>

                  <tr>
                    <th className="bg-light text-secondary">🛠 Status</th>
                    <td>
                      <span
                        className={`badge px-3 py-2 rounded-pill ${
                          contractor.status === "approved"
                            ? "bg-success"
                            : contractor.status === "pending"
                            ? "bg-warning text-dark"
                            : "bg-danger"
                        }`}
                      >
                        {contractor.status}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/** ✅ Approve / Reject Buttons **/}
              {contractor.status === "pending" && (
                <div className="d-flex justify-content-start mt-3 gap-2">
                  <button
                    className="btn btn-success btn-sm"
                    onClick={approveContractor}
                  >
                    ✅ Approve
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={rejectContractor}
                  >
                    ❌ Reject
                  </button>
                </div>
              )}
            </div>
          </div>

          {/** Documents section **/}
          <div className="mt-4">
            <h4 className="mb-3 text-primary fw-bold">Uploaded Documents</h4>
            <div className="row g-4">
              {contractor.cnicFront && (
                <div className="col-md-4 text-center">
                  <h6>CNIC Front</h6>
                  <img
                    src={`http://localhost:5000${contractor.cnicFront}`}
                    alt="CNIC Front"
                    className="img-fluid border rounded"
                    style={{ maxHeight: "200px", objectFit: "contain" }}
                  />
                </div>
              )}

              {contractor.cnicBack && (
                <div className="col-md-4 text-center">
                  <h6>CNIC Back</h6>
                  <img
                    src={`http://localhost:5000${contractor.cnicBack}`}
                    alt="CNIC Back"
                    className="img-fluid border rounded"
                    style={{ maxHeight: "200px", objectFit: "contain" }}
                  />
                </div>
              )}

              {contractor.verificationImage && (
                <div className="col-md-4 text-center">
                  <h6>Verification Document</h6>
                  <img
                    src={`http://localhost:5000${contractor.verificationImage}`}
                    alt="Verification"
                    className="img-fluid border rounded"
                    style={{ maxHeight: "200px", objectFit: "contain" }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="card-footer text-muted text-center py-3 bg-light rounded-bottom-3">
          <small>&copy; {new Date().getFullYear()} Contractor Connect</small>
        </div>
      </div>
    </div>
  );
};
