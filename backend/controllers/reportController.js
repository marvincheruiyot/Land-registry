const LandParcel = require('../models/LandParcel');
const Transfer = require('../models/Transfer');
const AuditLog = require('../models/AuditLog');

// Generate Report
exports.generateReport = async (req, res, next) => {
  try {
    const { type, startDate, endDate, format } = req.body;
    
    // Convert dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Include full end day
    
    let reportData = [];
    let reportContent = '';
    
    // Fetch data based on report type
    switch(type) {
      case 'daily_registrations':
        const parcels = await LandParcel.find({
          createdAt: { $gte: start, $lte: end }
        }).populate('currentOwner', 'fullName nationalId').sort({ createdAt: -1 });
        
        reportData = parcels.map(p => ({
          parcelNumber: p.parcelNumber,
          owner: p.currentOwner?.fullName || 'N/A',
          nationalId: p.currentOwner?.nationalId || 'N/A',
          location: `${p.location?.county || 'N/A'}, ${p.location?.subCounty || 'N/A'}`,
          size: `${p.sizeInAcres} acres`,
          landUse: p.landUse || 'N/A',
          date: new Date(p.createdAt).toLocaleDateString('en-KE')
        }));
        
        reportContent = `Total Registrations: ${reportData.length}\\n\\n`;
        reportData.forEach((item, idx) => {
          reportContent += `${idx + 1}. Parcel: ${item.parcelNumber}\\n`;
          reportContent += `   Owner: ${item.owner} (${item.nationalId})\\n`;
          reportContent += `   Location: ${item.location}\\n`;
          reportContent += `   Size: ${item.size}, Use: ${item.landUse}\\n`;
          reportContent += `   Date: ${item.date}\\n\\n`;
        });
        break;
        
      case 'monthly_transfers':
        const transfers = await Transfer.find({
          createdAt: { $gte: start, $lte: end }
        }).populate('landParcel', 'parcelNumber location')
          .populate('previousOwner', 'fullName nationalId')
          .populate('newOwner', 'fullName nationalId')
          .sort({ createdAt: -1 });
        
        reportData = transfers.map(t => ({
          parcelNumber: t.landParcel?.parcelNumber || 'N/A',
          location: t.landParcel?.location?.county || 'N/A',
          previousOwner: t.previousOwner?.fullName || 'N/A',
          previousId: t.previousOwner?.nationalId || 'N/A',
          newOwner: t.newOwner?.fullName || 'N/A',
          newId: t.newOwner?.nationalId || 'N/A',
          type: t.transferType || 'N/A',
          status: t.status || 'pending',
          date: new Date(t.createdAt).toLocaleDateString('en-KE')
        }));
        
        reportContent = `Total Transfers: ${reportData.length}\\n`;
        reportContent += `Pending: ${reportData.filter(t => t.status === 'pending').length}\\n`;
        reportContent += `Approved: ${reportData.filter(t => t.status === 'approved').length}\\n`;
        reportContent += `Rejected: ${reportData.filter(t => t.status === 'rejected').length}\\n\\n`;
        
        reportData.forEach((item, idx) => {
          reportContent += `${idx + 1}. Parcel: ${item.parcelNumber} (${item.location})\\n`;
          reportContent += `   From: ${item.previousOwner} (${item.previousId})\\n`;
          reportContent += `   To: ${item.newOwner} (${item.newId})\\n`;
          reportContent += `   Type: ${item.type}, Status: ${item.status.toUpperCase()}\\n`;
          reportContent += `   Date: ${item.date}\\n\\n`;
        });
        break;
        
      case 'user_activity':
        const auditLogs = await AuditLog.find({
          createdAt: { $gte: start, $lte: end }
        }).populate('performedBy', 'fullName role').sort({ createdAt: -1 }).limit(100);
        
        reportData = auditLogs.map(log => ({
          action: log.action,
          user: log.performedBy?.fullName || 'System',
          role: log.performedBy?.role || 'System',
          date: new Date(log.createdAt).toLocaleString('en-KE')
        }));
        
        reportContent = `Total Activities: ${reportData.length}\\n\\n`;
        reportData.forEach((item, idx) => {
          reportContent += `${idx + 1}. ${item.action}\\n`;
          reportContent += `   By: ${item.user} (${item.role})\\n`;
          reportContent += `   Date: ${item.date}\\n\\n`;
        });
        break;
        
      case 'pending_requests':
        const pendingTransfers = await Transfer.find({
          status: 'pending'
        }).populate('landParcel', 'parcelNumber location')
          .populate('previousOwner', 'fullName nationalId')
          .populate('newOwner', 'fullName nationalId')
          .sort({ createdAt: -1 });
        
        reportData = pendingTransfers.map(t => ({
          parcelNumber: t.landParcel?.parcelNumber || 'N/A',
          location: t.landParcel?.location?.county || 'N/A',
          previousOwner: t.previousOwner?.fullName || 'N/A',
          newOwner: t.newOwner?.fullName || 'N/A',
          type: t.transferType || 'N/A',
          daysPending: Math.floor((new Date() - new Date(t.createdAt)) / (1000 * 60 * 60 * 24)),
          date: new Date(t.createdAt).toLocaleDateString('en-KE')
        }));
        
        reportContent = `Total Pending Requests: ${reportData.length}\\n\\n`;
        reportData.forEach((item, idx) => {
          reportContent += `${idx + 1}. Parcel: ${item.parcelNumber} (${item.location})\\n`;
          reportContent += `   From: ${item.previousOwner}\\n`;
          reportContent += `   To: ${item.newOwner}\\n`;
          reportContent += `   Type: ${item.type}\\n`;
          reportContent += `   Pending: ${item.daysPending} days\\n`;
          reportContent += `   Submitted: ${item.date}\\n\\n`;
        });
        break;
        
      default:
        reportContent = 'Report type not implemented yet.';
    }
    
    // Generate PDF with actual data
    const reportTitle = (type || 'Registry').replace(/_/g, ' ').toUpperCase();
    const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /Resources 4 0 R /MediaBox [0 0 612 792] /Contents 5 0 R >>
endobj
4 0 obj
<< /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Courier >> /F2 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> >> >>
endobj
5 0 obj
<< /Length ${2000 + reportContent.length} >>
stream
BT
/F2 18 Tf
50 750 Td
(MINISTRY OF LANDS & PHYSICAL PLANNING) Tj
0 -25 Td
/F2 14 Tf
(${reportTitle} REPORT) Tj
0 -30 Td
/F1 10 Tf
(Period: ${new Date(startDate).toLocaleDateString('en-KE')} to ${new Date(endDate).toLocaleDateString('en-KE')}) Tj
0 -15 Td
(Generated: ${new Date().toLocaleString('en-KE')}) Tj
0 -15 Td
(Generated By: ${req.user?.fullName || 'Administrator'}) Tj
0 -30 Td
/F2 11 Tf
(REPORT DETAILS:) Tj
0 -20 Td
/F1 9 Tf
(${reportContent.replace(/\n/g, ') Tj 0 -12 Td (')}) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000214 00000 n
0000000366 00000 n
trailer
<< /Size 6 /Root 1 0 R >>
startxref
${2500 + reportContent.length}
%%EOF`;

    // Send PDF directly as download
    const reportName = `${reportTitle}_${new Date().toISOString().split('T')[0]}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${reportName}"`);
    res.send(Buffer.from(pdfContent));
    
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
    const { id } = req.params;
    
    // Create a simple valid PDF with report content
    const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /Resources 4 0 R /MediaBox [0 0 612 792] /Contents 5 0 R >>
endobj
4 0 obj
<< /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >>
endobj
5 0 obj
<< /Length 300 >>
stream
BT
/F1 24 Tf
50 750 Td
(Ministry of Lands & Physical Planning) Tj
0 -30 Td
/F1 18 Tf
(Land Registry System Report) Tj
0 -50 Td
/F1 12 Tf
(Report ID: ${id}) Tj
0 -30 Td
(Generated: ${new Date().toLocaleString('en-KE')}) Tj
0 -30 Td
(Generated By: ${req.user?.fullName || 'System Administrator'}) Tj
0 -50 Td
(This is a system-generated report from the) Tj
0 -20 Td
(Kenya Land Registry Management System.) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000214 00000 n
0000000309 00000 n
trailer
<< /Size 6 /Root 1 0 R >>
startxref
660
%%EOF`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Report-${id}.pdf`);
    res.send(Buffer.from(pdfContent));
  } catch (error) {
    next(error);
  }
};

// Quick Report Download
exports.downloadQuickReport = async (req, res, next) => {
  try {
    const { type } = req.params;
    const filename = type === 'monthly' ? 'Monthly_Registry_Summary.pdf' : 'County_Land_Revenue.pdf';
    const reportTitle = type === 'monthly' ? 'Monthly Registry Summary' : 'County Land Revenue Report';
    
    // Fetch relevant data based on report type
    let reportData = '';
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    if (type === 'monthly') {
      const monthlyParcels = await LandParcel.countDocuments({
        createdAt: { $gte: startOfMonth }
      });
      const monthlyTransfers = await Transfer.countDocuments({
        createdAt: { $gte: startOfMonth }
      });
      reportData = `Parcels Registered This Month: ${monthlyParcels}\\nTransfers This Month: ${monthlyTransfers}`;
    } else if (type === 'revenue') {
      const totalTransfers = await Transfer.countDocuments();
      const approvedTransfers = await Transfer.countDocuments({ status: 'approved' });
      reportData = `Total Transfers: ${totalTransfers}\\nApproved Transfers: ${approvedTransfers}`;
    }
    
    // Create a simple valid PDF with report content
    const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /Resources 4 0 R /MediaBox [0 0 612 792] /Contents 5 0 R >>
endobj
4 0 obj
<< /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> /F2 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> >> >>
endobj
5 0 obj
<< /Length 400 >>
stream
BT
/F2 24 Tf
50 750 Td
(Ministry of Lands & Physical Planning) Tj
0 -30 Td
/F2 18 Tf
(${reportTitle}) Tj
0 -50 Td
/F1 12 Tf
(Generated: ${today.toLocaleString('en-KE')}) Tj
0 -30 Td
(Generated By: ${req.user?.fullName || 'System Administrator'}) Tj
0 -50 Td
/F2 14 Tf
(Report Summary:) Tj
0 -30 Td
/F1 11 Tf
(${reportData}) Tj
0 -50 Td
(This is a system-generated report from the) Tj
0 -20 Td
(Kenya Land Registry Management System.) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000214 00000 n
0000000366 00000 n
trailer
<< /Size 6 /Root 1 0 R >>
startxref
817
%%EOF`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.send(Buffer.from(pdfContent));
  } catch (error) {
    next(error);
  }
};
