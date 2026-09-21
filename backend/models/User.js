const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^(\+254|0)[17]\d{8}$|^(\+254\s?|0)[17]\d{2}\s?\d{3}\s?\d{3}$/, 'Please provide a valid Kenyan phone number']
  },
  nationalId: {
    type: String,
    required: [true, 'National ID is required'],
    unique: true,
    match: [/^\d{8}(\d{2})?$/, 'Please provide a valid Kenyan National ID']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['Land_Owner', 'Land_Officer', 'Administrator'],
    default: 'Land_Owner'
  },
  physicalAddress: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  lastLogin: Date,
  failedLoginAttempts: {
    type: Number,
    default: 0
  },
  accountLockedUntil: Date,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for owned parcels
userSchema.virtual('ownedParcels', {
  ref: 'LandParcel',
  localField: '_id',
  foreignField: 'currentOwner'
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to check if account is locked
userSchema.methods.isAccountLocked = function() {
  return this.accountLockedUntil && this.accountLockedUntil > Date.now();
};

// Method to increment failed login attempts
userSchema.methods.incrementLoginAttempts = async function() {
  // Reset if lock has expired
  if (this.accountLockedUntil && this.accountLockedUntil < Date.now()) {
    await this.updateOne({
      $set: { failedLoginAttempts: 1 },
      $unset: { accountLockedUntil: 1 }
    });
  } else {
    const updates = { $inc: { failedLoginAttempts: 1 } };
    
    // Lock account after 5 failed attempts for 2 hours
    if (this.failedLoginAttempts + 1 >= 5) {
      updates.$set = { accountLockedUntil: Date.now() + 2 * 60 * 60 * 1000 };
    }
    
    await this.updateOne(updates);
  }
};

// Method to reset login attempts
userSchema.methods.resetLoginAttempts = async function() {
  await this.updateOne({
    $set: { failedLoginAttempts: 0 },
    $unset: { accountLockedUntil: 1 }
  });
};

// Indexes (email and nationalId are indexed via unique:true in schema definition)
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;
