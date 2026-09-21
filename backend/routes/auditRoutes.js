const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

const auditController = {
  getAuditLogs: (req, res) => res.json({ message: 'Get audit logs' }),
  getAuditLogById: (req, res) => res.json({ message: 'Get audit log by ID' }),
  getParcelHistory: (req, res) => res.json({ message: 'Get parcel history' })
};

router.get('/', protect, authorize('Administrator'), auditController.getAuditLogs);
router.get('/:id', protect, authorize('Administrator'), auditController.getAuditLogById);
router.get('/parcel/:parcelId', protect, auditController.getParcelHistory);

module.exports = router;
