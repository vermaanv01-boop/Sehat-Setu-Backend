const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: 'c:/Users/Lenovo/OneDrive/Desktop/sehatSetu/sehat-setu-backend/.env' });

const User = require('c:/Users/Lenovo/OneDrive/Desktop/sehatSetu/sehat-setu-backend/models/User');

const email = 'anushkaverma19892000@gmail.com';
const newPassword = 'password123'; // Temporary password for the user

async function resetPassword() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      process.exit(1);
    }

    console.log('User found, resetting password...');
    user.password = newPassword;
    await user.save();
    console.log('Password reset successfully to: ' + newPassword);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

resetPassword();
