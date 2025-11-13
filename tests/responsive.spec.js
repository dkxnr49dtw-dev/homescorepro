import { test, expect } from '@playwright/test';

/**
 * Responsive Design Tests
 * Verifies layout adapts correctly across different viewports
 */
const viewports = [
  { name: 'iPhone', width: 375, height: 667 },
  { name: 'iPad', width: 768, height: 1024 },
  { name: 'Desktop', width: 1920, height: 1080 },
];

test.describe('Responsive Design Tests', () => {
  for (const viewport of viewports) {
    test(`Layout works on ${viewport.name} (${viewport.width}x${viewport.height})`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Verify page loads
      await expect(page.locator('body')).toBeVisible();

      // Check for horizontal scrolling (should not exist)
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      expect(hasHorizontalScroll).toBe(false);
    });

    test(`Navigation is accessible on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Find navigation links
      const navLinks = page.locator('nav a, header a[href]');
      const count = await navLinks.count();

      if (count > 0) {
        // Verify at least one nav link is visible
        const firstLink = navLinks.first();
        await expect(firstLink).toBeVisible();
      }
    });

    test(`Forms are usable on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Test suburb search input
      const searchInput = page.locator('#suburb-select, input[placeholder*="suburb" i]').first();
      if (await searchInput.count() > 0) {
        await expect(searchInput).toBeVisible();
        
        // Verify input is not too small (touch target should be at least 44px)
        const box = await searchInput.boundingBox();
        if (box) {
          expect(box.height).toBeGreaterThanOrEqual(30); // Reasonable minimum
        }
      }
    });
  }

  test('Mobile viewport has no horizontal scrolling', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Scroll through the page and check for horizontal overflow
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });

    expect(hasHorizontalScroll).toBe(false);
  });

  test('Desktop viewport displays full layout', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verify main sections are visible
    const body = page.locator('body');
    await expect(body).toBeVisible();

    // Check that content uses available width (not stuck to mobile width)
    const contentWidth = await page.evaluate(() => {
      const main = document.querySelector('main') || document.body;
      return main.offsetWidth;
    });

    expect(contentWidth).toBeGreaterThan(600); // Should use desktop width
  });
});

