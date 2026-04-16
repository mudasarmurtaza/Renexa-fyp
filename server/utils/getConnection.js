const mongoose = require("mongoose");

const getConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/userInfo");
    console.log("✅ MongoDB is connected");
  } catch (error) {
    console.error("❌ MongoDB not connected. Please ensure the MongoDB service is running (e.g., run 'mongod' or check Windows Services).", error.message);
  }
};

module.exports = getConnection;
