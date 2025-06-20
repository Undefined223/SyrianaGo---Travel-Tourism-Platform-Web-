const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  name: {
    en: { type: String, required: true },
    fr: { type: String },
    ar: { type: String },
  },
  description: {
    en: { type: String },
    fr: { type: String },
    ar: { type: String },
  },
  images: [{ type: String }],
  subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory', required: true },
  location: {
    city: String,
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  contact: {
    phone: String,
    email: String,
    website: String,
  },
  cta: {
    label: { type: String, default: 'Learn More' },
    url: String,
  },
  isFeatured: { type: Boolean, default: false },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Listing', ListingSchema);
