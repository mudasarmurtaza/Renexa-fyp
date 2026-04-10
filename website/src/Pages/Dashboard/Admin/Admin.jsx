import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Nav, Navbar, Form, Button, Modal } from "react-bootstrap";
import { HouseDoor, ClipboardCheck, ExclamationCircle } from "react-bootstrap-icons";
import { NavLink, useNavigate } from "react-router-dom";
import { RxUpdate } from "react-icons/rx";
import { MdBlock } from "react-icons/md";


export const Admin = () => {
  const [customers, setCustomers] = useState([]);
  const [contractors, setContractors] = useState([]);
  const [activeTab, setActiveTab] = useState(""); // 👈 track which table to show
  const [runningBids, setRunningBids] = useState([]);

  // Search states for bids
  const [searchBidProject, setSearchBidProject] = useState("");
  const [searchBidContractor, setSearchBidContractor] = useState("");
  const [searchBidStatus, setSearchBidStatus] = useState("");

  // Image Modal states
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState("");
  const [modalImageTitle, setModalImageTitle] = useState("");

  const openImageModal = (src, title) => {
    setModalImageSrc(src);
    setModalImageTitle(title);
    setShowImageModal(true);
  };


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
      const token = localStorage.getItem("adminToken");
      const response = await fetch("http://localhost:5000/admin/running-bids", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });
      const data = await response.json();

      setActiveTab("runningBids");
      setContractors([]);
      setCustomers([]);
      setRunningBids(data.list || []);

      // Reset search
      setSearchName("");
      setSearchEmail("");
      setSearchPhone("");
      setSearchBidProject("");
      setSearchBidContractor("");
    } catch (error) {
      console.error("Error fetching running bids:", error);
    }
  };



  // Filtered results of Running Bids
  const filteredBids = runningBids.filter(
    (b) =>
      (b.project?.title || "").toLowerCase().includes(searchBidProject.toLowerCase()) &&
      (b.contractor?.name || "").toLowerCase().includes(searchBidContractor.toLowerCase()) &&
      (b.status || "").toLowerCase().includes(searchBidStatus.toLowerCase())
  );

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
        className="d-flex flex-column text-white vh-100 shadow-lg border-end border-white border-opacity-10"
        style={{
          width: "280px",
          background: "linear-gradient(180deg, #2c3e50 0%, #34495e 100%)",
          zIndex: 1000
        }}
      >
        <div className="p-4">
          <div className="d-flex align-items-center mb-4 pb-3 border-bottom border-white border-opacity-10">
            <div className="bg-white rounded-circle p-2 me-3 shadow-sm">
              <HouseDoor className="text-dark fs-4" />
            </div>
            <div>
              <h4 className="mb-0 fw-bold tracking-tight">Smart House</h4>
              <p className="text-white text-opacity-50 small mb-0">Management Console</p>
            </div>
          </div>

          <Nav className="flex-column gap-2 mt-2">
            <NavLink
              to="#"
              className="text-white text-opacity-75 text-decoration-none d-flex align-items-center p-3 rounded-3 transition-all"
              style={{ transition: "all 0.2s" }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <HouseDoor className="me-3 fs-5" /> Dashboard
            </NavLink>

            <NavLink
              onClick={SeePendingContractors}
              className={`text-white text-opacity-75 text-decoration-none d-flex align-items-center p-3 rounded-3 transition-all ${activeTab === "pendingContractors" ? "bg-white bg-opacity-10 text-opacity-100 shadow-sm" : ""}`}
              style={{ cursor: "pointer" }}
            >
              <ClipboardCheck className="me-3 fs-5" /> Contractor Requests
            </NavLink>

            <NavLink
              onClick={SeeAllContractors}
              className={`text-white text-opacity-75 text-decoration-none d-flex align-items-center p-3 rounded-3 transition-all ${activeTab === "contractors" ? "bg-white bg-opacity-10 text-opacity-100 shadow-sm" : ""}`}
              style={{ cursor: "pointer" }}
            >
              <ExclamationCircle className="me-3 fs-5" /> All Contractors
            </NavLink>

            <NavLink
              onClick={SeeAllCustomers}
              className={`text-white text-opacity-75 text-decoration-none d-flex align-items-center p-3 rounded-3 transition-all ${activeTab === "customers" ? "bg-white bg-opacity-10 text-opacity-100 shadow-sm" : ""}`}
              style={{ cursor: "pointer" }}
            >
              <ExclamationCircle className="me-3 fs-5" /> All Customers
            </NavLink>

            <NavLink
              onClick={SeeAllRunningBids}
              className={`text-white text-opacity-75 text-decoration-none d-flex align-items-center p-3 rounded-3 transition-all ${activeTab === "runningBids" ? "bg-white bg-opacity-10 text-opacity-100 shadow-sm" : ""}`}
              style={{ cursor: "pointer" }}
            >
              <ClipboardCheck className="me-3 fs-5" /> Running Bids
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
      <div className="flex-grow-1 bg-light" style={{ overflowY: "auto", height: "100vh" }}>
        {/* Top Navbar */}
        <Navbar
          className="px-4 py-3 bg-white shadow-sm sticky-top"
          style={{ height: "70px" }}
        >
          <div className="d-flex justify-content-between w-100 align-items-center">
            <h5 className="mb-0 fw-semibold text-secondary">
              {activeTab ? activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace(/([A-Z])/g, ' $1') : "Dashboard Overview"}
            </h5>
            <div className="d-flex align-items-center gap-3">
              <span className="text-muted small">Welcome, Administrator</span>
              <div className="bg-primary bg-opacity-10 p-2 rounded-circle" style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span className="text-primary fw-bold">A</span>
              </div>
            </div>
          </div>
        </Navbar>

        {/* Content Section */}
        <div className="p-4">
          {/* Customers Table */}
          {activeTab === "customers" && (
            <>
              <div className="mb-4">
                <h3 className="fw-bold text-dark">All Customers</h3>
                <p className="text-muted">Manage registered customers and their access.</p>
              </div>

              {/* Advanced Search UI */}
              <div className="bg-white p-4 rounded-4 shadow-sm mb-4">
                <Form className="row g-3">
                  <div className="col-md-4">
                    <Form.Label className="small fw-semibold text-muted">Customer Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Search by name..."
                      value={searchName}
                      onChange={(e) => setSearchName(e.target.value)}
                      className="border-0 bg-light p-2"
                    />
                  </div>
                  <div className="col-md-4">
                    <Form.Label className="small fw-semibold text-muted">Email Address</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Search by email..."
                      value={searchEmail}
                      onChange={(e) => setSearchEmail(e.target.value)}
                      className="border-0 bg-light p-2"
                    />
                  </div>
                  <div className="col-md-4">
                    <Form.Label className="small fw-semibold text-muted">Phone Number</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Search by phone..."
                      value={searchPhone}
                      onChange={(e) => setSearchPhone(e.target.value)}
                      className="border-0 bg-light p-2"
                    />
                  </div>
                </Form>
              </div>

              {filteredCustomers.length === 0 ? (
                <div className="text-center py-5 bg-white rounded-4 shadow-sm">
                  <p className="text-muted">No customers found.</p>
                </div>
              ) : (
                <div className="table-responsive rounded-4 shadow-sm bg-white overflow-hidden">
                  <Table hover className="align-middle mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th className="px-4 py-3 border-0">#</th>
                        <th className="py-3 border-0">Customer Details</th>
                        <th className="py-3 border-0 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCustomers.map((c, index) => (
                        <tr key={c._id || index}>
                          <td className="px-4">{index + 1}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3 text-primary fw-bold">
                                {c.name?.charAt(0)}
                              </div>
                              <div>
                                <NavLink to={`/customer/${c._id}`} className="text-decoration-none text-dark fw-bold mb-0">
                                  {c.name}
                                </NavLink>
                                <div className="text-muted small">{c.email}</div>
                                <div className="text-muted small">{c.phone}</div>
                              </div>
                            </div>
                          </td>
                          <td className="text-center">
                            <button className="btn btn-outline-primary btn-sm rounded-pill px-3 me-2">
                              <RxUpdate className="me-1" /> Update
                            </button>
                            <button className="btn btn-outline-danger btn-sm rounded-pill px-3">
                              <MdBlock className="me-1" /> Block
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </>
          )}

          {/* Contractors Table */}
          {activeTab === "contractors" && (
            <>
              <div className="mb-4">
                <h3 className="fw-bold text-dark">All Contractors</h3>
                <p className="text-muted">Monitor and manage all registered construction contractors.</p>
              </div>

              {/* Advanced Search UI */}
              <div className="bg-white p-4 rounded-4 shadow-sm mb-4">
                <Form className="row g-3">
                  <div className="col-md-4">
                    <Form.Label className="small fw-semibold text-muted">Contractor Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Search by name..."
                      value={searchName}
                      onChange={(e) => setSearchName(e.target.value)}
                      className="border-0 bg-light p-2"
                    />
                  </div>
                  <div className="col-md-4">
                    <Form.Label className="small fw-semibold text-muted">Email Address</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Search by email..."
                      value={searchEmail}
                      onChange={(e) => setSearchEmail(e.target.value)}
                      className="border-0 bg-light p-2"
                    />
                  </div>
                  <div className="col-md-4">
                    <Form.Label className="small fw-semibold text-muted">Phone Number</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Search by phone..."
                      value={searchPhone}
                      onChange={(e) => setSearchPhone(e.target.value)}
                      className="border-0 bg-light p-2"
                    />
                  </div>
                </Form>
              </div>

              {filteredContractors.length === 0 ? (
                <div className="text-center py-5 bg-white rounded-4 shadow-sm">
                  <p className="text-muted">No contractors found.</p>
                </div>
              ) : (
                <div className="table-responsive rounded-4 shadow-sm bg-white overflow-hidden">
                  <Table hover className="align-middle mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th className="px-4 py-3 border-0">#</th>
                        <th className="py-3 border-0">Contractor Details</th>
                        <th className="py-3 border-0">Status</th>
                        <th className="py-3 border-0 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredContractors.map((c, index) => (
                        <tr key={c._id || index}>
                          <td className="px-4">{index + 1}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="bg-info bg-opacity-10 rounded-circle p-3 me-3 text-info fw-bold" style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                {c.name?.charAt(0)}
                              </div>
                              <div>
                                <NavLink to={`/contractor/${c._id}`} className="text-decoration-none text-dark fw-bold mb-0">
                                  {c.name}
                                </NavLink>
                                <div className="text-muted small">{c.email}</div>
                                <div className="text-muted small">{c.phone}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span
                              className={`badge rounded-pill px-3 py-2 ${c.status === "approved"
                                ? "bg-success bg-opacity-10 text-success"
                                : c.status === "pending"
                                  ? "bg-warning bg-opacity-10 text-dark"
                                  : "bg-danger bg-opacity-10 text-danger"
                                }`}
                              style={{ border: "1px solid currentColor" }}
                            >
                              {c.status?.toUpperCase() || "N/A"}
                            </span>
                          </td>
                          <td className="text-center">
                            <button className="btn btn-outline-primary btn-sm rounded-pill px-3 me-2">
                              <RxUpdate className="me-1" /> Update
                            </button>
                            <button className="btn btn-outline-danger btn-sm rounded-pill px-3">
                              <MdBlock className="me-1" /> Block
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </>
          )}

          {/* Pending Contractors Table */}
          {activeTab === "pendingContractors" && (
            <>
              <div className="mb-4">
                <h3 className="fw-bold text-dark">Contractor Requests</h3>
                <p className="text-muted">Review and verify new contractor registrations.</p>
              </div>

              {/* Search Filters */}
              <div className="bg-white p-4 rounded-4 shadow-sm mb-4">
                <Form className="row g-3">
                  <div className="col-md-6">
                    <Form.Control
                      type="text"
                      placeholder="Search by name or email..."
                      value={searchName}
                      onChange={(e) => setSearchName(e.target.value)}
                      className="border-0 bg-light p-2"
                    />
                  </div>
                  <div className="col-md-6">
                    <Form.Control
                      type="text"
                      placeholder="Search by phone..."
                      value={searchPhone}
                      onChange={(e) => setSearchPhone(e.target.value)}
                      className="border-0 bg-light p-2"
                    />
                  </div>
                </Form>
              </div>

              {filteredContractors.length === 0 ? (
                <div className="text-center py-5 bg-white rounded-4 shadow-sm">
                  <div className="mb-3">
                    <ClipboardCheck className="text-muted display-4" />
                  </div>
                  <p className="text-muted">No pending requests at the moment.</p>
                </div>
              ) : (
                <div className="table-responsive rounded-4 shadow-sm bg-white overflow-hidden">
                  <Table hover className="align-middle mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th className="px-4 py-3 border-0">#</th>
                        <th className="py-3 border-0">Contractor Info</th>
                        <th className="py-3 border-0">Verification Details</th>
                        <th className="py-3 border-0 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredContractors.map((c, index) => (
                        <tr key={c._id || index}>
                          <td className="px-4">{index + 1}</td>
                          <td>
                            <div className="fw-bold">{c.name}</div>
                            <div className="small text-muted">{c.email}</div>
                            <div className="small text-muted">{c.phone}</div>
                          </td>
                          <td>
                            <div className="small fw-semibold text-secondary">CNIC: {c.cnicNumber || "N/A"}</div>
                            <div className="small text-info mb-2">Registration Date: {new Date(c.createdAt).toLocaleDateString()}</div>
                            <div className="d-flex flex-wrap gap-2">
                              {c.cnicFront && (
                                <button type="button" onClick={() => openImageModal(`http://localhost:5000${c.cnicFront}`, `CNIC Front - ${c.name}`)} className="btn btn-outline-primary btn-sm rounded-pill px-3 py-1" style={{ fontSize: "0.75rem", fontWeight: "600" }}>
                                  <i className="bi bi-file-earmark-image me-1"></i> CNIC Front
                                </button>
                              )}
                              {c.cnicBack && (
                                <button type="button" onClick={() => openImageModal(`http://localhost:5000${c.cnicBack}`, `CNIC Back - ${c.name}`)} className="btn btn-outline-primary btn-sm rounded-pill px-3 py-1" style={{ fontSize: "0.75rem", fontWeight: "600" }}>
                                  <i className="bi bi-file-earmark-image me-1"></i> CNIC Back
                                </button>
                              )}
                              {c.verificationImage && (
                                <button type="button" onClick={() => openImageModal(`http://localhost:5000${c.verificationImage}`, `Verification Document - ${c.name}`)} className="btn btn-outline-info btn-sm rounded-pill px-3 py-1" style={{ fontSize: "0.75rem", fontWeight: "600" }}>
                                  <i className="bi bi-file-earmark-check me-1"></i> Verification Doc
                                </button>
                              )}
                              {(!c.cnicFront && !c.cnicBack && !c.verificationImage) && (
                                <span className="text-muted small fst-italic">No documents uploaded</span>
                              )}
                            </div>
                          </td>
                          <td className="text-center">
                            <div className="d-flex justify-content-center gap-2">
                              <button
                                className="btn btn-success rounded-pill px-4 btn-sm fw-bold shadow-sm"
                                onClick={() => approveContractor(c._id)}
                              >
                                Approve
                              </button>
                              <button
                                className="btn btn-outline-danger rounded-pill px-4 btn-sm fw-bold"
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
                </div>
              )}
            </>
          )}

          {/* Running Bids Table */}
          {activeTab === "runningBids" && (
            <>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold" style={{ color: "#2c3e50" }}>All Running Bids</h3>
              </div>

              {/* Search Filters for Bids */}
              <Form className="d-flex gap-3 mb-4 p-3 rounded shadow-sm bg-white">
                <Form.Control
                  type="text"
                  placeholder="Filter by Project..."
                  value={searchBidProject}
                  onChange={(e) => setSearchBidProject(e.target.value)}
                  className="shadow-none border-0 bg-light"
                />
                <Form.Control
                  type="text"
                  placeholder="Filter by Contractor..."
                  value={searchBidContractor}
                  onChange={(e) => setSearchBidContractor(e.target.value)}
                  className="shadow-none border-0 bg-light"
                />
                <Form.Select
                  value={searchBidStatus}
                  onChange={(e) => setSearchBidStatus(e.target.value)}
                  className="shadow-none border-0 bg-light w-auto"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </Form.Select>
              </Form>

              {filteredBids.length === 0 ? (
                <div className="text-center py-5 bg-white rounded shadow-sm">
                  <p className="text-muted mb-0">No running bids found matching your criteria.</p>
                </div>
              ) : (
                <div className="table-responsive rounded shadow-sm bg-white">
                  <Table hover className="align-middle mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th className="border-0 px-4 py-3">#</th>
                        <th className="border-0 py-3">Project / Details</th>
                        <th className="border-0 py-3">Participants</th>
                        <th className="border-0 py-3">Financials</th>
                        <th className="border-0 py-3 text-center">Status</th>
                        <th className="border-0 py-3">Message</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBids.map((b, index) => (
                        <tr key={b._id} style={{ transition: "background 0.2s" }}>
                          <td className="px-4">{index + 1}</td>
                          <td>
                            <div className="fw-bold text-primary">{b.project?.title || "Deleted Project"}</div>
                            <div className="small text-muted">
                              <i className="bi bi-geo-alt-fill me-1"></i>
                              {b.project?.location || "N/A"}
                            </div>
                            <div className="small text-info">
                              Est. Budget: Rs. {b.project?.budget || "N/A"}
                            </div>
                          </td>

                          {/* Participants Info */}
                          <td>
                            <div className="mb-2">
                              <span className="badge bg-secondary-subtle text-secondary me-2">Customer</span>
                              <span className="fw-semibold">{b.customer?.name}</span>
                            </div>
                            <div>
                              <span className="badge bg-primary-subtle text-primary me-2">Contractor</span>
                              <span className="fw-semibold">{b.contractor?.name}</span>
                            </div>
                          </td>

                          <td>
                            <div className="fs-5 fw-bold text-success">Rs. {b.price}</div>
                            <div className="small text-muted">{new Date(b.createdAt).toLocaleDateString()}</div>
                          </td>

                          <td className="text-center">
                            <span
                              className={`badge rounded-pill px-3 py-2 ${
                                b.status === "accepted"
                                  ? "bg-success"
                                  : b.status === "shortlisted"
                                  ? "bg-info text-dark"
                                  : b.status === "rejected"
                                  ? "bg-danger"
                                  : "bg-warning text-dark"
                              }`}
                            >
                              {b.status?.toUpperCase() || "PENDING"}
                            </span>
                          </td>
                          <td style={{ maxWidth: "200px" }}>
                            <div className="text-truncate small" title={b.message}>
                              {b.message || "No message provided"}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </>
          )}



        </div>
      </div>

      {/* Image Modal */}
      <Modal show={showImageModal} onHide={() => setShowImageModal(false)} size="lg" centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">{modalImageTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center p-4">
          {modalImageSrc && (
            <img 
              src={modalImageSrc} 
              alt={modalImageTitle} 
              className="img-fluid rounded shadow-sm" 
              style={{ maxHeight: '80vh', objectFit: 'contain' }} 
            />
          )}
        </Modal.Body>
      </Modal>

    </div>
  );
};
