const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    default: null
  },
  action: {
    type: String,
    required: [true, 'Action is required']
  },
  entityType: {
    type: String,
    default: null
  },
  entityId: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  description: {
    type: String,
    default: ''
  },
  details: {
    type: String,
    default: ''
  },
  changes: {
    before: mongoose.Schema.Types.Mixed,
    after: mongoose.Schema.Types.Mixed
  },
  ipAddress: {
    type: String,
    default: '127.0.0.1'
  },
  userAgent: {
    type: String,
    default: ''
  },
  severity: {
    type: String,
    enum: ['info', 'warning', 'error', 'critical'],
    default: 'info'
  },
  metadata: mongoose.Schema.Types.Mixed,
  timestamp: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

auditLogSchema.pre('save', function(next) {
  if (!this.description && this.details) {
    this.description = this.details;
  }
  if (!this.description) {
    this.description = `Activity recorded: ${this.action}`;
  }
  if (!this.timestamp) {
    this.timestamp = this.createdAt || new Date();
  }
  next();
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
    const payload = { ...logData };
    if (!payload.entityType && payload.resourceType) payload.entityType = payload.resourceType;
    if (!payload.entityId && payload.resourceId) payload.entityId = payload.resourceId;
    if (!payload.description && payload.details) payload.description = payload.details;
    if (!payload.description) payload.description = `Action recorded: ${payload.action || 'ACTIVITY'}`;
    if (!payload.ipAddress) payload.ipAddress = '127.0.0.1';
    await this.create(payload);
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
