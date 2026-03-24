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
  imageUrl: String,
  rating: { type: Number, default: 4.5 },
  brand: String,
  createdAt: { type: Date, default: Date.now },
});

const Product = mongoose.model('Product', productSchema);

// 20 Diverse Products
const sampleProducts = [
  // Electronics
  {
    name: "MacBook Pro 14-inch",
    description: "Apple M3 Pro chip with 12-core CPU, 18-core GPU, 18GB unified memory, 512GB SSD storage",
    price: 1999.99,
    stock: 15,
    category: "Electronics",
    brand: "Apple",
    rating: 4.8
  },
  {
    name: "Dell XPS 15",
    description: "15.6-inch 3.5K OLED display, Intel Core i7-13700H, 32GB RAM, 1TB SSD, NVIDIA RTX 4070",
    price: 1899.99,
    stock: 12,
    category: "Electronics",
    brand: "Dell",
    rating: 4.7
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    description: "6.8-inch Dynamic AMOLED, 200MP camera, S Pen included, 12GB RAM, 256GB storage",
    price: 1299.99,
    stock: 25,
    category: "Electronics",
    brand: "Samsung",
    rating: 4.9
  },
  {
    name: "iPad Pro 12.9-inch",
    description: "M2 chip, Liquid Retina XDR display, 256GB storage, Wi-Fi + Cellular",
    price: 1099.99,
    stock: 20,
    category: "Electronics",
    brand: "Apple",
    rating: 4.8
  },
  {
    name: "Sony WH-1000XM5",
    description: "Industry-leading noise cancellation, 30-hour battery life, premium sound quality",
    price: 349.99,
    stock: 40,
    category: "Electronics",
    brand: "Sony",
    rating: 4.9
  },
  
  // Accessories
  {
    name: "Logitech MX Master 3S",
    description: "Advanced wireless mouse, 8K DPI, quiet clicks, ergonomic design",
    price: 99.99,
    stock: 50,
    category: "Accessories",
    brand: "Logitech",
    rating: 4.7
  },
  {
    name: "Keychron Q1 Pro",
    description: "Wireless mechanical keyboard, aluminum frame, hot-swappable, RGB backlight",
    price: 199.99,
    stock: 35,
    category: "Accessories",
    brand: "Keychron",
    rating: 4.8
  },
  {
    name: "Anker 737 Power Bank",
    description: "24,000mAh, 140W fast charging, smart digital display",
    price: 89.99,
    stock: 60,
    category: "Accessories",
    brand: "Anker",
    rating: 4.6
  },
  {
    name: "Samsung T7 Shield SSD",
    description: "1TB Portable SSD, IP65 water resistant, up to 1050MB/s",
    price: 119.99,
    stock: 45,
    category: "Accessories",
    brand: "Samsung",
    rating: 4.7
  },
  {
    name: "Elgato Stream Deck MK.2",
    description: "15 customizable LCD keys, programmable macros, streaming control",
    price: 149.99,
    stock: 30,
    category: "Accessories",
    brand: "Elgato",
    rating: 4.8
  },
  
  // Audio
  {
    name: "Bose QuietComfort 45",
    description: "Wireless noise cancelling headphones, 24-hour battery, comfortable design",
    price: 329.99,
    stock: 28,
    category: "Audio",
    brand: "Bose",
    rating: 4.7
  },
  {
    name: "Apple AirPods Pro 2",
    description: "Active Noise Cancellation, Adaptive Audio, USB-C charging",
    price: 249.99,
    stock: 55,
    category: "Audio",
    brand: "Apple",
    rating: 4.8
  },
  {
    name: "JBL Flip 6",
    description: "Portable Bluetooth speaker, waterproof, 12 hours playtime",
    price: 129.99,
    stock: 42,
    category: "Audio",
    brand: "JBL",
    rating: 4.5
  },
  {
    name: "Sennheiser HD 660S2",
    description: "Open-back audiophile headphones, high-resolution sound",
    price: 499.99,
    stock: 15,
    category: "Audio",
    brand: "Sennheiser",
    rating: 4.9
  },
  
  // Wearables
  {
    name: "Apple Watch Series 9",
    description: "GPS, 45mm, always-on retina display, fitness tracking",
    price: 429.99,
    stock: 38,
    category: "Wearables",
    brand: "Apple",
    rating: 4.8
  },
  {
    name: "Samsung Galaxy Watch 6",
    description: "40mm Bluetooth, sleep tracking, advanced health monitoring",
    price: 299.99,
    stock: 32,
    category: "Wearables",
    brand: "Samsung",
    rating: 4.6
  },
  {
    name: "Garmin Fenix 7X",
    description: "Solar charging, multisport GPS watch, sapphire edition",
    price: 799.99,
    stock: 20,
    category: "Wearables",
    brand: "Garmin",
    rating: 4.9
  },
  {
    name: "Whoop 4.0",
    description: "Fitness tracker, 24/7 health monitoring, strain coach",
    price: 299.99,
    stock: 45,
    category: "Wearables",
    brand: "Whoop",
    rating: 4.5
  },
  
  // Gaming
  {
    name: "Sony PlayStation 5",
    description: "Digital Edition, 825GB SSD, 4K gaming, DualSense controller",
    price: 449.99,
    stock: 18,
    category: "Gaming",
    brand: "Sony",
    rating: 4.9
  },
  {
    name: "Xbox Series X",
    description: "1TB SSD, 4K gaming, quick resume, Game Pass included",
    price: 499.99,
    stock: 22,
    category: "Gaming",
    brand: "Microsoft",
    rating: 4.8
  },
  {
    name: "Nintendo Switch OLED",
    description: "7-inch OLED screen, 64GB storage, enhanced audio",
    price: 349.99,
    stock: 30,
    category: "Gaming",
    brand: "Nintendo",
    rating: 4.7
  },
  {
    name: "Razer Blade 15",
    description: "Gaming laptop, Intel i7, RTX 4070, 16GB RAM, 1TB SSD",
    price: 2499.99,
    stock: 10,
    category: "Gaming",
    brand: "Razer",
    rating: 4.8
  }
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
      console.log('📦 No products found, inserting 20 sample products...');
      await Product.insertMany(sampleProducts);
      console.log(`✅ Inserted ${sampleProducts.length} sample products across multiple categories`);
      
      // Log categories
      const categories = [...new Set(sampleProducts.map(p => p.category))];
      console.log(`📊 Categories available: ${categories.join(', ')}`);
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

// Get all products with optional category filter
app.get('/api/products', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, sort } = req.query;
    let query = {};
    
    // Apply filters
    if (category && category !== 'all') {
      query.category = category;
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    let productsQuery = Product.find(query);
    
    // Apply sorting
    if (sort === 'price_asc') {
      productsQuery = productsQuery.sort({ price: 1 });
    } else if (sort === 'price_desc') {
      productsQuery = productsQuery.sort({ price: -1 });
    } else if (sort === 'rating') {
      productsQuery = productsQuery.sort({ rating: -1 });
    } else {
      productsQuery = productsQuery.sort({ createdAt: -1 });
    }
    
    const products = await productsQuery;
    console.log(`📦 Returning ${products.length} products`);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get product categories
app.get('/api/products/categories', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
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

// Search products
app.get('/api/products/search/:query', async (req, res) => {
  try {
    const searchTerm = req.params.query;
    const products = await Product.find({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
        { brand: { $regex: searchTerm, $options: 'i' } }
      ]
    });
    res.json(products);
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ error: error.message });
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
    console.log(`   GET    /api/products/categories - Get categories`);
    console.log(`   GET    /api/products/search/:query - Search products`);
    console.log(`   GET    /api/products/:id - Get product by ID`);
    console.log(`   POST   /api/products - Create product`);
    console.log(`   PATCH  /api/products/:id/stock - Update stock`);
    console.log(`   GET    /health - Health check`);
  });
}

startServer().catch(console.error);
