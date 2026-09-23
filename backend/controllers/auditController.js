const AuditLog = require('../models/AuditLog');
const { logger } = require('../utils/logger');

// @desc    Get audit logs with filtering and pagination
// @route   GET /api/v1/audit-logs
// @access  Private (All authenticated users can see relevant logs)
exports.getAuditLogs = async (req, res, next) => {
  try {
    const { limit = 20, page = 1, action, user, entityType } = req.query;

    const query = {};

    // Build filter query
    if (action) query.action = action;
    if (user) query.user = user;
    if (entityType) query.entityType = entityType;

    // Non-admins can only see their own logs
    if (req.user.role !== 'Administrator') {
      query.user = req.user._id;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [logs, total] = await Promise.all([
      AuditLog.find(query)
        .populate('user', 'fullName email role')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(skip)
        .lean(),
      AuditLog.countDocuments(query)
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        logs,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    logger.error(`Get audit logs error: ${error.message}`);
    next(error);
  }
};

// @desc    Get audit log by ID
// @route   GET /api/v1/audit-logs/:id
// @access  Private (Administrator)
exports.getAuditLogById = async (req, res, next) => {
  try {
    const log = await AuditLog.findById(req.params.id)
      .populate('user', 'fullName email role');

    if (!log) {
      return res.status(404).json({
        status: 'error',
        message: 'Audit log not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { log }
    });
  } catch (error) {
    logger.error(`Get audit log by ID error: ${error.message}`);
    next(error);
  }
};

// @desc    Get parcel audit history
// @route   GET /api/v1/audit-logs/parcel/:parcelId
// @access  Private
exports.getParcelHistory = async (req, res, next) => {
  try {
    const logs = await AuditLog.find({
      entityType: 'LandParcel',
      entityId: req.params.parcelId
    })
      .populate('user', 'fullName email role')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      status: 'success',
      data: { logs, count: logs.length }
    });
  } catch (error) {
    logger.error(`Get parcel history error: ${error.message}`);
    next(error);
  }
};

// @desc    Get user activity logs
// @route   GET /api/v1/audit-logs/user/:userId
// @access  Private (Administrator or own user)
exports.getUserActivity = async (req, res, next) => {
  try {
    // Users can only view their own activity unless they're admin
    if (req.user.role !== 'Administrator' && req.user._id.toString() !== req.params.userId) {
      return res.status(403).json({
        status: 'error',
        message: 'You can only view your own activity'
      });
    }

    const logs = await AuditLog.find({ user: req.params.userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    res.status(200).json({
      status: 'success',
      data: { logs, count: logs.length }
    });
  } catch (error) {
    logger.error(`Get user activity error: ${error.message}`);
    next(error);
  }
};

// @desc    Delete old audit logs (cleanup)
// @route   DELETE /api/v1/audit-logs/cleanup
// @access  Private (Administrator only)
exports.cleanupOldLogs = async (req, res, next) => {
  try {
    const { days = 365 } = req.query;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));

    const result = await AuditLog.deleteMany({
      createdAt: { $lt: cutoffDate },
      severity: { $ne: 'critical' } // Don't delete critical logs
    });

    logger.info(`Cleaned up ${result.deletedCount} audit logs older than ${days} days`);

    res.status(200).json({
      status: 'success',
      message: `Deleted ${result.deletedCount} old audit logs`,
      data: { deletedCount: result.deletedCount }
    });
  } catch (error) {
    logger.error(`Cleanup audit logs error: ${error.message}`);
    next(error);
  }
};
