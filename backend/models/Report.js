const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      'daily_registrations',
      'monthly_transfers',
      'user_activity',
      'verification_statistics',
      'pending_requests',
      'system_audit',
      'today_activity'
    ]
  },
  format: {
    type: String,
    enum: ['pdf', 'csv', 'excel', 'xlsx'],
    default: 'pdf'
  },
  startDate: {
    type: Date,
    required: false
  },
  endDate: {
    type: Date,
    required: false
  },
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileSize: {
    type: Number // in bytes
  },
  recordCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['generating', 'completed', 'failed'],
    default: 'completed'
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  lastDownloadedAt: Date,
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Indexes
reportSchema.index({ generatedBy: 1, createdAt: -1 });
reportSchema.index({ type: 1 });
reportSchema.index({ status: 1 });

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
