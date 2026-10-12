const AuditLog = require('../models/AuditLog');
const User = require('../models/User');
const { logger } = require('../utils/logger');

// @desc    Get audit logs with filtering, searching, and pagination
// @route   GET /api/v1/audit-logs
// @access  Private (All authenticated users can see relevant logs)
exports.getAuditLogs = async (req, res, next) => {
  try {
    const {
      limit = 20,
      page = 1,
      action,
      user,
      entityType,
      severity,
      search,
      startDate,
      endDate
    } = req.query;

    const query = {};

    // Build filter query
    if (action && action !== 'all') {
      query.action = action;
    }
    if (user && user !== 'all') {
      query.user = user;
    }
    if (entityType && entityType !== 'all') {
      query.entityType = entityType;
    }
    if (severity && severity !== 'all') {
      query.severity = severity;
    }

    // Date range filter
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) {
        query.timestamp.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.timestamp.$lte = end;
      }
    }

    // Text search filter
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');

      // Also search users matching the search term
      const matchingUsers = await User.find({
        $or: [
          { fullName: searchRegex },
          { email: searchRegex },
          { nationalId: searchRegex }
        ]
      }).select('_id');

      const userIds = matchingUsers.map(u => u._id);

      query.$or = [
        { description: searchRegex },
        { details: searchRegex },
        { action: searchRegex },
        { ipAddress: searchRegex },
        { entityType: searchRegex },
        { user: { $in: userIds } }
      ];
    }

    // Non-admins can only see their own logs
    if (req.user.role !== 'Administrator') {
      query.user = req.user._id;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [logs, total] = await Promise.all([
      AuditLog.find(query)
        .populate('user', 'fullName email role nationalId')
        .sort({ timestamp: -1, createdAt: -1, _id: -1 })
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

// @desc    Get audit trail statistics and dashboard analytics
// @route   GET /api/v1/audit-logs/stats
// @access  Private (Administrator)
exports.getAuditStats = async (req, res, next) => {
  try {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [
      total,
      todayCount,
      warningCount,
      criticalCount,
      activeUsersCount,
      recentLogs,
      severityAggregation,
      actionAggregation
    ] = await Promise.all([
      AuditLog.countDocuments(),
      AuditLog.countDocuments({
        $or: [
          { timestamp: { $gte: oneDayAgo } },
          { createdAt: { $gte: oneDayAgo } }
        ]
      }),
      AuditLog.countDocuments({ severity: 'warning' }),
      AuditLog.countDocuments({ severity: { $in: ['error', 'critical'] } }),
      AuditLog.distinct('user', {
        $or: [
          { timestamp: { $gte: sevenDaysAgo } },
          { createdAt: { $gte: sevenDaysAgo } }
        ]
      }),
      AuditLog.find()
        .populate('user', 'fullName email role')
        .sort({ timestamp: -1, createdAt: -1, _id: -1 })
        .limit(6)
        .lean(),
      AuditLog.aggregate([
        { $group: { _id: '$severity', count: { $sum: 1 } } }
      ]),
      AuditLog.aggregate([
        { $group: { _id: '$action', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 8 }
      ])
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        total,
        todayCount,
        warningCount,
        criticalCount,
        activeUsersCount: activeUsersCount.filter(Boolean).length,
        recentLogs,
        severityBreakdown: severityAggregation,
        topActions: actionAggregation
      }
    });
  } catch (error) {
    logger.error(`Get audit stats error: ${error.message}`);
    next(error);
  }
};

// @desc    Export audit trail logs as CSV or JSON
// @route   GET /api/v1/audit-logs/export
// @access  Private (Administrator)
exports.exportAuditLogs = async (req, res, next) => {
  try {
    const { format = 'csv', action, severity, entityType, startDate, endDate } = req.query;

    const query = {};
    if (action && action !== 'all') query.action = action;
    if (severity && severity !== 'all') query.severity = severity;
    if (entityType && entityType !== 'all') query.entityType = entityType;

    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.timestamp.$lte = end;
      }
    }

    const logs = await AuditLog.find(query)
      .populate('user', 'fullName email role nationalId')
      .sort({ timestamp: -1, createdAt: -1, _id: -1 })
      .limit(2000)
      .lean();

    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename=audit-trail-${Date.now()}.json`);
      return res.status(200).json(logs);
    }

    // Generate CSV
    const headers = [
      'Log ID',
      'Timestamp',
      'Action',
      'Severity',
      'Actor Name',
      'Actor Email',
      'Actor Role',
      'Actor National ID',
      'IP Address',
      'Entity Type',
      'Entity ID',
      'Description'
    ];

    const csvRows = [headers.join(',')];

    for (const log of logs) {
      const row = [
        `"${log._id || ''}"`,
        `"${(log.timestamp || log.createdAt || '').toISOString ? (log.timestamp || log.createdAt).toISOString() : new Date(log.timestamp || log.createdAt || Date.now()).toISOString()}"`,
        `"${log.action || ''}"`,
        `"${log.severity || 'info'}"`,
        `"${(log.user?.fullName || 'System / Anonymous').replace(/"/g, '""')}"`,
        `"${(log.user?.email || 'N/A').replace(/"/g, '""')}"`,
        `"${(log.user?.role || 'N/A').replace(/"/g, '""')}"`,
        `"${(log.user?.nationalId || 'N/A').replace(/"/g, '""')}"`,
        `"${log.ipAddress || '127.0.0.1'}"`,
        `"${log.entityType || 'General'}"`,
        `"${log.entityId || 'N/A'}"`,
        `"${(log.description || log.details || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`
      ];
      csvRows.push(row.join(','));
    }

    const csvContent = csvRows.join('\r\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=land-registry-audit-trail-${Date.now()}.csv`);
    return res.status(200).send(csvContent);
  } catch (error) {
    logger.error(`Export audit logs error: ${error.message}`);
    next(error);
  }
};

// @desc    Get audit log by ID
// @route   GET /api/v1/audit-logs/:id
// @access  Private (Administrator)
exports.getAuditLogById = async (req, res, next) => {
  try {
    const log = await AuditLog.findById(req.params.id)
      .populate('user', 'fullName email role nationalId phoneNumber');

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
      .sort({ timestamp: -1, createdAt: -1, _id: -1 })
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
      .sort({ timestamp: -1, createdAt: -1, _id: -1 })
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
      $or: [
        { timestamp: { $lt: cutoffDate } },
        { createdAt: { $lt: cutoffDate } }
      ],
      severity: { $ne: 'critical' } // Don't delete critical logs
    });

    logger.info(`Cleaned up ${result.deletedCount} audit logs older than ${days} days`);

    // Log this cleanup action itself
    await AuditLog.log({
      user: req.user._id,
      action: 'SYSTEM_CONFIG_CHANGED',
      entityType: 'System',
      description: `Admin purged ${result.deletedCount} audit logs older than ${days} days`,
      ipAddress: req.ip || '127.0.0.1',
      severity: 'warning'
    });

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
