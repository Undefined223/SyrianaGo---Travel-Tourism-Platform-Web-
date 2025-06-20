// routes/reviews.js
const express = require('express');
const router = express.Router();
const { createReview, getReviews } = require('../controllers/ReviewController');
const { requireAuth } = require('../middleware/authMiddleware');

router.post('/:id/reviews', requireAuth, createReview);
router.get('/:id/reviews', getReviews);

module.exports = router;
