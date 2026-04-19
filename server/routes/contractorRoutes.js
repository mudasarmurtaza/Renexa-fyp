// routes/contractorRoutes.js
const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const Contractor = require("../models/Contractor");
const fileUpload = require("../ContractorPic");

const certificationUpload = require("../middleware/ContractorCertifications");
const verificationUpload = require("../middleware/ContractorVerification");
const verificationImageUpload = require("../middleware/ContractorVerificationImage");
const cnicUpload = require("../middleware/ContractorCNIC");
const authMiddleware = require("../middleware/authMiddleware");
const { JWT_SECRET } = require("../utils/jwtConfig");
const ProjectRequest = require("../models/ProjectRequest");
const Proposal = require("../models/Proposal");



const router = express.Router();

// Contractor signup
router.post("/signup", fileUpload, async (req, res) => {
  try {
    const contractorData = {
      name: req.body.name,
      phone: req.body.phone,
      cnicNumber: req.body.cnicNumber,
      email: req.body.email,
      address: req.body.address,
      city: req.body.city,      // ✅ Add this
      password: req.body.password,
      gender: req.body.gender,
      profilePic: req.file ? `/contractor_images/${req.file.filename}` : null,
      status: "pending",
    };


    const contractor = new Contractor(contractorData);
    await contractor.save();

    res.status(201).json({ message: "Signup successful! Wait for admin approval.", contractor });
  } catch (error) {
    if (error.code === 11000) {
      if (error.keyPattern.cnicNumber) return res.status(400).json({ error: "CNIC already registered" });
      if (error.keyPattern.phone) return res.status(400).json({ error: "Phone already registered" });
      if (error.keyPattern.email) return res.status(400).json({ error: "Email already registered" });
    }
    res.status(400).json({ error: error.message });
  }
});

// Contractor verification image upload (separate route for verification image)
router.post("/signup/verification", verificationImageUpload, async (req, res) => {
  try {
    const { contractorId } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Verification image is required" });
    }

    const contractor = await Contractor.findByIdAndUpdate(
      contractorId,
      { verificationImage: `/contractor_verification_images/${req.file.filename}` },
      { new: true }
    );

    if (!contractor) {
      return res.status(404).json({ error: "Contractor not found" });
    }

    res.status(200).json({
      message: "Verification image uploaded successfully",
      contractor
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Contractor CNIC images upload (separate route for CNIC images)
router.post("/signup/cnic", cnicUpload, async (req, res) => {
  try {
    const { contractorId } = req.body;

    if (!req.files || (!req.files.cnicFront && !req.files.cnicBack)) {
      return res.status(400).json({ error: "At least one CNIC image is required" });
    }

    const updateData = {};

    if (req.files.cnicFront) {
      updateData.cnicFront = `/contractor_cnic_images/${req.files.cnicFront[0].filename}`;
    }

    if (req.files.cnicBack) {
      updateData.cnicBack = `/contractor_cnic_images/${req.files.cnicBack[0].filename}`;
    }

    const contractor = await Contractor.findByIdAndUpdate(
      contractorId,
      updateData,
      { new: true }
    );

    if (!contractor) {
      return res.status(404).json({ error: "Contractor not found" });
    }

    res.status(200).json({
      message: "CNIC images uploaded successfully",
      contractor
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// Contractor login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Contractor.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }


    if (user.status === "pending") {
      return res.status(403).json({ message: "Account pending approval by admin." });
    }
    if (user.status === "rejected") {
      return res.status(403).json({ message: "Your account was rejected by admin." });
    }


    const token = jwt.sign({ id: user._id, email: user.email, profilePic: user.profilePic }, JWT_SECRET, { expiresIn: "1h" });

    const contractor = await Contractor.findById(user._id).select("-password");

    res.json({
      message: "Login successful",
      token,
      contractor
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// SEND OTP
router.post("/forgot-password", async (req, res) => {
  try {
    const { email, name } = req.body;

    const contractor = await Contractor.findOne({ email, name });

    if (!contractor) {
      return res.status(404).json({ msg: "No user found with this Email & Name" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    contractor.resetOTP = otp;
    contractor.resetOTPExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await contractor.save();

    // SEND EMAIL
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: "yourEmail@gmail.com", pass: "your-app-password" }
    });

    await transporter.sendMail({
      from: "Contractor App",
      to: email,
      subject: "Your Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}`
    });

    res.json({ msg: "OTP sent to your email" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const contractor = await Contractor.findOne({
      email,
      resetOTP: otp,
      resetOTPExpires: { $gt: Date.now() }
    });

    if (!contractor) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    res.json({ msg: "OTP verified successfully" });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});


// Update contractor profile
router.put("/update/:id", fileUpload, async (req, res) => {
  try {
    const { id } = req.params;

    const updatedData = {
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      address: req.body.address,
      gender: req.body.gender,
      experience: req.body.experience,
      specialties: req.body.specialties ? JSON.parse(req.body.specialties) : undefined,
    };

    // ✅ Remove profile pic
    if (req.body.removeProfile === "true" || req.body.removeProfile === true) {
      updatedData.profilePic = null;
    }

    // ✅ If new profile picture uploaded
    if (req.file) {
      updatedData.profilePic = `/contractor_images/${req.file.filename}`;
    }

    // ✅ Find & update contractor
    const updatedContractor = await Contractor.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    )
      .select("-password") // hide password
      .lean(); // convert mongoose doc to plain JS

    if (!updatedContractor) {
      return res.status(404).json({ message: "Contractor not found" });
    }

    // ✅ include all additional stored fields
    const completeContractor = await Contractor.findById(id).select("-password");

    res.json({
      message: "Profile updated successfully ✅",
      contractor: completeContractor,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


// Contractor profile (protected)
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await Contractor.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ authenticated: false, message: "User not found" });
    res.json({ authenticated: true, user });
  } catch (error) {
    res.status(500).json({ authenticated: false, message: "Server error" });
  }
});



// GET all open projects for contractors
router.get("/projects/:contractorId", async (req, res) => {
  try {
    const { contractorId } = req.params;

    // We still verify contractor exists
    const contractor = await Contractor.findById(contractorId);
    if (!contractor) return res.status(404).json({ error: "Contractor not found" });

    // 1. Get IDs of projects where this contractor has already sent a proposal
    const existingProposals = await Proposal.find({ contractor: contractorId }).select("project").lean();
    const appliedProjectIds = existingProposals.map(p => p.project.toString());
    
    // 2. Fetch projects that are 'open' and where the contractor hasn't applied
    const projects = await ProjectRequest.find({
      status: "open",
      _id: { $nin: appliedProjectIds }
    }).populate("customer", "name email phone profilePic"); 

    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




// Contractor expresses interest
router.post("/projects/:id/contact", async (req, res) => {
  try {
    const { contractorId } = req.body;
    const projectId = req.params.id;

    // Save contractor interest (later you can extend with proposals)
    res.json({ message: `Contractor ${contractorId} contacted customer for project ${projectId}` });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});




// Show All Contractors (approved only, with rating info)
router.get('/list', async (req, res) => {
  try {
    const list = await Contractor.find({ status: "approved" })
      .select("-password -cnicFront -cnicBack -verificationImage -resetOTP -resetOTPExpires")
      .lean();

    if (!list || list.length === 0) {
      return res.status(200).json({ message: "No contractors found", list: [] });
    }

    res.status(200).json({ message: "Success", list });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", list: [] });
  }
});


// Submit a rating/review for a contractor (customer only)
// POST /contractors/:id/rate
// Body: { customerId, customerName, proposalId, rating (1-5), review }
router.post("/:id/rate", async (req, res) => {
  try {
    const { id: contractorId } = req.params;
    const { customerId, customerName, proposalId, rating, review } = req.body;

    if (!customerId || !rating) {
      return res.status(400).json({ message: "customerId and rating are required." });
    }

    const numRating = Number(rating);
    if (numRating < 1 || numRating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5." });
    }

    const contractor = await Contractor.findById(contractorId);
    if (!contractor) {
      return res.status(404).json({ message: "Contractor not found." });
    }

    // Prevent duplicate reviews from same customer
    const alreadyRated = contractor.reviews.some(
      (r) => r.customer.toString() === customerId
    );
    if (alreadyRated) {
      return res.status(409).json({ message: "You have already rated this contractor." });
    }

    // Add review
    contractor.reviews.push({
      customer: customerId,
      customerName: customerName || "Anonymous",
      proposal: proposalId || null,
      rating: numRating,
      review: review || "",
    });

    // Recompute average rating
    const total = contractor.reviews.reduce((sum, r) => sum + r.rating, 0);
    contractor.rating = parseFloat((total / contractor.reviews.length).toFixed(1));

    await contractor.save();

    res.status(201).json({
      message: "Rating submitted successfully!",
      rating: contractor.rating,
      totalReviews: contractor.reviews.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// GET reviews for a contractor
// GET /contractors/:id/reviews
router.get("/:id/reviews", async (req, res) => {
  try {
    const contractor = await Contractor.findById(req.params.id)
      .select("name profilePic rating reviews")
      .lean();

    if (!contractor) {
      return res.status(404).json({ message: "Contractor not found." });
    }

    // Sort newest first
    const reviews = (contractor.reviews || []).sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.status(200).json({
      contractorName: contractor.name,
      profilePic: contractor.profilePic,
      averageRating: contractor.rating,
      totalReviews: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});




// Get all pending contractors
router.get("/pending", async (req, res) => {
  try {
    const pending = await Contractor.find({ status: "pending" });
    if (!pending || pending.length === 0) {
      return res.status(404).json({ message: "No pending contractors found", list: [] });
    }
    res.status(200).json({ message: "Success", list: pending });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", list: [] });
  }
});


router.get("/:contractorId/accepted", async (req, res) => {
  try {
    const { contractorId } = req.params;
    const proposals = await Proposal.find({ contractor: contractorId, status: "accepted" })
      .populate("customer", "name email phone profilePic")
      .populate("project", "title budget location");

    res.json(proposals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Get contractor by ID
router.get("/:id", async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next();
  }
  try {
    const contractor = await Contractor.findById(req.params.id).select("-password");

    if (!contractor) {
      return res.status(404).json({ message: "Contractor not found" });
    }
    res.json(contractor);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});



module.exports = router;
