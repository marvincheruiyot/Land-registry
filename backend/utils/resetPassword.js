const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const resetUserPassword = async (email, newPassword) => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/land_registry_db');
    console.log('✅ Connected to MongoDB');

    // Import User model after connection
    const User = require('../models/User');

    // Find user
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.error('❌ User not found with email:', email);
      process.exit(1);
    }

    console.log('📋 Found user:', user.fullName, '(', user.email, ')');
    console.log('🔐 Old password hash:', user.password);

    // Hash the new password manually
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    console.log('🔐 New password hash:', hashedPassword);
    
    // Test if new password can be verified
    const canVerify = await bcrypt.compare(newPassword, hashedPassword);
    console.log('✅ Can verify new password:', canVerify);

    // Update password directly using updateOne to bypass middleware
    await User.updateOne(
      { _id: user._id },
      { $set: { password: hashedPassword } }
    );

    console.log('✅ Password updated successfully!');

    // Verify the password was saved
    const updatedUser = await User.findById(user._id).select('+password');
    console.log('🔐 Saved password hash:', updatedUser.password);
    
    // Test login
    const loginTest = await bcrypt.compare(newPassword, updatedUser.password);
    console.log('✅ Login test with new password:', loginTest ? 'SUCCESS' : 'FAILED');

    console.log('\n✅ Password has been reset successfully!');
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 New Password: ${newPassword}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

// Get email and password from command line arguments
const email = process.argv[2];
const newPassword = process.argv[3];

if (!email || !newPassword) {
  console.error('Usage: node resetPassword.js <email> <newPassword>');
  console.error('Example: node resetPassword.js joymaina20@gmail.com Blackcard123#');
  process.exit(1);
}

resetUserPassword(email, newPassword);
