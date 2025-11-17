# Functionality Comparison: calculator.html (Free) vs members.html (Paid)

**Created:** 2025-11-15  
**Last Updated:** 2025-11-17  
**Purpose:** Detailed breakdown of differences between free and paid versions  
**Status:** Complete

> **⚠️ IMPORTANT:** All tasks and checklists have been moved to `master-planning.md`.  
> **For active task management, see:** `working-documents/planning/master-planning.md`

This document now serves as a reference guide only. All actionable tasks are tracked in the master planning file.

---

## Executive Summary

This document provides a comprehensive comparison of functionality between the free calculator page (`calculator.html`) and the paid members dashboard (`members.html`). This comparison helps understand the value proposition of the paid tier and guides feature development priorities.

---

## Overview

| Aspect | calculator.html (Free) | members.html (Paid) |
|--------|------------------------|---------------------|
| **Access Level** | Public, no authentication | Password-protected, paid access required |
| **Target Users** | Casual browsers, first-time visitors | Committed users, property investors |
| **Purpose** | Demonstration and lead generation | Full-featured property analysis tool |
| **Data Access** | Limited subset (10 suburbs) | Full dataset (397 suburbs) |
| **Search Limits** | 3 free searches | Unlimited searches |
| **Property Management** | None | Save, edit, export, import, compare |
| **Personalization** | None | User preferences, custom weightings |
| **Onboarding** | None | Guided onboarding flow |
| **B-Score Detail** | Simplified (preset profiles) | Full 23-point breakdown |

---

## Detailed Feature Comparison

### 1. Suburb Analysis (A-Score)

#### calculator.html (Free)
- **Suburb Selection:**
  - Dropdown with 10 pre-selected suburbs
  - Grouped by A-Score range:
    - High A-Score (88-95): Hawthorn, Brighton, Balwyn
    - Medium A-Score (75-85): Box Hill, Blackburn, Bentleigh, Ascot Vale
    - Low A-Score (60-70): Albanvale, Ardeer, Bellfield
  - Static data embedded in JavaScript
  - No search functionality
  - No geolocation

- **A-Score Calculation:**
  - Simplified calculation with 7 metrics
  - Fixed weights (not customizable)
  - Basic breakdown display
  - Limited insights (3-4 generic insights)

- **Data Display:**
  - Basic score display
  - Simple breakdown bars
  - Generic insights
  - No detailed metrics table
  - No comparison tools

#### members.html (Paid)
- **Suburb Selection:**
  - Full dropdown with all 397 Melbourne suburbs
  - Loaded from `data/suburbs.csv`
  - Search functionality (suburb name, postcode)
  - Geolocation support (get user's location)
  - Auto-fill suburb/postcode
  - Recent searches history

- **A-Score Calculation:**
  - Full 15-metric calculation
  - Strategy-based weights (Investment, Balanced, Lifestyle)
  - User preference-based customization
  - Comprehensive breakdown with all tiers
  - Detailed insights based on user preferences

- **Data Display:**
  - Full metrics table (unblurred)
  - Detailed breakdown with all 5 tiers
  - Personalized insights
  - Comparison tools (compare multiple suburbs)
  - Export functionality
  - Save to portfolio

---

### 2. Property Analysis (B-Score)

#### calculator.html (Free)
- **Property Input:**
  - Preset property profiles (4 options):
    - Starter Home ($650K, 2 bed, 1 bath, 400sqm, Unit)
    - Family Home ($1.2M, 4 bed, 2 bath, 600sqm, House)
    - Investment Property ($850K, 3 bed, 2 bath, 500sqm, Townhouse)
    - Luxury Home ($2.5M, 5 bed, 3 bath, 800sqm, House)
  - Hidden input fields (not user-editable)
  - No custom property entry
  - Limited to 4 preset profiles

- **B-Score Calculation:**
  - Simplified calculation
  - Basic factors only (price, CBD distance, train distance, safety, lifestyle)
  - No full 23-point breakdown
  - Generic scoring algorithm

- **Results Display:**
  - Basic score display
  - Simple breakdown
  - Limited insights
  - No detailed metrics
  - Disclaimer about limited version

#### members.html (Paid)
- **Property Input:**
  - Full property form with all fields:
    - Property price
    - Suburb selection (all 397 suburbs)
    - Property type (House, Unit, Townhouse, Apartment)
    - Bedrooms, bathrooms
    - Land size, building size
    - CBD distance
    - Train station distance
    - Walk Score, Transit Score, Bike Score
    - Safety rating
    - Lifestyle preferences
    - Investment strategy
  - Custom property entry
  - Save property to portfolio
  - Import properties (CSV/JSON)
  - Edit saved properties

- **B-Score Calculation:**
  - Full 23-point B-Score calculation
  - 5 tiers with detailed metrics:
    - Tier 1: Investment (growth, yield, affordability)
    - Tier 2: Location (SEIFA scores, crime)
    - Tier 3: Accessibility (CBD, transit, walkability)
    - Tier 4: Property Features (size, type, condition)
    - Tier 5: Lifestyle (amenities, schools, parks)
  - Strategy-based weights
  - User preference customization
  - Comprehensive normalization

- **Results Display:**
  - Full 23-point breakdown
  - Detailed metrics table (unblurred)
  - Personalized insights
  - Comparison tools (compare multiple properties)
  - Export functionality (CSV, JSON, PDF)
  - Save to portfolio
  - Share results

---

### 3. Property Management

#### calculator.html (Free)
- **Property Saving:** ❌ Not available
- **Property Editing:** ❌ Not available
- **Property Comparison:** ❌ Not available
- **Property Export:** ❌ Not available
- **Property Import:** ❌ Not available
- **Portfolio View:** ❌ Not available

#### members.html (Paid)
- **Property Saving:** ✅ Save unlimited properties to portfolio
- **Property Editing:** ✅ Edit saved properties
- **Property Comparison:** ✅ Compare up to 5 properties side-by-side
- **Property Export:** ✅ Export individual or all properties (CSV, JSON, PDF)
- **Property Import:** ✅ Bulk import properties from CSV/JSON
- **Portfolio View:** ✅ View all saved properties in organized dashboard
- **Property Deletion:** ✅ Delete properties from portfolio
- **Property Notes:** ✅ Add custom notes to properties

---

### 4. User Preferences & Personalization

#### calculator.html (Free)
- **User Preferences:** ❌ Not available
- **Custom Weightings:** ❌ Not available
- **Strategy Selection:** ❌ Not available
- **Onboarding:** ❌ Not available
- **Saved Preferences:** ❌ Not available

#### members.html (Paid)
- **User Preferences:** ✅ Comprehensive preference system
  - Primary goal (Investment, Lifestyle, Balanced)
  - Budget range (min/max)
  - Family status
  - Safety priority
  - Geographic categories
  - Lifestyle preferences
- **Custom Weightings:** ✅ Adjust tier weights for A-Score and B-Score
- **Strategy Selection:** ✅ Choose from Investment, Balanced, or Lifestyle strategies
- **Onboarding:** ✅ Guided 6-step onboarding flow for first-time users
- **Saved Preferences:** ✅ Preferences saved to localStorage and applied to all calculations

---

### 5. Data Access & Limits

#### calculator.html (Free)
- **Suburb Access:** 10 suburbs (limited subset)
- **Search Limits:** 3 free searches (hard limit)
- **Data Blurring:** N/A (limited data only)
- **Full Metrics:** ❌ Not available
- **Data Export:** ❌ Not available
- **API Access:** ❌ Not available

#### members.html (Paid)
- **Suburb Access:** 397 suburbs (full dataset)
- **Search Limits:** Unlimited searches
- **Data Blurring:** ✅ All metrics unblurred
- **Full Metrics:** ✅ Complete data tables with all metrics
- **Data Export:** ✅ Export suburb data, property data, reports
- **API Access:** ✅ (Future: API access for developers)

---

### 6. User Interface & Experience

#### calculator.html (Free)
- **Layout:** Single-page, simple layout
- **Navigation:** Basic navigation bar
- **Sections:**
  - Hero section
  - Smart search (limited)
  - Stats section
  - Suburb Scout (A-Score)
  - Property Analysis (B-Score) - separate section
  - Sample properties
- **Mobile Responsive:** ✅ Yes
- **Accessibility:** Basic
- **Loading States:** Basic
- **Error Handling:** Basic

#### members.html (Paid)
- **Layout:** Dashboard-style, multi-section layout
- **Navigation:** Advanced navigation with sections:
  - Dashboard overview
  - Suburb Scout
  - Property Portfolio
  - Preferences
  - Reports & Export
  - Account Settings
- **Sections:**
  - Dashboard header with welcome message
  - Stats grid (searches, properties, comparisons)
  - Saved Properties section
  - Recent Searches section
  - Quick actions
- **Mobile Responsive:** ✅ Yes (optimized)
- **Accessibility:** ✅ Enhanced (ARIA labels, keyboard navigation)
- **Loading States:** ✅ Advanced (skeleton loaders, progress indicators)
- **Error Handling:** ✅ Comprehensive (user-friendly error messages)

---

### 7. Access Control & Security

#### calculator.html (Free)
- **Authentication:** ❌ None (public access)
- **Password Protection:** ❌ None
- **Access Control:** ❌ None
- **Session Management:** ❌ None
- **Data Privacy:** Basic (localStorage only)

#### members.html (Paid)
- **Authentication:** ✅ Password-protected access
- **Password Protection:** ✅ Testing password ("Hampz") for development
- **Access Control:** ✅ Checks for paid access before enabling features
- **Session Management:** ✅ localStorage + sessionStorage
- **Data Privacy:** ✅ Enhanced (encrypted preferences, secure storage)

---

### 8. Technical Features

#### calculator.html (Free)
- **Data Loading:** Static data in JavaScript
- **File Structure:** Single HTML file with external CSS/JS
- **Dependencies:** Minimal (no external libraries)
- **Performance:** Fast (small dataset)
- **Caching:** Basic browser caching
- **Offline Support:** ❌ None

#### members.html (Paid)
- **Data Loading:** Dynamic loading from CSV files (`suburbs.csv`, `properties.csv`)
- **File Structure:** Single HTML file with embedded CSS/JS
- **Dependencies:** Minimal (no external libraries)
- **Performance:** Optimized (lazy loading, efficient data structures)
- **Caching:** Advanced (localStorage caching, data prefetching)
- **Offline Support:** ✅ Partial (cached data available offline)

---

## Feature Matrix

| Feature | calculator.html (Free) | members.html (Paid) |
|---------|------------------------|---------------------|
| **Suburb Selection** | 10 suburbs (dropdown) | 397 suburbs (searchable) |
| **A-Score Calculation** | ✅ Simplified (7 metrics) | ✅ Full (15 metrics) |
| **B-Score Calculation** | ✅ Simplified (preset profiles) | ✅ Full (23 metrics) |
| **Property Saving** | ❌ | ✅ |
| **Property Comparison** | ❌ | ✅ |
| **Property Export** | ❌ | ✅ |
| **Property Import** | ❌ | ✅ |
| **User Preferences** | ❌ | ✅ |
| **Custom Weightings** | ❌ | ✅ |
| **Onboarding** | ❌ | ✅ |
| **Search Limits** | 3 searches | Unlimited |
| **Data Blurring** | N/A | Unblurred |
| **Full Metrics Table** | ❌ | ✅ |
| **Geolocation** | ❌ | ✅ |
| **Recent Searches** | ❌ | ✅ |
| **Reports & Export** | ❌ | ✅ |
| **Access Control** | ❌ | ✅ |
| **Mobile Optimized** | ✅ | ✅ |

---

## User Journey Comparison

### Free User Journey (calculator.html)
1. Land on calculator page
2. See hero section with value proposition
3. Select suburb from dropdown (10 options)
4. Calculate A-Score (see basic results)
5. Select property profile (4 presets)
6. Calculate B-Score (see basic results)
7. See disclaimer about limited version
8. Click "Upgrade to Members" CTA
9. Redirect to pricing or members page

### Paid User Journey (members.html)
1. Enter password to access members page
2. Complete onboarding (if first time)
3. Set preferences (goal, budget, family status, etc.)
4. Access full dashboard
5. Use Suburb Scout:
   - Search all 397 suburbs
   - Use geolocation
   - See full metrics table
   - Save searches
6. Use Property Portfolio:
   - Enter custom property details
   - Calculate full B-Score
   - Save to portfolio
   - Compare properties
   - Export data
7. Adjust preferences and weightings
8. Generate reports
9. Export data for external analysis

---

## Value Proposition Summary

### Free Version (calculator.html)
**Purpose:** Lead generation and demonstration

**Value:**
- Demonstrates core functionality
- Shows A-Score and B-Score concepts
- Provides limited but functional experience
- Creates desire for full features
- Low barrier to entry

**Limitations:**
- Limited data access (10 suburbs)
- Search limits (3 searches)
- No property management
- No personalization
- Simplified calculations

### Paid Version (members.html)
**Purpose:** Full-featured property analysis tool

**Value:**
- Complete data access (397 suburbs)
- Unlimited searches
- Full property management
- Personalized scoring
- Advanced features (comparison, export, import)
- Professional-grade tool

**Benefits:**
- Save time with unlimited searches
- Make informed decisions with full data
- Track properties in portfolio
- Compare multiple properties
- Export data for analysis
- Customize scoring to preferences

---

## Recommendations

### For Free Version (calculator.html)
1. ✅ **Completed:** Simplified suburb selection (dropdown with 10 suburbs)
2. ✅ **Completed:** Simplified B-Score (preset property profiles)
3. ✅ **Completed:** Clear disclaimers about limitations
4. ✅ **Completed:** Strong CTAs to upgrade
5. **Future:** Add more preset property profiles
6. **Future:** Add social sharing for results
7. **Future:** Add email capture for results

### For Paid Version (members.html)
1. ✅ **Completed:** Full suburb access (397 suburbs)
2. ✅ **Completed:** Unlimited searches
3. ✅ **Completed:** Property management (save, edit, compare, export)
4. ✅ **Completed:** User preferences and onboarding
5. **Future:** Add property alerts/notifications
6. **Future:** Add market trend analysis
7. **Future:** Add neighborhood insights
8. **Future:** Add integration with real estate APIs

---

## Conclusion

The free version (`calculator.html`) serves as an effective lead generation tool, demonstrating core functionality while creating desire for the full-featured paid version. The paid version (`members.html`) provides comprehensive property analysis capabilities with unlimited access, personalization, and advanced features.

The clear differentiation between free and paid versions helps users understand the value proposition and encourages upgrades while providing a functional free experience.

---

**Last Updated:** 2025-11-15  
**Next Review:** After Phase 3 completion

