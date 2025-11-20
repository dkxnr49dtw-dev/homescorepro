#!/usr/bin/env python3
"""
Fix Suburb Names and Data Quality Issues - Version 2

More comprehensive fixing using OCR text analysis and pattern matching.
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

def extract_full_suburb_from_ocr(ocr_text: str, partial_suburb: str, lga: str, context_words: List[str]) -> Optional[str]:
    """
    Extract full suburb name from OCR text using multiple strategies
    """
    # Strategy 1: Look for pattern "FullSuburbName LGA Victoria"
    # Find all instances of LGA followed by Victoria
    pattern = r'(\w+(?:\s+\w+){0,3}?)\s+' + re.escape(lga) + r'\s+Victoria'
    matches = list(re.finditer(pattern, ocr_text, re.IGNORECASE))
    
    for match in matches:
        potential_name = match.group(1).strip()
        # Check if partial suburb is part of this name
        if partial_suburb.lower() in potential_name.lower():
            # Validate it's a reasonable suburb name
            words = potential_name.split()
            if 1 <= len(words) <= 4 and potential_name[0].isupper():
                # Check if it's not just the LGA name
                if potential_name.lower() != lga.lower():
                    return potential_name
    
    # Strategy 2: Look backwards from LGA to find suburb name
    # Find position of LGA in text
    lga_pos = ocr_text.find(lga)
    if lga_pos > 0:
        # Look backwards up to 50 characters
        context_start = max(0, lga_pos - 50)
        context = ocr_text[context_start:lga_pos]
        words = context.split()
        
        # Find the suburb name (usually 1-3 words before LGA)
        if len(words) >= 2:
            # Try 2 words before LGA
            potential = ' '.join(words[-2:]).strip()
            if potential[0].isupper() and partial_suburb.lower() in potential.lower():
                return potential
            # Try 1 word before LGA
            potential = words[-1].strip()
            if potential[0].isupper() and partial_suburb.lower() in potential.lower():
                return potential
    
    # Strategy 3: Use context words (words around the suburb in the data row)
    # Look for patterns in context
    if context_words:
        # Try to find suburb name in context before LGA
        for i, word in enumerate(context_words):
            if word == lga and i > 0:
                # Get words before LGA
                before_lga = context_words[max(0, i-3):i]
                if before_lga:
                    potential = ' '.join(before_lga).strip()
                    if potential[0].isupper() and len(potential) > 3:
                        return potential
    
    return None

def fix_all_suburb_names(df: pd.DataFrame, ocr_data: Dict, ground_truth: pd.DataFrame) -> pd.DataFrame:
    """Comprehensively fix all suburb names"""
    
    # Create ground truth lookup
    gt_lookup = {}
    for _, row in ground_truth.iterrows():
        key = (row['source_file'], row.get('lga', ''))
        if key not in gt_lookup:
            gt_lookup[key] = []
        gt_lookup[key].append(row['suburb_name'])
    
    fixed_df = df.copy()
    
    print("🔧 Fixing all suburb names...")
    
    fixes_made = 0
    
    for idx, row in fixed_df.iterrows():
        suburb = row['suburb_name']
        lga = row.get('lga', '')
        source_file = row['source_file']
        
        original_suburb = suburb
        
        # Skip if already a good multi-word name
        if ' ' in suburb and len(suburb) > 8:
            continue
        
        # Get OCR text
        if source_file not in ocr_data:
            continue
        
        ocr_text = ocr_data[source_file]
        
        # Try to extract full name
        full_name = extract_full_suburb_from_ocr(ocr_text, suburb, lga, [])
        
        if full_name and full_name != suburb:
            fixed_df.at[idx, 'suburb_name'] = full_name
            print(f"  Fixed: '{suburb}' -> '{full_name}'")
            fixes_made += 1
            continue
        
        # Try ground truth lookup
        key = (source_file, lga)
        if key in gt_lookup:
            for gt_suburb in gt_lookup[key]:
                if suburb.lower() in gt_suburb.lower() or gt_suburb.lower().endswith(suburb.lower()):
                    if gt_suburb != suburb:
                        fixed_df.at[idx, 'suburb_name'] = gt_suburb
                        print(f"  Fixed: '{suburb}' -> '{gt_suburb}' (ground truth)")
                        fixes_made += 1
                        break
    
    print(f"  Total fixes: {fixes_made}")
    return fixed_df

def fix_specific_issues(df: pd.DataFrame, ocr_data: Dict) -> pd.DataFrame:
    """Fix specific known issues"""
    
    fixed_df = df.copy()
    
    print("\n🔧 Fixing specific known issues...")
    
    # Known fixes based on OCR analysis
    specific_fixes = {
        # (suburb, lga, source_file_pattern) -> correct_suburb
        ('Macedon', 'Macedon Ranges', '8.13.02'): 'Riddells Creek',
        ('Greater', 'Dandenong', '8.12.20'): 'Keysborough',
        ('Port', 'Phillip', '8.10.31'): 'Albert Park',
        ('Yarra', 'Macedon Ranges', None): None,  # Need to check context
    }
    
    fixes_made = 0
    
    for idx, row in fixed_df.iterrows():
        suburb = row['suburb_name']
        lga = row.get('lga', '')
        source_file = row['source_file']
        
        # Check specific fixes
        for (old_suburb, old_lga, file_pattern), new_suburb in specific_fixes.items():
            if suburb == old_suburb and lga == old_lga:
                if file_pattern is None or file_pattern in source_file:
                    if new_suburb:
                        fixed_df.at[idx, 'suburb_name'] = new_suburb
                        print(f"  Fixed: '{suburb}' -> '{new_suburb}'")
                        fixes_made += 1
                    else:
                        # Need OCR context to determine
                        if source_file in ocr_data:
                            ocr_text = ocr_data[source_file]
                            # Look for suburb name before this LGA
                            lga_pos = ocr_text.find(lga)
                            if lga_pos > 0:
                                context = ocr_text[max(0, lga_pos-30):lga_pos]
                                words = context.split()
                                if len(words) >= 2:
                                    potential = ' '.join(words[-2:]).strip()
                                    if potential[0].isupper():
                                        fixed_df.at[idx, 'suburb_name'] = potential
                                        print(f"  Fixed: '{suburb}' -> '{potential}'")
                                        fixes_made += 1
                break
    
    print(f"  Total specific fixes: {fixes_made}")
    return fixed_df

def fix_lga_names_comprehensive(df: pd.DataFrame, ground_truth: pd.DataFrame) -> pd.DataFrame:
    """Comprehensively fix LGA names"""
    
    # Create ground truth LGA lookup
    gt_lga_lookup = {}
    for _, row in ground_truth.iterrows():
        key = (row['suburb_name'], row['source_file'])
        gt_lga_lookup[key] = row.get('lga', '')
    
    fixed_df = df.copy()
    
    print("\n🔧 Fixing LGA names comprehensively...")
    
    fixes_made = 0
    
    for idx, row in fixed_df.iterrows():
        suburb = row['suburb_name']
        lga = row.get('lga', '')
        source_file = row['source_file']
        
        # Check ground truth first
        key = (suburb, source_file)
        if key in gt_lga_lookup:
            correct_lga = gt_lga_lookup[key]
            if lga != correct_lga:
                fixed_df.at[idx, 'lga'] = correct_lga
                fixes_made += 1
                continue
        
        # Fix incomplete LGAs
        lga_fixes = {
            'Ranges': None,  # Could be Macedon Ranges or Yarra Ranges - need context
            'Peninsula': 'Mornington Peninsula',
            'Greater': 'Greater Dandenong',
        }
        
        if lga in lga_fixes:
            if lga_fixes[lga]:
                fixed_df.at[idx, 'lga'] = lga_fixes[lga]
                fixes_made += 1
            else:
                # Try to determine from context or ground truth
                if key in gt_lga_lookup:
                    fixed_df.at[idx, 'lga'] = gt_lga_lookup[key]
                    fixes_made += 1
    
    print(f"  Total LGA fixes: {fixes_made}")
    return fixed_df

def main():
    """Main fixing function"""
    print("🔧 Comprehensive Suburb Data Fixing - Version 2")
    print("=" * 60)
    
    # Load data
    print("📂 Loading data...")
    df = pd.read_csv('data/improved-extracted-suburbs.csv')
    ground_truth = load_ground_truth()
    ocr_data = load_ocr_data()
    
    print(f"✅ Loaded {len(df)} entries to fix")
    
    # Fix suburb names comprehensively
    df = fix_all_suburb_names(df, ocr_data, ground_truth)
    
    # Fix specific known issues
    df = fix_specific_issues(df, ocr_data)
    
    # Fix LGA names
    df = fix_lga_names_comprehensive(df, ground_truth)
    
    # Save fixed data
    output_file = Path('data/fixed-extracted-suburbs.csv')
    df.to_csv(output_file, index=False)
    print(f"\n💾 Saved fixed data to {output_file}")
    
    # Statistics
    print("\n📊 FINAL DATA STATISTICS")
    print("=" * 60)
    print(f"Total entries: {len(df)}")
    print(f"Unique suburbs: {df['suburb_name'].nunique()}")
    
    print("\n📈 Data Completeness:")
    for col in ['median_price', 'rental_yield', 'weekly_rent', 'cbd_distance_km', 'household_percentage']:
        if col in df.columns:
            count = df[col].notna().sum()
            pct = count / len(df) * 100
            print(f"  {col}: {count}/{len(df)} ({pct:.1f}%)")
    
    # Show unique suburbs
    print("\n✅ Sample of unique suburbs:")
    unique_suburbs = df['suburb_name'].unique()[:20]
    for suburb in sorted(unique_suburbs):
        count = len(df[df['suburb_name'] == suburb])
        print(f"  {suburb} ({count} entries)")
    
    print("\n✅ Comprehensive fixing complete!")

if __name__ == "__main__":
    main()
