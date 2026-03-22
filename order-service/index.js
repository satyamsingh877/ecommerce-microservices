const express = require('express');
const { createClient } = require('redis');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(cors());
app.use(express.json());

// Redis Client
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect();

// In-memory storage for orders (in production, use PostgreSQL)
let orders = [];
let orderIdCounter = 1;

// Routes

// Create order
app.post('/api/orders', async (req, res) => {
  try {
    const { userId, items, total } = req.body;
    
    // Validate stock with product service
    for (const item of items) {
      try {
        const productResponse = await axios.get(`http://product-service:3001/api/products/${item.productId}`);
        const product = productResponse.data;
        
        if (product.stock < item.quantity) {
          return res.status(400).json({ 
            error: `Insufficient stock for product: ${product.name}` 
          });
        }
      } catch (error) {
        return res.status(404).json({ error: `Product ${item.productId} not found` });
      }
    }
    
    // Create order
    const order = {
      id: orderIdCounter++,
      userId,
      items,
      total,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    orders.push(order);
    
    // Cache the order in Redis
    await redisClient.setEx(`order:${order.id}`, 3600, JSON.stringify(order));
    
    // Update stock in product service
    for (const item of items) {
      const productResponse = await axios.get(`http://product-service:3001/api/products/${item.productId}`);
      const product = productResponse.data;
      
      await axios.patch(`http://product-service:3001/api/products/${item.productId}/stock`, {
        stock: product.stock - item.quantity
      });
    }
    
    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Get user orders
app.get('/api/orders/user/:userId', async (req, res) => {
  try {
    const userOrders = orders.filter(order => order.userId === parseInt(req.params.userId));
    res.json(userOrders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get order by ID
app.get('/api/orders/:id', async (req, res) => {
  try {
    // Try to get from Redis cache first
    const cachedOrder = await redisClient.get(`order:${req.params.id}`);
    if (cachedOrder) {
      return res.json(JSON.parse(cachedOrder));
    }
    
    const order = orders.find(o => o.id === parseInt(req.params.id));
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update order status
app.patch('/api/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = orders.find(o => o.id === parseInt(req.params.id));
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    order.status = status;
    await redisClient.setEx(`order:${order.id}`, 3600, JSON.stringify(order));
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Order Service running on port ${PORT}`);
});
