#!/bin/bash

echo "Undeploying E-Commerce from MicroK8s..."

# Delete all resources
kubectl delete -f deployments/
kubectl delete -f secrets/
kubectl delete -f configmaps/
kubectl delete -f namespace.yaml

echo "Deployment removed successfully!"
