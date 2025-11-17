# User Testing - Standalone Test Versions

This folder contains standalone test versions of the HomeScorePro website for easy sharing and testing.

## Quick Start

**To use the standalone test:**
1. Open `standalone-test.html` in Safari (double-click the file)
2. All features work immediately - no server needed!

**To create a new standalone test version:**
```bash
./build-standalone.sh
```

## Files

- **`standalone-test.html`** - Current standalone test version (all data embedded, works without server)
- **`STANDALONE_TEST_PLAN.md`** - Complete planning and porting guide
- **`build-standalone.sh`** - Automated script to port main website to standalone version
- **`README.md`** - This file

## What is a Standalone Test?

A standalone test version is a single HTML file that:
- ✅ Works without a web server (just double-click to open)
- ✅ Contains all data embedded (397 suburbs, 32 properties, config)
- ✅ Perfect for sharing via iCloud, AirDrop, email
- ✅ Works on iPhone, iPad, and Mac Safari

## When to Create a New Standalone Test

Create a new standalone test version whenever:
- The main website (`index.html`) is updated with new features
- Data files (`data/*.csv`, `data/*.json`) are updated
- You want to share a test version with users

## How It Works

The standalone version embeds all CSV and JSON data as JavaScript variables directly in the HTML file. The load functions check for embedded data first, then fall back to fetching from files (for development).

---

**Last Updated:** 2025-11-17

