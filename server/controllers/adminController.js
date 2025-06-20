const moment = require('moment');
const Listing = require('../models/Listing');
const User = require('../models/User');
const Category = require('../models/Category');
const SubCategory = require('../models/subCategory');
const Booking = require('../models/Booking');



exports.getAdminOverview = async (req, res) => {
  try {
    // User stats
    const totalUsers = await User.countDocuments();
    const userTypes = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } }
    ]);

    // Listings
    const totalListings = await Listing.countDocuments();
    const activeListings = await Listing.countDocuments({ isActive: true });
    const pendingListings = await Listing.countDocuments({ approved: false });

    // Bookings
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: "pending" });
    const confirmedBookings = await Booking.countDocuments({ status: "confirmed" });

    // Categories & Subcategories
    const totalCategories = await Category.countDocuments();
    const totalSubcategories = await SubCategory.countDocuments();

    res.status(200).json({
      users: {
        total: totalUsers,
        types: userTypes.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {})
      },
      listings: {
        total: totalListings,
        active: activeListings,
        pending: pendingListings
      },
      bookings: {
        total: totalBookings,
        pending: pendingBookings,
        confirmed: confirmedBookings
      },
      categories: totalCategories,
      subcategories: totalSubcategories
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch admin overview", error: err.message });
    console.error("Error fetching admin overview:", err);
  }
};

exports.getBookingTrends = async (req, res) => {
  try {
    const now = moment();
    const trends = [];

    for (let i = 11; i >= 0; i--) {
      const month = now.clone().subtract(i, 'months');
      const start = month.startOf('month').toDate();
      const end = month.endOf('month').toDate();

      const count = await Booking.countDocuments({
        createdAt: { $gte: start, $lte: end }
      });

      trends.push({
        month: month.format('MMM'),
        bookings: count
      });
    }

    res.json(trends);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch booking trends", error: err.message });
  }
};


exports.getDashboardAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalListings = await Listing.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalRevenue = await Booking.aggregate([
      { $match: { status: "confirmed" } },
      { $group: { _id: null, sum: { $sum: "$amount" } } }
    ]);
    // Bookings per month (last 12 months)
    const bookingsPerMonth = await Booking.aggregate([
      {
        $group: {
          _id: { $substr: ["$createdAt", 0, 7] }, // "YYYY-MM"
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    res.json({
      totalUsers,
      totalListings,
      totalBookings,
      totalRevenue: totalRevenue[0]?.sum || 0,
      bookingsPerMonth: bookingsPerMonth.map(b => ({
        month: b._id,
        count: b.count,
        monthShort: b._id.split("-")[1] // e.g. "05" for May
      }))
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
};
