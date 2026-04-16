import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import { IoPersonCircleSharp } from "react-icons/io5";
import Swal from "sweetalert2";

export const CustomerProfile = () => {
  const [customer, setCustomer] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [isChanged, setIsChanged] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [removeProfile, setRemoveProfile] = useState(false);

  // ✅ Load customer data from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("customer");
    if (stored) {
      const parsed = JSON.parse(stored);
      setCustomer(parsed);
      setOriginalData(parsed);
    }
  }, []);

  if (!customer) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <h4>No customer data found. Please login again.</h4>
      </div>
    );
  }

  // ✅ Handle input change
  const handleChange = (e) => {
    const updated = { ...customer, [e.target.name]: e.target.value };
    setCustomer(updated);
    setIsChanged(JSON.stringify(updated) !== JSON.stringify(originalData));
  };

  // ✅ Handle new profile picture upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setRemoveProfile(false);
      setIsChanged(true);
    }
  };

  // ✅ Delete (remove) profile picture
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

  // ✅ Cancel unsaved edits
  const handleCancel = () => {
    setCustomer(originalData);
    setPreview(null);
    setSelectedFile(null);
    setRemoveProfile(false);
    setIsChanged(false);
  };

  // ✅ Save updates
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
      const customerId = customer._id || customer.id;
      if (!customerId)
        throw new Error("Customer ID missing. Please login again.");

      const body = new FormData();
      body.append("name", customer.name);
      body.append("email", customer.email);
      body.append("phone", customer.phone);
      body.append("address", customer.address);
      body.append("gender", customer.gender);

      if (selectedFile) body.append("profilePic", selectedFile);
      if (removeProfile) body.append("removeProfile", true);

      const res = await fetch(
        `/customer/update/${customerId}`,
        { method: "PUT", body }
      );

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("customer", JSON.stringify(data.customer));
        setCustomer(data.customer);
        setOriginalData(data.customer);
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

        // Tell navbar to update the user icon
        window.dispatchEvent(new Event("authChange"));
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
    <div className="d-flex vh-100">
      <div className="flex-grow-1 d-flex flex-column">
        <main className="flex-grow-1 p-4 bg-light ms-lg-5 ms-0">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white text-center">
              <h6 className="mb-0 fw-semibold">Customer Profile</h6>
            </div>
            <div className="card-body p-4">
              {/* ✅ Profile Picture Section */}
              <div className="text-center mb-4 position-relative">
                {removeProfile ? (
                  <IoPersonCircleSharp
                    size={100}
                    className="text-secondary border border-success rounded-circle"
                  />
                ) : (
                  <img
                    src={
                      preview
                        ? preview
                        : customer.profilePic
                          ? `${customer.profilePic}`
                          : "/default-avatar.png"
                    }
                    alt="Customer"
                    className="rounded-circle border border-success"
                    width={100}
                    height={100}
                  />
                )}

                {/* ✅ Edit icon */}
                <label
                  htmlFor="profileUpload"
                  className="position-absolute"
                  style={{
                    bottom: "5px",
                    right: "45%",
                    cursor: "pointer",
                    background: "white",
                    borderRadius: "50%",
                    padding: "6px",
                    boxShadow: "0px 2px 6px rgba(0,0,0,0.3)",
                  }}
                  title="Edit Profile Picture"
                >
                  <FaEdit className="text-primary" />
                </label>

                {/* ✅ Delete icon */}
                {(!removeProfile &&
                  (preview || customer.profilePic)) && (
                    <span
                      className="position-absolute"
                      style={{
                        bottom: "5px",
                        left: "45%",
                        cursor: "pointer",
                        background: "white",
                        borderRadius: "50%",
                        padding: "6px",
                        boxShadow: "0px 2px 6px rgba(0,0,0,0.3)",
                      }}
                      title="Remove Profile Picture"
                      onClick={handleDeleteProfile}
                    >
                      <FaTrash className="text-danger" />
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

              {/* ✅ Editable Form */}
              <form className="row g-3" onSubmit={handleSubmit}>
                {["name", "phone", "email", "address", "gender"].map(
                  (field, idx) => (
                    <div key={idx} className="col-12 d-flex align-items-center">
                      <label className="col-3 col-form-label text-capitalize">
                        {field}:
                      </label>
                      <div className="col-9">
                        <input
                          type={field === "email" ? "email" : "text"}
                          name={field}
                          className="form-control"
                          value={customer[field] || ""}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  )
                )}

                {/* ✅ Buttons */}
                <div className="d-flex justify-content-end gap-2 mt-4 flex-wrap">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleCancel}
                    disabled={!isChanged}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={!isChanged}
                  >
                    Save Changes
                  </button>
                </div>

                <div className="mt-3 text-center">
                  <Link to="/customer/proposals" className="btn btn-success">
                    Project Proposals
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
