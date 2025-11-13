# Standalone Test Version - Planning & Porting Guide

## Overview

The **Standalone Test** version is a self-contained HTML file that embeds all CSV and JSON data directly into the HTML, allowing it to work without a web server. This enables seamless sharing and testing on iPhone, iPad, and Mac by simply double-clicking the file.

## File Structure

```
user-testing/
├── standalone-test.html          # Current standalone version (all data embedded)
├── STANDALONE_TEST_PLAN.md       # This file - planning and porting guide
├── build-standalone.sh           # Automated build script
└── README.md                     # Quick reference guide
```

## Current Standalone Test Version

**File:** `user-testing/standalone-test.html`  
**Size:** ~378KB  
**Data Embedded:**
- 397 suburbs (from `data/suburbs.csv`)
- 32 properties (from `data/properties.csv`)
- Configuration (from `data/config.json`)

## How It Works

### Embedded Data Structure

The standalone version includes three JavaScript variables at the top of the `<script>` section:

```javascript
const embeddedSuburbData = [ /* 397 suburb objects */ ];
const embeddedPropertiesData = [ /* 32 property objects */ ];
const embeddedConfigData = { /* config object */ };
```

### Data Loading Logic

All three load functions (`loadSuburbsData()`, `loadPropertiesData()`, `loadConfigData()`) follow this pattern:

1. **First:** Check if embedded data exists (for standalone use)
2. **Fallback:** Try to fetch from CSV/JSON files (for development with server)

This allows the same file to work both ways:
- **Standalone:** Opens directly, uses embedded data
- **Development:** Works with local server, uses CSV/JSON files

## Porting Process: Main Website → Standalone Test

Whenever `index.html` is updated, follow these steps to create a new standalone test version:

### Step 1: Generate Embedded Data

Run the Python script to extract and format data:

```bash
python3 << 'PYTHON_SCRIPT'
import csv
import json
import sys

# Read suburbs CSV
suburbs = []
with open('data/suburbs.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        try:
            suburbs.append({
                'name': row.get('suburb', ''),
                'postcode': str(row.get('postcode', '')),
                'lga': row.get('lga', ''),
                'latitude': float(row['latitude']) if row.get('latitude') and row['latitude'] != '' else None,
                'longitude': float(row['longitude']) if row.get('longitude') and row['longitude'] != '' else None,
                'medianPrice': float(row['medianPrice']) if row.get('medianPrice') and row['medianPrice'] != '' else 0,
                'growth1yr': float(row['growth1yr']) if row.get('growth1yr') and row['growth1yr'] != '' else 0,
                'rentalYield': float(row['rentalYield']) if row.get('rentalYield') and row['rentalYield'] != '' else 0,
                'irsd_score': float(row['irsd_score']) if row.get('irsd_score') and row['irsd_score'] != '' else 0,
                'irsd_decile': int(float(row['irsd_decile'])) if row.get('irsd_decile') and row['irsd_decile'] != '' else 0,
                'ier_score': float(row['ier_score']) if row.get('ier_score') and row['ier_score'] != '' else 0,
                'ier_decile': int(float(row['ier_decile'])) if row.get('ier_decile') and row['ier_decile'] != '' else 0,
                'ieo_score': float(row['ieo_score']) if row.get('ieo_score') and row['ieo_score'] != '' else 0,
                'ieo_decile': int(float(row['ieo_decile'])) if row.get('ieo_decile') and row['ieo_decile'] != '' else 0,
                'transitScore': float(row['transitScore']) if row.get('transitScore') and row['transitScore'] != '' else 0,
                'walkScore': float(row['walkScore']) if row.get('walkScore') and row['walkScore'] != '' else 0,
                'schoolRating': float(row['schoolRating']) if row.get('schoolRating') and row['schoolRating'] != '' else 60,
                'schoolCount': int(float(row['schoolCount'])) if row.get('schoolCount') and row['schoolCount'] != '' else 0,
                'parksDensity': float(row['parksDensity']) if row.get('parksDensity') and row['parksDensity'] != '' else 0,
                'childcareCenters': int(float(row['childcareCenters'])) if row.get('childcareCenters') and row['childcareCenters'] != '' else 0,
                'shoppingCenters': int(float(row['shoppingCenters'])) if row.get('shoppingCenters') and row['shoppingCenters'] != '' else 0,
                'cafesRestaurants': int(float(row['cafesRestaurants'])) if row.get('cafesRestaurants') and row['cafesRestaurants'] != '' else 0,
                'cbdDistance': float(row['primaryCommuteMinutes']) if row.get('primaryCommuteMinutes') and row['primaryCommuteMinutes'] != '' else 0
            })
        except Exception as e:
            print(f"Error processing row: {e}", file=sys.stderr)
            continue

# Read properties CSV
properties = []
with open('data/properties.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        properties.append(dict(row))

# Read config JSON
with open('data/config.json', 'r', encoding='utf-8') as f:
    config = json.load(f)

# Write to file
with open('/tmp/embedded_data.js', 'w', encoding='utf-8') as f:
    f.write('// Embedded Data - Generated automatically\n')
    f.write('const embeddedSuburbData = ' + json.dumps(suburbs, indent=2) + ';\n')
    f.write('const embeddedPropertiesData = ' + json.dumps(properties, indent=2) + ';\n')
    f.write('const embeddedConfigData = ' + json.dumps(config, indent=2) + ';\n')

print(f"Generated embedded data: {len(suburbs)} suburbs, {len(properties)} properties")
PYTHON_SCRIPT
```

### Step 2: Copy Main Website

```bash
cp index.html user-testing/standalone-test.html
```

### Step 3: Insert Embedded Data

Find the `<script>` tag and insert the embedded data right after it:

```bash
# Find the insertion point (after <script> tag)
# Insert embedded data
sed -i '' '/<script>/r /tmp/embedded_data.js' user-testing/standalone-test.html
```

Or manually:
1. Open `user-testing/standalone-test.html`
2. Find: `<script>`
3. Insert the contents of `/tmp/embedded_data.js` right after `<script>`

### Step 4: Verify Load Functions

Ensure all three load functions check for embedded data first:

**loadSuburbsData():**
```javascript
async function loadSuburbsData() {
    // First, try to use embedded data (for standalone file)
    if (typeof embeddedSuburbData !== 'undefined' && embeddedSuburbData && embeddedSuburbData.length > 0) {
        suburbData = embeddedSuburbData;
        console.log(`Loaded ${suburbData.length} suburbs from embedded data`);
        return true;
    }
    // ... rest of function (fetch fallback)
}
```

**loadPropertiesData():**
```javascript
async function loadPropertiesData() {
    // First, try to use embedded data (for standalone file)
    if (typeof embeddedPropertiesData !== 'undefined' && embeddedPropertiesData && embeddedPropertiesData.length > 0) {
        propertiesData = embeddedPropertiesData;
        console.log(`Loaded ${propertiesData.length} properties from embedded data`);
        return true;
    }
    // ... rest of function (fetch fallback)
}
```

**loadConfigData():**
```javascript
async function loadConfigData() {
    // First, try to use embedded data (for standalone file)
    if (typeof embeddedConfigData !== 'undefined' && embeddedConfigData && Object.keys(embeddedConfigData).length > 0) {
        configData = embeddedConfigData;
        console.log('Loaded config from embedded data');
        return true;
    }
    // ... rest of function (fetch fallback)
}
```

### Step 5: Test Standalone Version

1. Open `user-testing/standalone-test.html` directly in Safari (double-click)
2. Verify:
   - Data loads (check browser console for "Loaded X from embedded data")
   - All features work (Suburb Scout, Property Evaluator, Current House Evaluation)
   - No fetch errors in console
   - Geolocation works (if testing on device with location services)

### Step 6: Version Naming (Optional)

If you want to keep multiple versions:

```bash
# Create versioned copy
cp user-testing/standalone-test.html user-testing/standalone-test-v1.0.html
```

## Checklist for Each Port

- [ ] Generate embedded data from current CSV/JSON files
- [ ] Copy latest `index.html` to `user-testing/standalone-test.html`
- [ ] Insert embedded data after `<script>` tag
- [ ] Verify load functions check embedded data first
- [ ] Test opening file directly (double-click)
- [ ] Test all features work
- [ ] Check file size is reasonable (< 500KB)
- [ ] Update version number if keeping multiple versions

## Key Differences: Main vs Standalone

| Feature | Main Website (`index.html`) | Standalone Test |
|---------|----------------------------|-----------------|
| **Data Source** | Fetches from `data/*.csv` and `data/*.json` | Embedded JavaScript variables |
| **Server Required** | Yes (for fetch API) | No (works with file://) |
| **File Size** | ~500KB | ~400KB (with embedded data and new features) |
| **Sharing** | Requires folder structure | Single file |
| **Use Case** | Development, production | User testing, sharing |

## Future Improvements

1. **Automated Build Script:** Create `build-standalone.sh` to automate the porting process
2. **Version History:** Keep multiple standalone versions for comparison
3. **Data Compression:** Consider minifying embedded JSON to reduce file size
4. **Incremental Updates:** Only update embedded data if CSV/JSON files changed

## Recent Updates (2025-01-13)

### New Features Added to Standalone Test:
- ✅ **Onboarding System** - Multi-step preference questionnaire (goal, budget, family status, safety, geographic categories)
- ✅ **Password-Protected Testing Access** - "Hampz" password for full paid features
- ✅ **Full A-Score Breakdowns** - All 38 data points visible in testing mode
- ✅ **Full B-Score Breakdowns** - All 23 data points visible in testing mode
- ✅ **Unlimited Searches** - No search limits when testing mode is active
- ✅ **Testing Mode** - Unblurred detailed metrics for validation

### Updated Features:
- Enhanced suburb display with complete tier breakdowns
- Testing mode automatically removes blur from all detailed metrics
- Preference-based scoring integration
- Geographic category filtering support

### Porting Notes:
When porting the latest `index.html` to standalone-test.html, ensure:
1. Onboarding modal HTML is included (after navigation, before hero section)
2. All onboarding JavaScript functions are included
3. Testing mode functions (`isTestingMode()`, `removeBlurFromMetrics()`) are included
4. Preference storage and application logic is included
5. Password modal HTML and functions are included
6. Updated score display functions with conditional blur removal

## Notes

- The standalone version maintains backward compatibility - it still tries to fetch if embedded data isn't found
- This allows the same file to work in both standalone and development modes
- Always test the standalone version after porting to ensure all features work
- File size will grow as data grows - monitor and optimize if needed
- **Scoring Calculation:** All scores are calculated client-side (in the user's browser) using JavaScript - no server-side processing required

---

**Last Updated:** 2025-01-13  
**Current Standalone Version:** v2.0 (397 suburbs, 32 properties, with onboarding and testing features)

---

## File History Log

**Note:** When adding new files to `user-testing/`, update this section with:
- Date added
- Filename
- Purpose/description
- Key details (size, features, etc.)

### 2025-01-13 (Initial)
- **standalone-test.html** - Initial standalone test version
  - Embedded: 397 suburbs, 32 properties, config data
  - Size: ~387KB
  - Features: All website features working without server

### 2025-01-13 (Update - v2.0)
- **standalone-test.html** - Updated with Phase 1 & 2 features
  - Added: Onboarding system (6-step questionnaire)
    - Primary goal selection (Investment/Balanced/Lifestyle)
    - Budget range input (Min/Max)
    - Family status selection
    - Safety priority slider (1-10)
    - Geographic categories multi-select (BAYSIDE, HILLS & RANGES, INNER METRO, OUTER GROWTH)
    - Review and save preferences
  - Added: Password-protected testing access ("Hampz" password)
  - Added: Full A-Score breakdowns (all 38 data points visible in testing mode)
  - Added: Full B-Score breakdowns (all 23 data points visible in testing mode)
  - Added: Testing mode functionality
    - Unlimited suburb searches
    - Unblurred detailed metrics
    - Complete tier breakdowns with weights and percentages
  - Added: Preference-based scoring integration
  - Size: ~400KB (estimated with new features)
  - Features: Complete test functionality for suburb scouting and property evaluation
  
- **STANDALONE_TEST_PLAN.md** - Planning and porting guide
  - Complete documentation for standalone test process
  - Step-by-step porting instructions
  - Checklist and best practices
  
- **build-standalone.sh** - Automated build script
  - Generates embedded data from CSV/JSON
  - Automates porting process from main website
  - Executable script for easy use
  
- **README.md** - Quick reference guide
  - Overview of standalone test versions
  - Quick start instructions
  - When to create new versions

