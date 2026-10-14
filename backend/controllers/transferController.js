const Transfer = require('../models/Transfer');
const LandParcel = require('../models/LandParcel');
const User = require('../models/User');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');

// Initiate Transfer
exports.initiateTransfer = async (req, res, next) => {
  try {
    const { landParcel, newOwnerNationalId, transferType, transferAmount, notes } = req.body;

    // Log what we received for debugging
    console.log('Received landParcel:', typeof landParcel, landParcel);

    // Validate that landParcel is a valid ObjectId string, not an object
    if (typeof landParcel !== 'string' || !landParcel.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid parcel ID format. Please refresh the page and try again.'
      });
    }

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

    // Create audit log for transfer initiation
    await AuditLog.create({
      action: 'TRANSFER_INITIATED',
      performedBy: req.user._id,
      entityType: 'Transfer',
      entityId: transfer._id,
      details: {
        parcelNumber: parcel.parcelNumber,
        location: parcel.location,
        transferType: transferType || 'sale',
        previousOwner: req.user.fullName,
        previousOwnerNationalId: req.user.nationalId,
        newOwner: newOwner.fullName,
        newOwnerNationalId: newOwner.nationalId,
        transferAmount: Number(transferAmount) || 0,
        notes: notes || '',
        initiatedBy: req.user.fullName,
        initiatedDate: new Date()
      },
      ipAddress: req.ip
    });

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
    const transfer = await Transfer.findById(req.params.id)
      .populate('landParcel', 'parcelNumber location')
      .populate('previousOwner', 'fullName nationalId')
      .populate('newOwner', 'fullName nationalId');

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

    // Create audit log for transfer approval
    await AuditLog.create({
      action: 'TRANSFER_APPROVED',
      performedBy: req.user._id,
      entityType: 'Transfer',
      entityId: transfer._id,
      details: {
        parcelNumber: transfer.landParcel.parcelNumber,
        location: transfer.landParcel.location,
        transferType: transfer.transferType,
        previousOwner: transfer.previousOwner.fullName,
        previousOwnerNationalId: transfer.previousOwner.nationalId,
        newOwner: transfer.newOwner.fullName,
        newOwnerNationalId: transfer.newOwner.nationalId,
        transferAmount: transfer.transferAmount,
        approvedBy: req.user.fullName,
        approvedDate: new Date()
      },
      ipAddress: req.ip
    });

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
    const transfer = await Transfer.findById(req.params.id)
      .populate('landParcel', 'parcelNumber location')
      .populate('previousOwner', 'fullName nationalId')
      .populate('newOwner', 'fullName nationalId');

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

    // Create audit log for transfer rejection
    await AuditLog.create({
      action: 'TRANSFER_REJECTED',
      performedBy: req.user._id,
      entityType: 'Transfer',
      entityId: transfer._id,
      details: {
        parcelNumber: transfer.landParcel.parcelNumber,
        location: transfer.landParcel.location,
        transferType: transfer.transferType,
        previousOwner: transfer.previousOwner.fullName,
        previousOwnerNationalId: transfer.previousOwner.nationalId,
        newOwner: transfer.newOwner.fullName,
        newOwnerNationalId: transfer.newOwner.nationalId,
        rejectionReason: rejectionReason || 'Rejection specified by land officer',
        rejectedBy: req.user.fullName,
        rejectedDate: new Date()
      },
      ipAddress: req.ip
    });

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
    const transfer = await Transfer.findById(req.params.id)
      .populate('landParcel', 'parcelNumber location')
      .populate('previousOwner', 'fullName nationalId')
      .populate('newOwner', 'fullName nationalId');

    if (!transfer) {
      return res.status(404).json({
        status: 'error',
        message: 'Transfer not found'
      });
    }

    transfer.status = 'cancelled';
    await transfer.save();
    await LandParcel.findByIdAndUpdate(transfer.landParcel, { status: 'active' });

    // Create audit log for transfer cancellation
    await AuditLog.create({
      action: 'TRANSFER_CANCELLED',
      performedBy: req.user._id,
      entityType: 'Transfer',
      entityId: transfer._id,
      details: {
        parcelNumber: transfer.landParcel.parcelNumber,
        location: transfer.landParcel.location,
        transferType: transfer.transferType,
        previousOwner: transfer.previousOwner.fullName,
        previousOwnerNationalId: transfer.previousOwner.nationalId,
        newOwner: transfer.newOwner.fullName,
        newOwnerNationalId: transfer.newOwner.nationalId,
        cancelledBy: req.user.fullName,
        cancelledDate: new Date()
      },
      ipAddress: req.ip
    });

    res.status(200).json({
      status: 'success',
      message: 'Transfer cancelled.'
    });
  } catch (error) {
    next(error);
  }
};
