const LandParcel = require('../models/LandParcel');

// Verify title by deed number (title deed number)
exports.verifyByToken = async (req, res, next) => {
  try {
    const { token } = req.params;
    
    // Search by title deed number instead of cryptographic token
    const parcel = await LandParcel.findOne({ 
      titleDeedNumber: { $regex: new RegExp(`^${token.trim()}$`, 'i') } 
    }).populate('currentOwner', 'fullName nationalId email');

    if (!parcel) {
      return res.status(404).json({
        status: 'error',
        message: 'No title deed found with this number. Please verify the deed number and try again.'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        parcelNumber: parcel.parcelNumber,
        titleDeedNumber: parcel.titleDeedNumber,
        ownerName: parcel.currentOwner?.fullName || 'Government / Public',
        location: `${parcel.location?.ward || ''} ${parcel.location?.subCounty || ''} ${parcel.location?.county || 'Kenya'}`.trim(),
        county: parcel.location?.county,
        size: parcel.sizeInAcres,
        sizeInAcres: parcel.sizeInAcres,
        landUse: parcel.landUse,
        status: parcel.status,
        registrationDate: parcel.registrationDate ? new Date(parcel.registrationDate).toLocaleDateString() : new Date(parcel.createdAt).toLocaleDateString(),
        currentOwner: parcel.currentOwner
      }
    });
  } catch (error) {
    next(error);
  }
};

// Verify by official Parcel Number
exports.verifyByParcelNumber = async (req, res, next) => {
  try {
    const { parcelNumber } = req.params;
    const parcel = await LandParcel.findOne({
      parcelNumber: { $regex: new RegExp(`^${parcelNumber.trim()}$`, 'i') }
    }).populate('currentOwner', 'fullName nationalId email');

    if (!parcel) {
      return res.status(404).json({
        status: 'error',
        message: `Land parcel ${parcelNumber} was not found in the national cadastral registry.`
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        parcelNumber: parcel.parcelNumber,
        ownerName: parcel.currentOwner?.fullName || 'Government / Public',
        location: parcel.location?.county || 'Kenya',
        size: parcel.sizeInAcres,
        status: parcel.status,
        registrationDate: parcel.registrationDate ? new Date(parcel.registrationDate).toLocaleDateString() : 'Active'
      }
    });
  } catch (error) {
    next(error);
  }
};

// Verify Owner by National ID (Anyone can verify)
exports.verifyByOwnerId = async (req, res, next) => {
  try {
    const { nationalId } = req.params;
    
    const User = require('../models/User');
    
    // Find the owner by National ID
    const owner = await User.findOne({ 
      nationalId: nationalId.trim(),
      role: 'Land_Owner'
    }).select('fullName nationalId');

    if (!owner) {
      return res.status(404).json({
        status: 'error',
        message: 'No land owner found with this National ID in the registry.'
      });
    }

    // Find all active parcels owned by this user
    const parcels = await LandParcel.find({ 
      currentOwner: owner._id,
      status: { $in: ['active', 'pending_transfer'] }
    }).select('parcelNumber titleDeedNumber location sizeInAcres landUse status');

    // Calculate statistics
    const totalParcels = parcels.length;
    const totalAcres = parcels.reduce((sum, p) => sum + (p.sizeInAcres || 0), 0);
    
    // Get unique counties
    const counties = [...new Set(parcels.map(p => p.location?.county).filter(Boolean))];

    res.status(200).json({
      status: 'success',
      data: {
        verified: true,
        owner: {
          fullName: owner.fullName,
          nationalId: owner.nationalId
        },
        ownership: {
          totalParcels,
          totalAcres: parseFloat(totalAcres.toFixed(2)),
          counties: counties
        },
        parcels: parcels.map(p => ({
          parcelNumber: p.parcelNumber,
          titleDeedNumber: p.titleDeedNumber,
          county: p.location?.county,
          subCounty: p.location?.subCounty,
          size: p.sizeInAcres,
          landUse: p.landUse,
          status: p.status
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};
