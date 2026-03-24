#!/bin/bash

echo "========================================="
echo "E-Commerce Status on MicroK8s"
echo "========================================="

echo ""
echo "Pods:"
kubectl get pods -n ecommerce -o wide

echo ""
echo "Services:"
kubectl get svc -n ecommerce

echo ""
echo "Deployments:"
kubectl get deployments -n ecommerce

echo ""
echo "Persistent Volumes:"
kubectl get pvc -n ecommerce

echo ""
echo "Logs (last 5 lines of each pod):"
for pod in $(kubectl get pods -n ecommerce -o name); do
    echo ""
    echo "=== $pod ==="
    kubectl logs -n ecommerce $pod --tail=5
done
