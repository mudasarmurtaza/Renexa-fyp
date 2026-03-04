const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const authMiddleware = require("../middleware/authMiddleware");
const adminRoleMiddleware = require("../middleware/adminRoleMiddleware");
const Contractor = require("../models/Contractor");
const Customer = require("../models/Customer");
const ProjectRequest = require("../models/ProjectRequest");
const Proposal = require("../models/Proposal");
const router = express.Router();

// All admin routes will use authMiddleware and adminRoleMiddleware
// Admin login route (no auth required)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: admin._id, email: admin.email, role: admin.role }, require("../utils/jwtConfig").JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ message: err.message });
  }
});

router.use(authMiddleware, adminRoleMiddleware);

// Admin dashboard stats endpoint
router.get("/dashboard/stats", async (req, res) => {
  try {
    const totalContractors = await Contractor.countDocuments();
    const totalCustomers = await Customer.countDocuments();
    const pendingContractorRequests = await Contractor.countDocuments({
      $or: [{ status: "pending" }, { isApproved: false }],
    });
    const totalRunningBids = await Proposal.countDocuments({
      $or: [{ status: "pending" }, { status: "shortlisted" }],
    });
    const totalSuccessfulBids = await Proposal.countDocuments({
      status: "accepted",
    });

    const totalProjectsPosted = await ProjectRequest.countDocuments();
    const openProjects = await ProjectRequest.countDocuments({
      status: "open",
    });
    const closedProjects = await ProjectRequest.countDocuments({
      $or: [{ status: "closed" }, { acceptedProposal: { $exists: true } }],
    });
    const rejectedProposals = await Proposal.countDocuments({
      status: "rejected",
    });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const newCustomerRegistrations = await Customer.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });
    const newContractorRegistrations = await Contractor.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });
    const newRegistrationsLast7Days = newCustomerRegistrations + newContractorRegistrations;

    const currentMonthStart = new Date();
    currentMonthStart.setDate(1); // Set to the first day of the month
    currentMonthStart.setHours(0, 0, 0, 0);

    const nextMonthStart = new Date(currentMonthStart);
    nextMonthStart.setMonth(currentMonthStart.getMonth() + 1);

    const monthlyRevenueResult = await Proposal.aggregate([
      {
        $match: {
          status: "accepted",
          createdAt: { $gte: currentMonthStart, $lt: nextMonthStart },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$price" },
        },
      },
    ]);

    const monthlyRevenue = monthlyRevenueResult.length > 0 ? monthlyRevenueResult[0].totalRevenue : 0;

    const topContractors = await Proposal.aggregate([
      {
        $match: { status: "accepted" },
      },
      {
        $group: {
          _id: "$contractor",
          acceptedProposals: { $count: {} },
        },
      },
      {
        $sort: { acceptedProposals: -1 },
      },
      {
        $limit: 5,
      },
      {
        $lookup: {
          from: "contractors", // The collection name for contractors
          localField: "_id",
          foreignField: "_id",
          as: "contractorInfo",
        },
      },
      {
        $unwind: "$contractorInfo",
      },
      {
        $project: {
          _id: 0,
          contractorId: "$_id",
          name: "$contractorInfo.name",
          email: "$contractorInfo.email",
          acceptedProposals: 1,
        },
      },
    ]);

    res.json({
      totalContractors,
      totalCustomers,
      pendingContractorRequests,
      totalRunningBids,
      totalSuccessfulBids,
      totalProjectsPosted,
      openProjects,
      closedProjects,
      rejectedProposals,
      newRegistrationsLast7Days,
      monthlyRevenue,
      topContractors,
    });
  } catch (error) {
    console.error("Error fetching admin dashboard stats:", error);
    res.status(500).json({ message: error.message });
  }
});

// Admin dashboard charts endpoint
router.get("/dashboard/charts", async (req, res) => {
  try {
    // Bar Chart: Proposals (Pending / Shortlisted / Accepted / Rejected)
    const proposalStatusDistribution = await Proposal.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $count: {} },
        },
      },
    ]);

    // Line Chart: Monthly Projects Posted
    const monthlyProjectsPosted = await ProjectRequest.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $count: {} },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    // Pie Chart: Project Status Distribution
    const projectStatusDistribution = await ProjectRequest.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $count: {} },
        },
      },
    ]);

    res.json({
      proposalStatusDistribution,
      monthlyProjectsPosted,
      projectStatusDistribution,
    });
  } catch (error) {
    console.error("Error fetching admin dashboard chart data:", error);
    res.status(500).json({ message: error.message });
  }
});

// Admin dashboard recent data endpoint
router.get("/dashboard/recent-data", async (req, res) => {
  try {
    const latestContractorRegistrations = await Contractor.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email createdAt");

    const latestProjectsPosted = await ProjectRequest.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title customer createdAt")
      .populate("customer", "name"); // Populate customer name

    const recentAcceptedProposals = await Proposal.find({ status: "accepted" })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("project contractor customer price createdAt")
      .populate("project", "title")
      .populate("contractor", "name")
      .populate("customer", "name");

    res.json({
      latestContractorRegistrations,
      latestProjectsPosted,
      recentAcceptedProposals,
    });
  } catch (error) {
    console.error("Error fetching admin dashboard recent data:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get pending contractors
router.get("/contractors/pending", async (req, res) => {
  try {
    const pending = await Contractor.find({
      $or: [{ status: "pending" }, { isApproved: false }]
    });
    res.json({ list: pending });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve contractor
router.put("/contractors/:id/approve", async (req, res) => {
  try {
    const contractor = await Contractor.findByIdAndUpdate(
      req.params.id,
      { status: "approved", isApproved: true },
      { new: true }
    );
    if (!contractor) return res.status(404).json({ message: "Contractor not found" });
    res.json({ message: "Contractor approved successfully", contractor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Reject contractor
router.put("/contractors/:id/reject", async (req, res) => {
  try {
    const contractor = await Contractor.findByIdAndUpdate(
      req.params.id,
      { status: "rejected", isApproved: false },
      { new: true }
    );
    if (!contractor) return res.status(404).json({ message: "Contractor not found" });
    res.json({ message: "Contractor rejected successfully", contractor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all running bids
router.get("/running-bids", async (req, res) => {
  try {
    const bids = await Proposal.find()
      .populate("project", "title location budget")
      .populate("customer", "name email phone")
      .populate("contractor", "name email phone");
    res.json({ list: bids });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;