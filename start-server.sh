#!/bin/bash

# HomeScorePro Server Startup Script
# This script builds the React app and starts the server

set -e

echo "🚀 Starting HomeScorePro Server..."
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Build React app
echo "📦 Building React app..."
cd react-app
if [ ! -d "node_modules" ]; then
    echo "Installing React app dependencies..."
    npm install
fi
npm run build
cd ..

# Check if server dependencies are installed
if [ ! -d "server/node_modules" ]; then
    echo "📦 Installing server dependencies..."
    cd server
    npm install
    cd ..
fi

# Create logs directory if it doesn't exist
mkdir -p logs

# Start server with PM2 if available, otherwise use node directly
if command -v pm2 &> /dev/null; then
    echo "✅ Starting server with PM2..."
    pm2 start ecosystem.config.js
    echo ""
    echo "✅ Server started!"
    echo ""
    echo "Useful commands:"
    echo "  pm2 status          - Check server status"
    echo "  pm2 logs homescorepro - View logs"
    echo "  pm2 stop homescorepro - Stop server"
    echo "  pm2 restart homescorepro - Restart server"
    echo ""
    echo "🌐 Server running at: http://localhost:3000"
else
    echo "⚠️  PM2 not found. Starting server directly..."
    echo "   Install PM2 for better process management: npm install -g pm2"
    echo ""
    cd server
    NODE_ENV=production PORT=3000 node app.js
fi

