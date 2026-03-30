const mongoose = require('mongoose');
require('dotenv').config({ path: 'c:/Users/Lenovo/OneDrive/Desktop/sehatSetu/sehat-setu-backend/.env' });
const User = require('c:/Users/Lenovo/OneDrive/Desktop/sehatSetu/sehat-setu-backend/models/User');

async function listUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const users = await User.find({}, 'name email role facilityName');
    console.log('Users in database:');
    console.log(JSON.stringify(users, null, 2));
    
    mongoose.connection.close();
  } catch (err) {
    console.error('Error:', err);
  }
}

listUsers();
