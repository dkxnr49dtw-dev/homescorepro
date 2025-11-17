const fs = require('fs');
const path = require('path');

const PROPERTIES_CSV = path.join(__dirname, '..', 'data', 'properties.csv');
const SCRAPED_CSV = path.join(__dirname, '..', 'data', 'scraped-properties.csv');
const OUTPUT_CSV = path.join(__dirname, '..', 'data', 'properties.csv');

// Simple CSV parser
function parseCSV(content) {
  const lines = content.split('\n').filter(l => l.trim());
  if (lines.length === 0) return { headers: [], rows: [] };
  
  const headers = lines[0].split(',');
  const rows = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let j = 0; j < lines[i].length; j++) {
      const char = lines[i][j];
      const nextChar = lines[i][j + 1];
      
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          current += '"';
          j++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        values.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current);
    
    const row = {};
    headers.forEach((header, idx) => {
      row[header] = values[idx] || '';
    });
    rows.push(row);
  }
  
  return { headers, rows };
}

// Convert row back to CSV line
function rowToCSV(row, headers) {
  return headers.map(header => {
    const value = row[header] || '';
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }).join(',');
}

// Merge properties
function mergeProperties() {
  console.log('🔄 Merging scraped properties into properties.csv...\n');
  
  // Read existing properties
  const propertiesContent = fs.readFileSync(PROPERTIES_CSV, 'utf-8');
  const propertiesData = parseCSV(propertiesContent);
  
  // Read scraped properties
  const scrapedContent = fs.readFileSync(SCRAPED_CSV, 'utf-8');
  const scrapedData = parseCSV(scrapedContent);
  
  console.log(`📊 Found ${propertiesData.rows.length} existing properties`);
  console.log(`📊 Found ${scrapedData.rows.length} scraped properties`);
  
  // Ensure sourceUrl column exists in headers
  const allHeaders = [...propertiesData.headers];
  if (!allHeaders.includes('sourceUrl')) {
    allHeaders.push('sourceUrl');
  }
  
  // Create a map of existing properties by address for deduplication
  const existingAddresses = new Set();
  propertiesData.rows.forEach(row => {
    const address = (row.address || '').toLowerCase().trim();
    if (address) {
      existingAddresses.add(address);
    }
  });
  
  // Merge scraped properties (only add if not duplicate)
  let addedCount = 0;
  const mergedRows = [...propertiesData.rows];
  
  scrapedData.rows.forEach(scrapedRow => {
    const address = (scrapedRow.address || '').toLowerCase().trim();
    if (address && !existingAddresses.has(address)) {
      // Ensure all fields exist
      const mergedRow = {};
      allHeaders.forEach(header => {
        mergedRow[header] = scrapedRow[header] || propertiesData.rows[0]?.[header] || '';
      });
      
      // If bScore is 0 or missing, we'll calculate it later in the app
      if (!mergedRow.bScore || mergedRow.bScore === '0') {
        mergedRow.bScore = '0'; // Will be calculated when viewed
      }
      
      mergedRows.push(mergedRow);
      existingAddresses.add(address);
      addedCount++;
    }
  });
  
  // Write merged CSV
  const outputLines = [allHeaders.join(',')];
  mergedRows.forEach(row => {
    outputLines.push(rowToCSV(row, allHeaders));
  });
  
  // Backup original
  const backupPath = PROPERTIES_CSV.replace('.csv', `-backup-${Date.now()}.csv`);
  fs.writeFileSync(backupPath, propertiesContent);
  console.log(`💾 Backup saved: ${path.basename(backupPath)}`);
  
  // Write merged file
  fs.writeFileSync(OUTPUT_CSV, outputLines.join('\n') + '\n');
  
  console.log(`✅ Added ${addedCount} new properties`);
  console.log(`📊 Total properties: ${mergedRows.length}`);
  console.log(`\n✅ Merge complete!`);
}

try {
  mergeProperties();
} catch (error) {
  console.error('❌ Error:', error.message);
  console.error(error.stack);
  process.exit(1);
}

