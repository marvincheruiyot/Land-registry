const User = require('../models/User');
const AuditLog = require('../models/AuditLog');

// @desc    Submit support ticket
// @route   POST /api/v1/support-tickets
// @access  Private (Land Owners)
exports.submitSupportTicket = async (req, res, next) => {
  try {
    const { subject, category, priority, message } = req.body;
    const user = req.user;

    // Validate input
    if (!subject || !category || !priority || !message) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide subject, category, priority, and message'
      });
    }

    // Find all Land Officers and Administrators
    const adminsAndOfficers = await User.find({
      role: { $in: ['Land_Officer', 'Administrator'] },
      isActive: true
    });

    if (adminsAndOfficers.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No administrators or officers available to receive your request'
      });
    }

    // Create a notification for each admin and officer
    const notificationPromises = adminsAndOfficers.map(async (admin) => {
      return await AuditLog.create({
        user: admin._id,
        action: 'SUPPORT_REQUEST',
        resourceType: 'SupportTicket',
        details: `Support Request from ${user.fullName} (${user.email})`,
        description: `[${priority}] [${category}] ${subject}: ${message}`,
        ipAddress: req.ip,
        metadata: {
          requesterId: user._id,
          requesterName: user.fullName,
          requesterEmail: user.email,
          requesterPhone: user.phoneNumber,
          subject,
          category,
          priority,
          message
        }
      });
    });

    await Promise.all(notificationPromises);

    // Create audit log for the requester
    await AuditLog.create({
      user: user._id,
      action: 'SUPPORT_REQUEST_SUBMITTED',
      resourceType: 'SupportTicket',
      details: `Support request submitted: ${subject}`,
      description: `Your support request has been submitted and sent to ${adminsAndOfficers.length} administrator(s) and officer(s).`,
      ipAddress: req.ip
    });

    res.status(201).json({
      status: 'success',
      message: `Support request submitted successfully. ${adminsAndOfficers.length} administrator(s) and officer(s) have been notified.`,
      data: {
        recipientCount: adminsAndOfficers.length
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all support tickets (for admins/officers)
// @route   GET /api/v1/support-tickets
// @access  Private (Land Officers, Administrators)
exports.getSupportTickets = async (req, res, next) => {
  try {
    const { status = 'all', limit = 50 } = req.query;
    
    const query = {
      action: 'SUPPORT_REQUEST',
      user: req.user._id
    };

    const tickets = await AuditLog.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      status: 'success',
      data: {
        tickets,
        count: tickets.length
      }
    });
  } catch (error) {
    next(error);
  }
};
