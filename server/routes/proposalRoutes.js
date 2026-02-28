// proposalRoutes.js
const express = require("express");
const Proposal = require("../models/Proposal");
const ProjectRequest = require("../models/ProjectRequest");
const ChatRoom = require("../models/ChatRoom");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * Contractor submits a proposal
 */
router.post("/", async (req, res) => {
  try {
    const { contractorId, projectId, price, message } = req.body;

    const project = await ProjectRequest.findById(projectId);
    if (!project) return res.status(404).json({ error: "Project not found" });

    // Get customer from project
    const customerId = project.customer;

    const proposal = new Proposal({
      contractor: contractorId,
      project: projectId,
      customer: customerId,
      price,
      message,
      status: "pending", // explicit for clarity
    });

    await proposal.save();

    res.status(201).json({ message: "Proposal submitted successfully", proposal });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Customer sees all proposals for all their projects
 */
router.get("/customer/:customerId", async (req, res) => {
  try {
    const projects = await ProjectRequest.find({ customer: req.params.customerId });
    const projectIds = projects.map((p) => p._id);

    const proposals = await Proposal.find({ project: { $in: projectIds } })
      .populate("contractor", "name email phone profilePic")
      .populate("project", "title budget location");

    res.json(proposals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Customer sees proposals for a single project
 */
router.get("/:projectId", async (req, res) => {
  try {
    const proposals = await Proposal.find({ project: req.params.projectId })
      .populate("contractor", "name email phone profilePic");

    res.json(proposals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get shortlisted proposals for a customer
router.get("/customer/:customerId/shortlisted", async (req, res) => {
  try {
    const projects = await ProjectRequest.find({ customer: req.params.customerId });
    const projectIds = projects.map((p) => p._id);

    const proposals = await Proposal.find({
      project: { $in: projectIds },
      status: "shortlisted",
    })
      .populate("contractor", "name email phone profilePic")
      .populate("project", "title budget location");

    res.json(proposals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Customer "accepts" (shortlists) a proposal
 * NOTE: I've kept the path `/accept` but set status to "shortlisted" to match the frontend.
 * If you want a separate final-accept step, add a separate `/finalize` or `/confirm` endpoint.
 */

router.put("/:id/accept", authMiddleware, async (req, res) => {
  try {
    const proposalId = req.params.id;
    const proposal = await Proposal.findById(proposalId);
    if (!proposal) return res.status(404).json({ message: "Proposal not found" });

    if (proposal.customer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Step-based status update
    if (proposal.status === "pending") {
      proposal.status = "shortlisted";
      // Create a chat room when proposal is shortlisted
      let chatRoom = await ChatRoom.findOne({
        customer: proposal.customer,
        contractor: proposal.contractor,
        proposal: proposal._id,
      });

      if (!chatRoom) {
        chatRoom = new ChatRoom({
          customer: proposal.customer,
          contractor: proposal.contractor,
          proposal: proposal._id,
        });
        await chatRoom.save();
      }

    } else if (proposal.status === "shortlisted") {
      proposal.status = "accepted";
    }

    await proposal.save();

    res.json({ message: `Proposal ${proposal.status}`, proposal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Customer rejects a proposal — mark as rejected (do not delete)
 */
router.put("/:id/reject", authMiddleware, async (req, res) => {
  try {
    const proposalId = req.params.id;
    const proposal = await Proposal.findById(proposalId);
    if (!proposal) return res.status(404).json({ error: "Proposal not found" });

    if (proposal.customer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    proposal.status = "rejected";
    await proposal.save();

    res.json({ message: "Proposal rejected", proposal });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get accepted proposals for a customer (if you ever need a final accepted state)
router.get("/customer/:customerId/accepted", async (req, res) => {
  try {
    const projects = await ProjectRequest.find({ customer: req.params.customerId });
    const projectIds = projects.map((p) => p._id);

    const proposals = await Proposal.find({
      project: { $in: projectIds },
      status: "accepted",
    })
      .populate("contractor", "name email phone profilePic")
      .populate("project", "title budget location");

    res.json(proposals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
