# How to Start the Dev Server

## Quick Start

**Open Terminal and run these commands:**

```bash
cd "/Users/jaeilchoi/Library/Mobile Documents/com~apple~CloudDocs/homescorepro/react-app"
npm run dev
```

## What You'll See

After running `npm run dev`, you should see output like:

```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

## Then Open in Browser

1. **Copy the URL** from the terminal (usually `http://localhost:3000/`)
2. **Open Safari** (or any browser)
3. **Paste the URL** in the address bar
4. **Press Enter**

## Troubleshooting

**If you see "Safari Can't Connect":**
- Make sure the dev server is running (check terminal)
- Make sure you're using the correct port (3000 or 3001)
- Try refreshing the page

**If the server won't start:**
- Make sure you're in the `react-app` directory
- Make sure Node.js is installed: `node --version`
- Try running `npm install` first

**To stop the server:**
- Press `Ctrl + C` in the terminal where it's running

