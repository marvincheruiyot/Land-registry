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

    const auditLogs = await AuditLog.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .lean();

    // Transform audit logs to ticket format expected by frontend
    const tickets = auditLogs.map(log => ({
      _id: log._id,
      user: {
        fullName: log.metadata?.requesterName || 'Unknown User',
        email: log.metadata?.requesterEmail || 'N/A',
        _id: log.metadata?.requesterId
      },
      subject: log.metadata?.subject || 'No Subject',
      message: log.metadata?.message || log.description || '',
      category: log.metadata?.category || 'General',
      priority: log.metadata?.priority || 'medium',
      status: log.metadata?.status || 'pending',
      adminResponse: log.metadata?.adminResponse || null,
      createdAt: log.createdAt || log.timestamp
    }));

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

// @desc    Update support ticket status
// @route   PUT /api/v1/support-tickets/:id
// @access  Private (Administrators)
exports.updateTicketStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    const ticket = await AuditLog.findByIdAndUpdate(
      req.params.id,
      {
        'metadata.status': status,
        'metadata.updatedBy': req.user.fullName,
        'metadata.updatedAt': new Date()
      },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({
        status: 'error',
        message: 'Ticket not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { ticket }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Respond to support ticket
// @route   POST /api/v1/support-tickets/:id/respond
// @access  Private (Administrators)
exports.respondToTicket = async (req, res, next) => {
  try {
    const { response } = req.body;

    if (!response || !response.trim()) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a response message'
      });
    }

    const ticket = await AuditLog.findByIdAndUpdate(
      req.params.id,
      {
        'metadata.adminResponse': response,
        'metadata.respondedBy': req.user.fullName,
        'metadata.respondedAt': new Date(),
        'metadata.status': 'resolved'
      },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({
        status: 'error',
        message: 'Ticket not found'
      });
    }

    // Create notification for the user who submitted the ticket
    if (ticket.metadata?.requesterId) {
      const Notification = require('../models/Notification');
      
      await Notification.create({
        recipient: ticket.metadata.requesterId,
        type: 'SUPPORT_RESPONSE_RECEIVED',
        title: 'Support Response Received',
        message: `Your support ticket "${ticket.metadata.subject}" has been resolved. Response: ${response}`,
        relatedEntity: {
          entityType: 'SupportTicket',
          entityId: ticket._id
        },
        priority: 'medium'
      });

      // Also create audit log for tracking
      await AuditLog.create({
        user: ticket.metadata.requesterId,
        action: 'SUPPORT_RESPONSE_RECEIVED',
        resourceType: 'SupportTicket',
        details: `Response received for your support request: ${ticket.metadata.subject}`,
        description: response,
        ipAddress: req.ip,
        metadata: {
          ticketId: ticket._id,
          respondedBy: req.user.fullName,
          response
        }
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Response sent successfully and user notified',
      data: { ticket }
    });
  } catch (error) {
    next(error);
  }
};
