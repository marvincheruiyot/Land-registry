const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { 
  submitSupportTicket, 
  getSupportTickets,
  updateTicketStatus,
  respondToTicket
} = require('../controllers/supportController');

// Submit support ticket (Land Owners)
router.post('/', protect, submitSupportTicket);

// Get support tickets (Admins/Officers)
router.get('/', protect, authorize('Land_Officer', 'Administrator'), getSupportTickets);

// Update ticket status (Admins only)
router.put('/:id', protect, authorize('Administrator'), updateTicketStatus);

// Respond to ticket (Admins only)
router.post('/:id/respond', protect, authorize('Administrator'), respondToTicket);

module.exports = router;
