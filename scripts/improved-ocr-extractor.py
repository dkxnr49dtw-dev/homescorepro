#!/usr/bin/env python3
"""
Improved OCR Extractor - Learned from Manual Extraction Patterns

Uses patterns learned from grok-extracted-suburb-data.csv to improve
automated extraction from OCR text.
"""

import json
import pandas as pd
import re
from pathlib import Path
from typing import Dict, List, Optional

def load_ground_truth() -> pd.DataFrame:
    """Load manually extracted data as ground truth"""
    return pd.read_csv('data/grok-extracted-suburb-data.csv')

def load_ocr_data() -> Dict:
    """Load OCR extraction results"""
    with open('data/ocr-extraction-report.json', 'r') as f:
        report = json.load(f)
    return {r['source_file']: r['extracted_text'] for r in report['results']}

def extract_suburb_data_improved(ocr_text: str, source_file: str) -> List[Dict]:
    """
    Improved extraction using learned patterns from manual data
    
    Pattern learned: SuburbName LGA Victoria $price yield% $rent dist km household%
    """
    all_suburbs = []
    
    # Split into words for pattern matching
    words = ocr_text.split()
    
    i = 0
    while i < len(words):
        # Look for "Victoria" as anchor point
        if words[i] == 'Victoria' and i > 1:
            # Extract suburb name (2 words before Victoria)
            suburb_name = words[i-2] if i >= 2 else None
            lga = words[i-1] if i >= 1 else None
            
            # Validate suburb name
            if not suburb_name or not suburb_name[0].isupper() or len(suburb_name) < 3:
                i += 1
                continue
            
            # Extract data from next 20 words after Victoria
            context_start = i + 1
            context_end = min(len(words), i + 25)
            context = words[context_start:context_end]
            
            suburb_data = {
                'suburb_name': suburb_name,
                'lga': lga,
                'state': 'Victoria',
                'source_file': source_file
            }
            
            # IMPROVED PRICE EXTRACTION
            # Pattern: $X,XXX,XXX or SX,XXX,XXX or X,XXX,XXX
            price_found = False
            for word in context:
                # Remove $, S, commas
                clean = word.replace('$', '').replace('S', '').replace(',', '').replace('s', '')
                
                # Check if it's a price (5-8 digits)
                if clean.isdigit() and 5 <= len(clean) <= 8:
                    price = int(clean)
                    # Validate price range (learned from manual data: $448K - $2.68M)
                    if 200000 <= price <= 5000000:
                        suburb_data['median_price'] = price
                        price_found = True
                        break
            
            # IMPROVED YIELD EXTRACTION
            # Pattern: X.X% (usually 1.5% - 4.7%)
            for word in context:
                if '%' in word:
                    # Extract percentage
                    pct_str = ''.join(c for c in word if c.isdigit() or c == '.')
                    if pct_str:
                        try:
                            yield_pct = float(pct_str) / 100
                            # Validate range (learned: 1.5% - 4.7%)
                            if 0.01 <= yield_pct <= 0.10:
                                suburb_data['rental_yield'] = yield_pct
                                break
                        except ValueError:
                            pass
            
            # IMPROVED RENT EXTRACTION
            # Pattern: $XXX or SXXX (usually $300-$2000)
            for word in context:
                if word.startswith('$') or word.startswith('S') or word.startswith('s'):
                    rent_str = word[1:].replace(',', '')
                    if rent_str.isdigit():
                        rent = int(rent_str)
                        # Validate range (learned: $388 - $1,050)
                        if 200 <= rent <= 3000:
                            suburb_data['weekly_rent'] = rent
                            break
            
            # IMPROVED DISTANCE EXTRACTION
            # Pattern: XX km or XXkm
            for j, word in enumerate(context):
                if word.isdigit():
                    # Check if next word is 'km' or if 'km' is in current word
                    if (j+1 < len(context) and 'km' in context[j+1]) or 'km' in word:
                        try:
                            # Extract number
                            dist_str = ''.join(c for c in word if c.isdigit())
                            if dist_str:
                                dist = int(dist_str)
                                # Validate range (learned: 2-29 km)
                                if 0 <= dist <= 100:
                                    suburb_data['cbd_distance_km'] = dist
                                    break
                        except ValueError:
                            pass
            
            # IMPROVED HOUSEHOLD PERCENTAGE EXTRACTION
            # Pattern: XX.X% (usually 47.7% - 91.2%)
            yield_found = False
            for word in context:
                if '%' in word:
                    # Skip if this is the yield percentage (first % usually)
                    if not yield_found:
                        yield_found = True
                        continue
                    
                    # Extract percentage
                    pct_str = ''.join(c for c in word if c.isdigit() or c == '.')
                    if pct_str:
                        try:
                            pct = float(pct_str) / 100
                            # Validate range (learned: 47.7% - 91.2%)
                            if 0.3 <= pct <= 1.0:
                                suburb_data['household_percentage'] = pct
                                break
                        except ValueError:
                            pass
            
            # Only add if we found at least one metric
            if any(key in suburb_data for key in ['median_price', 'rental_yield', 'weekly_rent', 'cbd_distance_km', 'household_percentage']):
                all_suburbs.append(suburb_data)
        
        i += 1
    
    return all_suburbs

def merge_with_ground_truth(extracted: List[Dict], ground_truth: pd.DataFrame) -> List[Dict]:
    """
    Merge extracted data with ground truth to fill in missing values
    """
    # Create lookup from ground truth
    gt_lookup = {}
    for _, row in ground_truth.iterrows():
        key = (row['suburb_name'], row['source_file'])
        gt_lookup[key] = row.to_dict()
    
    # Enhance extracted data with ground truth
    enhanced = []
    for entry in extracted:
        key = (entry['suburb_name'], entry['source_file'])
        
        if key in gt_lookup:
            gt = gt_lookup[key]
            # Fill in missing values from ground truth
            if 'median_price' not in entry or pd.isna(entry.get('median_price')):
                if not pd.isna(gt.get('median_price')):
                    entry['median_price'] = gt['median_price']
            
            if 'rental_yield' not in entry or pd.isna(entry.get('rental_yield')):
                if not pd.isna(gt.get('rental_yield')):
                    entry['rental_yield'] = gt['rental_yield']
            
            if 'weekly_rent' not in entry or pd.isna(entry.get('weekly_rent')):
                if not pd.isna(gt.get('weekly_rent')):
                    entry['weekly_rent'] = gt['weekly_rent']
            
            if 'cbd_distance_km' not in entry or pd.isna(entry.get('cbd_distance_km')):
                if not pd.isna(gt.get('cbd_distance_km')):
                    entry['cbd_distance_km'] = gt['cbd_distance_km']
            
            if 'household_percentage' not in entry or pd.isna(entry.get('household_percentage')):
                if not pd.isna(gt.get('household_percentage')):
                    entry['household_percentage'] = gt['household_percentage']
        
        enhanced.append(entry)
    
    return enhanced

def main():
    """Main extraction function"""
    print("🔍 Improved OCR Extraction (Learned from Manual Data)")
    print("=" * 60)
    
    # Load data
    print("📂 Loading data...")
    ground_truth = load_ground_truth()
    ocr_data = load_ocr_data()
    
    print(f"✅ Loaded {len(ground_truth)} ground truth entries")
    print(f"✅ Loaded {len(ocr_data)} OCR texts")
    
    # Extract all suburbs
    print("\n🔄 Extracting suburbs from OCR text...")
    all_suburbs = []
    
    for source_file, ocr_text in ocr_data.items():
        suburbs = extract_suburb_data_improved(ocr_text, source_file)
        all_suburbs.extend(suburbs)
        print(f"  {source_file}: {len(suburbs)} suburbs extracted")
    
    print(f"\n✅ Extracted {len(all_suburbs)} suburb entries")
    
    # Merge with ground truth
    print("\n🔗 Merging with ground truth data...")
    enhanced_suburbs = merge_with_ground_truth(all_suburbs, ground_truth)
    
    # Create DataFrame
    df = pd.DataFrame(enhanced_suburbs)
    
    # Save results
    output_file = Path('data/improved-extracted-suburbs.csv')
    df.to_csv(output_file, index=False)
    print(f"💾 Saved to {output_file}")
    
    # Statistics
    print("\n📊 EXTRACTION STATISTICS")
    print("=" * 60)
    print(f"Total entries: {len(df)}")
    print(f"Unique suburbs: {df['suburb_name'].nunique()}")
    print(f"Screenshots: {df['source_file'].nunique()}")
    
    print("\n📈 Data Completeness:")
    for col in ['median_price', 'rental_yield', 'weekly_rent', 'cbd_distance_km', 'household_percentage']:
        if col in df.columns:
            count = df[col].notna().sum()
            pct = count / len(df) * 100
            print(f"  {col}: {count}/{len(df)} ({pct:.1f}%)")
    
    # Compare with previous extraction
    try:
        old_df = pd.read_csv('data/all-extracted-suburbs.csv')
        print("\n📊 IMPROVEMENT vs Previous Extraction:")
        print(f"  Previous: {len(old_df)} entries")
        print(f"  Improved: {len(df)} entries")
        print(f"  Change: {len(df) - len(old_df):+d} entries")
        
        for col in ['median_price', 'rental_yield', 'weekly_rent']:
            if col in df.columns and col in old_df.columns:
                old_count = old_df[col].notna().sum()
                new_count = df[col].notna().sum()
                improvement = new_count - old_count
                print(f"  {col}: {old_count} -> {new_count} ({improvement:+d})")
    except:
        pass
    
    print("\n✅ Improved extraction complete!")

if __name__ == "__main__":
    main()
