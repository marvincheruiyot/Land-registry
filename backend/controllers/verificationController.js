const LandParcel = require('../models/LandParcel');

// Verify title by token
exports.verifyByToken = async (req, res, next) => {
  try {
    const { token } = req.params;
    const parcel = await LandParcel.findOne({ verificationToken: token })
      .populate('currentOwner', 'fullName nationalId email');

    if (!parcel) {
      return res.status(404).json({
        status: 'error',
        message: 'No title deed found matching this cryptographic verification token.'
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
