const mongoose = require('mongoose');
const crypto = require('crypto');

const landParcelSchema = new mongoose.Schema({
  parcelNumber: {
    type: String,
    required: [true, 'Parcel number is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  title: {
    type: String,
    trim: true
  },
  location: {
    county: {
      type: String,
      required: [true, 'County is required']
    },
    subCounty: String,
    ward: String,
    description: String,
    coordinates: {
      latitude: {
        type: Number,
        required: false,
        min: [-4.68, 'Latitude must be within Kenya boundaries'],
        max: [5.03, 'Latitude must be within Kenya boundaries']
      },
      longitude: {
        type: Number,
        required: false,
        min: [33.89, 'Longitude must be within Kenya boundaries'],
        max: [41.86, 'Longitude must be within Kenya boundaries']
      }
    }
  },
  sizeInAcres: {
    type: Number,
    required: [true, 'Land size is required'],
    min: [0.01, 'Size must be greater than 0']
  },
  currentOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Current owner is required']
  },
  ownershipHistory: [{
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    acquiredDate: Date,
    transferredDate: Date,
    transferMethod: {
      type: String,
      enum: ['purchase', 'sale', 'inheritance', 'gift', 'subdivision', 'initial_registration', 'court_order']
    },
    notes: String
  }],
  status: {
    type: String,
    enum: ['active', 'transferred', 'disputed', 'inactive', 'pending_transfer'],
    default: 'active'
  },
  verificationToken: {
    type: String,
    unique: true
  },
  titleDeedNumber: {
    type: String,
    unique: true
  },
  landUse: {
    type: String,
    enum: ['residential', 'commercial', 'agricultural', 'industrial', 'mixed', 'other']
  },
  registeredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isFlagged: {
    type: Boolean,
    default: false
  },
  flagReason: String,
  flaggedAt: Date,
  flaggedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  documents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  }],
  boundaries: {
    north: String,
    south: String,
    east: String,
    west: String
  },
  surveyDate: Date,
  notes: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Generate verification token before saving
landParcelSchema.pre('save', function(next) {
  if (!this.verificationToken) {
    this.verificationToken = crypto.randomBytes(32).toString('hex');
  }
  if (!this.titleDeedNumber) {
    this.titleDeedNumber = `TD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
  next();
});

// Virtual for pending transfers
landParcelSchema.virtual('pendingTransfer', {
  ref: 'Transfer',
  localField: '_id',
  foreignField: 'landParcel',
  justOne: true,
  match: { status: 'pending' }
});

// Indexes
landParcelSchema.index({ currentOwner: 1 });
landParcelSchema.index({ status: 1 });
landParcelSchema.index({ 'location.coordinates': '2dsphere' });
landParcelSchema.index({ 'location.county': 1 });
landParcelSchema.index({ registrationDate: -1 });
landParcelSchema.index({ isFlagged: 1 });

// Method to check for overlapping parcels
landParcelSchema.methods.checkOverlap = async function() {
  const LandParcel = mongoose.model('LandParcel');
  const nearby = await LandParcel.find({
    _id: { $ne: this._id },
    'location.coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [this.location.coordinates.longitude, this.location.coordinates.latitude]
        },
        $maxDistance: 1000 // 1km radius
      }
    }
  });
  return nearby.length > 0 ? nearby : null;
};

const LandParcel = mongoose.model('LandParcel', landParcelSchema);

module.exports = LandParcel;
