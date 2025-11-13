import { test, expect } from '@playwright/test';

/**
 * All Pages Tests
 * Verifies all pages load and basic functionality
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

test.describe('All Pages Tests', () => {
  for (const page of pages) {
    test(`${page.name} page has valid HTML structure`, async ({ page: p }) => {
      await p.goto(page.path);
      await p.waitForLoadState('networkidle');

      // Verify basic HTML structure
      const body = p.locator('body');
      await expect(body).toBeVisible();

      // Verify title exists
      const title = await p.title();
      expect(title.length).toBeGreaterThan(0);
    });

    test(`${page.name} page has no critical console errors`, async ({ page: p }) => {
      const consoleErrors = [];

      p.on('console', (msg) => {
        if (msg.type() === 'error') {
          const text = msg.text();
          // Filter out non-critical errors
          if (!text.includes('favicon') && 
              !text.includes('404') && 
              !text.includes('Failed to load resource')) {
            consoleErrors.push(text);
          }
        }
      });

      await p.goto(page.path);
      await p.waitForLoadState('networkidle');

      expect(consoleErrors.length).toBe(0,
        `Critical console errors on ${page.name}: ${consoleErrors.join('; ')}`);
    });

    test(`${page.name} page loads within acceptable time`, async ({ page: p }) => {
      const startTime = Date.now();
      await p.goto(page.path);
      await p.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;

      // Should load within 10 seconds
      expect(loadTime).toBeLessThan(10000);
    });
  }
});

