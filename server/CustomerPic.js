const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ✅ Path for contractor profile images
const uploadDir = path.join(__dirname, "profile_images_customer");

// ✅ Ensure directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("Multer Destination called for file:", file.originalname);
    cb(null, uploadDir); // store in profile_images_contractor folder
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    console.log("Multer Filename generated:", uniqueName);
    cb(null, uniqueName);
  },
});

// ✅ Accept only image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload.single("profilePic"); // must match React form field name
