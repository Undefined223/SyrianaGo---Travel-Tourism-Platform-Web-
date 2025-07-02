const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");
const stripe = require("../utils/stripe");
const Booking = require('../models/Booking');
const User = require('../models/User');
const Listing = require('../models/Listing');
const sendEmail = require("../utils/email");
const generateOTP = require("../utils/generateOTP");
const { loadTemplate } = require("../utils/emailTemplate");
// Add this at the top with other imports
const crypto = require('crypto');


// Register new user
const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: "All fields are required." });

  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const customer = await stripe.customers.create({
      email: newUser.email,
      name: newUser.name,
    });
    newUser.stripeCustomerId = customer.id;
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.password) return res.status(400).json({ message: "Please login using Google OAuth" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    if (user.twoFactorEnabled) {
      // Generate OTP
      const otp = generateOTP();
      user.twoFactorCode = otp;
      user.twoFactorCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry
      await user.save();

      // Send OTP via email
      await sendEmail({
        to: user.email,
        subject: "Your 2FA Code",
        html: `Your verification code is: ${otp}`
      });


      return res.status(200).json({ message: "2FA code sent to your email", twoFactorRequired: true });
    }

    // If no 2FA, continue normal login
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id, user.role);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken, user: { id: user._id, name: user.name, email: user.email, role: user.role } });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
 // already imported

const updateMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { name, email, oldPassword, newPassword } = req.body;

    // If changing email or password, require old password
    if ((email && email !== user.email) || newPassword) {
      if (!oldPassword) {
        return res.status(400).json({ message: "Current password required" });
      }
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
    }

    // Change email (send confirmation email)
    if (email && email !== user.email) {
      // Optionally, set user.emailVerified = false here
      // Send confirmation email logic (pseudo):
      await sendEmail({
        to: email,
        subject: "Confirm your new email",
        html: `<p>Your email was changed. If this wasn't you, please contact support.</p>`
      });
      user.email = email;
    }

    // Change password
    if (newPassword) {
      user.password = await bcrypt.hash(newPassword, 10);
    }

    // Change name
    if (name) user.name = name;

    await user.save();
    // Remove sensitive fields before sending back
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.twoFactorCode;
    delete userObj.twoFactorCodeExpires;
    res.json(userObj);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -twoFactorCode -twoFactorCodeExpires");
    if (!user) {
      console.warn("User not found for id:", req.user.id);
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("Error in getCurrentUser (backend):", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Google OAuth callback handler
const googleCallback = (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Authentication failed" });

  const accessToken = generateAccessToken(req.user._id, req.user.role);
  const refreshToken = generateRefreshToken(req.user._id, req.user.role);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // Redirect to front-end with access token (adjust URL as needed)
  res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}/oauth-success?token=${accessToken}`);
};

// Refresh access token
const refreshToken = (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "No refresh token provided" });

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_SECRET);
    // decoded should contain user id and role
    const newAccessToken = generateAccessToken(decoded.id, decoded.role);
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    console.error(err);
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate('listingId')
      .sort({ createdAt: -1 });


    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const addToWishlist = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user.wishlist.includes(req.params.listingId)) {
    user.wishlist.push(req.params.listingId);
    await user.save();
  }
  res.json({ wishlist: user.wishlist });
};

const getWishlist = async (req, res) => {
  const user = await User.findById(req.user.id).populate('wishlist');
  res.json(user.wishlist);
}

const removeFromWishlist = async (req, res) => {
  const user = await User.findById(req.user.id);
  user.wishlist = user.wishlist.filter(id => id.toString() !== req.params.listingId);
  await user.save();
  res.json({ wishlist: user.wishlist });
};

const verify2FA = async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ message: "Email and code are required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid request" });

    if (!user.twoFactorEnabled) return res.status(400).json({ message: "2FA not enabled for this user" });

    if (!user.twoFactorCode || !user.twoFactorCodeExpires) {
      return res.status(400).json({ message: "No 2FA code generated" });
    }

    if (user.twoFactorCode !== code) {
      return res.status(400).json({ message: "Invalid 2FA code" });
    }

    if (user.twoFactorCodeExpires < new Date()) {
      return res.status(400).json({ message: "2FA code expired" });
    }

    // Clear code fields
    user.twoFactorCode = null;
    user.twoFactorCodeExpires = null;
    await user.save();

    // Generate tokens now
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id, user.role);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const userRes = await User.findById(user._id).select("-password -twoFactorCode -twoFactorCodeExpires");

    res.json({ accessToken, user: userRes });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const toggle2FA = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.twoFactorEnabled = !user.twoFactorEnabled;
    await user.save();

    res.json({ message: `2FA ${user.twoFactorEnabled ? 'enabled' : 'disabled'}` });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
const getUserRecentActivities = async (req, res) => {
  try {
    const userId = req.params.userId;
    const lang = req.query.lang || 'en';

    // Get recent bookings
    const bookings = await Booking.find({ userId: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('listingId');

    // Get recent wishlist additions
    const user = await User.findById(userId).populate('wishlist');
    const wishlist = (user?.wishlist || [])
      .slice(-5)
      .map(item => ({
        type: "user.wishlist", // translation key
        detailKey: "activity.addedToWishlist", // translation key
        detailParams: { title: item.name?.[lang] || item.name?.en || item.title },
        date: item.createdAt,
      }));

    // Combine and sort by date
    const activities = [
      ...bookings.map(b => ({
        type: "user.bookings", // translation key
        detailKey: "activity.bookedListing", // translation key
        detailParams: { title: b.listingId?.name?.[lang] || b.listingId?.name?.en || "a listing" },
        date: b.createdAt,
      })),
      ...wishlist,
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch recent activities" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -twoFactorCode -twoFactorCodeExpires");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to get users" });
  }
};

const deleteUserById = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user" });
  }
};

const updateUserByAdmin = async (req, res) => {
  const { name, role, email } = req.body;
  const user = await User.findById(req.params.userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (name) user.name = name;
  if (role) user.role = role;
  if (email) user.email = email;


  await user.save();
  res.json({ message: "User updated" });
};


const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(200).json({ message: "If registered, you'll receive a reset link" });

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    // Load email template
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const html = await loadTemplate("password-reset-request.html", {
      appName: process.env.APP_NAME || "Our Service",
      resetUrl
    });

    // Send email
    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      html
    });

    res.status(200).json({ message: "Password reset email sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Update password
    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Send confirmation email
    const html = await loadTemplate("password-reset-success.html", {
      appName: process.env.APP_NAME || "Our Service"
    });

    await sendEmail({
      to: user.email,
      subject: "Password Changed Successfully",
      html
    });

    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { login, register,updateMe, getCurrentUser, getUserRecentActivities, googleCallback, refreshToken, getUserBookings, addToWishlist, removeFromWishlist, getWishlist, verify2FA, toggle2FA, getAllUsers, deleteUserById, updateUserByAdmin, forgotPassword, resetPassword };
