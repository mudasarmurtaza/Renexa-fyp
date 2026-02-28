const mongoose = require("mongoose");

const proposalSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  contractor: { type: mongoose.Schema.Types.ObjectId, ref: "Contractor", required: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: "ProjectRequest", required: true },
  price: { type: Number, required: true },
  message: { type: String },
  status: { type: String, enum: ["pending", "accepted","shortlisted" , "rejected"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Proposal", proposalSchema);
