const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');
const { logger } = require('../utils/logger');

// @desc    Get user notifications
// @route   GET /api/v1/notifications
// @access  Private
exports.getNotifications = async (req, res, next) => {
  try {
    const { limit = 20, unreadOnly = false } = req.query;

    const query = { recipient: req.user._id };
    if (unreadOnly === 'true') {
      query.isRead = false;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .lean();

    const unreadCount = await Notification.countDocuments({
      recipient: req.user._id,
      isRead: false
    });

    res.status(200).json({
      status: 'success',
      data: {
        notifications,
        unreadCount
      }
    });
  } catch (error) {
    logger.error(`Get notifications error: ${error.message}`);
    next(error);
  }
};

// @desc    Mark notification as read
// @route   PUT /api/v1/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        recipient: req.user._id
      },
      {
        isRead: true,
        readAt: new Date()
      },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        status: 'error',
        message: 'Notification not found'
      });
    }

    const unreadCount = await Notification.countDocuments({
      recipient: req.user._id,
      isRead: false
    });

    res.status(200).json({
      status: 'success',
      data: { notification, unreadCount }
    });
  } catch (error) {
    logger.error(`Mark notification as read error: ${error.message}`);
    next(error);
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/v1/notifications/mark-all-read
// @access  Private
exports.markAllAsRead = async (req, res, next) => {
  try {
    const result = await Notification.updateMany(
      {
        recipient: req.user._id,
        isRead: false
      },
      {
        isRead: true,
        readAt: new Date()
      }
    );

    res.status(200).json({
      status: 'success',
      message: `Marked ${result.modifiedCount} notifications as read`,
      data: {
        modifiedCount: result.modifiedCount,
        unreadCount: 0
      }
    });
  } catch (error) {
    logger.error(`Mark all as read error: ${error.message}`);
    next(error);
  }
};

// @desc    Get notifications from audit logs (fallback)
// @route   GET /api/v1/notifications/audit-logs
// @access  Private
exports.getAuditLogNotifications = async (req, res, next) => {
  try {
    const { limit = 20 } = req.query;

    // For administrators, get all audit logs
    // For others, get only their own
    const query = req.user.role === 'Administrator' ? {} : { user: req.user._id };

    const logs = await AuditLog.find(query)
      .populate('user', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .lean();

    // Convert audit logs to notification format
    const notifications = logs.map(log => ({
      _id: log._id,
      action: log.action,
      description: log.details || log.description || 'System activity',
      entityType: log.resourceType || log.entityType,
      createdAt: log.createdAt,
      read: false, // Audit logs don't have read status
      user: log.user
    }));

    res.status(200).json({
      status: 'success',
      data: {
        notifications,
        unreadCount: notifications.length
      }
    });
  } catch (error) {
    logger.error(`Get audit log notifications error: ${error.message}`);
    next(error);
  }
};

// @desc    Create a notification (helper function)
// @route   N/A (internal use only)
// @access  Private
exports.createNotification = async (data) => {
  try {
    const notification = await Notification.create(data);
    logger.info(`Notification created: ${notification._id}`);
    return notification;
  } catch (error) {
    logger.error(`Create notification error: ${error.message}`);
    throw error;
  }
};

// @desc    Delete notification
// @route   DELETE /api/v1/notifications/:id
// @access  Private
exports.deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: req.user._id
    });

    if (!notification) {
      return res.status(404).json({
        status: 'error',
        message: 'Notification not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Notification deleted'
    });
  } catch (error) {
    logger.error(`Delete notification error: ${error.message}`);
    next(error);
  }
};
