require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Holding = require('./models/Holding');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    let testUser = await User.findOne({ email: 'test@example.com' });

    if (!testUser) {
      testUser = new User({
        email: 'test@example.com',
        passwordHash: 'mock_hash_for_testing',
        country: 'India',
        phone: '1234567890'
      });
      await testUser.save();
      console.log('Test user created!');
    } else {
      console.log('Test user already exists.');
    }


    const holdingCount = await Holding.countDocuments({ userId: testUser._id });
    if (holdingCount === 0) {
      await Holding.insertMany([
        { userId: testUser._id, symbol: 'BTC', name: 'Bitcoin', qty: 0.5, avgPrice: 60000 },
        { userId: testUser._id, symbol: 'ETH', name: 'Ethereum', qty: 2, avgPrice: 3000 },
        { userId: testUser._id, symbol: 'SOL', name: 'Solana', qty: 10, avgPrice: 100 }
      ]);
      console.log('Sample holdings seeded!');
    } else {
      console.log('Holdings already exist for test user.');
    }

    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seed();
