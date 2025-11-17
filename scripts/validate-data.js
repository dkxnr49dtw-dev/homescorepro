/**
 * Data Validation Script for HomeScorePro
 * Validates CSV data files and reports issues
 */

const fs = require('fs');
const path = require('path');

// Read CSV file
function readCSV(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.trim().split('\n');
    const headers = lines[0].split(',');
    const rows = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        const row = {};
        headers.forEach((header, index) => {
            row[header.trim()] = values[index]?.trim() || '';
        });
        rows.push(row);
    }
    
    return { headers, rows };
}

// Validate properties.csv
function validateProperties() {
    console.log('\n=== Validating properties.csv ===\n');
    const { rows } = readCSV(path.join(__dirname, '../data/properties.csv'));
    const issues = [];
    const ids = new Set();
    
    rows.forEach((row, index) => {
        const lineNum = index + 2; // +2 for header and 0-index
        
        // Check for duplicate IDs
        if (ids.has(row.id)) {
            issues.push({
                type: 'DUPLICATE_ID',
                line: lineNum,
                suburb: row.suburb,
                id: row.id,
                message: `Duplicate property ID: ${row.id}`
            });
        } else {
            ids.add(row.id);
        }
        
        // Check for missing required fields
        if (!row.address || row.address === '') {
            issues.push({
                type: 'MISSING_FIELD',
                line: lineNum,
                suburb: row.suburb,
                field: 'address',
                message: 'Missing address'
            });
        }
        
        if (!row.suburb || row.suburb === '') {
            issues.push({
                type: 'MISSING_FIELD',
                line: lineNum,
                suburb: row.suburb,
                field: 'suburb',
                message: 'Missing suburb'
            });
        }
        
        if (!row.price || row.price === '0' || row.price === '') {
            issues.push({
                type: 'MISSING_FIELD',
                line: lineNum,
                suburb: row.suburb,
                field: 'price',
                message: 'Missing or zero price'
            });
        }
        
        // Check for invalid property types
        const validTypes = ['house', 'unit', 'townhouse', 'apartment'];
        if (row.propertyType && !validTypes.includes(row.propertyType.toLowerCase())) {
            issues.push({
                type: 'INVALID_VALUE',
                line: lineNum,
                suburb: row.suburb,
                field: 'propertyType',
                value: row.propertyType,
                message: `Invalid property type: ${row.propertyType}`
            });
        }
        
        // Check for invalid land size (houses should have landSize > 0)
        if (row.propertyType && row.propertyType.toLowerCase() === 'house' && 
            (!row.landSize || row.landSize === '0')) {
            issues.push({
                type: 'INVALID_VALUE',
                line: lineNum,
                suburb: row.suburb,
                field: 'landSize',
                value: row.landSize,
                message: 'House should have landSize > 0'
            });
        }
    });
    
    console.log(`Total properties: ${rows.length}`);
    console.log(`Issues found: ${issues.length}\n`);
    
    if (issues.length > 0) {
        issues.forEach(issue => {
            console.log(`[${issue.type}] Line ${issue.line} (${issue.suburb}): ${issue.message}`);
        });
    } else {
        console.log('✅ No issues found in properties.csv');
    }
    
    return issues;
}

// Validate suburbs.csv
function validateSuburbs() {
    console.log('\n=== Validating suburbs.csv ===\n');
    const { rows } = readCSV(path.join(__dirname, '../data/suburbs.csv'));
    const issues = [];
    
    rows.forEach((row, index) => {
        const lineNum = index + 2; // +2 for header and 0-index
        
        // Check for missing LGA
        if (!row.lga || row.lga.trim() === '') {
            issues.push({
                type: 'MISSING_FIELD',
                line: lineNum,
                suburb: row.suburb,
                field: 'lga',
                message: 'Missing LGA data'
            });
        }
        
        // Check for missing median price
        if (!row.medianPrice || row.medianPrice === '0' || row.medianPrice === '') {
            issues.push({
                type: 'MISSING_FIELD',
                line: lineNum,
                suburb: row.suburb,
                field: 'medianPrice',
                message: 'Missing or zero median price'
            });
        }
        
        // Check for missing commute times
        if (!row.primaryCommuteMinutes || row.primaryCommuteMinutes === '0' || row.primaryCommuteMinutes === '') {
            issues.push({
                type: 'MISSING_FIELD',
                line: lineNum,
                suburb: row.suburb,
                field: 'primaryCommuteMinutes',
                message: 'Missing primary commute time'
            });
        }
        
        if (!row.secondaryCommuteMinutes || row.secondaryCommuteMinutes === '0' || row.secondaryCommuteMinutes === '') {
            issues.push({
                type: 'MISSING_FIELD',
                line: lineNum,
                suburb: row.suburb,
                field: 'secondaryCommuteMinutes',
                message: 'Missing secondary commute time'
            });
        }
        
        // Check for placeholder amenity values
        const placeholderValues = ['3', '2', '10', '50'];
        const amenityFields = ['parksDensity', 'childcareCenters', 'shoppingCenters', 'cafesRestaurants'];
        
        amenityFields.forEach(field => {
            if (placeholderValues.includes(row[field])) {
                issues.push({
                    type: 'PLACEHOLDER_VALUE',
                    line: lineNum,
                    suburb: row.suburb,
                    field: field,
                    value: row[field],
                    message: `Possible placeholder value: ${field} = ${row[field]}`
                });
            }
        });
        
        // Check for missing coordinates
        if (!row.latitude || !row.longitude || row.latitude === '0' || row.longitude === '0') {
            issues.push({
                type: 'MISSING_FIELD',
                line: lineNum,
                suburb: row.suburb,
                field: 'coordinates',
                message: 'Missing latitude or longitude'
            });
        }
    });
    
    console.log(`Total suburbs: ${rows.length}`);
    console.log(`Issues found: ${issues.length}\n`);
    
    // Group issues by type
    const grouped = {};
    issues.forEach(issue => {
        if (!grouped[issue.type]) {
            grouped[issue.type] = [];
        }
        grouped[issue.type].push(issue);
    });
    
    Object.keys(grouped).forEach(type => {
        console.log(`\n[${type}]: ${grouped[type].length} issues`);
        if (grouped[type].length <= 10) {
            grouped[type].forEach(issue => {
                console.log(`  - Line ${issue.line} (${issue.suburb}): ${issue.message}`);
            });
        } else {
            console.log(`  - Showing first 5 examples:`);
            grouped[type].slice(0, 5).forEach(issue => {
                console.log(`    Line ${issue.line} (${issue.suburb}): ${issue.message}`);
            });
            console.log(`  - ... and ${grouped[type].length - 5} more`);
        }
    });
    
    if (issues.length === 0) {
        console.log('✅ No issues found in suburbs.csv');
    }
    
    return issues;
}

// Main validation function
function validateAll() {
    console.log('========================================');
    console.log('HomeScorePro Data Validation Report');
    console.log('========================================');
    
    const propertyIssues = validateProperties();
    const suburbIssues = validateSuburbs();
    
    const totalIssues = propertyIssues.length + suburbIssues.length;
    
    console.log('\n========================================');
    console.log(`Total Issues: ${totalIssues}`);
    console.log('========================================\n');
    
    if (totalIssues === 0) {
        console.log('✅ All data validation checks passed!');
    } else {
        console.log('⚠️  Please review and fix the issues above.');
    }
    
    return {
        properties: propertyIssues,
        suburbs: suburbIssues,
        total: totalIssues
    };
}

// Run validation if called directly
if (require.main === module) {
    validateAll();
}

module.exports = { validateAll, validateProperties, validateSuburbs };

