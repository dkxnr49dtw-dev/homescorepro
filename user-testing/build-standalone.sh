#!/bin/bash

# Build Standalone Test Version
# This script ports the main website (index.html) to a standalone test version
# with all data embedded for easy sharing and testing

set -e  # Exit on error

echo "🏗️  Building Standalone Test Version..."
echo ""

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: index.html not found. Run this script from the project root."
    exit 1
fi

# Step 1: Generate embedded data
echo "📊 Step 1: Generating embedded data from CSV/JSON files..."
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

print(f"✅ Generated embedded data: {len(suburbs)} suburbs, {len(properties)} properties")
PYTHON_SCRIPT

if [ $? -ne 0 ]; then
    echo "❌ Error generating embedded data"
    exit 1
fi

# Step 2: Create user-testing directory if it doesn't exist
echo ""
echo "📁 Step 2: Setting up user-testing directory..."
mkdir -p user-testing

# Step 3: Copy main website
echo "📋 Step 3: Copying index.html to standalone-test.html..."
cp index.html user-testing/standalone-test.html

# Step 4: Insert embedded data
echo "🔧 Step 4: Inserting embedded data..."
# Find the script tag and insert data after it
# On macOS, use sed with empty string for backup
if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' '/<script>/r /tmp/embedded_data.js' user-testing/standalone-test.html
else
    sed -i '/<script>/r /tmp/embedded_data.js' user-testing/standalone-test.html
fi

# Step 5: Verify load functions have embedded data checks
echo "✅ Step 5: Verifying load functions..."
if grep -q "typeof embeddedSuburbData" user-testing/standalone-test.html && \
   grep -q "typeof embeddedPropertiesData" user-testing/standalone-test.html && \
   grep -q "typeof embeddedConfigData" user-testing/standalone-test.html; then
    echo "   ✅ All load functions check for embedded data"
else
    echo "   ⚠️  Warning: Some load functions may not check for embedded data"
    echo "   Please verify manually"
fi

# Step 6: Get file size
FILE_SIZE=$(ls -lh user-testing/standalone-test.html | awk '{print $5}')
echo ""
echo "✨ Standalone test version created successfully!"
echo ""
echo "📄 File: user-testing/standalone-test.html"
echo "📦 Size: $FILE_SIZE"
echo ""
echo "🧪 Next steps:"
echo "   1. Open user-testing/standalone-test.html in Safari"
echo "   2. Test all features (Suburb Scout, Property Evaluator, etc.)"
echo "   3. Check browser console for 'Loaded X from embedded data' messages"
echo "   4. Verify no fetch errors"
echo ""

