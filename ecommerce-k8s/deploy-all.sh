#!/bin/bash

echo "========================================="
echo "E-Commerce MicroK8s Deployment"
echo "========================================="

# Check MicroK8s status
echo "Checking MicroK8s status..."
if ! sudo microk8s status | grep -q "running"; then
    echo "Starting MicroK8s..."
    sudo microk8s start
    sleep 10
fi

# Enable required addons
echo "Enabling MicroK8s addons..."
sudo microk8s enable dns storage metallb

# Configure MetalLB (adjust IP range to your network)
echo "Configuring MetalLB..."
sudo microk8s enable metallb:192.168.1.240-192.168.1.250

# Build Docker images
echo ""
echo "Building Docker images..."
cd ../product-service && docker build -t product-service:latest . && cd ..
cd user-service && docker build -t user-service:latest . && cd ..
cd order-service && docker build -t order-service:latest . && cd ..
cd api-gateway && docker build -t api-gateway:latest . && cd ..
cd frontend && docker build -t frontend:latest . && cd ..

# Load images into MicroK8s
echo ""
echo "Loading images into MicroK8s..."
docker save product-service:latest | sudo microk8s ctr image import -
docker save user-service:latest | sudo microk8s ctr image import -
docker save order-service:latest | sudo microk8s ctr image import -
docker save api-gateway:latest | sudo microk8s ctr image import -
docker save frontend:latest | sudo microk8s ctr image import -

# Deploy to Kubernetes
echo ""
echo "Deploying to Kubernetes..."
kubectl apply -f ecommerce-all-in-one.yaml

# Wait for pods to be ready
echo ""
echo "Waiting for pods to be ready..."
sleep 30
kubectl wait --namespace=ecommerce --for=condition=ready pod --all --timeout=300s

# Show deployment status
echo ""
echo "========================================="
echo "Deployment Status"
echo "========================================="
kubectl get all -n ecommerce

# Get access URL
NODE_IP=$(kubectl get nodes -o jsonpath='{.items[0].status.addresses[0].address}')
echo ""
echo "========================================="
echo "Access URLs"
echo "========================================="
echo "Frontend: http://$NODE_IP:30081"
echo "API Gateway: http://$NODE_IP:30080"
echo "RabbitMQ Management: http://$NODE_IP:15672 (port-forward needed)"
echo ""
echo "Test Credentials:"
echo "  Email: test@example.com"
echo "  Password: test123"
echo ""
echo "Useful Commands:"
echo "  kubectl get pods -n ecommerce"
echo "  kubectl logs -n ecommerce <pod-name>"
echo "  kubectl describe pod -n ecommerce <pod-name>"
echo "========================================="
