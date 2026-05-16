const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.get('/all', async (req, res) => {
  try {
    const products = await Product.find().sort({ pid: 1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const search = req.query.search || '';

  try {
    // Build search query (Case-insensitive name search)
    const searchQuery = search 
      ? { name: { $regex: search, $options: 'i' } } 
      : {};

    const products = await Product.find(searchQuery)
      .sort({ pid: 1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(searchQuery);
    const hasMore = skip + products.length < total;
    
    res.json({
      products,
      total,
      hasMore,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
