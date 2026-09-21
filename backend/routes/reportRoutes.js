const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const reportController = require('../controllers/reportController');

router.post('/generate', protect, authorize('Land_Officer', 'Administrator'), reportController.generateReport);
router.get('/', protect, authorize('Land_Officer', 'Administrator'), reportController.getReports);
router.get('/:id/download', protect, authorize('Land_Officer', 'Administrator'), reportController.downloadReport);

module.exports = router;
