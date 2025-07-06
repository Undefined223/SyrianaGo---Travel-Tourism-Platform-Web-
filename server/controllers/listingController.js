const Booking = require('../models/Booking');
const Listing = require('../models/Listing');
const { error, success } = require('../utils');

exports.createListing = async (req, res) => {
  try {
    if (!req.files)
      return res.status(401).json({ message: "Images Required" })

    const name = JSON.parse(req.body.name || '{}');
    const description = JSON.parse(req.body.description || '{}');
    const location = JSON.parse(req.body.location || '{}');
    const contact = JSON.parse(req.body.contact || '{}');
    const cta = JSON.parse(req.body.cta || '{}');


    const listing = new Listing({
      name,
      description,
      location,
      contact,
      cta,
      pricePerDay: req.body.pricePerDay,
      subcategory: req.body.subcategory,
      vendor: req.user.id,
      isFeatured: req.body.isFeatured === 'true',
      images: req.files?.map(file => file.filename) || []
    });

    await listing.save();
    success.created(res, listing)
  } catch (errorr) {
    console.error("Error creating listing:", errorr);
    error.error(res, errorr.message)

  }
};



exports.getAllListings = async (req, res) => {
  try {
    const listings = await Listing.find().populate('vendor');
    success.fetched(res, listings)
  } catch (err) {
    error.error(res, err.message)
    console.error("Error fetching listings:", err);

  }
};

exports.getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    success.fetched(res, listing)
  } catch (err) {
    error.error(res, err.message)

  }
};

exports.updateListing = async (req, res) => {
  try {
    // Parse JSON fields if they are strings
    const fieldsToParse = ["name", "description", "location", "contact", "cta"];
    const updatedData = { ...req.body };

    fieldsToParse.forEach((field) => {
      if (typeof updatedData[field] === "string") {
        try {
          updatedData[field] = JSON.parse(updatedData[field]);
        } catch (e) {
          // If parsing fails, keep as is
        }
      }
    });

    // Handle images if uploaded
    if (req.files && req.files.length > 0) {
      updatedData.images = req.files.map(file => file.filename);
    }

    // Ensure isFeatured is boolean
    if (typeof updatedData.isFeatured === "string") {
      updatedData.isFeatured = updatedData.isFeatured === "true";
    }

      if (req.body.pricePerDay) {
      updatedData.pricePerDay = req.body.pricePerDay; // ✅ Include this
    }


    const listing = await Listing.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    success.updated(res, listing);
  } catch (err) {
    error.error(res, err.message);
  }
};

exports.deleteListing = async (req, res) => {
  try {
    await Listing.findByIdAndDelete(req.params.id);
    success.deleted(res)
  } catch (err) {
    error.error(res, err.message)

  }
};


exports.getListingsBySubcategory = async (req, res) => {
  try {
    // Trim whitespace and newlines from param
    const subcategoryId = req.params.subcategoryId.trim();

    const listings = await Listing.find({ subcategory: subcategoryId });

    success.fetched(res, listings)
  } catch (error) {
    console.error('Error fetching listings by subcategory:', error);
    error.error(res, err.message)

  }
};

exports.getVendorListings = async (req, res) => {
  try {
    const listings = await Listing.find({ vendor: req.user.id });
    res.status(200).json(listings);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.error("Error fetching vendor listings:", err);
  }
};

exports.getAvailability = async (req, res) => {
  try {
    const { listingId } = req.params;

    const bookings = await Booking.find({
      listingId,
      status: { $in: ['pending', 'confirmed'] }
    });

    const unavailableDates = [];

    bookings.forEach(booking => {
      const checkIn = new Date(booking.details.checkIn);
      const checkOut = new Date(booking.details.checkOut);

      for (
        let d = new Date(checkIn);
        d <= checkOut;
        d.setDate(d.getDate() + 1)
      ) {
        unavailableDates.push(new Date(d).toISOString().split('T')[0]); // "YYYY-MM-DD"
      }
    });

    res.status(200).json({ unavailableDates });
  } catch (error) {
    console.error("Error fetching availability:", error);
    res.status(500).json({ message: "Server error fetching availability" });
  }
};

exports.searchListings = async (req, res) => {
  try {
    const { location, minPrice, maxPrice, guests, title, page = 1, limit = 10 } = req.query;
    const query = {};
    if (location) query.location = { $regex: location, $options: 'i' };
    if (title) query.title = { $regex: title, $options: 'i' };
    if (minPrice && maxPrice) query.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };
    if (guests) query.maxGuests = { $gte: Number(guests) };

    const skip = (page - 1) * limit;

    const listings = await Listing.find(query).skip(skip).limit(Number(limit));
    const total = await Listing.countDocuments(query);

    res.json({
      data: listings,
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit))
    });
  } catch (err) {
    res.status(500).json({ error: 'Search failed' });
  }
};
