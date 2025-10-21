#!/bin/bash

# LinguaLeap Kubernetes Deployment Script
set -e

# Configuration
NAMESPACE="lingualeap"
RELEASE_NAME="lingualeap"
CHART_PATH="./helm/lingualeap"
VALUES_FILE="./helm/lingualeap/values.yaml"

echo "🚀 Deploying LinguaLeap to Kubernetes"

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl is not installed. Please install kubectl first."
    exit 1
fi

# Check if helm is installed
if ! command -v helm &> /dev/null; then
    echo "❌ Helm is not installed. Please install Helm first."
    exit 1
fi

echo "✅ kubectl and Helm are installed"

# Check if we can connect to the cluster
if ! kubectl cluster-info &> /dev/null; then
    echo "❌ Cannot connect to Kubernetes cluster. Please check your kubeconfig."
    exit 1
fi

echo "✅ Connected to Kubernetes cluster"

# Create namespace if it doesn't exist
echo "📁 Creating namespace: $NAMESPACE"
kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -

# Check if cert-manager is installed
if ! kubectl get crd certificates.cert-manager.io &> /dev/null; then
    echo "⚠️  cert-manager is not installed. Installing cert-manager..."
    
    # Add cert-manager Helm repository
    helm repo add jetstack https://charts.jetstack.io
    helm repo update
    
    # Install cert-manager
    helm install cert-manager jetstack/cert-manager \
        --namespace cert-manager \
        --create-namespace \
        --version v1.13.0 \
        --set installCRDs=true
    
    echo "✅ cert-manager installed"
    
    # Wait for cert-manager to be ready
    echo "⏳ Waiting for cert-manager to be ready..."
    kubectl wait --for=condition=available --timeout=300s deployment/cert-manager -n cert-manager
    kubectl wait --for=condition=available --timeout=300s deployment/cert-manager-webhook -n cert-manager
    kubectl wait --for=condition=available --timeout=300s deployment/cert-manager-cainjector -n cert-manager
fi

# Create Let's Encrypt ClusterIssuer if it doesn't exist
if ! kubectl get clusterissuer letsencrypt-prod &> /dev/null; then
    echo "🔒 Creating Let's Encrypt ClusterIssuer..."
    
    cat <<EOF | kubectl apply -f -
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: daniel@kapeplus.de
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: traefik
EOF
    
    echo "✅ Let's Encrypt ClusterIssuer created"
fi

# Deploy or upgrade the application
echo "🚀 Deploying LinguaLeap..."

if helm list -n $NAMESPACE | grep -q $RELEASE_NAME; then
    echo "📦 Upgrading existing release..."
    helm upgrade $RELEASE_NAME $CHART_PATH \
        --namespace $NAMESPACE \
        --values $VALUES_FILE \
        --wait \
        --timeout 10m
else
    echo "📦 Installing new release..."
    helm install $RELEASE_NAME $CHART_PATH \
        --namespace $NAMESPACE \
        --values $VALUES_FILE \
        --wait \
        --timeout 10m
fi

echo "✅ LinguaLeap deployed successfully!"

# Wait for deployments to be ready
echo "⏳ Waiting for deployments to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/lingualeap-frontend -n $NAMESPACE
kubectl wait --for=condition=available --timeout=300s deployment/lingualeap-backend -n $NAMESPACE

# Get deployment status
echo "📊 Deployment Status:"
kubectl get pods -n $NAMESPACE
echo ""
kubectl get svc -n $NAMESPACE
echo ""
kubectl get ingress -n $NAMESPACE

# Get the application URL
INGRESS_HOST=$(kubectl get ingress lingualeap -n $NAMESPACE -o jsonpath='{.spec.rules[0].host}')
if [ ! -z "$INGRESS_HOST" ]; then
    echo ""
    echo "🌐 Application URL: https://$INGRESS_HOST"
fi

echo ""
echo "🎉 LinguaLeap is now running on Kubernetes!"
echo ""
echo "🔧 Useful Commands:"
echo "   Check pods:        kubectl get pods -n $NAMESPACE"
echo "   View logs:         kubectl logs -f deployment/lingualeap-backend -n $NAMESPACE"
echo "   Port forward:      kubectl port-forward svc/lingualeap-frontend 8080:80 -n $NAMESPACE"
echo "   Uninstall:         helm uninstall $RELEASE_NAME -n $NAMESPACE"
echo ""