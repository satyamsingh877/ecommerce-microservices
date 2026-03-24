#!/bin/bash

echo "========================================="
echo "Complete E-Commerce Deployment on MicroK8s"
echo "========================================="

# Step 1: Enable required addons
echo "Step 1: Enabling MicroK8s addons..."
microk8s enable dns storage registry metallb

# Configure MetalLB (adjust IP range to your network)
echo "Configuring MetalLB..."
microk8s enable metallb:192.168.1.240-192.168.1.250

# Step 2: Build images
echo ""
echo "Step 2: Building Docker images..."
cd ../product-service
docker build -t product-service:latest .

cd ../user-service
docker build -t user-service:latest .

cd ../order-service
docker build -t order-service:latest .

cd ../api-gateway
docker build -t api-gateway:latest .

cd ../frontend
docker build -t frontend:latest .

# Step 3: Push to local registry
echo ""
echo "Step 3: Pushing images to local registry..."

# Wait for registry to be ready
sleep 10

# Tag images
docker tag product-service:latest localhost:32000/product-service:latest
docker tag user-service:latest localhost:32000/user-service:latest
docker tag order-service:latest localhost:32000/order-service:latest
docker tag api-gateway:latest localhost:32000/api-gateway:latest
docker tag frontend:latest localhost:32000/frontend:latest

# Push images
docker push localhost:32000/product-service:latest
docker push localhost:32000/user-service:latest
docker push localhost:32000/order-service:latest
docker push localhost:32000/api-gateway:latest
docker push localhost:32000/frontend:latest

# Step 4: Apply Kubernetes manifests
echo ""
echo "Step 4: Deploying to Kubernetes..."

# Create namespace
kubectl apply -f namespace.yaml

# Apply configmaps
kubectl apply -f configmaps/

# Apply secrets
kubectl apply -f secrets/

# Apply deployments
kubectl apply -f deployments/

echo ""
echo "Step 5: Waiting for pods to be ready..."
sleep 15

# Show deployment status
kubectl get pods -n ecommerce -w --timeout=60s &

# Wait for pods
kubectl wait --namespace=ecommerce --for=condition=ready pod --all --timeout=180s

echo ""
echo "========================================="
echo "Deployment Status"
echo "========================================="
kubectl get all -n ecommerce

echo ""
echo "========================================="
echo "Access URLs"
echo "========================================="

# Get node IP
NODE_IP=$(kubectl get nodes -o jsonpath='{.items[0].status.addresses[0].address}')
echo "Node IP: $NODE_IP"
echo ""
echo "Frontend: http://$NODE_IP:30081"
echo "API Gateway: http://$NODE_IP:30080"
echo ""
echo "Test credentials:"
echo "  Email: test@example.com"
echo "  Password: test123"
echo ""
echo "To check logs: kubectl logs -n ecommerce <pod-name>"
echo "To see pods: kubectl get pods -n ecommerce"
echo "========================================="
