const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect, authorize } = require('../middleware/auth');
const transferController = require('../controllers/transferController');

// Multer configuration for transfer documents
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

router.post('/', protect, upload.array('documents', 5), transferController.initiateTransfer);
router.get('/', protect, transferController.getAllTransfers);
router.get('/count/pending', protect, authorize('Land_Officer', 'Administrator'), transferController.getPendingTransfersCount);
router.get('/:id', protect, transferController.getTransferById);
router.put('/:id/approve', protect, authorize('Land_Officer'), transferController.approveTransfer);
router.put('/:id/reject', protect, authorize('Land_Officer'), transferController.rejectTransfer);
router.put('/:id/cancel', protect, transferController.cancelTransfer);

module.exports = router;
