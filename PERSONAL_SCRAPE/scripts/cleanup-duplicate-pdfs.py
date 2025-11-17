#!/usr/bin/env python3
"""Remove duplicate PDF files with timestamps"""

import os
import re
from pathlib import Path

PDF_DIR = Path('pdf-import/property-files')

if not PDF_DIR.exists():
    print('❌ PDF directory not found')
    exit(1)

files = list(PDF_DIR.glob('*.pdf'))
print(f'📊 Found {len(files)} PDF files\n')

# Pattern: filename-1234567890123.pdf (13 digits)
pattern = re.compile(r'^(.+)-(\d{13})\.pdf$')

timestamped = {}
base_files = {}

for f in files:
    match = pattern.match(f.name)
    if match:
        base_name = match.group(1) + '.pdf'
        if base_name not in timestamped:
            timestamped[base_name] = []
        timestamped[base_name].append(f)
    else:
        base_files[f.name] = f

deleted = 0
for base_name, dupes in timestamped.items():
    if base_name in base_files:
        # Base file exists, delete all timestamped versions
        for dupe in dupes:
            try:
                dupe.unlink()
                print(f'🗑️  Deleted: {dupe.name} (base exists)')
                deleted += 1
            except Exception as e:
                print(f'⚠️  Error deleting {dupe.name}: {e}')
    elif len(dupes) > 1:
        # No base file, keep most recent, delete others
        dupes.sort(key=lambda x: x.stat().st_mtime, reverse=True)
        # Rename most recent to base name
        try:
            dupes[0].rename(PDF_DIR / base_name)
            print(f'✏️  Renamed: {dupes[0].name} → {base_name}')
        except Exception as e:
            print(f'⚠️  Error renaming {dupes[0].name}: {e}')
        # Delete the rest
        for dupe in dupes[1:]:
            try:
                dupe.unlink()
                print(f'🗑️  Deleted: {dupe.name}')
                deleted += 1
            except Exception as e:
                print(f'⚠️  Error deleting {dupe.name}: {e}')

print(f'\n✅ Removed {deleted} duplicate PDFs')
remaining = len(list(PDF_DIR.glob('*.pdf')))
print(f'📊 Remaining PDFs: {remaining}')

