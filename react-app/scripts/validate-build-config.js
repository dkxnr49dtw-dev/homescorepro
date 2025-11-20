#!/usr/bin/env node
/**
 * Pre-build validation script
 * Validates build configuration to prevent deployment errors
 * 
 * Checks:
 * 1. CSS @import order (must be at top of files)
 * 2. Vite config matches Netlify config
 * 3. Build output directory exists and matches publish path
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '../..');
const REACT_APP_DIR = path.resolve(__dirname, '..');
const NETLIFY_TOML = path.join(ROOT_DIR, 'netlify.toml');
const VITE_CONFIG = path.join(REACT_APP_DIR, 'vite.config.js');

let errors = [];
let warnings = [];

// Logging functions
function logError(message, file, line = null) {
  const location = line ? `${file}:${line}` : file;
  errors.push({ message, location });
  console.error(`❌ ERROR [${location}]: ${message}`);
}

function logWarning(message, file, line = null) {
  const location = line ? `${file}:${line}` : file;
  warnings.push({ message, location });
  console.warn(`⚠️  WARNING [${location}]: ${message}`);
}

function logInfo(message) {
  console.log(`ℹ️  INFO: ${message}`);
}

function logSuccess(message) {
  console.log(`✅ ${message}`);
}

// Check CSS @import order
function validateCSSImports() {
  logInfo('Validating CSS @import order...');
  
  const cssFiles = [
    path.join(REACT_APP_DIR, 'src/styles/index.css'),
    path.join(REACT_APP_DIR, 'src/styles/onboarding.css'),
  ];
  
  cssFiles.forEach(cssFile => {
    if (!fs.existsSync(cssFile)) {
      logWarning(`CSS file not found: ${cssFile}`);
      return;
    }
    
    const content = fs.readFileSync(cssFile, 'utf8');
    const lines = content.split('\n');
    
    // Find all @import statements
    const importLines = [];
    const otherRuleLines = [];
    
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('@import')) {
        importLines.push({ line: index + 1, content: trimmed });
      } else if (trimmed && !trimmed.startsWith('/*') && !trimmed.startsWith('*') && !trimmed.startsWith('//') && !trimmed.startsWith('@charset') && !trimmed.startsWith('@layer')) {
        // Check if it's a CSS rule (not comment, not @charset, not empty @layer)
        if (trimmed.includes('{') || trimmed.includes(':') || trimmed.includes('@')) {
          otherRuleLines.push({ line: index + 1, content: trimmed.substring(0, 50) });
        }
      }
    });
    
    // Check if any @import comes after other rules
    if (importLines.length > 0 && otherRuleLines.length > 0) {
      const lastImportLine = importLines[importLines.length - 1].line;
      const firstOtherRuleLine = otherRuleLines[0].line;
      
      if (lastImportLine > firstOtherRuleLine) {
        logError(
          `@import statements must come before all other CSS rules. Found @import at line ${lastImportLine} but other rules start at line ${firstOtherRuleLine}`,
          path.relative(ROOT_DIR, cssFile),
          lastImportLine
        );
      }
    }
  });
  
  if (errors.length === 0) {
    logSuccess('CSS @import order is correct');
  }
}

// Validate Vite config
function validateViteConfig() {
  logInfo('Validating Vite configuration...');
  
  if (!fs.existsSync(VITE_CONFIG)) {
    logError('vite.config.js not found', path.relative(ROOT_DIR, VITE_CONFIG));
    return;
  }
  
  const content = fs.readFileSync(VITE_CONFIG, 'utf8');
  
  // Check outDir
  const outDirMatch = content.match(/outDir:\s*['"]([^'"]+)['"]/);
  if (outDirMatch) {
    const outDir = outDirMatch[1];
    logInfo(`Vite outDir: ${outDir}`);
    
    // Should be 'dist' (relative to react-app) not '../dist'
    if (outDir.startsWith('../')) {
      logError(
        `Vite outDir should be 'dist' (relative to react-app), not '${outDir}'. This causes build output to go to wrong location.`,
        path.relative(ROOT_DIR, VITE_CONFIG)
      );
    } else if (outDir !== 'dist') {
      logWarning(
        `Vite outDir is '${outDir}'. Expected 'dist' for Netlify compatibility.`,
        path.relative(ROOT_DIR, VITE_CONFIG)
      );
    }
  } else {
    logWarning('Could not find outDir in vite.config.js', path.relative(ROOT_DIR, VITE_CONFIG));
  }
}

// Validate Netlify config
function validateNetlifyConfig() {
  logInfo('Validating Netlify configuration...');
  
  if (!fs.existsSync(NETLIFY_TOML)) {
    logError('netlify.toml not found', path.relative(ROOT_DIR, NETLIFY_TOML));
    return;
  }
  
  const content = fs.readFileSync(NETLIFY_TOML, 'utf8');
  
  // Check base directory
  const baseMatch = content.match(/base\s*=\s*['"]([^'"]+)['"]/);
  const base = baseMatch ? baseMatch[1] : null;
  
  // Check publish directory
  const publishMatch = content.match(/publish\s*=\s*['"]([^'"]+)['"]/);
  const publish = publishMatch ? publishMatch[1] : null;
  
  // Check build command
  const commandMatch = content.match(/command\s*=\s*['"]([^'"]+)['"]/);
  const command = commandMatch ? commandMatch[1] : null;
  
  logInfo(`Netlify base: ${base || 'not set'}`);
  logInfo(`Netlify publish: ${publish || 'not set'}`);
  logInfo(`Netlify command: ${command || 'not set'}`);
  
  // Validate command doesn't have double cd
  if (base === 'react-app' && command && command.includes('cd react-app')) {
    logError(
      `Build command contains 'cd react-app' but base is already set to 'react-app'. This causes double path issue. Command should not include 'cd react-app'.`,
      path.relative(ROOT_DIR, NETLIFY_TOML)
    );
  }
  
  // Validate publish path
  if (base === 'react-app' && publish) {
    if (publish.startsWith('react-app/')) {
      logError(
        `Publish path '${publish}' should be relative to base. Since base is 'react-app', publish should be 'dist' not 'react-app/dist'.`,
        path.relative(ROOT_DIR, NETLIFY_TOML)
      );
    } else if (publish !== 'dist') {
      logWarning(
        `Publish path is '${publish}'. Expected 'dist' to match Vite output.`,
        path.relative(ROOT_DIR, NETLIFY_TOML)
      );
    }
  }
}

// Validate configuration consistency
function validateConfigConsistency() {
  logInfo('Validating configuration consistency...');
  
  // Read both configs
  if (!fs.existsSync(VITE_CONFIG) || !fs.existsSync(NETLIFY_TOML)) {
    return;
  }
  
  const viteContent = fs.readFileSync(VITE_CONFIG, 'utf8');
  const netlifyContent = fs.readFileSync(NETLIFY_TOML, 'utf8');
  
  const viteOutDirMatch = viteContent.match(/outDir:\s*['"]([^'"]+)['"]/);
  const netlifyBaseMatch = netlifyContent.match(/base\s*=\s*['"]([^'"]+)['"]/);
  const netlifyPublishMatch = netlifyContent.match(/publish\s*=\s*['"]([^'"]+)['"]/);
  
  if (viteOutDirMatch && netlifyBaseMatch && netlifyPublishMatch) {
    const viteOutDir = viteOutDirMatch[1];
    const netlifyBase = netlifyBaseMatch[1];
    const netlifyPublish = netlifyPublishMatch[1];
    
    // If base is react-app and outDir is dist, publish should be dist
    if (netlifyBase === 'react-app' && viteOutDir === 'dist' && netlifyPublish !== 'dist') {
      logError(
        `Configuration mismatch: Vite builds to 'dist', Netlify base is 'react-app', but publish is '${netlifyPublish}'. Should be 'dist'.`,
        path.relative(ROOT_DIR, NETLIFY_TOML)
      );
    }
  }
}

// Main validation
function main() {
  console.log('🔍 Validating build configuration...\n');
  
  validateCSSImports();
  validateViteConfig();
  validateNetlifyConfig();
  validateConfigConsistency();
  
  console.log('\n' + '='.repeat(60));
  console.log('Validation Summary:');
  console.log('='.repeat(60));
  
  if (errors.length > 0) {
    console.error(`\n❌ Found ${errors.length} error(s):`);
    errors.forEach((err, i) => {
      console.error(`  ${i + 1}. [${err.location}] ${err.message}`);
    });
    console.error('\n⚠️  Build will fail. Please fix these errors before deploying.\n');
    process.exit(1);
  }
  
  if (warnings.length > 0) {
    console.warn(`\n⚠️  Found ${warnings.length} warning(s):`);
    warnings.forEach((warn, i) => {
      console.warn(`  ${i + 1}. [${warn.location}] ${warn.message}`);
    });
    console.warn('\n⚠️  Warnings may cause issues. Please review.\n');
  }
  
  if (errors.length === 0 && warnings.length === 0) {
    logSuccess('All validations passed! Build configuration is correct.\n');
    process.exit(0);
  }
  
  process.exit(warnings.length > 0 ? 0 : 1);
}

main();

