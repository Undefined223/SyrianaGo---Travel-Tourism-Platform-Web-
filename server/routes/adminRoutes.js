// filepath: c:\Users\InfoPlus\Documents\GitHub\Booking-BackEnd\routes\adminRoutes.js
const express = require('express');
const router = express.Router();
const { getAdminOverview, getBookingTrends, getDashboardAnalytics } = require('../controllers/adminController');
const { requireAuth } = require('../middleware/authMiddleware');
const roleBasedAuthenticationMiddleware = require('../middleware/roleBasedAuthenticationMiddleware');

// Only allow admin users
router.get('/overview', requireAuth, roleBasedAuthenticationMiddleware("admin"), getAdminOverview);
router.get('/analytics', requireAuth, roleBasedAuthenticationMiddleware("admin"), getDashboardAnalytics);
router.get('/booking-trends', requireAuth, roleBasedAuthenticationMiddleware('admin'), getBookingTrends);
module.exports = router;