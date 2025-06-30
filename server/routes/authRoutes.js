const express = require("express");
const passport = require("passport");
const router = express.Router();
const {
  login,
  register,
  googleCallback,
  refreshToken,
  getUserBookings,
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  verify2FA,
  toggle2FA,
  getCurrentUser,
  getUserRecentActivities,
  updateMe,
  getAllUsers,
  deleteUserById,
  updateUserByAdmin,
} = require("../controllers/authController");
const { requireAuth } = require("../middleware/authMiddleware");
const roleBasedAuthenticationMiddleware = require("../middleware/roleBasedAuthenticationMiddleware");

// Traditional
router.post("/login", login);

router.get("/me", requireAuth, getCurrentUser);
router.put("/me", requireAuth, updateMe);
router.post("/2fa", verify2FA);
router.post('/toggle-2fa', requireAuth, toggle2FA);

router.get("/bookings", requireAuth, getUserBookings);

router.post("/register", register);
router.post("/refresh-token", refreshToken);
router.post('/wishlist/:listingId', requireAuth, addToWishlist);
router.get('/wishlist', requireAuth, getWishlist);
router.delete('/wishlist/:listingId', requireAuth, removeFromWishlist);
router.get('/:userId/recent-activities', getUserRecentActivities);
router.get("/admin/users", requireAuth, roleBasedAuthenticationMiddleware("admin"), getAllUsers);
router.put("/admin/users/:userId", requireAuth, roleBasedAuthenticationMiddleware("admin"), updateUserByAdmin);
router.delete("/admin/users/:userId", requireAuth, roleBasedAuthenticationMiddleware("admin"), deleteUserById);


// Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { session: false }), googleCallback);

module.exports = router;
