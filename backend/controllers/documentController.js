const Document = require('../models/Document');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Upload Document
exports.uploadDocument = async (req, res, next) => {
  try {
    const { documentType, description, landParcelId } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        status: 'error',
        message: 'Please upload a file'
      });
    }

    if (!landParcelId) {
      return res.status(400).json({
        status: 'error',
        message: 'Please select a land parcel'
      });
    }

    const doc = await Document.create({
      documentType: documentType || 'other',
      fileName: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      fileSize: file.size,
      filePath: file.path,
      checksum: crypto.randomBytes(16).toString('hex'),
      uploadedBy: req.user._id,
      relatedEntity: {
        entityType: 'LandParcel',
        entityId: landParcelId
      },
      description
    });

    // Populate for response
    await doc.populate('uploadedBy', 'fullName email');

    res.status(201).json({
      status: 'success',
      data: { document: doc },
      message: 'Document uploaded successfully and will be reviewed by administrators and officers'
    });
  } catch (error) {
    next(error);
  }
};

// Get Documents
exports.getDocuments = async (req, res, next) => {
  try {
    const query = {};
    
    // Land Owners only see their own documents
    if (req.user?.role === 'Land_Owner') {
      query.uploadedBy = req.user._id;
    }
    // Admins and Officers see all documents

    const documents = await Document.find(query)
      .populate('uploadedBy', 'fullName email')
      .populate({
        path: 'relatedEntity.entityId',
        select: 'parcelNumber location currentOwner'
      })
      .sort({ createdAt: -1 });

    // Return documents with proper structure for frontend
    const formattedDocuments = documents.map(doc => ({
      _id: doc._id,
      documentName: doc.originalName,
      documentType: doc.documentType,
      fileName: doc.fileName,
      fileSize: doc.fileSize,
      fileUrl: doc.filePath ? `/uploads/${doc.fileName}` : null,
      uploadedBy: doc.uploadedBy,
      landParcel: doc.relatedEntity?.entityType === 'LandParcel' ? doc.relatedEntity.entityId : null,
      verificationStatus: doc.verificationStatus || 'pending',
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
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
