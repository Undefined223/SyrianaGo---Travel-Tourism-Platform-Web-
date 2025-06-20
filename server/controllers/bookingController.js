const Booking = require('../models/Booking');
const Listing = require('../models/Listing');
const User = require('../models/User');
const { success, error } = require('../utils');
const stripe = require('../utils/stripe');
const sendMail = require('../utils/email');
const { loadTemplate } = require('../utils/emailTemplate');


async function sendBookingConfirmationEmail(booking) {
  // You can use your existing logic here, e.g.:
  const user = await User.findById(booking.userId);
  const listing = await Listing.findById(booking.listingId);

  const placeholders = {
    bookingId: booking._id,
    listingName: listing.title,
    startDate: new Date(booking.details.checkIn).toDateString(),
    endDate: new Date(booking.details.checkOut).toDateString(),
  };

  const userHtml = await loadTemplate('bookingConfirmed.html', placeholders);

  await sendMail({
    to: user.email,
    subject: 'Booking Confirmation',
    html: userHtml,
  });
}

exports.createBooking = async (req, res) => {
  try {
    const { userId, listingId, details, paymentMethod, paymentMethodId } = req.body;


    // Validate required fields
    if (!userId || !listingId || !details || !paymentMethod) {
      return error.badRequest(res, 'Missing required fields');
    }

    // Validate price
    if (!details.price || details.price <= 0) {
      return error.badRequest(res, 'Invalid price');
    }

    const user = await User.findById(userId);
    if (!user) return error.notFound(res, 'User not found');

    const listing = await Listing.findById(listingId).populate('vendor');
    if (!listing) return error.notFound(res, 'Listing not found');

    const placeholders = {
      listingTitle: listing.title,
      guestName: user.name,
      userName: user.name,
      checkIn: new Date(details.checkIn).toDateString(),
      checkOut: new Date(details.checkOut).toDateString(),
      guests: details.guests.toString(),
    };
    // Load templates
    const vendorHtml = await loadTemplate('newBookingVendor.html', placeholders);
    const userHtml = await loadTemplate('bookingConfirmed.html', placeholders);

    // Send emails
    await sendMail({
      to: listing.vendor.email,
      subject: 'New Booking Received',
      html: vendorHtml,
    });

    await sendMail({
      to: user.email,
      subject: 'Booking Confirmation',
      html: userHtml,
    });

    let booking;
    const amount = Math.round(details.price * 100); // Convert to cents

    switch (paymentMethod) {
      case 'saved': // Using saved payment method
        {
          if (!user.stripeCustomerId) {
            return error.badRequest(res, 'No payment methods available');
          }

          const methodId = paymentMethodId || user.defaultPaymentMethod;
          if (!methodId) {
            return error.badRequest(res, 'No payment method selected');
          }

          // Verify the payment method belongs to user
          const validMethod = user.paymentMethods.some(m => m.id === methodId);
          if (!validMethod) {
            return error.badRequest(res, 'Invalid payment method');
          }

          const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            customer: user.stripeCustomerId,
            payment_method: methodId,
            confirm: true,
            off_session: true,
            metadata: {
              userId,
              listingId,
              bookingType: 'saved_payment'
            }
          });

          // Handle 3D Secure requirement
          if (paymentIntent.status === 'requires_action') {
            return res.status(200).json({
              requiresAction: true,
              clientSecret: paymentIntent.client_secret,
              bookingId: (await Booking.create({
                userId,
                listingId,
                details,
                status: 'pending',
                paymentMethod: 'stripe',
                paymentIntentId: paymentIntent.id,
              }))._id
            });
          }

          // Create confirmed booking
          booking = await Booking.create({
            userId,
            listingId,
            details,
            status: 'confirmed',
            paymentMethod: 'stripe',
            paymentIntentId: paymentIntent.id,
          });

          await sendBookingConfirmationEmail(booking);
        }
        break;

      case 'stripe': // New card payment
        {
          const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            metadata: {
              userId,
              listingId,
              bookingType: 'new_card'
            },
            payment_method_types: ['card'],
          });

          // Create pending booking
          booking = await Booking.create({
            userId,
            listingId,
            details,
            status: 'pending',
            paymentMethod: 'stripe',
            paymentIntentId: paymentIntent.id,
          });

          return res.status(201).json({
            bookingId: booking._id,
            clientSecret: paymentIntent.client_secret,
            requiresAction: paymentIntent.status === 'requires_action'
          });
        }

      case 'cod': // Cash on Delivery
        {
          booking = await Booking.create({
            userId,
            listingId,
            details,
            status: 'confirmed',
            paymentMethod: 'cod',
          });

          await sendBookingConfirmationEmail(booking);
          return success.created(res, { bookingId: booking._id });
        }

      default:
        return error.badRequest(res, 'Invalid payment method');
    }



    
    success.created(res, { bookingId: booking._id });
  } catch (err) {
    console.error('Booking error:', err);

    // Handle Stripe specific errors
    if (err.type === 'StripeError') {
      switch (err.code) {
        case 'authentication_required':
          return res.status(400).json({
            error: 'Payment requires authentication',
            clientSecret: err.raw.payment_intent.client_secret
          });

        case 'payment_intent_authentication_failure':
          return error.badRequest(res, 'Authentication failed');

        case 'card_declined':
          return error.badRequest(res, 'Card declined');

        default:
          return error.serverError(res, 'Payment processing failed');
      }
    }

    // Handle duplicate booking attempts
    if (err.code === 11000) {
      return error.badRequest(res, 'Duplicate booking detected');
    }

    return error.error(res, 'Booking failed');
  }
};

exports.handlePaymentRetry = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);

    if (!booking) return error.notFound(res, 'Booking not found');
    if (booking.status !== 'pending') {
      return error.badRequest(res, 'Booking is not in pending state');
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(
      booking.paymentIntentId
    );

    return res.json({
      clientSecret: paymentIntent.client_secret,
      requiresAction: paymentIntent.status === 'requires_action'
    });
  } catch (err) {
    return error.serverError(res, 'Payment retry failed');
  }
};
exports.stripeWebhookHandler = async (req, res) => {
  let event;

  console.log('📩 Stripe webhook received:', new Date().toISOString());

  res.status(200).json({ received: true });
  try {
    // Verify webhook signature for security
    const signature = req.headers['stripe-signature'];
    if (!signature) {
      console.error('❌ No Stripe signature found');
      return res.status(400).send('No signature found');
    }

    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    console.log('✅ Webhook signature verified, event type:', event.type);

  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        console.log(`💰 PaymentIntent succeeded: ${paymentIntent.id}`);

        // Find and update booking with proper error handling
        const booking = await Booking.findOneAndUpdate(
          { paymentIntentId: paymentIntent.id },
          {
            status: 'confirmed',
            updatedAt: new Date()
          },
          {
            new: true,
            runValidators: true
          }
        ).populate('userId listingId');

        if (!booking) {
          console.warn(`⚠️ No booking found for PaymentIntent: ${paymentIntent.id}`);
          // Don't return error - this might be a test payment or other legitimate case
          return res.status(200).json({ received: true, warning: 'Booking not found' });
        }

        console.log(`✅ Booking ${booking._id} confirmed successfully`);

        // Send confirmation email
        try {
          await sendBookingConfirmationEmail(booking);
          console.log(`📧 Confirmation email sent for booking: ${booking._id}`);
        } catch (emailError) {
          console.error(`❌ Failed to send confirmation email:`, emailError);
          // Don't fail the webhook for email errors
        }

        break;
      }

      case 'payment_intent.payment_failed': {
        const failedIntent = event.data.object;
        console.log(`❌ Payment failed for PaymentIntent: ${failedIntent.id}`);

        const booking = await Booking.findOneAndUpdate(
          { paymentIntentId: failedIntent.id },
          {
            status: 'failed',
            updatedAt: new Date()
          },
          { new: true }
        );

        if (booking) {
          console.log(`📝 Booking ${booking._id} marked as failed`);
        } else {
          console.warn(`⚠️ No booking found for failed PaymentIntent: ${failedIntent.id}`);
        }

        break;
      }

      case 'payment_intent.requires_action': {
        const actionRequiredIntent = event.data.object;
        console.log(`🔐 Payment requires action: ${actionRequiredIntent.id}`);
        // Booking should already be in 'pending' status, no update needed
        break;
      }

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }

    // Always respond with success to prevent Stripe retries
    return res.status(200).json({ received: true, eventType: event.type });

  } catch (error) {
    console.error('❌ Webhook processing error:', error);

    // Log more details for debugging
    console.error('Event ID:', event?.id);
    console.error('Event type:', event?.type);
    console.error('PaymentIntent ID:', event?.data?.object?.id);

    // Return 500 to trigger Stripe retry
    return res.status(500).json({
      error: 'Internal server error',
      eventId: event?.id
    });
  }
};

// exports.stripeWebhookHandler = async (req, res) => {
//   let event;
//   console.log("📩 Stripe webhook received");
//   try {
//     // Verify webhook signature for security
//     const signature = req.headers['stripe-signature'];
//     event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);

//   } catch (err) {
//     console.error('Webhook signature verification failed:', err.message);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   // Handle the event
//   if (event.type === 'payment_intent.succeeded') {
//     const paymentIntent = event.data.object;
//     console.log(`PaymentIntent succeeded: ${paymentIntent.id}`);

//     try {
//       // Find the booking associated with this PaymentIntent
//       const booking = await Booking.findOne({ paymentIntentId: paymentIntent.id });
//       if (!booking) {
//         console.warn(`Booking not found for PaymentIntent: ${paymentIntent.id}`);
//         return res.status(404).send('Booking not found');
//       }

//       booking.status = 'confirmed';
//       await booking.save();

//       // Send booking confirmation email
//       await sendBookingConfirmationEmail(booking);

//       return res.status(200).send('Booking confirmed');
//     } catch (error) {
//       console.error('Error confirming booking:', error);
//       return res.status(500).send('Internal server error');
//     }
//   }

//   // Return a response for other event types or ignore
//   res.json({ received: true });
// };

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('listingId userId');
    return success.fetched(res, bookings)
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.error('Error fetching bookings:', err);
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('listing user');
    if (!booking) return error.notFound(res, 'Booking Not Found');
    success.fetched(res, booking)
  } catch (err) {
    error.error(res, "Failed to get Booking")
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    success.updated(res, booking)
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    success.deleted(res)
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getVendorBookings = async (req, res) => {
  try {

    // Step 1: Find listings for this vendor
    const listings = await Listing.find({ vendor: req.user.id }).select('_id');

    // Step 2: Extract listing IDs
    const listingIds = listings.map(listing => listing._id);

    // Step 3: Find bookings for these listings
    const bookings = await Booking.find({ listingId: { $in: listingIds } })
      .populate('userId', 'name email')
      .populate('listingId');

    // Step 4: Send response
    res.status(200).json(bookings);
  } catch (err) {
    console.error("Error in getVendorBookings:", err);
    res.status(500).json({ error: err.message });
  }
};