#!/usr/bin/env python3
"""
Clean Suburb Data - Remove OCR artifacts and fix remaining issues

Removes OCR noise like "Rente CBD Householdse", "CBDA Households", etc.
and fixes suburb names properly.
"""

import pandas as pd
import re
from pathlib import Path

def clean_suburb_name(name: str) -> str:
    """Clean suburb name by removing OCR artifacts"""
    if pd.isna(name):
        return name
    
    name = str(name).strip()
    
    # Remove common OCR artifacts
    artifacts = [
        r'Rente\s+',
        r'CBD\s+',
        r'CBDA\s+',
        r'Households?\s*',
        r'Householdse\s*',
        r'Householdsz\s*',
        r'House Price[_\s]*',
        r'Yield[_\s]*',
        r'Rent[_\s]*',
        r'Distance\s+to\s+',
        r'Local\s+Government\s+',
        r'Smart\s+',
        r'Median\s+',
        r'Gross\s+',
        r'Nearest\s+',
        r'Family\s+',
        r'Suburb\s+Name[z]?\s*',
        r'Area\s*',
        r'State[=n]?\s*',
        r'\(Vic[:\s)]*\)',
        r'\(Vic:\s*\)',
    ]
    
    for pattern in artifacts:
        name = re.sub(pattern, '', name, flags=re.IGNORECASE)
    
    # Clean up extra spaces
    name = re.sub(r'\s+', ' ', name).strip()
    
    # Remove leading/trailing punctuation
    name = name.strip('.,;:()[]')
    
    return name

def fix_known_suburb_names(df: pd.DataFrame) -> pd.DataFrame:
    """Fix known problematic suburb names"""
    
    fixed_df = df.copy()
    
    # Known fixes based on analysis
    fixes = {
        'Riddells Creek Macedon': 'Riddells Creek',
        'Rente CBD Householdse Maddingley': 'Maddingley',
        'Main Mornington': 'Main Ridge',  # or check OCR
        'Keysborough Greater': 'Keysborough',
        'Kilsyth Yarra': 'Kilsyth',
        'Households_ Tyabb Mornington': 'Tyabb',
        'Upper Ferntree Gully': 'Upper Ferntree Gully',  # This is correct
        'Upwey Yarra': 'Upwey',
        'CBDA Households  Carlton North': 'Carlton North',
        'Carnegie Glen': 'Carnegie',
        'Carrum Kingston': 'Carrum',
        'S692 Box Hill North': 'Box Hill North',
        'S740 Box Hill South': 'Box Hill South',
        'S757 Braybrook': 'Braybrook',
        'St Andrews Beach Mornington': 'St Andrews Beach',
        'Arthurs Seat Mornington': 'Arthurs Seat',
        'CBDA Households  East Melbourne': 'East Melbourne',
        'East Warburton Yarra': 'East Warburton',
        'Elsternwick Glen': 'Elsternwick',
        'Elwood Port': 'Elwood',
        'Households_ Hughesdale': 'Hughesdale',
        'CBD Householdsz Moorabbin Kingston': 'Moorabbin',
        'Moorooduc Mornington': 'Moorooduc',
        'Mooroolbark Yarra': 'Mooroolbark',
        'Households  Deer Park': 'Deer Park',
        'Dingley Village Kingston': 'Dingley Village',
        'Rent CBDA Households  Werribee': 'Werribee',
        'West Footscray': 'West Footscray',  # Correct
        'West Melbourne': 'West Melbourne',  # Correct
        'CBD Households  Silvan Yarra': 'Silvan',
        'Somers Mornington': 'Somers',
        'House Price_ Yield Rent_': None,  # Remove this entry
    }
    
    print("🔧 Fixing known problematic names...")
    
    fixes_made = 0
    to_remove = []
    
    for idx, row in fixed_df.iterrows():
        suburb = row['suburb_name']
        
        if suburb in fixes:
            new_name = fixes[suburb]
            if new_name is None:
                # Mark for removal
                to_remove.append(idx)
            else:
                fixed_df.at[idx, 'suburb_name'] = new_name
                print(f"  Fixed: '{suburb}' -> '{new_name}'")
                fixes_made += 1
    
    # Remove bad entries
    if to_remove:
        fixed_df = fixed_df.drop(index=to_remove)
        print(f"  Removed {len(to_remove)} bad entries")
    
    print(f"  Total fixes: {fixes_made}")
    
    return fixed_df

def fix_lga_names(df: pd.DataFrame) -> pd.DataFrame:
    """Fix LGA names"""
    
    fixed_df = df.copy()
    
    # LGA fixes
    lga_fixes = {
        'Ranges': None,  # Need to determine from context
        'Eira': 'Glen Eira',
        'Phillip': 'Port Phillip',
        '(Vic:)': None,  # Invalid
    }
    
    print("\n🔧 Fixing LGA names...")
    
    fixes_made = 0
    to_remove = []
    
    for idx, row in fixed_df.iterrows():
        lga = row.get('lga', '')
        
        if lga in lga_fixes:
            new_lga = lga_fixes[lga]
            if new_lga is None:
                # Try to determine from suburb name or remove
                suburb = row['suburb_name']
                # If we can't fix it, might need to remove
                if lga == '(Vic:)':
                    to_remove.append(idx)
                else:
                    # Try to infer from known patterns
                    if 'Yarra' in suburb or 'Kilsyth' in suburb or 'Upwey' in suburb:
                        fixed_df.at[idx, 'lga'] = 'Yarra Ranges'
                        fixes_made += 1
            else:
                fixed_df.at[idx, 'lga'] = new_lga
                fixes_made += 1
    
    if to_remove:
        fixed_df = fixed_df.drop(index=to_remove)
        print(f"  Removed {len(to_remove)} entries with invalid LGA")
    
    print(f"  Total LGA fixes: {fixes_made}")
    
    return fixed_df

def main():
    """Main cleaning function"""
    print("🧹 Cleaning Suburb Data")
    print("=" * 60)
    
    # Load data
    print("📂 Loading data...")
    df = pd.read_csv('data/fixed-extracted-suburbs.csv')
    
    print(f"✅ Loaded {len(df)} entries")
    
    # Clean suburb names
    print("\n🧹 Cleaning suburb names...")
    df['suburb_name'] = df['suburb_name'].apply(clean_suburb_name)
    
    # Fix known problematic names
    df = fix_known_suburb_names(df)
    
    # Fix LGA names
    df = fix_lga_names(df)
    
    # Remove entries with invalid suburb names
    invalid = df[
        (df['suburb_name'].str.len() < 3) |
        (df['suburb_name'].str.contains('Household|CBD|Rente|Yield|Price', case=False, na=False)) |
        (df['suburb_name'].str.startswith('S', na=False) & df['suburb_name'].str[1:].str.isdigit())
    ]
    
    if len(invalid) > 0:
        print(f"\n🗑️  Removing {len(invalid)} entries with invalid names")
        df = df.drop(index=invalid.index)
    
    # Save cleaned data
    output_file = Path('data/cleaned-extracted-suburbs.csv')
    df.to_csv(output_file, index=False)
    print(f"\n💾 Saved cleaned data to {output_file}")
    
    # Statistics
    print("\n📊 CLEANED DATA STATISTICS")
    print("=" * 60)
    print(f"Total entries: {len(df)}")
    print(f"Unique suburbs: {df['suburb_name'].nunique()}")
    
    print("\n📈 Data Completeness:")
    for col in ['median_price', 'rental_yield', 'weekly_rent', 'cbd_distance_km', 'household_percentage']:
        if col in df.columns:
            count = df[col].notna().sum()
            pct = count / len(df) * 100
            print(f"  {col}: {count}/{len(df)} ({pct:.1f}%)")
    
    # Show sample of cleaned names
    print("\n✅ Sample of cleaned suburb names:")
    sample = df.head(20)
    for _, row in sample.iterrows():
        print(f"  {row['suburb_name']} ({row.get('lga', '?')})")
    
    print("\n✅ Data cleaning complete!")

if __name__ == "__main__":
    main()
