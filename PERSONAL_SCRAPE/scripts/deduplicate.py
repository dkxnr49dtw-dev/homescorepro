#!/usr/bin/env python3
import csv
import os
import hashlib
import sys
from pathlib import Path

CSV_PATH = Path(__file__).parent.parent / 'data' / 'scraped-properties.csv'
PDF_DIR = Path(__file__).parent.parent / 'pdf-import' / 'property-files'

def normalize_address(address):
    """Normalize address for comparison"""
    if not address:
        return ''
    return ' '.join(address.lower().replace(',', ' ').split())

def deduplicate_csv():
    """Remove duplicate addresses from CSV"""
    print('🔍 Starting deduplication process...\n')
    print('📋 Step 1: Deduplicating CSV entries...')
    
    # Read CSV
    with open(CSV_PATH, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        rows = list(reader)
    
    # Backup
    backup_path = CSV_PATH.with_suffix(f'.backup-{int(__import__("time").time())}.csv')
    with open(backup_path, 'w', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=reader.fieldnames)
        writer.writeheader()
        writer.writerows(rows)
    print(f'   💾 Backup saved: {backup_path.name}')
    
    # Deduplicate
    seen_addresses = {}
    unique_rows = []
    duplicate_count = 0
    
    for row in rows:
        address = row.get('address', '').strip()
        normalized = normalize_address(address)
        
        if normalized and len(normalized) > 5:
            if normalized in seen_addresses:
                duplicate_count += 1
                print(f'   ⚠️  Duplicate: "{address}"')
            else:
                seen_addresses[normalized] = True
                unique_rows.append(row)
        else:
            unique_rows.append(row)
    
    # Write deduplicated CSV
    with open(CSV_PATH, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=reader.fieldnames)
        writer.writeheader()
        writer.writerows(unique_rows)
    
    print(f'   ✅ Removed {duplicate_count} duplicate entries')
    print(f'   📊 CSV now has {len(unique_rows)} unique properties\n')
    return duplicate_count

def calculate_file_hash(filepath):
    """Calculate MD5 hash of file"""
    try:
        with open(filepath, 'rb') as f:
            return hashlib.md5(f.read()).hexdigest()
    except:
        return None

def deduplicate_pdfs():
    """Remove duplicate PDF files"""
    print('📄 Step 2: Finding duplicate PDFs...')
    
    if not PDF_DIR.exists():
        print('   ⚠️  PDF directory does not exist')
        return 0
    
    pdf_files = list(PDF_DIR.glob('*.pdf'))
    print(f'   📁 Found {len(pdf_files)} PDF files')
    
    # Group by hash
    hash_to_files = {}
    file_hashes = {}
    
    for pdf_file in pdf_files:
        file_hash = calculate_file_hash(pdf_file)
        if file_hash:
            file_hashes[pdf_file] = file_hash
            if file_hash not in hash_to_files:
                hash_to_files[file_hash] = []
            hash_to_files[file_hash].append(pdf_file)
    
    # Find duplicates
    files_to_delete = set()
    pdf_duplicate_count = 0
    
    for file_hash, files in hash_to_files.items():
        if len(files) > 1:
            # Sort: prefer files without timestamp
            files.sort(key=lambda f: (
                bool(__import__('re').search(r'\d{13}', f.name)),  # Has timestamp
                f.name  # Then alphabetically
            ))
            
            keep_file = files[0]
            duplicates = files[1:]
            
            print(f'   🔍 Duplicate PDFs ({len(files)} files):')
            print(f'      ✅ Keeping: {keep_file.name}')
            for dup in duplicates:
                print(f'      🗑️  Deleting: {dup.name}')
                files_to_delete.add(dup)
                pdf_duplicate_count += 1
    
    # Delete duplicates
    if files_to_delete:
        print(f'\n   🗑️  Deleting {len(files_to_delete)} duplicate PDF files...')
        for file_path in files_to_delete:
            try:
                file_path.unlink()
                print(f'      ✅ Deleted: {file_path.name}')
            except Exception as e:
                print(f'      ⚠️  Could not delete {file_path.name}: {e}')
    else:
        print('   ✅ No duplicate PDFs found')
    
    return pdf_duplicate_count

if __name__ == '__main__':
    try:
        csv_duplicates = deduplicate_csv()
        pdf_duplicates = deduplicate_pdfs()
        print(f'\n✅ Deduplication complete!')
        print(f'   📊 Removed {csv_duplicates} duplicate CSV entries')
        print(f'   📄 Removed {pdf_duplicates} duplicate PDF files')
    except Exception as e:
        print(f'❌ Error: {e}', file=sys.stderr)
        import traceback
        traceback.print_exc()
        sys.exit(1)

