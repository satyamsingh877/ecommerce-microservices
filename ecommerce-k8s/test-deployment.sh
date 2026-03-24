#!/bin/bash

echo "Testing E-Commerce Deployment..."

# Get node IP
NODE_IP=$(kubectl get nodes -o jsonpath='{.items[0].status.addresses[0].address}')
echo "Node IP: $NODE_IP"

echo ""
echo "1. Testing API Gateway..."
curl -s http://$NODE_IP:30080/health | jq .

echo ""
echo "2. Testing Product Service..."
curl -s http://$NODE_IP:30080/api/products | jq 'length'

echo ""
echo "3. Testing User Service..."
curl -s http://$NODE_IP:30080/api/users/health | jq .

echo ""
echo "4. Checking pods..."
kubectl get pods -n ecommerce

echo ""
echo "5. Checking services..."
kubectl get svc -n ecommerce

echo ""
echo "6. Recent logs..."
kubectl logs -n ecommerce -l app=api-gateway --tail=10
