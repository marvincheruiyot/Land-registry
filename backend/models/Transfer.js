const mongoose = require('mongoose');

const transferSchema = new mongoose.Schema({
  landParcel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LandParcel',
    required: [true, 'Land parcel is required']
  },
  previousOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Previous owner is required']
  },
  newOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'New owner is required']
  },
  initiatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending'
  },
  transferType: {
    type: String,
    enum: ['sale', 'gift', 'inheritance', 'subdivision', 'court_order', 'other'],
    required: [true, 'Transfer type is required']
  },
  transferAmount: {
    type: Number,
    min: [0, 'Transfer amount cannot be negative']
  },
  documents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  }],
  initiatedDate: {
    type: Date,
    default: Date.now
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  processedDate: Date,
  approvalNotes: String,
  rejectionReason: String,
  verificationChecks: {
    ownershipVerified: {
      type: Boolean,
      default: false
    },
    documentsVerified: {
      type: Boolean,
      default: false
    },
    paymentVerified: {
      type: Boolean,
      default: false
    },
    surveyConducted: {
      type: Boolean,
      default: false
    }
  },
  notificationsSent: {
    previousOwner: {
      type: Boolean,
      default: false
    },
    newOwner: {
      type: Boolean,
      default: false
    },
    landOfficer: {
      type: Boolean,
      default: false
    }
  },
  remindersSent: {
    type: Number,
    default: 0
  },
  lastReminderDate: Date
}, {
  timestamps: true
});

// Middleware to check if transfer is overdue
transferSchema.virtual('isOverdue').get(function() {
  if (this.status === 'pending') {
    const daysPending = Math.floor((Date.now() - this.initiatedDate) / (1000 * 60 * 60 * 24));
    return daysPending > 30;
  }
  return false;
});

// Indexes
transferSchema.index({ landParcel: 1 });
transferSchema.index({ previousOwner: 1 });
transferSchema.index({ newOwner: 1 });
transferSchema.index({ status: 1 });
transferSchema.index({ initiatedDate: -1 });
transferSchema.index({ processedBy: 1 });

// Prevent multiple pending transfers for the same parcel
transferSchema.pre('save', async function(next) {
  if (this.isNew && this.status === 'pending') {
    const Transfer = mongoose.model('Transfer');
    const existingPending = await Transfer.findOne({
      landParcel: this.landParcel,
      status: 'pending'
    });
    
    if (existingPending) {
      throw new Error('A pending transfer already exists for this land parcel');
    }
  }
  next();
});

const Transfer = mongoose.model('Transfer', transferSchema);

module.exports = Transfer;
