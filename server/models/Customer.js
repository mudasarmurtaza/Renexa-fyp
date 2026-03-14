const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  address: { type: String },
  password: { type: String, required: true },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  profilePic: { type: String }, // ✅ This field handles the profile picture URL
  role: { type: String, default: "customer" },  // ✅ auto-assign role
  createdAt: { type: Date, default: Date.now }
});

const Customer = mongoose.model("Customer", CustomerSchema);

module.exports = Customer;
