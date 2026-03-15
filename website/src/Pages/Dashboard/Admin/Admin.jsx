import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Nav, Navbar, Form, Button } from "react-bootstrap";
import { HouseDoor, ClipboardCheck, ExclamationCircle } from "react-bootstrap-icons";
import { NavLink, useNavigate } from "react-router-dom";
import { RxUpdate } from "react-icons/rx";
import { MdBlock } from "react-icons/md";


export const Admin = () => {
  const [customers, setCustomers] = useState([]);
  const [contractors, setContractors] = useState([]);
  const [activeTab, setActiveTab] = useState(""); // 👈 track which table to show
  const [runningBids, setRunningBids] = useState([]);


  const navigate = useNavigate(); // 👈 hook for navigation

  // Separate search states
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [cnic, setCnic] = useState("");

  // Fetch Customers
  const SeeAllCustomers = async () => {
    try {
      const response = await fetch("http://localhost:5000/customer/list", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const result = await response.json();
      setCustomers(result.list || []);
      setActiveTab("customers");

      // Reset search
      setSearchName("");
      setSearchEmail("");
      setSearchPhone("");
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch Contractors
  const SeeAllContractors = async () => {
    try {
      const response = await fetch("http://localhost:5000/contractor/list", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const result = await response.json();
      setContractors(result.list || []);
      setActiveTab("contractors");

      // Reset search
      setSearchName("");
      setSearchEmail("");
      setSearchPhone("");
    } catch (error) {
      console.error(error);
    }
  };

  // Filtered results of Customers
  const filteredCustomers = customers.filter(
    (c) =>
      (c.name || "").toLowerCase().includes(searchName.toLowerCase()) &&
      (c.email || "").toLowerCase().includes(searchEmail.toLowerCase()) &&
      (c.phone || "").toString().includes(searchPhone)

  );

  // Filtered results of Contractors
  const filteredContractors = contractors.filter(
    (c) =>
      (c.name || "").toLowerCase().includes(searchName.toLowerCase()) &&
      (c.email || "").toLowerCase().includes(searchEmail.toLowerCase()) &&
      (c.phone || "").toString().includes(searchPhone)
  );



  // Fetch Pending Contractors
  const SeePendingContractors = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("http://localhost:5000/admin/contractors/pending", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });
      const result = await response.json();
      setContractors(result.list || []);
      setActiveTab("pendingContractors");

      setSearchName("");
      setSearchEmail("");
      setSearchPhone("");
    } catch (error) {
      console.error(error);
    }
  };

  // Approve contractor
  const approveContractor = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`http://localhost:5000/admin/contractors/${id}/approve`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });

      const result = await response.json();
      if (response.ok) {
        alert("Contractor approved!");
        setContractors(contractors.filter((c) => c._id !== id)); // remove from list
      } else {
        alert(result.message || "Error approving contractor");
      }
    } catch (err) {
      console.error(err);
    }
  };

 const SeeAllRunningBids = async () => {
  try {
    const response = await fetch("http://localhost:5000/admin/running-bids");
    const data = await response.json();

    setActiveTab("runningBids");
    setContractors([]);
    setCustomers([]);
    setRunningBids(data.list || []);
  } catch (error) {
    console.error("Error fetching running bids:", error);
  }
};



  // Reject contractor
  const rejectContractor = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`http://localhost:5000/admin/contractors/${id}/reject`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });

      const result = await response.json();
      if (response.ok) {
        alert("Contractor rejected!");
        setContractors(contractors.filter((c) => c._id !== id)); // remove from list
      } else {
        alert(result.message || "Error rejecting contractor");
      }
    } catch (err) {
      console.error(err);
    }
  };


  //Logout the Admin
  const handleLogout = () => {
    localStorage.removeItem("adminToken"); // 👈 clear token
    navigate("/home"); // 👈 redirect to home page
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div
        className="d-flex flex-column text-white p-3 vh-100"
        style={{ width: "240px", backgroundColor: "rgb(59, 109, 138)" }}
      >
        <div>
          <h4 className="mb-1">Smart House</h4>
          <p className="text-light small">Construction</p>

          <Nav className="flex-column mt-4">
            <NavLink to="#" className="text-white mb-3 text-decoration-none">
              <HouseDoor className="me-2" /> Dashboard
            </NavLink>
            <NavLink onClick={SeePendingContractors} className="text-white mb-3 text-decoration-none">
              <ClipboardCheck className="me-2" /> Contractor Requests
            </NavLink>
            <NavLink
              onClick={SeeAllContractors}
              className="text-white mb-3 text-decoration-none"
            >
              <ExclamationCircle className="me-2" /> See All Contractors
            </NavLink>
            <NavLink
              onClick={SeeAllCustomers}
              className="text-white mb-3 text-decoration-none"
            >
              <ExclamationCircle className="me-2" /> See All Customers
            </NavLink>
            <NavLink
              onClick={SeeAllRunningBids}
              className="text-white mb-3 text-decoration-none"
            >
              <ExclamationCircle className="me-2" /> See All running Bids
            </NavLink>
            <NavLink to="#" className="text-white mb-3 text-decoration-none">
              <ExclamationCircle className="me-2" /> Complaints
            </NavLink>
          </Nav>
        </div>

        {/* Logout button pinned to bottom */}
        <div className="mt-auto">
          <Button variant="outline-light" className="w-100" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1">
        {/* Top Navbar */}
        <Navbar className="px-3 py-4" style={{ backgroundColor: "rgb(59, 109, 138)" }} />

        {/* Content Section */}
        <div className="p-4">
          {/* Customers Table */}
          {activeTab === "customers" && (
            <>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>All Customers</h3>
              </div>

              {/* Three Search Inputs */}
              <Form className="d-flex mb-3">
                <Form.Control
                  type="text"
                  placeholder="Search by customer name..."
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="me-2"
                />
                <Form.Control
                  type="text"
                  placeholder="Search by email..."
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  className="me-2"
                />
                <Form.Control
                  type="text"
                  placeholder="Search by phone..."
                  value={searchPhone}
                  onChange={(e) => setSearchPhone(e.target.value)}
                />
              </Form>

              {filteredCustomers.length === 0 ? (
                <p>No customers found.</p>
              ) : (
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((c, index) => (
                      <tr key={c._id || index}>
                        <td>{index + 1}</td>
                        <td>
                          <NavLink to={`/customer/${c._id}`} className="text-decoration-none text-dark">
                            {c.name}
                          </NavLink>
                        </td>

                        <td>{c.email}</td>
                        <td>{c.phone}</td>
                        <td className="text-center">
                          <div className="d-flex justify-content-center">
                            <button className="btn action-btn btn-sm me-2 fs-4">
                              <RxUpdate />
                            </button>
                            <button className="btn action-btn btn-sm fs-4">
                              <MdBlock />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </>
          )}

          {/* Contractors Table */}
          {activeTab === "contractors" && (
            <>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>All Contractors</h3>
              </div>

              {/* Three Search Inputs */}
              <Form className="d-flex mb-3">
                <Form.Control
                  type="text"
                  placeholder="Search by contractor name..."
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="me-2"
                />
                <Form.Control
                  type="text"
                  placeholder="Search by email..."
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  className="me-2"
                />
                <Form.Control
                  type="text"
                  placeholder="Search by phone..."
                  value={searchPhone}
                  onChange={(e) => setSearchPhone(e.target.value)}
                />
              </Form>

              {filteredContractors.length === 0 ? (
                <p>No contractors found.</p>
              ) : (
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Status</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContractors.map((c, index) => (
                      <tr key={c._id || index}>
                        <td>{index + 1}</td>
                        <td>
                          <NavLink to={`/contractor/${c._id}`} className="text-decoration-none text-dark">
                            {c.name}
                          </NavLink>
                        </td>
                        <td>{c.email}</td>
                        <td>{c.phone}</td>
                        <td>
                          <span
                            className={`badge px-3 py-2 ${c.status === "approved"
                              ? "bg-success"
                              : c.status === "pending"
                                ? "bg-warning text-dark"
                                : "bg-danger"
                              }`}
                          >
                            {c.status || "N/A"}
                          </span>
                        </td>
                        <td className="text-center">
                          <div className="d-flex justify-content-center">
                            <button className="btn action-btn btn-sm me-2 fs-4">
                              <RxUpdate />
                            </button>
                            <button className="btn action-btn btn-sm fs-4">
                              <MdBlock />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </>
          )}

          {/* Pending Contractors Table */}
          {activeTab === "pendingContractors" && (
            <>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>Pending Contractor Requests</h3>
              </div>

              {/* Three Search Inputs */}
              <Form className="d-flex mb-3">
                <Form.Control
                  type="text"
                  placeholder="Search by contractor name..."
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="me-2"
                />
                <Form.Control
                  type="text"
                  placeholder="Search by email..."
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  className="me-2"
                />
                <Form.Control
                  type="text"
                  placeholder="Search by phone..."
                  value={searchPhone}
                  onChange={(e) => setSearchPhone(e.target.value)}
                />
              </Form>

              {filteredContractors.length === 0 ? (
                <p>No pending contractors found.</p>
              ) : (
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>CNIC</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContractors.map((c, index) => (
                      <tr key={c._id || index}>
                        <td>{index + 1}</td>
                        <td>
                          <NavLink to={`/contractor/${c._id}`} className="text-decoration-none text-dark">
                            {c.name}
                          </NavLink>
                        </td>
                        <td>{c.email}</td>
                        <td>{c.phone}</td>
                        <td>{c.cnicNumber || "N/A"}</td>
                        <td className="text-center">
                          <div className="d-flex justify-content-center">
                            <button
                              className="btn btn-success btn-sm me-2"
                              onClick={() => approveContractor(c._id)}
                            >
                              Accept
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => rejectContractor(c._id)}
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </>
          )}

          {/* Running Bids Table */}
{activeTab === "runningBids" && (
  <>
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h3>Running / Accepted Bids</h3>
    </div>

    {runningBids.length === 0 ? (
      <p>No running bids found.</p>
    ) : (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Project Title</th>
            <th>Location</th>
            <th>Budget</th>
            <th>Customer</th>
            <th>Contractor</th>
            <th>Price</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          {runningBids.map((b, index) => (
            <tr key={b._id}>
              <td>{index + 1}</td>
              <td>{b.project?.title}</td>
              <td>{b.project?.location}</td>
              <td>{b.project?.budget}</td>

              {/* Customer Info */}
              <td>
                <strong>{b.customer?.name}</strong><br />
                {b.customer?.email}<br />
                {b.customer?.phone}
              </td>

              {/* Contractor Info */}
              <td>
                <strong>{b.contractor?.name}</strong><br />
                {b.contractor?.email}<br />
                {b.contractor?.phone}
              </td>

              <td>Rs. {b.price}</td>
              <td>{b.message || "No message"}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    )}
  </>
)}



        </div>
      </div>
    </div>
  );
};
