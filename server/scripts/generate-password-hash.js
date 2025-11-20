#!/usr/bin/env node

/**
 * Generate password hash for site authentication
 * Usage: node generate-password-hash.js <password>
 */

const bcrypt = require('bcrypt');

const password = process.argv[2];

if (!password) {
  console.error('Usage: node generate-password-hash.js <password>');
  console.error('');
  console.error('Example:');
  console.error('  node generate-password-hash.js mySecurePassword123');
  process.exit(1);
}

if (password.length < 8) {
  console.error('Error: Password must be at least 8 characters long');
  process.exit(1);
}

(async () => {
  try {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    
    console.log('');
    console.log('✅ Password hash generated successfully!');
    console.log('');
    console.log('Add this to your server/.env file:');
    console.log('');
    console.log(`SITE_PASSWORD_HASH=${hash}`);
    console.log('');
    console.log('⚠️  Keep this hash secure and never commit it to version control!');
    console.log('');
  } catch (error) {
    console.error('Error generating hash:', error);
    process.exit(1);
  }
})();

