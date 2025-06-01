#!/bin/bash

# Script to run the application locally

echo "Starting Sorting Algorithm Visualizer locally..."

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Run the development server
echo "Starting development server..."
npm run dev

echo "Server should be running at http://localhost:3000"
