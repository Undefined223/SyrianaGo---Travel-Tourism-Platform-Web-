const mongoose = require('mongoose');

const blockedDateSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('BlockedDate', blockedDateSchema);
