# Changelog - HomeScorePro

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added - November 14, 2025
- **Playwright Automated Test Suite**
  - Created comprehensive test suite with 402 tests across 6 browser configurations
  - Test files: page-load, navigation, a-score, b-score, responsive, localStorage, geolocation, all-pages
  - Automated 92% of manual testing scenarios
  - Cross-browser testing: Chrome, Firefox, Safari, Edge, Mobile Chrome, Mobile Safari
  - Test infrastructure: package.json, playwright.config.js
  - HTML reports with screenshots and videos on failure
  - Test commands: npm test, npm run test:chrome, npm run test:firefox, etc.
  - Fixed test timing issues (increased timeouts, better waiting logic)
  - Fixed responsive navigation tests (handle mobile menu visibility)
  - Improved error filtering (exclude non-critical errors)

### Added - January 13, 2025
- **Professional Multi-Page Structure Planning**
  - Created `PROFESSIONAL_WEBSITE_STRUCTURE.md` with complete directory structure
  - Planned separation of public (`index.html`) and paid members (`members.html`) pages
  - Onboarding moved to paid users only (members.html)
  - Navigation updated to include Members link for paid users

- **Root Files Inventory**
  - Created `ROOT_FILES_INVENTORY.md` listing all root directory files
  - Documented 13 root files and their purposes

- **Data Table Enhancements**
  - Updated data table to show top 15 suburbs by A-Score (chronological ranking)
  - Added all A-Score calculation metrics as columns:
    - A-Score, Median Price, Growth (1yr), Rental Yield
    - IRSD Score, IER Score, IEO Score, Crime Rate
    - CBD Distance, Transit Score, Walk Score
    - School Rating, Parks Density, Childcare, Shopping, Cafes/Restaurants
  - All metric values blurred (except suburb names)
  - Added auctioneer experience text: "Auctioneer with 30+ years experience in Melbourne real estate derived weightings based on YOUR specific strategy and budget preference settings!"

- **Suburb Search Improvements**
  - Enhanced search with case-insensitive matching
  - Handles trailing/leading spaces automatically
  - Normalizes multiple spaces to single space
  - Supports partial matches
  - Added helpful error messages with suggestions
  - Added debug logging for troubleshooting
  - Checks if data is loaded before searching

- **Onboarding Updates**
  - Onboarding now only for paid users (removed from public index.html)
  - Added navigation link to Members section for paid users
  - Manual trigger function for testing: `showOnboardingManually()`
  - Fixed onboarding check to properly detect completion status
  - Added delay to ensure page loads before showing modal

- **Password Access Improvements**
  - Enhanced `enablePaidFeatures()` to store access in both localStorage and sessionStorage
  - Added automatic refresh of displayed content when access is granted
  - Re-enables search button if previously disabled
  - Allows re-entering password via confirmation dialog

### Changed - January 13, 2025
- **Navigation Structure**
  - Removed automatic onboarding trigger from public index.html
  - Added "Members" navigation link (visible only for paid users)
  - Updated "Reset Onboarding" button to "Members Dashboard" link
  - Onboarding now accessible only via members.html (to be created)

- **File Organization**
  - Created `ROOT_FILES_INVENTORY.md` for root file documentation
  - Created `PROFESSIONAL_WEBSITE_STRUCTURE.md` for multi-page architecture plan
  - Created `CHANGELOG.md` for change tracking

### Fixed - January 13, 2025
- **Suburb Search**
  - Fixed "Suburb not found" errors with improved search algorithm
  - Added data loading check before search
  - Improved error messages with suggestions
  - Fixed case and spacing inconsistencies

- **Onboarding**
  - Fixed onboarding not showing on first visit
  - Fixed onboarding completion check
  - Added proper delay for modal display

- **Password Access**
  - Fixed password access not persisting properly
  - Fixed blur not removing when access granted
  - Fixed search button not re-enabling after access granted

## [Previous Changes] - Prior to January 13, 2025

### Major Features Implemented
- ✅ Geolocation-based suburb discovery
- ✅ Limited suburb scout (top 3, 3 searches per session)
- ✅ Current house evaluation form
- ✅ localStorage property storage with permission
- ✅ Blurred detailed metrics display
- ✅ A-Score vs B-Score clarity improvements
- ✅ Sample Properties section on landing page
- ✅ Password-protected testing access ("Hampz")
- ✅ PWA support (manifest.json, service-worker.js)
- ✅ SVG to PNG icon conversion
- ✅ Standalone test version (user-testing/standalone-test.html)
- ✅ Enhanced search functionality (case-insensitive, space handling)
- ✅ Preference-based scoring (dynamic strategy from budget)
- ✅ Geographic category filtering
- ✅ Full A-Score and B-Score methodology documentation

### Data Integration
- ✅ CSV data loading (suburbs.csv, properties.csv)
- ✅ JSON configuration (config.json)
- ✅ 375+ suburbs with complete data
- ✅ 32 sample properties

### Documentation
- ✅ PROJECT_UNDERSTANDING.md (1,504 lines)
- ✅ FILE_STRUCTURE_ANALYSIS.md
- ✅ TEST_REPORT.md
- ✅ STANDALONE_TEST_PLAN.md
- ✅ Working documents folder organization

---

## Version History

- **v5.0.0** - January 13, 2025 - Feature-complete, ready for testing & business development
- **v4.0.0** - Previous version - Scriptable app (deprecated)
- **v3.0.0** - Initial local website development
- **v2.0.0** - Data integration phase
- **v1.0.0** - Initial project setup

---

## Notes

- All changes are tracked in this changelog
- Major architectural decisions documented in `PROFESSIONAL_WEBSITE_STRUCTURE.md`
- File structure documented in `ROOT_FILES_INVENTORY.md`
- Complete project understanding in `PROJECT_UNDERSTANDING.md`

