#!/bin/bash
# Consolidate non-essential files to dev-homescorepro/archive/
# This script moves duplicate, old, and non-essential files to archive

set -e

BASE_DIR="/Users/jason/Library/Mobile Documents/com~apple~CloudDocs/homescorepro"
ARCHIVE_DIR="$BASE_DIR/dev-homescorepro/archive"

echo "=========================================="
echo "File Consolidation Script"
echo "=========================================="
echo ""

# Create archive subdirectories
mkdir -p "$ARCHIVE_DIR/data-extraction"
mkdir -p "$ARCHIVE_DIR/data-backups"
mkdir -p "$ARCHIVE_DIR/build-outputs"
mkdir -p "$ARCHIVE_DIR/old-versions"
mkdir -p "$ARCHIVE_DIR/duplicate-docs"
mkdir -p "$ARCHIVE_DIR/extra-data"

echo "✅ Created archive directories"
echo ""

# Move non-essential data files (extraction/processing files)
echo "Moving data extraction files..."
cd "$BASE_DIR/data"
mv -v all-extracted-suburbs.csv "$ARCHIVE_DIR/data-extraction/" 2>/dev/null || echo "  (already moved or doesn't exist)"
mv -v cleaned-extracted-suburbs.csv "$ARCHIVE_DIR/data-extraction/" 2>/dev/null || echo "  (already moved or doesn't exist)"
mv -v data-comparison.csv "$ARCHIVE_DIR/data-extraction/" 2>/dev/null || echo "  (already moved or doesn't exist)"
mv -v extracted-suburb-data.csv "$ARCHIVE_DIR/data-extraction/" 2>/dev/null || echo "  (already moved or doesn't exist)"
mv -v extracted-suburb-data.json "$ARCHIVE_DIR/data-extraction/" 2>/dev/null || echo "  (already moved or doesn't exist)"
mv -v final-extracted-suburbs.csv "$ARCHIVE_DIR/data-extraction/" 2>/dev/null || echo "  (already moved or doesn't exist)"
mv -v fixed-extracted-suburbs.csv "$ARCHIVE_DIR/data-extraction/" 2>/dev/null || echo "  (already moved or doesn't exist)"
mv -v grok-extracted-suburb-data.csv "$ARCHIVE_DIR/data-extraction/" 2>/dev/null || echo "  (already moved or doesn't exist)"
mv -v grok-extraction-report.json "$ARCHIVE_DIR/data-extraction/" 2>/dev/null || echo "  (already moved or doesn't exist)"
mv -v improved-extracted-suburbs.csv "$ARCHIVE_DIR/data-extraction/" 2>/dev/null || echo "  (already moved or doesn't exist)"
mv -v ocr-extraction-report.json "$ARCHIVE_DIR/data-extraction/" 2>/dev/null || echo "  (already moved or doesn't exist)"
mv -v sample-properties.csv "$ARCHIVE_DIR/data-extraction/" 2>/dev/null || echo "  (already moved or doesn't exist)"
mv -v sample-properties2.csv "$ARCHIVE_DIR/data-extraction/" 2>/dev/null || echo "  (already moved or doesn't exist)"
mv -v sample-properties.numbers "$ARCHIVE_DIR/data-extraction/" 2>/dev/null || echo "  (already moved or doesn't exist)"
echo ""

# Move backup files
echo "Moving backup files..."
mv -v suburbs.csv.backup "$ARCHIVE_DIR/data-backups/" 2>/dev/null || echo "  (already moved or doesn't exist)"
mv -v suburbs.csv.backup2 "$ARCHIVE_DIR/data-backups/" 2>/dev/null || echo "  (already moved or doesn't exist)"
mv -v suburbs.csv.backup_20251120_004333 "$ARCHIVE_DIR/data-backups/" 2>/dev/null || echo "  (already moved or doesn't exist)"
echo ""

# Move old/duplicate HTML files
echo "Moving old/duplicate HTML files..."
cd "$BASE_DIR"
mv -v DEMO_SHOWCASE.html "$ARCHIVE_DIR/old-versions/" 2>/dev/null || echo "  (already moved or doesn't exist)"
mv -v index-enhanced.html "$ARCHIVE_DIR/old-versions/" 2>/dev/null || echo "  (already moved or doesn't exist)"
echo ""

# Move build outputs
echo "Moving build outputs..."
mv -v deploy "$ARCHIVE_DIR/build-outputs/" 2>/dev/null || echo "  (already moved or doesn't exist)"
mv -v dist "$ARCHIVE_DIR/build-outputs/" 2>/dev/null || echo "  (already moved or doesn't exist)"
echo ""

# Move extra suburb data folder
echo "Moving extra suburb data..."
mv -v "extra suburb data" "$ARCHIVE_DIR/extra-data/" 2>/dev/null || echo "  (already moved or doesn't exist)"
echo ""

# Move duplicate working-documents from root
echo "Moving duplicate working-documents from root..."
if [ -d "$BASE_DIR/working-documents" ] && [ "$BASE_DIR/working-documents" != "$BASE_DIR/dev-homescorepro/working-documents" ]; then
    mv -v "$BASE_DIR/working-documents" "$ARCHIVE_DIR/duplicate-docs/working-documents-root" 2>/dev/null || echo "  (already moved or doesn't exist)"
fi
echo ""

# Move non-essential markdown files from dev-homescorepro root
echo "Moving non-essential markdown files from dev-homescorepro root..."
cd "$BASE_DIR/dev-homescorepro"
mv -v COMPETITIVE_ANALYSIS.md "$ARCHIVE_DIR/duplicate-docs/" 2>/dev/null || echo "  (already moved or doesn't exist)"
mv -v COMPLETION_SUMMARY.md "$ARCHIVE_DIR/duplicate-docs/" 2>/dev/null || echo "  (already moved or doesn't exist)"
mv -v data-README.md "$ARCHIVE_DIR/duplicate-docs/" 2>/dev/null || echo "  (already moved or doesn't exist)"
mv -v MOAT_STRATEGY.md "$ARCHIVE_DIR/duplicate-docs/" 2>/dev/null || echo "  (already moved or doesn't exist)"
mv -v PROJECT_PLAN_DETAILED.md "$ARCHIVE_DIR/duplicate-docs/" 2>/dev/null || echo "  (already moved or doesn't exist)"
mv -v QUICK_START.md "$ARCHIVE_DIR/duplicate-docs/" 2>/dev/null || echo "  (already moved or doesn't exist)"
mv -v UI_UX_OPTIMIZATION_REPORT.md "$ARCHIVE_DIR/duplicate-docs/" 2>/dev/null || echo "  (already moved or doesn't exist)"
mv -v VISUAL_GUIDE.md "$ARCHIVE_DIR/duplicate-docs/" 2>/dev/null || echo "  (already moved or doesn't exist)"
echo ""

echo "=========================================="
echo "✅ File consolidation complete!"
echo "=========================================="
echo ""
echo "Files moved to: dev-homescorepro/archive/"
echo "  - data-extraction/ (extracted CSV/JSON files)"
echo "  - data-backups/ (backup files)"
echo "  - build-outputs/ (deploy/, dist/)"
echo "  - old-versions/ (old HTML files)"
echo "  - duplicate-docs/ (duplicate documentation)"
echo "  - extra-data/ (extra suburb data folder)"
echo ""

