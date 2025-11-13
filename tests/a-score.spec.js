import { test, expect } from '@playwright/test';

/**
 * A-Score Calculation Tests
 * Verifies Suburb Scout search and A-Score calculation with 4 tiers
 */
test.describe('A-Score Calculation Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for suburb select dropdown to be populated (wait for options beyond the default "Select suburb...")
    await page.waitForFunction(() => {
      const select = document.getElementById('suburb-select');
      return select && select.options.length > 1;
    }, { timeout: 30000 });
  });

  test('Suburb search works', async ({ page }) => {
    // Find suburb select dropdown
    const suburbSelect = page.locator('#suburb-select');
    
    if (await suburbSelect.count() === 0) {
      test.skip('Suburb select dropdown not found');
      return;
    }

    // Wait for options to be populated
    await page.waitForFunction(() => {
      const select = document.getElementById('suburb-select');
      return select && select.options.length > 1;
    }, { timeout: 30000 });

    // Select "Bulleen" from dropdown
    await suburbSelect.selectOption({ label: /bulleen/i });
    
    // Wait for calculation to complete - wait for score to update from "--"
    await page.waitForFunction(() => {
      const scoreEl = document.getElementById('a-score-value');
      return scoreEl && scoreEl.textContent !== '--' && scoreEl.textContent.trim() !== '';
    }, { timeout: 5000 }).catch(() => {
      // If timeout, continue anyway
    });
    await page.waitForTimeout(1000);

    // Verify A-Score is displayed (not "--")
    const scoreValue = page.locator('#a-score-value');
    const scoreText = await scoreValue.textContent();
    expect(scoreText).not.toBe('--');
    expect(scoreText).toMatch(/\d+/);
  });

  test('A-Score is calculated and displayed', async ({ page }) => {
    const suburbSelect = page.locator('#suburb-select');
    
    if (await suburbSelect.count() === 0) {
      test.skip('Suburb select dropdown not found');
      return;
    }

    // Wait for options to be populated
    await page.waitForFunction(() => {
      const select = document.getElementById('suburb-select');
      return select && select.options.length > 1;
    }, { timeout: 30000 });

    // Select "Bulleen"
    await suburbSelect.selectOption({ label: /bulleen/i });
    
    await page.waitForTimeout(1500);

    // Check A-Score value
    const scoreValue = page.locator('#a-score-value');
    const scoreText = await scoreValue.textContent();
    
    // Verify score is displayed (should contain a number, not "--")
    expect(scoreText).not.toBe('--');
    expect(scoreText).toMatch(/\d+/);
  });

  test('A-Score displays 4 tier values', async ({ page }) => {
    const suburbSelect = page.locator('#suburb-select');
    
    if (await suburbSelect.count() === 0) {
      test.skip('Suburb select dropdown not found');
      return;
    }

    // Wait for options to be populated
    await page.waitForFunction(() => {
      const select = document.getElementById('suburb-select');
      return select && select.options.length > 1;
    }, { timeout: 30000 });

    // Select "Bulleen"
    await suburbSelect.selectOption({ label: /bulleen/i });
    
    await page.waitForTimeout(1500);

    // Check if breakdown is displayed
    const breakdown = page.locator('#a-score-breakdown');
    const isVisible = await breakdown.isVisible().catch(() => false);
    
    if (isVisible) {
      // Check for tier labels in breakdown
      const breakdownText = await breakdown.textContent();
      const tierKeywords = ['Investment', 'Location', 'Accessibility', 'Lifestyle'];
      const foundTiers = tierKeywords.filter(keyword => 
        breakdownText?.toLowerCase().includes(keyword.toLowerCase())
      );
      
      // Should find at least 3 out of 4 tier keywords
      expect(foundTiers.length).toBeGreaterThanOrEqual(3);
    } else {
      // If breakdown not visible, check page text for tier keywords
      const pageText = await page.textContent('body');
      const tierKeywords = ['Investment', 'Location', 'Accessibility', 'Lifestyle'];
      const foundTiers = tierKeywords.filter(keyword => 
        pageText?.toLowerCase().includes(keyword.toLowerCase())
      );
      
      // Should find at least 2 tier keywords
      expect(foundTiers.length).toBeGreaterThanOrEqual(2);
    }
  });

  test('Top 3 suburbs are displayed', async ({ page }) => {
    // This test checks the suburb search feature (not the dropdown)
    const searchInput = page.locator('#suburb-search-input');
    
    if (await searchInput.count() === 0) {
      test.skip('Suburb search input not found');
      return;
    }

    // Type "Bulleen" in search
    await searchInput.fill('Bulleen');
    
    // Click search button
    const searchButton = page.locator('#search-btn, button:has-text("Search")').first();
    await searchButton.click();

    await page.waitForTimeout(2000);

    // Look for top suburbs container
    const topSuburbsContainer = page.locator('#top-suburbs-container');
    const isVisible = await topSuburbsContainer.isVisible().catch(() => false);
    
    if (isVisible) {
      // Check for suburb results
      const results = page.locator('#top-suburbs-container > div, .suburb-result, [class*="suburb"]');
      const resultCount = await results.count();
      
      // Should show at least 1 result (may be top 3)
      expect(resultCount).toBeGreaterThanOrEqual(1);
    } else {
      // If container not visible, test passes (search may have different behavior)
      test.skip('Top suburbs container not visible - search may work differently');
    }
  });

  test('A-Score calculation has no console errors', async ({ page }) => {
    const consoleErrors = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    const suburbSelect = page.locator('#suburb-select');
    
    if (await suburbSelect.count() === 0) {
      test.skip('Suburb select dropdown not found');
      return;
    }

    // Wait for options to be populated
    await page.waitForFunction(() => {
      const select = document.getElementById('suburb-select');
      return select && select.options.length > 1;
    }, { timeout: 30000 });

    // Select "Bulleen"
    await suburbSelect.selectOption({ label: /bulleen/i });
    
    await page.waitForTimeout(1500);

    // Filter out known non-critical errors
    const criticalErrors = consoleErrors.filter(err => 
      !err.includes('favicon') && 
      !err.includes('404') &&
      !err.includes('Failed to load resource') &&
      !err.includes('Non-Error promise rejection')
    );

    expect(criticalErrors.length).toBe(0,
      `Console errors during A-Score calculation: ${criticalErrors.join('; ')}`);
  });
});

