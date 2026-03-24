const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  category: String,
  imageUrl: String,
  createdAt: { type: Date, default: Date.now },
});

const Product = mongoose.model('Product', productSchema);

// Sample products data
const sampleProducts = [
  {
    name: "Laptop Pro X",
    description: "High-performance laptop for professionals with 16GB RAM, 512GB SSD",
    price: 1299.99,
    stock: 10,
    category: "Electronics"
  },
  {
    name: "Wireless Mouse",
    description: "Ergonomic wireless mouse with 2.4GHz connection",
    price: 29.99,
    stock: 50,
    category: "Accessories"
  },
  {
    name: "Mechanical Keyboard",
    description: "RGB mechanical gaming keyboard with blue switches",
    price: 89.99,
    stock: 30,
    category: "Accessories"
  },
  {
    name: "4K Monitor",
    description: "27-inch 4K UHD monitor with HDR support",
    price: 399.99,
    stock: 15,
    category: "Electronics"
  },
  {
    name: "Noise Cancelling Headphones",
    description: "Wireless noise cancelling headphones with 30hr battery",
    price: 199.99,
    stock: 25,
    category: "Audio"
  }
];

// Connect to MongoDB with retry logic
const connectWithRetry = async (retries = 5) => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://admin:password@mongodb:27017/productdb?authSource=admin';
  
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Connected to MongoDB');
      
      // Initialize products if none exist
      const count = await Product.countDocuments();
      if (count === 0) {
        console.log('No products found, inserting sample data...');
        await Product.insertMany(sampleProducts);
        console.log(`Inserted ${sampleProducts.length} sample products`);
      } else {
        console.log(`Found ${count} existing products`);
      }
      return;
    } catch (error) {
      console.error(`MongoDB connection attempt ${i + 1} failed:`, error.message);
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};

// Start connection
connectWithRetry().catch(console.error);

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'product-service', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    console.log(`Returning ${products.length} products`);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create product
app.post('/api/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(400).json({ error: error.message });
  }
});

// Update product stock
app.patch('/api/products/:id/stock', async (req, res) => {
  try {
    const { stock } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { stock },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(400).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Product Service running on port ${PORT}`);
});
