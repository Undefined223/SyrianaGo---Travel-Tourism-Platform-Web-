const mongoose = require("mongoose");

const paymentMethodSchema = new mongoose.Schema({
  id: { type: String, required: true },
  brand: { type: String, required: true },
  last4: { type: String, required: true },
  exp_month: { type: Number, required: true },
  exp_year: { type: Number, required: true },
  isDefault: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true, required: true },
  password: { type: String },
  googleId: { type: String, unique: true, sparse: true },
  role: { type: String, enum: ["user", "vendor", "admin"], default: "user" },
  stripeCustomerId: { type: String },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }],
  paymentMethods: [paymentMethodSchema],
  defaultPaymentMethod: { type: String },
  twoFactorEnabled: { type: Boolean, default: false },
  twoFactorCode: { type: String },
  twoFactorCodeExpires: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);