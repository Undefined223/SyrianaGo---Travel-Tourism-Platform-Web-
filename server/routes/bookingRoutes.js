const express = require('express');
const router = express.Router();
const BookingController = require('../controllers/bookingController');
const { requireAuth } = require('../middleware/authMiddleware');
const roleBasedAuthenticationMiddleware = require('../middleware/roleBasedAuthenticationMiddleware');

router.post('/',
    // requireAuth,
     BookingController.createBooking);
router.get('/',
    requireAuth,
    roleBasedAuthenticationMiddleware("admin"),
     BookingController.getAllBookings);

     router.get('/vendor',
    requireAuth,
    roleBasedAuthenticationMiddleware("vendor" || "admin"),
     BookingController.getVendorBookings);


router.get('/:id',
    requireAuth,
     BookingController.getBookingById);

router.put('/:id',
    requireAuth,
    roleBasedAuthenticationMiddleware('admin'),
     BookingController.updateBooking);
router.delete('/:id',
    requireAuth,
     BookingController.deleteBooking);


     router.post('/webhook', express.raw({ type: 'application/json' }), BookingController.stripeWebhookHandler);



module.exports = router;