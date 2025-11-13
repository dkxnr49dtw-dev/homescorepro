# Comprehensive Testing Plan - HomeScorePro
## Multi-Browser, Multi-Device, Full Functionality Testing

**Created:** January 13, 2025  
**Purpose:** Complete testing plan covering all browsers, devices, pages, and functionality  
**Status:** Ready for Execution

---

## Test Environment Setup

### Browsers to Test
1. **Chrome/Chromium** (Desktop & Mobile)
   - Desktop: Latest stable version
   - Android: Chrome mobile
   - Test: All features, PWA, performance

2. **Safari** (Desktop & Mobile)
   - macOS: Latest Safari version
   - iOS: iPhone Safari (latest iOS)
   - iPad: iPad Safari
   - Test: PWA "Add to Home Screen", iOS-specific features

3. **Firefox** (Desktop & Mobile)
   - Desktop: Latest stable version
   - Android: Firefox mobile
   - Test: Compatibility, performance

4. **Edge** (Desktop)
   - Latest stable version
   - Test: Windows compatibility

### Devices to Test
- **Desktop:** Mac, Windows, Linux
- **Tablet:** iPad (Safari), Android tablet
- **Mobile:** iPhone (Safari), Android phone (Chrome/Firefox)
- **Screen Sizes:** 320px, 768px, 1024px, 1920px

### Test Server
- Local: `http://localhost:8000`
- Baseline Test Address: `8 Robert Street, Bulleen` (Postcode: 3105)

---

## Test Coverage Matrix

### Pages to Test (7 Total)
1. `index.html` - Public landing page
2. `members.html` - Paid members dashboard
3. `pricing.html` - Pricing page
4. `about.html` - About us page
5. `contact.html` - Contact page
6. `privacy.html` - Privacy policy
7. `terms.html` - Terms of service

### Core Functionality to Test
1. **A-Score Calculations** (15 metrics, 4 tiers)
2. **B-Score Calculations** (23 metrics, 5 tiers)
3. **Onboarding System** (6 questions)
4. **Preference Integration** (strategy, filters, consensus)
5. **Suburb Scout** (search, filtering, results)
6. **Property Evaluator** (input, calculation, saving)
7. **Access Control** (free tier, paid tier, password access)
8. **Data Loading** (CSV parsing, JSON config)
9. **Geolocation** (browser API, fallback)
10. **localStorage** (preferences, properties, access)

---

## Detailed Test Cases

### 1. Page Load & Initialization

#### Test 1.1: All Pages Load
**Browsers:** Chrome, Safari, Firefox, Edge  
**Devices:** Desktop, Tablet, Mobile

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

**Test Data:**
- `index.html` → Should load with hero section
- `members.html` → Should load with dashboard
- `pricing.html` → Should load pricing tiers
- `about.html` → Should load about content
- `contact.html` → Should load contact form
- `privacy.html` → Should load privacy policy
- `terms.html` → Should load terms of service

---

### 2. Navigation Testing

#### Test 2.1: Main Navigation Links
**Browsers:** All  
**Devices:** All

**Test Steps:**
1. On each page, click all navigation links
2. Verify correct page/section loads
3. Test smooth scrolling for anchor links
4. Verify "Members" link visibility (conditional)

**Expected Results:**
- ✅ All navigation links functional
- ✅ Smooth scrolling works
- ✅ Conditional links show/hide correctly
- ✅ Active page highlighted in navigation

**Links to Test:**
- HomeScorePro logo → `index.html`
- Suburb Scout → `#location-scout` or `index.html#location-scout`
- Property Evaluator → `#calculator` or `index.html#calculator`
- Pricing → `pricing.html`
- About → `about.html`
- Contact → `contact.html`
- Members → `members.html` (conditional)
- Sign Up → `members.html` or `pricing.html`

#### Test 2.2: Footer Links
**Browsers:** All  
**Devices:** All

**Test Steps:**
1. Scroll to footer on each page
2. Click all footer links
3. Verify correct destinations
4. Test external links (when implemented)

**Expected Results:**
- ✅ All footer links functional
- ✅ Internal links work correctly
- ✅ External links open in new tab (when implemented)

---

### 3. A-Score Calculation Testing

#### Test 3.1: A-Score Calculation Accuracy
**Browsers:** All  
**Devices:** Desktop (for detailed testing)

**Test Suburbs:**
- Bulleen (baseline test address)
- Hawthorn (high score suburb)
- Frankston (budget suburb)
- Melbourne CBD (inner metro)

**Test Steps:**
1. Navigate to Suburb Scout section
2. Search for each test suburb
3. Verify A-Score calculation
4. Verify 4 tier values (Investment, Location, Accessibility, Lifestyle)
5. Verify all 15 metrics are calculated
6. Check strategy determination (Investment/Balanced/Lifestyle)
7. Verify tier weights match strategy

**Expected Results:**
- ✅ A-Score calculated correctly (0-100 range)
- ✅ All 4 tiers have values
- ✅ Strategy determined from budget preferences
- ✅ Tier weights match strategy (Investment 45/30/15/10, Balanced 30/30/20/20, Lifestyle 20/35/15/30)

**Metrics to Verify (15 total):**
- Tier 1 (Investment): Capital Growth, Rental Yield
- Tier 2 (Location): IRSD, IER, IEO, Crime Rate
- Tier 3 (Accessibility): CBD Distance, Major Hub Access, Transit Score, Walk Score
- Tier 4 (Lifestyle): School Quality, Parks Density, Childcare Supply, Shopping Access, Cafes/Restaurants

#### Test 3.2: A-Score with Preferences
**Browsers:** All  
**Devices:** Desktop

**Test Steps:**
1. Complete onboarding with different preferences
2. Test Investment strategy (budget < $700k)
3. Test Balanced strategy (budget $700k-$1M)
4. Test Lifestyle strategy (budget > $1M)
5. Test geographic category filtering
6. Verify tier weights adjust based on preferences

**Expected Results:**
- ✅ Strategy determined from budget range
- ✅ Tier weights adjust correctly
- ✅ Geographic filters applied
- ✅ Family status affects Lifestyle tier
- ✅ Safety priority affects Location tier

---

### 4. B-Score Calculation Testing

#### Test 4.1: B-Score Calculation Accuracy
**Browsers:** All  
**Devices:** Desktop (for detailed testing)

**Test Properties:**
- 8 Robert Street, Bulleen (baseline)
- Sample properties from properties.csv
- Properties with different types (house, unit, townhouse)

**Test Steps:**
1. Navigate to Property Evaluator section
2. Enter property details (address, price, type, land size, bedrooms, bathrooms, street quality)
3. Enter Hampz Score and Gahee Score (if consensus enabled)
4. Calculate B-Score
5. Verify 5 tier values (Investment, Location, Accessibility, Property, Lifestyle)
6. Verify all 23 metrics are calculated
7. Check strategy determination
8. Verify consensus scoring (if enabled)

**Expected Results:**
- ✅ B-Score calculated correctly (0-100 range)
- ✅ All 5 tiers have values ✅ **CONFIRMED 5 TIERS**
- ✅ Strategy determined from property price
- ✅ Tier weights match strategy
- ✅ Consensus scoring works (if enabled)

**Metrics to Verify (23 total):**
- Tier 1 (Investment): Price Affordability, Property Type, Capital Growth, Rental Yield
- Tier 2 (Location): IRSD, IER, IEO, Crime Rate, Future Growth
- Tier 3 (Accessibility): Primary Commute, Secondary Commute, CBD Distance, Transit Score, Walk Score
- Tier 4 (Property): Land Size, Bedrooms, Bathrooms, Street Quality
- Tier 5 (Lifestyle): School Proximity, Parks Access, Childcare Proximity, Shopping Convenience, Walkable Dining

#### Test 4.2: B-Score with Consensus Scoring
**Browsers:** All  
**Devices:** Desktop

**Test Steps:**
1. Enable consensus scoring in onboarding
2. Enter property with Hampz Score = 8, Gahee Score = 7 (difference = 1)
3. Verify consensus bonus applied (+10 for < 5 points difference)
4. Enter property with Hampz Score = 8, Gahee Score = 2 (difference = 6)
5. Verify consensus bonus applied (+5 for 5-10 points difference)
6. Enter property with Hampz Score = 10, Gahee Score = 1 (difference = 9)
7. Verify consensus bonus applied (+5 for 5-10 points difference)
8. Enter property with Hampz Score = 10, Gahee Score = 5 (difference = 5)
9. Verify consensus bonus applied (+5 for 5-10 points difference)
10. Enter property with Hampz Score = 10, Gahee Score = 3 (difference = 7)
11. Verify consensus bonus applied (+5 for 5-10 points difference)
12. Enter property with Hampz Score = 10, Gahee Score = 0 (difference = 10)
13. Verify no bonus (0 for 10-15 points difference)
14. Enter property with Hampz Score = 10, Gahee Score = -5 (difference = 15)
15. Verify penalty applied (-5 for > 15 points difference)
16. Disable consensus scoring
17. Verify consensus scoring not applied

**Expected Results:**
- ✅ Consensus scoring enabled/disabled correctly
- ✅ Bonus/penalty calculated correctly:
  - < 5 points difference: +10 bonus
  - 5-10 points difference: +5 bonus
  - 10-15 points difference: 0
  - > 15 points difference: -5 penalty
- ✅ 15% weight applied when enabled
- ✅ No consensus scoring when disabled

---

### 5. Onboarding System Testing

#### Test 5.1: Onboarding Flow
**Browsers:** All  
**Devices:** All

**Test Steps:**
1. Clear localStorage
2. Navigate to `members.html` (or index.html if onboarding there)
3. Verify onboarding modal appears
4. Complete all 6 questions:
   - Primary Goal (Investment/Balanced/Lifestyle)
   - Budget Range ($500k-$750k default)
   - Family Status (Yes/No/Planning)
   - Safety Priority (High/Medium/Low)
   - Geographic Categories (BAYSIDE, HILLS & RANGES, INNER METRO, OUTER GROWTH, or All)
   - Consensus Scoring (Yes/No)
5. Click "Complete" or "Start Exploring"
6. Verify preferences saved to localStorage
7. Verify onboarding doesn't show again on refresh

**Expected Results:**
- ✅ Onboarding modal appears on first visit
- ✅ All 6 questions functional
- ✅ Preferences saved to localStorage
- ✅ Onboarding doesn't show again after completion
- ✅ Preferences applied to calculations

#### Test 5.2: Onboarding Skip Functionality
**Browsers:** All  
**Devices:** All

**Test Steps:**
1. Clear localStorage
2. Navigate to page with onboarding
3. Click "Skip" button
4. Verify default preferences saved
5. Verify onboarding doesn't show again

**Expected Results:**
- ✅ Skip button works
- ✅ Default preferences saved
- ✅ Onboarding doesn't show again

---

### 6. Preference Integration Testing

#### Test 6.1: Strategy Determination from Budget
**Browsers:** All  
**Devices:** Desktop

**Test Cases:**
1. Budget $400k-$600k → Investment strategy
2. Budget $700k-$900k → Balanced strategy
3. Budget $1.2M-$1.5M → Lifestyle strategy
4. No budget set → Default thresholds used

**Test Steps:**
1. Set budget in onboarding
2. Search for suburbs
3. Verify strategy determined correctly
4. Verify tier weights match strategy

**Expected Results:**
- ✅ Investment: Suburb median price ≤ (minBudget × 1.15)
- ✅ Lifestyle: Suburb median price ≥ (maxBudget × 0.85) AND ≤ (maxBudget × 1.20)
- ✅ Balanced: Between Investment and Lifestyle ranges
- ✅ Defaults used if no budget set

#### Test 6.2: Geographic Category Filtering
**Browsers:** All  
**Devices:** Desktop

**Test Steps:**
1. Select "BAYSIDE" only in onboarding
2. Search for suburbs
3. Verify only BAYSIDE suburbs shown
4. Select "INNER METRO" only
5. Verify only INNER METRO suburbs shown
6. Select "I want to see all"
7. Verify all suburbs shown

**Expected Results:**
- ✅ Geographic filters applied correctly
- ✅ Only selected categories shown
- ✅ "Show all" shows all suburbs
- ✅ Filter persists across sessions

#### Test 6.3: Family Status Impact
**Browsers:** All  
**Devices:** Desktop

**Test Steps:**
1. Set family status to "Yes" (has children)
2. Calculate A-Score and B-Score
3. Verify Lifestyle tier weight increased
4. Verify schools/childcare weight increased
5. Set family status to "No"
6. Verify weights return to normal

**Expected Results:**
- ✅ Family status affects tier weights
- ✅ Schools and childcare weighted higher with children
- ✅ Bedrooms/bathrooms weighted higher in B-Score

#### Test 6.4: Safety Priority Impact
**Browsers:** All  
**Devices:** Desktop

**Test Steps:**
1. Set safety priority to "High"
2. Calculate A-Score and B-Score
3. Verify Location tier weight increased
4. Verify IRSD and Crime Rate weighted higher
5. Set safety priority to "Low"
6. Verify weights return to normal

**Expected Results:**
- ✅ Safety priority affects Location tier weights
- ✅ IRSD and Crime Rate weighted higher with high priority
- ✅ Weights adjust correctly

---

### 7. Suburb Scout Testing

#### Test 7.1: Suburb Search Functionality
**Browsers:** All  
**Devices:** All

**Test Cases:**
- "Bulleen" (exact match)
- "bulleen" (lowercase)
- "BULLEEN" (uppercase)
- "Bulleen " (trailing space)
- " Bulleen" (leading space)
- "Bul  leen" (extra spaces)
- "InvalidSuburb" (not found)
- "Mel" (partial match - should find Melbourne)

**Test Steps:**
1. Enter each test case in search input
2. Click search button
3. Verify results
4. Check error messages for invalid searches

**Expected Results:**
- ✅ Case-insensitive search works
- ✅ Space trimming works
- ✅ Invalid searches show helpful error
- ✅ Partial matches work (if implemented)

#### Test 7.2: Search Limits (Free Tier)
**Browsers:** All  
**Devices:** All

**Test Steps:**
1. Clear sessionStorage
2. Navigate to `index.html` (free tier)
3. Perform 1st search → Should work
4. Perform 2nd search → Should work
5. Perform 3rd search → Should work
6. Perform 4th search → Should show limit message
7. Verify search button disabled
8. Verify sessionStorage shows searchCount = 3

**Expected Results:**
- ✅ 3 searches allowed per session
- ✅ 4th search blocked with message
- ✅ Search button disabled after limit
- ✅ sessionStorage tracks correctly

#### Test 7.3: Unlimited Searches (Paid Tier)
**Browsers:** All  
**Devices:** All

**Test Steps:**
1. Enter password "Hampz" to enable paid access
2. Navigate to `members.html` (or use paid access on index.html)
3. Perform multiple searches (10+)
4. Verify no search limits
5. Verify all searches work

**Expected Results:**
- ✅ No search limits for paid users
- ✅ Unlimited searches work
- ✅ No error messages about limits

#### Test 7.4: Top 3 Suburbs Display
**Browsers:** All  
**Devices:** All

**Test Steps:**
1. Search for a suburb
2. Verify top 3 suburbs displayed
3. Verify A-Score shown for each
4. Verify 4 tier values shown
5. Verify suburb names and scores correct

**Expected Results:**
- ✅ Top 3 suburbs displayed
- ✅ A-Scores shown correctly
- ✅ Tier values displayed
- ✅ Results sorted by A-Score (highest first)

---

### 8. Property Evaluator Testing

#### Test 8.1: Property Input Form
**Browsers:** All  
**Devices:** All

**Test Steps:**
1. Navigate to Property Evaluator section
2. Enter property address: "8 Robert Street, Bulleen"
3. Enter price: "850000"
4. Select property type: "House"
5. Enter land size: "600"
6. Enter bedrooms: "3"
7. Enter bathrooms: "2"
8. Select street quality: "3"
9. Enter renovation cost: "0" (optional)
10. Enter Hampz Score: "8" (if consensus enabled)
11. Enter Gahee Score: "7" (if consensus enabled)
12. Click "Calculate B-Score"
13. Verify B-Score calculated
14. Verify all 5 tiers displayed

**Expected Results:**
- ✅ All input fields functional
- ✅ B-Score calculated correctly
- ✅ All 5 tiers displayed
- ✅ Property type affects score
- ✅ Consensus scoring works (if enabled)

#### Test 8.2: Property Type Scoring
**Browsers:** All  
**Devices:** Desktop

**Test Steps:**
1. Enter same property with different types:
   - House → Should score 100 points
   - Townhouse → Should score 70 points
   - Unit → Should score 50 points
   - Apartment → Should score 35 points
2. Verify B-Score changes based on type

**Expected Results:**
- ✅ House = 100 points
- ✅ Townhouse = 70 points
- ✅ Unit = 50 points
- ✅ Apartment = 35 points
- ✅ B-Score reflects property type

#### Test 8.3: Street Quality Scoring
**Browsers:** All  
**Devices:** Desktop

**Test Steps:**
1. Enter same property with different street quality:
   - 5 (Quiet residential) → Should score 95/100
   - 4 (Quiet street) → Should score 85/100
   - 3 (Moderate traffic) → Should score 65/100
   - 2 (Busy street) → Should score 40/100
   - 1 (Major road) → Should score 15/100
2. Verify B-Score changes based on street quality

**Expected Results:**
- ✅ Street quality affects Property tier score
- ✅ Scores match expected values
- ✅ B-Score reflects street quality

#### Test 8.4: Property Saving
**Browsers:** All  
**Devices:** All

**Test Steps:**
1. Calculate B-Score for a property
2. Click "Save Property" or similar button
3. Verify permission prompt appears (if first time)
4. Grant permission
5. Verify property saved to localStorage
6. Navigate to "My Properties" section
7. Verify saved property appears
8. Verify property details correct

**Expected Results:**
- ✅ Permission prompt appears
- ✅ Property saved to localStorage
- ✅ Saved property appears in list
- ✅ Property details preserved

---

### 9. Access Control Testing

#### Test 9.1: Password Access (Testing Mode)
**Browsers:** All  
**Devices:** All

**Test Steps:**
1. Navigate to `index.html`
2. Click "Upgrade to Pro" link
3. Verify password modal appears
4. Enter correct password: "Hampz"
5. Verify paid access granted
6. Verify localStorage and sessionStorage updated
7. Verify "Members" link appears
8. Verify search limits removed
9. Verify metrics unblurred
10. Enter incorrect password
11. Verify "contact Jason" message appears

**Expected Results:**
- ✅ Password modal appears
- ✅ Correct password grants access
- ✅ Incorrect password shows message
- ✅ Access stored in localStorage and sessionStorage
- ✅ Paid features enabled

#### Test 9.2: Free Tier Limitations
**Browsers:** All  
**Devices:** All

**Test Steps:**
1. Clear localStorage and sessionStorage
2. Navigate to `index.html` (free tier)
3. Verify search limit (3 searches)
4. Verify metrics blurred
5. Verify limited suburb results (top 3)
6. Verify "Upgrade to Pro" link visible

**Expected Results:**
- ✅ Search limits enforced
- ✅ Metrics blurred
- ✅ Limited results shown
- ✅ Upgrade prompt visible

#### Test 9.3: Paid Tier Features
**Browsers:** All  
**Devices:** All

**Test Steps:**
1. Enable paid access (password or members.html)
2. Verify unlimited searches
3. Verify unblurred metrics
4. Verify full suburb data access
5. Verify all features available

**Expected Results:**
- ✅ No search limits
- ✅ Metrics unblurred
- ✅ Full data access
- ✅ All features available

---

### 10. Geolocation Testing

#### Test 10.1: Browser Geolocation API
**Browsers:** All (with geolocation support)  
**Devices:** Mobile (primary), Desktop (if location enabled)

**Test Steps:**
1. Navigate to Location Scout section
2. Click "Use My Location" or similar button
3. Grant location permission
4. Verify current location detected
5. Verify nearby suburbs displayed
6. Verify distance calculations correct

**Expected Results:**
- ✅ Location permission prompt appears
- ✅ Current location detected
- ✅ Nearby suburbs found
- ✅ Distances calculated correctly

#### Test 10.2: Manual Address Fallback
**Browsers:** All  
**Devices:** All

**Test Steps:**
1. Navigate to Location Scout section
2. Deny location permission (or click "Enter Address Manually")
3. Enter address: "8 Robert Street, Bulleen"
4. Verify address accepted
5. Verify suburb found
6. Verify evaluation displayed

**Expected Results:**
- ✅ Manual address input works
- ✅ Address geocoded correctly
- ✅ Suburb found and evaluated
- ✅ Fallback works when permission denied

---

### 11. Data Loading & Validation Testing

#### Test 11.1: CSV Data Loading
**Browsers:** All  
**Devices:** All

**Test Steps:**
1. Navigate to any page
2. Open browser console
3. Verify data loading logs:
   - "Loaded 397 suburbs from data/suburbs.csv"
   - "Loaded 32 properties from data/properties.csv"
   - "Loaded config from data/config.json"
4. Verify no loading errors
5. Verify data accessible in JavaScript

**Expected Results:**
- ✅ All CSV files load successfully
- ✅ No parsing errors
- ✅ Data accessible in code
- ✅ Correct number of records loaded

#### Test 11.2: Missing Data Handling
**Browsers:** All  
**Devices:** Desktop

**Test Steps:**
1. Test suburbs with missing median prices (53 suburbs)
2. Test suburbs with missing walk scores (22 suburbs)
3. Verify calculations handle missing data gracefully
4. Verify default values used when appropriate
5. Verify no errors thrown

**Expected Results:**
- ✅ Missing data handled gracefully
- ✅ Default values used
- ✅ No JavaScript errors
- ✅ Calculations still work

#### Test 11.3: Data Completeness Validation
**Browsers:** All  
**Devices:** Desktop

**Test Steps:**
1. Verify all required fields present in suburbs.csv
2. Verify all required fields present in properties.csv
3. Check for duplicate IDs
4. Check for invalid values
5. Verify data types correct

**Expected Results:**
- ✅ Required fields present
- ✅ No duplicate IDs (except known issues)
- ✅ Valid data types
- ✅ Data quality acceptable

---

### 12. Responsive Design Testing

#### Test 12.1: Desktop View (1920px+)
**Browsers:** All  
**Devices:** Desktop

**Test Steps:**
1. Set viewport to 1920x1080
2. Test all pages
3. Verify layout correct
4. Verify navigation visible
5. Verify content readable
6. Verify no horizontal scrolling

**Expected Results:**
- ✅ Layout correct
- ✅ Navigation visible
- ✅ Content readable
- ✅ No layout issues

#### Test 12.2: Tablet View (768px-1024px)
**Browsers:** All  
**Devices:** iPad, Android tablet

**Test Steps:**
1. Set viewport to 768x1024 (iPad)
2. Test all pages
3. Verify responsive layout
4. Verify navigation works (hamburger menu if applicable)
5. Verify touch targets adequate
6. Test on actual iPad if available

**Expected Results:**
- ✅ Responsive layout works
- ✅ Navigation functional
- ✅ Touch targets adequate (44x44px minimum)
- ✅ Content readable

#### Test 12.3: Mobile View (320px-767px)
**Browsers:** All  
**Devices:** iPhone, Android phone

**Test Steps:**
1. Set viewport to 375x667 (iPhone)
2. Test all pages
3. Verify mobile layout
4. Verify navigation works
5. Verify forms usable
6. Verify calculations work
7. Test on actual iPhone if available

**Expected Results:**
- ✅ Mobile layout works
- ✅ Navigation functional
- ✅ Forms usable
- ✅ Calculations work
- ✅ No horizontal scrolling

---

### 13. PWA Testing

#### Test 13.1: Manifest.json
**Browsers:** Chrome, Safari  
**Devices:** Desktop, Mobile

**Test Steps:**
1. Verify manifest.json loads
2. Verify app name correct
3. Verify icons specified
4. Verify start URL correct
5. Verify display mode correct

**Expected Results:**
- ✅ Manifest loads
- ✅ All fields correct
- ✅ Icons specified

#### Test 13.2: Service Worker
**Browsers:** Chrome, Safari  
**Devices:** Desktop, Mobile

**Test Steps:**
1. Verify service-worker.js loads
2. Verify service worker registers
3. Test offline functionality
4. Verify caching works

**Expected Results:**
- ✅ Service worker loads
- ✅ Registers successfully
- ✅ Offline functionality works
- ✅ Caching works

#### Test 13.3: Add to Home Screen (iOS)
**Browsers:** Safari  
**Devices:** iPhone, iPad

**Test Steps:**
1. Open website in Safari on iOS
2. Tap Share button
3. Verify "Add to Home Screen" option appears
4. Add to home screen
5. Launch from home screen
6. Verify app launches correctly
7. Verify standalone mode works

**Expected Results:**
- ✅ "Add to Home Screen" option available
- ✅ App adds to home screen
- ✅ Launches in standalone mode
- ✅ No browser UI visible

#### Test 13.4: Add to Dock (macOS)
**Browsers:** Safari  
**Devices:** Mac

**Test Steps:**
1. Open website in Safari on Mac
2. Verify "Add to Dock" option in File menu
3. Add to dock
4. Launch from dock
5. Verify app launches correctly

**Expected Results:**
- ✅ "Add to Dock" option available
- ✅ App adds to dock
- ✅ Launches correctly

---

### 14. Performance Testing

#### Test 14.1: Page Load Performance
**Browsers:** All  
**Devices:** Desktop

**Test Steps:**
1. Measure page load time
2. Measure time to interactive
3. Measure first contentful paint
4. Check network requests
5. Verify no blocking resources

**Expected Results:**
- ✅ Page load < 3 seconds
- ✅ Time to interactive < 5 seconds
- ✅ First contentful paint < 1.5 seconds
- ✅ No unnecessary requests

#### Test 14.2: Calculation Performance
**Browsers:** All  
**Devices:** Desktop

**Test Steps:**
1. Measure A-Score calculation time
2. Measure B-Score calculation time
3. Test with multiple suburbs/properties
4. Verify no performance degradation

**Expected Results:**
- ✅ A-Score calculation < 100ms
- ✅ B-Score calculation < 100ms
- ✅ No performance issues
- ✅ Responsive UI

#### Test 14.3: Data Processing Performance
**Browsers:** All  
**Devices:** Desktop

**Test Steps:**
1. Measure CSV parsing time
2. Measure data filtering time
3. Test with full dataset (397 suburbs)
4. Verify performance acceptable

**Expected Results:**
- ✅ CSV parsing < 500ms
- ✅ Data filtering < 100ms
- ✅ Performance acceptable

---

### 15. Error Handling Testing

#### Test 15.1: Invalid Input Handling
**Browsers:** All  
**Devices:** All

**Test Cases:**
- Invalid suburb name
- Invalid property address
- Invalid price (negative, text, etc.)
- Invalid property type
- Missing required fields

**Test Steps:**
1. Enter invalid inputs
2. Verify error messages appear
3. Verify helpful suggestions provided
4. Verify form doesn't submit with invalid data

**Expected Results:**
- ✅ Error messages clear and helpful
- ✅ Suggestions provided
- ✅ Form validation works
- ✅ No JavaScript errors

#### Test 15.2: Network Error Handling
**Browsers:** All  
**Devices:** All

**Test Steps:**
1. Simulate network failure
2. Verify graceful error handling
3. Verify fallback to cached data (if available)
4. Verify user-friendly error message

**Expected Results:**
- ✅ Graceful error handling
- ✅ User-friendly messages
- ✅ Fallback mechanisms work

#### Test 15.3: Missing Data Handling
**Browsers:** All  
**Devices:** Desktop

**Test Steps:**
1. Test with missing CSV files
2. Test with corrupted data
3. Verify fallback mechanisms
4. Verify error messages

**Expected Results:**
- ✅ Fallback to sample data
- ✅ Error messages clear
- ✅ No crashes

---

### 16. Accessibility Testing

#### Test 16.1: Keyboard Navigation
**Browsers:** All  
**Devices:** Desktop

**Test Steps:**
1. Navigate using only keyboard (Tab, Enter, Arrow keys)
2. Verify all interactive elements accessible
3. Verify focus indicators visible
4. Verify logical tab order

**Expected Results:**
- ✅ All elements keyboard accessible
- ✅ Focus indicators visible
- ✅ Logical tab order
- ✅ No keyboard traps

#### Test 16.2: Screen Reader Compatibility
**Browsers:** Chrome (with screen reader), Safari (VoiceOver)  
**Devices:** Desktop, Mobile

**Test Steps:**
1. Enable screen reader (NVDA, JAWS, VoiceOver)
2. Navigate through pages
3. Verify content readable
4. Verify form labels announced
5. Verify buttons announced

**Expected Results:**
- ✅ Content readable by screen readers
- ✅ Form labels announced
- ✅ Buttons announced correctly
- ✅ Semantic HTML used

#### Test 16.3: Color Contrast
**Browsers:** All  
**Devices:** Desktop

**Test Steps:**
1. Check color contrast ratios
2. Verify text readable
3. Verify WCAG AA compliance (4.5:1 for normal text)

**Expected Results:**
- ✅ Color contrast meets WCAG AA
- ✅ Text readable
- ✅ No contrast issues

---

### 17. Cross-Browser Compatibility Testing

#### Test 17.1: Chrome/Chromium
**Versions:** Latest stable, Previous version  
**Devices:** Desktop, Android

**Test Coverage:**
- All pages load
- All features work
- Calculations accurate
- PWA features work

#### Test 17.2: Safari
**Versions:** Latest macOS, Latest iOS  
**Devices:** Mac, iPhone, iPad

**Test Coverage:**
- All pages load
- All features work
- PWA "Add to Home Screen" works
- iOS-specific features work

#### Test 17.3: Firefox
**Versions:** Latest stable  
**Devices:** Desktop, Android

**Test Coverage:**
- All pages load
- All features work
- Calculations accurate
- Performance acceptable

#### Test 17.4: Edge
**Versions:** Latest stable  
**Devices:** Windows Desktop

**Test Coverage:**
- All pages load
- All features work
- Windows compatibility
- Performance acceptable

---

### 18. Data Validation Testing

#### Test 18.1: A-Score Calculation Validation
**Browsers:** All  
**Devices:** Desktop

**Test Suburbs:**
- Bulleen (known suburb with complete data)
- Hawthorn (high score suburb)
- Frankston (budget suburb)

**Test Steps:**
1. Calculate A-Score for each test suburb
2. Verify tier values sum correctly
3. Verify final score in 0-100 range
4. Verify strategy weights applied correctly
5. Cross-check with manual calculation

**Expected Results:**
- ✅ Tier values sum correctly
- ✅ Final score in valid range
- ✅ Strategy weights applied
- ✅ Matches manual calculation

#### Test 18.2: B-Score Calculation Validation
**Browsers:** All  
**Devices:** Desktop

**Test Properties:**
- 8 Robert Street, Bulleen (baseline)
- Sample properties from properties.csv

**Test Steps:**
1. Calculate B-Score for each test property
2. Verify tier values sum correctly
3. Verify final score in 0-100 range
4. Verify strategy weights applied correctly
5. Verify property type scoring correct
6. Cross-check with manual calculation

**Expected Results:**
- ✅ Tier values sum correctly
- ✅ Final score in valid range
- ✅ Strategy weights applied
- ✅ Property type scoring correct
- ✅ Matches manual calculation

---

### 19. Integration Testing

#### Test 19.1: Preference Integration
**Browsers:** All  
**Devices:** Desktop

**Test Steps:**
1. Set preferences in onboarding
2. Use Suburb Scout
3. Verify preferences applied
4. Use Property Evaluator
5. Verify preferences applied
6. Change preferences
7. Verify changes reflected immediately

**Expected Results:**
- ✅ Preferences applied to A-Score
- ✅ Preferences applied to B-Score
- ✅ Geographic filters work
- ✅ Strategy determination works
- ✅ Changes reflected immediately

#### Test 19.2: Data Persistence
**Browsers:** All  
**Devices:** All

**Test Steps:**
1. Save preferences
2. Save properties
3. Close browser
4. Reopen browser
5. Navigate to website
6. Verify preferences loaded
7. Verify properties loaded

**Expected Results:**
- ✅ Preferences persist
- ✅ Properties persist
- ✅ Data loaded on return
- ✅ No data loss

---

### 20. Edge Cases & Stress Testing

#### Test 20.1: Large Dataset Handling
**Browsers:** All  
**Devices:** Desktop

**Test Steps:**
1. Test with all 397 suburbs
2. Test with all 32 properties
3. Verify performance acceptable
4. Verify no memory issues

**Expected Results:**
- ✅ Handles full dataset
- ✅ Performance acceptable
- ✅ No memory issues

#### Test 20.2: Rapid User Interactions
**Browsers:** All  
**Devices:** Desktop

**Test Steps:**
1. Rapidly click buttons
2. Rapidly enter searches
3. Rapidly switch between sections
4. Verify no errors
5. Verify UI responsive

**Expected Results:**
- ✅ No errors from rapid clicks
- ✅ UI remains responsive
- ✅ No race conditions

#### Test 20.3: Boundary Values
**Browsers:** All  
**Devices:** Desktop

**Test Cases:**
- Minimum budget ($0)
- Maximum budget ($10M+)
- Zero values in calculations
- Negative values (if possible)
- Very large values

**Test Steps:**
1. Test each boundary case
2. Verify handling correct
3. Verify no errors

**Expected Results:**
- ✅ Boundary values handled
- ✅ No errors
- ✅ Graceful handling

---

## Test Execution Checklist

### Pre-Testing Setup
- [ ] Local server running on port 8000
- [ ] All data files present (suburbs.csv, properties.csv, config.json)
- [ ] Browser developer tools ready
- [ ] Test devices available (if possible)
- [ ] Baseline test address ready: "8 Robert Street, Bulleen"

### Daily Testing Routine
- [ ] Test on Chrome (Desktop)
- [ ] Test on Safari (Mac)
- [ ] Test on Safari (iPhone/iPad if available)
- [ ] Test on Firefox (Desktop)
- [ ] Test on Edge (Desktop)
- [ ] Test responsive design (multiple viewports)
- [ ] Test PWA features
- [ ] Verify calculations accurate
- [ ] Check console for errors
- [ ] Verify data loading

### Weekly Testing Routine
- [ ] Full regression test (all features)
- [ ] Cross-browser compatibility check
- [ ] Performance testing
- [ ] Accessibility audit
- [ ] Data validation
- [ ] Error handling review

---

## Test Results Documentation

### Test Report Structure
1. **Executive Summary** - Overall status, key findings
2. **Browser Compatibility** - Results by browser
3. **Device Compatibility** - Results by device
4. **Feature Testing** - Results by feature
5. **Performance Metrics** - Load times, calculation times
6. **Issues Found** - Bugs, errors, problems
7. **Recommendations** - Fixes, improvements

### Test Data to Record
- Browser version
- Device type
- Screen resolution
- Test date/time
- Test results (Pass/Fail)
- Screenshots (if issues found)
- Console errors
- Network requests
- Performance metrics

---

## Critical Test Scenarios (Must Pass)

### Must Pass for Launch
1. ✅ All 7 pages load in all browsers
2. ✅ A-Score calculation accurate (15 metrics, 4 tiers)
3. ✅ B-Score calculation accurate (23 metrics, 5 tiers)
4. ✅ Onboarding system works
5. ✅ Preferences integrated into calculations
6. ✅ Geographic filtering works
7. ✅ Consensus scoring enable/disable works
8. ✅ Search functionality works (case-insensitive, space-tolerant)
9. ✅ Property saving works
10. ✅ Access control works (free/paid tiers)
11. ✅ Data loading works (CSV parsing)
12. ✅ Responsive design works (mobile, tablet, desktop)
13. ✅ PWA "Add to Home Screen" works (iOS)
14. ✅ No critical JavaScript errors
15. ✅ Calculations handle missing data gracefully

---

## Test Automation Opportunities

### Automated Tests (Future)
- Unit tests for calculation functions
- Integration tests for data loading
- E2E tests for user flows
- Performance regression tests
- Visual regression tests

### Manual Tests Required
- Subjective design review
- User experience testing
- Content review
- Legal document review
- Business logic validation

---

## Test Environment Requirements

### Required Tools
- Local web server (Python http.server or similar)
- Multiple browsers installed
- Browser developer tools
- Mobile devices (if available)
- Screen recording tool (for bug reports)

### Test Data
- Baseline address: "8 Robert Street, Bulleen"
- Test suburbs: Bulleen, Hawthorn, Frankston, Melbourne
- Test properties: From properties.csv
- Test preferences: Various combinations

---

## Success Criteria

### All Tests Must Pass
- ✅ All pages load in all browsers
- ✅ All calculations accurate
- ✅ All features functional
- ✅ No critical errors
- ✅ Performance acceptable
- ✅ Responsive design works
- ✅ PWA features work
- ✅ Accessibility acceptable

### Acceptable Issues
- ⚠️ Minor UI inconsistencies (browser-specific)
- ⚠️ Performance variations (acceptable ranges)
- ⚠️ Known data completeness issues (documented)

---

**Test Plan Version:** 1.0  
**Last Updated:** January 13, 2025  
**Status:** Ready for Execution

**Note:** This is a comprehensive test plan. Execute tests systematically, document all results, and update this plan as new features are added or issues are discovered.

