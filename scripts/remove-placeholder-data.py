#!/usr/bin/env python3
"""
Remove all placeholder data from suburbs.csv based on documentation.

Placeholder patterns to remove:
- medianPrice = 0 → empty
- rentalYield = 4.0 → empty (common placeholder)
- primaryCommuteMinutes = 0 → empty
- secondaryCommuteMinutes = 0 → empty
- Amenity pattern (3, 2, 10, 2, 50) → empty for those fields
- transitScore and walkScore already cleared (keep as is)

This script replaces placeholders with empty strings (which become empty in CSV).
"""

import pandas as pd
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).parent.parent
EXISTING_CSV = BASE_DIR / 'data' / 'suburbs.csv'
BACKUP_CSV = BASE_DIR / 'data' / 'suburbs.csv.backup2'
OUTPUT_CSV = BASE_DIR / 'data' / 'suburbs.csv'

def main():
    print("=" * 70)
    print("REMOVE PLACEHOLDER DATA FROM SUBURBS.CSV")
    print("=" * 70)
    print()
    
    # Load dataset
    print("Loading suburbs.csv...")
    df = pd.read_csv(EXISTING_CSV, comment='#')
    
    print(f"  Total suburbs: {len(df)}")
    print()
    
    # Create backup
    print(f"Creating backup: {BACKUP_CSV}")
    df.to_csv(BACKUP_CSV, index=False)
    print("  Backup created successfully")
    print()
    
    # Track changes
    changes = {
        'price': 0,
        'yield': 0,
        'commute1': 0,
        'commute2': 0,
        'amenities': 0,
    }
    
    print("Removing placeholder data...")
    print("-" * 70)
    
    # Remove price placeholders (0)
    price_mask = df['medianPrice'] == 0
    changes['price'] = price_mask.sum()
    df.loc[price_mask, 'medianPrice'] = pd.NA
    if changes['price'] > 0:
        print(f"  Removed {changes['price']} price placeholders (0 → empty)")
    
    # Remove yield placeholders (4.0)
    yield_mask = df['rentalYield'] == 4.0
    changes['yield'] = yield_mask.sum()
    df.loc[yield_mask, 'rentalYield'] = pd.NA
    if changes['yield'] > 0:
        print(f"  Removed {changes['yield']} yield placeholders (4.0 → empty)")
    
    # Remove commute placeholders (0)
    commute1_mask = df['primaryCommuteMinutes'] == 0
    changes['commute1'] = commute1_mask.sum()
    df.loc[commute1_mask, 'primaryCommuteMinutes'] = pd.NA
    if changes['commute1'] > 0:
        print(f"  Removed {changes['commute1']} primary commute placeholders (0 → empty)")
    
    commute2_mask = df['secondaryCommuteMinutes'] == 0
    changes['commute2'] = commute2_mask.sum()
    df.loc[commute2_mask, 'secondaryCommuteMinutes'] = pd.NA
    if changes['commute2'] > 0:
        print(f"  Removed {changes['commute2']} secondary commute placeholders (0 → empty)")
    
    # Remove amenity placeholders (pattern: 3, 2, 10, 2, 50)
    amenity_mask = (
        (df['parksDensity'] == 3) & 
        (df['childcareCenters'] == 2) & 
        (df['shoppingCenters'] == 10) & 
        (df['cafesRestaurants'] == 2) & 
        (df['medicalCenters'] == 50)
    )
    changes['amenities'] = amenity_mask.sum()
    
    if changes['amenities'] > 0:
        df.loc[amenity_mask, 'parksDensity'] = pd.NA
        df.loc[amenity_mask, 'childcareCenters'] = pd.NA
        df.loc[amenity_mask, 'shoppingCenters'] = pd.NA
        df.loc[amenity_mask, 'cafesRestaurants'] = pd.NA
        df.loc[amenity_mask, 'medicalCenters'] = pd.NA
        print(f"  Removed {changes['amenities']} amenity placeholder patterns (3,2,10,2,50 → empty)")
    
    print()
    print("=" * 70)
    print("SUMMARY")
    print("=" * 70)
    print(f"  Prices cleared: {changes['price']}")
    print(f"  Yields cleared: {changes['yield']}")
    print(f"  Primary commute cleared: {changes['commute1']}")
    print(f"  Secondary commute cleared: {changes['commute2']}")
    print(f"  Amenity patterns cleared: {changes['amenities']}")
    print(f"  Total fields cleared: {sum(changes.values())}")
    print()
    
    # Calculate new completeness
    print("NEW DATA COMPLETENESS:")
    print("-" * 70)
    total = len(df)
    print(f"  medianPrice: {df['medianPrice'].notna().sum()}/{total} ({df['medianPrice'].notna().sum()/total*100:.1f}%)")
    print(f"  rentalYield: {df['rentalYield'].notna().sum()}/{total} ({df['rentalYield'].notna().sum()/total*100:.1f}%)")
    print(f"  primaryCommuteMinutes: {df['primaryCommuteMinutes'].notna().sum()}/{total} ({df['primaryCommuteMinutes'].notna().sum()/total*100:.1f}%)")
    print(f"  secondaryCommuteMinutes: {df['secondaryCommuteMinutes'].notna().sum()}/{total} ({df['secondaryCommuteMinutes'].notna().sum()/total*100:.1f}%)")
    print(f"  parksDensity: {df['parksDensity'].notna().sum()}/{total} ({df['parksDensity'].notna().sum()/total*100:.1f}%)")
    print(f"  childcareCenters: {df['childcareCenters'].notna().sum()}/{total} ({df['childcareCenters'].notna().sum()/total*100:.1f}%)")
    print(f"  shoppingCenters: {df['shoppingCenters'].notna().sum()}/{total} ({df['shoppingCenters'].notna().sum()/total*100:.1f}%)")
    print(f"  cafesRestaurants: {df['cafesRestaurants'].notna().sum()}/{total} ({df['cafesRestaurants'].notna().sum()/total*100:.1f}%)")
    print(f"  medicalCenters: {df['medicalCenters'].notna().sum()}/{total} ({df['medicalCenters'].notna().sum()/total*100:.1f}%)")
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
    print("Done!")

if __name__ == '__main__':
    main()

