#!/bin/bash

# Simple deployment script for Vercel

echo "Preparing for deployment to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Build the project
echo "Building project..."
npm run build

# Deploy to Vercel
echo "Deploying to Vercel..."
vercel --prod

echo "Deployment complete! Your app should be live on Vercel."
echo "If you haven't logged in or set up your Vercel account, follow the prompts."
