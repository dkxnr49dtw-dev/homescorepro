const fs = require('fs');
const path = require('path');

const PROPERTIES_CSV = path.join(__dirname, '..', 'data', 'properties.csv');
const SCRAPED_CSV = path.join(__dirname, '..', 'data', 'scraped-properties.csv');

// Parse CSV with proper quote handling
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

// Normalize address for comparison
function normalizeAddress(addr) {
  if (!addr) return '';
  return addr
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Convert row to CSV
function rowToCSV(row, headers) {
  return headers.map(header => {
    const value = String(row[header] || '');
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }).join(',');
}

// Main function
function mergeAndDedupe() {
  console.log('🔄 Merging and deduplicating properties...\n');
  
  // Read existing properties
  const propsContent = fs.readFileSync(PROPERTIES_CSV, 'utf-8');
  const propsLines = propsContent.split('\n').filter(l => l.trim());
  const propsHeaders = parseCSVLine(propsLines[0]);
  const propsRows = propsLines.slice(1).map(line => {
    const values = parseCSVLine(line);
    const row = {};
    propsHeaders.forEach((h, i) => {
      row[h] = values[i] || '';
    });
    return row;
  });
  
  // Read scraped properties
  const scrapedContent = fs.readFileSync(SCRAPED_CSV, 'utf-8');
  const scrapedLines = scrapedContent.split('\n').filter(l => l.trim());
  const scrapedHeaders = parseCSVLine(scrapedLines[0]);
  const scrapedRows = scrapedLines.slice(1).map(line => {
    const values = parseCSVLine(line);
    const row = {};
    scrapedHeaders.forEach((h, i) => {
      row[h] = values[i] || '';
    });
    return row;
  });
  
  console.log(`📊 Found ${propsRows.length} existing properties`);
  console.log(`📊 Found ${scrapedRows.length} scraped properties`);
  
  // Add sourceUrl to headers if missing
  const allHeaders = [...propsHeaders];
  if (!allHeaders.includes('sourceUrl')) {
    allHeaders.push('sourceUrl');
  }
  
  // Build address map for deduplication
  const addressMap = new Map();
  let duplicateCount = 0;
  
  // Add existing properties
  propsRows.forEach(row => {
    const addr = normalizeAddress(row.address);
    if (addr) {
      if (addressMap.has(addr)) {
        duplicateCount++;
        console.log(`   ⚠️  Duplicate in existing: "${row.address}"`);
      } else {
        // Ensure sourceUrl field exists
        if (!row.sourceUrl) row.sourceUrl = '';
        addressMap.set(addr, row);
      }
    }
  });
  
  // Add scraped properties (skip duplicates)
  let addedCount = 0;
  scrapedRows.forEach(row => {
    const addr = normalizeAddress(row.address);
    if (addr && !addressMap.has(addr)) {
      // Ensure all fields exist
      const mergedRow = {};
      allHeaders.forEach(header => {
        mergedRow[header] = row[header] || '';
      });
      addressMap.set(addr, mergedRow);
      addedCount++;
    } else if (addr) {
      duplicateCount++;
      console.log(`   ⚠️  Duplicate scraped: "${row.address}"`);
    }
  });
  
  // Convert map to array
  const mergedRows = Array.from(addressMap.values());
  
  // Backup
  const backupPath = PROPERTIES_CSV.replace('.csv', `-backup-${Date.now()}.csv`);
  fs.writeFileSync(backupPath, propsContent);
  console.log(`\n💾 Backup saved: ${path.basename(backupPath)}`);
  
  // Write merged CSV
  const outputLines = [allHeaders.join(',')];
  mergedRows.forEach(row => {
    outputLines.push(rowToCSV(row, allHeaders));
  });
  
  fs.writeFileSync(PROPERTIES_CSV, outputLines.join('\n') + '\n');
  
  console.log(`✅ Removed ${duplicateCount} duplicates`);
  console.log(`✅ Added ${addedCount} new properties from scraped data`);
  console.log(`📊 Total unique properties: ${mergedRows.length}`);
  console.log(`\n✅ Merge and deduplication complete!`);
}

try {
  mergeAndDedupe();
} catch (error) {
  console.error('❌ Error:', error.message);
  console.error(error.stack);
  process.exit(1);
}

