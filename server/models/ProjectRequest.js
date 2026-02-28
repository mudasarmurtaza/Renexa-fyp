const mongoose = require("mongoose");

const ProjectRequestSchema = new mongoose.Schema({
  customer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Customer", 
    required: true 
  },

  // Basic details
  title: { type: String, required: true }, // e.g. "Build a 5 Marla House"
  category: { 
    type: String, 
    enum: ["house", "commercial", "renovation", "interior"], 
    required: true 
  },
  location: { type: String, required: true },
  plotSize: { type: String, required: true }, // e.g. "10 Marla"
  budget: { type: Number }, // optional
  description: { type: String },

  // New fields from form
  deadline: { type: Date, required: true },
  urgency: { type: String, enum: ["normal", "urgent"], default: "normal" },

  // File uploads
  attachments: [{ type: String }], // store file paths or URLs

  // Project status
  status: { 
    type: String, 
    enum: ["open", "in-progress", "completed"], 
    default: "open" 
  },

  createdAt: { type: Date, default: Date.now }
});

const ProjectRequest = mongoose.model("ProjectRequest", ProjectRequestSchema);

module.exports = ProjectRequest;
