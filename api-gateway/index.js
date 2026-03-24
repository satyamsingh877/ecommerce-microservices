const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'api-gateway',
    timestamp: new Date().toISOString(),
    endpoints: {
      products: process.env.PRODUCT_SERVICE_URL,
      users: process.env.USER_SERVICE_URL,
      orders: process.env.ORDER_SERVICE_URL
    }
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'E-Commerce API Gateway',
    version: '1.0.0',
    endpoints: {
      products: '/api/products',
      users: '/api/users',
      orders: '/api/orders',
      health: '/health'
    }
  });
});

// Product Service Proxy
app.use('/api/products', createProxyMiddleware({
  target: process.env.PRODUCT_SERVICE_URL || 'http://product-service:3001',
  changeOrigin: true,
  pathRewrite: {
    '^/api/products': '/api/products'
  },
  onError: (err, req, res) => {
    console.error('Product Service Proxy Error:', err.message);
    res.status(503).json({ 
      error: 'Product service unavailable',
      details: err.message
    });
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxying to Product Service: ${req.method} ${req.url}`);
  }
}));

// User Service Proxy
app.use('/api/users', createProxyMiddleware({
  target: process.env.USER_SERVICE_URL || 'http://user-service:3002',
  changeOrigin: true,
  pathRewrite: {
    '^/api/users': '/api/users'
  },
  onError: (err, req, res) => {
    console.error('User Service Proxy Error:', err.message);
    res.status(503).json({ 
      error: 'User service unavailable',
      details: err.message
    });
  }
}));

// Order Service Proxy
app.use('/api/orders', createProxyMiddleware({
  target: process.env.ORDER_SERVICE_URL || 'http://order-service:3003',
  changeOrigin: true,
  pathRewrite: {
    '^/api/orders': '/api/orders'
  },
  onError: (err, req, res) => {
    console.error('Order Service Proxy Error:', err.message);
    res.status(503).json({ 
      error: 'Order service unavailable',
      details: err.message
    });
  }
}));

// Catch-all for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
  console.log(`📋 Available endpoints:`);
  console.log(`   GET    /health - Service health check`);
  console.log(`   GET    /api/products - Product service`);
  console.log(`   POST   /api/users - User service`);
  console.log(`   GET    /api/orders - Order service`);
});
