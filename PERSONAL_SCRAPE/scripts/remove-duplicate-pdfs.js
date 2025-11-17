const fs = require('fs');
const path = require('path');

const PDF_DIR = path.join(__dirname, '..', 'pdf-import', 'property-files');

function removeDuplicatePDFs() {
  console.log('🔄 Removing duplicate PDFs...\n');
  
  if (!fs.existsSync(PDF_DIR)) {
    console.log('❌ PDF directory not found');
    return;
  }
  
  const files = fs.readdirSync(PDF_DIR).filter(f => f.endsWith('.pdf'));
  console.log(`📊 Found ${files.length} PDF files`);
  
  // Group files by base name (without timestamp)
  const fileGroups = new Map();
  
  files.forEach(filename => {
    // Check if filename has a timestamp pattern: -1763298115124.pdf
    const timestampMatch = filename.match(/^(.+)-(\d{13})\.pdf$/);
    
    if (timestampMatch) {
      // This is a timestamped file
      const baseName = timestampMatch[1] + '.pdf';
      const timestamp = timestampMatch[2];
      
      if (!fileGroups.has(baseName)) {
        fileGroups.set(baseName, { base: null, timestamped: [] });
      }
      fileGroups.get(baseName).timestamped.push({ filename, timestamp });
    } else {
      // This is a base file (no timestamp)
      if (!fileGroups.has(filename)) {
        fileGroups.set(filename, { base: null, timestamped: [] });
      }
      fileGroups.get(filename).base = filename;
    }
  });
  
  let deletedCount = 0;
  let keptCount = 0;
  
  // Delete timestamped duplicates if base file exists
  fileGroups.forEach((group, baseName) => {
    if (group.base && group.timestamped.length > 0) {
      // Base file exists, delete all timestamped versions
      group.timestamped.forEach(({ filename }) => {
        const filePath = path.join(PDF_DIR, filename);
        try {
          fs.unlinkSync(filePath);
          console.log(`   🗑️  Deleted: ${filename}`);
          deletedCount++;
        } catch (error) {
          console.log(`   ⚠️  Error deleting ${filename}: ${error.message}`);
        }
      });
      keptCount++;
    } else if (!group.base && group.timestamped.length > 0) {
      // No base file, keep the most recent timestamped version
      group.timestamped.sort((a, b) => parseInt(b.timestamp) - parseInt(a.timestamp));
      const toKeep = group.timestamped[0];
      const toDelete = group.timestamped.slice(1);
      
      // Rename the most recent to base name
      const oldPath = path.join(PDF_DIR, toKeep.filename);
      const newPath = path.join(PDF_DIR, baseName);
      try {
        fs.renameSync(oldPath, newPath);
        console.log(`   ✏️  Renamed: ${toKeep.filename} → ${baseName}`);
        keptCount++;
      } catch (error) {
        console.log(`   ⚠️  Error renaming ${toKeep.filename}: ${error.message}`);
      }
      
      // Delete the rest
      toDelete.forEach(({ filename }) => {
        const filePath = path.join(PDF_DIR, filename);
        try {
          fs.unlinkSync(filePath);
          console.log(`   🗑️  Deleted: ${filename}`);
          deletedCount++;
        } catch (error) {
          console.log(`   ⚠️  Error deleting ${filename}: ${error.message}`);
        }
      });
    } else if (group.base) {
      // Only base file exists, keep it
      keptCount++;
    }
  });
  
  console.log(`\n✅ Removed ${deletedCount} duplicate PDFs`);
  console.log(`📊 Kept ${keptCount} unique PDFs`);
  console.log(`\n✅ Deduplication complete!`);
}

try {
  removeDuplicatePDFs();
} catch (error) {
  console.error('❌ Error:', error.message);
  console.error(error.stack);
  process.exit(1);
}

