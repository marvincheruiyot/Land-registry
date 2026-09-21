const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const userController = require('../controllers/userController');

router.get('/profile', protect, userController.getProfile);
router.put('/profile', protect, userController.updateProfile);
router.get('/notifications', protect, userController.getNotifications);
router.put('/notifications/:id/read', protect, userController.markNotificationAsRead);

module.exports = router;
