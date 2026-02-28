// routes/customerRoutes.js
const express = require("express");
const jwt = require("jsonwebtoken");
const Customer = require("../models/Customer");
const customerFileUpload = require("../CustomerPic");
const { JWT_SECRET } = require("../utils/jwtConfig");
const authMiddleware = require("../middleware/authMiddleware.js");

const uploadHouseImages = require("../HouseImages"); // import custom multer config


const router = express.Router();

const ProjectRequest = require('../models/ProjectRequest');

// Customer signup
router.post("/signup", customerFileUpload, async (req, res) => {
  try {
    const customerData = {
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      address: req.body.address,
      password: req.body.password,
      gender: req.body.gender,
      profilePic: req.file ? `/customer_images/${req.file.filename}` : null,
    };

    const customer = new Customer(customerData);
    await customer.save();

    res.status(201).json({ message: "Customer registered successfully", customer });
  } catch (error) {
    if (error.code === 11000) {
      if (error.keyPattern.phone) return res.status(400).json({ error: "Phone already registered" });
      if (error.keyPattern.email) return res.status(400).json({ error: "Email already registered" });
    }
    res.status(400).json({ error: error.message });
  }
});


router.get("/me", authMiddleware, (req, res) => {
  res.json({ authenticated: true, user: req.user });
});


// Customer login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Customer.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, email: user.email, profilePic: user.profilePic }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "Login successful", token, user: { id: user._id, name:user.name , phone:user.phone , gender:user.gender,  email: user.email, profilePic: user.profilePic ,address:user.address, role:user.role}});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update customer profile
router.put("/update/:id", customerFileUpload, async (req, res) => {
  try {
    const { id } = req.params;

    const updatedData = {
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      address: req.body.address,
      gender: req.body.gender,
    };

    // If new profile picture uploaded
    if (req.file) {
      updatedData.profilePic = `/customer_images/${req.file.filename}`;
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json({
      message: "Profile updated successfully",
      customer: updatedCustomer,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// ✅ POST: create project request
router.post("/projects", uploadHouseImages, async (req, res) => {
  try {
    const {
      title,
      location,
      plotSize,
      budget,
      description,
      category,
      deadline,
      urgency,
      customer,
    } = req.body;

    if (!customer) {
      return res.status(400).json({ error: "Customer ID is required" });
    }

    // Check if customer already has a project request
    const existingProject = await ProjectRequest.findOne({ customer });
    if (existingProject) {
      return res.status(400).json({ error: "You have already submitted a project request." });
    }

    // Save relative paths instead of full system paths
    const attachments = req.files?.map(file => `/house_images/${file.filename}`) || [];

    const newProject = new ProjectRequest({
      customer,
      title,
      location,
      plotSize,
      budget,
      description,
      category,
      deadline,
      urgency,
      attachments,
    });

    await newProject.save();
    res.status(201).json({
      message: "✅ Project request created successfully",
      project: newProject,
    });
  } catch (error) {
    console.error("❌ Error saving project:", error);
    res.status(400).json({ error: error.message });
  }
});

// DELETE: Delete a project request by ID
router.delete("/projects/:requestId", async (req, res) => {
  try {
    const { requestId } = req.params;

    const project = await ProjectRequest.findById(requestId);
    if (!project) {
      return res.status(404).json({ message: "Project request not found" });
    }

    await ProjectRequest.findByIdAndDelete(requestId);

    res.status(200).json({ message: "Project request deleted successfully" });
  } catch (err) {
    console.error("Error deleting project request:", err);
    res.status(500).json({ error: err.message });
  }
});






//Show All Customers
router.get('/list',async (req,res)=>{
   
  try {
    const list = await Customer.find();
    
     if (!list || list.length === 0) {
      return res.status(404).json({ message: "No customers found", list: [] });
    }
    res.status(200).json({message:"Success",list})
    
  } catch (error) {
    res.status(200).json({message:""})
  }
})


// Get single customer by ID
router.get("/:id", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ⭐ GET: Fetch all project requests of a customer
router.get("/projects/:customerId", async (req, res) => {
  try {
    const { customerId } = req.params;

    const projects = await ProjectRequest.find({ customer: customerId })
      .sort({ createdAt: -1 });

    if (!projects.length) {
      return res.status(404).json({ message: "No project requests found" });
    }

    res.json({ message: "Success", projects });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
