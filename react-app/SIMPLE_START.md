# Simple Start Guide

## You're in the homescorepro directory - that's correct!

From where you are now, just run:

```bash
cd react-app
npm run dev
```

## Or use the helper script:

```bash
./react-app/run-dev.sh
```

## What you should see:

After running `npm run dev`, you'll see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
```

Then open `http://localhost:3000` in your browser!

## If you get errors:

1. **"No such file or directory"** - Make sure you're in the homescorepro directory first
2. **"npm: command not found"** - Node.js isn't installed or not in PATH
3. **"Cannot find module"** - Run `npm install` first

## Current Directory Check:

Run this to see where you are:
```bash
pwd
```

You should see: `/Users/jaeilchoi/Library/Mobile Documents/com~apple~CloudDocs/homescorepro`

Then:
```bash
cd react-app
pwd
```

You should see: `/Users/jaeilchoi/Library/Mobile Documents/com~apple~CloudDocs/homescorepro/react-app`

