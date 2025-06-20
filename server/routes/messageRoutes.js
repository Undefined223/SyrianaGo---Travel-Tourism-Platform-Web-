const express = require('express');
const { sendMessage, getMessages } = require('../controllers/messageController');
const { requireAuth } = require('../middleware/authMiddleware');
const router = express.Router();


router.post('/', requireAuth, sendMessage);
router.get('/:bookingId', requireAuth, getMessages);


module.exports = router;
