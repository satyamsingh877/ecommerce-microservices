#!/bin/bash

echo "========================================="
echo "Deploying E-Commerce to MicroK8s"
echo "========================================="

# Apply namespace
kubectl apply -f namespace.yaml

# Apply configmaps
kubectl apply -f configmaps/

# Apply secrets
kubectl apply -f secrets/

# Apply deployments and services
kubectl apply -f deployments/

echo "========================================="
echo "Waiting for pods to be ready..."
echo "========================================="

# Wait for all pods to be ready
kubectl wait --namespace=ecommerce --for=condition=ready pod --all --timeout=300s

echo ""
echo "========================================="
echo "Checking deployment status..."
echo "========================================="

# Show all resources
kubectl get all -n ecommerce

echo ""
echo "========================================="
echo "Testing services..."
echo "========================================="

# Get the node IP
NODE_IP=$(kubectl get nodes -o jsonpath='{.items[0].status.addresses[0].address}')
echo "Node IP: $NODE_IP"

# Test API Gateway
echo "Testing API Gateway..."
curl -s http://$NODE_IP:30080/health | jq .

# Test Product Service
echo "Testing Product Service..."
curl -s http://$NODE_IP:30080/api/products | jq 'length'

echo ""
echo "========================================="
echo "Deployment Complete!"
echo "========================================="
echo "Access the application:"
echo "  Frontend: http://$NODE_IP:30081"
echo "  API Gateway: http://$NODE_IP:30080"
echo "  RabbitMQ Management: http://$NODE_IP:30080 (needs port-forward)"
echo ""
echo "Test credentials:"
echo "  Email: test@example.com"
echo "  Password: test123"
echo ""
echo "Useful commands:"
echo "  kubectl get pods -n ecommerce -w"
echo "  kubectl logs -n ecommerce <pod-name>"
echo "  kubectl describe pod -n ecommerce <pod-name>"
echo "========================================="
