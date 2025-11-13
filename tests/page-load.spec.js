import { test, expect } from '@playwright/test';

/**
 * Page Load Tests
 * Verifies all pages load correctly, assets load, and no console errors
 */
const pages = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about.html' },
  { name: 'Contact', path: '/contact.html' },
  { name: 'Pricing', path: '/pricing.html' },
  { name: 'Privacy', path: '/privacy.html' },
  { name: 'Terms', path: '/terms.html' },
  { name: 'Members', path: '/members.html' },
];

const requiredAssets = [
  '/data/suburbs.csv',
  '/data/properties.csv',
  '/data/config.json',
  '/manifest.json',
];

test.describe('Page Load Tests', () => {
  for (const page of pages) {
    test(`${page.name} page loads successfully`, async ({ page: p, baseURL }) => {
      const consoleErrors = [];
      const networkFailures = [];

      // Listen for console errors
      p.on('console', (msg) => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      // Listen for failed network requests
      p.on('response', (response) => {
        if (response.status() >= 400) {
          networkFailures.push({
            url: response.url(),
            status: response.status(),
          });
        }
      });

      await p.goto(page.path);
      await p.waitForLoadState('networkidle');

      // Filter out known non-critical errors
      const criticalErrors = consoleErrors.filter(err => 
        !err.includes('favicon') && 
        !err.includes('404') &&
        !err.includes('Failed to load resource') &&
        !err.includes('Non-Error promise rejection')
      );
      
      expect(criticalErrors.length).toBe(0, 
        `Critical console errors found: ${criticalErrors.join(', ')}`);

      // Filter out non-critical network failures (like favicon 404)
      const criticalFailures = networkFailures.filter(failure => 
        !failure.url.includes('favicon') &&
        !failure.url.includes('apple-touch-icon')
      );
      
      expect(criticalFailures.length).toBe(0,
        `Critical network failures: ${JSON.stringify(criticalFailures)}`);

      // Verify page title exists
      await expect(p).toHaveTitle(/.+/);
    });
  }

  test('Required data files load on home page', async ({ page }) => {
    const loadedAssets = [];

    // Track asset loading
    page.on('response', (response) => {
      const url = response.url();
      if (requiredAssets.some(asset => url.includes(asset))) {
        loadedAssets.push({
          url: url.split('/').pop(),
          status: response.status(),
        });
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verify all required assets loaded
    for (const asset of requiredAssets) {
      const assetName = asset.split('/').pop();
      const loaded = loadedAssets.find(a => a.url === assetName);
      expect(loaded, `Asset ${assetName} should load`).toBeDefined();
      expect(loaded?.status).toBe(200);
    }
  });

  test('No JavaScript errors on page load', async ({ page }) => {
    const jsErrors = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Filter out known non-critical errors if any
        if (!text.includes('favicon') && !text.includes('404')) {
          jsErrors.push(text);
        }
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    expect(jsErrors.length).toBe(0,
      `JavaScript errors found: ${jsErrors.join('; ')}`);
  });

  test('Page load time is acceptable', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;

    // Should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });
});

