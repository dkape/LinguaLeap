#!/bin/bash
# quick-add-admin.sh
# Usage: ./quick-add-admin.sh [namespace]

NAMESPACE=${1:-lingualeap}
SECRET_NAME="lingualeap-secrets"

echo "Adding Admin credentials to existing secret '$SECRET_NAME' in namespace '$NAMESPACE'"

read -p "Enter Admin Username: " ADMIN_USERNAME
read -s -p "Enter Admin Password: " ADMIN_PASSWORD
echo

# Encode values to base64 (handling linux/macos differences if simpler, but assuming linux as per user env)
ADMIN_USER_B64=$(echo -n "$ADMIN_USERNAME" | base64 | tr -d '\n')
ADMIN_PASS_B64=$(echo -n "$ADMIN_PASSWORD" | base64 | tr -d '\n')

# Patch the secret
kubectl patch secret $SECRET_NAME \
  --namespace $NAMESPACE \
  --type merge \
  -p "{\"data\": {\"admin-username\": \"$ADMIN_USER_B64\", \"admin-password\": \"$ADMIN_PASS_B64\"}}"

echo "Secret updated successfully."
