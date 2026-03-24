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
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  category: { type: String, required: true },
  brand: String,
  rating: { type: Number, default: 4.5 },
  createdAt: { type: Date, default: Date.now },
});

const Product = mongoose.model('Product', productSchema);

// 20 Products
const allProducts = [
  { name: "MacBook Pro 14-inch", description: "Apple M3 Pro chip with 12-core CPU, 18-core GPU", price: 1999.99, stock: 15, category: "Electronics", brand: "Apple", rating: 4.8 },
  { name: "Dell XPS 15", description: "15.6-inch 3.5K OLED, Intel Core i7, 32GB RAM", price: 1899.99, stock: 12, category: "Electronics", brand: "Dell", rating: 4.7 },
  { name: "Samsung Galaxy S24 Ultra", description: "6.8-inch Dynamic AMOLED, 200MP camera", price: 1299.99, stock: 25, category: "Electronics", brand: "Samsung", rating: 4.9 },
  { name: "iPad Pro 12.9-inch", description: "M2 chip, Liquid Retina XDR display", price: 1099.99, stock: 20, category: "Electronics", brand: "Apple", rating: 4.8 },
  { name: "Sony WH-1000XM5", description: "Industry-leading noise cancellation, 30-hour battery", price: 349.99, stock: 40, category: "Audio", brand: "Sony", rating: 4.9 },
  { name: "Logitech MX Master 3S", description: "Advanced wireless mouse, 8K DPI", price: 99.99, stock: 50, category: "Accessories", brand: "Logitech", rating: 4.7 },
  { name: "Keychron Q1 Pro", description: "Wireless mechanical keyboard, aluminum frame", price: 199.99, stock: 35, category: "Accessories", brand: "Keychron", rating: 4.8 },
  { name: "Anker 737 Power Bank", description: "24,000mAh, 140W fast charging", price: 89.99, stock: 60, category: "Accessories", brand: "Anker", rating: 4.6 },
  { name: "Samsung T7 Shield SSD", description: "1TB Portable SSD, IP65 water resistant", price: 119.99, stock: 45, category: "Accessories", brand: "Samsung", rating: 4.7 },
  { name: "Bose QuietComfort 45", description: "Wireless noise cancelling headphones", price: 329.99, stock: 28, category: "Audio", brand: "Bose", rating: 4.7 },
  { name: "Apple AirPods Pro 2", description: "Active Noise Cancellation, Adaptive Audio", price: 249.99, stock: 55, category: "Audio", brand: "Apple", rating: 4.8 },
  { name: "JBL Flip 6", description: "Portable Bluetooth speaker, waterproof", price: 129.99, stock: 42, category: "Audio", brand: "JBL", rating: 4.5 },
  { name: "Apple Watch Series 9", description: "GPS, 45mm, always-on retina display", price: 429.99, stock: 38, category: "Wearables", brand: "Apple", rating: 4.8 },
  { name: "Samsung Galaxy Watch 6", description: "40mm Bluetooth, sleep tracking", price: 299.99, stock: 32, category: "Wearables", brand: "Samsung", rating: 4.6 },
  { name: "Garmin Fenix 7X", description: "Solar charging, multisport GPS watch", price: 799.99, stock: 20, category: "Wearables", brand: "Garmin", rating: 4.9 },
  { name: "Sony PlayStation 5", description: "Digital Edition, 825GB SSD, 4K gaming", price: 449.99, stock: 18, category: "Gaming", brand: "Sony", rating: 4.9 },
  { name: "Xbox Series X", description: "1TB SSD, 4K gaming, quick resume", price: 499.99, stock: 22, category: "Gaming", brand: "Microsoft", rating: 4.8 },
  { name: "Nintendo Switch OLED", description: "7-inch OLED screen, 64GB storage", price: 349.99, stock: 30, category: "Gaming", brand: "Nintendo", rating: 4.7 },
  { name: "Razer Blade 15", description: "Gaming laptop, Intel i7, RTX 4070", price: 2499.99, stock: 10, category: "Gaming", brand: "Razer", rating: 4.8 },
  { name: "Elgato Stream Deck MK.2", description: "15 customizable LCD keys", price: 149.99, stock: 30, category: "Accessories", brand: "Elgato", rating: 4.8 }
];

// MongoDB connection with retry
let retries = 5;
const connectWithRetry = async () => {
  const mongoURI = 'mongodb://admin:password@mongodb:27017/productdb?authSource=admin';
  
  while (retries) {
    try {
      await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
      });
      console.log('✅ Connected to MongoDB');
      
      // Initialize products
      const count = await Product.countDocuments();
      if (count === 0) {
        console.log('📦 Inserting 20 sample products...');
        await Product.insertMany(allProducts);
        console.log(`✅ Inserted ${allProducts.length} products`);
      } else {
        console.log(`📊 Found ${count} existing products`);
      }
      return true;
    } catch (err) {
      console.error(`❌ MongoDB connection failed (${retries} attempts left):`, err.message);
      retries -= 1;
      if (retries === 0) return false;
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  return false;
};

// Routes
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ 
    status: 'OK', 
    service: 'product-service',
    database: dbStatus,
    products: dbStatus === 'connected' ? 'available' : 'unavailable'
  });
});

app.get('/api/products', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected' });
    }
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
    res.status(500).json({ error: error.message });
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
    res.status(400).json({ error: error.message });
  }
});

// Start server
connectWithRetry().then(connected => {
  if (connected) {
    app.listen(PORT, () => {
      console.log(`🚀 Product Service running on port ${PORT}`);
      console.log(`📋 Test with: curl http://localhost:${PORT}/api/products`);
    });
  } else {
    console.error('Failed to connect to MongoDB after retries. Exiting...');
    process.exit(1);
  }
});
