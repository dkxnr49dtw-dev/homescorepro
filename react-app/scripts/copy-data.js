#!/usr/bin/env node
/**
 * Pre-build script to copy data files to public directory
 * This ensures data is available in production builds
 */

import { copyFileSync, mkdirSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sourceDir = join(__dirname, '../../data');
const targetDir = join(__dirname, '../public/data');

// Create target directory if it doesn't exist
try {
  mkdirSync(targetDir, { recursive: true });
  console.log('✅ Created public/data directory');
} catch (error) {
  if (error.code !== 'EEXIST') {
    console.error('❌ Error creating directory:', error);
    process.exit(1);
  }
}

// Copy files from data directory
try {
  const files = readdirSync(sourceDir);
  let copiedCount = 0;
  
  for (const file of files) {
    const sourcePath = join(sourceDir, file);
    const targetPath = join(targetDir, file);
    
    // Skip directories
    if (statSync(sourcePath).isDirectory()) {
      continue;
    }
    
    // Copy file
    copyFileSync(sourcePath, targetPath);
    copiedCount++;
    console.log(`✅ Copied ${file}`);
  }
  
  console.log(`\n✅ Successfully copied ${copiedCount} file(s) to public/data`);
} catch (error) {
  console.error('❌ Error copying files:', error);
  process.exit(1);
}


