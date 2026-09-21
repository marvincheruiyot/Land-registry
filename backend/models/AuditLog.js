const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: [true, 'Action is required'],
    enum: [
      'LOGIN', 'LOGOUT', 'LOGIN_FAILED',
      'USER_CREATED', 'USER_UPDATED', 'USER_DELETED', 'USER_DEACTIVATED',
      'PARCEL_CREATED', 'PARCEL_UPDATED', 'PARCEL_DELETED', 'PARCEL_FLAGGED',
      'TRANSFER_INITIATED', 'TRANSFER_APPROVED', 'TRANSFER_REJECTED', 'TRANSFER_CANCELLED',
      'DOCUMENT_UPLOADED', 'DOCUMENT_VIEWED', 'DOCUMENT_DOWNLOADED', 'DOCUMENT_DELETED',
      'VERIFICATION_PERFORMED',
      'REPORT_GENERATED',
      'SYSTEM_CONFIG_CHANGED',
      'PASSWORD_CHANGED', 'PASSWORD_RESET',
      'EMAIL_SENT',
      'SUSPICIOUS_ACTIVITY'
    ]
  },
  entityType: {
    type: String,
    enum: ['User', 'LandParcel', 'Transfer', 'Document', 'System', null]
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId
  },
  description: {
    type: String,
    required: true
  },
  changes: {
    before: mongoose.Schema.Types.Mixed,
    after: mongoose.Schema.Types.Mixed
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: String,
  severity: {
    type: String,
    enum: ['info', 'warning', 'error', 'critical'],
    default: 'info'
  },
  metadata: mongoose.Schema.Types.Mixed,
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  }
}, {
  timestamps: false
});

// Indexes for efficient querying
auditLogSchema.index({ user: 1, timestamp: -1 });
auditLogSchema.index({ entityType: 1, entityId: 1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ timestamp: -1 });
auditLogSchema.index({ severity: 1 });
auditLogSchema.index({ ipAddress: 1 });

// TTL index for automatic cleanup (3650 days = 10 years)
auditLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 3650 * 24 * 60 * 60 });

// Static method to create audit log entry
auditLogSchema.statics.log = async function(logData) {
  try {
    await this.create(logData);
  } catch (error) {
    console.error('Failed to create audit log:', error);
    // Don't throw error to prevent disrupting main application flow
  }
};

// Static method to detect suspicious patterns
auditLogSchema.statics.detectSuspiciousActivity = async function(userId, action) {
  const recentActions = await this.find({
    user: userId,
    action,
    timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
  });

  // Define thresholds
  const thresholds = {
    'LOGIN_FAILED': 3,
    'VERIFICATION_PERFORMED': 100,
    'TRANSFER_INITIATED': 10,
    'DOCUMENT_DOWNLOADED': 50
  };

  const threshold = thresholds[action] || Infinity;
  return recentActions.length >= threshold;
};

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

module.exports = AuditLog;
