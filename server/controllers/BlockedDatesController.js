// controllers/blockedDatesController.js
const BlockedDate = require('../models/BlockedDates');

exports.blockDates = async (req, res) => {
  const { listingId, startDate, endDate } = req.body;

  try {
    const blocked = await BlockedDate.create({
      vendorId: req.user._id,
      listingId,
      startDate,
      endDate
    });

    res.status(201).json(blocked);
  } catch (error) {
    res.status(500).json({ message: 'Failed to block dates', error });
  }
};

exports.getBlockedDatesByListing = async (req, res) => {
  const { listingId } = req.params;

  try {
    const blockedDates = await BlockedDate.find({ listingId });
    res.json(blockedDates);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch blocked dates', error });
  }
};
