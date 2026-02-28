const mongoose = require("mongoose");

const ChatRoomSchema = new mongoose.Schema({
  proposal: { type: mongoose.Schema.Types.ObjectId, ref: "Proposal", required: true, unique: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  contractor: { type: mongoose.Schema.Types.ObjectId, ref: "Contractor", required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ChatRoom", ChatRoomSchema);