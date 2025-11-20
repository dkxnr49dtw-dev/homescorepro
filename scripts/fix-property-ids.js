#!/usr/bin/env node

/**
 * Fix Duplicate Property IDs Script
 * 
 * Purpose: Identify and fix duplicate property IDs in properties.csv
 * Usage: node scripts/fix-property-ids.js
 * 
 * This script:
 * 1. Reads properties.csv
 * 2. Identifies duplicate IDs
 * 3. Generates new unique IDs for duplicates using timestamp + random suffix
 * 4. Updates the CSV file
 * 5. Reports what was changed
 */

const fs = require('fs');
const path = require('path');

const CSV_PATH = path.join(__dirname, '..', 'data', 'properties.csv');
const BACKUP_PATH = path.join(__dirname, '..', 'data', 'backup', `properties-${Date.now()}.csv`);

function generateUniqueId() {
    // Generate unique ID: timestamp (13 digits) + random 3-digit suffix
    const timestamp = Date.now();
    const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return parseInt(`${timestamp}${randomSuffix}`);
}

function parseCSV(content) {
    const lines = content.trim().split('\n').filter(line => line.trim() && !line.startsWith('#'));
    if (lines.length < 2) return { headers: [], rows: [] };
    
    const headers = lines[0].split(',').map(h => h.trim());
    const rows = [];
    
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue;
        
        // Simple CSV parsing - split by comma and trim
        const values = line.split(',').map(v => v.trim());
        const row = {};
        
        headers.forEach((header, index) => {
            row[header] = values[index] || '';
        });
        
        rows.push(row);
    }
    
    return { headers, rows };
}

function writeCSV(headers, rows, comments) {
    let output = comments.join('\n') + '\n';
    output += headers.join(',') + '\n';
    
    rows.forEach(row => {
        const values = headers.map(header => {
            const value = row[header] || '';
            // Escape values that contain commas or quotes
            if (value.includes(',') || value.includes('"') || value.includes('\n')) {
                return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
        });
        output += values.join(',') + '\n';
    });
    
    return output;
}

function main() {
    console.log('🔍 Checking for duplicate property IDs...\n');
    
    // Read CSV file
    let content;
    try {
        content = fs.readFileSync(CSV_PATH, 'utf8');
    } catch (error) {
        console.error('❌ Error reading properties.csv:', error.message);
        process.exit(1);
    }
    
    // Extract comments (lines starting with #)
    const lines = content.split('\n');
    const comments = lines.filter(line => line.trim().startsWith('#'));
    const dataContent = lines.filter(line => !line.trim().startsWith('#')).join('\n');
    
    // Parse CSV
    const { headers, rows } = parseCSV(dataContent);
    
    if (headers.length === 0 || rows.length === 0) {
        console.log('⚠️  No data found in properties.csv');
        return;
    }
    
    // Find duplicate IDs
    const idIndex = headers.indexOf('id');
    if (idIndex === -1) {
        console.error('❌ "id" column not found in CSV');
        process.exit(1);
    }
    
    const idCounts = {};
    const duplicateRows = [];
    
    rows.forEach((row, index) => {
        const id = row.id;
        if (!idCounts[id]) {
            idCounts[id] = [];
        }
        idCounts[id].push({ row, index });
    });
    
    // Find duplicates
    Object.keys(idCounts).forEach(id => {
        if (idCounts[id].length > 1) {
            duplicateRows.push(...idCounts[id].slice(1)); // Keep first, fix rest
        }
    });
    
    if (duplicateRows.length === 0) {
        console.log('✅ No duplicate IDs found. All property IDs are unique.\n');
        console.log(`📊 Total properties: ${rows.length}`);
        return;
    }
    
    console.log(`⚠️  Found ${duplicateRows.length} duplicate ID(s):\n`);
    
    // Create backup
    try {
        // Ensure backup directory exists
        const backupDir = path.dirname(BACKUP_PATH);
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }
        fs.writeFileSync(BACKUP_PATH, content);
        console.log(`💾 Backup created: ${path.basename(BACKUP_PATH)}\n`);
    } catch (error) {
        console.error('❌ Error creating backup:', error.message);
        process.exit(1);
    }
    
    // Fix duplicates
    const usedIds = new Set(rows.map(r => r.id));
    let fixedCount = 0;
    
    duplicateRows.forEach(({ row, index }) => {
        const oldId = row.id;
        let newId;
        
        // Generate new unique ID
        do {
            newId = generateUniqueId().toString();
        } while (usedIds.has(newId));
        
        row.id = newId;
        usedIds.add(newId);
        fixedCount++;
        
        console.log(`  Row ${index + 2}: ${oldId} → ${newId} (${row.address || 'N/A'})`);
    });
    
    // Write updated CSV
    const updatedContent = writeCSV(headers, rows, comments);
    
    try {
        fs.writeFileSync(CSV_PATH, updatedContent, 'utf8');
        console.log(`\n✅ Fixed ${fixedCount} duplicate ID(s)`);
        console.log(`📝 Updated properties.csv`);
        console.log(`\n📊 Summary:`);
        console.log(`   - Total properties: ${rows.length}`);
        console.log(`   - Duplicates fixed: ${fixedCount}`);
        console.log(`   - Backup saved: ${path.basename(BACKUP_PATH)}`);
    } catch (error) {
        console.error('❌ Error writing updated CSV:', error.message);
        process.exit(1);
    }
}

main();


