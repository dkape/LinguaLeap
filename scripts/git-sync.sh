#!/bin/bash

echo "Fetching latest changes..."
git fetch

echo "Syncing with origin/main..."
git pull origin main

if [ $? -eq 0 ]; then
  echo "Sync successful."
else
  echo "Sync failed. Please resolve any conflicts manually."
fi
