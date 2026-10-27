const LandParcel = require('../models/LandParcel');
const Transfer = require('../models/Transfer');
const AuditLog = require('../models/AuditLog');
const Report = require('../models/Report');

// Generate Today's Activity Report
exports.generateTodayActivity = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);
    
    // Fetch today's data
    const todayParcels = await LandParcel.find({
      createdAt: { $gte: today, $lte: endOfDay }
    }).populate('currentOwner', 'fullName nationalId email phoneNumber').sort({ createdAt: -1 });
    
    const todayTransfers = await Transfer.find({
      createdAt: { $gte: today, $lte: endOfDay }
    }).populate('landParcel', 'parcelNumber location sizeInAcres')
      .populate('previousOwner', 'fullName nationalId phoneNumber')
      .populate('newOwner', 'fullName nationalId phoneNumber')
      .sort({ createdAt: -1 });
    
    const todayVerifications = await AuditLog.find({
      createdAt: { $gte: today, $lte: endOfDay },
      action: { $in: ['VERIFICATION_PERFORMED', 'DEED_VERIFIED', 'DOCUMENT_VERIFIED'] }
    }).populate('performedBy', 'fullName role').sort({ createdAt: -1 });
    
    // Build detailed report content in table format
    let reportContent = '';
    
    // Registrations Table
    reportContent += `\\n${'='.repeat(95)}\\n`;
    reportContent += `SECTION 1: NEW LAND PARCEL REGISTRATIONS (${todayParcels.length} Records)\\n`;
    reportContent += `${'='.repeat(95)}\\n\\n`;
    
    if (todayParcels.length > 0) {
      // Table header
      reportContent += String('No.').padEnd(5);
      reportContent += String('Parcel Number').padEnd(18);
      reportContent += String('Owner Name').padEnd(20);
      reportContent += String('National ID').padEnd(12);
      reportContent += String('Location').padEnd(18);
      reportContent += String('Size').padEnd(10);
      reportContent += String('Time').padEnd(8);
      reportContent += `\\n${'-'.repeat(95)}\\n`;
      
      todayParcels.forEach((parcel, idx) => {
        const no = String(idx + 1).padEnd(5);
        const parcelNum = String(parcel.parcelNumber || 'N/A').substring(0, 17).padEnd(18);
        const owner = String(parcel.currentOwner?.fullName || 'N/A').substring(0, 19).padEnd(20);
        const natId = String(parcel.currentOwner?.nationalId || 'N/A').padEnd(12);
        const location = String(parcel.location?.county || 'N/A').substring(0, 17).padEnd(18);
        const size = String(parcel.sizeInAcres + ' ac').padEnd(10);
        const time = String(new Date(parcel.createdAt).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit', hour12: false })).padEnd(8);
        
        reportContent += `${no}${parcelNum}${owner}${natId}${location}${size}${time}\\n`;
        
        // Additional details
        reportContent += `    Sub-County: ${parcel.location?.subCounty || 'N/A'}, Ward: ${parcel.location?.ward || 'N/A'}\\n`;
        reportContent += `    Land Use: ${parcel.landUse || parcel.intendedUse || 'N/A'}, Deed: ${parcel.titleDeedNumber || 'Pending'}\\n`;
        reportContent += `    Phone: ${parcel.currentOwner?.phoneNumber || 'N/A'}, Email: ${parcel.currentOwner?.email || 'N/A'}\\n`;
        reportContent += `    Coordinates: Lat ${parcel.location?.coordinates?.latitude || 'N/A'}, Lng ${parcel.location?.coordinates?.longitude || 'N/A'}\\n\\n`;
      });
    } else {
      reportContent += `No new parcels registered today.\\n\\n`;
    }
    
    // Transfers Table
    reportContent += `\\n${'='.repeat(95)}\\n`;
    reportContent += `SECTION 2: OWNERSHIP TRANSFERS (${todayTransfers.length} Records)\\n`;
    reportContent += `${'='.repeat(95)}\\n\\n`;
    
    if (todayTransfers.length > 0) {
      // Table header
      reportContent += String('No.').padEnd(5);
      reportContent += String('Parcel').padEnd(18);
      reportContent += String('Previous Owner').padEnd(20);
      reportContent += String('New Owner').padEnd(20);
      reportContent += String('Type').padEnd(12);
      reportContent += String('Status').padEnd(10);
      reportContent += String('Time').padEnd(8);
      reportContent += `\\n${'-'.repeat(95)}\\n`;
      
      todayTransfers.forEach((transfer, idx) => {
        const no = String(idx + 1).padEnd(5);
        const parcelNum = String(transfer.landParcel?.parcelNumber || 'N/A').substring(0, 17).padEnd(18);
        const prevOwner = String(transfer.previousOwner?.fullName || 'N/A').substring(0, 19).padEnd(20);
        const newOwner = String(transfer.newOwner?.fullName || 'N/A').substring(0, 19).padEnd(20);
        const type = String(transfer.transferType?.toUpperCase() || 'SALE').substring(0, 11).padEnd(12);
        const status = String(transfer.status?.toUpperCase() || 'PENDING').substring(0, 9).padEnd(10);
        const time = String(new Date(transfer.createdAt).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit', hour12: false })).padEnd(8);
        
        reportContent += `${no}${parcelNum}${prevOwner}${newOwner}${type}${status}${time}\\n`;
        
        // Additional details
        reportContent += `    Location: ${transfer.landParcel?.location?.county || 'N/A'}, Size: ${transfer.landParcel?.sizeInAcres || 'N/A'} acres\\n`;
        reportContent += `    Previous Owner ID: ${transfer.previousOwner?.nationalId || 'N/A'}, Phone: ${transfer.previousOwner?.phoneNumber || 'N/A'}\\n`;
        reportContent += `    New Owner ID: ${transfer.newOwner?.nationalId || 'N/A'}, Phone: ${transfer.newOwner?.phoneNumber || 'N/A'}\\n`;
        reportContent += `    Transfer Amount: ${transfer.transferAmount ? 'KSh ' + transfer.transferAmount.toLocaleString() : 'N/A'}\\n\\n`;
      });
      
      // Summary stats
      const pending = todayTransfers.filter(t => t.status === 'pending').length;
      const approved = todayTransfers.filter(t => t.status === 'approved').length;
      const rejected = todayTransfers.filter(t => t.status === 'rejected').length;
      
      reportContent += `\\n${'-'.repeat(95)}\\n`;
      reportContent += `SUMMARY: Pending: ${pending}, Approved: ${approved}, Rejected: ${rejected}\\n`;
    } else {
      reportContent += `No transfers initiated today.\\n\\n`;
    }
    
    // Verifications Table
    reportContent += `\\n${'='.repeat(95)}\\n`;
    reportContent += `SECTION 3: DEED VERIFICATIONS (${todayVerifications.length} Records)\\n`;
    reportContent += `${'='.repeat(95)}\\n\\n`;
    
    if (todayVerifications.length > 0) {
      // Table header
      reportContent += String('No.').padEnd(5);
      reportContent += String('Action').padEnd(30);
      reportContent += String('Performed By').padEnd(25);
      reportContent += String('Role').padEnd(18);
      reportContent += String('Time').padEnd(12);
      reportContent += `\\n${'-'.repeat(95)}\\n`;
      
      todayVerifications.forEach((log, idx) => {
        const no = String(idx + 1).padEnd(5);
        const action = String(log.action || 'VERIFICATION').substring(0, 29).padEnd(30);
        const performer = String(log.performedBy?.fullName || 'System').substring(0, 24).padEnd(25);
        const role = String(log.performedBy?.role || 'N/A').substring(0, 17).padEnd(18);
        const time = String(new Date(log.createdAt).toLocaleTimeString('en-KE')).substring(0, 11).padEnd(12);
        
        reportContent += `${no}${action}${performer}${role}${time}\\n`;
      });
    } else {
      reportContent += `No verifications performed today.\\n\\n`;
    }
    
    // Generate PDF
    const reportTitle = "TODAY'S ACTIVITY REPORT";
    const totalRecords = todayParcels.length + todayTransfers.length + todayVerifications.length;
    
    const pdfContent = generatePDFContent(reportTitle, reportContent, {
      startDate: today,
      endDate: endOfDay,
      generatedBy: req.user?.fullName || 'System',
      summary: `Total: ${totalRecords} records | Registrations: ${todayParcels.length} | Transfers: ${todayTransfers.length} | Verifications: ${todayVerifications.length}`
    });
    
    // Save report to database
    const reportRecord = await Report.create({
      name: `Today's Activity - ${new Date().toLocaleDateString('en-KE')}`,
      type: 'today_activity',
      format: 'pdf',
      startDate: today,
      endDate: endOfDay,
      generatedBy: req.user._id,
      fileSize: Buffer.byteLength(pdfContent),
      recordCount: totalRecords,
      status: 'completed',
      metadata: {
        registrations: todayParcels.length,
        transfers: todayTransfers.length,
        verifications: todayVerifications.length
      }
    });
    
    // Send PDF
    const reportName = `Todays_Activity_${new Date().toISOString().split('T')[0]}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${reportName}"`);
    res.send(Buffer.from(pdfContent));
    
  } catch (error) {
    console.error('Generate today activity error:', error);
    next(error);
  }
};

// Helper function to generate PDF content with tables
function generatePDFContent(title, content, options = {}) {
  const { startDate, endDate, generatedBy, summary } = options;
  
  // Escape special PDF characters
  const escapeText = (text) => {
    if (!text) return 'N/A';
    return String(text)
      .replace(/\\/g, '\\\\')
      .replace(/\(/g, '\\(')
      .replace(/\)/g, '\\)')
      .substring(0, 100); // Limit length
  };
  
  const dateStr = startDate ? new Date(startDate).toLocaleDateString('en-KE') : new Date().toLocaleDateString('en-KE');
  const endDateStr = endDate && new Date(startDate).toDateString() !== new Date(endDate).toDateString() ? ' to ' + new Date(endDate).toLocaleDateString('en-KE') : '';
  
  return `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /Resources 4 0 R /MediaBox [0 0 842 595] /Contents 5 0 R >>
endobj
4 0 obj
<< /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Courier >> /F2 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> /F3 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >>
endobj
5 0 obj
<< /Length ${3500 + content.length} >>
stream
BT
/F2 14 Tf
50 560 Td
(REPUBLIC OF KENYA) Tj
0 -16 Td
/F2 12 Tf
(MINISTRY OF LANDS & PHYSICAL PLANNING) Tj
0 -25 Td
/F2 11 Tf
(${escapeText(title)}) Tj
0 -20 Td
/F3 8 Tf
(Report Date: ${escapeText(dateStr + endDateStr)}) Tj
0 -10 Td
(Generated: ${escapeText(new Date().toLocaleString('en-KE'))}) Tj
0 -10 Td
(Officer: ${escapeText(generatedBy)}) Tj
${summary ? `0 -10 Td (${escapeText(summary)}) Tj` : ''}
0 -15 Td
/F2 8 Tf
(${'_'.repeat(95)}) Tj
0 -15 Td
/F1 7 Tf
(${content.replace(/\n/g, ') Tj 0 -9 Td (').replace(/[\(\)]/g, '')}) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000224 00000 n
0000000399 00000 n
trailer
<< /Size 6 /Root 1 0 R >>
startxref
${4200 + content.length}
%%EOF`;
}

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
        }).populate('currentOwner', 'fullName nationalId phoneNumber email').sort({ createdAt: -1 });
        
        reportData = parcels;
        reportContent = `TOTAL REGISTRATIONS: ${parcels.length}\\n\\n`;
        
        if (parcels.length > 0) {
          // Table header
          reportContent += String('No.').padEnd(5);
          reportContent += String('Parcel Number').padEnd(20);
          reportContent += String('Owner Name').padEnd(22);
          reportContent += String('National ID').padEnd(12);
          reportContent += String('Location').padEnd(20);
          reportContent += String('Size').padEnd(10);
          reportContent += `\\n${'-'.repeat(95)}\\n`;
          
          parcels.forEach((p, idx) => {
            reportContent += String(idx + 1).padEnd(5);
            reportContent += String(p.parcelNumber || 'N/A').substring(0, 19).padEnd(20);
            reportContent += String(p.currentOwner?.fullName || 'N/A').substring(0, 21).padEnd(22);
            reportContent += String(p.currentOwner?.nationalId || 'N/A').padEnd(12);
            reportContent += String(p.location?.county || 'N/A').substring(0, 19).padEnd(20);
            reportContent += String((p.sizeInAcres || 0) + ' ac').padEnd(10);
            reportContent += `\\n`;
            
            // Additional info
            reportContent += `     Sub-County: ${p.location?.subCounty || 'N/A'}, Ward: ${p.location?.ward || 'N/A'}\\n`;
            reportContent += `     Land Use: ${p.landUse || p.intendedUse || 'N/A'}, Deed: ${p.titleDeedNumber || 'Pending'}\\n`;
            reportContent += `     Contact: ${p.currentOwner?.phoneNumber || 'N/A'}, ${p.currentOwner?.email || 'N/A'}\\n`;
            reportContent += `     Registered: ${new Date(p.createdAt).toLocaleString('en-KE')}\\n\\n`;
          });
        }
        break;
        
      case 'monthly_transfers':
        const transfers = await Transfer.find({
          createdAt: { $gte: start, $lte: end }
        }).populate('landParcel', 'parcelNumber location sizeInAcres')
          .populate('previousOwner', 'fullName nationalId phoneNumber')
          .populate('newOwner', 'fullName nationalId phoneNumber')
          .sort({ createdAt: -1 });
        
        reportData = transfers;
        const pending = transfers.filter(t => t.status === 'pending').length;
        const approved = transfers.filter(t => t.status === 'approved').length;
        const rejected = transfers.filter(t => t.status === 'rejected').length;
        
        reportContent = `TOTAL TRANSFERS: ${transfers.length}\\n`;
        reportContent += `Pending: ${pending}, Approved: ${approved}, Rejected: ${rejected}\\n\\n`;
        
        if (transfers.length > 0) {
          // Table header
          reportContent += String('No.').padEnd(5);
          reportContent += String('Parcel').padEnd(18);
          reportContent += String('From Owner').padEnd(20);
          reportContent += String('To Owner').padEnd(20);
          reportContent += String('Type').padEnd(12);
          reportContent += String('Status').padEnd(10);
          reportContent += `\\n${'-'.repeat(95)}\\n`;
          
          transfers.forEach((t, idx) => {
            reportContent += String(idx + 1).padEnd(5);
            reportContent += String(t.landParcel?.parcelNumber || 'N/A').substring(0, 17).padEnd(18);
            reportContent += String(t.previousOwner?.fullName || 'N/A').substring(0, 19).padEnd(20);
            reportContent += String(t.newOwner?.fullName || 'N/A').substring(0, 19).padEnd(20);
            reportContent += String(t.transferType || 'sale').substring(0, 11).padEnd(12);
            reportContent += String(t.status || 'pending').substring(0, 9).padEnd(10);
            reportContent += `\\n`;
            
            // Additional info
            reportContent += `     Location: ${t.landParcel?.location?.county || 'N/A'}, Size: ${t.landParcel?.sizeInAcres || 'N/A'} acres\\n`;
            reportContent += `     Previous Owner ID: ${t.previousOwner?.nationalId || 'N/A'}, Phone: ${t.previousOwner?.phoneNumber || 'N/A'}\\n`;
            reportContent += `     New Owner ID: ${t.newOwner?.nationalId || 'N/A'}, Phone: ${t.newOwner?.phoneNumber || 'N/A'}\\n`;
            reportContent += `     Amount: ${t.transferAmount ? 'KSh ' + t.transferAmount.toLocaleString() : 'N/A'}\\n`;
            reportContent += `     Date: ${new Date(t.createdAt).toLocaleString('en-KE')}\\n\\n`;
          });
        }
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
    const pdfContent = generatePDFContent(reportTitle, reportContent, {
      startDate,
      endDate,
      generatedBy: req.user?.fullName || 'System',
      summary: `Total Records: ${reportData.length}`
    });
    
    // Save report to database
    const reportRecord = await Report.create({
      name: `${reportTitle} - ${new Date(startDate).toLocaleDateString('en-KE')} to ${new Date(endDate).toLocaleDateString('en-KE')}`,
      type,
      format: format || 'pdf',
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      generatedBy: req.user._id,
      fileSize: Buffer.byteLength(pdfContent),
      recordCount: reportData.length,
      status: 'completed',
      metadata: {
        reportType: type,
        dateRange: `${startDate} to ${endDate}`
      }
    });

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
    // Fetch reports from database, sorted by most recent first
    const reports = await Report.find()
      .populate('generatedBy', 'fullName role')
      .sort({ createdAt: -1 })
      .limit(50); // Limit to last 50 reports
    
    // Format for frontend
    const formattedReports = reports.map(report => ({
      id: report._id,
      name: report.name,
      type: report.type,
      format: report.format,
      date: new Date(report.createdAt).toLocaleDateString('en-KE'),
      dateTime: new Date(report.createdAt).toLocaleString('en-KE'),
      generatedBy: report.generatedBy?.fullName || 'System',
      fileSize: report.fileSize,
      recordCount: report.recordCount,
      downloadCount: report.downloadCount
    }));
    
    res.status(200).json({
      status: 'success',
      data: {
        reports: formattedReports
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
    
    // Find the report in database
    const report = await Report.findById(id).populate('generatedBy', 'fullName');
    
    if (!report) {
      return res.status(404).json({
        status: 'error',
        message: 'Report not found'
      });
    }
    
    // Increment download count
    report.downloadCount += 1;
    report.lastDownloadedAt = new Date();
    await report.save();
    
    // Generate report content based on type and recreate the PDF
    let reportContent = `Report Type: ${report.type.toUpperCase()}\\n`;
    reportContent += `Generated: ${new Date(report.createdAt).toLocaleString('en-KE')}\\n`;
    reportContent += `Date Range: ${report.startDate ? new Date(report.startDate).toLocaleDateString('en-KE') : 'N/A'} to ${report.endDate ? new Date(report.endDate).toLocaleDateString('en-KE') : 'N/A'}\\n`;
    reportContent += `Total Records: ${report.recordCount}\\n`;
    reportContent += `\\nThis report has been downloaded ${report.downloadCount} time(s).\\n`;
    reportContent += `\\nNote: For detailed data, please generate a new report with the date range.`;
    
    const pdfContent = generatePDFContent(report.name.toUpperCase(), reportContent, {
      startDate: report.startDate,
      endDate: report.endDate,
      generatedBy: report.generatedBy?.fullName || 'System'
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${report.name.replace(/\s+/g, '_')}.pdf`);
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
