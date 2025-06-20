// routes/blockedDates.js
const express = require('express');
const router = express.Router();
const { blockDates, getBlockedDatesByListing } = require('../controllers/BlockedDatesController');
const roleBasedAuthenticationMiddleware = require('../middleware/roleBasedAuthenticationMiddleware');
const { requireAuth } = require('../middleware/authMiddleware');

router.post('/', requireAuth, roleBasedAuthenticationMiddleware("vendor"), blockDates);
router.get('/:listingId', getBlockedDatesByListing);

module.exports = router;
