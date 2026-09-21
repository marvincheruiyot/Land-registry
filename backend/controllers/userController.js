const User = require('../models/User');

// Get Profile
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

// Update Profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { fullName, email, phoneNumber, physicalAddress } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { fullName, email, phoneNumber, physicalAddress },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      data: { user },
      message: 'Profile updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Notifications
exports.getNotifications = async (req, res, next) => {
  try {
    res.status(200).json({
      status: 'success',
      data: { notifications: [] }
    });
  } catch (error) {
    next(error);
  }
};

exports.markNotificationAsRead = async (req, res, next) => {
  try {
    res.status(200).json({
      status: 'success',
      message: 'Notification marked as read'
    });
  } catch (error) {
    next(error);
  }
};
