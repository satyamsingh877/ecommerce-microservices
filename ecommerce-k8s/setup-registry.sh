#!/bin/bash

echo "Setting up local Docker registry for MicroK8s..."

# Enable registry addon
microk8s enable registry

# Wait for registry to be ready
sleep 5

# Tag images for local registry
docker tag product-service:latest localhost:32000/product-service:latest
docker tag user-service:latest localhost:32000/user-service:latest
docker tag order-service:latest localhost:32000/order-service:latest
docker tag api-gateway:latest localhost:32000/api-gateway:latest
docker tag frontend:latest localhost:32000/frontend:latest

# Push images to local registry
docker push localhost:32000/product-service:latest
docker push localhost:32000/user-service:latest
docker push localhost:32000/order-service:latest
docker push localhost:32000/api-gateway:latest
docker push localhost:32000/frontend:latest

echo "✅ Images pushed to local registry"
