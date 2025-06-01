#!/bin/zsh

set -euo pipefail

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
  echo "Error: Node.js is not installed. Please install Node.js before continuing."
  exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
  echo "Error: npm is not installed. Please install npm before continuing."
  exit 1
fi

# Check if the project is already set up
if [ ! -f "package.json" ]; then
  # Create Next.js project with TypeScript
  echo "Creating Next.js project with TypeScript..."
  npx create-next-app@latest . --typescript --eslint --tailwind --app --src-dir --import-alias "@/*" || {
    echo "Error: Failed to create Next.js project."
    exit 1
  }
else
  echo "Project already exists, skipping creation step."
fi

# Install additional dependencies
echo "Installing dependencies..."
npm install || {
  echo "Error: Failed to install dependencies."
  exit 1
}

# Build the project
echo "Building the project..."
npm run build || {
  echo "Error: Failed to build the project."
  exit 1
}

# Make the run scripts executable if they exist
if [ -f "run-local.sh" ]; then
  chmod +x run-local.sh
fi

if [ -f "deploy.sh" ]; then
  chmod +x deploy.sh
fi

# Start the development server on an uncommon port
echo "Starting the development server..."
PORT=3400 npm run dev &
SERVER_PID=$!

# Wait a moment for the server to start
sleep 3

# Open the browser to view the application
echo "Opening browser to view the application..."
plandex browser http://localhost:3400 || {
  echo "Error: Failed to open browser."
  kill $SERVER_PID
  exit 1
}

# Wait for the server process to complete
wait $SERVER_PID

