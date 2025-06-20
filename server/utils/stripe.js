const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // 👈 Make sure this is set

module.exports = stripe;
