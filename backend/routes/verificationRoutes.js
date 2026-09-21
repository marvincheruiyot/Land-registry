const express = require('express');
const router = express.Router();
const { optionalAuth } = require('../middleware/auth');
const verificationController = require('../controllers/verificationController');

router.get('/token/:token', optionalAuth, verificationController.verifyByToken);
router.get('/parcel/:parcelNumber', optionalAuth, verificationController.verifyByParcelNumber);

module.exports = router;
