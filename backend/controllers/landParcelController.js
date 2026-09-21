const LandParcel = require('../models/LandParcel');
const User = require('../models/User');

// Create land parcel
exports.createParcel = async (req, res, next) => {
  try {
    const {
      parcelNumber,
      titleDeedNumber,
      sizeInAcres,
      landUse,
      location,
      ownerNationalId,
      boundaries,
      notes
    } = req.body;

    let owner = null;
    if (ownerNationalId) {
      owner = await User.findOne({ nationalId: ownerNationalId });
    }
    if (!owner) {
      // Fallback to current user if no owner found or provided
      owner = req.user;
    }

    const parcelData = {
      parcelNumber,
      titleDeedNumber: titleDeedNumber || undefined,
      sizeInAcres: Number(sizeInAcres) || 1,
      landUse: landUse || 'residential',
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
      currentOwner: owner._id,
      registeredBy: req.user._id,
      boundaries,
      notes,
      ownershipHistory: [
        {
          owner: owner._id,
          acquiredDate: new Date(),
          transferMethod: 'initial_registration',
          notes: 'Initial cadastral parcel registration'
        }
      ]
    };

    const parcel = await LandParcel.create(parcelData);
    await parcel.populate('currentOwner', 'fullName email nationalId phoneNumber');

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
    const parcels = await LandParcel.find({ currentOwner: req.user._id })
      .populate('currentOwner', 'fullName email nationalId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      data: { parcels }
    });
  } catch (error) {
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
    const parcel = await LandParcel.findByIdAndDelete(req.params.id);
    if (!parcel) {
      return res.status(404).json({
        status: 'error',
        message: 'Land parcel not found'
      });
    }

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
    );

    res.status(200).json({
      status: 'success',
      data: { parcel }
    });
  } catch (error) {
    next(error);
  }
};
