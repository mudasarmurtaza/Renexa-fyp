import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { IoPersonCircleSharp } from "react-icons/io5";

export const ContractorProfile = () => {
  const [contractor, setContractor] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [isChanged, setIsChanged] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [removeProfile, setRemoveProfile] = useState(false);
  // ✅ Store only the ID separately so the fetch doesn't re-run on every input change
  const [contractorId, setContractorId] = useState(null);

  // ✅ Load contractor from localStorage and get the ID
  useEffect(() => {
    const stored = localStorage.getItem("contractor");
    if (stored) {
      const parsed = JSON.parse(stored);
      setContractor(parsed);
      setOriginalData(parsed);
      setContractorId(parsed._id || parsed.id);
    }
  }, []);

  // ✅ Fetch latest data from backend ONCE on mount (using contractorId, not contractor)
  useEffect(() => {
    if (!contractorId) return;
    const fetchFreshData = async () => {
      try {
        const res = await fetch(`http://localhost:5000/contractor/${contractorId}`);
        const data = await res.json();
        localStorage.setItem("contractor", JSON.stringify(data));
        setContractor(data);
        setOriginalData(data);
      } catch (err) {
        console.error("Failed to fetch contractor data:", err);
      }
    };
    fetchFreshData();
  }, [contractorId]); // ✅ Only depends on ID — won't re-run when form fields change


  if (!contractor) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <h4>No contractor data found. Please login again.</h4>
      </div>
    );
  }

  // ✅ Handle input change
  const handleChange = (e) => {
    const updated = { ...contractor, [e.target.name]: e.target.value };
    setContractor(updated);
    setIsChanged(JSON.stringify(updated) !== JSON.stringify(originalData));
  };

  // ✅ Handle profile upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setRemoveProfile(false);
      setIsChanged(true);
    }
  };

  // ✅ Handle delete icon click (show profile icon immediately)
  const handleDeleteProfile = () => {
    Swal.fire({
      title: "Remove profile picture?",
      text: "Your current profile picture will be replaced by a default icon.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        // Clear image preview & file, and show profile icon
        setPreview(null);
        setSelectedFile(null);
        setRemoveProfile(true);
        setIsChanged(true);

        Swal.fire({
          icon: "info",
          title: "Profile picture removed",
          text: "Click 'Save Changes' to apply this update.",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  };

  // ✅ Cancel changes
  const handleCancel = () => {
    setContractor(originalData);
    setPreview(null);
    setSelectedFile(null);
    setRemoveProfile(false);
    setIsChanged(false);
  };

  // ✅ Save updated profile
  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirmUpdate = await Swal.fire({
      title: "Save changes?",
      text: "Your profile will be updated.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, save it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    });

    if (!confirmUpdate.isConfirmed) return;

    try {
      if (!contractorId)
        throw new Error("Contractor ID missing. Please login again.");

      const body = new FormData();
      body.append("name", contractor.name);
      body.append("email", contractor.email);
      body.append("phone", contractor.phone);
      body.append("address", contractor.address);
      body.append("gender", contractor.gender);

      if (selectedFile) body.append("profilePic", selectedFile);
      if (removeProfile) body.append("removeProfile", true);

      const res = await fetch(
        `http://localhost:5000/contractor/update/${contractorId}`,
        { method: "PUT", body }
      );

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("contractor", JSON.stringify(data.contractor));
        setContractor(data.contractor);
        setOriginalData(data.contractor);
        setSelectedFile(null);
        setPreview(null);
        setRemoveProfile(false);
        setIsChanged(false);

        Swal.fire({
          icon: "success",
          title: "Profile updated successfully ✅",
          timer: 2000,
          showConfirmButton: false,
          position: "center",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Update failed",
          text: data.message,
          confirmButtonColor: "#d33",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error updating profile",
        text: err.message,
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <div className="container py-5">
      <div className="row">
        {/* Main Profile Content */}
        <div className="col-lg-8">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-primary text-white text-center py-3">
              <h4 className="mb-0 fw-bold">Contractor Profile</h4>
            </div>
            <div className="card-body p-4">
              {/* Profile Picture Section */}
              <div className="text-center mb-5 position-relative">
                {removeProfile ? (
                  <IoPersonCircleSharp
                    size={120}
                    className="text-secondary border border-success rounded-circle p-1"
                  />
                ) : (
                  <img
                    src={
                      preview
                        ? preview
                        : contractor.profilePic
                          ? `http://localhost:5000${contractor.profilePic}`
                          : "/default-avatar.png"
                    }
                    alt="Contractor"
                    className="rounded-circle border border-success p-1"
                    width={120}
                    height={120}
                    style={{ objectFit: "cover" }}
                  />
                )}

                {/* Edit icon (file input trigger) */}
                <label
                  htmlFor="profileUpload"
                  className="position-absolute"
                  style={{
                    bottom: "0px",
                    right: "42%",
                    cursor: "pointer",
                    background: "white",
                    borderRadius: "50%",
                    padding: "8px",
                    boxShadow: "0px 2px 8px rgba(0,0,0,0.3)",
                  }}
                  title="Edit Profile Picture"
                >
                  <FaEdit className="text-primary fs-5" />
                </label>

                {/* Delete icon (removes profile picture) */}
                {(!removeProfile &&
                  (preview ||
                    contractor.profilePic)) && (
                    <span
                      className="position-absolute"
                      style={{
                        bottom: "0px",
                        left: "42%",
                        cursor: "pointer",
                        background: "white",
                        borderRadius: "50%",
                        padding: "8px",
                        boxShadow: "0px 2px 8px rgba(0,0,0,0.3)",
                      }}
                      title="Remove Profile Picture"
                      onClick={handleDeleteProfile}
                    >
                      <FaTrash className="text-danger fs-5" />
                    </span>
                  )}

                <input
                  type="file"
                  id="profileUpload"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </div>

              {/* Editable Form */}
              <form className="row g-4" onSubmit={handleSubmit}>
                {/* Personal Information */}
                <div className="col-12">
                  <h5 className="text-primary mb-3">Personal Information</h5>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="name" className="form-label">Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="form-control"
                        value={contractor.name || ""}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="gender" className="form-label">Gender</label>
                      <input
                        type="text"
                        id="gender"
                        name="gender"
                        className="form-control"
                        value={contractor.gender || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="col-12 mt-4">
                  <h5 className="text-primary mb-3">Contact Information</h5>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="email" className="form-label">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-control"
                        value={contractor.email || ""}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="phone" className="form-label">Phone</label>
                      <input
                        type="text"
                        id="phone"
                        name="phone"
                        className="form-control"
                        value={contractor.phone || ""}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-12">
                      <label htmlFor="address" className="form-label">Address</label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        className="form-control"
                        value={contractor.address || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="col-12 d-flex justify-content-end gap-3 mt-5">
                  <button
                    type="button"
                    className="btn btn-outline-secondary px-4"
                    onClick={handleCancel}
                    disabled={!isChanged}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary px-4"
                    disabled={!isChanged}
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Contractor Documents Section */}
          <div className="card shadow-sm mt-5">
            <div className="card-header bg-info text-white py-3">
              <h5 className="mb-0 fw-bold">Documents</h5>
            </div>
            <div className="card-body p-4">
              <div className="row gy-4">
                {contractor.cnicFront && (
                  <div className="col-md-6 col-lg-4 text-center">
                    <p className="fw-bold text-muted">CNIC Front</p>
                    <img
                      src={`http://localhost:5000${contractor.cnicFront}`}
                      alt="CNIC Front"
                      className="img-fluid border rounded shadow-sm hover-grow"
                      style={{ maxHeight: "200px", objectFit: "cover" }}
                    />
                  </div>
                )}
                {contractor.cnicBack && (
                  <div className="col-md-6 col-lg-4 text-center">
                    <p className="fw-bold text-muted">CNIC Back</p>
                    <img
                      src={`http://localhost:5000${contractor.cnicBack}`}
                      alt="CNIC Back"
                      className="img-fluid border rounded shadow-sm hover-grow"
                      style={{ maxHeight: "200px", objectFit: "cover" }}
                    />
                  </div>
                )}
                {contractor.verificationImage && (
                  <div className="col-md-6 col-lg-4 text-center">
                    <p className="fw-bold text-muted">Verification Photo</p>
                    <img
                      src={`http://localhost:5000${contractor.verificationImage}`}
                      alt="Verification"
                      className="img-fluid border rounded shadow-sm hover-grow"
                      style={{ maxHeight: "200px", objectFit: "cover" }}
                    />
                  </div>
                )}
                {contractor.certifications &&
                  contractor.certifications.length > 0 && (
                    <div className="col-12 mt-4">
                      <p className="fw-bold text-center text-muted">Certifications</p>
                      <div className="d-flex flex-wrap justify-content-center gap-3">
                        {contractor.certifications.map((cert, index) => (
                          <img
                            key={index}
                            src={`http://localhost:5000${cert}`}
                            alt={`Certificate-${index}`}
                            className="border rounded shadow-sm hover-grow"
                            width={150}
                            height={150}
                            style={{ objectFit: "cover" }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                {(!contractor.cnicFront && !contractor.cnicBack && !contractor.verificationImage && (!contractor.certifications || contractor.certifications.length === 0)) && (
                  <div className="col-12 text-center text-muted">
                    No documents uploaded yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews and Comments Section */}
        <div className="col-lg-4">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-success text-white text-center py-3">
              <h5 className="mb-0 fw-bold">Reviews & Comments</h5>
            </div>
            <div className="card-body">
              {/* Placeholder for reviews */}
              {[
                {
                  id: 1,
                  author: "Client A",
                  rating: 5,
                  comment: "Excellent work, very professional and efficient!",
                },
                {
                  id: 2,
                  author: "Client B",
                  rating: 4,
                  comment: "Good communication and quality service.",
                },
                {
                  id: 3,
                  author: "Client C",
                  rating: 5,
                  comment: "Highly recommended! Will definitely hire again.",
                },
              ].map((review) => (
                <div key={review.id} className="card mb-3 shadow-sm">
                  <div className="card-body">
                    <h6 className="card-title mb-1">{review.author}</h6>
                    <div className="text-warning mb-2">
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </div>
                    <p className="card-text text-muted">{review.comment}</p>
                  </div>
                </div>
              ))}
              {/* Add a form for new comments later */}
              <div className="mt-4">
                <textarea
                  className="form-control mb-2"
                  rows="3"
                  placeholder="Leave a comment..."
                ></textarea>
                <button className="btn btn-success w-100">Submit Comment</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

