#!/bin/bash

echo "Manual image loading for MicroK8s..."

# Build images first
cd ../product-service && docker build -t product-service:latest .
cd ../user-service && docker build -t user-service:latest .
cd ../order-service && docker build -t order-service:latest .
cd ../api-gateway && docker build -t api-gateway:latest .
cd ../frontend && docker build -t frontend:latest .

# Save images
docker save product-service:latest | microk8s ctr image import -
docker save user-service:latest | microk8s ctr image import -
docker save order-service:latest | microk8s ctr image import -
docker save api-gateway:latest | microk8s ctr image import -
docker save frontend:latest | microk8s ctr image import -

echo "Images loaded successfully!"

# Verify
microk8s ctr image list | grep -E "product|user|order|api|frontend"
