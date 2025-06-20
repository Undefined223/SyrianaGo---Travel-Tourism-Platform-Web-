// controllers/reviewController.js
const Review = require('../models/Review');

exports.createReview = async (req, res) => {
  const { rating, comment } = req.body;
  const { id: listingId } = req.params;

  try {
    const existing = await Review.findOne({ userId: req.user._id, listingId });
    if (existing) return res.status(400).json({ message: 'You already reviewed this listing.' });

    const review = await Review.create({
      userId: req.user.id,
      listingId,
      rating,
      comment
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Error adding review', error });
    console.error("Error creating review:", error);
  }
};

exports.getReviews = async (req, res) => {
  const { id: listingId } = req.params;

  try {
    const reviews = await Review.find({ listingId }).populate('userId', 'name');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error });
  }
};
