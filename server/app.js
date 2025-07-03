require("dotenv").config();
const express = require("express");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const apiLimiter = require('./middleware/rateLimit');
const helmet = require('helmet');





const authRoutes = require("./routes/authRoutes");
const CategoryRoutes = require('./routes/categoryRoute')
const adminRoutes = require('./routes/adminRoutes');
const SubCategoryRoutes = require('./routes/SubCategoryRoute')
const ListingRoutes = require('./routes/listingRoutes')
const BookingRoutes = require('./routes/bookingRoutes')
const paymentRoutes = require("./routes/paymentRoutes");
const BlockRoutes = require("./routes/BlockedDatesRoutes");
const ReviewRoutes = require("./routes/ReviewRoutes");
const MessageRoutes = require("./routes/messageRoutes");
const { stripeWebhookHandler } = require("./controllers/bookingController");
const { default: rateLimit } = require("express-rate-limit");
const path = require("path");


require("./config/passport");


const app = express();
app.use(cors({
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  origin: "*",
  credentials: true,
}));



app.use(helmet());
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), stripeWebhookHandler);

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());


// app.use('/api/', apiLimiter);
app.use("/api/payments", paymentRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/categories', CategoryRoutes);
app.use('/api/subCategories', SubCategoryRoutes);
app.use('/api/listing', ListingRoutes);
app.use('/api/booking', BookingRoutes);
app.use('/api/blocked', BlockRoutes);
app.use('/api/review', ReviewRoutes);
app.use('/api/message', MessageRoutes);
app.use('/api/admin', adminRoutes);



const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many login attempts, please try again later."
});
app.use('/api/auth/login', loginLimiter);




app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000' || "192.168.1.17:3000");
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Type');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin'); // Important!
  }
}));

module.exports = app;