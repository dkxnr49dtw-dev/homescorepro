#!/bin/bash

# Setup secure limited user account for HomeScorePro server
# This script creates a dedicated user with limited permissions

set -e

echo "🔒 HomeScorePro Secure User Setup"
echo "=================================="
echo ""
echo "This script will create a limited user account for the server."
echo "This prevents the server from accessing your personal files."
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 1
fi

# Get username
read -p "Enter username for server account (default: homescorepro): " USERNAME
USERNAME=${USERNAME:-homescorepro}

# Get project directory
read -p "Enter project directory path (default: /Users/$USERNAME/homescorepro): " PROJECT_DIR
PROJECT_DIR=${PROJECT_DIR:-/Users/$USERNAME/homescorepro}

echo ""
echo "Creating user: $USERNAME"
echo "Project directory: $PROJECT_DIR"
echo ""

# Create user (requires sudo)
echo "Creating user account..."
sudo dscl . -create /Users/$USERNAME
sudo dscl . -create /Users/$USERNAME UserShell /bin/bash
sudo dscl . -create /Users/$USERNAME RealName "HomeScorePro Server"
sudo dscl . -create /Users/$USERNAME UniqueID $(($(dscl . -list /Users UniqueID | awk '{print $2}' | sort -n | tail -1) + 1))
sudo dscl . -create /Users/$USERNAME PrimaryGroupID 20
sudo dscl . -create /Users/$USERNAME NFSHomeDirectory /Users/$USERNAME

# Set password
echo ""
echo "Setting password for $USERNAME..."
sudo dscl . -passwd /Users/$USERNAME

# Create home directory
echo "Creating home directory..."
sudo createhomedir -c -u $USERNAME

# Create project directory
echo "Creating project directory..."
sudo mkdir -p $PROJECT_DIR
sudo chown -R $USERNAME:staff $PROJECT_DIR

# Set up Node.js (if installed)
if command -v node >/dev/null 2>&1; then
    NODE_PATH=$(which node)
    echo "Found Node.js at: $NODE_PATH"
    echo "Installing PM2 globally for $USERNAME..."
    sudo -u $USERNAME npm install -g pm2
fi

echo ""
echo "✅ User account created successfully!"
echo ""
echo "📋 Next steps:"
echo ""
echo "1. Copy your project to the new location:"
echo "   sudo cp -R \"/Users/jason/Library/Mobile Documents/com~apple~CloudDocs/homescorepro\" $PROJECT_DIR"
echo "   sudo chown -R $USERNAME:staff $PROJECT_DIR"
echo ""
echo "2. Update ecosystem.config.js with new path"
echo ""
echo "3. Run server as the new user:"
echo "   sudo -u $USERNAME pm2 start $PROJECT_DIR/ecosystem.config.js"
echo ""
echo "4. Enable auto-start:"
echo "   sudo -u $USERNAME pm2 startup"
echo "   (Run the command it outputs)"
echo ""
echo "⚠️  Important:"
echo "   - The server will now run as $USERNAME"
echo "   - It cannot access your personal files"
echo "   - All project files should be in $PROJECT_DIR"
echo ""

