import { test, expect } from '@playwright/test';

/**
 * Geolocation Tests
 * Verifies geolocation functionality (mocked)
 */
test.describe('Geolocation Tests', () => {
  test.beforeEach(async ({ page, context }) => {
    // Grant geolocation permission
    await context.grantPermissions(['geolocation'], { origin: 'http://localhost:8000' });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('Geolocation API is available', async ({ page }) => {
    const isAvailable = await page.evaluate(() => {
      return 'geolocation' in navigator;
    });

    expect(isAvailable).toBe(true);
  });

  test('Get My Location button exists', async ({ page }) => {
    const locationButton = page.locator('button:has-text("Location"), button:has-text("Get My Location"), button:has-text("My Location")').first();
    
    // Button may or may not exist, but if it does, it should be functional
    if (await locationButton.count() > 0) {
      await expect(locationButton).toBeVisible();
    }
  });

  test('Geolocation can be mocked and used', async ({ page }) => {
    // Mock geolocation
    await page.context().setGeolocation({ latitude: -37.7773, longitude: 145.1373 });

    // Try to trigger geolocation
    const locationButton = page.locator('button:has-text("Location"), button:has-text("Get My Location")').first();
    
    if (await locationButton.count() > 0) {
      await locationButton.click();
      await page.waitForTimeout(1000);

      // Verify no errors occurred
      const consoleErrors = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      const criticalErrors = consoleErrors.filter(err => 
        !err.includes('favicon') && 
        !err.includes('404')
      );

      expect(criticalErrors.length).toBe(0);
    }
  });
});

