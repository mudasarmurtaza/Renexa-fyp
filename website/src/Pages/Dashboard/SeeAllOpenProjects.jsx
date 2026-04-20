import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaRulerCombined, FaMoneyBillWave, FaCalendarAlt, FaExclamationCircle } from "react-icons/fa";
import { MdCategory } from "react-icons/md";
import { useDashboard } from "../../context/DashboardContext";

export const SeeAllOpenProjects = ({ isModal = false, isCompact = false }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useDashboard();
  
  // Re-enable local storage fallback if context ID is not yet ready
  const contractor = JSON.parse(localStorage.getItem("contractor") || "{}");
  const contractorId = userId || contractor._id || contractor.id;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      if (!contractorId) return;
      
      try {
        setLoading(true);
        const res = await fetch(`/contractor/projects/${contractorId}`);
        const data = await res.json();
        
        if (Array.isArray(data)) {
          setProjects(data);
        } else {
          setProjects([]);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, [contractorId]);

  if (loading) {
    return (
      <div className={`d-flex justify-content-center align-items-center ${isCompact ? "py-4" : "vh-100"}`}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading projects...</span>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className={`alert alert-info text-center ${isCompact ? "my-2 p-3" : "my-5 p-5"}`} role="alert">
        <h5 className="alert-heading fw-bold">No Open Projects!</h5>
        <p className="mb-0">There are currently no new projects for you to bid on.</p>
        <hr />
        <p className="mb-0 small">Please check back later or refresh the page.</p>
      </div>
    );
  }

  if (isCompact) {
    return (
      <div className="d-flex flex-column gap-3">
        {projects.map((project) => (
          <div 
            key={project._id} 
            className="d-flex align-items-center gap-3 p-3 rounded-4 border bg-white shadow-sm hover-shadow transition-all"
            style={{ borderLeft: "4px solid #fbbf24" }}
          >
            <div className="flex-grow-1">
              <h6 className="fw-bold mb-1 text-dark" style={{ fontSize: "15px" }}>{project.title}</h6>
              <div className="d-flex flex-wrap gap-2 text-muted" style={{ fontSize: "12px" }}>
                <span className="d-flex align-items-center"><FaMapMarkerAlt className="me-1" size={10} />{project.location}</span>
                <span className="d-flex align-items-center"><FaMoneyBillWave className="me-1" size={10} />{project.budget ? `Rs. ${project.budget}` : "N/A"}</span>
                <span className={`badge ${project.urgency === "urgent" ? "bg-danger" : "bg-success"} rounded-pill`} style={{ fontSize: "10px", padding: "4px 8px" }}>
                  {project.urgency}
                </span>
              </div>
            </div>
            <button
              className="btn btn-sm btn-primary rounded-pill px-3 fw-bold shadow-sm"
              style={{ fontSize: "12px", background: "#253863", border: "none" }}
              onClick={() => navigate(`/contractor/projects/${project._id}/proposal`, { state: { contractorId } })}
            >
              View & Bid
            </button>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={isModal ? "" : "container py-5"}>
      {!isModal && (
        <h2 className="text-center mb-5 fw-bold text-primary">Available Projects</h2>
      )}
      <div className="row">
        {projects.map((project) => (
          <div key={project._id} className="col-md-6 col-lg-4 mb-4">
            <div
              className="card shadow-sm h-100"
              style={{
                transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                "&:hover": { transform: "translateY(-5px)", boxShadow: "0 0.5rem 1rem rgba(0,0,0,0.15)" },
              }}
            >
              <div
                className="card-header"
                style={{ backgroundColor: "#f8f9fa", borderBottom: "1px solid #e9ecef", padding: "1rem 1.5rem" }}
              >
                <h5 className="card-title mb-0" style={{ color: "#0056b3", fontWeight: "700" }}>
                  {project.title}
                </h5>
              </div>
              <div className="card-body d-flex flex-column">
                <div
                  className="mb-3 p-3 rounded"
                  style={{ backgroundColor: "#e2f0ff", borderLeft: "5px solid #007bff" }}
                >
                  <div className="d-flex align-items-center mb-2">
                    <img
                      src={
                        project.customer?.profilePic
                          ? (project.customer.profilePic.startsWith("/")
                            ? `${project.customer.profilePic}`
                            : `/${project.customer.profilePic}`)
                          : "https://via.placeholder.com/60"
                      }
                      alt={project.customer?.name || "Customer"}
                      className="rounded-circle me-3"
                      style={{ width: "60px", height: "60px", objectFit: "cover", border: "2px solid #007bff" }}
                    />
                    <div>
                      <h6 className="fw-bold text-primary mb-0">{project.customer?.name || "N/A"}</h6>
                      <small className="text-muted">{project.customer?.email || "N/A"}</small>
                    </div>
                  </div>
                  <p className="mb-0">
                    <strong>Phone:</strong> {project.customer?.phone || "N/A"}
                  </p>
                </div>

                <div className="flex-grow-1">
                  <p className="card-text mb-2">
                    <MdCategory className="text-muted me-2" />
                    <strong>Category:</strong> {project.category}
                  </p>
                  <p className="card-text mb-2">
                    <FaMapMarkerAlt className="text-muted me-2" />
                    <strong>Location:</strong> {project.location}
                  </p>
                  <p className="card-text mb-2">
                    <FaRulerCombined className="text-muted me-2" />
                    <strong>Plot Size:</strong> {project.plotSize}
                  </p>
                  <p className="card-text mb-2">
                    <FaMoneyBillWave className="text-muted me-2" />
                    <strong>Budget:</strong>{" "}
                    {project.budget ? `Rs. ${project.budget}` : "Not specified"}
                  </p>
                  <p className="card-text mb-2">
                    <FaCalendarAlt className="text-muted me-2" />
                    <strong>Deadline:</strong>{" "}
                    {new Date(project.deadline).toLocaleDateString("en-GB")}
                  </p>
                  <p className="card-text mb-2">
                    <FaExclamationCircle className="text-muted me-2" />
                    <strong>Urgency:</strong>{" "}
                    <span
                      className={`badge ${project.urgency === "urgent" ? "bg-danger" : "bg-success"
                        }`}
                    >
                      {project.urgency}
                    </span>
                  </p>
                  <p className="card-text mt-3">
                    <strong>Description:</strong> {project.description || "N/A"}
                  </p>
                </div>

                {project.attachments && project.attachments.length > 0 && (
                  <div className="mt-3">
                    <h6 className="fw-bold mb-2">Project Images:</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {project.attachments.map((file, index) => {
                        const imageUrl = file.startsWith("/")
                          ? `${file}`
                          : `/${file}`;
                        return (
                          <a
                            key={index}
                            href={imageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="d-inline-block position-relative"
                            style={{ width: "80px", height: "80px" }}
                          >
                            <img
                              src={imageUrl}
                              alt={`Attachment ${index + 1}`}
                              className="rounded"
                              style={{ width: "100%", height: "100%", objectFit: "cover", border: "1px solid #dee2e6" }}
                            />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}

                <button
                  className="btn btn-success mt-4 w-100"
                  onClick={() =>
                    navigate(`/contractor/projects/${project._id}/proposal`, {
                      state: { contractorId },
                    })
                  }
                >
                  Send Proposal
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
