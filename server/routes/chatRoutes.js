const express = require("express");
const multer = require("multer");
const path = require("path");

const ChatRoom = require("../models/ChatRoom");
const Message = require("../models/Message");
const Proposal = require("../models/Proposal");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// 📦 Multer config for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });


// Create or get chat room for a proposal
// Create or get chat room for a proposal
router.post("/room", authMiddleware, async (req, res) => {
  const { proposalId } = req.body;

  try {
    const proposal = await Proposal.findById(proposalId);
    if (!proposal) return res.status(404).json({ error: "Proposal not found" });

    if (proposal.status !== "accepted") {
      return res.status(403).json({ error: "Chat allowed only for accepted proposals" });
    }

    let chatRoom = await ChatRoom.findOne({ proposal: proposalId });

    if (!chatRoom) {
      chatRoom = new ChatRoom({
        proposal: proposalId,
        customer: proposal.customer,
        contractor: proposal.contractor,
      });
      await chatRoom.save();
    }

    // ✅ Always return proper _id
    res.json({
      _id: chatRoom._id.toString(),
      proposal: chatRoom.proposal,
      customer: chatRoom.customer,
      contractor: chatRoom.contractor,
    });

  } catch (error) {
    console.error("❌ Error in /chat/room:", error);
    res.status(500).json({ error: "Server error" });
  }
});


// Get messages for a chat room
router.get("/messages/:roomId", authMiddleware, async (req, res) => {
  try {
    const { roomId } = req.params;
    const messages = await Message.find({ chatRoom: roomId }).sort({ timestamp: 1 });
    res.json({ messages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get("/room/:roomId", authMiddleware, async (req, res) => {
  try {
    const chatRoom = await ChatRoom.findById(req.params.roomId)
      .populate("customer", "name profilePic")
      .populate("contractor", "name profilePic");
    if (!chatRoom) return res.status(404).json({ error: "Chat room not found" });
    res.json({
      _id: chatRoom._id,
      proposal: chatRoom.proposal,
      customer: chatRoom.customer._id,
      contractor: chatRoom.contractor._id,
      customerName: chatRoom.customer.name,
      customerProfilePic: chatRoom.customer.profilePic,
      contractorName: chatRoom.contractor.name,
      contractorProfilePic: chatRoom.contractor.profilePic,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post(
  "/upload",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
  return res.status(400).json({ error: "No image uploaded" });
}
      const { roomId, senderId, senderName } = req.body;

      const message = new Message({
        chatRoom: roomId,
        senderId,
        senderName,
        image: `/uploads/${req.file.filename}`,
      });

      await message.save();

      res.json(message);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);



module.exports = router;