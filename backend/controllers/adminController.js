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
      county,
      subCounty,
      ward,
      locationDescription,
      latitude,
      longitude,
      sizeInAcres,
      currentOwnerId,
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

    // Verify owner exists
    const owner = await User.findById(currentOwnerId);
    if (!owner) {
      return res.status(404).json({
        status: 'error',
        message: 'Owner not found'
      });
    }

    const parcel = await LandParcel.create({
      parcelNumber,
      title,
      location: {
        county,
        subCounty,
        ward,
        description: locationDescription,
        coordinates: {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude)
        }
      },
      sizeInAcres: parseFloat(sizeInAcres),
      currentOwner: currentOwnerId,
      landUse,
      boundaries,
      notes,
      registeredBy: req.user._id,
      ownershipHistory: [{
        owner: currentOwnerId,
        acquiredDate: new Date(),
        transferMethod: 'initial_registration'
      }]
    });

    // Create audit log
    await AuditLog.create({
      user: req.user._id,
      action: 'CREATE_PARCEL',
      resourceType: 'LandParcel',
      resourceId: parcel._id,
      details: `Registered new land parcel: ${parcelNumber}`,
      ipAddress: req.ip
    });

    const populatedParcel = await LandParcel.findById(parcel._id)
      .populate('currentOwner', 'fullName email nationalId')
      .populate('registeredBy', 'fullName');

    res.status(201).json({
      status: 'success',
      data: { parcel: populatedParcel }
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
    const { limit = 50, action, userId } = req.query;
    const query = {};

    if (action) {
      query.action = action;
    }

    if (userId) {
      query.user = userId;
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
