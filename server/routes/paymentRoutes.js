const express = require("express");
const router = express.Router();
const { 
  addPaymentMethod, 
  getPaymentMethods, 
  setDefaultPaymentMethod 
} = require("../controllers/paymentController");
const { requireAuth } = require("../middleware/authMiddleware");

// Payment method routes
router.get('/',requireAuth, getPaymentMethods);
router.post('/', addPaymentMethod);
router.put('/default', requireAuth, setDefaultPaymentMethod);

module.exports = router;