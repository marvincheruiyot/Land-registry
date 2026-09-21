const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect, authorize } = require('../middleware/auth');
const documentController = require('../controllers/documentController');

// Multer storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

router.post('/upload', protect, upload.single('file'), documentController.uploadDocument);
router.get('/', protect, documentController.getDocuments);
router.get('/:id', protect, documentController.getDocument);
router.get('/:id/download', protect, documentController.downloadDocument);
router.delete('/:id', protect, authorize('Land_Officer', 'Administrator'), documentController.deleteDocument);

module.exports = router;
