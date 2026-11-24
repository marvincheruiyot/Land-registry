require('dotenv').config();
const mongoose = require('mongoose');
const LandParcel = require('../models/LandParcel');
const User = require('../models/User');

const getParcelOwner = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to database');

    const parcelNumber = 'HT/47689/756';
    
    // Find the parcel
    const parcel = await LandParcel.findOne({ parcelNumber }).populate('currentOwner');
    
    if (!parcel) {
      console.log(`❌ Parcel ${parcelNumber} not found`);
      process.exit(1);
    }

    console.log('\n✅ Parcel Found:');
    console.log('=====================================');
    console.log(`Parcel Number: ${parcel.parcelNumber}`);
    console.log(`Title Deed Number: ${parcel.titleDeedNumber}`);
    console.log(`Size: ${parcel.sizeInAcres} acres`);
    console.log(`Location: ${parcel.location.county}`);
    console.log(`Status: ${parcel.status}`);
    
    if (parcel.currentOwner) {
      console.log('\n👤 Owner Information:');
      console.log('=====================================');
      console.log(`Name: ${parcel.currentOwner.fullName}`);
      console.log(`National ID: ${parcel.currentOwner.nationalId}`);
      console.log(`Email: ${parcel.currentOwner.email}`);
      console.log(`Role: ${parcel.currentOwner.role}`);
      
      console.log('\n📋 Testing URL for Postman:');
      console.log('=====================================');
      console.log(`GET http://localhost:5000/api/v1/verify/owner-id/${parcel.currentOwner.nationalId}`);
      
    } else {
      console.log('\n❌ No owner found for this parcel');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

getParcelOwner();
