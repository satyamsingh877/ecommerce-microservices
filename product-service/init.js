const mongoose = require('mongoose');
require('dotenv').config();

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  stock: Number,
  category: String,
  imageUrl: String,
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);

const sampleProducts = [
  {
    name: "Laptop Pro X",
    description: "High-performance laptop for professionals",
    price: 1299.99,
    stock: 10,
    category: "Electronics"
  },
  {
    name: "Wireless Mouse",
    description: "Ergonomic wireless mouse",
    price: 29.99,
    stock: 50,
    category: "Accessories"
  },
  {
    name: "Mechanical Keyboard",
    description: "RGB mechanical gaming keyboard",
    price: 89.99,
    stock: 30,
    category: "Accessories"
  },
  {
    name: "4K Monitor",
    description: "27-inch 4K UHD monitor",
    price: 399.99,
    stock: 15,
    category: "Electronics"
  },
  {
    name: "Noise Cancelling Headphones",
    description: "Wireless noise cancelling headphones",
    price: 199.99,
    stock: 25,
    category: "Audio"
  },
  {
    name: "Smart Watch",
    description: "Fitness tracking smart watch",
    price: 249.99,
    stock: 20,
    category: "Wearables"
  }
];

async function initProducts() {
  try {
    await mongoose.connect('mongodb://admin:password@localhost:27017/productdb?authSource=admin', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    // Insert sample products
    await Product.insertMany(sampleProducts);
    console.log(`Added ${sampleProducts.length} sample products`);
    
    // Verify insertion
    const count = await Product.countDocuments();
    console.log(`Total products in database: ${count}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error initializing products:', error);
    process.exit(1);
  }
}

initProducts();
