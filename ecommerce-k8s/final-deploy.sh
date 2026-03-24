#!/bin/bash

echo "========================================="
echo "Final E-Commerce Deployment on MicroK8s"
echo "========================================="

# Check if MicroK8s is running
if ! sudo microk8s status | grep -q "running"; then
    echo "MicroK8s is not running. Starting..."
    sudo microk8s start
    sleep 10
fi

# Build images
echo "Building images..."
cd ../product-service && docker build -t product-service:latest . && cd -
cd ../user-service && docker build -t user-service:latest . && cd -
cd ../order-service && docker build -t order-service:latest . && cd -
cd ../api-gateway && docker build -t api-gateway:latest . && cd -
cd ../frontend && docker build -t frontend:latest . && cd -

# Save and load images into MicroK8s
echo "Loading images into MicroK8s..."
docker save product-service:latest | sudo microk8s ctr image import -
docker save user-service:latest | sudo microk8s ctr image import -
docker save order-service:latest | sudo microk8s ctr image import -
docker save api-gateway:latest | sudo microk8s ctr image import -
docker save frontend:latest | sudo microk8s ctr image import -

# Create namespace
kubectl create namespace ecommerce --dry-run=client -o yaml | kubectl apply -f -

# Apply configurations
kubectl apply -f configmaps/
kubectl apply -f secrets/

# Apply services first
kubectl apply -f services/fixed-services.yaml

# Apply deployments
kubectl apply -f deployments/

echo "Waiting for pods to start..."
sleep 20

# Show status
kubectl get pods -n ecommerce
kubectl get svc -n ecommerce

echo ""
echo "Deployment complete! Access at:"
echo "Frontend: http://$(kubectl get nodes -o jsonpath='{.items[0].status.addresses[0].address}'):30081"
