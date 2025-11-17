# Quick Start Guide

## Location
The React app is located at:
```
/Users/jaeilchoi/Library/Mobile Documents/com~apple~CloudDocs/homescorepro/react-app
```

## To Run the Development Server

### Option 1: Using Full Path
```bash
cd "/Users/jaeilchoi/Library/Mobile Documents/com~apple~CloudDocs/homescorepro/react-app"
npm install
npm run dev
```

### Option 2: Using Relative Path (from homescorepro directory)
```bash
cd ~/Library/Mobile\ Documents/com~apple~CloudDocs/homescorepro
cd react-app
npm install
npm run dev
```

### Option 3: Create an Alias (Recommended)
Add this to your `~/.zshrc` or `~/.bashrc`:
```bash
alias homescorepro='cd "/Users/jaeilchoi/Library/Mobile Documents/com~apple~CloudDocs/homescorepro"'
```

Then you can simply run:
```bash
homescorepro
cd react-app
npm run dev
```

## What to Expect

After running `npm run dev`, you should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

Open `http://localhost:3000` in your browser to see the React app.

## Troubleshooting

If you get "command not found" errors:
1. Make sure you're in the `react-app` directory
2. Make sure Node.js is installed: `node --version`
3. Make sure npm is installed: `npm --version`
4. Run `npm install` first if you haven't already

If you get path errors:
- The path has spaces, so make sure to use quotes: `"path with spaces"`
- Or escape spaces: `path\ with\ spaces`

