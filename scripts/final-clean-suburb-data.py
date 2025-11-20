#!/usr/bin/env python3
"""
Final Clean Suburb Data - Comprehensive cleaning and fixing

Handles all remaining edge cases and OCR artifacts.
"""

import pandas as pd
import re
from pathlib import Path

def clean_suburb_name_final(name: str) -> str:
    """Final cleaning of suburb names"""
    if pd.isna(name):
        return name
    
    name = str(name).strip()
    
    # Remove leading/trailing single characters and punctuation
    name = re.sub(r'^[^A-Za-z]+', '', name)  # Remove leading non-letters
    name = re.sub(r'[^A-Za-z]+$', '', name)  # Remove trailing non-letters
    
    # Remove common OCR artifacts at start/end
    name = re.sub(r'^(e|E|_|Rente|CBD|CBDA|Household|Yield|Price|Rent|Distance|Local|Government|Smart|Median|Gross|Nearest|Family|Suburb|Name|Area|State)\s+', '', name)
    name = re.sub(r'\s+(e|E|_|Rente|CBD|CBDA|Household|Yield|Price|Rent|Distance|Local|Government|Smart|Median|Gross|Nearest|Family|Suburb|Name|Area|State)$', '', name)
    
    # Remove middle artifacts
    name = re.sub(r'\s+(Rente|CBD|CBDA|Household|Yield|Price|Rent)\s+', ' ', name)
    
    # Clean up extra spaces
    name = re.sub(r'\s+', ' ', name).strip()
    
    # Capitalize properly (first letter of each word)
    words = name.split()
    name = ' '.join(word.capitalize() if word else '' for word in words)
    
    return name

def fix_specific_suburb_names(df: pd.DataFrame) -> pd.DataFrame:
    """Fix specific known problematic names"""
    
    fixes = {
        'e Maddingley': 'Maddingley',
        '_ Tyabb Mornington': 'Tyabb',
        'Riddells Creek': 'Riddells Creek',  # Keep as is
        'Main Ridge': 'Main Ridge',  # Keep as is
    }
    
    fixed_df = df.copy()
    
    for idx, row in fixed_df.iterrows():
        suburb = row['suburb_name']
        if suburb in fixes:
            fixed_df.at[idx, 'suburb_name'] = fixes[suburb]
    
    return fixed_df

def fix_lga_names_final(df: pd.DataFrame) -> pd.DataFrame:
    """Fix LGA names comprehensively"""
    
    fixed_df = df.copy()
    
    # LGA mapping based on suburb context
    lga_fixes = {}
    
    for idx, row in fixed_df.iterrows():
        suburb = row['suburb_name']
        lga = row.get('lga', '')
        
        # Fix incomplete LGAs based on suburb
        if lga == 'Ranges':
            # Determine if Macedon Ranges or Yarra Ranges
            if 'Riddells' in suburb or 'Macedon' in suburb:
                fixed_df.at[idx, 'lga'] = 'Macedon Ranges'
            elif 'Kilsyth' in suburb or 'Upwey' in suburb or 'Yarra' in suburb or 'Kallista' in suburb or 'Wesburn' in suburb or 'Wandin' in suburb or 'Silvan' in suburb:
                fixed_df.at[idx, 'lga'] = 'Yarra Ranges'
            else:
                # Default to Yarra Ranges for most cases
                fixed_df.at[idx, 'lga'] = 'Yarra Ranges'
        
        elif lga == 'Dandenong':
            fixed_df.at[idx, 'lga'] = 'Greater Dandenong'
        
        elif lga == 'Peninsula':
            fixed_df.at[idx, 'lga'] = 'Mornington Peninsula'
    
    return fixed_df

def remove_duplicates_and_clean(df: pd.DataFrame) -> pd.DataFrame:
    """Remove duplicates and clean data"""
    
    # Remove exact duplicates
    df = df.drop_duplicates(subset=['suburb_name', 'source_file', 'median_price'], keep='first')
    
    # Remove entries with obviously bad names
    bad_patterns = [
        r'^[^A-Za-z]',  # Starts with non-letter
        r'^[A-Za-z]$',  # Single letter
        r'Household',
        r'CBD',
        r'Rente',
        r'Yield',
        r'Price',
    ]
    
    mask = pd.Series([True] * len(df))
    for pattern in bad_patterns:
        mask = mask & ~df['suburb_name'].str.contains(pattern, case=False, na=False, regex=True)
    
    df = df[mask]
    
    return df

def main():
    """Main cleaning function"""
    print("🧹 Final Suburb Data Cleaning")
    print("=" * 60)
    
    # Load data
    print("📂 Loading data...")
    df = pd.read_csv('data/cleaned-extracted-suburbs.csv')
    
    print(f"✅ Loaded {len(df)} entries")
    
    # Final clean suburb names
    print("\n🧹 Final cleaning of suburb names...")
    df['suburb_name'] = df['suburb_name'].apply(clean_suburb_name_final)
    
    # Fix specific names
    df = fix_specific_suburb_names(df)
    
    # Fix LGA names
    df = fix_lga_names_final(df)
    
    # Remove duplicates and bad entries
    df = remove_duplicates_and_clean(df)
    
    # Save final cleaned data
    output_file = Path('data/final-extracted-suburbs.csv')
    df.to_csv(output_file, index=False)
    print(f"\n💾 Saved final cleaned data to {output_file}")
    
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
    
    # Show sample
    print("\n✅ Sample of final cleaned suburb names:")
    sample = df.head(30)
    for _, row in sample.iterrows():
        price = f"${row.get('median_price', 0):,.0f}" if pd.notna(row.get('median_price')) else "N/A"
        yield_pct = f"{row.get('rental_yield', 0):.1%}" if pd.notna(row.get('rental_yield')) else "N/A"
        print(f"  {row['suburb_name']:25} ({row.get('lga', '?'):20}) - {price:>10} | {yield_pct:>5}")
    
    print("\n✅ Final cleaning complete!")

if __name__ == "__main__":
    main()
