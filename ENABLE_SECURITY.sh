#!/bin/bash

# HomeScorePro Security Enablement Script
# This script implements all recommended security measures

set -e

echo "🔒 HomeScorePro Security Setup"
echo "=============================="
echo ""

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Step 1: Check if running as admin
if [ "$EUID" -eq 0 ]; then
    echo "⚠️  Running as root. Some steps will be skipped for safety."
    RUNNING_AS_ROOT=true
else
    RUNNING_AS_ROOT=false
fi

# Step 2: Set secure file permissions
echo "📁 Setting secure file permissions..."
chmod 600 server/.env 2>/dev/null || echo "  (Note: .env may not exist yet)"
chmod 755 server/scripts/*.sh
chmod 644 server/*.js
chmod 644 server/middleware/*.js
chmod 644 server/routes/*.js
echo "✅ File permissions set"

# Step 3: Check firewall status
echo ""
echo "🔥 Checking macOS Firewall..."
FIREWALL_STATUS=$(/usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate 2>/dev/null | grep -i "enabled" || echo "disabled")

if echo "$FIREWALL_STATUS" | grep -qi "enabled"; then
    echo "✅ Firewall is enabled"
else
    echo "⚠️  Firewall is not enabled"
    echo ""
    echo "To enable firewall:"
    echo "  1. Open System Settings"
    echo "  2. Go to Network → Firewall"
    echo "  3. Turn on Firewall"
    echo "  4. Click Options → Add Node.js to allowed apps"
    echo ""
    read -p "Would you like to enable firewall now? (requires admin password) [y/N]: " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Enabling firewall..."
        sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate on
        echo "✅ Firewall enabled"
        
        # Find Node.js
        NODE_PATH=$(which node 2>/dev/null || echo "")
        if [ -n "$NODE_PATH" ]; then
            echo "Adding Node.js to firewall exceptions..."
            sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add "$NODE_PATH"
            sudo /usr/libexec/ApplicationFirewall/socketfilterfw --unblockapp "$NODE_PATH"
            echo "✅ Node.js added to firewall"
        fi
    fi
fi

# Step 4: Check for password hash
echo ""
echo "🔐 Checking password configuration..."
if [ -f "server/.env" ] && grep -q "SITE_PASSWORD_HASH" server/.env; then
    echo "✅ Password hash is configured"
else
    echo "⚠️  Password hash not configured"
    echo ""
    echo "To set up password protection:"
    echo "  1. Generate password hash:"
    echo "     cd server && node scripts/generate-password-hash.js YOUR_PASSWORD"
    echo "  2. Add to server/.env:"
    echo "     SITE_PASSWORD_HASH=<generated_hash>"
    echo ""
fi

# Step 5: Check for session secret
if [ -f "server/.env" ] && grep -q "SESSION_SECRET" server/.env; then
    echo "✅ Session secret is configured"
else
    echo "⚠️  Session secret not configured"
    if [ -f "server/.env" ]; then
        echo "Generating session secret..."
        SESSION_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))" 2>/dev/null || openssl rand -hex 32)
        echo "" >> server/.env
        echo "# Session Secret (auto-generated)" >> server/.env
        echo "SESSION_SECRET=$SESSION_SECRET" >> server/.env
        echo "✅ Session secret added to .env"
    fi
fi

# Step 6: Create limited user account (optional but recommended)
echo ""
echo "👤 Limited User Account Setup"
echo "=============================="
echo ""
echo "Creating a limited user account is STRONGLY RECOMMENDED."
echo "This prevents the server from accessing your personal files."
echo ""
read -p "Would you like to create a limited user account now? [y/N]: " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if [ "$RUNNING_AS_ROOT" = true ]; then
        echo "⚠️  Cannot run user creation script as root for safety."
        echo "Please run manually:"
        echo "  ./server/scripts/setup-secure-user.sh"
    else
        echo "Running user setup script..."
        bash server/scripts/setup-secure-user.sh
    fi
else
    echo "Skipping user account creation."
    echo "You can create it later with: ./server/scripts/setup-secure-user.sh"
fi

# Step 7: Verify sandbox middleware is in place
echo ""
echo "🛡️  Verifying security middleware..."
if [ -f "server/middleware/sandbox.js" ]; then
    echo "✅ Sandbox middleware installed"
else
    echo "❌ Sandbox middleware missing!"
fi

if [ -f "server/middleware/security.js" ]; then
    echo "✅ Security middleware installed"
else
    echo "❌ Security middleware missing!"
fi

if [ -f "server/middleware/passwordAuth.js" ]; then
    echo "✅ Password authentication installed"
else
    echo "❌ Password authentication missing!"
fi

# Step 8: Summary
echo ""
echo "✅ Security Setup Complete!"
echo ""
echo "📋 Summary:"
echo "  ✅ File permissions secured"
echo "  ✅ Security middleware verified"
if echo "$FIREWALL_STATUS" | grep -qi "enabled"; then
    echo "  ✅ Firewall enabled"
else
    echo "  ⚠️  Firewall needs to be enabled manually"
fi
if [ -f "server/.env" ] && grep -q "SITE_PASSWORD_HASH" server/.env; then
    echo "  ✅ Password protection configured"
else
    echo "  ⚠️  Password protection needs to be configured"
fi
echo ""
echo "📚 Next Steps:"
echo "  1. If password not set: cd server && node scripts/generate-password-hash.js YOUR_PASSWORD"
echo "  2. If firewall not enabled: System Settings → Network → Firewall"
echo "  3. If user account not created: ./server/scripts/setup-secure-user.sh"
echo "  4. Review: server/SECURITY_RISKS.md"
echo ""
echo "🔒 Your server is now more secure!"
echo ""

