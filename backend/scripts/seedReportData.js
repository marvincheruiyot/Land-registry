const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Import models
const User = require('../models/User');
const LandParcel = require('../models/LandParcel');
const Transfer = require('../models/Transfer');
const AuditLog = require('../models/AuditLog');

// Sample Kenyan names and locations
const kenyaCounties = [
  { county: 'Nairobi', subCounty: 'Westlands', ward: 'Parklands' },
  { county: 'Mombasa', subCounty: 'Mvita', ward: 'Mji Wa Kale/Makadara' },
  { county: 'Nakuru', subCounty: 'Nakuru Town West', ward: 'Kaptembwo' },
  { county: 'Kisumu', subCounty: 'Kisumu East', ward: 'Kajulu' },
  { county: 'Kiambu', subCounty: 'Kikuyu', ward: 'Kinoo' },
  { county: 'Eldoret', subCounty: 'Kesses', ward: 'Racecourse' },
  { county: 'Machakos', subCounty: 'Machakos Town', ward: 'Mua' },
  { county: 'Nyeri', subCounty: 'Nyeri Town', ward: 'Ruring\'u' }
];

const kenyaNames = [
  { fullName: 'John Kipchoge Muturi', nationalId: '12345678', phone: '+254712345678', email: 'jmuturi@example.com' },
  { fullName: 'Mary Wanjiru Kariuki', nationalId: '23456789', phone: '+254723456789', email: 'mwanjiru@example.com' },
  { fullName: 'Peter Omondi Otieno', nationalId: '34567890', phone: '+254734567890', email: 'potieno@example.com' },
  { fullName: 'Grace Achieng Odhiambo', nationalId: '45678901', phone: '+254745678901', email: 'gachieng@example.com' },
  { fullName: 'David Mwangi Kamau', nationalId: '56789012', phone: '+254756789012', email: 'dmwangi@example.com' },
  { fullName: 'Sarah Nyambura Njeri', nationalId: '67890123', phone: '+254767890123', email: 'snyambura@example.com' },
  { fullName: 'James Kimani Githinji', nationalId: '78901234', phone: '+254778901234', email: 'jkimani@example.com' },
  { fullName: 'Elizabeth Wambui Waithaka', nationalId: '89012345', phone: '+254789012345', email: 'ewambui@example.com' },
  { fullName: 'Joseph Otieno Okoth', nationalId: '90123456', phone: '+254790123456', email: 'jotieno@example.com' },
  { fullName: 'Catherine Njoki Maina', nationalId: '01234567', phone: '+254701234567', email: 'cnjoki@example.com' }
];

const landUses = ['Residential', 'Commercial', 'Agricultural', 'Mixed Use', 'Industrial'];
const transferTypes = ['sale', 'gift', 'inheritance', 'court_order'];

// Database Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected for Seeding');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};

// Create sample users
const createUsers = async () => {
  console.log('\n📝 Creating users...');
  
  const users = [];
  
  // Create Land Officer
  const officerPassword = await bcrypt.hash('officer123', 10);
  const officer = await User.create({
    fullName: 'Alice Wangari Kimathi',
    nationalId: '99999999',
    email: 'officer@landregistry.go.ke',
    phoneNumber: '+254700000000',
    password: officerPassword,
    role: 'Land_Officer',
    status: 'active'
  });
  users.push(officer);
  console.log('  ✓ Land Officer created');
  
  // Create Land Owners
  for (let i = 0; i < kenyaNames.length; i++) {
    const userPassword = await bcrypt.hash('password123', 10);
    const user = await User.create({
      fullName: kenyaNames[i].fullName,
      nationalId: kenyaNames[i].nationalId,
      email: kenyaNames[i].email,
      phoneNumber: kenyaNames[i].phone,
      password: userPassword,
      role: 'Land_Owner',
      status: 'active'
    });
    users.push(user);
  }
  console.log(`  ✓ ${kenyaNames.length} Land Owners created`);
  
  return users;
};

// Create sample parcels
const createParcels = async (users) => {
  console.log('\n📍 Creating land parcels...');
  
  const parcels = [];
  const today = new Date();
  
  // Create parcels registered today (5 parcels)
  for (let i = 0; i < 5; i++) {
    const location = kenyaCounties[i % kenyaCounties.length];
    const owner = users[i + 1]; // Skip officer
    
    const parcel = await LandParcel.create({
      parcelNumber: `KE/${location.county.substring(0, 3).toUpperCase()}/${today.getFullYear()}/${10000 + i}`,
      titleDeedNumber: `TD-${today.getFullYear()}-${10000 + i}`,
      location: {
        county: location.county,
        subCounty: location.subCounty,
        ward: location.ward,
        coordinates: {
          latitude: -1.286389 + (Math.random() * 3),
          longitude: 36.817223 + (Math.random() * 3)
        }
      },
      sizeInAcres: (Math.random() * 10 + 0.5).toFixed(2),
      landUse: landUses[Math.floor(Math.random() * landUses.length)],
      currentOwner: owner._id,
      ownershipHistory: [{
        owner: owner._id,
        transferDate: today,
        transferType: 'first_registration',
        verificationStatus: 'verified'
      }],
      status: 'active',
      createdAt: today // Today's registration
    });
    
    parcels.push(parcel);
  }
  console.log(`  ✓ ${parcels.length} parcels registered TODAY`);
  
  // Create older parcels (35 parcels)
  for (let i = 5; i < 40; i++) {
    const location = kenyaCounties[i % kenyaCounties.length];
    const owner = users[(i % (users.length - 1)) + 1]; // Skip officer
    
    // Random date within last 60 days
    const daysAgo = Math.floor(Math.random() * 60) + 1;
    const createdDate = new Date(today);
    createdDate.setDate(createdDate.getDate() - daysAgo);
    
    const parcel = await LandParcel.create({
      parcelNumber: `KE/${location.county.substring(0, 3).toUpperCase()}/${today.getFullYear()}/${20000 + i}`,
      titleDeedNumber: `TD-${today.getFullYear()}-${20000 + i}`,
      location: {
        county: location.county,
        subCounty: location.subCounty,
        ward: location.ward,
        coordinates: {
          latitude: -1.286389 + (Math.random() * 3),
          longitude: 36.817223 + (Math.random() * 3)
        }
      },
      sizeInAcres: (Math.random() * 10 + 0.5).toFixed(2),
      landUse: landUses[Math.floor(Math.random() * landUses.length)],
      currentOwner: owner._id,
      ownershipHistory: [{
        owner: owner._id,
        transferDate: createdDate,
        transferType: 'first_registration',
        verificationStatus: 'verified'
      }],
      status: 'active',
      createdAt: createdDate
    });
    
    parcels.push(parcel);
  }
  console.log(`  ✓ ${parcels.length} total parcels created`);
  
  return parcels;
};

// Create sample transfers
const createTransfers = async (users, parcels) => {
  console.log('\n🔄 Creating transfers...');
  
  const transfers = [];
  const today = new Date();
  
  // Create transfers initiated today (4 transfers)
  for (let i = 0; i < 4; i++) {
    const parcel = parcels[i + 5]; // Use older parcels
    const previousOwner = parcel.currentOwner;
    const newOwner = users[(i + 5) % (users.length - 1) + 1]; // Different owner
    
    const transfer = await Transfer.create({
      landParcel: parcel._id,
      previousOwner: previousOwner,
      newOwner: newOwner._id,
      transferType: transferTypes[i % transferTypes.length],
      transferAmount: transferTypes[i % transferTypes.length] === 'sale' ? Math.floor(Math.random() * 5000000) + 1000000 : undefined,
      status: 'pending',
      createdAt: today
    });
    
    transfers.push(transfer);
  }
  console.log(`  ✓ ${transfers.length} transfers initiated TODAY`);
  
  // Create older transfers (10 transfers with various statuses)
  for (let i = 4; i < 14; i++) {
    const parcel = parcels[i + 10];
    const previousOwner = parcel.currentOwner;
    const newOwner = users[(i + 3) % (users.length - 1) + 1];
    
    const daysAgo = Math.floor(Math.random() * 30) + 1;
    const createdDate = new Date(today);
    createdDate.setDate(createdDate.getDate() - daysAgo);
    
    const statuses = ['pending', 'approved', 'rejected'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    const transfer = await Transfer.create({
      landParcel: parcel._id,
      previousOwner: previousOwner,
      newOwner: newOwner._id,
      transferType: transferTypes[i % transferTypes.length],
      transferAmount: transferTypes[i % transferTypes.length] === 'sale' ? Math.floor(Math.random() * 5000000) + 1000000 : undefined,
      status: status,
      createdAt: createdDate
    });
    
    transfers.push(transfer);
  }
  console.log(`  ✓ ${transfers.length} total transfers created`);
  
  return transfers;
};

// Create audit logs for verifications
const createVerifications = async (users, parcels) => {
  console.log('\n✅ Creating verification audit logs...');
  
  const officer = users[0]; // Land officer
  const today = new Date();
  
  // Create verifications for today (7 verifications)
  for (let i = 0; i < 7; i++) {
    await AuditLog.create({
      action: ['VERIFICATION_PERFORMED', 'DEED_VERIFIED', 'DOCUMENT_VERIFIED'][i % 3],
      performedBy: officer._id,
      targetModel: 'LandParcel',
      targetId: parcels[i]._id,
      details: `Verification performed for parcel ${parcels[i].parcelNumber}`,
      ipAddress: '127.0.0.1',
      createdAt: today
    });
  }
  console.log('  ✓ 7 verifications logged TODAY');
  
  // Create older verifications
  for (let i = 7; i < 20; i++) {
    const daysAgo = Math.floor(Math.random() * 30) + 1;
    const createdDate = new Date(today);
    createdDate.setDate(createdDate.getDate() - daysAgo);
    
    await AuditLog.create({
      action: ['VERIFICATION_PERFORMED', 'DEED_VERIFIED', 'DOCUMENT_VERIFIED'][i % 3],
      performedBy: officer._id,
      targetModel: 'LandParcel',
      targetId: parcels[i]._id,
      details: `Verification performed for parcel ${parcels[i].parcelNumber}`,
      ipAddress: '127.0.0.1',
      createdAt: createdDate
    });
  }
  console.log('  ✓ 20 total verifications logged');
};

// Main seeding function
const seedDatabase = async () => {
  try {
    await connectDB();
    
    console.log('\n🗑️  Clearing existing data...');
    await User.deleteMany({ email: { $ne: 'admin@landregistry.go.ke' } }); // Keep admin
    await LandParcel.deleteMany({});
    await Transfer.deleteMany({});
    await AuditLog.deleteMany({});
    console.log('  ✓ Data cleared');
    
    const users = await createUsers();
    const parcels = await createParcels(users);
    const transfers = await createTransfers(users, parcels);
    await createVerifications(users, parcels);
    
    console.log('\n✅ DATABASE SEEDED SUCCESSFULLY!');
    console.log('\n📊 Summary:');
    console.log(`  • ${users.length} users created`);
    console.log(`  • ${parcels.length} land parcels (5 today)`);
    console.log(`  • ${transfers.length} transfers (4 today)`);
    console.log(`  • 20 verification logs (7 today)`);
    console.log('\n🔐 Login Credentials:');
    console.log('  Land Officer: officer@landregistry.go.ke / officer123');
    console.log('  Land Owners: Use any email from sample data / password123');
    console.log('\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
};

// Run seeding
seedDatabase();
