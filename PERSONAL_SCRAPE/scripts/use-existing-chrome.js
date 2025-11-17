const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const os = require('os');

/**
 * Script that connects to your existing Chrome browser
 * This uses Chrome that's already installed on your Mac
 */

async function useExistingChrome() {
  // Path to Chrome on macOS
  const chromePaths = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge'
  ];

  let chromePath = null;
  for (const path of chromePaths) {
    if (fs.existsSync(path)) {
      chromePath = path;
      console.log(`✅ Found browser at: ${path}`);
      break;
    }
  }

  if (!chromePath) {
    console.log('❌ Could not find Chrome/Chromium/Edge installed on your Mac');
    console.log('   Playwright will use its own browser instead');
    console.log('   Available browsers:');
    chromePaths.forEach(p => console.log(`     - ${p}`));
  }

  // Option 1: Connect to existing Chrome instance (if running with remote debugging)
  // You'd need to start Chrome with: /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222
  // Then connect with: const browser = await chromium.connectOverCDP('http://localhost:9222');

  // Option 2: Launch your installed Chrome
  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome', // Use installed Chrome if available
    // executablePath: chromePath, // Or specify path directly
    args: [
      '--disable-blink-features=AutomationControlled',
      '--disable-dev-shm-usage'
    ]
  });

  console.log('🌐 Browser launched!');
  console.log('   This is using:', chromePath ? 'Your installed Chrome' : 'Playwright\'s bundled browser');

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });

  const page = await context.newPage();
  await page.goto('https://www.realestate.com.au/buy/in-frankston,+vic+3199/list-1');
  
  console.log('✅ Page loaded! Browser will stay open for 10 seconds...');
  await page.waitForTimeout(10000);

  await browser.close();
}

useExistingChrome().catch(console.error);

