# Playwright Test Suite - Quick Reference
## HomeScorePro Automated Testing

**Created:** November 14, 2025  
**Status:** Ready for Use  
**Coverage:** 92% of manual testing scenarios

---

## Quick Start

```bash
# Install dependencies (one-time)
npm install
npx playwright install --with-deps

# Run all tests
npm test

# Run specific browser
npm run test:chrome
npm run test:firefox
npm run test:safari
npm run test:edge

# View test report
npm run test:report
```

---

## Test Files

1. **page-load.spec.js** - Page loading, assets, console errors
2. **navigation.spec.js** - Navigation links, scrolling
3. **a-score.spec.js** - Suburb search, A-Score calculation (4 tiers)
4. **b-score.spec.js** - Property form, B-Score calculation (5 tiers)
5. **responsive.spec.js** - iPhone, iPad, Desktop viewports
6. **localStorage.spec.js** - Data persistence
7. **geolocation.spec.js** - Geolocation API
8. **all-pages.spec.js** - All 7 pages basic functionality

---

## Test Results

- **Total Tests:** 402 across 6 browser configurations
- **Pass Rate:** 95% (381 passing, 21 with timing/visibility issues)
- **Browsers:** Chrome, Firefox, Safari, Edge, Mobile Chrome, Mobile Safari
- **Coverage:** 92% of manual testing guide automated

---

## Before Launch

⚠️ **IMPORTANT:** Run full test suite before production launch:
```bash
npm test
```

Verify all tests pass and review HTML report.

---

**See:** `automated-test-results.md` for detailed results

