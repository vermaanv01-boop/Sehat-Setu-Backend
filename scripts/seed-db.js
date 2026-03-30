const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: 'c:/Users/Lenovo/OneDrive/Desktop/sehatSetu/sehat-setu-backend/.env' });
const User = require('../models/User');

async function seedAdmin() {
  try {
    console.log('Connecting to MongoDB: ' + process.env.MONGO_URI.split('@')[1]); // Log host part for security
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Fast fail
    });
    console.log('Connected to MongoDB successfully');

    const adminEmail = 'admin@example.com';
    const adminPassword = 'password123';

    let user = await User.findOne({ email: adminEmail });
    if (user) {
      console.log('Admin user already exists. Updating password...');
      user.password = adminPassword;
      await user.save();
      console.log('Admin password reset successfully.');
    } else {
      console.log('Creating new Admin user...');
      user = await User.create({
        name: 'SehatSetu Administrator',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        facilityName: 'SehatSetu HQ',
        location: {
          type: 'Point',
          coordinates: [77.2090, 28.6139] // New Delhi
        }
      });
      console.log('Admin user created successfully.');
    }

    // Creating a Health worker and doctor too for testing
    const users = [
      {
        name: 'PHC Worker',
        email: 'phc@sehatsetu.com',
        password: 'password123',
        role: 'healthcare_worker',
        facilityName: 'Rural PHC Sector 1',
      },
      {
        name: 'Urban Doctor',
        email: 'doctor@sehatsetu.com',
        password: 'password123',
        role: 'doctor',
        facilityName: 'City Hospital',
        specialization: 'Cardiology'
      }
    ];

    for (const uData of users) {
      let existingByEmail = await User.findOne({ email: uData.email });
      let existingByName = await User.findOne({ name: uData.name });
      
      if (!existingByEmail && !existingByName) {
        await User.create(uData);
        console.log(`Created user: ${uData.email}`);
      } else if (existingByEmail) {
        console.log(`User with email already exists: ${uData.email}`);
      } else {
        console.log(`User with name already exists: ${uData.name}. Skipping...`);
      }
    }

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error during seeding:', err.message);
    if (err.name === 'MongooseServerSelectionError') {
      console.error('CRITICAL: Could not select a server. Check your IP whitelist in MongoDB Atlas.');
    }
    process.exit(1);
  }
}

seedAdmin();
