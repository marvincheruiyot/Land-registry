const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const auditController = require('../controllers/auditController');

// All authenticated users can fetch their audit logs (filtered to self if non-admin)
router.get('/', protect, auditController.getAuditLogs);

// Administrator only routes (placed before /:id)
router.get('/stats', protect, authorize('Administrator'), auditController.getAuditStats);
router.get('/export', protect, authorize('Administrator'), auditController.exportAuditLogs);
router.delete('/cleanup', protect, authorize('Administrator'), auditController.cleanupOldLogs);

// Specific entity history
router.get('/parcel/:parcelId', protect, auditController.getParcelHistory);
router.get('/user/:userId', protect, auditController.getUserActivity);

// Administrator specific log detail
router.get('/:id', protect, authorize('Administrator'), auditController.getAuditLogById);

module.exports = router;
