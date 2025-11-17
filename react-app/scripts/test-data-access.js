#!/usr/bin/env node
/**
 * Test script to verify data access setup
 * Tests both symlink (dev) and copied files (production)
 */

import { existsSync, readFileSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const publicDataDir = join(__dirname, '../public/data');
const distDataDir = join(__dirname, '../../dist/data');

console.log('🧪 Testing Data Access Setup...\n');

// Test 1: Check if public/data exists (for dev)
console.log('1. Testing development setup (public/data):');
if (existsSync(publicDataDir)) {
  console.log('   ✅ public/data directory exists');
  
  const suburbsPath = join(publicDataDir, 'suburbs.csv');
  const propertiesPath = join(publicDataDir, 'properties.csv');
  const configPath = join(publicDataDir, 'config.json');
  
  if (existsSync(suburbsPath)) {
    const stats = statSync(suburbsPath);
    console.log(`   ✅ suburbs.csv exists (${stats.size} bytes)`);
  } else {
    console.log('   ❌ suburbs.csv not found');
  }
  
  if (existsSync(propertiesPath)) {
    const stats = statSync(propertiesPath);
    console.log(`   ✅ properties.csv exists (${stats.size} bytes)`);
  } else {
    console.log('   ❌ properties.csv not found');
  }
  
  if (existsSync(configPath)) {
    const stats = statSync(configPath);
    console.log(`   ✅ config.json exists (${stats.size} bytes)`);
  } else {
    console.log('   ❌ config.json not found');
  }
} else {
  console.log('   ❌ public/data directory does not exist');
  console.log('   💡 Run: npm run prebuild to copy data files');
}

console.log('\n2. Testing production setup (dist/data):');
if (existsSync(distDataDir)) {
  console.log('   ✅ dist/data directory exists');
  
  const suburbsPath = join(distDataDir, 'suburbs.csv');
  const propertiesPath = join(distDataDir, 'properties.csv');
  
  if (existsSync(suburbsPath)) {
    const stats = statSync(suburbsPath);
    console.log(`   ✅ suburbs.csv exists (${stats.size} bytes)`);
  } else {
    console.log('   ❌ suburbs.csv not found');
  }
  
  if (existsSync(propertiesPath)) {
    const stats = statSync(propertiesPath);
    console.log(`   ✅ properties.csv exists (${stats.size} bytes)`);
  } else {
    console.log('   ❌ properties.csv not found');
  }
} else {
  console.log('   ⚠️  dist/data directory does not exist (run build first)');
}

console.log('\n✅ Data access test complete!');


