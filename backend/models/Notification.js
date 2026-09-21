const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: [
      'TRANSFER_INITIATED',
      'TRANSFER_APPROVED',
      'TRANSFER_REJECTED',
      'PARCEL_FLAGGED',
      'VERIFICATION_PERFORMED',
      'ACCOUNT_DEACTIVATED',
      'PASSWORD_CHANGED',
      'DOCUMENT_UPLOADED',
      'REMINDER',
      'SYSTEM_ALERT'
    ],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  relatedEntity: {
    entityType: {
      type: String,
      enum: ['LandParcel', 'Transfer', 'Document', 'User']
    },
    entityId: mongoose.Schema.Types.ObjectId
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  emailSent: {
    type: Boolean,
    default: false
  },
  emailSentAt: Date,
  emailDeliveryStatus: {
    type: String,
    enum: ['pending', 'sent', 'failed', 'bounced']
  },
  retryCount: {
    type: Number,
    default: 0
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  }
}, {
  timestamps: true
});

// Indexes
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ isRead: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ emailSent: 1, emailDeliveryStatus: 1 });

// TTL index to auto-delete old notifications after 90 days
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
