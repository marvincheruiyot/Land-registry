const { body, param, query, validationResult } = require('express-validator');

// Validation middleware to check for errors
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};

// User validation rules
exports.userRegistrationRules = [
  body('fullName')
    .trim()
    .notEmpty().withMessage('Full name is required')
    .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('phoneNumber')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .matches(/^(\+254|0)[17]\d{8}$/).withMessage('Please provide a valid Kenyan phone number'),
  
  body('nationalId')
    .trim()
    .notEmpty().withMessage('National ID is required')
    .matches(/^\d{8}(\d{2})?$/).withMessage('Please provide a valid Kenyan National ID'),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/)
    .withMessage('Password must contain uppercase, lowercase, number and special character'),
  
  body('role')
    .optional()
    .isIn(['Land_Owner', 'Land_Officer', 'Administrator'])
    .withMessage('Invalid role')
];

exports.loginRules = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  
  body('password')
    .notEmpty().withMessage('Password is required')
];

// Land parcel validation rules
exports.landParcelRules = [
  body('parcelNumber')
    .trim()
    .notEmpty().withMessage('Parcel number is required')
    .toUpperCase(),
  
  body('location.county')
    .notEmpty().withMessage('County is required'),
  
  body('location.coordinates.latitude')
    .isFloat({ min: -4.68, max: 5.03 })
    .withMessage('Latitude must be within Kenya boundaries (-4.68 to 5.03)'),
  
  body('location.coordinates.longitude')
    .isFloat({ min: 33.89, max: 41.86 })
    .withMessage('Longitude must be within Kenya boundaries (33.89 to 41.86)'),
  
  body('sizeInAcres')
    .isFloat({ min: 0.01 })
    .withMessage('Size must be greater than 0'),
  
  body('currentOwner')
    .notEmpty().withMessage('Current owner is required')
    .isMongoId().withMessage('Invalid owner ID'),
  
  body('landUse')
    .optional()
    .isIn(['residential', 'commercial', 'agricultural', 'industrial', 'mixed', 'other'])
    .withMessage('Invalid land use type')
];

// Transfer validation rules
exports.transferRules = [
  body('landParcel')
    .notEmpty().withMessage('Land parcel is required')
    .isMongoId().withMessage('Invalid land parcel ID'),
  
  body('newOwner')
    .notEmpty().withMessage('New owner is required')
    .isMongoId().withMessage('Invalid new owner ID'),
  
  body('transferType')
    .notEmpty().withMessage('Transfer type is required')
    .isIn(['sale', 'gift', 'inheritance', 'subdivision', 'court_order', 'other'])
    .withMessage('Invalid transfer type'),
  
  body('transferAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Transfer amount cannot be negative')
];

// Verification validation rules
exports.verificationRules = [
  query('token')
    .optional()
    .trim()
    .notEmpty().withMessage('Verification token is required'),
  
  query('parcelNumber')
    .optional()
    .trim()
    .notEmpty().withMessage('Parcel number is required')
];

// Pagination validation rules
exports.paginationRules = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

// MongoDB ID validation rule
exports.mongoIdRule = param('id')
  .isMongoId()
  .withMessage('Invalid ID format');
