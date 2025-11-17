# HomeScorePro - Complete Testing Guide

**Last Updated:** November 2025  
**Purpose:** Comprehensive testing procedures for automated, manual, browser, mobile, and standalone testing  
**Status:** Ready for use

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Automated Testing](#automated-testing)
3. [Manual Testing](#manual-testing)
4. [Browser Testing](#browser-testing)
5. [Mobile Device Testing](#mobile-device-testing)
6. [Standalone Test Version](#standalone-test-version)
7. [Test Coverage Matrix](#test-coverage-matrix)
8. [Test Execution Checklist](#test-execution-checklist)

---

## Quick Start

### Prerequisites
1. Local server running: `python3 -m http.server 8000`
2. Browser developer tools enabled
3. Test address ready: `8 Robert Street, Bulleen` (Postcode: 3105)

### Test URL
- Local: `http://localhost:8000`
- Network (for mobile): `http://[YOUR_MAC_IP]:8000` (e.g., `http://192.168.1.100:8000`)

### Quick Test Checklist
- [ ] All 7 pages load without errors
- [ ] A-Score calculation works
- [ ] B-Score calculation works
- [ ] Navigation works on all pages
- [ ] Mobile responsive design works
- [ ] No console errors

---

## Automated Testing

### Playwright Test Suite

**Status:** ✅ Created (402 tests, 92% coverage)

**Run Tests:**
```bash
npm test
```

**Test Files:**
- `tests/a-score.spec.js` - A-Score calculation tests
- `tests/b-score.spec.js` - B-Score calculation tests
- `tests/navigation.spec.js` - Navigation tests
- `tests/page-load.spec.js` - Page load tests
- `tests/responsive.spec.js` - Responsive design tests
- `tests/geolocation.spec.js` - Geolocation tests
- `tests/localStorage.spec.js` - Local storage tests
- `tests/all-pages.spec.js` - All pages accessibility tests

**Test Coverage:**
- ✅ A-Score calculations (15 metrics, 4 tiers)
- ✅ B-Score calculations (23 metrics, 5 tiers)
- ✅ Data loading (CSV parsing, JSON config)
- ✅ Navigation and routing
- ✅ Responsive design
- ✅ Geolocation API
- ✅ Local storage operations

**View Results:**
- HTML report: `playwright-report/index.html`
- Open in browser after test run

---

## Manual Testing

### Test Environment Setup

**Browsers to Test:**
1. Chrome/Chromium (Desktop & Mobile)
2. Safari (macOS, iPhone, iPad)
3. Firefox (Desktop & Mobile)
4. Edge (Desktop)

**Devices to Test:**
- Desktop: Mac, Windows, Linux
- Tablet: iPad (Safari), Android tablet
- Mobile: iPhone (Safari), Android phone (Chrome/Firefox)
- Screen Sizes: 320px, 768px, 1024px, 1920px

### Pages to Test (7 Total)

1. `index.html` - Public landing page
2. `members.html` - Paid members dashboard
3. `pricing.html` - Pricing page
4. `about.html` - About us page
5. `contact.html` - Contact page
6. `privacy.html` - Privacy policy
7. `terms.html` - Terms of service

### Core Functionality Tests

#### 1. Page Load & Initialization

**Test Steps:**
1. Navigate to each page URL
2. Wait for page load complete
3. Verify no JavaScript errors in console
4. Verify all data files load (suburbs.csv, properties.csv, config.json)
5. Check load time (< 3 seconds)

**Expected Results:**
- ✅ All 7 pages load successfully
- ✅ No console errors
- ✅ Data loaded (397 suburbs, 32 properties, config)
- ✅ Load time acceptable

#### 2. A-Score Calculation Test

**Test Steps:**
1. Navigate to `index.html`
2. Scroll to "Suburb Scout" section
3. Enter "Bulleen" in search box
4. Click "Search" button
5. Verify results displayed

**Expected Results:**
- ✅ Top 3 suburbs displayed
- ✅ A-Score shown for each (0-100)
- ✅ 4 tier values shown (Investment, Location, Accessibility, Lifestyle)
- ✅ No console errors

**Test Data:**
- Search: "Bulleen"
- Expected: Suburbs with Bulleen in name
- Verify: Scores calculated correctly

#### 3. B-Score Calculation Test

**Test Steps:**
1. Navigate to "Property Evaluator" section
2. Switch to "Property Evaluation" tab
3. Enter property details:
   - Address: "8 Robert Street, Bulleen"
   - Price: "850000"
   - Type: "House"
   - Land Size: "600"
   - Bedrooms: "3"
   - Bathrooms: "2"
   - Street Quality: "3"
4. Click "Calculate B-Score"
5. Verify results

**Expected Results:**
- ✅ B-Score calculated (0-100)
- ✅ 5 tier values shown (Investment, Location, Accessibility, Property Features, Lifestyle)
- ✅ No console errors

#### 4. Navigation Test

**Test Steps:**
1. Test all navigation links
2. Test smooth scrolling
3. Test mobile menu (if applicable)
4. Test back/forward browser buttons

**Expected Results:**
- ✅ All links work correctly
- ✅ Smooth scrolling to sections
- ✅ Mobile menu opens/closes properly
- ✅ Browser navigation works

#### 5. Geolocation Test

**Test Steps:**
1. Navigate to "Location Scout" section
2. Click "Get My Location" button
3. Grant location permission
4. Verify nearby suburbs displayed

**Expected Results:**
- ✅ Location detected
- ✅ Nearby suburbs displayed
- ✅ No console errors
- ✅ Fallback works if permission denied

#### 6. Local Storage Test

**Test Steps:**
1. Save preferences
2. Save a property
3. Refresh page
4. Verify data persists

**Expected Results:**
- ✅ Preferences saved and loaded
- ✅ Properties saved and loaded
- ✅ Data persists after refresh
- ✅ No data loss

---

## Browser Testing

### Chrome/Chromium Testing

**Status:** ✅ Tested

**Test Focus:**
- All features work
- PWA functionality
- Performance
- Console errors

### Safari Testing (macOS)

**Setup:**
1. Open Safari
2. Enable Developer menu:
   - Safari > Settings > Advanced
   - Check "Show Develop menu in menu bar"
3. Clear cache: Develop > Empty Caches
4. Open Web Inspector: Develop > Show Web Inspector

**Safari-Specific Tests:**
- Geolocation API (stricter permissions)
- localStorage (privacy controls)
- CSS rendering differences
- JavaScript compatibility
- PWA manifest and service worker
- "Add to Home Screen" functionality

**Known Issues to Check:**
- CSS Grid/Flexbox differences
- JavaScript ES6+ compatibility
- localStorage privacy settings
- Geolocation permission prompts

### Firefox Testing

**Setup:**
1. Open Firefox
2. Enable Developer Tools (F12)
3. Clear cache: Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)

**Firefox-Specific Tests:**
- CSS compatibility
- JavaScript compatibility
- Performance
- Console errors

### Edge Testing

**Setup:**
1. Open Edge
2. Enable Developer Tools (F12)
3. Clear cache

**Edge-Specific Tests:**
- Windows compatibility
- CSS rendering
- JavaScript compatibility

---

## Mobile Device Testing

### iPhone/iPad Testing (Safari)

**Setup:**
1. Connect iPhone/iPad to Mac
2. Enable Web Inspector:
   - Settings > Safari > Advanced > Web Inspector
3. Open Safari on device
4. Navigate to local server (requires network sharing or ngrok)

**Test Methods:**

**Option 1: Local Network Access**
- Use Mac's IP address: `http://192.168.x.x:8000`
- Ensure devices on same Wi-Fi network
- Test all features

**Option 2: ngrok/Tunneling**
- Use ngrok to create public URL
- Access from any device
- Test all features

**Option 3: Standalone Test File**
- Use `user-testing/standalone-test.html`
- Share via AirDrop/iCloud
- Open directly on device

**Mobile-Specific Tests:**
- Touch interactions
- Responsive design
- Mobile menu
- Geolocation on mobile
- PWA "Add to Home Screen"
- Performance on mobile network
- Battery usage

### Android Testing

**Setup:**
1. Connect Android device to computer
2. Enable USB debugging
3. Use Chrome DevTools for remote debugging

**Test Methods:**
- Local network access
- ngrok tunneling
- Standalone test file

**Android-Specific Tests:**
- Chrome mobile browser
- Firefox mobile browser
- Touch interactions
- Responsive design
- Performance

---

## Standalone Test Version

### What is a Standalone Test?

A standalone test version is a single HTML file that:
- ✅ Works without a web server (just double-click to open)
- ✅ Contains all data embedded (397 suburbs, 32 properties, config)
- ✅ Perfect for sharing via iCloud, AirDrop, email
- ✅ Works on iPhone, iPad, and Mac Safari

### Current Standalone Test

**File:** `user-testing/standalone-test.html`  
**Size:** ~378KB  
**Data Embedded:**
- 397 suburbs (from `data/suburbs.csv`)
- 32 properties (from `data/properties.csv`)
- Configuration (from `data/config.json`)

### How to Use

1. Open `standalone-test.html` in Safari (double-click the file)
2. All features work immediately - no server needed!

### Creating a New Standalone Test

**When to Create:**
- Main website (`index.html`) is updated with new features
- Data files (`data/*.csv`, `data/*.json`) are updated
- You want to share a test version with users

**How to Create:**
```bash
cd user-testing
./build-standalone.sh
```

**Manual Process:**
1. Copy `index.html` to `standalone-test.html`
2. Embed CSV data as JavaScript arrays
3. Embed JSON config as JavaScript object
4. Update data loading functions to check embedded data first
5. Test standalone version works

### How It Works

The standalone version includes embedded data at the top:

```javascript
const embeddedSuburbData = [ /* 397 suburb objects */ ];
const embeddedPropertiesData = [ /* 32 property objects */ ];
const embeddedConfigData = { /* config object */ };
```

Data loading functions check for embedded data first, then fall back to fetching from files (for development).

---

## Test Coverage Matrix

### Pages (7 Total)
- [ ] `index.html` - Public landing page
- [ ] `members.html` - Paid members dashboard
- [ ] `pricing.html` - Pricing page
- [ ] `about.html` - About us page
- [ ] `contact.html` - Contact page
- [ ] `privacy.html` - Privacy policy
- [ ] `terms.html` - Terms of service

### Core Functionality
- [ ] A-Score Calculations (15 metrics, 4 tiers)
- [ ] B-Score Calculations (23 metrics, 5 tiers)
- [ ] Onboarding System (6 questions)
- [ ] Preference Integration (strategy, filters, consensus)
- [ ] Suburb Scout (search, filtering, results)
- [ ] Property Evaluator (input, calculation, saving)
- [ ] Access Control (free tier, paid tier, test access)
- [ ] Data Loading (CSV parsing, JSON config)
- [ ] Geolocation (browser API, fallback)
- [ ] Local Storage (preferences, properties, access)

### Browsers
- [ ] Chrome/Chromium (Desktop & Mobile)
- [ ] Safari (macOS, iPhone, iPad)
- [ ] Firefox (Desktop & Mobile)
- [ ] Edge (Desktop)

### Devices
- [ ] Desktop (Mac, Windows, Linux)
- [ ] Tablet (iPad, Android tablet)
- [ ] Mobile (iPhone, Android phone)

### Performance
- [ ] Page load time (< 3 seconds)
- [ ] Calculation speed (< 1 second)
- [ ] Memory usage (no leaks)
- [ ] Network usage (optimized)

---

## Test Execution Checklist

### Pre-Testing
- [ ] Local server running
- [ ] All data files present (suburbs.csv, properties.csv, config.json)
- [ ] Browser developer tools enabled
- [ ] Test data prepared

### Automated Testing
- [ ] Run Playwright test suite (`npm test`)
- [ ] Review test results
- [ ] Fix any failing tests
- [ ] Verify all tests pass

### Manual Testing - Desktop
- [ ] Test all pages load
- [ ] Test A-Score calculation
- [ ] Test B-Score calculation
- [ ] Test navigation
- [ ] Test geolocation
- [ ] Test local storage
- [ ] Test responsive design (resize browser)
- [ ] Check console for errors

### Manual Testing - Mobile
- [ ] Test on iPhone Safari
- [ ] Test on iPad Safari
- [ ] Test on Android Chrome
- [ ] Test touch interactions
- [ ] Test mobile menu
- [ ] Test PWA "Add to Home Screen"
- [ ] Test performance on mobile network

### Browser-Specific Testing
- [ ] Safari (macOS) - All features
- [ ] Safari (iOS) - All features
- [ ] Firefox - All features
- [ ] Edge - All features

### Post-Testing
- [ ] Document any issues found
- [ ] Create bug reports for critical issues
- [ ] Update test results
- [ ] Verify fixes

---

## Troubleshooting

### Issue: Tests failing
**Solution:**
- Check browser console for errors
- Verify data files are present
- Check file paths are correct
- Verify local server is running

### Issue: Geolocation not working
**Solution:**
- Check browser permissions
- Verify HTTPS or localhost (required for geolocation)
- Test fallback behavior

### Issue: Data not loading
**Solution:**
- Check CSV/JSON files exist
- Verify file paths are correct
- Check browser console for 404 errors
- Verify CORS settings (if using server)

### Issue: Mobile testing difficult
**Solution:**
- Use standalone test version
- Use ngrok for easy access
- Use browser DevTools device emulation (limited)

---

## Related Documentation

- **Backend Testing:** `backend-status.md` - Backend API testing
- **Deployment:** `deployment-guide.md` - Deployment testing
- **Project Understanding:** `project-understanding.md` - Complete project details

---

**Last Updated:** November 2025  
**Status:** Complete and ready for use

