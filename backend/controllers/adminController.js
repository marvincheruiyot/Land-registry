const User = require('../models/User');
const LandParcel = require('../models/LandParcel');
const Transfer = require('../models/Transfer');
const AuditLog = require('../models/AuditLog');

// User Management
exports.getAllUsers = async (req, res, next) => {
  try {
    const { search, role, status } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { nationalId: { $regex: search, $options: 'i' } }
      ];
    }

    if (role && role !== 'all') {
      query.role = role;
    }

    if (status) {
      query.isActive = status === 'active';
    }

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    
    res.status(200).json({
      status: 'success',
      data: { users }
    });
  } catch (error) {
    next(error);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const { fullName, email, phoneNumber, nationalId, password, role, physicalAddress } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { nationalId }]
    });

    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'User with this email or national ID already exists'
      });
    }

    const user = await User.create({
      fullName,
      email,
      phoneNumber,
      nationalId,
      password,
      role: role || 'Land_Owner',
      physicalAddress,
      isEmailVerified: true,
      createdBy: req.user._id
    });

    // Create audit log
    await AuditLog.create({
      user: req.user._id,
      action: 'CREATE_USER',
      resourceType: 'User',
      resourceId: user._id,
      details: `Created new user: ${fullName} (${role})`,
      ipAddress: req.ip
    });

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      status: 'success',
      data: { user: userResponse }
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Create audit log
    await AuditLog.create({
      user: req.user._id,
      action: 'UPDATE_USER_ROLE',
      resourceType: 'User',
      resourceId: user._id,
      details: `Updated user role to: ${role}`,
      ipAddress: req.ip
    });

    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

exports.deactivateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Create audit log
    await AuditLog.create({
      user: req.user._id,
      action: 'DEACTIVATE_USER',
      resourceType: 'User',
      resourceId: user._id,
      details: `Deactivated user: ${user.fullName}`,
      ipAddress: req.ip
    });

    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

exports.activateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Create audit log
    await AuditLog.create({
      user: req.user._id,
      action: 'ACTIVATE_USER',
      resourceType: 'User',
      resourceId: user._id,
      details: `Activated user: ${user.fullName}`,
      ipAddress: req.ip
    });

    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // Prevent deleting yourself
    if (userId === req.user._id.toString()) {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot delete your own account'
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Check if user owns any land parcels
    const ownedParcels = await LandParcel.countDocuments({ currentOwner: userId });
    if (ownedParcels > 0) {
      return res.status(400).json({
        status: 'error',
        message: `Cannot delete user who owns ${ownedParcels} land parcel(s). Transfer ownership first.`
      });
    }

    // Check if user has pending transfers
    const pendingTransfers = await Transfer.countDocuments({
      $or: [
        { currentOwner: userId },
        { newOwner: userId }
      ],
      status: 'pending'
    });

    if (pendingTransfers > 0) {
      return res.status(400).json({
        status: 'error',
        message: `Cannot delete user with ${pendingTransfers} pending transfer(s). Complete or cancel them first.`
      });
    }

    // Create audit log before deletion
    await AuditLog.create({
      user: req.user._id,
      action: 'DELETE_USER',
      resourceType: 'User',
      resourceId: user._id,
      details: `Permanently deleted user: ${user.fullName} (${user.email})`,
      ipAddress: req.ip
    });

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      status: 'success',
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Land Parcel Management
exports.getAllParcels = async (req, res, next) => {
  try {
    const { search, county, status } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { parcelNumber: { $regex: search, $options: 'i' } },
        { titleDeedNumber: { $regex: search, $options: 'i' } }
      ];
    }

    if (county && county !== 'all') {
      query['location.county'] = county;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    const parcels = await LandParcel.find(query)
      .populate('currentOwner', 'fullName email nationalId')
      .populate('registeredBy', 'fullName')
      .sort({ registrationDate: -1 });

    res.status(200).json({
      status: 'success',
      data: { parcels }
    });
  } catch (error) {
    next(error);
  }
};

exports.createParcel = async (req, res, next) => {
  try {
    const {
      parcelNumber,
      title,
      titleDeedNumber,
      county,
      subCounty,
      ward,
      locationDescription,
      latitude,
      longitude,
      sizeInAcres,
      ownerNationalId,
      ownerName,
      landUse,
      boundaries,
      notes
    } = req.body;

    // Check if parcel number already exists
    const existingParcel = await LandParcel.findOne({ parcelNumber });
    if (existingParcel) {
      return res.status(400).json({
        status: 'error',
        message: 'Parcel number already exists'
      });
    }

    // Find owner by National ID
    let owner = await User.findOne({ nationalId: ownerNationalId });
    
    // If owner doesn't exist, create a placeholder owner account
    if (!owner) {
      owner = await User.create({
        fullName: ownerName || `Owner-${ownerNationalId}`,
        email: `${ownerNationalId}@pending.landregistry.go.ke`,
        phoneNumber: '+254700000000',
        nationalId: ownerNationalId,
        password: `TempPass${ownerNationalId}@123`,
        role: 'Land_Owner',
        isActive: false, // Inactive until they complete registration
        isPlaceholder: true, // Mark as placeholder
        createdBy: req.user._id
      });

      // Create audit log for placeholder user creation
      await AuditLog.create({
        user: req.user._id,
        action: 'CREATE_PLACEHOLDER_USER',
        resourceType: 'User',
        resourceId: owner._id,
        details: `Created placeholder owner for National ID: ${ownerNationalId}`,
        ipAddress: req.ip
      });
    }

    const parcel = await LandParcel.create({
      parcelNumber,
      title,
      titleDeedNumber,
      location: {
        county,
        subCounty,
        ward,
        description: locationDescription,
        coordinates: latitude && longitude ? {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude)
        } : undefined
      },
      sizeInAcres: parseFloat(sizeInAcres),
      currentOwner: owner._id,
      landUse,
      boundaries,
      notes,
      registeredBy: req.user._id,
      ownershipHistory: [{
        owner: owner._id,
        acquiredDate: new Date(),
        transferMethod: 'initial_registration'
      }]
    });

    // Create audit log
    await AuditLog.create({
      user: req.user._id,
      action: owner.isPlaceholder ? 'CREATE_PARCEL' : 'PARCEL_ASSIGNED',
      resourceType: 'LandParcel',
      resourceId: parcel._id,
      details: owner.isPlaceholder 
        ? `Registered new land parcel: ${parcelNumber} for National ID: ${ownerNationalId}`
        : `Assigned land parcel: ${parcelNumber} to ${owner.fullName} (${ownerNationalId})`,
      ipAddress: req.ip
    });

    // If owner exists and is not a placeholder, create a specific notification for them
    if (!owner.isPlaceholder) {
      await AuditLog.create({
        user: owner._id,
        action: 'PARCEL_ASSIGNED',
        resourceType: 'LandParcel',
        resourceId: parcel._id,
        details: `A new land parcel (${parcelNumber}) has been assigned to your account. Title Deed: ${titleDeedNumber || 'Pending'}`,
        ipAddress: req.ip,
        description: `New land parcel ${parcelNumber} registered under your name`
      });
    }

    const populatedParcel = await LandParcel.findById(parcel._id)
      .populate('currentOwner', 'fullName email nationalId')
      .populate('registeredBy', 'fullName');

    res.status(201).json({
      status: 'success',
      data: { parcel: populatedParcel },
      message: owner.isPlaceholder 
        ? `Parcel registered. Owner will see this parcel when they register with National ID: ${ownerNationalId}`
        : 'Parcel registered successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Dashboard Statistics
exports.getDashboardStats = async (req, res, next) => {
  try {
    const [totalUsers, totalParcels, activeTransfers, recentLogs] = await Promise.all([
      User.countDocuments(),
      LandParcel.countDocuments(),
      Transfer.countDocuments({ status: 'pending' }),
      AuditLog.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('user', 'fullName')
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        totalUsers,
        totalParcels,
        activeTransfers,
        recentLogs
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getSystemLogs = async (req, res, next) => {
  try {
    const { limit = 50, action, userId, user } = req.query;
    const query = {};

    if (action) {
      query.action = action;
    }

    // Support both 'userId' and 'user' query parameters
    if (userId || user) {
      query.user = userId || user;
    }

    const logs = await AuditLog.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate('user', 'fullName email');

    res.status(200).json({
      status: 'success',
      data: { logs }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateSystemConfig = async (req, res, next) => {
  try {
    // Placeholder for system configuration updates
    res.status(200).json({
      status: 'success',
      message: 'System configuration updated'
    });
  } catch (error) {
    next(error);
  }
};
