#!/usr/bin/env python3
"""
Update existing suburbs.csv with extracted data, replacing ONLY placeholder values.

Placeholder patterns identified:
- medianPrice = 0
- rentalYield = 4.0 (common placeholder)
- primaryCommuteMinutes = 0 (when extracted has distance data)
- growth1yr = 0 (when other data suggests it's placeholder)

This script preserves real data and only replaces clear placeholders.
"""

import pandas as pd
import sys
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).parent.parent
EXISTING_CSV = BASE_DIR / 'data' / 'suburbs.csv'
EXTRACTED_CSV = BASE_DIR / 'data' / 'final-extracted-suburbs.csv'
BACKUP_CSV = BASE_DIR / 'data' / 'suburbs.csv.backup'
OUTPUT_CSV = BASE_DIR / 'data' / 'suburbs.csv'

def is_placeholder_price(value):
    """Check if price is a placeholder."""
    return pd.isna(value) or value == 0

def is_placeholder_yield(value):
    """Check if yield is a placeholder (4.0 is common placeholder)."""
    return pd.isna(value) or value == 4.0

def is_placeholder_commute(value):
    """Check if commute time is a placeholder."""
    return pd.isna(value) or value == 0

def is_placeholder_growth(value):
    """Check if growth is a placeholder (0 might be real, but if other data is placeholder, likely this is too)."""
    return pd.isna(value) or value == 0

def km_to_minutes(km):
    """Convert CBD distance in km to approximate commute minutes.
    Assumes average speed of 50km/h for mixed traffic."""
    if pd.isna(km) or km == 0:
        return None
    return int(km * 60 / 50)  # km * (60 min/h) / (50 km/h)

def main():
    print("=" * 70)
    print("UPDATE SUBURBS.CSV WITH EXTRACTED DATA (Placeholders Only)")
    print("=" * 70)
    print()
    
    # Load datasets
    print("Loading datasets...")
    existing_df = pd.read_csv(EXISTING_CSV, comment='#')
    extracted_df = pd.read_csv(EXTRACTED_CSV)
    
    print(f"  Existing suburbs: {len(existing_df)}")
    print(f"  Extracted suburbs: {len(extracted_df)}")
    print()
    
    # Normalize suburb names for matching
    existing_df['suburb_norm'] = existing_df['suburb'].str.lower().str.strip()
    extracted_df['suburb_norm'] = extracted_df['suburb_name'].str.lower().str.strip()
    
    # Find matches
    existing_set = set(existing_df['suburb_norm'])
    extracted_set = set(extracted_df['suburb_norm'])
    matches = existing_set.intersection(extracted_set)
    
    print(f"Matched suburbs: {len(matches)}")
    print()
    
    # Create backup
    print(f"Creating backup: {BACKUP_CSV}")
    existing_df.to_csv(BACKUP_CSV, index=False)
    print("  Backup created successfully")
    print()
    
    # Track updates
    updates = {
        'price': 0,
        'yield': 0,
        'commute': 0,
        'growth': 0,
    }
    
    # Update matched suburbs
    print("Updating suburbs (placeholders only)...")
    print("-" * 70)
    
    for suburb_norm in sorted(matches):
        # Get rows
        existing_idx = existing_df[existing_df['suburb_norm'] == suburb_norm].index[0]
        extracted_row = extracted_df[extracted_df['suburb_norm'] == suburb_norm].iloc[0]
        
        suburb_name = existing_df.loc[existing_idx, 'suburb']
        updated_fields = []
        
        # Update medianPrice if placeholder
        if is_placeholder_price(existing_df.loc[existing_idx, 'medianPrice']):
            if pd.notna(extracted_row.get('median_price')):
                existing_df.loc[existing_idx, 'medianPrice'] = int(extracted_row['median_price'])
                updates['price'] += 1
                updated_fields.append('price')
        
        # Update rentalYield if placeholder
        if is_placeholder_yield(existing_df.loc[existing_idx, 'rentalYield']):
            if pd.notna(extracted_row.get('rental_yield')):
                # Convert to percentage (extracted is decimal like 0.034 = 3.4%)
                yield_pct = extracted_row['rental_yield'] * 100
                existing_df.loc[existing_idx, 'rentalYield'] = float(round(yield_pct, 2))
                updates['yield'] += 1
                updated_fields.append('yield')
        
        # Update primaryCommuteMinutes if placeholder
        if is_placeholder_commute(existing_df.loc[existing_idx, 'primaryCommuteMinutes']):
            if pd.notna(extracted_row.get('cbd_distance_km')):
                commute_min = km_to_minutes(extracted_row['cbd_distance_km'])
                if commute_min:
                    existing_df.loc[existing_idx, 'primaryCommuteMinutes'] = commute_min
                    updates['commute'] += 1
                    updated_fields.append('commute')
        
        # Update growth1yr if placeholder (be more conservative here)
        # Only update if price was also a placeholder (suggests all data is placeholder)
        if is_placeholder_growth(existing_df.loc[existing_idx, 'growth1yr']):
            # Don't update growth from extracted data as it's not available
            # This is just for tracking
            pass
        
        if updated_fields:
            print(f"  {suburb_name:30} Updated: {', '.join(updated_fields)}")
    
    print()
    print("=" * 70)
    print("UPDATE SUMMARY")
    print("=" * 70)
    print(f"  Prices updated: {updates['price']}")
    print(f"  Yields updated: {updates['yield']}")
    print(f"  Commute times updated: {updates['commute']}")
    print(f"  Total suburbs updated: {sum(1 for s in matches if True)}")
    print()
    
    # Remove temporary column
    existing_df = existing_df.drop(columns=['suburb_norm'])
    
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
        existing_df.to_csv(f, index=False, lineterminator='\n')
    
    print("  File saved successfully")
    print()
    print(f"Backup saved to: {BACKUP_CSV}")
    print(f"Updated file: {OUTPUT_CSV}")
    print()
    print("Done!")

if __name__ == '__main__':
    main()

