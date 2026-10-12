const Transfer = require('../models/Transfer');
const LandParcel = require('../models/LandParcel');
const User = require('../models/User');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');

// Initiate Transfer
exports.initiateTransfer = async (req, res, next) => {
  try {
    const { landParcel, newOwnerNationalId, transferType, transferAmount, notes } = req.body;

    const parcel = await LandParcel.findById(landParcel);
    if (!parcel) {
      return res.status(404).json({
        status: 'error',
        message: 'Land parcel not found'
      });
    }

    const newOwner = await User.findOne({ nationalId: newOwnerNationalId });
    if (!newOwner) {
      return res.status(404).json({
        status: 'error',
        message: `Citizen with National ID ${newOwnerNationalId} is not registered in the system.`
      });
    }

    const transfer = await Transfer.create({
      landParcel,
      previousOwner: parcel.currentOwner,
      newOwner: newOwner._id,
      initiatedBy: req.user._id,
      transferType: transferType || 'sale',
      transferAmount: Number(transferAmount) || 0,
      approvalNotes: notes || ''
    });

    // Update parcel status to pending_transfer
    await LandParcel.findByIdAndUpdate(landParcel, { status: 'pending_transfer' });

    // Create notifications for all Administrators and Land Officers
    const adminsAndOfficers = await User.find({
      role: { $in: ['Administrator', 'Land_Officer'] },
      isActive: true
    });

    const notificationPromises = adminsAndOfficers.map(user =>
      Notification.create({
        recipient: user._id,
        type: 'TRANSFER_INITIATED',
        title: 'New Transfer Request',
        message: `Transfer request for parcel ${parcel.parcelNumber}. From: ${req.user.fullName} to ${newOwner.fullName}. Type: ${transferType}. Awaiting your approval.`,
        relatedEntity: {
          entityType: 'Transfer',
          entityId: transfer._id
        },
        priority: 'high'
      })
    );

    await Promise.all(notificationPromises);

    res.status(201).json({
      status: 'success',
      data: { transfer },
      message: `Transfer request submitted successfully. ${adminsAndOfficers.length} officers notified.`
    });
  } catch (error) {
    next(error);
  }
};

// Get All Transfers
exports.getAllTransfers = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (req.user?.role === 'Land_Owner') {
      query.$or = [
        { previousOwner: req.user._id },
        { newOwner: req.user._id }
      ];
    }

    const transfers = await Transfer.find(query)
      .populate('landParcel', 'parcelNumber location sizeInAcres titleDeedNumber')
      .populate('previousOwner', 'fullName nationalId email')
      .populate('newOwner', 'fullName nationalId email')
      .populate('processedBy', 'fullName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      data: { transfers }
    });
  } catch (error) {
    next(error);
  }
};

// Get Transfer by ID
exports.getTransferById = async (req, res, next) => {
  try {
    const transfer = await Transfer.findById(req.params.id)
      .populate('landParcel')
      .populate('previousOwner', 'fullName email nationalId phoneNumber')
      .populate('newOwner', 'fullName email nationalId phoneNumber')
      .populate('processedBy', 'fullName role');

    if (!transfer) {
      return res.status(404).json({
        status: 'error',
        message: 'Transfer request not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { transfer }
    });
  } catch (error) {
    next(error);
  }
};

// Approve Transfer
exports.approveTransfer = async (req, res, next) => {
  try {
    const transfer = await Transfer.findById(req.params.id);
    if (!transfer) {
      return res.status(404).json({
        status: 'error',
        message: 'Transfer request not found'
      });
    }

    transfer.status = 'approved';
    transfer.processedBy = req.user._id;
    transfer.processedDate = new Date();
    await transfer.save();

    // Update Land Parcel Owner and History
    const parcel = await LandParcel.findById(transfer.landParcel);
    if (parcel) {
      parcel.ownershipHistory.push({
        owner: transfer.newOwner,
        acquiredDate: new Date(),
        transferMethod: transfer.transferType,
        notes: `Transfer approved by Officer ${req.user.fullName}`
      });
      parcel.currentOwner = transfer.newOwner;
      parcel.status = 'active';
      await parcel.save();
    }

    res.status(200).json({
      status: 'success',
      message: 'Transfer approved and title successfully conveyed to new owner.'
    });
  } catch (error) {
    next(error);
  }
};

// Reject Transfer
exports.rejectTransfer = async (req, res, next) => {
  try {
    const { rejectionReason } = req.body;
    const transfer = await Transfer.findById(req.params.id);
    if (!transfer) {
      return res.status(404).json({
        status: 'error',
        message: 'Transfer request not found'
      });
    }

    transfer.status = 'rejected';
    transfer.rejectionReason = rejectionReason || 'Rejection specified by land officer';
    transfer.processedBy = req.user._id;
    transfer.processedDate = new Date();
    await transfer.save();

    // Reset parcel status back to active
    await LandParcel.findByIdAndUpdate(transfer.landParcel, { status: 'active' });

    res.status(200).json({
      status: 'success',
      message: 'Transfer request rejected.'
    });
  } catch (error) {
    next(error);
  }
};

// Cancel Transfer
exports.cancelTransfer = async (req, res, next) => {
  try {
    const transfer = await Transfer.findById(req.params.id);
    if (!transfer) {
      return res.status(404).json({
        status: 'error',
        message: 'Transfer not found'
      });
    }

    transfer.status = 'cancelled';
    await transfer.save();
    await LandParcel.findByIdAndUpdate(transfer.landParcel, { status: 'active' });

    res.status(200).json({
      status: 'success',
      message: 'Transfer cancelled.'
    });
  } catch (error) {
    next(error);
  }
};
