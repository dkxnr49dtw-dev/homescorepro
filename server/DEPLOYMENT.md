# Server Deployment Guide

**Last Updated:** 2025-11-20  
**Purpose:** Deploy HomeScorePro React app + Express server to free hosting platforms

---

## Quick Deploy Options

### Option 1: Railway (Recommended - Free Tier Available)
- **Free tier:** $5 credit/month, 500 hours runtime
- **Easy setup:** Connect GitHub, auto-deploys
- **URL:** https://railway.app

### Option 2: Render (Free Tier)
- **Free tier:** 750 hours/month, spins down after inactivity
- **Easy setup:** Connect GitHub, auto-deploys
- **URL:** https://render.com

### Option 3: Fly.io (Free Tier)
- **Free tier:** 3 shared VMs, 160GB outbound data
- **Global edge deployment**
- **URL:** https://fly.io

### Option 4: Vercel (Free Tier - Frontend Only)
- **Free tier:** Unlimited bandwidth, 100GB
- **Best for:** Static React app only
- **URL:** https://vercel.com

---

## Setup: Express Server Serving React App

The server is configured to serve the built React app in production.

### Build Process

1. **Build React app:**
```bash
cd react-app
npm install
npm run build
```

2. **Start server:**
```bash
cd server
npm install
NODE_ENV=production npm start
```

The server will:
- Serve API routes at `/api/*`
- Serve React app static files from `react-app/dist`
- Handle SPA routing (all non-API routes serve `index.html`)

---

## Railway Deployment

### Step 1: Prepare Repository

1. Create `railway.json` in root:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "cd server && npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

2. Create `Procfile` in root:
```
web: cd server && npm start
```

### Step 2: Deploy to Railway

1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect Node.js
5. Set environment variables:
   - `NODE_ENV=production`
   - `PORT=3000` (Railway sets this automatically)
   - Add other required env vars from `.env.example`

### Step 3: Build Script

Railway needs to build the React app first. Add to `package.json` in root:

```json
{
  "scripts": {
    "build": "cd react-app && npm install && npm run build",
    "start": "cd server && npm start"
  }
}
```

---

## Render Deployment

### Step 1: Create `render.yaml`

Create `render.yaml` in root:

```yaml
services:
  - type: web
    name: homescorepro
    env: node
    buildCommand: cd react-app && npm install && npm run build
    startCommand: cd server && npm install && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 3000
```

### Step 2: Deploy

1. Go to https://render.com
2. Click "New" → "Web Service"
3. Connect GitHub repository
4. Render will use `render.yaml` automatically
5. Add environment variables in dashboard

---

## Fly.io Deployment

### Step 1: Install Fly CLI

```bash
curl -L https://fly.io/install.sh | sh
```

### Step 2: Create `fly.toml`

```toml
app = "homescorepro"
primary_region = "iad"

[build]
  builder = "paketobuildpacks/builder:base"

[env]
  NODE_ENV = "production"
  PORT = "3000"

[http_service]
  internal_port = 3000
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0
  processes = ["app"]

[[services]]
  protocol = "tcp"
  internal_port = 3000
```

### Step 3: Deploy

```bash
fly launch
fly deploy
```

---

## Environment Variables

Set these in your hosting platform:

```env
NODE_ENV=production
PORT=3000
ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com

# Database (if using)
DATABASE_URL=postgresql://...

# JWT (if using auth)
JWT_SECRET=your-secret-key

# Other API keys as needed
```

---

## Build Script for Hosting Platforms

Create `package.json` in root directory:

```json
{
  "name": "homescorepro",
  "version": "1.0.0",
  "scripts": {
    "build": "cd react-app && npm install && npm run build",
    "start": "cd server && npm install && npm start",
    "postinstall": "cd react-app && npm install && cd ../server && npm install"
  }
}
```

---

## Testing Locally

1. Build React app:
```bash
cd react-app
npm run build
```

2. Start server:
```bash
cd server
NODE_ENV=production npm start
```

3. Visit: http://localhost:3000

---

## Notes

- The server serves the React app at the root (`/`)
- API routes are at `/api/*`
- All other routes serve the React app (SPA routing)
- In development, React app runs separately on port 8000
- In production, server serves everything on one port

