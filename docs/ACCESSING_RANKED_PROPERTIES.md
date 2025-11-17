# How to Access Ranked Properties (properties.csv data)

## Quick Access Methods

### Method 1: Hero Section Button (Easiest)
1. Navigate to the **Members** page (`/members`)
2. Scroll to the top hero section
3. Click the **"🏆 View Ranked Properties"** button
   - This button is prominently displayed in the hero section
   - It will automatically switch to the Ranked Properties tab and scroll to it

### Method 2: Tab Navigation
1. Navigate to the **Members** page (`/members`)
2. Scroll down to the **"🏠 Property Evaluator (B-Score)"** section
3. Click the **"🏆 Ranked Properties"** tab button
   - Located alongside "📍 Suburb Analysis (A-Score)" and "🏠 Property Evaluation (B-Score)" tabs

### Method 3: Direct Navigation
1. Click **"Sign In"** in the top navigation bar (links to `/members`)
2. Once on the Members page, use Method 1 or Method 2 above

## What You'll See

The Ranked Properties view displays:
- **All properties from properties.csv** sorted by B-Score (highest first)
- **Rank badges** (#1, #2, #3, etc.) - top 3 highlighted in orange
- **Property details**: Address, suburb, postcode, price
- **B-Score display**: Overall score prominently shown
- **Tier scores**: T1-T5 breakdown for each property
- **Click any property card** to see detailed breakdown with:
  - Full B-Score breakdown by metric
  - Tier scores with weights
  - Property information

## Features

- **Automatic ranking**: Properties are automatically sorted by B-Score
- **Real-time calculation**: B-Scores are calculated on-the-fly if not already in CSV
- **Detailed breakdown**: Click any property to see full metric breakdown
- **Responsive design**: Works on desktop and mobile

## Data Source

The ranked properties are loaded from:
- **File**: `data/properties.csv` (FOR PERSONAL USE ONLY - test data for B-Score functionality)
- **Note**: This file contains test data for personal testing only. Not for commercial use or distribution.

