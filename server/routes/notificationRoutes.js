const express = require("express");
const Message = require("../models/Message");
const ProjectRequest = require("../models/ProjectRequest");
const ChatRoom = require("../models/ChatRoom");
const Proposal = require("../models/Proposal");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get notification counts for contractor
router.get("/contractor/:contractorId", authMiddleware, async (req, res) => {
  try {
    const { contractorId } = req.params;

    // 1. Unread chat messages
    const rooms = await ChatRoom.find({ contractor: contractorId });
    const roomIds = rooms.map(r => r._id);

    const unreadChats = await Message.countDocuments({
      chatRoom: { $in: roomIds },
      senderId: { $ne: contractorId },
      isRead: { $ne: true }
    });

    // 2. Available projects (Open and NOT yet bid on)
    // Get IDs of projects where this contractor has already sent a proposal
    const existingProposals = await Proposal.find({ contractor: contractorId }).select("project").lean();
    const appliedProjectIds = existingProposals.map(p => p.project.toString());

    const newProjects = await ProjectRequest.countDocuments({
      status: "open",
      _id: { $nin: appliedProjectIds }
    });

    res.json({
      unreadChats,
      newProjects,
      total: unreadChats + newProjects
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get specific unread chat details
router.get("/contractor/:contractorId/chats", authMiddleware, async (req, res) => {
    try {
      const { contractorId } = req.params;
      const rooms = await ChatRoom.find({ contractor: contractorId }).populate("customer", "name profilePic");
      
      const chatNotifications = [];
      
      for (const room of rooms) {
          const unreadCount = await Message.countDocuments({
              chatRoom: room._id,
              senderId: { $ne: contractorId },
              isRead: { $ne: true }
          });
          
          if (unreadCount > 0) {
              const lastMessage = await Message.findOne({ chatRoom: room._id }).sort({ timestamp: -1 });
              chatNotifications.push({
                  roomId: room._id,
                  customerName: room.customer.name,
                  customerProfilePic: room.customer.profilePic,
                  unreadCount,
                  lastMessage: lastMessage?.message || "Image",
                  timestamp: lastMessage?.timestamp
              });
          }
      }
  
      res.json(chatNotifications);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// Get notification counts for customer
router.get("/customer/:customerId", authMiddleware, async (req, res) => {
  try {
    const { customerId } = req.params;

    // 1. Unread chat messages
    const rooms = await ChatRoom.find({ customer: customerId });
    const roomIds = rooms.map(r => r._id);

    const unreadChats = await Message.countDocuments({
      chatRoom: { $in: roomIds },
      senderId: { $ne: customerId },
      isRead: { $ne: true }
    });

    res.json({
      unreadChats,
      total: unreadChats
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get specific unread chat details for customer
router.get("/customer/:customerId/chats", authMiddleware, async (req, res) => {
    try {
      const { customerId } = req.params;
      const rooms = await ChatRoom.find({ customer: customerId }).populate("contractor", "name profilePic");
      
      const chatNotifications = [];
      
      for (const room of rooms) {
          const unreadCount = await Message.countDocuments({
              chatRoom: room._id,
              senderId: { $ne: customerId },
              isRead: { $ne: true }
          });
          
          if (unreadCount > 0) {
              const lastMessage = await Message.findOne({ chatRoom: room._id }).sort({ timestamp: -1 });
              chatNotifications.push({
                  roomId: room._id,
                  contractorName: room.contractor.name,
                  contractorProfilePic: room.contractor.profilePic,
                  unreadCount,
                  lastMessage: lastMessage?.message || "Image",
                  timestamp: lastMessage?.timestamp
              });
          }
      }
  
      res.json(chatNotifications);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

module.exports = router;
