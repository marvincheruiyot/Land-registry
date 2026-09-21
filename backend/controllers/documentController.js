const Document = require('../models/Document');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Upload Document
exports.uploadDocument = async (req, res, next) => {
  try {
    const { documentType, description } = req.body;
    const file = req.file;

    const doc = await Document.create({
      documentType: documentType || 'other',
      fileName: file ? file.filename : `doc-${Date.now()}.pdf`,
      originalName: file ? file.originalname : 'Document.pdf',
      mimeType: file ? file.mimetype : 'application/pdf',
      fileSize: file ? file.size : 1024,
      filePath: file ? file.path : 'uploads/default.pdf',
      checksum: crypto.randomBytes(16).toString('hex'),
      uploadedBy: req.user._id,
      relatedEntity: {
        entityType: 'User',
        entityId: req.user._id
      },
      description
    });

    res.status(201).json({
      status: 'success',
      data: { document: doc },
      message: 'Document uploaded and registered in vault'
    });
  } catch (error) {
    next(error);
  }
};

// Get Documents
exports.getDocuments = async (req, res, next) => {
  try {
    const query = {};
    if (req.user?.role === 'Land_Owner') {
      query.uploadedBy = req.user._id;
    }

    const documents = await Document.find(query)
      .populate('uploadedBy', 'fullName email')
      .sort({ createdAt: -1 });

    const formatted = documents.map(d => ({
      id: d._id,
      name: d.originalName,
      type: d.documentType,
      uploadDate: d.createdAt ? new Date(d.createdAt).toLocaleDateString() : 'Recent'
    }));

    res.status(200).json({
      status: 'success',
      data: { documents: formatted }
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
