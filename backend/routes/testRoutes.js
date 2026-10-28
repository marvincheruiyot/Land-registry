const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const testController = require('../controllers/testController');

// Test email (requires authentication)
router.post('/email', protect, testController.testEmail);

// Get email configuration status
router.get('/email-status', protect, testController.getEmailStatus);

module.exports = router;
