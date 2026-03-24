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

// Sample products
const sampleProducts = [
  { name: "Laptop Pro X", description: "High-performance laptop", price: 1299.99, stock: 10, category: "Electronics" },
  { name: "Wireless Mouse", description: "Ergonomic wireless mouse", price: 29.99, stock: 50, category: "Accessories" },
  { name: "Mechanical Keyboard", description: "RGB gaming keyboard", price: 89.99, stock: 30, category: "Accessories" },
  { name: "4K Monitor", description: "27-inch 4K UHD monitor", price: 399.99, stock: 15, category: "Electronics" },
  { name: "Noise Cancelling Headphones", description: "Wireless headphones", price: 199.99, stock: 25, category: "Audio" }
];

// MongoDB connection function
async function connectToMongoDB() {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://admin:password@mongodb:27017/productdb?authSource=admin&directConnection=true';
  
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ Connected to MongoDB');
    
    // Check if products exist
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log('📦 No products found, inserting sample data...');
      await Product.insertMany(sampleProducts);
      console.log(`✅ Inserted ${sampleProducts.length} sample products`);
    } else {
      console.log(`📊 Found ${count} existing products`);
    }
    
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    return false;
  }
}

// Routes
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ 
    status: 'OK', 
    service: 'product-service',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    console.log(`📦 Returning ${products.length} products`);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: error.message });
  }
});

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

// Start server
async function startServer() {
  const dbConnected = await connectToMongoDB();
  
  if (!dbConnected) {
    console.error('Failed to connect to MongoDB. Exiting...');
    process.exit(1);
  }
  
  app.listen(PORT, () => {
    console.log(`🚀 Product Service running on port ${PORT}`);
    console.log(`📋 API endpoints:`);
    console.log(`   GET    /api/products - Get all products`);
    console.log(`   GET    /api/products/:id - Get product by ID`);
    console.log(`   POST   /api/products - Create product`);
    console.log(`   PATCH  /api/products/:id/stock - Update stock`);
    console.log(`   GET    /health - Health check`);
  });
}

startServer().catch(console.error);
