const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const CSV_PATH = path.join(__dirname, '..', 'data', 'scraped-properties.csv');
const PDF_DIR = path.join(__dirname, '..', 'pdf-import', 'property-files');

// Simple CSV parser that handles quoted fields
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current); // Add last field
  return result;
}

// Normalize address for comparison
function normalizeAddress(address) {
  if (!address) return '';
  return address
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Calculate file hash
function calculateFileHash(filePath) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    return crypto.createHash('md5').update(fileBuffer).digest('hex');
  } catch (error) {
    return null;
  }
}

// Main deduplication
function deduplicate() {
  console.log('🔍 Starting deduplication process...\n');
  
  // Step 1: Deduplicate CSV
  console.log('📋 Step 1: Deduplicating CSV entries...');
  const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
  const lines = csvContent.split('\n').filter(l => l.trim());
  
  if (lines.length < 2) {
    console.log('   ⚠️  CSV file is empty or has no data rows');
    return;
  }
  
  const header = lines[0];
  const dataLines = lines.slice(1);
  
  // Parse header to find address column index
  const headerFields = parseCSVLine(header);
  const addressIndex = headerFields.findIndex(f => f.toLowerCase() === 'address');
  
  if (addressIndex === -1) {
    console.log('   ❌ Could not find "address" column in CSV header');
    return;
  }
  
  const seenAddresses = new Map();
  const uniqueRows = [];
  let duplicateCount = 0;
  
  dataLines.forEach((row, index) => {
    const fields = parseCSVLine(row);
    if (fields.length > addressIndex) {
      const address = fields[addressIndex].replace(/^"|"$/g, '');
      const normalized = normalizeAddress(address);
      
      if (normalized && normalized.length > 5) {
        if (seenAddresses.has(normalized)) {
          duplicateCount++;
          console.log(`   ⚠️  Duplicate: "${address}" (row ${index + 2})`);
        } else {
          seenAddresses.set(normalized, true);
          uniqueRows.push(row);
        }
      } else {
        // Keep rows with invalid addresses (might be important)
        uniqueRows.push(row);
      }
    } else {
      // Keep malformed rows
      uniqueRows.push(row);
    }
  });
  
  // Backup original
  const backupPath = CSV_PATH.replace('.csv', `-backup-${Date.now()}.csv`);
  fs.writeFileSync(backupPath, csvContent);
  console.log(`   💾 Backup saved: ${path.basename(backupPath)}`);
  
  // Write deduplicated CSV
  const newContent = [header, ...uniqueRows].join('\n') + '\n';
  fs.writeFileSync(CSV_PATH, newContent);
  console.log(`   ✅ Removed ${duplicateCount} duplicate entries`);
  console.log(`   📊 CSV now has ${uniqueRows.length} unique properties\n`);
  
  // Step 2: Deduplicate PDFs
  console.log('📄 Step 2: Finding duplicate PDFs...');
  
  if (!fs.existsSync(PDF_DIR)) {
    console.log('   ⚠️  PDF directory does not exist');
    return;
  }
  
  const pdfFiles = fs.readdirSync(PDF_DIR)
    .filter(f => f.toLowerCase().endsWith('.pdf'))
    .map(f => path.join(PDF_DIR, f));
  
  console.log(`   📁 Found ${pdfFiles.length} PDF files`);
  
  // Group by content hash
  const hashToFiles = new Map();
  const fileHashes = new Map();
  
  pdfFiles.forEach(filePath => {
    const hash = calculateFileHash(filePath);
    if (hash) {
      fileHashes.set(filePath, hash);
      if (!hashToFiles.has(hash)) {
        hashToFiles.set(hash, []);
      }
      hashToFiles.get(hash).push(filePath);
    }
  });
  
  // Find and remove duplicates
  let pdfDuplicateCount = 0;
  const filesToDelete = new Set();
  
  hashToFiles.forEach((files, hash) => {
    if (files.length > 1) {
      // Sort: prefer files without timestamp in name
      files.sort((a, b) => {
        const aName = path.basename(a);
        const bName = path.basename(b);
        const aHasTimestamp = /\d{13}/.test(aName);
        const bHasTimestamp = /\d{13}/.test(bName);
        
        if (aHasTimestamp && !bHasTimestamp) return 1;
        if (!aHasTimestamp && bHasTimestamp) return -1;
        return aName.localeCompare(bName);
      });
      
      const keepFile = files[0];
      const duplicates = files.slice(1);
      
      console.log(`   🔍 Duplicate PDFs (${files.length} files):`);
      console.log(`      ✅ Keeping: ${path.basename(keepFile)}`);
      duplicates.forEach(dup => {
        console.log(`      🗑️  Deleting: ${path.basename(dup)}`);
        filesToDelete.add(dup);
        pdfDuplicateCount++;
      });
    }
  });
  
  // Also check for address-based duplicates (same base name)
  const baseNameToFiles = new Map();
  pdfFiles.forEach(filePath => {
    if (!filesToDelete.has(filePath)) {
      const basename = path.basename(filePath, '.pdf');
      const baseName = basename.replace(/-\d{13}$/, '');
      
      if (!baseNameToFiles.has(baseName)) {
        baseNameToFiles.set(baseName, []);
      }
      baseNameToFiles.get(baseName).push(filePath);
    }
  });
  
  baseNameToFiles.forEach((files, baseName) => {
    if (files.length > 1) {
      // Check if they have same content
      const hashes = files.map(f => fileHashes.get(f)).filter(Boolean);
      if (hashes.length > 1 && new Set(hashes).size === 1) {
        // All have same hash, keep first
        files.sort((a, b) => {
          const aName = path.basename(a);
          const bName = path.basename(b);
          const aHasTimestamp = /\d{13}/.test(aName);
          const bHasTimestamp = /\d{13}/.test(bName);
          if (aHasTimestamp && !bHasTimestamp) return 1;
          if (!aHasTimestamp && bHasTimestamp) return -1;
          return aName.localeCompare(bName);
        });
        
        const keepFile = files[0];
        const duplicates = files.slice(1);
        
        duplicates.forEach(dup => {
          if (!filesToDelete.has(dup)) {
            console.log(`   🔍 Address duplicate: ${path.basename(dup)}`);
            filesToDelete.add(dup);
            pdfDuplicateCount++;
          }
        });
      }
    }
  });
  
  // Delete duplicate PDFs
  if (filesToDelete.size > 0) {
    console.log(`\n   🗑️  Deleting ${filesToDelete.size} duplicate PDF files...`);
    filesToDelete.forEach(filePath => {
      try {
        fs.unlinkSync(filePath);
        console.log(`      ✅ Deleted: ${path.basename(filePath)}`);
      } catch (error) {
        console.log(`      ⚠️  Could not delete ${path.basename(filePath)}: ${error.message}`);
      }
    });
  } else {
    console.log(`   ✅ No duplicate PDFs found`);
  }
  
  console.log(`\n✅ Deduplication complete!`);
  console.log(`   📊 Removed ${duplicateCount} duplicate CSV entries`);
  console.log(`   📄 Removed ${pdfDuplicateCount} duplicate PDF files`);
}

// Run
try {
  deduplicate();
} catch (error) {
  console.error('❌ Error:', error.message);
  console.error(error.stack);
  process.exit(1);
}
