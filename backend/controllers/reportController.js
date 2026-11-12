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
    
    const pdfContent = await generatePDFContent(reportTitle, reportContent, {
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
      fileSize: pdfContent.length,
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
    res.send(pdfContent);
    
  } catch (error) {
    console.error('Generate today activity error:', error);
    next(error);
  }
};

// Helper function to generate CSV content
function generateCSV(type, data) {
  let csv = '';
  
  switch(type) {
    case 'daily_registrations':
      // CSV header
      csv = 'No.,Parcel Number,Owner Name,National ID,Phone,Email,County,Sub-County,Ward,Size (Acres),Land Use,Title Deed,Registration Date\n';
      
      // CSV rows
      data.forEach((p, idx) => {
        csv += `${idx + 1},`;
        csv += `"${p.parcelNumber || 'N/A'}",`;
        csv += `"${p.currentOwner?.fullName || 'N/A'}",`;
        csv += `"${p.currentOwner?.nationalId || 'N/A'}",`;
        csv += `"${p.currentOwner?.phoneNumber || 'N/A'}",`;
        csv += `"${p.currentOwner?.email || 'N/A'}",`;
        csv += `"${p.location?.county || 'N/A'}",`;
        csv += `"${p.location?.subCounty || 'N/A'}",`;
        csv += `"${p.location?.ward || 'N/A'}",`;
        csv += `${p.sizeInAcres || 0},`;
        csv += `"${p.landUse || p.intendedUse || 'N/A'}",`;
        csv += `"${p.titleDeedNumber || 'Pending'}",`;
        csv += `"${new Date(p.createdAt).toLocaleString('en-KE')}"\n`;
      });
      break;
      
    case 'monthly_transfers':
      // CSV header
      csv = 'No.,Parcel Number,Previous Owner,Previous Owner ID,New Owner,New Owner ID,Transfer Type,Status,Amount,Location,Size (Acres),Date\n';
      
      // CSV rows
      data.forEach((t, idx) => {
        csv += `${idx + 1},`;
        csv += `"${t.landParcel?.parcelNumber || 'N/A'}",`;
        csv += `"${t.previousOwner?.fullName || 'N/A'}",`;
        csv += `"${t.previousOwner?.nationalId || 'N/A'}",`;
        csv += `"${t.newOwner?.fullName || 'N/A'}",`;
        csv += `"${t.newOwner?.nationalId || 'N/A'}",`;
        csv += `"${t.transferType || 'N/A'}",`;
        csv += `"${t.status || 'pending'}",`;
        csv += `${t.transferAmount || 0},`;
        csv += `"${t.landParcel?.location?.county || 'N/A'}",`;
        csv += `${t.landParcel?.sizeInAcres || 0},`;
        csv += `"${new Date(t.createdAt).toLocaleString('en-KE')}"\n`;
      });
      break;
      
    case 'user_activity':
      // CSV header
      csv = 'No.,Action,User,Role,Date\n';
      
      // CSV rows
      data.forEach((item, idx) => {
        csv += `${idx + 1},`;
        csv += `"${item.action}",`;
        csv += `"${item.user}",`;
        csv += `"${item.role}",`;
        csv += `"${item.date}"\n`;
      });
      break;
      
    case 'verification_statistics':
      // CSV header
      csv = 'No.,Action,Performed By,Role,Entity Type,Date\n';
      
      // CSV rows
      data.forEach((item, idx) => {
        csv += `${idx + 1},`;
        csv += `"${item.action || 'N/A'}",`;
        csv += `"${item.performedBy?.fullName || 'System'}",`;
        csv += `"${item.performedBy?.role || 'N/A'}",`;
        csv += `"${item.targetModel || 'N/A'}",`;
        csv += `"${new Date(item.createdAt).toLocaleString('en-KE')}"\n`;
      });
      break;
      
    case 'pending_requests':
      // CSV header
      csv = 'No.,Parcel Number,Location,Previous Owner,New Owner,Type,Days Pending,Submitted Date\n';
      
      // CSV rows
      data.forEach((item, idx) => {
        csv += `${idx + 1},`;
        csv += `"${item.parcelNumber}",`;
        csv += `"${item.location}",`;
        csv += `"${item.previousOwner}",`;
        csv += `"${item.newOwner}",`;
        csv += `"${item.type}",`;
        csv += `${item.daysPending},`;
        csv += `"${item.date}"\n`;
      });
      break;
      
    case 'system_audit':
      // CSV header  
      csv = 'No.,Action,Actor,Role,IP Address,Target Entity,Date\n';
      
      // CSV rows
      data.forEach((item, idx) => {
        csv += `${idx + 1},`;
        csv += `"${item.action || 'N/A'}",`;
        csv += `"${item.performedBy?.fullName || 'System'}",`;
        csv += `"${item.performedBy?.role || 'N/A'}",`;
        csv += `"${item.ipAddress || 'N/A'}",`;
        csv += `"${item.targetModel || 'N/A'}",`;
        csv += `"${new Date(item.createdAt).toLocaleString('en-KE')}"\n`;
      });
      break;
      
    default:
      csv = 'No data available';
  }
  
  return csv;
}

// Helper function to generate PDF content with tables using PDFKit
function generatePDFContent(title, content, options = {}) {
  const PDFDocument = require('pdfkit');
  const { startDate, endDate, generatedBy, summary } = options;
  
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ 
        size: 'A4',
        layout: 'landscape', // Use landscape for better table width
        margins: { top: 40, bottom: 40, left: 40, right: 40 }
      });
      
      const chunks = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);
      
      const pageWidth = doc.page.width - 80; // Account for margins
      
      // Header
      doc.fontSize(14).font('Helvetica-Bold')
         .text('REPUBLIC OF KENYA', { align: 'center' });
      doc.fontSize(12).text('MINISTRY OF LANDS & PHYSICAL PLANNING', { align: 'center' });
      doc.moveDown(0.5);
      
      // Title
      doc.fontSize(11).font('Helvetica-Bold')
         .text(title, { align: 'center' });
      doc.moveDown(0.5);
      
      // Metadata in smaller font
      doc.fontSize(8).font('Helvetica');
      const dateStr = startDate ? new Date(startDate).toLocaleDateString('en-KE') : new Date().toLocaleDateString('en-KE');
      const endDateStr = endDate && new Date(startDate).toDateString() !== new Date(endDate).toDateString() 
        ? ' to ' + new Date(endDate).toLocaleDateString('en-KE') : '';
      
      doc.text(`Report Date: ${dateStr}${endDateStr} | Generated: ${new Date().toLocaleString('en-KE')} | Officer: ${generatedBy || 'System'}`);
      if (summary) doc.text(summary);
      doc.moveDown(0.3);
      
      // Add line separator
      doc.moveTo(40, doc.y).lineTo(doc.page.width - 40, doc.y).stroke();
      doc.moveDown(0.5);
      
      // Parse and render content as structured tables
      const lines = content.split('\\n');
      let inTable = false;
      let isHeaderRow = false;
      
      doc.fontSize(8).font('Helvetica');
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Check if we need a new page
        if (doc.y > doc.page.height - 100) {
          doc.addPage();
          doc.fontSize(8).font('Helvetica');
        }
        
        // Detect section headers (ALL CAPS with colons or "SECTION")
        if (line.includes('SECTION') || (line === line.toUpperCase() && line.includes(':'))) {
          doc.fontSize(9).font('Helvetica-Bold');
          doc.text(line, { continued: false });
          doc.fontSize(8).font('Helvetica');
          doc.moveDown(0.3);
          continue;
        }
        
        // Detect table headers (lines with "No." at start)
        if (line.trim().startsWith('No.') && line.includes('Parcel')) {
          doc.fontSize(7).font('Helvetica-Bold');
          doc.text(line, { continued: false });
          doc.fontSize(7).font('Helvetica');
          isHeaderRow = true;
          inTable = true;
          continue;
        }
        
        // Detect separator lines (dashes)
        if (line.trim().match(/^[\-=_]{10,}$/)) {
          doc.moveTo(40, doc.y).lineTo(doc.page.width - 40, doc.y).stroke();
          doc.moveDown(0.2);
          continue;
        }
        
        // Detect data rows (start with number)
        if (line.trim().match(/^\d+\s+/)) {
          // Main data row - use slightly larger font
          doc.fontSize(7).font('Helvetica');
          doc.text(line, { continued: false });
          doc.moveDown(0.1);
          continue;
        }
        
        // Detect sub-information rows (indented with spaces)
        if (line.trim().length > 0 && line.startsWith('     ')) {
          doc.fontSize(6.5).font('Helvetica');
          doc.fillColor('#555555');
          doc.text(line.trim(), { indent: 20, continued: false });
          doc.fillColor('#000000');
          doc.moveDown(0.1);
          continue;
        }
        
        // Regular text
        if (line.trim().length > 0) {
          doc.fontSize(8).font('Helvetica');
          doc.text(line, { continued: false });
          doc.moveDown(0.2);
        } else {
          doc.moveDown(0.3);
        }
      }
      
      // Add footer to current page
      doc.fontSize(6).font('Helvetica')
         .text('This is an official document from Kenya Land Registry System', 
               40, doc.page.height - 30, { align: 'center', width: doc.page.width - 80 });
      
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

// Generate Report
exports.generateReport = async (req, res, next) => {
  try {
    const { type, startDate, endDate, format } = req.body;
    
    // Validate format - only allow CSV or Excel
    if (format && format !== 'csv' && format !== 'excel') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid format. Only CSV and Excel formats are supported.'
      });
    }
    
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
        
      case 'verification_statistics':
        const verifications = await AuditLog.find({
          createdAt: { $gte: start, $lte: end },
          action: { $in: ['VERIFICATION_PERFORMED', 'DEED_VERIFIED', 'DOCUMENT_VERIFIED'] }
        }).populate('performedBy', 'fullName role').sort({ createdAt: -1 });
        
        reportData = verifications;
        reportContent = `Total Verifications: ${verifications.length}\\n\\n`;
        verifications.forEach((log, idx) => {
          reportContent += `${idx + 1}. ${log.action}\\n`;
          reportContent += `   By: ${log.performedBy?.fullName || 'System'} (${log.performedBy?.role || 'N/A'})\\n`;
          reportContent += `   Entity: ${log.targetModel || 'N/A'}\\n`;
          reportContent += `   Date: ${new Date(log.createdAt).toLocaleString('en-KE')}\\n\\n`;
        });
        break;
        
      case 'system_audit':
        const systemAudits = await AuditLog.find({
          createdAt: { $gte: start, $lte: end }
        }).populate('performedBy', 'fullName role').sort({ createdAt: -1 }).limit(500);
        
        reportData = systemAudits;
        reportContent = `Total Audit Entries: ${systemAudits.length}\\n\\n`;
        systemAudits.forEach((log, idx) => {
          reportContent += `${idx + 1}. ${log.action}\\n`;
          reportContent += `   By: ${log.performedBy?.fullName || 'System'} (${log.performedBy?.role || 'N/A'})\\n`;
          reportContent += `   IP: ${log.ipAddress || 'N/A'}\\n`;
          reportContent += `   Entity: ${log.targetModel || 'N/A'}\\n`;
          reportContent += `   Date: ${new Date(log.createdAt).toLocaleString('en-KE')}\\n\\n`;
        });
        break;
        
      default:
        reportContent = 'Report type not implemented yet.';
    }
    
    // Generate output based on format
    const reportTitle = (type || 'Registry').replace(/_/g, ' ').toUpperCase();
    let fileContent;
    let contentType;
    let fileExtension;
    
    if (format === 'excel' || !format) {
      // Generate CSV for Excel (Excel can open CSV files)
      fileContent = generateCSV(type, reportData);
      contentType = 'text/csv';
      fileExtension = 'csv';
    } else if (format === 'csv') {
      // Generate CSV
      fileContent = generateCSV(type, reportData);
      contentType = 'text/csv';
      fileExtension = 'csv';
    } else {
      // Fallback to CSV if unknown format
      fileContent = generateCSV(type, reportData);
      contentType = 'text/csv';
      fileExtension = 'csv';
    }
    
    // Save report to database
    const reportRecord = await Report.create({
      name: `${reportTitle} - ${new Date(startDate).toLocaleDateString('en-KE')} to ${new Date(endDate).toLocaleDateString('en-KE')}`,
      type,
      format: format || 'csv',
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      generatedBy: req.user._id,
      fileSize: Buffer.isBuffer(fileContent) ? fileContent.length : Buffer.byteLength(fileContent),
      recordCount: reportData.length,
      status: 'completed',
      metadata: {
        reportType: type,
        dateRange: `${startDate} to ${endDate}`
      }
    });

    // Send file
    const reportName = `${reportTitle.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.${fileExtension}`;
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${reportName}"`);
    res.send(fileContent);
    
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

// Get Detailed Data for Tables
exports.getDetailedData = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);
    
    // Fetch today's registrations with owner details
    const todayRegistrations = await LandParcel.find({
      createdAt: { $gte: today, $lte: endOfDay }
    })
    .populate('currentOwner', 'fullName nationalId phoneNumber')
    .sort({ createdAt: -1 })
    .limit(50);
    
    // Fetch today's transfers with all details
    const todayTransfers = await Transfer.find({
      createdAt: { $gte: today, $lte: endOfDay }
    })
    .populate('landParcel', 'parcelNumber location')
    .populate('previousOwner', 'fullName nationalId phoneNumber')
    .populate('newOwner', 'fullName nationalId phoneNumber')
    .sort({ createdAt: -1 })
    .limit(50);
    
    // Fetch today's verifications
    const todayVerifications = await AuditLog.find({
      createdAt: { $gte: today, $lte: endOfDay },
      action: { $in: ['VERIFICATION_PERFORMED', 'DEED_VERIFIED', 'DOCUMENT_VERIFIED'] }
    })
    .populate('performedBy', 'fullName role')
    .sort({ createdAt: -1 })
    .limit(50);
    
    res.status(200).json({
      status: 'success',
      data: {
        registrations: todayRegistrations,
        transfers: todayTransfers,
        verifications: todayVerifications
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get Analytics Data for Charts
exports.getAnalytics = async (req, res, next) => {
  try {
    // Get date range for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);
    
    // Get transfers by type
    const transfersByType = await Transfer.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: '$transferType',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const transfersTypeMap = {};
    transfersByType.forEach(item => {
      transfersTypeMap[item._id || 'sale'] = item.count;
    });
    
    // Get transfers by status
    const transfersByStatus = await Transfer.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const transfersStatusMap = {};
    transfersByStatus.forEach(item => {
      transfersStatusMap[item._id || 'pending'] = item.count;
    });
    
    // Get registrations over last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);
    
    const registrationsOverTime = await LandParcel.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    // Format registrations data
    const registrationsData = registrationsOverTime.map(item => ({
      date: new Date(item._id).toLocaleDateString('en-KE', { weekday: 'short' }),
      count: item.count
    }));
    
    // Fill in missing days with 0
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayName = date.toLocaleDateString('en-KE', { weekday: 'short' });
      const existingData = registrationsData.find(d => d.date === dayName);
      last7Days.push({
        date: dayName,
        count: existingData ? existingData.count : 0
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        transfersByType: transfersTypeMap,
        transfersByStatus: transfersStatusMap,
        registrationsOverTime: last7Days
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
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
    
    const pdfContent = await generatePDFContent(report.name.toUpperCase(), reportContent, {
      startDate: report.startDate,
      endDate: report.endDate,
      generatedBy: report.generatedBy?.fullName || 'System'
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${report.name.replace(/\s+/g, '_')}.pdf`);
    res.send(pdfContent);
  } catch (error) {
    next(error);
  }
};

// Quick Report Download
exports.downloadQuickReport = async (req, res, next) => {
  try {
    const { type } = req.params;
    const filename = type === 'monthly' ? 'Monthly_Registry_Summary.pdf' : 'County_Land_Revenue.pdf';
    const reportTitle = type === 'monthly' ? 'MONTHLY REGISTRY SUMMARY' : 'COUNTY LAND REVENUE REPORT';
    
    // Fetch relevant detailed data based on report type
    let reportContent = '';
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    if (type === 'monthly') {
      // Get actual monthly parcels with details
      const monthlyParcels = await LandParcel.find({
        createdAt: { $gte: startOfMonth }
      })
      .populate('currentOwner', 'fullName nationalId phoneNumber')
      .sort({ createdAt: -1 })
      .limit(100);
      
      const monthlyTransfers = await Transfer.find({
        createdAt: { $gte: startOfMonth }
      })
      .populate('landParcel', 'parcelNumber')
      .populate('previousOwner', 'fullName')
      .populate('newOwner', 'fullName')
      .sort({ createdAt: -1 })
      .limit(100);
      
      reportContent = `MONTHLY SUMMARY (${new Date().toLocaleDateString('en-KE', { month: 'long', year: 'numeric' })})\\n\\n`;
      reportContent += `PARCELS REGISTERED THIS MONTH: ${monthlyParcels.length}\\n\\n`;
      
      if (monthlyParcels.length > 0) {
        reportContent += String('No.').padEnd(5);
        reportContent += String('Parcel Number').padEnd(20);
        reportContent += String('Owner Name').padEnd(25);
        reportContent += String('National ID').padEnd(12);
        reportContent += String('County').padEnd(15);
        reportContent += String('Size').padEnd(10);
        reportContent += `\\n${'-'.repeat(95)}\\n`;
        
        monthlyParcels.forEach((p, idx) => {
          reportContent += String(idx + 1).padEnd(5);
          reportContent += String(p.parcelNumber || 'N/A').substring(0, 19).padEnd(20);
          reportContent += String(p.currentOwner?.fullName || 'N/A').substring(0, 24).padEnd(25);
          reportContent += String(p.currentOwner?.nationalId || 'N/A').padEnd(12);
          reportContent += String(p.location?.county || 'N/A').substring(0, 14).padEnd(15);
          reportContent += String((p.sizeInAcres || 0) + ' ac').padEnd(10);
          reportContent += `\\n`;
        });
      }
      
      reportContent += `\\n\\nTRANSFERS THIS MONTH: ${monthlyTransfers.length}\\n\\n`;
      
      if (monthlyTransfers.length > 0) {
        reportContent += String('No.').padEnd(5);
        reportContent += String('Parcel').padEnd(20);
        reportContent += String('From Owner').padEnd(22);
        reportContent += String('To Owner').padEnd(22);
        reportContent += String('Status').padEnd(12);
        reportContent += `\\n${'-'.repeat(95)}\\n`;
        
        monthlyTransfers.forEach((t, idx) => {
          reportContent += String(idx + 1).padEnd(5);
          reportContent += String(t.landParcel?.parcelNumber || 'N/A').substring(0, 19).padEnd(20);
          reportContent += String(t.previousOwner?.fullName || 'N/A').substring(0, 21).padEnd(22);
          reportContent += String(t.newOwner?.fullName || 'N/A').substring(0, 21).padEnd(22);
          reportContent += String(t.status || 'pending').substring(0, 11).padEnd(12);
          reportContent += `\\n`;
        });
      }
      
    } else if (type === 'revenue') {
      // Get all transfers with amounts
      const allTransfers = await Transfer.find()
        .populate('landParcel', 'parcelNumber location')
        .populate('previousOwner', 'fullName')
        .populate('newOwner', 'fullName')
        .sort({ createdAt: -1 })
        .limit(100);
      
      const totalRevenue = allTransfers.reduce((sum, t) => sum + (t.transferAmount || 0), 0);
      const approvedTransfers = allTransfers.filter(t => t.status === 'approved');
      const approvedRevenue = approvedTransfers.reduce((sum, t) => sum + (t.transferAmount || 0), 0);
      
      reportContent = `LAND REVENUE REPORT\\n\\n`;
      reportContent += `Total Transfers: ${allTransfers.length}\\n`;
      reportContent += `Approved Transfers: ${approvedTransfers.length}\\n`;
      reportContent += `Total Revenue: KSh ${totalRevenue.toLocaleString()}\\n`;
      reportContent += `Approved Revenue: KSh ${approvedRevenue.toLocaleString()}\\n\\n`;
      
      reportContent += `RECENT TRANSFERS:\\n\\n`;
      reportContent += String('No.').padEnd(5);
      reportContent += String('Parcel').padEnd(18);
      reportContent += String('From').padEnd(18);
      reportContent += String('To').padEnd(18);
      reportContent += String('Amount').padEnd(15);
      reportContent += String('Status').padEnd(12);
      reportContent += `\\n${'-'.repeat(95)}\\n`;
      
      allTransfers.slice(0, 50).forEach((t, idx) => {
        reportContent += String(idx + 1).padEnd(5);
        reportContent += String(t.landParcel?.parcelNumber || 'N/A').substring(0, 17).padEnd(18);
        reportContent += String(t.previousOwner?.fullName || 'N/A').substring(0, 17).padEnd(18);
        reportContent += String(t.newOwner?.fullName || 'N/A').substring(0, 17).padEnd(18);
        reportContent += String('KSh ' + (t.transferAmount || 0).toLocaleString()).substring(0, 14).padEnd(15);
        reportContent += String(t.status || 'pending').substring(0, 11).padEnd(12);
        reportContent += `\\n`;
      });
    }
    
    const pdfContent = await generatePDFContent(reportTitle, reportContent, {
      startDate: type === 'monthly' ? startOfMonth : null,
      endDate: today,
      generatedBy: req.user?.fullName || 'System Administrator'
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.send(pdfContent);
  } catch (error) {
    next(error);
  }
};
