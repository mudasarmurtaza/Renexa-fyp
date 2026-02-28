const mongoose = require("mongoose");

const getConnection = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/userInfo");
    console.log("✅ MongoDB is connected");
  } catch (error) {
    console.error("❌ MongoDB not connected", error);
  }
};

module.exports = getConnection;
