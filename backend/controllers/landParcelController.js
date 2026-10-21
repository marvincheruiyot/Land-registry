const LandParcel = require('../models/LandParcel');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');

// Create land parcel
exports.createParcel = async (req, res, next) => {
  try {
    const {
      parcelNumber,
      titleDeedNumber,
      sizeInAcres,
      landUse,
      ownershipType,
      governmentLandDetails,
      location,
      ownerNationalId,
      boundaries,
      notes
    } = req.body;

    let owner = null;
    
    // Only find owner for private land
    if (ownershipType === 'private' || !ownershipType) {
      if (ownerNationalId) {
        owner = await User.findOne({ nationalId: ownerNationalId });
      }
      if (!owner) {
        // Fallback to current user if no owner found or provided
        owner = req.user;
      }
    }

    const parcelData = {
      parcelNumber,
      titleDeedNumber: titleDeedNumber || undefined,
      sizeInAcres: Number(sizeInAcres) || 1,
      landUse: landUse || 'residential',
      ownershipType: ownershipType || 'private',
      location: {
        county: location?.county || 'Nairobi',
        subCounty: location?.subCounty || '',
        ward: location?.ward || '',
        description: location?.description || '',
        coordinates: {
          latitude: Number(location?.coordinates?.latitude) || -1.286389,
          longitude: Number(location?.coordinates?.longitude) || 36.817223
        }
      },
      registeredBy: req.user._id,
      boundaries,
      notes
    };

    // Add owner only for private land
    if (ownershipType === 'private' || !ownershipType) {
      parcelData.currentOwner = owner._id;
      parcelData.ownershipHistory = [
        {
          owner: owner._id,
          acquiredDate: new Date(),
          transferMethod: 'initial_registration',
          notes: 'Initial cadastral parcel registration'
        }
      ];
    }

    // Add government land details if applicable
    if (ownershipType && ownershipType !== 'private' && governmentLandDetails) {
      parcelData.governmentLandDetails = {
        status: governmentLandDetails.status || 'vacant',
        allocatedTo: governmentLandDetails.allocatedTo || '',
        allocationDate: governmentLandDetails.allocationDate || undefined,
        intendedUse: governmentLandDetails.intendedUse || ''
      };
    }

    const parcel = await LandParcel.create(parcelData);
    
    // Populate owner only if it's private land
    if (parcelData.currentOwner) {
      await parcel.populate('currentOwner', 'fullName email nationalId phoneNumber');
    }

    // Create audit log
    const ownershipLabel = ownershipType === 'government' ? 'Government Land' : 
                          ownershipType === 'county' ? 'County Government Land' :
                          ownershipType === 'trust' ? 'Community/Trust Land' : 'Private Land';
    
    const description = ownershipType === 'private' || !ownershipType
      ? `Land parcel ${parcelNumber} registered and assigned to ${owner.fullName}`
      : `${ownershipLabel} parcel ${parcelNumber} registered`;

    await AuditLog.log({
      user: req.user._id,
      action: 'PARCEL_CREATED',
      entityType: 'LandParcel',
      entityId: parcel._id,
      description,
      details: `Registered by ${req.user.fullName}. Ownership Type: ${ownershipLabel}. Location: ${location?.county}. Size: ${sizeInAcres} acres.`,
      ipAddress: req.ip || req.connection?.remoteAddress || '127.0.0.1',
      userAgent: req.headers['user-agent'] || '',
      severity: 'info',
      metadata: {
        parcelNumber,
        ownershipType: ownershipType || 'private',
        sizeInAcres,
        county: location?.county,
        landUse
      }
    });

    // Create notification for land owner (only for private land)
    if ((ownershipType === 'private' || !ownershipType) && owner) {
      const Notification = require('../models/Notification');
      await Notification.create({
        recipient: owner._id,
        type: 'SYSTEM_ALERT',
        title: 'Land Parcel Registered Successfully',
        message: `Your land parcel ${parcelNumber} in ${location?.county} has been successfully registered in the National Land Registry. Size: ${sizeInAcres} acres.`,
        relatedEntity: {
          entityType: 'LandParcel',
          entityId: parcel._id
        },
        priority: 'high'
      });
    }

    res.status(201).json({
      status: 'success',
      data: { parcel }
    });
  } catch (error) {
    next(error);
  }
};

// Get all parcels with search and filters
exports.getAllParcels = async (req, res, next) => {
  try {
    const { search, status, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { parcelNumber: { $regex: search, $options: 'i' } },
        { titleDeedNumber: { $regex: search, $options: 'i' } },
        { 'location.county': { $regex: search, $options: 'i' } }
      ];
    }

    // Land Owners only see parcels they own unless they are officer/admin
    if (req.user?.role === 'Land_Owner') {
      query.currentOwner = req.user._id;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await LandParcel.countDocuments(query);
    const parcels = await LandParcel.find(query)
      .populate('currentOwner', 'fullName email nationalId phoneNumber')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      status: 'success',
      data: {
        total,
        page: Number(page),
        parcels
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get user's own parcels
exports.getUserParcels = async (req, res, next) => {
  try {
    console.log('🔍 getUserParcels called for user:', {
      userId: req.user._id,
      userIdString: req.user._id.toString(),
      userName: req.user.fullName,
      nationalId: req.user.nationalId,
      email: req.user.email
    });

    // First, let's check what parcels exist in the database
    const allParcels = await LandParcel.find({})
      .populate('currentOwner', 'fullName email nationalId')
      .limit(5);
    
    console.log('📦 Sample parcels in database:');
    allParcels.forEach((p, i) => {
      console.log(`   Parcel ${i + 1}: ${p.parcelNumber}`);
      console.log(`      Owner ID: ${p.currentOwner?._id}`);
      console.log(`      Owner Name: ${p.currentOwner?.fullName}`);
      console.log(`      Owner Email: ${p.currentOwner?.email}`);
      console.log(`      Matches User: ${p.currentOwner?._id.toString() === req.user._id.toString()}`);
    });

    // Now find user's parcels
    const parcels = await LandParcel.find({ currentOwner: req.user._id })
      .populate('currentOwner', 'fullName email nationalId')
      .sort({ createdAt: -1 });

    console.log(`📦 Found ${parcels.length} parcel(s) for user ${req.user.fullName} (${req.user._id})`);
    
    if (parcels.length > 0) {
      parcels.forEach((p, i) => {
        console.log(`   ✅ Parcel ${i + 1}: ${p.parcelNumber} - Owner: ${p.currentOwner?.fullName}`);
      });
    } else {
      console.log(`   ❌ NO PARCELS FOUND for user ${req.user.fullName}`);
      
      // Let's check if there are parcels with this user's National ID
      const parcelsByNationalId = await LandParcel.find({})
        .populate('currentOwner', 'fullName email nationalId');
      
      const matchingByNationalId = parcelsByNationalId.filter(
        p => p.currentOwner?.nationalId === req.user.nationalId
      );
      
      if (matchingByNationalId.length > 0) {
        console.log(`   ⚠️ FOUND ${matchingByNationalId.length} parcels by National ID, but owner IDs don't match!`);
        matchingByNationalId.forEach((p, i) => {
          console.log(`      Parcel ${i + 1}: ${p.parcelNumber}`);
          console.log(`         Parcel Owner ID: ${p.currentOwner._id}`);
          console.log(`         Logged in User ID: ${req.user._id}`);
          console.log(`         IDs match: ${p.currentOwner._id.toString() === req.user._id.toString()}`);
        });
      }
    }

    res.status(200).json({
      status: 'success',
      data: { parcels }
    });
  } catch (error) {
    console.error('❌ Error in getUserParcels:', error);
    next(error);
  }
};

// Get parcel by ID
exports.getParcelById = async (req, res, next) => {
  try {
    const parcel = await LandParcel.findById(req.params.id)
      .populate('currentOwner', 'fullName email nationalId phoneNumber')
      .populate('ownershipHistory.owner', 'fullName email nationalId')
      .populate('documents');

    if (!parcel) {
      return res.status(404).json({
        status: 'error',
        message: 'Land parcel not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { parcel }
    });
  } catch (error) {
    next(error);
  }
};

// Update parcel
exports.updateParcel = async (req, res, next) => {
  try {
    const oldParcel = await LandParcel.findById(req.params.id).populate('currentOwner', 'fullName');
    
    const parcel = await LandParcel.findByIdAndUpdate(
      req.params.id,
      { ...req.body, lastModifiedBy: req.user._id },
      { new: true, runValidators: true }
    ).populate('currentOwner', 'fullName email nationalId');

    if (!parcel) {
      return res.status(404).json({
        status: 'error',
        message: 'Land parcel not found'
      });
    }

    // Create audit log
    await AuditLog.log({
      user: req.user._id,
      action: 'PARCEL_UPDATED',
      entityType: 'LandParcel',
      entityId: parcel._id,
      description: `Land parcel ${parcel.parcelNumber} updated by ${req.user.fullName}`,
      details: `Modified parcel details. Owner: ${parcel.currentOwner?.fullName}`,
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || '',
      severity: 'info',
      changes: {
        before: oldParcel?.toObject(),
        after: parcel.toObject()
      }
    });

    res.status(200).json({
      status: 'success',
      data: { parcel }
    });
  } catch (error) {
    next(error);
  }
};

// Delete parcel
exports.deleteParcel = async (req, res, next) => {
  try {
    const parcel = await LandParcel.findById(req.params.id).populate('currentOwner', 'fullName');
    
    if (!parcel) {
      return res.status(404).json({
        status: 'error',
        message: 'Land parcel not found'
      });
    }

    // Create audit log before deletion
    await AuditLog.log({
      user: req.user._id,
      action: 'PARCEL_DELETED',
      entityType: 'LandParcel',
      entityId: parcel._id,
      description: `Land parcel ${parcel.parcelNumber} deleted by ${req.user.fullName}`,
      details: `Deleted parcel owned by ${parcel.currentOwner?.fullName}. Location: ${parcel.location?.county}`,
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || '',
      severity: 'warning',
      metadata: {
        parcelNumber: parcel.parcelNumber,
        ownerName: parcel.currentOwner?.fullName,
        county: parcel.location?.county
      }
    });

    await LandParcel.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: 'success',
      message: 'Land parcel deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Flag parcel
exports.flagParcel = async (req, res, next) => {
  try {
    const { flagReason } = req.body;
    const parcel = await LandParcel.findByIdAndUpdate(
      req.params.id,
      {
        isFlagged: true,
        flagReason,
        flaggedAt: new Date(),
        flaggedBy: req.user._id,
        status: 'disputed'
      },
      { new: true }
    ).populate('currentOwner', 'fullName');

    // Create audit log
    await AuditLog.log({
      user: req.user._id,
      action: 'PARCEL_FLAGGED',
      entityType: 'LandParcel',
      entityId: parcel._id,
      description: `Land parcel ${parcel.parcelNumber} flagged by ${req.user.fullName}`,
      details: `Reason: ${flagReason}. Owner: ${parcel.currentOwner?.fullName}`,
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || '',
      severity: 'warning',
      metadata: {
        flagReason,
        parcelNumber: parcel.parcelNumber,
        ownerName: parcel.currentOwner?.fullName
      }
    });

    res.status(200).json({
      status: 'success',
      data: { parcel }
    });
  } catch (error) {
    next(error);
  }
};
