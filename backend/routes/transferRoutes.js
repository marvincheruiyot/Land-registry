const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const transferController = require('../controllers/transferController');

router.post('/', protect, transferController.initiateTransfer);
router.get('/', protect, transferController.getAllTransfers);
router.get('/:id', protect, transferController.getTransferById);
router.put('/:id/approve', protect, authorize('Land_Officer', 'Administrator'), transferController.approveTransfer);
router.put('/:id/reject', protect, authorize('Land_Officer', 'Administrator'), transferController.rejectTransfer);
router.put('/:id/cancel', protect, transferController.cancelTransfer);

module.exports = router;
