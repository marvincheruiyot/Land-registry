const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { submitSupportTicket, getSupportTickets } = require('../controllers/supportController');

// Submit support ticket (Land Owners)
router.post('/', protect, submitSupportTicket);

// Get support tickets (Admins/Officers)
router.get('/', protect, getSupportTickets);

module.exports = router;
