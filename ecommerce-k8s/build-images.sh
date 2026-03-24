#!/bin/bash

# Build images for MicroK8s
echo "Building Docker images..."

# Build product service
cd ../product-service
docker build -t product-service:latest .

# Build user service
cd ../user-service
docker build -t user-service:latest .

# Build order service
cd ../order-service
docker build -t order-service:latest .

# Build API gateway
cd ../api-gateway
docker build -t api-gateway:latest .

# Build frontend
cd ../frontend
docker build -t frontend:latest .

echo "Images built successfully!"

# Load images into MicroK8s
echo "Loading images into MicroK8s..."

microk8s ctr image import product-service:latest
microk8s ctr image import user-service:latest
microk8s ctr image import order-service:latest
microk8s ctr image import api-gateway:latest
microk8s ctr image import frontend:latest

echo "Images loaded into MicroK8s!"
