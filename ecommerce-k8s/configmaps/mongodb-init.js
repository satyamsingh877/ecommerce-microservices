apiVersion: v1
kind: ConfigMap
metadata:
  name: mongodb-init
  namespace: ecommerce
data:
  init.js: |
    // Create database and collection
    db = db.getSiblingDB('productdb');
    db.createCollection('products');
    
    // Insert sample products
    db.products.insertMany([
      { name: "MacBook Pro 14-inch", description: "Apple M3 Pro chip", price: 1999.99, stock: 15, category: "Electronics", brand: "Apple", rating: 4.8, createdAt: new Date() },
      { name: "Dell XPS 15", description: "Intel Core i7, 32GB RAM", price: 1899.99, stock: 12, category: "Electronics", brand: "Dell", rating: 4.7, createdAt: new Date() },
      { name: "Samsung Galaxy S24 Ultra", description: "200MP camera", price: 1299.99, stock: 25, category: "Electronics", brand: "Samsung", rating: 4.9, createdAt: new Date() },
      { name: "iPad Pro 12.9-inch", description: "M2 chip", price: 1099.99, stock: 20, category: "Electronics", brand: "Apple", rating: 4.8, createdAt: new Date() },
      { name: "Sony WH-1000XM5", description: "Noise cancellation", price: 349.99, stock: 40, category: "Audio", brand: "Sony", rating: 4.9, createdAt: new Date() },
      { name: "Logitech MX Master 3S", description: "Wireless mouse", price: 99.99, stock: 50, category: "Accessories", brand: "Logitech", rating: 4.7, createdAt: new Date() },
      { name: "Keychron Q1 Pro", description: "Mechanical keyboard", price: 199.99, stock: 35, category: "Accessories", brand: "Keychron", rating: 4.8, createdAt: new Date() },
      { name: "Anker 737 Power Bank", description: "24,000mAh", price: 89.99, stock: 60, category: "Accessories", brand: "Anker", rating: 4.6, createdAt: new Date() },
      { name: "Bose QuietComfort 45", description: "Wireless headphones", price: 329.99, stock: 28, category: "Audio", brand: "Bose", rating: 4.7, createdAt: new Date() },
      { name: "Apple AirPods Pro 2", description: "Active Noise Cancellation", price: 249.99, stock: 55, category: "Audio", brand: "Apple", rating: 4.8, createdAt: new Date() },
      { name: "JBL Flip 6", description: "Portable Bluetooth speaker", price: 129.99, stock: 42, category: "Audio", brand: "JBL", rating: 4.5, createdAt: new Date() },
      { name: "Apple Watch Series 9", description: "GPS, 45mm", price: 429.99, stock: 38, category: "Wearables", brand: "Apple", rating: 4.8, createdAt: new Date() },
      { name: "Samsung Galaxy Watch 6", description: "40mm Bluetooth", price: 299.99, stock: 32, category: "Wearables", brand: "Samsung", rating: 4.6, createdAt: new Date() },
      { name: "Garmin Fenix 7X", description: "Solar charging", price: 799.99, stock: 20, category: "Wearables", brand: "Garmin", rating: 4.9, createdAt: new Date() },
      { name: "Sony PlayStation 5", description: "Digital Edition", price: 449.99, stock: 18, category: "Gaming", brand: "Sony", rating: 4.9, createdAt: new Date() },
      { name: "Xbox Series X", description: "1TB SSD", price: 499.99, stock: 22, category: "Gaming", brand: "Microsoft", rating: 4.8, createdAt: new Date() },
      { name: "Nintendo Switch OLED", description: "7-inch OLED screen", price: 349.99, stock: 30, category: "Gaming", brand: "Nintendo", rating: 4.7, createdAt: new Date() },
      { name: "Razer Blade 15", description: "Gaming laptop", price: 2499.99, stock: 10, category: "Gaming", brand: "Razer", rating: 4.8, createdAt: new Date() },
      { name: "Elgato Stream Deck MK.2", description: "15 customizable LCD keys", price: 149.99, stock: 30, category: "Accessories", brand: "Elgato", rating: 4.8, createdAt: new Date() },
      { name: "Samsung T7 Shield SSD", description: "1TB Portable SSD", price: 119.99, stock: 45, category: "Accessories", brand: "Samsung", rating: 4.7, createdAt: new Date() }
    ]);
