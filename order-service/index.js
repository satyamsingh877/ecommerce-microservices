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

// Redis Client with retry
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://redis:6379',
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        console.error('Redis connection failed after 10 retries');
        return new Error('Redis connection failed');
      }
      return Math.min(retries * 100, 3000);
    }
  }
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.on('connect', () => console.log('Connected to Redis'));

// Connect to Redis
redisClient.connect().catch(console.error);

// In-memory storage for orders
let orders = [];
let orderIdCounter = 1;

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'order-service' });
});

// Create order
app.post('/api/orders', async (req, res) => {
  try {
    const { userId, items, total } = req.body;
    
    if (!userId || !items || !total) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    console.log('Creating order for user:', userId);
    
    // Validate stock with product service
    for (const item of items) {
      try {
        const productResponse = await axios.get(`http://product-service:3001/api/products/${item.productId}`);
        const product = productResponse.data;
        
        if (product.stock < item.quantity) {
          return res.status(400).json({ 
            error: `Insufficient stock for product: ${product.name}. Available: ${product.stock}` 
          });
        }
      } catch (error) {
        console.error('Error fetching product:', error.message);
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
    console.log(`Order created with ID: ${order.id}`);
    
    // Cache the order in Redis
    try {
      await redisClient.setEx(`order:${order.id}`, 3600, JSON.stringify(order));
    } catch (redisError) {
      console.error('Redis cache error:', redisError);
      // Continue even if Redis fails
    }
    
    // Update stock in product service
    for (const item of items) {
      try {
        const productResponse = await axios.get(`http://product-service:3001/api/products/${item.productId}`);
        const product = productResponse.data;
        
        await axios.patch(`http://product-service:3001/api/products/${item.productId}/stock`, {
          stock: product.stock - item.quantity
        });
        console.log(`Updated stock for product ${item.productId}`);
      } catch (error) {
        console.error('Error updating stock:', error.message);
      }
    }
    
    res.status(201).json(order);
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user orders
app.get('/api/orders/user/:userId', async (req, res) => {
  try {
    const userOrders = orders.filter(order => order.userId === parseInt(req.params.userId));
    console.log(`Found ${userOrders.length} orders for user ${req.params.userId}`);
    res.json(userOrders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get order by ID
app.get('/api/orders/:id', async (req, res) => {
  try {
    // Try to get from Redis cache first
    try {
      const cachedOrder = await redisClient.get(`order:${req.params.id}`);
      if (cachedOrder) {
        return res.json(JSON.parse(cachedOrder));
      }
    } catch (redisError) {
      console.error('Redis read error:', redisError);
    }
    
    const order = orders.find(o => o.id === parseInt(req.params.id));
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
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
    
    try {
      await redisClient.setEx(`order:${order.id}`, 3600, JSON.stringify(order));
    } catch (redisError) {
      console.error('Redis cache error:', redisError);
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Order Service running on port ${PORT}`);
});
