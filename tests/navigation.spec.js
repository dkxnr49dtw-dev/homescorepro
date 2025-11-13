import { test, expect } from '@playwright/test';

/**
 * Navigation Tests
 * Verifies all navigation links work correctly and smooth scrolling
 */
test.describe('Navigation Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('Suburb Scout link scrolls to section', async ({ page }) => {
    // Find and click Suburb Scout link
    const suburbScoutLink = page.locator('a[href*="suburb-scout"], a:has-text("Suburb Scout")').first();
    if (await suburbScoutLink.count() > 0) {
      await suburbScoutLink.click();
      await page.waitForTimeout(500); // Wait for scroll animation
      
      // Verify we're in the suburb scout section (check for search input)
      const searchInput = page.locator('#suburb-select, input[placeholder*="suburb" i]');
      await expect(searchInput.first()).toBeVisible();
    }
  });

  test('Property Evaluator link scrolls to section', async ({ page }) => {
    const propertyEvaluatorLink = page.locator('a[href*="property-evaluator"], a:has-text("Property Evaluator")').first();
    if (await propertyEvaluatorLink.count() > 0) {
      await propertyEvaluatorLink.click();
      await page.waitForTimeout(500);
      
      // Verify we're in the property evaluator section
      const propertyForm = page.locator('#property-form, input[name*="address" i]');
      await expect(propertyForm.first()).toBeVisible();
    }
  });

  test('Pricing link navigates to pricing page', async ({ page }) => {
    const pricingLink = page.locator('a[href="/pricing.html"], a:has-text("Pricing")').first();
    await pricingLink.click();
    await expect(page).toHaveURL(/.*pricing\.html/);
    await expect(page.locator('body')).toContainText(/pricing|plan|subscription/i);
  });

  test('About link navigates to about page', async ({ page }) => {
    const aboutLink = page.locator('a[href="/about.html"], a:has-text("About")').first();
    await aboutLink.click();
    await expect(page).toHaveURL(/.*about\.html/);
  });

  test('Contact link navigates to contact page', async ({ page }) => {
    const contactLink = page.locator('a[href="/contact.html"], a:has-text("Contact")').first();
    await contactLink.click();
    await expect(page).toHaveURL(/.*contact\.html/);
  });

  test('Logo link scrolls to top', async ({ page }) => {
    // Scroll down first
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);
    
    const scrollBefore = await page.evaluate(() => window.scrollY);
    
    // Click logo
    const logo = page.locator('a[href="/"], a[href="#"], .logo, header a').first();
    await logo.click();
    await page.waitForTimeout(500);
    
    const scrollAfter = await page.evaluate(() => window.scrollY);
    expect(scrollAfter).toBeLessThan(scrollBefore);
  });

  test('All navigation links are accessible', async ({ page }) => {
    const navLinks = page.locator('nav a, header a[href]');
    const count = await navLinks.count();
    
    expect(count).toBeGreaterThan(0);
    
    // Verify all links exist and have href (some may be hidden on mobile)
    let visibleCount = 0;
    for (let i = 0; i < count; i++) {
      const link = navLinks.nth(i);
      const isVisible = await link.isVisible().catch(() => false);
      const href = await link.getAttribute('href');
      
      if (isVisible) {
        visibleCount++;
        expect(href).toBeTruthy();
      } else {
        // Hidden links should still have href attribute
        expect(href).toBeTruthy();
      }
    }
    
    // At least some links should be visible
    expect(visibleCount).toBeGreaterThan(0);
  });

  test('Smooth scrolling works', async ({ page }) => {
    // Test smooth scroll behavior
    await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = 'smooth';
    });

    const suburbScoutLink = page.locator('a[href*="suburb-scout"], a:has-text("Suburb Scout")').first();
    if (await suburbScoutLink.count() > 0) {
      const startScroll = await page.evaluate(() => window.scrollY);
      await suburbScoutLink.click();
      
      // Wait for scroll to complete
      await page.waitForFunction(
        (start) => Math.abs(window.scrollY - start) > 100,
        startScroll,
        { timeout: 2000 }
      );
      
      const endScroll = await page.evaluate(() => window.scrollY);
      expect(endScroll).not.toBe(startScroll);
    }
  });
});

