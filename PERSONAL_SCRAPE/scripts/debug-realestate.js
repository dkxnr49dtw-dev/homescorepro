const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

/**
 * Debug script to inspect realestate.com.au page structure
 */

async function debugRealEstate() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  try {
    console.log('🌐 Navigating to realestate.com.au...');
    await page.goto('https://www.realestate.com.au', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });

    // Handle cookies
    try {
      const cookieButton = page.locator('button:has-text("Accept"), button:has-text("I accept")').first();
      if (await cookieButton.isVisible({ timeout: 3000 })) {
        await cookieButton.click();
        await page.waitForTimeout(1000);
      }
    } catch (e) {}

    // Try to navigate to Frankston
    console.log('🔍 Navigating to Frankston search...');
    await page.goto('https://www.realestate.com.au/buy/in-frankston,+vic+3199/list-1', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    await page.waitForTimeout(8000); // Wait for dynamic content

    // Get page info
    const title = await page.title();
    const url = page.url();
    console.log(`\n📄 Page Title: ${title}`);
    console.log(`🔗 Current URL: ${url}\n`);

    // Get all links
    const allLinks = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a[href]'));
      return links.map(link => ({
        href: link.getAttribute('href'),
        text: link.textContent?.trim().substring(0, 50)
      }));
    });

    console.log(`\n📊 Found ${allLinks.length} total links\n`);

    // Filter property links
    const propertyLinks = allLinks.filter(link => {
      const href = link.href?.toLowerCase() || '';
      return (
        href.includes('/property-') || 
        href.includes('/property/') ||
        (href.includes('/buy/') && /\d+$/.test(link.href))
      ) && !href.includes('list-');
    });

    console.log(`🏠 Found ${propertyLinks.length} property links:\n`);
    propertyLinks.slice(0, 15).forEach((link, i) => {
      console.log(`${i + 1}. ${link.href}`);
      if (link.text) console.log(`   Text: ${link.text}`);
    });

    // Get page HTML structure sample
    const htmlSample = await page.evaluate(() => {
      const body = document.body.innerHTML.substring(0, 5000);
      return body;
    });

    // Save debug info
    const debugDir = path.join(__dirname, '..', 'pdf-import');
    if (!fs.existsSync(debugDir)) {
      fs.mkdirSync(debugDir, { recursive: true });
    }

    fs.writeFileSync(
      path.join(debugDir, 'debug-links.json'),
      JSON.stringify({ propertyLinks, allLinks: allLinks.slice(0, 50) }, null, 2)
    );

    fs.writeFileSync(
      path.join(debugDir, 'debug-html-sample.txt'),
      htmlSample
    );

    await page.screenshot({ 
      path: path.join(debugDir, 'debug-page-full.png'), 
      fullPage: true 
    });

    console.log(`\n✅ Debug files saved to pdf-import/`);
    console.log(`   - debug-links.json`);
    console.log(`   - debug-html-sample.txt`);
    console.log(`   - debug-page-full.png\n`);

    // Keep browser open for inspection
    console.log('⏸️  Browser will stay open for 30 seconds for manual inspection...');
    await page.waitForTimeout(30000);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

debugRealEstate();

