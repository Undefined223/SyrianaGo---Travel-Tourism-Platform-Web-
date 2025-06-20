const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  listingId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Listing' },
  details: { type: Object, required: true }, // booking details like dates, guests, etc.
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'cancelled', 'failed'], // Added 'failed' status
    default: 'pending' 
  },
  paymentMethod: { type: String, enum: ['stripe', 'cod'], required: true },
  paymentIntentId: { type: String }, // Stripe PaymentIntent id
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Add index for faster webhook lookups
bookingSchema.index({ paymentIntentId: 1 });

// Update the updatedAt field on save
bookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);