#!/bin/bash

# generate-k8s-secrets.sh
# Generates the Kubernetes secret 'lingualeap-secrets' required by the Helm chart.

NAMESPACE="lingualeap"
SECRET_NAME="lingualeap-secrets"

echo "Generating Kubernetes secrets for LinguaLeap..."

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    echo "Error: kubectl could not be found. Please install it."
    exit 1
fi

# Ensure namespace exists
kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -

# Copy ghcr-secret from default namespace if it exists
if kubectl get secret ghcr-secret -n default &> /dev/null; then
    echo "Copying ghcr-secret from default namespace..."
    kubectl get secret ghcr-secret -n default -o yaml | \
    sed "s/namespace: default/namespace: $NAMESPACE/" | \
    kubectl apply -f -
else
    echo "Warning: ghcr-secret not found in default namespace. Image pulling might fail if using private registry."
fi

# Prompt for secrets if not provided as environment variables
if [ -z "$MONGODB_ROOT_PASSWORD" ]; then
    read -p "Enter MongoDB Root Password: " MONGODB_ROOT_PASSWORD
    echo ""
fi

if [ -z "$MONGODB_PASSWORD" ]; then
    read -p "Enter MongoDB User Password: " MONGODB_PASSWORD
    echo ""
fi

if [ -z "$JWT_SECRET" ]; then
    read -p "Enter JWT Secret: " JWT_SECRET
    echo ""
fi

if [ -z "$GOOGLE_GENAI_API_KEY" ]; then
    read -p "Enter Google GenAI API Key: " GOOGLE_GENAI_API_KEY
    echo ""
fi

if [ -z "$SMTP_HOST" ]; then
    read -p "Enter SMTP Host: " SMTP_HOST
fi

if [ -z "$SMTP_PORT" ]; then
    read -p "Enter SMTP Port: " SMTP_PORT
fi

if [ -z "$SMTP_SECURE" ]; then
    read -p "Enter SMTP Secure (true/false): " SMTP_SECURE
fi

if [ -z "$SMTP_USER" ]; then
    read -p "Enter SMTP User: " SMTP_USER
fi

if [ -z "$SMTP_PASSWORD" ]; then
    read -p "Enter SMTP Password: " SMTP_PASSWORD
    echo ""
fi

# Construct MongoDB URI
# Assuming internal service name 'lingualeap-mongodb'
MONGODB_URI="mongodb://lingualeap:${MONGODB_PASSWORD}@lingualeap-mongodb:27017/lingualeap"

# Create the secret
kubectl create secret generic $SECRET_NAME \
    --namespace $NAMESPACE \
    --from-literal=mongodb-root-password="$MONGODB_ROOT_PASSWORD" \
    --from-literal=mongodb-password="$MONGODB_PASSWORD" \
    --from-literal=mongodb-uri="$MONGODB_URI" \
    --from-literal=jwt-secret="$JWT_SECRET" \
    --from-literal=google-genai-api-key="$GOOGLE_GENAI_API_KEY" \
    --from-literal=smtp-host="$SMTP_HOST" \
    --from-literal=smtp-port="$SMTP_PORT" \
    --from-literal=smtp-secure="$SMTP_SECURE" \
    --from-literal=smtp-user="$SMTP_USER" \
    --from-literal=smtp-password="$SMTP_PASSWORD" \
    --dry-run=client -o yaml | kubectl apply -f -

echo "Secret '$SECRET_NAME' created in namespace '$NAMESPACE'."
