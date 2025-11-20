#!/usr/bin/env python3
"""
Fix Suburb Names and Data Quality Issues

Corrects incomplete suburb names, fixes LGA names, and validates data
using ground truth and OCR text analysis.
"""

import json
import pandas as pd
import re
from pathlib import Path
from typing import Dict, List, Optional, Tuple

def load_ground_truth() -> pd.DataFrame:
    """Load manually extracted data as reference"""
    return pd.read_csv('data/grok-extracted-suburb-data.csv')

def load_ocr_data() -> Dict:
    """Load OCR extraction results"""
    with open('data/ocr-extraction-report.json', 'r') as f:
        report = json.load(f)
    return {r['source_file']: r['extracted_text'] for r in report['results']}

def extract_full_suburb_name(ocr_text: str, partial_name: str, lga: str, source_file: str) -> Optional[str]:
    """
    Extract full suburb name from OCR text using context
    
    Handles cases like:
    - "East" -> "Ringwood East"
    - "North" -> "Ringwood North"
    - "Gully" -> "Ferntree Gully"
    """
    # Common multi-word suburb patterns
    multi_word_patterns = [
        r'(\w+\s+East)\s+' + re.escape(lga),
        r'(\w+\s+North)\s+' + re.escape(lga),
        r'(\w+\s+South)\s+' + re.escape(lga),
        r'(\w+\s+West)\s+' + re.escape(lga),
        r'(\w+\s+Gully)\s+' + re.escape(lga),
        r'(\w+\s+Park)\s+' + re.escape(lga),
        r'(\w+\s+Ridge)\s+' + re.escape(lga),
        r'(\w+\s+Beach)\s+' + re.escape(lga),
        r'(\w+\s+Creek)\s+' + re.escape(lga),
        r'(\w+\s+Seat)\s+' + re.escape(lga),
    ]
    
    # Try to find full name using patterns
    for pattern in multi_word_patterns:
        matches = re.finditer(pattern, ocr_text, re.IGNORECASE)
        for match in matches:
            full_name = match.group(1)
            # Check if this matches our partial name
            if partial_name.lower() in full_name.lower() or full_name.lower().endswith(partial_name.lower()):
                return full_name
    
    # Look for patterns like "SuburbName LGA Victoria"
    # Find all instances of the LGA followed by Victoria
    pattern = r'(\w+(?:\s+\w+)*?)\s+' + re.escape(lga) + r'\s+Victoria'
    matches = re.finditer(pattern, ocr_text, re.IGNORECASE)
    
    for match in matches:
        potential_name = match.group(1).strip()
        # Check if partial name is part of this
        if partial_name.lower() in potential_name.lower():
            # Validate it's a reasonable suburb name (2-4 words, starts with capital)
            words = potential_name.split()
            if 1 <= len(words) <= 4 and potential_name[0].isupper():
                return potential_name
    
    return None

def fix_suburb_names(df: pd.DataFrame, ocr_data: Dict, ground_truth: pd.DataFrame) -> pd.DataFrame:
    """Fix incomplete suburb names using OCR text and ground truth"""
    
    # Create ground truth lookup
    gt_lookup = {}
    for _, row in ground_truth.iterrows():
        key = (row['source_file'], row.get('lga', ''))
        if key not in gt_lookup:
            gt_lookup[key] = []
        gt_lookup[key].append({
            'suburb': row['suburb_name'],
            'lga': row.get('lga', '')
        })
    
    fixed_df = df.copy()
    
    print("🔧 Fixing suburb names...")
    
    for idx, row in fixed_df.iterrows():
        suburb = row['suburb_name']
        lga = row.get('lga', '')
        source_file = row['source_file']
        
        # Skip if already a complete name (has space or is known good)
        if ' ' in suburb or len(suburb) > 8:
            continue
        
        # Check if this is a partial name (single word that might be part of multi-word)
        if suburb in ['East', 'North', 'South', 'West', 'Gully', 'Park', 'Ridge', 'Beach', 'Creek', 'Seat']:
            # Try to find full name from OCR
            if source_file in ocr_data:
                ocr_text = ocr_data[source_file]
                full_name = extract_full_suburb_name(ocr_text, suburb, lga, source_file)
                
                if full_name:
                    print(f"  Fixed: '{suburb}' -> '{full_name}'")
                    fixed_df.at[idx, 'suburb_name'] = full_name
                    continue
        
        # Try to match with ground truth
        key = (source_file, lga)
        if key in gt_lookup:
            for gt_entry in gt_lookup[key]:
                gt_suburb = gt_entry['suburb']
                # Check if our suburb is part of ground truth suburb
                if suburb.lower() in gt_suburb.lower() or gt_suburb.lower().endswith(suburb.lower()):
                    print(f"  Fixed: '{suburb}' -> '{gt_suburb}' (from ground truth)")
                    fixed_df.at[idx, 'suburb_name'] = gt_suburb
                    break
    
    return fixed_df

def fix_lga_names(df: pd.DataFrame, ground_truth: pd.DataFrame) -> pd.DataFrame:
    """Fix incomplete LGA names"""
    
    # Common LGA name mappings
    lga_fixes = {
        'Ranges': 'Macedon Ranges',  # or Yarra Ranges - need context
        'Peninsula': 'Mornington Peninsula',
        'Greater': 'Greater Dandenong',
    }
    
    # Create ground truth LGA lookup
    gt_lga_lookup = {}
    for _, row in ground_truth.iterrows():
        key = (row['suburb_name'], row['source_file'])
        gt_lga_lookup[key] = row.get('lga', '')
    
    fixed_df = df.copy()
    
    print("\n🔧 Fixing LGA names...")
    
    for idx, row in fixed_df.iterrows():
        suburb = row['suburb_name']
        lga = row.get('lga', '')
        source_file = row['source_file']
        
        # Check ground truth first
        key = (suburb, source_file)
        if key in gt_lga_lookup:
            correct_lga = gt_lga_lookup[key]
            if lga != correct_lga:
                print(f"  Fixed LGA for {suburb}: '{lga}' -> '{correct_lga}'")
                fixed_df.at[idx, 'lga'] = correct_lga
                continue
        
        # Fix common incomplete LGAs
        if lga in lga_fixes:
            # Try to determine correct LGA from context
            # For now, use ground truth if available
            if key in gt_lga_lookup:
                fixed_df.at[idx, 'lga'] = gt_lga_lookup[key]
            else:
                # Use mapping as fallback
                fixed_df.at[idx, 'lga'] = lga_fixes[lga]
                print(f"  Fixed LGA for {suburb}: '{lga}' -> '{lga_fixes[lga]}'")
    
    return fixed_df

def validate_and_fix_data(df: pd.DataFrame, ground_truth: pd.DataFrame) -> pd.DataFrame:
    """Validate data ranges and fix obvious errors"""
    
    fixed_df = df.copy()
    
    print("\n🔧 Validating and fixing data ranges...")
    
    # Price validation (should be $200K - $5M)
    if 'median_price' in fixed_df.columns:
        invalid_prices = fixed_df[(fixed_df['median_price'] < 200000) | (fixed_df['median_price'] > 5000000)]
        if len(invalid_prices) > 0:
            print(f"  Found {len(invalid_prices)} invalid prices, removing...")
            fixed_df.loc[invalid_prices.index, 'median_price'] = None
    
    # Yield validation (should be 0.5% - 10%)
    if 'rental_yield' in fixed_df.columns:
        invalid_yields = fixed_df[(fixed_df['rental_yield'] < 0.005) | (fixed_df['rental_yield'] > 0.10)]
        if len(invalid_yields) > 0:
            print(f"  Found {len(invalid_yields)} invalid yields, removing...")
            fixed_df.loc[invalid_yields.index, 'rental_yield'] = None
    
    # Rent validation (should be $200 - $3000)
    if 'weekly_rent' in fixed_df.columns:
        invalid_rents = fixed_df[(fixed_df['weekly_rent'] < 200) | (fixed_df['weekly_rent'] > 3000)]
        if len(invalid_rents) > 0:
            print(f"  Found {len(invalid_rents)} invalid rents, removing...")
            fixed_df.loc[invalid_rents.index, 'weekly_rent'] = None
    
    # Distance validation (should be 0-100 km)
    if 'cbd_distance_km' in fixed_df.columns:
        invalid_dist = fixed_df[(fixed_df['cbd_distance_km'] < 0) | (fixed_df['cbd_distance_km'] > 100)]
        if len(invalid_dist) > 0:
            print(f"  Found {len(invalid_dist)} invalid distances, removing...")
            fixed_df.loc[invalid_dist.index, 'cbd_distance_km'] = None
    
    return fixed_df

def merge_with_ground_truth(df: pd.DataFrame, ground_truth: pd.DataFrame) -> pd.DataFrame:
    """Merge with ground truth to fill missing values and correct errors"""
    
    # Create lookup
    gt_lookup = {}
    for _, row in ground_truth.iterrows():
        key = (row['suburb_name'], row['source_file'])
        gt_lookup[key] = row.to_dict()
    
    fixed_df = df.copy()
    
    print("\n🔗 Merging with ground truth data...")
    
    merged_count = 0
    for idx, row in fixed_df.iterrows():
        suburb = row['suburb_name']
        source_file = row['source_file']
        key = (suburb, source_file)
        
        if key in gt_lookup:
            gt = gt_lookup[key]
            updated = False
            
            # Fill missing values
            for col in ['median_price', 'rental_yield', 'weekly_rent', 'cbd_distance_km', 'household_percentage']:
                if col in fixed_df.columns and col in gt:
                    if pd.isna(row.get(col)) and not pd.isna(gt.get(col)):
                        fixed_df.at[idx, col] = gt[col]
                        updated = True
            
            if updated:
                merged_count += 1
    
    print(f"  Merged data for {merged_count} entries")
    
    return fixed_df

def main():
    """Main fixing function"""
    print("🔧 Fixing Suburb Data Quality Issues")
    print("=" * 60)
    
    # Load data
    print("📂 Loading data...")
    df = pd.read_csv('data/improved-extracted-suburbs.csv')
    ground_truth = load_ground_truth()
    ocr_data = load_ocr_data()
    
    print(f"✅ Loaded {len(df)} entries to fix")
    print(f"✅ Loaded {len(ground_truth)} ground truth entries")
    
    # Fix suburb names
    df = fix_suburb_names(df, ocr_data, ground_truth)
    
    # Fix LGA names
    df = fix_lga_names(df, ground_truth)
    
    # Validate data ranges
    df = validate_and_fix_data(df, ground_truth)
    
    # Merge with ground truth
    df = merge_with_ground_truth(df, ground_truth)
    
    # Save fixed data
    output_file = Path('data/fixed-extracted-suburbs.csv')
    df.to_csv(output_file, index=False)
    print(f"\n💾 Saved fixed data to {output_file}")
    
    # Statistics
    print("\n📊 FIXED DATA STATISTICS")
    print("=" * 60)
    print(f"Total entries: {len(df)}")
    print(f"Unique suburbs: {df['suburb_name'].nunique()}")
    
    print("\n📈 Data Completeness:")
    for col in ['median_price', 'rental_yield', 'weekly_rent', 'cbd_distance_km', 'household_percentage']:
        if col in df.columns:
            count = df[col].notna().sum()
            pct = count / len(df) * 100
            print(f"  {col}: {count}/{len(df)} ({pct:.1f}%)")
    
    # Show sample of fixed names
    print("\n✅ Sample of fixed suburb names:")
    sample = df[df['suburb_name'].str.contains(' ', na=False)].head(10)
    for _, row in sample.iterrows():
        print(f"  {row['suburb_name']} ({row.get('lga', '?')})")
    
    print("\n✅ Data fixing complete!")

if __name__ == "__main__":
    main()
