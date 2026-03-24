#!/bin/bash

echo "========================================="
echo "Building Docker images for MicroK8s"
echo "========================================="

# Build images for all services
echo "Building product-service..."
cd ../product-service
docker build -t product-service:latest .

echo "Building user-service..."
cd ../user-service
docker build -t user-service:latest .

echo "Building order-service..."
cd ../order-service
docker build -t order-service:latest .

echo "Building api-gateway..."
cd ../api-gateway
docker build -t api-gateway:latest .

echo "Building frontend..."
cd ../frontend
docker build -t frontend:latest .

echo ""
echo "✅ All images built successfully!"
echo ""

# List built images
echo "Built images:"
docker images | grep -E "product-service|user-service|order-service|api-gateway|frontend"

echo ""
echo "========================================="
echo "Loading images into MicroK8s"
echo "========================================="

# Method 1: Save and load images
echo "Saving images to tar files..."
docker save product-service:latest -o product-service.tar
docker save user-service:latest -o user-service.tar
docker save order-service:latest -o order-service.tar
docker save api-gateway:latest -o api-gateway.tar
docker save frontend:latest -o frontend.tar

echo "Loading images into MicroK8s..."
microk8s ctr image import product-service.tar
microk8s ctr image import user-service.tar
microk8s ctr image import order-service.tar
microk8s ctr image import api-gateway.tar
microk8s ctr image import frontend.tar

# Clean up tar files
rm -f *.tar

echo ""
echo "✅ Images loaded into MicroK8s successfully!"

# Verify images in MicroK8s
echo ""
echo "Verifying images in MicroK8s:"
microk8s ctr image list | grep -E "product-service|user-service|order-service|api-gateway|frontend"
