const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Path for contractor certification images
const uploadDir = path.join(__dirname, "../contractor_certifications");

// Ensure directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

// Accept only image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: { 
    files: 10, // Max 10 certification images
    fileSize: 5 * 1024 * 1024 // 5MB limit per file
  }
});

module.exports = upload.array("certificationImages", 10);
