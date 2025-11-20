#!/bin/bash

# HomeScorePro Hosting Setup Script
# This script sets up everything needed to host on your Mac Mini

set -e

echo "🚀 HomeScorePro Hosting Setup"
echo "=============================="
echo ""

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Function to find Node.js
find_node() {
    # Check common locations
    local paths=(
        "/usr/local/bin/node"
        "/opt/homebrew/bin/node"
        "$HOME/.nvm/versions/node/*/bin/node"
        "/usr/bin/node"
    )
    
    for path in "${paths[@]}"; do
        if [ -f "$path" ] 2>/dev/null; then
            echo "$path"
            return 0
        fi
    done
    
    # Try which
    local which_node=$(which node 2>/dev/null)
    if [ -n "$which_node" ]; then
        echo "$which_node"
        return 0
    fi
    
    return 1
}

# Find Node.js
echo "🔍 Looking for Node.js..."
NODE_PATH=$(find_node)

if [ -z "$NODE_PATH" ]; then
    echo "❌ Node.js not found!"
    echo ""
    echo "Please install Node.js:"
    echo "  1. Download from: https://nodejs.org"
    echo "  2. Or install via Homebrew: brew install node"
    echo ""
    echo "After installing, run this script again."
    exit 1
fi

echo "✅ Found Node.js at: $NODE_PATH"
export PATH="$(dirname $NODE_PATH):$PATH"

# Verify Node.js works
NODE_VERSION=$($NODE_PATH --version)
NPM_VERSION=$(npm --version)
echo "   Node.js version: $NODE_VERSION"
echo "   npm version: $NPM_VERSION"
echo ""

# Install PM2 globally if not installed
echo "📦 Checking PM2..."
if ! command -v pm2 &> /dev/null; then
    echo "   Installing PM2..."
    npm install -g pm2
    echo "✅ PM2 installed"
else
    echo "✅ PM2 already installed"
fi
echo ""

# Install React app dependencies
echo "📦 Installing React app dependencies..."
cd react-app
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "   Dependencies already installed"
fi
cd ..
echo ""

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "   Dependencies already installed"
fi
cd ..
echo ""

# Build React app
echo "🔨 Building React app..."
cd react-app
npm run build
cd ..
echo ""

# Create .env file if it doesn't exist
echo "⚙️  Configuring server settings..."
cd server
if [ ! -f ".env" ]; then
    cat > .env << 'ENVEOF'
NODE_ENV=production
PORT=3000
ALLOW_ALL_ORIGINS=true
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000
ENVEOF
    echo "✅ Created .env file"
else
    echo "✅ .env file already exists"
fi
cd ..
echo ""

# Create logs directory
mkdir -p logs
echo "✅ Created logs directory"
echo ""

# Get local IP address
LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)
PUBLIC_IP=$(curl -s ifconfig.me 2>/dev/null || echo "Unable to determine")

echo "🌐 Network Information:"
echo "   Local IP: $LOCAL_IP"
echo "   Public IP: $PUBLIC_IP"
echo ""

echo "✅ Setup complete!"
echo ""
echo "🚀 Starting server..."
echo ""

# Start server with PM2
pm2 start ecosystem.config.js
pm2 save

echo ""
echo "✅ Server started!"
echo ""
echo "📊 Server Status:"
pm2 status
echo ""
echo "🌐 Access your site:"
echo "   Local: http://localhost:3000"
echo "   Local network: http://$LOCAL_IP:3000"
if [ "$PUBLIC_IP" != "Unable to determine" ]; then
    echo "   Public (after port forwarding): http://$PUBLIC_IP:3000"
fi
echo ""
echo "📝 Useful commands:"
echo "   pm2 status              - Check server status"
echo "   pm2 logs homescorepro   - View server logs"
echo "   pm2 restart homescorepro - Restart server"
echo "   pm2 stop homescorepro   - Stop server"
echo ""
echo "📚 For making it public, see: MAC_MINI_HOSTING.md"
echo ""

