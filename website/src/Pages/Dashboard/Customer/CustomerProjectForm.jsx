import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const CustomerProjectForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    plotSize: "",
    budget: "",
    description: "",
    category: "",
    deadline: "",
    urgency: "normal",
    attachments: [],
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file uploads
  const handleFileChange = (e) => {
    setFormData({ ...formData, attachments: e.target.files });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = JSON.parse(localStorage.getItem("customer"));
      const customerId = result?.id || result?._id;

      // Using FormData to send files
      const submission = new FormData();
      submission.append("customer", customerId);
      Object.keys(formData).forEach((key) => {
        if (key === "attachments") {
          Array.from(formData.attachments).forEach((file) =>
            submission.append("attachments", file)
          );
        } else {
          submission.append(key, formData[key]);
        }
      });

      const res = await fetch("http://localhost:5000/customer/projects", {
        method: "POST",
        body: submission, // no headers needed, browser sets multipart
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Project request submitted successfully!");
        navigate("/customer-profile");
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      alert("❌ Error submitting project");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow-lg border-0 rounded">
        <h3 className="text-center mb-4 fw-bold" style={{ color: "#3B6D8A" }}>
          Post a New Project
        </h3>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Project Title */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Project Title</label>
            <input
              type="text"
              className="form-control"
              name="title"
              placeholder="e.g. Build a 10 Marla House"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* Category */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Project Type</label>
            <select
              className="form-select"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Type</option>
              <option value="house">House</option>
              <option value="commercial">Commercial Building</option>
              <option value="renovation">Renovation</option>
              <option value="interior">Interior Design</option>
            </select>
          </div>

          {/* Location */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Location</label>
            <select
              className="form-select"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            >
              <option value="">Select City</option>
              <option value="Lahore">Lahore</option>
              <option value="Karachi">Karachi</option>
              <option value="Islamabad">Islamabad</option>
              <option value="Rawalpindi">Rawalpindi</option>
              <option value="Multan">Multan</option>
            </select>

          </div>

          {/* Plot Size */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Plot Size</label>
            <input
              type="text"
              className="form-control"
              name="plotSize"
              placeholder="e.g. 5 Marla"
              value={formData.plotSize}
              onChange={handleChange}
              required
            />
          </div>

          {/* Budget */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Budget (Optional)</label>
            <input
              type="number"
              className="form-control"
              name="budget"
              placeholder="e.g. 5000000"
              value={formData.budget}
              onChange={handleChange}
            />
          </div>

          {/* Deadline */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              Expected Completion Date
            </label>
            <input
              type="date"
              className="form-control"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              required
            />
          </div>

          {/* Urgency */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Urgency</label>
            <div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="urgency"
                  value="normal"
                  checked={formData.urgency === "normal"}
                  onChange={handleChange}
                />
                <label className="form-check-label">Normal</label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="urgency"
                  value="urgent"
                  checked={formData.urgency === "urgent"}
                  onChange={handleChange}
                />
                <label className="form-check-label">Urgent</label>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Description</label>
            <textarea
              className="form-control"
              name="description"
              rows="3"
              placeholder="Add any special requirements..."
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>

          {/* File Upload */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              Attach Files (optional)
            </label>
            <input
              type="file"
              className="form-control"
              name="attachments"
              multiple
              onChange={handleFileChange}
            />
          </div>


          {/* File Preview */}
          {formData.attachments.length > 0 && (
            <div className="mt-3">
              <h6>Image Preview:</h6>
              {Array.from(formData.attachments).map((file, i) => (
                <img
                  key={i}
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  style={{
                    width: "120px",
                    marginRight: "10px",
                    borderRadius: "5px",
                    objectFit: "cover",
                    border: "1px solid #ccc",
                  }}
                />
              ))}
            </div>
          )}


          {/* Preview Section */}
          {formData.title && (
            <div className="alert alert-info mt-3">
              <h6 className="fw-bold">Preview:</h6>
              <p><strong>Title:</strong> {formData.title}</p>
              <p><strong>Category:</strong> {formData.category}</p>
              <p><strong>Location:</strong> {formData.location}</p>
              <p><strong>Plot Size:</strong> {formData.plotSize}</p>
              <p><strong>Budget:</strong> {formData.budget}</p>
              <p><strong>Deadline:</strong> {formData.deadline}</p>
              <p><strong>Urgency:</strong> {formData.urgency}</p>
              <p><strong>Description:</strong> {formData.description}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="d-grid mt-4">
            <button
              type="submit"
              className="btn fw-bold"
              style={{ backgroundColor: "#3B6D8A", color: "#fff" }}
            >
              🚀 Submit Project Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
