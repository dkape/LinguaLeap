#!/bin/bash

# setup-secrets.sh
# Usage: ./setup-secrets.sh [namespace]

NAMESPACE=${1:-default}
SECRET_NAME="lingualeap-secrets"

echo "Setting up secrets for LinguaLeap in namespace: $NAMESPACE"

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    echo "Error: kubectl is not installed"
    exit 1
fi

# Prompt for secrets
read -s -p "Enter MongoDB Root Password: " MONGODB_ROOT_PASSWORD
echo
read -s -p "Enter MongoDB User Password (lingualeap): " MONGODB_PASSWORD
echo
read -s -p "Enter JWT Secret: " JWT_SECRET
echo
read -s -p "Enter SMTP Password: " SMTP_PASSWORD
echo
read -s -p "Enter Google Gemini API Key: " GOOGLE_GENAI_API_KEY
echo

# Create the secret
kubectl create secret generic $SECRET_NAME \
    --namespace $NAMESPACE \
    --from-literal=mongodb-root-password="$MONGODB_ROOT_PASSWORD" \
    --from-literal=mongodb-password="$MONGODB_PASSWORD" \
    --from-literal=jwt-secret="$JWT_SECRET" \
    --from-literal=smtp-password="$SMTP_PASSWORD" \
    --from-literal=google-genai-api-key="$GOOGLE_GENAI_API_KEY" \
    --from-literal=mongodb-uri="mongodb://lingualeap:$MONGODB_PASSWORD@lingualeap-mongodb:27017/lingualeap" \
    --dry-run=client -o yaml | kubectl apply -f -

echo "Secret $SECRET_NAME created successfully in namespace $NAMESPACE"
