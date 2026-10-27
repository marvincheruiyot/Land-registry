const Document = require('../models/Document');
const Notification = require('../models/Notification');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Upload Document
exports.uploadDocument = async (req, res, next) => {
  try {
    const { documentType, description, landParcelId, uploadedFor, parcelNumber } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        status: 'error',
        message: 'Please upload a file'
      });
    }

    // For officer uploading for owner (after transfer), landParcelId is optional
    // For regular uploads, landParcelId is required
    if (!uploadedFor && !landParcelId) {
      return res.status(400).json({
        status: 'error',
        message: 'Please select a land parcel'
      });
    }

    // Create document data
    const docData = {
      documentType: documentType || 'other',
      fileName: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      fileSize: file.size,
      filePath: file.path,
      checksum: crypto.randomBytes(16).toString('hex'),
      uploadedBy: req.user._id,
      description: description || (parcelNumber ? `Title deed for parcel ${parcelNumber}` : '')
    };

    // If officer is uploading for a specific owner
    if (uploadedFor) {
      docData.uploadedFor = uploadedFor;
      
      // If a parcel is also specified, link to parcel, otherwise link to user
      if (landParcelId) {
        docData.relatedEntity = {
          entityType: 'LandParcel',
          entityId: landParcelId
        };
      } else {
        docData.relatedEntity = {
          entityType: 'User',
          entityId: uploadedFor
        };
      }
    } else {
      // Regular upload - related to land parcel
      docData.relatedEntity = {
        entityType: 'LandParcel',
        entityId: landParcelId
      };
    }

    const doc = await Document.create(docData);

    // Populate for response
    await doc.populate('uploadedBy', 'fullName email');
    if (doc.uploadedFor) {
      await doc.populate('uploadedFor', 'fullName email nationalId');
    }

    // NOTIFICATION CREATION BASED ON UPLOAD TYPE
    
    // Case 1: Officer uploads document FOR a land owner (e.g., title deed after transfer)
    if (uploadedFor && req.user.role === 'Land_Officer') {
      // Notify the owner that a document was uploaded for them
      await Notification.create({
        recipient: uploadedFor,
        type: 'DOCUMENT_UPLOADED',
        title: 'New Document Uploaded',
        message: `A ${documentType || 'document'} has been uploaded to your account by Officer ${req.user.fullName}. ${description ? 'Note: ' + description : ''}`,
        relatedEntity: {
          entityType: 'Document',
          entityId: doc._id
        },
        priority: 'high'
      });

      // Notify all administrators about officer's upload
      const admins = await User.find({ role: 'Administrator', isActive: true });
      const adminNotifications = admins.map(admin =>
        Notification.create({
          recipient: admin._id,
          type: 'DOCUMENT_UPLOADED',
          title: 'Officer Uploaded Document',
          message: `Officer ${req.user.fullName} uploaded a ${documentType || 'document'} for ${doc.uploadedFor?.fullName || 'land owner'}. ${parcelNumber ? 'Parcel: ' + parcelNumber : ''}`,
          relatedEntity: {
            entityType: 'Document',
            entityId: doc._id
          },
          priority: 'medium'
        })
      );
      await Promise.all(adminNotifications);
    }
    
    // Case 2: Land Owner uploads document (needs review by officers/admins)
    else if (req.user.role === 'Land_Owner') {
      // Notify all administrators and officers for review
      const reviewers = await User.find({
        role: { $in: ['Administrator', 'Land_Officer'] },
        isActive: true
      });

      const reviewNotifications = reviewers.map(reviewer =>
        Notification.create({
          recipient: reviewer._id,
          type: 'DOCUMENT_UPLOADED',
          title: 'New Document Awaiting Review',
          message: `${req.user.fullName} (ID: ${req.user.nationalId}) uploaded a ${documentType || 'document'}. ${parcelNumber ? 'Parcel: ' + parcelNumber : ''} Please review and verify the document.`,
          relatedEntity: {
            entityType: 'Document',
            entityId: doc._id
          },
          priority: 'high'
        })
      );
      await Promise.all(reviewNotifications);

      // Notify the uploader (owner) for confirmation
      await Notification.create({
        recipient: req.user._id,
        type: 'DOCUMENT_UPLOADED',
        title: 'Document Uploaded Successfully',
        message: `Your ${documentType || 'document'} has been uploaded successfully and is pending verification by land officers. You will be notified once it has been reviewed.`,
        relatedEntity: {
          entityType: 'Document',
          entityId: doc._id
        },
        priority: 'medium'
      });
    }

    res.status(201).json({
      status: 'success',
      data: { document: doc },
      message: uploadedFor 
        ? 'Title deed uploaded successfully for the owner' 
        : 'Document uploaded successfully and will be reviewed by administrators and officers'
    });
  } catch (error) {
    next(error);
  }
};

// Get Documents
exports.getDocuments = async (req, res, next) => {
  try {
    const query = {};
    
    // Land Owners see:
    // 1. Documents they uploaded themselves
    // 2. Documents uploaded FOR them by officers (uploadedFor field)
    // 3. Documents they transferred away (metadata.transferredFrom field)
    if (req.user?.role === 'Land_Owner') {
      query.$or = [
        { uploadedBy: req.user._id },
        { uploadedFor: req.user._id },
        { 'metadata.transferredFrom': req.user._id } // Show transferred documents
      ];
    }
    // Admins and Officers see all documents

    const documents = await Document.find(query)
      .populate('uploadedBy', 'fullName email nationalId')
      .populate('uploadedFor', 'fullName email nationalId')
      .sort({ createdAt: -1 });

    // Manually populate relatedEntity for LandParcel types
    const LandParcel = require('../models/LandParcel');
    
    const formattedDocuments = await Promise.all(documents.map(async (doc) => {
      const baseDoc = {
        _id: doc._id,
        documentName: doc.originalName,
        documentType: doc.documentType,
        fileName: doc.fileName,
        fileSize: doc.fileSize,
        fileUrl: doc.filePath ? `/uploads/${doc.fileName}` : null,
        uploadedBy: doc.uploadedBy,
        uploadedFor: doc.uploadedFor,
        verificationStatus: doc.verificationStatus || 'pending',
        description: doc.description,
        metadata: doc.metadata, // Include metadata for transfer info
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
        relatedEntity: doc.relatedEntity
      };

      // Manually fetch and populate landParcel if it's a LandParcel entity
      if (doc.relatedEntity?.entityType === 'LandParcel' && doc.relatedEntity.entityId) {
        try {
          const parcel = await LandParcel.findById(doc.relatedEntity.entityId)
            .select('parcelNumber location currentOwner titleDeedNumber')
            .lean();
          baseDoc.landParcel = parcel;
        } catch (err) {
          console.error('Error populating landParcel:', err);
          baseDoc.landParcel = null;
        }
      } else {
        baseDoc.landParcel = null;
      }

      return baseDoc;
    }));

    res.status(200).json({
      status: 'success',
      data: { documents: formattedDocuments }
    });
  } catch (error) {
    next(error);
  }
};

// Get Single Document Details
exports.getDocument = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({
        status: 'error',
        message: 'Document not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { document }
    });
  } catch (error) {
    next(error);
  }
};

// Download Document
exports.downloadDocument = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({
        status: 'error',
        message: 'Document not found'
      });
    }

    if (fs.existsSync(document.filePath)) {
      return res.download(document.filePath, document.originalName);
    }

    // If file isn't on disk (demo / mock file), return a dynamic PDF buffer
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${document.originalName}`);
    res.send(Buffer.from('%PDF-1.4 Mock Land Registry Certified Document Content'));
  } catch (error) {
    next(error);
  }
};

// View Document (display inline in browser)
exports.viewDocument = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({
        status: 'error',
        message: 'Document not found'
      });
    }

    // If file exists on disk, serve it
    if (fs.existsSync(document.filePath)) {
      res.setHeader('Content-Type', document.mimeType || 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${document.originalName}"`);
      const fileStream = fs.createReadStream(document.filePath);
      return fileStream.pipe(res);
    }

    // If file doesn't exist (demo), return a mock PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${document.originalName}"`);
    res.send(Buffer.from('%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources 4 0 R /MediaBox [0 0 612 792] /Contents 5 0 R >>\nendobj\n4 0 obj\n<< /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >>\nendobj\n5 0 obj\n<< /Length 200 >>\nstream\nBT\n/F1 18 Tf\n50 750 Td\n(Ministry of Lands Document) Tj\n0 -30 Td\n/F1 12 Tf\n(Document Name: ' + document.originalName + ') Tj\n0 -20 Td\n(Type: ' + document.documentType + ') Tj\n0 -20 Td\n(Uploaded: ' + new Date(document.createdAt).toLocaleDateString() + ') Tj\nET\nendstream\nendobj\nxref\n0 6\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\n0000000214 00000 n\n0000000309 00000 n\ntrailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n560\n%%EOF'));
  } catch (error) {
    next(error);
  }
};

// Delete Document
exports.deleteDocument = async (req, res, next) => {
  try {
    await Document.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: 'success',
      message: 'Document deleted'
    });
  } catch (error) {
    next(error);
  }
};

// Verify Document (mark as verified)
exports.verifyDocument = async (req, res, next) => {
  try {
    const { status, rejectionReason } = req.body; // Can be 'verified' or 'rejected'
    
    const document = await Document.findById(req.params.id)
      .populate('uploadedBy', 'fullName nationalId')
      .populate('uploadedFor', 'fullName nationalId');

    if (!document) {
      return res.status(404).json({
        status: 'error',
        message: 'Document not found'
      });
    }

    const verificationStatus = status || 'verified';
    document.verificationStatus = verificationStatus;
    
    // Store rejection reason if rejected
    if (verificationStatus === 'rejected' && rejectionReason) {
      document.rejectionReason = rejectionReason;
    }
    
    await document.save();

    // NOTIFY DOCUMENT OWNER about verification status change
    const documentOwner = document.uploadedFor || document.uploadedBy;
    
    if (verificationStatus === 'verified') {
      // Notify owner: Document APPROVED
      await Notification.create({
        recipient: documentOwner._id,
        type: 'SYSTEM_ALERT',
        title: 'Document Verified ✓',
        message: `Your ${document.documentType || 'document'} "${document.originalName}" has been verified and approved by ${req.user.fullName}. The document is now officially recognized.`,
        relatedEntity: {
          entityType: 'Document',
          entityId: document._id
        },
        priority: 'high'
      });
    } else if (verificationStatus === 'rejected') {
      // Notify owner: Document REJECTED
      await Notification.create({
        recipient: documentOwner._id,
        type: 'SYSTEM_ALERT',
        title: 'Document Rejected',
        message: `Your ${document.documentType || 'document'} "${document.originalName}" was rejected by ${req.user.fullName}. Reason: ${rejectionReason || 'Not specified'}. Please contact the land registry office for more information or to resubmit.`,
        relatedEntity: {
          entityType: 'Document',
          entityId: document._id
        },
        priority: 'high'
      });
    }

    // Notify all admins about the verification action
    const admins = await User.find({ role: 'Administrator', isActive: true });
    const adminNotifications = admins.map(admin =>
      Notification.create({
        recipient: admin._id,
        type: 'VERIFICATION_PERFORMED',
        title: `Document ${verificationStatus === 'verified' ? 'Verified' : 'Rejected'}`,
        message: `Officer ${req.user.fullName} ${verificationStatus === 'verified' ? 'verified' : 'rejected'} ${document.documentType || 'document'} for ${documentOwner.fullName} (ID: ${documentOwner.nationalId}).${verificationStatus === 'rejected' && rejectionReason ? ' Reason: ' + rejectionReason : ''}`,
        relatedEntity: {
          entityType: 'Document',
          entityId: document._id
        },
        priority: 'low'
      })
    );
    await Promise.all(adminNotifications);

    res.status(200).json({
      status: 'success',
      data: { document },
      message: `Document ${verificationStatus} successfully`
    });
  } catch (error) {
    next(error);
  }
};
