#!/bin/bash

# Start server to trigger macOS Firewall prompt
# This will cause macOS to ask permission for Node.js

set -e

echo "🚀 Starting Server to Trigger Firewall Prompt"
echo "=============================================="
echo ""

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Find Node.js
find_node() {
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
    
    local which_node=$(which node 2>/dev/null)
    if [ -n "$which_node" ]; then
        echo "$which_node"
        return 0
    fi
    
    return 1
}

echo "🔍 Looking for Node.js..."
NODE_PATH=$(find_node)

if [ -z "$NODE_PATH" ]; then
    echo "❌ Node.js not found!"
    echo ""
    echo "Please install Node.js first:"
    echo "  1. Download from: https://nodejs.org"
    echo "  2. Or install via Homebrew: brew install node"
    echo ""
    exit 1
fi

echo "✅ Found Node.js at: $NODE_PATH"
export PATH="$(dirname $NODE_PATH):$PATH"

# Check if React app is built
echo ""
echo "🔨 Checking React app build..."
if [ ! -d "react-app/dist" ]; then
    echo "Building React app..."
    cd react-app
    npm install 2>/dev/null || echo "Dependencies may need installation"
    npm run build
    cd ..
    echo "✅ React app built"
else
    echo "✅ React app already built"
fi

# Check server dependencies
echo ""
echo "📦 Checking server dependencies..."
cd server
if [ ! -d "node_modules" ]; then
    echo "Installing server dependencies..."
    npm install
    echo "✅ Dependencies installed"
else
    echo "✅ Dependencies already installed"
fi

# Check for .env
if [ ! -f ".env" ]; then
    echo ""
    echo "⚠️  Warning: .env file not found"
    echo "Creating basic .env file..."
    cat > .env << 'ENVEOF'
NODE_ENV=production
PORT=3000
ALLOW_ALL_ORIGINS=true
ENVEOF
    echo "✅ Basic .env created"
    echo ""
    echo "⚠️  You should add password protection:"
    echo "   node scripts/generate-password-hash.js YOUR_PASSWORD"
fi

cd ..

# Start server
echo ""
echo "🚀 Starting server..."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "⚠️  WATCH FOR THIS PROMPT:"
echo ""
echo "   'Do you want the application \"node\" to accept"
echo "    incoming network connections?'"
echo ""
echo "   → Click 'Allow' when it appears!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Starting server in 3 seconds..."
sleep 3

cd server
NODE_ENV=production PORT=3000 node app.js

