const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const { generateToken, generateRefreshToken, verifyRefreshToken, generateRandomToken, hashToken } = require('../utils/tokenGenerator');
const emailService = require('../utils/emailService');
const { logger } = require('../utils/logger');

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { fullName, email, phoneNumber, nationalId, password, role, physicalAddress } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { nationalId }]
    });

    let user;
    let isUpgradingPlaceholder = false;

    if (existingUser) {
      // If it's a placeholder user with matching National ID, upgrade it
      if (existingUser.nationalId === nationalId && existingUser.isPlaceholder) {
        // Upgrade the placeholder user to a real user
        existingUser.fullName = fullName;
        existingUser.email = email;
        existingUser.phoneNumber = phoneNumber;
        existingUser.password = password;
        existingUser.role = role || existingUser.role || 'Land_Owner';
        existingUser.physicalAddress = physicalAddress;
        existingUser.isPlaceholder = false;
        existingUser.isActive = true;
        
        await existingUser.save();
        user = existingUser;
        isUpgradingPlaceholder = true;

        // Log placeholder upgrade
        await AuditLog.log({
          user: user._id,
          action: 'PLACEHOLDER_UPGRADED',
          entityType: 'User',
          entityId: user._id,
          description: `Placeholder user upgraded to real user: ${user.email}`,
          ipAddress: req.ip,
          userAgent: req.get('user-agent')
        });

        // Create notification for the user about their land parcels
        const LandParcel = require('../models/LandParcel');
        const parcelCount = await LandParcel.countDocuments({ currentOwner: user._id });
        
        if (parcelCount > 0) {
          await AuditLog.log({
            user: user._id,
            action: 'PARCEL_ASSIGNED',
            entityType: 'User',
            entityId: user._id,
            description: `Welcome! You have ${parcelCount} land parcel(s) registered under your National ID ${nationalId}. Your account has been activated and you can now access your land records.`,
            ipAddress: req.ip,
            userAgent: req.get('user-agent')
          });
        }
      } else {
        // Real user already exists with this email or National ID
        return res.status(400).json({
          status: 'error',
          message: existingUser.email === email 
            ? 'Email already registered' 
            : 'National ID already registered'
        });
      }
    } else {
      // Create new user
      user = await User.create({
        fullName,
        email,
        phoneNumber,
        nationalId,
        password,
        role: role || 'Land_Owner',
        physicalAddress
      });

      // Log registration
      await AuditLog.log({
        user: user._id,
        action: 'USER_CREATED',
        entityType: 'User',
        entityId: user._id,
        description: `User registered: ${user.email}`,
        ipAddress: req.ip,
        userAgent: req.get('user-agent')
      });
    }

    // Generate email verification token
    const verificationToken = generateRandomToken();
    user.emailVerificationToken = hashToken(verificationToken);
    await user.save();

    // Send verification email
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
    await emailService.sendVerificationEmail(user.email, user.fullName, verificationUrl);

    // Generate tokens
    const accessToken = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.status(201).json({
      status: 'success',
      message: isUpgradingPlaceholder 
        ? 'Registration successful! Your land parcels are now linked to your account.' 
        : 'Registration successful. Please check your email to verify your account.',
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.role
        },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    logger.error(`Registration error: ${error.message}`);
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, nationalId, password } = req.body;

    // Build query to find user by email OR national ID
    const query = email 
      ? { email } 
      : nationalId 
        ? { nationalId } 
        : null;

    if (!query) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email or national ID'
      });
    }

    // Find user and include password field
    const user = await User.findOne(query).select('+password');

    console.log('=== LOGIN DEBUG ===');
    console.log('Login attempt for:', email || nationalId);

    if (!user) {
      console.log('User not found');
      // Log failed login attempt
      await AuditLog.log({
        user: null,
        action: 'LOGIN_FAILED',
        description: `Failed login attempt for ${email ? 'email: ' + email : 'National ID: ' + nationalId}`,
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
        severity: 'warning'
      });

      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    console.log('User found:', user._id, user.email);
    console.log('Password from login form:', password);
    console.log('Hashed password in DB:', user.password);

    // Check if account is locked
    if (user.isAccountLocked()) {
      console.log('Account is locked');
      return res.status(403).json({
        status: 'error',
        message: 'Account is temporarily locked due to multiple failed login attempts. Please try again later.'
      });
    }

    // Check password
    const isPasswordCorrect = await user.comparePassword(password);
    console.log('Password comparison result:', isPasswordCorrect);

    if (!isPasswordCorrect) {
      // Increment failed login attempts
      await user.incrementLoginAttempts();

      // Log failed login
      await AuditLog.log({
        user: user._id,
        action: 'LOGIN_FAILED',
        description: 'Failed login attempt - incorrect password',
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
        severity: 'warning'
      });

      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        status: 'error',
        message: 'Your account has been deactivated. Please contact administrator.'
      });
    }

    // Reset failed login attempts
    await user.resetLoginAttempts();

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const accessToken = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Log successful login
    await AuditLog.log({
      user: user._id,
      action: 'LOGIN',
      description: 'User logged in successfully',
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.role,
          isEmailVerified: user.isEmailVerified
        },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/v1/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  try {
    // Log logout
    await AuditLog.log({
      user: req.user._id,
      action: 'LOGOUT',
      description: 'User logged out',
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.status(200).json({
      status: 'success',
      message: 'Logout successful'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh access token
// @route   POST /api/v1/auth/refresh-token
// @access  Public
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        status: 'error',
        message: 'Refresh token is required'
      });
    }

    const decoded = verifyRefreshToken(refreshToken);

    if (!decoded) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid or expired refresh token'
      });
    }

    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      return res.status(401).json({
        status: 'error',
        message: 'User not found or inactive'
      });
    }

    const newAccessToken = generateToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    res.status(200).json({
      status: 'success',
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/v1/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'No user found with that email'
      });
    }

    // Generate reset token
    const resetToken = generateRandomToken();
    user.passwordResetToken = hashToken(resetToken);
    user.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    // Send reset email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    await emailService.sendPasswordResetEmail(user.email, user.fullName, resetUrl);

    res.status(200).json({
      status: 'success',
      message: 'Password reset link sent to your email'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   POST /api/v1/auth/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = hashToken(token);

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid or expired reset token'
      });
    }

    // Set new password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // Log password reset
    await AuditLog.log({
      user: user._id,
      action: 'PASSWORD_RESET',
      description: 'Password reset successfully',
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.status(200).json({
      status: 'success',
      message: 'Password reset successful'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   POST /api/v1/auth/change-password
// @access  Private
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide both current and new password'
      });
    }

    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    console.log('=== PASSWORD CHANGE DEBUG ===');
    console.log('User ID:', user._id);
    console.log('User email:', user.email);
    console.log('Current password from form:', currentPassword);
    console.log('New password from form:', newPassword);
    console.log('Current hashed password in DB:', user.password);

    const isMatch = await user.comparePassword(currentPassword);
    console.log('Current password matches:', isMatch);

    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Current password is incorrect'
      });
    }

    user.password = newPassword;
    console.log('Before save - password field:', user.password);
    console.log('Is password modified?', user.isModified('password'));
    
    await user.save();
    
    console.log('After save - password was saved');
    
    // Verify the password was saved by fetching user again
    const savedUser = await User.findById(user._id).select('+password');
    console.log('New hashed password in DB:', savedUser.password);
    console.log('Can verify with new password:', await savedUser.comparePassword(newPassword));
    console.log('=== END PASSWORD CHANGE DEBUG ===');

    // Log password change
    try {
      await AuditLog.create({
        action: 'PASSWORD_CHANGED',
        performedBy: user._id,
        entityType: 'User',
        entityId: user._id,
        details: {
          message: 'Password changed successfully',
          timestamp: new Date()
        },
        ipAddress: req.ip
      });
    } catch (logError) {
      console.error('Failed to create audit log:', logError);
      // Continue even if audit log fails
    }

    res.status(200).json({
      status: 'success',
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    next(error);
  }
};

// @desc    Verify email
// @route   GET /api/v1/auth/verify-email/:token
// @access  Public
exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    const hashedToken = hashToken(token);

    const user = await User.findOne({ emailVerificationToken: hashedToken });

    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid verification token'
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Email verified successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('ownedParcels');

    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};
