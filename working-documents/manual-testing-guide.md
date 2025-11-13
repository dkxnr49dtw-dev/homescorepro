# Manual Testing Guide - Multi-Browser & Mobile
## Step-by-Step Instructions for Comprehensive Testing

**Created:** January 13, 2025  
**Purpose:** Detailed manual testing instructions for Safari, Firefox, Edge, and mobile devices  
**Status:** Ready for Use

---

## Quick Start

### Prerequisites
1. Local server running: `python3 -m http.server 8000`
2. Browser developer tools enabled
3. Test address ready: `8 Robert Street, Bulleen`

### Test URL
- Local: `http://localhost:8000`
- Network (for mobile): `http://[YOUR_MAC_IP]:8000` (e.g., `http://192.168.1.100:8000`)

---

## Safari (macOS) Testing

### Setup
1. Open Safari
2. Enable Developer menu:
   - Safari > Settings > Advanced
   - Check "Show Develop menu in menu bar"
3. Clear cache: Develop > Empty Caches
4. Open Web Inspector: Develop > Show Web Inspector

### Test Steps

#### 1. Page Load Test
- Navigate to `http://localhost:8000`
- Check Web Inspector Console for errors
- Check Network tab - verify all files load:
  - `index.html`
  - `data/suburbs.csv`
  - `data/properties.csv`
  - `data/config.json`
  - CSS files
  - JavaScript (inline)

**Expected:** All pages load, no errors, all data files load successfully

#### 2. Navigation Test
- Click "Suburb Scout" link → Should scroll to section
- Click "Property Evaluator" link → Should scroll to section
- Click "Pricing" link → Should navigate to `pricing.html`
- Click "About" link → Should navigate to `about.html`
- Click "Contact" link → Should navigate to `contact.html`
- Click logo → Should scroll to top

**Expected:** All navigation works, smooth scrolling

#### 3. A-Score Calculation Test
- Scroll to "Suburb Scout" section
- Enter "Bulleen" in search box
- Click "Search" button
- Verify:
  - Top 3 suburbs displayed
  - A-Score shown for each
  - 4 tier values shown (Investment, Location, Accessibility, Lifestyle)
  - No console errors

**Expected:** A-Score calculated correctly, all tiers displayed

#### 4. B-Score Calculation Test
- Scroll to "Property Evaluator" section
- Switch to "Property Evaluation" tab
- Enter property details:
  - Address: "8 Robert Street, Bulleen"
  - Price: "850000"
  - Type: "House"
  - Land Size: "600"
  - Bedrooms: "3"
  - Bathrooms: "2"
  - Street Quality: "3"
- Click "Calculate B-Score"
- Verify:
  - B-Score calculated
  - 5 tier values shown ✅ **CONFIRMED 5 TIERS**
  - No console errors

**Expected:** B-Score calculated correctly, all 5 tiers displayed

#### 5. Geolocation Test
- Scroll to "Location Scout" section
- Click "Get My Location" button
- Grant location permission
- Verify:
  - Current location detected
  - Nearby suburbs displayed
  - No console errors

**Expected:** Geolocation works, nearby suburbs found

#### 6. localStorage Test
- Calculate a property B-Score
- Click "Save Property" (if available)
- Grant permission if prompted
- Open Web Inspector > Storage > Local Storage
- Verify property saved
- Refresh page
- Verify property still saved

**Expected:** localStorage works, data persists

#### 7. Responsive Design Test
- Open Web Inspector
- Toggle Responsive Design Mode (Cmd+Option+R)
- Test viewports:
  - iPhone (375x667)
  - iPad (768x1024)
  - Desktop (1920x1080)
- Verify layout adapts correctly

**Expected:** Responsive design works on all viewports

---

## Safari (iOS) Testing

### Setup
1. Connect iPhone/iPad to Mac via USB
2. On device: Settings > Safari > Advanced > Web Inspector (enable)
3. On Mac: Safari > Develop > [Your Device] > [Website]
4. Ensure Mac and device on same Wi-Fi network

### Access Methods

#### Method 1: Local Network
1. Find Mac's IP address:
   - System Settings > Network > Wi-Fi > Details > IP Address
   - Or: `ifconfig | grep "inet " | grep -v 127.0.0.1`
2. On device Safari, navigate to: `http://[MAC_IP]:8000`
   - Example: `http://192.168.1.100:8000`

#### Method 2: Standalone Test File
1. AirDrop `user-testing/standalone-test.html` to device
2. Open in Safari
3. No server required

### Test Steps

#### 1. Basic Functionality
- Navigate to website
- Verify page loads
- Test touch interactions
- Verify forms usable
- Check for horizontal scrolling issues

**Expected:** All features work, no layout issues

#### 2. PWA "Add to Home Screen"
- Open website in Safari
- Tap Share button (square with arrow)
- Scroll down, tap "Add to Home Screen"
- Edit name if desired, tap "Add"
- Verify app icon on home screen
- Tap app icon to launch
- Verify:
  - App opens in standalone mode (no browser UI)
  - All features work
  - No Safari address bar visible

**Expected:** PWA installs, launches in standalone mode, all features work

#### 3. Geolocation on Device
- Open website
- Tap "Get My Location"
- Grant permission
- Verify current location detected
- Verify nearby suburbs displayed

**Expected:** Geolocation works on device

#### 4. Touch Interactions
- Test all buttons
- Test form inputs
- Test scrolling
- Test navigation
- Verify touch targets adequate (44x44px minimum)

**Expected:** All touch interactions work smoothly

---

## Firefox (Desktop) Testing

### Setup
1. Open Firefox
2. Open Developer Tools (F12)
3. Clear cache: Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)
4. Navigate to `http://localhost:8000`

### Test Steps

#### 1. Page Load Test
- Navigate to website
- Check Console for errors
- Check Network tab - verify all files load
- Verify no JavaScript errors

**Expected:** All pages load, no errors

#### 2. Core Features Test
- Test Suburb Scout search
- Test A-Score calculation
- Test B-Score calculation
- Test property saving
- Test navigation

**Expected:** All features work correctly

#### 3. Performance Test
- Check page load time
- Check calculation speed
- Check for memory leaks (Performance tab)

**Expected:** Performance acceptable

---

## Edge (Desktop) Testing

### Setup
1. Open Microsoft Edge
2. Open Developer Tools (F12)
3. Clear cache: Ctrl+Shift+Delete
4. Navigate to `http://localhost:8000`

### Test Steps

#### 1. Page Load Test
- Navigate to website
- Check Console for errors
- Check Network tab - verify all files load
- Verify no JavaScript errors

**Expected:** All pages load, no errors

#### 2. Core Features Test
- Test Suburb Scout search
- Test A-Score calculation
- Test B-Score calculation
- Test property saving
- Test navigation

**Expected:** All features work correctly

#### 3. Windows Compatibility
- Test on Windows 10/11
- Verify no Windows-specific issues
- Test performance

**Expected:** Works correctly on Windows

---

## Mobile Device Testing (Android)

### Setup
1. Ensure Android device on same Wi-Fi as Mac
2. Find Mac's IP address
3. On Android device, navigate to: `http://[MAC_IP]:8000`

### Chrome (Android) Testing

#### Test Steps
1. Open Chrome on Android
2. Navigate to website
3. Test all features:
   - Suburb search
   - A-Score calculation
   - B-Score calculation
   - Property saving
   - Geolocation
4. Test responsive design
5. Test touch interactions

**Expected:** All features work, responsive design correct

### Firefox (Android) Testing

#### Test Steps
1. Open Firefox on Android
2. Navigate to website
3. Test all features
4. Test responsive design
5. Test touch interactions

**Expected:** All features work, responsive design correct

---

## Test Results Template

### Browser Test Results

**Browser:** [Chrome/Safari/Firefox/Edge]  
**Version:** [Version number]  
**Platform:** [macOS/Windows/iOS/Android]  
**Test Date:** [Date]

#### Page Load
- [ ] All 7 pages load
- [ ] No console errors
- [ ] All data files load
- [ ] Load time acceptable

#### Navigation
- [ ] All navigation links work
- [ ] Smooth scrolling works
- [ ] Conditional links show/hide correctly

#### A-Score Calculation
- [ ] Suburb search works
- [ ] A-Score calculated correctly
- [ ] 4 tier values displayed
- [ ] Strategy determination works

#### B-Score Calculation
- [ ] Property input form works
- [ ] B-Score calculated correctly
- [ ] 5 tier values displayed ✅ **CONFIRMED 5 TIERS**
- [ ] Property type scoring works
- [ ] Consensus scoring works (if enabled)

#### Onboarding & Preferences
- [ ] Onboarding flow works
- [ ] Preferences saved
- [ ] Preferences integrated into calculations

#### Access Control
- [ ] Free tier limitations work
- [ ] Paid tier features work
- [ ] Password access works

#### Geolocation
- [ ] Permission prompt appears
- [ ] Location detected
- [ ] Nearby suburbs found

#### localStorage
- [ ] Property saving works
- [ ] Data persists after refresh
- [ ] Permission prompt works (if required)

#### Responsive Design
- [ ] Desktop view works (1920px)
- [ ] Tablet view works (768px)
- [ ] Mobile view works (375px)
- [ ] No horizontal scrolling

#### PWA (iOS/macOS)
- [ ] "Add to Home Screen" option appears (iOS)
- [ ] App installs correctly
- [ ] Standalone mode works
- [ ] All features work in standalone mode

#### Issues Found
[List any issues found]

#### Notes
[Any additional notes]

---

## Common Issues & Solutions

### Issue: Can't access local server from mobile device
**Solution:**
1. Ensure Mac and device on same Wi-Fi
2. Check Mac firewall settings
3. Use ngrok for tunneling: `ngrok http 8000`
4. Or use standalone test file

### Issue: Safari localStorage not working
**Solution:**
1. Check if Private Browsing mode (disables localStorage)
2. Check Safari privacy settings
3. Grant website permissions

### Issue: Geolocation not working in Safari
**Solution:**
1. Check Safari > Settings > Websites > Location Services
2. Grant permission when prompted
3. Check macOS System Settings > Privacy & Security > Location Services

### Issue: PWA "Add to Home Screen" not appearing
**Solution:**
1. Verify manifest.json loads correctly
2. Check Safari > Settings > Websites > Add to Home Screen
3. Ensure website is HTTPS (or localhost)
4. Clear Safari cache

---

## Testing Checklist Summary

### Desktop Browsers
- [ ] Chrome (already tested)
- [ ] Safari (macOS) - Manual testing required
- [ ] Firefox - Manual testing required
- [ ] Edge - Manual testing required

### Mobile Browsers
- [ ] Safari (iPhone) - Manual testing + PWA required
- [ ] Safari (iPad) - Manual testing + PWA required
- [ ] Chrome (Android) - Manual testing required
- [ ] Firefox (Android) - Manual testing required

### PWA Testing
- [ ] Safari iOS "Add to Home Screen"
- [ ] Safari macOS "Add to Dock" (if available)
- [ ] Standalone mode functionality

---

**Guide Version:** 1.0  
**Last Updated:** January 13, 2025  
**Status:** Ready for Use

**Note:** This guide provides step-by-step instructions for manual testing across all browsers and devices. Follow the instructions systematically and document all results.

