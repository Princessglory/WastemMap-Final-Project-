const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function createAdminUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@wastemap.com' });
    if (existingAdmin) {
      console.log('⚠️ Admin user already exists:', existingAdmin.email);
      process.exit();
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    const adminUser = await User.create({
      name: 'WasteMap Admin',
      email: 'admin@wastemap.com',
      password: hashedPassword,
      role: 'admin',
      phone: '+1234567890',
      address: {
        street: 'Admin Headquarters',
        city: 'Nairobi',
        state: 'Nairobi',
        zipCode: '00100'
      }
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@wastemap.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Role: admin');
    
    process.exit();
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

createAdminUser();
