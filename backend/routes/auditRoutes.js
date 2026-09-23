const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const auditController = require('../controllers/auditController');

// All authenticated users can fetch their audit logs
router.get('/', protect, auditController.getAuditLogs);

// Administrator only routes
router.get('/:id', protect, authorize('Administrator'), auditController.getAuditLogById);
router.delete('/cleanup', protect, authorize('Administrator'), auditController.cleanupOldLogs);

// Specific entity history
router.get('/parcel/:parcelId', protect, auditController.getParcelHistory);
router.get('/user/:userId', protect, auditController.getUserActivity);

module.exports = router;
