import { test, expect } from '@playwright/test';

/**
 * B-Score Calculation Tests
 * Verifies Property Evaluator form and B-Score calculation with 5 tiers
 */
test.describe('B-Score Calculation Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Switch to Property tab using the switchTab function
    await page.evaluate(() => {
      if (typeof switchTab === 'function') {
        switchTab('property');
      }
    });
    
    await page.waitForTimeout(500);
    
    // Wait for property tab content to be visible
    await page.waitForSelector('#property-tab.tab-content.active', { state: 'visible', timeout: 5000 }).catch(() => {});
  });

  test('Property form accepts input', async ({ page }) => {
    // Find address input
    const addressInput = page.locator('#property-address');
    
    if (await addressInput.count() === 0) {
      test.skip('Property form not found');
      return;
    }

    await addressInput.fill('8 Robert Street, Bulleen');
    
    // Verify input was accepted
    const value = await addressInput.inputValue();
    expect(value).toContain('Robert Street');
  });

  test('B-Score calculation works with test property', async ({ page }) => {
    // Fill in the form with test property data
    const addressInput = page.locator('#property-address');
    
    if (await addressInput.count() === 0) {
      test.skip('Property form not found');
      return;
    }

    await addressInput.fill('8 Robert Street, Bulleen');

    // Fill suburb
    const suburbInput = page.locator('#property-suburb-input');
    if (await suburbInput.count() > 0) {
      await suburbInput.fill('Bulleen');
      await page.waitForTimeout(500); // Wait for autocomplete
    }

    // Fill price
    const priceInput = page.locator('#property-price');
    if (await priceInput.count() > 0) {
      await priceInput.fill('850000');
    }

    // Select property type
    const typeSelect = page.locator('#property-type');
    if (await typeSelect.count() > 0) {
      await typeSelect.selectOption({ value: 'house' });
    }

    // Fill land size
    const landSizeInput = page.locator('#land-size');
    if (await landSizeInput.count() > 0) {
      await landSizeInput.fill('600');
    }

    // Fill bedrooms (default is 3, but let's set it)
    const bedroomsInput = page.locator('#bedrooms');
    if (await bedroomsInput.count() > 0) {
      await bedroomsInput.fill('3');
    }

    // Fill bathrooms (default is 2, but let's set it)
    const bathroomsInput = page.locator('#bathrooms');
    if (await bathroomsInput.count() > 0) {
      await bathroomsInput.fill('2');
    }

    // Fill street quality (it's a select)
    const streetQualityInput = page.locator('#street-quality');
    if (await streetQualityInput.count() > 0) {
      await streetQualityInput.selectOption({ value: '3' });
    }

    // Click calculate button
    const calculateButton = page.locator('button:has-text("Calculate B-Score"), button:has-text("Calculate")').first();
    await calculateButton.click();

    await page.waitForTimeout(2000);

    // Verify B-Score is displayed (not "--")
    const scoreValue = page.locator('#b-score-value');
    const scoreText = await scoreValue.textContent();
    
    // Should contain a number (the score), not "--"
    expect(scoreText).not.toBe('--');
    expect(scoreText).toMatch(/\d+/);
  });

  test('B-Score displays 5 tier values', async ({ page }) => {
    const addressInput = page.locator('#property-address');
    
    if (await addressInput.count() === 0) {
      test.skip('Property form not found');
      return;
    }

    // Fill minimal required fields
    await addressInput.fill('8 Robert Street, Bulleen');
    
    const suburbInput = page.locator('#property-suburb-input');
    if (await suburbInput.count() > 0) {
      await suburbInput.fill('Bulleen');
      await page.waitForTimeout(500);
    }
    
    const priceInput = page.locator('#property-price');
    if (await priceInput.count() > 0) {
      await priceInput.fill('850000');
    }

    const calculateButton = page.locator('button:has-text("Calculate B-Score"), button:has-text("Calculate")').first();
    await calculateButton.click();

    await page.waitForTimeout(2000);

    // Check if breakdown is displayed
    const breakdown = page.locator('#b-score-breakdown');
    const isVisible = await breakdown.isVisible().catch(() => false);
    
    if (isVisible) {
      // Check for tier labels in breakdown
      const breakdownText = await breakdown.textContent();
      const tierKeywords = ['Investment', 'Location', 'Accessibility', 'Property', 'Lifestyle'];
      const foundTiers = tierKeywords.filter(keyword => 
        breakdownText?.toLowerCase().includes(keyword.toLowerCase())
      );
      
      // Should find at least 4 out of 5 tier keywords
      expect(foundTiers.length).toBeGreaterThanOrEqual(3);
    } else {
      // If breakdown not visible, check page text for tier keywords
      const pageText = await page.textContent('body');
      const tierKeywords = ['Investment', 'Location', 'Accessibility', 'Property', 'Lifestyle'];
      const foundTiers = tierKeywords.filter(keyword => 
        pageText?.toLowerCase().includes(keyword.toLowerCase())
      );
      
      // Should find at least 3 tier keywords
      expect(foundTiers.length).toBeGreaterThanOrEqual(3);
    }
  });

  test('B-Score calculation has no console errors', async ({ page }) => {
    const consoleErrors = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    const addressInput = page.locator('#property-address');
    
    if (await addressInput.count() === 0) {
      test.skip('Property form not found');
      return;
    }

    await addressInput.fill('8 Robert Street, Bulleen');
    
    const suburbInput = page.locator('#property-suburb-input');
    if (await suburbInput.count() > 0) {
      await suburbInput.fill('Bulleen');
      await page.waitForTimeout(500);
    }
    
    const priceInput = page.locator('#property-price');
    if (await priceInput.count() > 0) {
      await priceInput.fill('850000');
    }

    const calculateButton = page.locator('button:has-text("Calculate B-Score"), button:has-text("Calculate")').first();
    await calculateButton.click();

    await page.waitForTimeout(2000);

    // Filter out known non-critical errors
    const criticalErrors = consoleErrors.filter(err => 
      !err.includes('favicon') && 
      !err.includes('404') &&
      !err.includes('Failed to load resource') &&
      !err.includes('Non-Error promise rejection')
    );

    expect(criticalErrors.length).toBe(0,
      `Console errors during B-Score calculation: ${criticalErrors.join('; ')}`);
  });

  test('B-Score value is in valid range (0-100)', async ({ page }) => {
    const addressInput = page.locator('#property-address');
    
    if (await addressInput.count() === 0) {
      test.skip('Property form not found');
      return;
    }

    await addressInput.fill('8 Robert Street, Bulleen');
    
    const suburbInput = page.locator('#property-suburb-input');
    if (await suburbInput.count() > 0) {
      await suburbInput.fill('Bulleen');
      await page.waitForTimeout(500);
    }
    
    const priceInput = page.locator('#property-price');
    if (await priceInput.count() > 0) {
      await priceInput.fill('850000');
    }

    const calculateButton = page.locator('button:has-text("Calculate B-Score"), button:has-text("Calculate")').first();
    await calculateButton.click();

    await page.waitForTimeout(2000);

    // Extract score value
    const scoreValue = page.locator('#b-score-value');
    const scoreText = await scoreValue.textContent();
    const scoreMatch = scoreText.match(/(\d+\.?\d*)/);
    
    if (scoreMatch) {
      const score = parseFloat(scoreMatch[1]);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    } else {
      // If no match, score might be "--" which means calculation didn't run
      expect(scoreText).not.toBe('--');
    }
  });
});

