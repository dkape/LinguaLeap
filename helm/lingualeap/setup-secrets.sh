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
read -p "Enter SMTP Host (e.g., smtp.gmail.com): " SMTP_HOST
echo
read -p "Enter SMTP Port (e.g., 587): " SMTP_PORT
echo
read -p "Enter SMTP User: " SMTP_USER
echo
read -p "Enter SMTP Secure (true/false): " SMTP_SECURE
echo
read -s -p "Enter Google Gemini API Key: " GOOGLE_GENAI_API_KEY
echo
read -p "Enter Admin Username: " ADMIN_USERNAME
echo
read -s -p "Enter Admin Password: " ADMIN_PASSWORD
echo


# Create the secret
kubectl create secret generic $SECRET_NAME \
    --namespace $NAMESPACE \
    --from-literal=mongodb-root-password="$MONGODB_ROOT_PASSWORD" \
    --from-literal=mongodb-password="$MONGODB_PASSWORD" \
    --from-literal=jwt-secret="$JWT_SECRET" \
    --from-literal=smtp-password="$SMTP_PASSWORD" \
    --from-literal=smtp-host="$SMTP_HOST" \
    --from-literal=smtp-port="$SMTP_PORT" \
    --from-literal=smtp-user="$SMTP_USER" \
    --from-literal=smtp-secure="$SMTP_SECURE" \
    --from-literal=google-genai-api-key="$GOOGLE_GENAI_API_KEY" \
    --from-literal=admin-username="$ADMIN_USERNAME" \
    --from-literal=admin-password="$ADMIN_PASSWORD" \
    --from-literal=mongodb-uri="mongodb://lingualeap:$MONGODB_PASSWORD@lingualeap-mongodb:27017/lingualeap" \
    --dry-run=client -o yaml | kubectl apply -f -

echo "Secret $SECRET_NAME created successfully in namespace $NAMESPACE"
