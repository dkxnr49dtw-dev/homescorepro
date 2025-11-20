#!/usr/bin/env node
/**
 * Script to update Netlify build settings via API
 * 
 * Usage:
 * 1. Get your Netlify API token from: https://app.netlify.com/user/applications
 * 2. Set it as environment variable: export NETLIFY_AUTH_TOKEN="your-token"
 * 3. Run: node update-netlify-settings.js
 * 
 * Or pass token as argument: node update-netlify-settings.js your-token
 */

const https = require('https');

const NETLIFY_API_BASE = 'api.netlify.com';
const SITE_NAME = 'homescorepro'; // Your site name

// Get API token from environment or argument
const API_TOKEN = process.env.NETLIFY_AUTH_TOKEN || process.argv[2];

if (!API_TOKEN) {
  console.error('❌ Error: Netlify API token required');
  console.error('');
  console.error('Get your token from: https://app.netlify.com/user/applications');
  console.error('');
  console.error('Usage:');
  console.error('  export NETLIFY_AUTH_TOKEN="your-token"');
  console.error('  node update-netlify-settings.js');
  console.error('');
  console.error('Or:');
  console.error('  node update-netlify-settings.js your-token');
  process.exit(1);
}

// Make API request
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : null;
    
    const options = {
      hostname: NETLIFY_API_BASE,
      port: 443,
      path: path,
      method: method,
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
        ...(postData && { 'Content-Length': Buffer.byteLength(postData) })
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : {};
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(new Error(`API Error ${res.statusCode}: ${parsed.message || body}`));
          }
        } catch (e) {
          reject(new Error(`Parse error: ${e.message}`));
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    if (postData) {
      req.write(postData);
    }
    
    req.end();
  });
}

async function updateNetlifySettings() {
  try {
    console.log('🔍 Finding your site...');
    
    // Get all sites to find the site ID
    const sites = await makeRequest('GET', '/api/v1/sites');
    const site = sites.find(s => s.name === SITE_NAME || s.ssl_url?.includes(SITE_NAME));
    
    if (!site) {
      console.error(`❌ Site "${SITE_NAME}" not found`);
      console.error('Available sites:', sites.map(s => s.name).join(', '));
      process.exit(1);
    }
    
    console.log(`✅ Found site: ${site.name} (${site.id})`);
    console.log('');
    console.log('🔧 Updating build settings...');
    
    // Update build settings
    const buildSettings = {
      cmd: 'cd react-app && npm install && npm run build',
      dir: 'react-app',
      base: 'react-app',
      functions_dir: null,
      publish: 'react-app/dist'
    };
    
    const updated = await makeRequest('PATCH', `/api/v1/sites/${site.id}`, {
      build_settings: buildSettings
    });
    
    console.log('✅ Build settings updated successfully!');
    console.log('');
    console.log('Updated settings:');
    console.log(`  Base directory: ${updated.build_settings?.base || 'react-app'}`);
    console.log(`  Build command: ${updated.build_settings?.cmd || buildSettings.cmd}`);
    console.log(`  Publish directory: ${updated.build_settings?.publish || buildSettings.publish}`);
    console.log('');
    console.log('🚀 Triggering a new deploy...');
    
    // Trigger a new deploy
    const deploy = await makeRequest('POST', `/api/v1/sites/${site.id}/builds`, {
      clear_cache: true
    });
    
    console.log('✅ New deploy triggered!');
    console.log(`   Deploy ID: ${deploy.id}`);
    console.log('');
    console.log('📊 Check your deployment status at:');
    console.log(`   https://app.netlify.com/sites/${site.name}/deploys`);
    console.log('');
    console.log('✨ Done! Your React app will be deployed shortly.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('401') || error.message.includes('403')) {
      console.error('');
      console.error('Authentication failed. Please check your API token.');
      console.error('Get a new token from: https://app.netlify.com/user/applications');
    }
    process.exit(1);
  }
}

updateNetlifySettings();

