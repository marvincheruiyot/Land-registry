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

    logger.info('Default seed users verified.');
  } catch (error) {
    logger.error(`Error during user auto-seeding: ${error.message}`);
    console.error('⚠️ User seeding error:', error.message);
  }
};

module.exports = { seedInitialUsers };
