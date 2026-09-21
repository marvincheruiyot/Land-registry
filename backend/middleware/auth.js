const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authorized to access this route. Please login.'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({
          status: 'error',
          message: 'User no longer exists'
        });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(403).json({
          status: 'error',
          message: 'Your account has been deactivated. Please contact administrator.'
        });
      }

      // Check if account is locked
      if (user.isAccountLocked()) {
        return res.status(403).json({
          status: 'error',
          message: 'Your account is temporarily locked due to multiple failed login attempts. Please try again later.'
        });
      }

      // Attach user to request
      req.user = user;
      req.token = token;

      next();
    } catch (err) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid or expired token. Please login again.'
      });
    }
  } catch (error) {
    next(error);
  }
};

// Authorize specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      // Log unauthorized access attempt
      AuditLog.log({
        user: req.user._id,
        action: 'SUSPICIOUS_ACTIVITY',
        description: `Unauthorized access attempt to ${req.originalUrl}`,
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
        severity: 'warning',
        metadata: {
          requiredRoles: roles,
          userRole: req.user.role
        }
      });

      return res.status(403).json({
        status: 'error',
        message: `User role '${req.user.role}' is not authorized to access this resource`
      });
    }
    next();
  };
};

// Optional authentication (for public routes with enhanced features for authenticated users)
exports.optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        
        if (user && user.isActive) {
          req.user = user;
        }
      } catch (err) {
        // Invalid token, but continue as unauthenticated user
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};
