const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ✅ Path for house images
const uploadDir = path.join(__dirname, "House_Images");

// ✅ Ensure directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Configure storage
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

// ✅ File type filter (images only)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("❌ Only image files are allowed"), false);
  }
};

// ✅ Multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: { files: 5 }, // Max 5 images allowed
});

// ✅ Export middleware for multiple images
module.exports = upload.array("attachments", 5);
