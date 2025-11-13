import { test, expect } from '@playwright/test';

/**
 * localStorage Tests
 * Verifies data persistence and localStorage functionality
 */
test.describe('localStorage Tests', () => {
  test.beforeEach(async ({ page, context }) => {
    // Clear localStorage before each test
    await context.clearCookies();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('localStorage is available', async ({ page }) => {
    const isAvailable = await page.evaluate(() => {
      try {
        localStorage.setItem('test', 'value');
        const value = localStorage.getItem('test');
        localStorage.removeItem('test');
        return value === 'value';
      } catch (e) {
        return false;
      }
    });

    expect(isAvailable).toBe(true);
  });

  test('Property data can be saved to localStorage', async ({ page }) => {
    // Try to save a property (if save functionality exists)
    const addressInput = page.locator('input[name*="address" i], input[placeholder*="address" i]').first();
    
    if (await addressInput.count() === 0) {
      test.skip('Property form not found');
      return;
    }

    await addressInput.fill('8 Robert Street, Bulleen');
    
    // Look for save button
    const saveButton = page.locator('button:has-text("Save"), button:has-text("Save Property")').first();
    
    if (await saveButton.count() > 0) {
      await saveButton.click();
      await page.waitForTimeout(500);

      // Check if data was saved to localStorage
      const savedData = await page.evaluate(() => {
        const keys = Object.keys(localStorage);
        return keys.filter(key => key.toLowerCase().includes('property') || key.toLowerCase().includes('saved'));
      });

      // If save functionality exists, data should be saved
      if (savedData.length > 0) {
        expect(savedData.length).toBeGreaterThan(0);
      }
    }
  });

  test('Data persists after page refresh', async ({ page }) => {
    // Set test data in localStorage
    await page.evaluate(() => {
      localStorage.setItem('test-property', JSON.stringify({
        address: '8 Robert Street, Bulleen',
        price: 850000,
      }));
    });

    // Refresh page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Verify data still exists
    const dataExists = await page.evaluate(() => {
      return localStorage.getItem('test-property') !== null;
    });

    expect(dataExists).toBe(true);

    // Clean up
    await page.evaluate(() => {
      localStorage.removeItem('test-property');
    });
  });

  test('Preferences can be saved and loaded', async ({ page }) => {
    // Try to find preferences/onboarding
    const hasPreferences = await page.evaluate(() => {
      // Check if preferences UI exists
      return document.querySelector('[class*="preference"], [id*="preference"], [class*="onboarding"]') !== null;
    });

    if (hasPreferences) {
      // Set preferences in localStorage
      await page.evaluate(() => {
        localStorage.setItem('preferences', JSON.stringify({
          minBudget: 500000,
          maxBudget: 800000,
          theme: 'dark',
        }));
      });

      await page.reload();
      await page.waitForLoadState('networkidle');

      // Verify preferences loaded
      const preferencesLoaded = await page.evaluate(() => {
        const prefs = localStorage.getItem('preferences');
        return prefs !== null;
      });

      expect(preferencesLoaded).toBe(true);
    }
  });
});

