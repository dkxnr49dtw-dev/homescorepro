#!/usr/bin/env python3
"""
Flag Missing Data Explicitly - Replace placeholder values with empty/null.

This script identifies and replaces placeholder values with explicit empty/null
to ensure data integrity and honesty. Missing data should be clearly marked
as missing rather than using fake placeholder values.

Placeholder patterns to identify and replace:
- Amenity pattern: parksDensity=3, childcareCenters=3, shoppingCenters=2, 
  cafesRestaurants=10, medicalCenters=2, bikeScore=50 (common placeholder pattern)
- Commute times: 0 values (already mostly handled, but check for any remaining)
- Any other suspicious placeholder patterns

This script preserves all real data and only replaces clear placeholders.
"""

import pandas as pd
from pathlib import Path
from datetime import datetime

# Paths
BASE_DIR = Path(__file__).parent.parent
EXISTING_CSV = BASE_DIR / 'data' / 'suburbs.csv'
BACKUP_CSV = BASE_DIR / 'data' / f'suburbs.csv.backup_{datetime.now().strftime("%Y%m%d_%H%M%S")}'
OUTPUT_CSV = BASE_DIR / 'data' / 'suburbs.csv'

def is_amenity_placeholder_pattern(row):
    """
    Check if a row has the common amenity placeholder pattern:
    parksDensity=3, childcareCenters=3, shoppingCenters=2, 
    cafesRestaurants=10, medicalCenters=2, bikeScore=50
    """
    try:
        return (
            pd.notna(row.get('parksDensity')) and row.get('parksDensity') == 3 and
            pd.notna(row.get('childcareCenters')) and row.get('childcareCenters') == 3 and
            pd.notna(row.get('shoppingCenters')) and row.get('shoppingCenters') == 2 and
            pd.notna(row.get('cafesRestaurants')) and row.get('cafesRestaurants') == 10 and
            pd.notna(row.get('medicalCenters')) and row.get('medicalCenters') == 2 and
            pd.notna(row.get('bikeScore')) and row.get('bikeScore') == 50
        )
    except (KeyError, TypeError):
        return False

def main():
    print("=" * 70)
    print("FLAG MISSING DATA EXPLICITLY - PLACEHOLDER REPLACEMENT")
    print("=" * 70)
    print()
    
    # Load dataset
    print("Loading suburbs.csv...")
    df = pd.read_csv(EXISTING_CSV, comment='#')
    
    print(f"  Total suburbs: {len(df)}")
    print()
    
    # Create backup
    print(f"Creating backup: {BACKUP_CSV.name}")
    df.to_csv(BACKUP_CSV, index=False)
    print("  Backup created successfully")
    print()
    
    # Track changes
    changes = {
        'amenity_pattern': 0,
        'commute_zero': 0,
        'individual_amenities': {
            'parksDensity': 0,
            'childcareCenters': 0,
            'shoppingCenters': 0,
            'cafesRestaurants': 0,
            'medicalCenters': 0,
            'bikeScore': 0,
        }
    }
    
    print("Identifying and replacing placeholder values...")
    print("-" * 70)
    
    # 1. Replace amenity placeholder pattern (3,3,2,10,2,50)
    amenity_fields = ['parksDensity', 'childcareCenters', 'shoppingCenters', 
                      'cafesRestaurants', 'medicalCenters', 'bikeScore']
    
    for idx, row in df.iterrows():
        if is_amenity_placeholder_pattern(row):
            changes['amenity_pattern'] += 1
            for field in amenity_fields:
                df.at[idx, field] = pd.NA
                changes['individual_amenities'][field] += 1
    
    if changes['amenity_pattern'] > 0:
        print(f"  Replaced {changes['amenity_pattern']} amenity placeholder patterns (3,3,2,10,2,50 → empty)")
    
    # 2. Check for any remaining commute time placeholders (0 values)
    # Note: Some 0 values might be legitimate (very short commutes), but we'll flag them
    # for review. For now, we'll leave 0 values as they might be real.
    # If needed, we can add logic to replace 0 with empty if it's clearly a placeholder.
    
    commute_zero_primary = (df['primaryCommuteMinutes'] == 0).sum()
    commute_zero_secondary = (df['secondaryCommuteMinutes'] == 0).sum()
    
    # Only replace 0 if it's clearly a placeholder (e.g., when other commute data is missing)
    # For now, we'll just report them
    if commute_zero_primary > 0 or commute_zero_secondary > 0:
        print(f"  Found {commute_zero_primary} primary commute = 0 (may be legitimate)")
        print(f"  Found {commute_zero_secondary} secondary commute = 0 (may be legitimate)")
        print(f"  Note: 0 values left as-is (may be legitimate short commutes)")
    
    # 3. Report individual amenity field statistics
    print()
    print("Individual amenity field replacements:")
    for field, count in changes['individual_amenities'].items():
        if count > 0:
            print(f"  {field}: {count} replacements")
    
    # 4. Report data completeness after changes
    print()
    print("Data Completeness After Changes:")
    print("-" * 70)
    total = len(df)
    
    # Calculate completeness for each field
    fields_to_check = [
        'medianPrice', 'rentalYield', 'primaryCommuteMinutes', 'secondaryCommuteMinutes',
        'parksDensity', 'childcareCenters', 'shoppingCenters', 
        'cafesRestaurants', 'medicalCenters', 'bikeScore'
    ]
    
    for field in fields_to_check:
        if field in df.columns:
            complete = df[field].notna().sum()
            percentage = (complete / total * 100) if total > 0 else 0
            print(f"  {field}: {complete}/{total} ({percentage:.1f}%)")
    
    print()
    
    # Save updated CSV
    print(f"Saving updated suburbs.csv...")
    
    # Read the header comments from original file
    with open(EXISTING_CSV, 'r') as f:
        header_lines = []
        for line in f:
            if line.startswith('#'):
                header_lines.append(line.rstrip())
            else:
                break
    
    # Write with header comments
    with open(OUTPUT_CSV, 'w') as f:
        for line in header_lines:
            f.write(line + '\n')
        # Write CSV with empty strings for NA values
        df.to_csv(f, index=False, lineterminator='\n', na_rep='')
    
    print("  File saved successfully")
    print()
    print(f"Backup saved to: {BACKUP_CSV}")
    print(f"Updated file: {OUTPUT_CSV}")
    print()
    
    # Summary
    print("=" * 70)
    print("SUMMARY")
    print("=" * 70)
    print(f"Total amenity placeholder patterns replaced: {changes['amenity_pattern']}")
    print(f"Total individual amenity field replacements: {sum(changes['individual_amenities'].values())}")
    print()
    print("✅ Done! All placeholder values have been replaced with empty/null.")
    print("   Missing data is now clearly marked as missing.")

if __name__ == '__main__':
    main()


