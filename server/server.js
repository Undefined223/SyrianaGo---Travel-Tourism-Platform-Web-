require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const app = require("./app");
const { startScheduler } = require("./jobs/Scheduler");
const path = require("path");
const Message = require("./models/message");


// Initialize socket.io after HTTP server
const server = http.createServer(app);

// Initialize socket.io after HTTP server
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: ["http://localhost:3000", "http://192.168.1.17:3000"], // Change if different in prod
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});


app.set("io", io);

app.get("/test-notif/:userId", (req, res) => {
  const io = req.app.get("io");
  const userId = req.params.userId;
  io.to(userId).emit("newMessageNotification", {
    message: { content: "Test message content" },
    text: "Test notification from backend",
    bookingId: "test-booking-id"
  });
  res.send(`Test notification sent to user ${userId}`);
});
// Socket.io event handling
io.on("connection", (socket) => {
  console.log("✅ Socket connected:", socket.id);

  // User setup - join their personal room
  socket.on("setup", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined personal room`);
  });

  // Join a booking room for chat
  socket.on("joinRoom", ({ roomId, userId }) => {
    socket.join(roomId);
    socket.userId = userId; // Store user ID on socket
    console.log(`✅ User ${userId} joined booking room ${roomId}`);
  });

  // Leave a booking room
  socket.on("leaveRoom", ({ roomId, userId }) => {
    socket.leave(roomId);
    console.log(`❌ User ${userId} left booking room ${roomId}`);
  });

  // Handle sending messages through socket (alternative to HTTP)
  socket.on("sendMessage", async (data) => {
    console.log("Received message data emited:", data);
    try {
      const { bookingId, content, sender, receiver } = data;

      const newMsg = new Message({
        bookingId,
        content,
        sender,
        receiver,
        timestamp: new Date()
      });
      

      await newMsg.save();
      await newMsg.populate('sender', 'name');
      await newMsg.populate('receiver', 'name');

      // Emit to all users in the booking room
      io.to(bookingId).emit("newMessage", newMsg);
      // After io.to(bookingId).emit("newMessage", newMsg);
      io.to(receiver).emit("newMessageNotification", {
        message: newMsg,
        text: `New message from ${newMsg.sender.name}`,
        bookingId: bookingId,
      });
      

    } catch (error) {
      console.error("Socket message error:", error);
      socket.emit("messageError", { error: "Failed to send message" });
    }
  });

  // Typing indicators
  socket.on("typing", ({ bookingId, userId }) => {
    socket.to(bookingId).emit("userTyping", { userId });
  });

  socket.on("stopTyping", ({ bookingId, userId }) => {
    socket.to(bookingId).emit("userStoppedTyping", { userId });
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    startScheduler();
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err);
  });