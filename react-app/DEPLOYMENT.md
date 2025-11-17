# React App Deployment Guide

**Last Updated:** 2025-11-17  
**Purpose:** Complete deployment guide for the React application

---

## Data Access Solution (Option C - Hybrid)

The React app uses a hybrid approach for data access:

### Development Mode
- **Symlink:** `react-app/public/data` → `../../data` (symlink to root data folder)
- **Access:** Files accessed via `/data/suburbs.csv`, `/data/properties.csv`, `/data/config.json`
- **Benefit:** Fast iteration, changes to data files immediately available

### Production Mode
- **Pre-build Script:** `npm run prebuild` copies data files from `../../data` to `react-app/public/data`
- **Build:** `npm run build` includes copied data files in the `dist/` folder
- **Access:** Same paths (`/data/suburbs.csv`, etc.) work in production
- **Benefit:** Reliable production builds, no symlink issues

---

## Setup Instructions

### 1. Development Setup

```bash
cd react-app

# Create symlink for development (if not already created)
cd public
ln -sf ../../data data
cd ..

# Start dev server
npm run dev
```

The symlink allows the dev server to access data files directly from the root `data/` folder.

### 2. Production Build

```bash
cd react-app

# Build (prebuild script runs automatically)
npm run build

# The prebuild script will:
# 1. Copy all files from ../../data to public/data
# 2. Then Vite builds the app with data files included
```

### 3. Verify Data Access

```bash
# Test data access setup
npm run test:data

# This will verify:
# - public/data exists (for dev)
# - dist/data exists (for production, after build)
# - All required CSV files are present
```

---

## File Structure

```
homescorepro/
├── data/                          # Source data files
│   ├── suburbs.csv
│   ├── properties.csv
│   └── config.json
├── react-app/
│   ├── public/
│   │   └── data/                  # Symlink (dev) or copied files (prod)
│   │       ├── suburbs.csv
│   │       ├── properties.csv
│   │       └── config.json
│   ├── scripts/
│   │   ├── copy-data.js           # Pre-build script
│   │   └── test-data-access.js    # Test script
│   └── dist/                      # Production build output
│       └── data/                  # Copied data files (after build)
│           ├── suburbs.csv
│           ├── properties.csv
│           └── config.json
```

---

## Deployment Options

### Option 1: Netlify

1. **Build Command:** `cd react-app && npm run build`
2. **Publish Directory:** `react-app/dist`
3. **Environment Variables:** None required

The prebuild script will automatically copy data files before the build.

### Option 2: Vercel

1. **Build Command:** `cd react-app && npm run build`
2. **Output Directory:** `react-app/dist`
3. **Root Directory:** `react-app`

### Option 3: GitHub Pages

1. Build the app: `cd react-app && npm run build`
2. Copy `react-app/dist/*` to your GitHub Pages branch
3. Ensure `dist/data/` folder is included

---

## Troubleshooting

### Data Files Not Loading in Dev

**Problem:** `Failed to load suburbs.csv: 404`

**Solution:**
```bash
cd react-app/public
ln -sf ../../data data
```

### Data Files Not Loading in Production

**Problem:** Data files missing in `dist/data/`

**Solution:**
1. Run prebuild manually: `npm run prebuild`
2. Verify files exist: `ls -la react-app/public/data/`
3. Rebuild: `npm run build`
4. Verify dist: `ls -la react-app/dist/data/`

### Build Fails with "Cannot find module"

**Problem:** Prebuild script fails

**Solution:**
1. Ensure you're in `react-app/` directory
2. Check that `../../data` exists: `ls -la ../../data`
3. Run script manually: `node scripts/copy-data.js`

---

## Testing Checklist

Before deploying, verify:

- [ ] `npm run test:data` passes
- [ ] `npm run build` completes successfully
- [ ] `dist/data/` contains all CSV files
- [ ] Dev server loads data correctly (`npm run dev`)
- [ ] Production preview loads data correctly (`npm run preview`)
- [ ] Ranked properties feature works with real data
- [ ] All pages load without errors

---

## Notes

- The symlink approach works on macOS/Linux but may not work on Windows
- For Windows, use the copy script for both dev and production
- The prebuild script automatically runs before `npm run build`
- Data files are included in the build output, so they're available in production

---

**Last Updated:** 2025-11-17


