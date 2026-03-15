import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export const CustomerProfile = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await fetch(`http://localhost:5000/customer/${id}`);
        const data = await res.json();
        setCustomer(data);
        console.log(data);
      } catch (err) {
        console.error("Error fetching customer:", err);
      }
    };

    fetchCustomer();
  }, [id]);

  if (!customer) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading customer details...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="card shadow-lg border-0">
        <div className="card-header text-white bg-success text-center">
          <h3 className="mb-0">Customer Profile</h3>
        </div>
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-4 text-center mb-3">
              {customer.profilePic ? (
                <img
                  src={`http://localhost:5000${customer.profilePic}`}
                  alt="Profile"
                  className="rounded-circle border border-3 border-success"
                  style={{ width: "150px", height: "150px", objectFit: "cover" }}
                />
              ) : (
                <div
                  className="rounded-circle bg-secondary d-flex justify-content-center align-items-center text-white"
                  style={{ width: "150px", height: "150px", fontSize: "2rem" }}
                >
                  {customer.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <h4 className="mt-3 text-success">{customer.name}</h4>
              <span className="badge bg-info text-dark px-3 py-2">
                {customer.gender || "Not specified"}
              </span>
            </div>

            <div className="col-md-8">
              <table className="table table-bordered">
                <tbody>
                  <tr>
                    <th scope="row" style={{ width: "30%" }}>📧 Email</th>
                    <td>{customer.email}</td>
                  </tr>
                  <tr>
                    <th scope="row">📞 Phone</th>
                    <td>{customer.phone}</td>
                  </tr>
                  <tr>
                    <th scope="row">🏠 Address</th>
                    <td>{customer.address}</td>
                  </tr>
                  <tr>
                    <th scope="row">🧑 Gender</th>
                    <td>{customer.gender || "N/A"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
