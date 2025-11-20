# Mac Mini Hosting Setup

**Last Updated:** 2025-11-20  
**Purpose:** Host HomeScorePro on your Mac Mini with internet access

---

## Quick Start

1. **Build and start the server:**
```bash
cd "/Users/jason/Library/Mobile Documents/com~apple~CloudDocs/homescorepro"
./start-server.sh
```

2. **Access locally:** http://localhost:3000

3. **Access from internet:** http://YOUR_PUBLIC_IP:3000 (see "Making it Public" below)

---

## Setup Steps

### 1. Install PM2 (Process Manager)

PM2 keeps your server running even if it crashes or you restart your Mac.

```bash
npm install -g pm2
```

### 2. Build React App

```bash
cd react-app
npm install
npm run build
```

### 3. Start Server with PM2

```bash
cd "/Users/jason/Library/Mobile Documents/com~apple~CloudDocs/homescorepro"
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

The `pm2 startup` command will show you a command to run as sudo - copy and run it.

### 4. Check Status

```bash
pm2 status
pm2 logs homescorepro
```

---

## Making it Public (Internet Access)

### Option 1: Port Forwarding (Recommended)

1. **Find your Mac Mini's local IP:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```
Look for something like `192.168.1.100`

2. **Find your public IP:**
```bash
curl ifconfig.me
```

3. **Configure Router Port Forwarding:**
   - Log into your router (usually http://192.168.1.1 or http://192.168.0.1)
   - Find "Port Forwarding" or "Virtual Server" settings
   - Add rule:
     - **External Port:** 3000 (or 80 for standard HTTP)
     - **Internal IP:** Your Mac Mini's IP (from step 1)
     - **Internal Port:** 3000
     - **Protocol:** TCP

4. **Access from internet:** `http://YOUR_PUBLIC_IP:3000`

### Option 2: Dynamic DNS (For Permanent URL)

If your public IP changes, use a dynamic DNS service:

1. **Sign up for free DDNS:**
   - No-IP: https://www.noip.com (free)
   - DuckDNS: https://www.duckdns.org (free)
   - Dynu: https://www.dynu.com (free)

2. **Install DDNS updater on Mac:**
```bash
# For DuckDNS (easiest)
# Just update via URL: https://www.duckdns.org/update?domains=YOURDOMAIN&token=YOURTOKEN
```

3. **Access via:** `http://yourdomain.duckdns.org:3000`

### Option 3: Cloudflare Tunnel (No Port Forwarding Needed)

1. **Install cloudflared:**
```bash
brew install cloudflare/cloudflare/cloudflared
```

2. **Create tunnel:**
```bash
cloudflared tunnel create homescorepro
cloudflared tunnel route dns homescorepro yourdomain.com
cloudflared tunnel run homescorepro
```

This creates a secure tunnel without opening ports on your router.

---

## Server Management

### Start Server
```bash
pm2 start homescorepro
```

### Stop Server
```bash
pm2 stop homescorepro
```

### Restart Server
```bash
pm2 restart homescorepro
```

### View Logs
```bash
pm2 logs homescorepro
```

### Monitor
```bash
pm2 monit
```

### Rebuild and Restart (After Code Changes)
```bash
cd react-app && npm run build && cd .. && pm2 restart homescorepro
```

---

## Auto-Start on Mac Boot

PM2 startup command (run the output from `pm2 startup`):

```bash
sudo env PATH=$PATH:/usr/local/bin /usr/local/lib/node_modules/pm2/bin/pm2 startup launchd -u YOUR_USERNAME --hp /Users/YOUR_USERNAME
```

Replace `YOUR_USERNAME` with your Mac username.

---

## Security Considerations

1. **Firewall:** Allow port 3000 in System Settings → Network → Firewall
2. **HTTPS:** Consider using Cloudflare Tunnel or nginx reverse proxy with Let's Encrypt
3. **Rate Limiting:** Already configured in server
4. **CORS:** Update `ALLOWED_ORIGINS` in `.env` if needed

---

## Environment Variables

Create `server/.env`:

```env
NODE_ENV=production
PORT=3000
ALLOWED_ORIGINS=http://localhost:3000,http://YOUR_PUBLIC_IP:3000,http://yourdomain.com:3000
```

---

## Troubleshooting

### Server won't start
```bash
pm2 logs homescorepro --lines 50
```

### Port already in use
```bash
lsof -i :3000
kill -9 <PID>
```

### Can't access from internet
1. Check firewall: `System Settings → Network → Firewall`
2. Check router port forwarding
3. Check your public IP hasn't changed
4. Test locally first: `curl http://localhost:3000/health`

### React app not loading
1. Rebuild: `cd react-app && npm run build`
2. Check `react-app/dist` exists
3. Check server logs: `pm2 logs homescorepro`

---

## Quick Commands Reference

```bash
# Build React app
cd react-app && npm run build

# Start server
pm2 start ecosystem.config.js

# Stop server
pm2 stop homescorepro

# Restart server
pm2 restart homescorepro

# View logs
pm2 logs homescorepro

# Rebuild and restart
cd react-app && npm run build && cd .. && pm2 restart homescorepro

# Check status
pm2 status
```

