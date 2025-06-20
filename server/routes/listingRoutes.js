
// --- routes/listingRoutes.js ---
const express = require('express');
const router = express.Router();
const ListingController = require('../controllers/ListingController');
const { upload } = require('../utils/storage');
const { requireAuth } = require('../middleware/authMiddleware');
const roleBasedAuthenticationMiddleware = require('../middleware/roleBasedAuthenticationMiddleware');
const pagination = require('../middleware/pagination');
const Listing = require('../models/Listing');

router.post('/', upload.array('images', 5),
    requireAuth,
    roleBasedAuthenticationMiddleware("admin",'vendor'),
    ListingController.createListing);

router.get('/',
    ListingController.getAllListings);

router.get('/paginated',
    pagination(Listing),
    (req, res) => res.json(res.paginatedResults)
);


router.get('/search', ListingController.searchListings);


router.get('/:listingId/availability', ListingController.getAvailability);

router.get('/vendorlistings',
    requireAuth,
    roleBasedAuthenticationMiddleware("vendor"),
    ListingController.getVendorListings);

router.get('/:id',
    ListingController.getListingById);


router.put('/:id', upload.array('images'),
    requireAuth,
    roleBasedAuthenticationMiddleware("admin", "vendor"),
    ListingController.updateListing);


router.delete('/:id',
    requireAuth,
    roleBasedAuthenticationMiddleware("admin"),
    ListingController.deleteListing);
router.get('/subcategory/:subcategoryId', ListingController.getListingsBySubcategory);




module.exports = router;