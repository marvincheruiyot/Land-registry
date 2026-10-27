const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  documentType: {
    type: String,
    enum: ['title_deed', 'survey_map', 'identification', 'transfer_agreement', 'payment_receipt', 'court_order', 'other'],
    required: [true, 'Document type is required']
  },
  fileName: {
    type: String,
    required: [true, 'File name is required']
  },
  originalName: {
    type: String,
    required: true
  },
  mimeType: {
    type: String,
    required: true,
    enum: ['application/pdf', 'image/jpeg', 'image/png', 'image/tiff']
  },
  fileSize: {
    type: Number,
    required: true,
    max: [10485760, 'File size cannot exceed 10MB']
  },
  filePath: {
    type: String,
    required: true
  },
  checksum: {
    type: String,
    required: true
  },
  isEncrypted: {
    type: Boolean,
    default: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  uploadedFor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // Not required - only used when officer uploads for a specific owner
  },
  relatedEntity: {
    entityType: {
      type: String,
      enum: ['LandParcel', 'Transfer', 'User'],
      required: true
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    }
  },
  verificationToken: String,
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected', 'transferred'],
    default: 'pending'
  },
  rejectionReason: {
    type: String
  },
  version: {
    type: Number,
    default: 1
  },
  previousVersions: [{
    version: Number,
    filePath: String,
    uploadedAt: Date,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  accessLog: [{
    accessedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    accessedAt: Date,
    action: {
      type: String,
      enum: ['view', 'download', 'update', 'delete']
    },
    ipAddress: String
  }],
  isPublic: {
    type: Boolean,
    default: false
  },
  description: String,
  tags: [String],
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Indexes
documentSchema.index({ 'relatedEntity.entityId': 1 });
documentSchema.index({ 'relatedEntity.entityType': 1 });
documentSchema.index({ uploadedBy: 1 });
documentSchema.index({ documentType: 1 });
documentSchema.index({ verificationToken: 1 });
documentSchema.index({ createdAt: -1 });

// Method to log document access
documentSchema.methods.logAccess = async function(userId, action, ipAddress) {
  this.accessLog.push({
    accessedBy: userId,
    accessedAt: new Date(),
    action,
    ipAddress
  });
  await this.save();
};

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;
