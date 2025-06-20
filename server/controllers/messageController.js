const Message = require("../models/message");

exports.sendMessage = async (req, res) => {
  try {
    const { bookingId, content, sender, receiver } = req.body;
    console.log("Received message data:", { bookingId, content, sender, receiver });

    const newMsg = new Message({
      bookingId,
      content,
      sender,
      receiver,
      timestamp: new Date()
    });

    await newMsg.save();

    // Populate sender info for real-time emission
    await newMsg.populate('sender', 'name');
    await newMsg.populate('receiver', 'name');

    const io = req.app.get("io");
    // Emit to the booking room
    io.to(bookingId).emit("newMessage", newMsg);
    io.to(receiver).emit("newMessageNotification", {
      message: newMsg,
      text: `New message from ${newMsg.sender.name}`,
      bookingId: bookingId,
    });

    res.status(201).json(newMsg);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const messages = await Message.find({ bookingId })
      .populate('sender', 'name')
      .populate('receiver', 'name')
      .sort('timestamp');

    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};