const stripe = require("../utils/stripe");
const User = require("../models/User");
const sendMail = require('../utils/email');
const { loadTemplate } = require('../utils/email');
const { success, error } = require("../utils");
const Booking = require("../models/Booking");

exports.getPaymentMethods = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return error.notFound(res, "User not found");
    return success.fetched(res, user.paymentMethods || []);
  } catch (err) {
    console.error('Error:', err);
    return error.error(res, 'Failed to get payment methods');
  }
};
exports.addPaymentMethod = async (req, res) => {
  try {
    const { paymentMethodId } = req.body;
    const user = await User.findById(req.user.id);

    if (!user.stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name
      });
      user.stripeCustomerId = customer.id;
    }

    // Attach payment method to customer
    const paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
      customer: user.stripeCustomerId
    });

    // Optionally set as default if first card
    const isDefault = user.paymentMethods.length === 0;
    if (isDefault) {
      await stripe.customers.update(user.stripeCustomerId, {
        invoice_settings: { default_payment_method: paymentMethod.id }
      });
      user.defaultPaymentMethod = paymentMethod.id;
    }

    // Save to user profile
    const newMethod = {
      id: paymentMethod.id,
      brand: paymentMethod.card.brand,
      last4: paymentMethod.card.last4,
      exp_month: paymentMethod.card.exp_month,
      exp_year: paymentMethod.card.exp_year,
      isDefault
    };
    user.paymentMethods.push(newMethod);
    await user.save();

    return success.created(res, user.paymentMethods);
  } catch (err) {
    console.error("Add payment error:", err);
    return error.serverError(res, "Failed to add payment method");
  }
};
exports.removePaymentMethod = async (req, res) => {
  try {
    const { paymentMethodId } = req.body;
    const user = await User.findById(req.user.id);

    // Detach from Stripe
    await stripe.paymentMethods.detach(paymentMethodId);

    // Remove from user profile
    user.paymentMethods = user.paymentMethods.filter(m => m.id !== paymentMethodId);

    // If removed method was default, set another as default
    if (user.defaultPaymentMethod === paymentMethodId) {
      const nextDefault = user.paymentMethods[0];
      if (nextDefault) {
        await stripe.customers.update(user.stripeCustomerId, {
          invoice_settings: { default_payment_method: nextDefault.id }
        });
        user.defaultPaymentMethod = nextDefault.id;
        user.paymentMethods = user.paymentMethods.map(m => ({
          ...m.toObject(),
          isDefault: m.id === nextDefault.id
        }));
      } else {
        user.defaultPaymentMethod = null;
      }
    }
    await user.save();

    return success.deleted(res, user.paymentMethods);
  } catch (err) {
    return error.serverError(res, "Failed to remove payment method");
  }
};

exports.setDefaultPaymentMethod = async (req, res) => {
  try {
    const { paymentMethodId } = req.body;
    const user = await User.findById(req.user.id);

    await stripe.customers.update(user.stripeCustomerId, {
      invoice_settings: { default_payment_method: paymentMethodId }
    });

    user.paymentMethods = user.paymentMethods.map(method => ({
      ...method.toObject(),
      isDefault: method.id === paymentMethodId
    }));
    user.defaultPaymentMethod = paymentMethodId;
    await user.save();

    return success.updated(res, user.paymentMethods);
  } catch (err) {
    return error.serverError(res, "Failed to set default payment");
  }
};

// POST /api/payments/charge
// const chargeUser = async (req, res) => {
//   try {
//     const { amount } = req.body;
//     const user = await User.findById(req.user.id);

//     if (!user.stripeCustomerId || !user.defaultPaymentMethod) {
//       return res.status(400).json({ message: "No payment method saved" });
//     }

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: amount * 100, // convert to cents
//       currency: "usd",
//       customer: user.stripeCustomerId,
//       payment_method: user.defaultPaymentMethod,
//       off_session: true,
//       confirm: true,
//     });

//     res.status(200).json({
//       message: "Payment successful",
//       paymentIntentId: paymentIntent.id,
//       status: paymentIntent.status
//     });
//   } catch (error) {
//     console.error("Charge user error:", error);
//     res.status(500).json({ message: "Payment failed", error: error.message });
//   }
// };


exports.cancelBooking =  async (req, res) => {
  try {
    const bookingId = req.params.id;
    const booking = await Booking.findById(bookingId);

    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    if (booking.status === "cancelled")
      return res.status(400).json({ message: "Booking already cancelled" });

    if (booking.paymentIntentId) {
      await stripe.refunds.create({
        payment_intent: booking.paymentIntentId,
      });
    }

    booking.status = "cancelled";
    await booking.save();

      const placeholders = {
      listingTitle: booking.listingId.title,
    };
    const cancelHtml = await loadTemplate('bookingCancelled.html', placeholders);

    // Notify user
    await sendMail({
      to: booking.userId.email,
      subject: 'Booking Cancelled',
      html: cancelHtml,
    });


    const userEmail = req.user.email;

    // Assuming loadTemplate and sendEmail functions are defined elsewhere for email sending
    // const html = await loadTemplate("bookingCancelled.html", {
    //   bookingId: booking._id.toString(),
    // });

    const subject = "Booking Cancelled and Refunded";

    // await sendEmail(userEmail, subject, "", html);


    res.status(200).json({ message: "Booking cancelled and refunded. Confirmation email sent." });
  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

