const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const getConnection = require("./utils/getConnection");


// Routes
const contractorRoutes = require("./routes/contractorRoutes");
const customerRoutes = require("./routes/customerRoutes");
const adminRoutes = require("./routes/adminRoutes");
const proposalRoutes = require("./routes/proposalRoutes");
const chatRoutes = require("./routes/chatRoutes"); // new chat routes
const Message = require("./models/Message");
const Admin = require("./models/Admin");
const bcrypt = require("bcryptjs");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Static file serving
app.use("/contractor_images", express.static(path.join(__dirname, "profile_images_contractor")));
app.use("/customer_images", express.static(path.join(__dirname, "profile_images_customer")));
app.use("/house_images", express.static(path.join(__dirname, "House_Images")));

app.use("/contractor_verification_images", express.static(path.join(__dirname, "contractor_verification_images")));
app.use("/contractor_cnic_images", express.static(path.join(__dirname, "contractor_cnic_images")));
app.use("/contractor_verification", express.static(path.join(__dirname, "contractor_verification")));
app.use("/contractor_certifications", express.static(path.join(__dirname, "contractor_certifications")));


// Routes
app.use("/contractor", contractorRoutes);
app.use("/customer", customerRoutes);
app.use("/admin", adminRoutes);
app.use("/proposals", proposalRoutes);
app.use("/chat", chatRoutes); // chat API routes
app.use("/uploads", express.static("uploads"));

// Home route
app.get("/", (req, res) => {
  res.send("Welcome to the API. Use /contractor/signup or /customer/signup.");
});

// Logout route (frontend only)
app.post("/logout", (req, res) => {
  res.json({ message: "Logged out" });
});

// Create HTTP server and attach socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // adjust for your frontend origin
    methods: ["GET", "POST"],
  },
});


io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join a chat room
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  // Listen for chat messages
  socket.on("chatMessage", async ({ roomId, senderId, senderName, message }) => {
    console.log("📩 New chat message:", { roomId, senderId, senderName, message });

    if (!roomId || roomId === "undefined") {
      console.error("❌ roomId invalid");
      return;
    }

    if (!senderId || !message) {
      console.error("❌ senderId or message missing");
      return;
    }

    try {
      const newMessage = new Message({
        chatRoom: roomId,
        senderId,
        senderName,
        message,
        timestamp: new Date(),
      });

      await newMessage.save();
      io.to(roomId).emit("message", newMessage);

    } catch (err) {
      console.error("❌ Error saving message:", err.message);
    }
  });



  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Connect to DB and start server
getConnection().then(async () => {
  // Ensure default admin exists
  try {
    const adminEmail = "mudasir@example.com";
    const existingAdmin = await Admin.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await Admin.create({
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      });
      console.log("✅ Default admin 'mudasir' created (mudasir@example.com / admin123)");
    }
  } catch (error) {
    console.error("❌ Error creating default admin:", error);
  }

  server.listen(5000, () => {
    console.log("🚀 Server running on http://localhost:5000");
  });
});
