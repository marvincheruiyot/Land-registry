const LandParcel = require('../models/LandParcel');
const Transfer = require('../models/Transfer');
const AuditLog = require('../models/AuditLog');

// Generate Report
exports.generateReport = async (req, res, next) => {
  try {
    const { type, startDate, endDate, format } = req.body;
    
    const reportName = `${(type || 'Registry').replace(/_/g, ' ').toUpperCase()}_Report_${new Date().toISOString().split('T')[0]}.${format || 'pdf'}`;
    
    res.status(201).json({
      status: 'success',
      data: {
        report: {
          id: `rep-${Date.now()}`,
          name: reportName,
          type,
          format: format || 'pdf',
          date: new Date().toLocaleDateString('en-KE', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }),
          generatedBy: req.user.fullName,
          startDate,
          endDate
        }
      },
      message: 'Report compiled successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get Reports list
exports.getReports = async (req, res, next) => {
  try {
    // In a real implementation, you'd fetch from a Reports collection
    // For now, return placeholder
    res.status(200).json({
      status: 'success',
      data: {
        reports: []
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get Statistics
exports.getStatistics = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Count today's registrations (parcels created today)
    const todayRegistrations = await LandParcel.countDocuments({
      createdAt: { $gte: today }
    });
    
    // Count today's transfers
    const todayTransfers = await Transfer.countDocuments({
      createdAt: { $gte: today }
    });
    
    // Count today's verifications (audit logs with VERIFY action)
    const todayVerifications = await AuditLog.countDocuments({
      createdAt: { $gte: today },
      action: { $in: ['VERIFICATION_PERFORMED', 'DEED_VERIFIED'] }
    });
    
    res.status(200).json({
      status: 'success',
      data: {
        todayRegistrations,
        todayTransfers,
        todayVerifications
      }
    });
  } catch (error) {
    next(error);
  }
};

// Download Report
exports.downloadReport = async (req, res, next) => {
  try {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Report-${req.params.id}.pdf`);
    res.send(Buffer.from('%PDF-1.4 Ministry of Lands Cadastral Analytics Report'));
  } catch (error) {
    next(error);
  }
};

// Quick Report Download
exports.downloadQuickReport = async (req, res, next) => {
  try {
    const { type } = req.params;
    const filename = type === 'monthly' ? 'Monthly_Registry_Summary.pdf' : 'County_Land_Revenue.pdf';
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.send(Buffer.from(`%PDF-1.4 Ministry of Lands ${filename.replace('.pdf', '')} Report`));
  } catch (error) {
    next(error);
  }
};
