const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  receiver: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  content: { 
    type: String, 
    required: true,
    trim: true 
  },
  bookingId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Booking',
    required: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
  readBy: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    readAt: { type: Date, default: Date.now }
  }]
});

// Index for faster queries
messageSchema.index({ bookingId: 1, timestamp: 1 });

module.exports = mongoose.model("Message", messageSchema);