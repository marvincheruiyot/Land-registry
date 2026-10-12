const User = require('../models/User');
const { logger } = require('./logger');

/**
 * Seed initial users (Administrator, Land Officer, Land Owner)
 * Called automatically when server starts up.
 */
const seedInitialUsers = async () => {
  try {
    const defaultUsers = [
      {
        fullName: 'System Administrator',
        email: 'admin@landregistry.go.ke',
        phoneNumber: '+254712345678',
        nationalId: '12345678',
        password: 'Password@123',
        role: 'Administrator',
        physicalAddress: 'Ardhi House, Ngong Road, Nairobi',
        isActive: true,
        isEmailVerified: true
      },
      {
        fullName: 'Jane Wambui (Officer)',
        email: 'officer@landregistry.go.ke',
        phoneNumber: '+254722123456',
        nationalId: '23456789',
        password: 'Password@123',
        role: 'Land_Officer',
        physicalAddress: 'Ministry of Lands - Nairobi County Bureau',
        isActive: true,
        isEmailVerified: true
      },
      {
        fullName: 'David Kiprop (Owner)',
        email: 'owner@landregistry.go.ke',
        phoneNumber: '+254733987654',
        nationalId: '34567890',
        password: 'Password@123',
        role: 'Land_Owner',
        physicalAddress: 'Kilimani, Nairobi',
        isActive: true,
        isEmailVerified: true
      }
    ];

    console.log('🌱 Checking default users database seed...');

    for (const userData of defaultUsers) {
      const existingUser = await User.findOne({
        $or: [
          { email: userData.email },
          { nationalId: userData.nationalId }
        ]
      });

      if (!existingUser) {
        await User.create(userData);
        console.log(`✅ Auto-created default ${userData.role}: ${userData.email}`);
      }
    }

    // Check and seed initial audit trail logs
    const AuditLog = require('../models/AuditLog');
    const logCount = await AuditLog.countDocuments();
    if (logCount === 0) {
      const admin = await User.findOne({ role: 'Administrator' });
      const officer = await User.findOne({ role: 'Land_Officer' });
      const owner = await User.findOne({ role: 'Land_Owner' });

      const sampleLogs = [
        {
          user: admin ? admin._id : null,
          action: 'LOGIN',
          entityType: 'User',
          description: 'Administrator authenticated successfully via secure session token',
          ipAddress: '197.232.88.14',
          severity: 'info',
          timestamp: new Date(Date.now() - 1000 * 60 * 15)
        },
        {
          user: officer ? officer._id : null,
          action: 'PARCEL_CREATED',
          entityType: 'LandParcel',
          description: 'Registered title deed DEED/NAI/2026/014 for parcel NAI/KIL/2026/044 in Nairobi County',
          ipAddress: '102.215.78.2',
          severity: 'info',
          timestamp: new Date(Date.now() - 1000 * 60 * 45)
        },
        {
          user: null,
          action: 'LOGIN_FAILED',
          entityType: 'User',
          description: 'Failed login attempt detected from unauthorized IP address',
          ipAddress: '41.90.18.23',
          severity: 'warning',
          timestamp: new Date(Date.now() - 1000 * 60 * 120)
        },
        {
          user: admin ? admin._id : null,
          action: 'TRANSFER_APPROVED',
          entityType: 'Transfer',
          description: 'Registrar executed conveyance approval for Deed NAI/KIL/2026/012 to David Kiprop',
          ipAddress: '197.232.88.14',
          severity: 'info',
          timestamp: new Date(Date.now() - 1000 * 60 * 180)
        },
        {
          user: admin ? admin._id : null,
          action: 'SYSTEM_CONFIG_CHANGED',
          entityType: 'System',
          description: 'Cryptographic ledger cold backup snapshot verified with SHA-256 integrity hash',
          ipAddress: '127.0.0.1',
          severity: 'info',
          timestamp: new Date(Date.now() - 1000 * 60 * 240)
        },
        {
          user: owner ? owner._id : null,
          action: 'VERIFICATION_PERFORMED',
          entityType: 'LandParcel',
          description: 'Public deed verification token validated against national cadastral seal',
          ipAddress: '105.160.42.19',
          severity: 'info',
          timestamp: new Date(Date.now() - 1000 * 60 * 360)
        }
      ];

      for (const log of sampleLogs) {
        await AuditLog.create(log);
      }
      console.log('🌱 Seeded initial audit trail logs');
    }

    logger.info('Default seed users and audit logs verified.');
  } catch (error) {
    logger.error(`Error during user/audit auto-seeding: ${error.message}`);
    console.error('⚠️ User seeding error:', error.message);
  }
};

module.exports = { seedInitialUsers };
