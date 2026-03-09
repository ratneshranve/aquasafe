const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Engineer = require('./models/Engineer');
const SensorData = require('./models/SensorData');
const Alert = require('./models/Alert');
const Report = require('./models/Report');

const seedDB = async () => {
  try {
    console.log('URI:', process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Engineer.deleteMany();
    await SensorData.deleteMany();
    await Alert.deleteMany();
    await Report.deleteMany();
    console.log('Existing data cleared.');

    const defaultPassword = await bcrypt.hash('password123', 10);

    // Seed Users (Citizens)
    const users = [
      {
        name: 'Rahul Sharma',
        email: 'rahul@example.com',
        password: defaultPassword,
        phone: '9876543210',
        meterId: 'METER-101',
        zone: 'Z-1',
        tank: 'T-1',
        ward: 'W-1'
      },
      {
        name: 'Priya Verma',
        email: 'priya@example.com',
        password: defaultPassword,
        phone: '9876543211',
        meterId: 'METER-102',
        zone: 'Z-2',
        tank: 'T-2',
        ward: 'W-2'
      },
      {
        name: 'Amit Patel',
        email: 'amit@example.com',
        password: defaultPassword,
        phone: '9876543212',
        meterId: 'METER-103',
        zone: 'Z-1',
        tank: 'T-1',
        ward: 'W-2'
      }
    ];

    await User.insertMany(users);
    console.log('Seed: Users added');

    // Seed Engineers
    const engineers = [
      {
        name: 'Suresh Kumar (Engineer)',
        email: 'suresh@aquasafe.com',
        password: defaultPassword,
        phone: '1122334455',
        zone: 'Z-1'
      },
      {
        name: 'Vikram Singh (Engineer)',
        email: 'vikram@aquasafe.com',
        password: defaultPassword,
        phone: '2233445566',
        zone: 'Z-2'
      }
    ];

    await Engineer.insertMany(engineers);
    console.log('Seed: Engineers added');

    console.log('\n--- Seed Info ---');
    console.log('Admin (Hardcoded): admin@aquasafe.com / admin123');
    console.log('Users: rahul@example.com, priya@example.com, amit@example.com / password123');
    console.log('Engineers: suresh@aquasafe.com, vikram@aquasafe.com / password123');
    
    console.log('\nDatabase seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error with data seeding:', error);
    process.exit(1);
  }
};

seedDB();
