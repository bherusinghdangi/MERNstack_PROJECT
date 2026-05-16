require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Clear existing data
    await Product.deleteMany({});
    
    const products = [];
    const baseDate = new Date('2026-01-01T00:00:00Z');

    for (let i = 1; i <= 100; i++) {
      products.push({
        pid: i,
        name: `Product ${i}`,
        price: Math.floor(Math.random() * 100) + 10,
        description: `This is the description for Product ${i}. It is a high-quality item.`,
        image: `https://picsum.photos/seed/${i}/300/200`,
        rating: Math.floor(Math.random() * 5) + 1,
        reviewCount: Math.floor(Math.random() * 100) + 1,
        createdAt: new Date(baseDate.getTime() + (i * 60000)) // 1 minute apart
      });
    }

    await Product.insertMany(products);
    console.log('Database re-seeded with pid (1 to 100)!');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedProducts();
