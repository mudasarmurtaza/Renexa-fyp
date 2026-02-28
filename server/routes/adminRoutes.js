const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const adminRoleMiddleware = require("../middleware/adminRoleMiddleware");
const Contractor = require("../models/Contractor");
const Customer = require("../models/Customer");
const ProjectRequest = require("../models/ProjectRequest");
const Proposal = require("../models/Proposal");
const router = express.Router();

// All admin routes will use authMiddleware and adminRoleMiddleware
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

module.exports = router;