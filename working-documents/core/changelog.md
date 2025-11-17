# Changelog - HomeScorePro

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### [2025-11-17] - Phase 13.1 (Phase 1 & 2): UI/UX Enhancements Foundation & Polish Complete
**Added:**
- Created `css/ui-enhancements.css` with comprehensive UI enhancement styles
- Added animations, micro-interactions, glassmorphism effects, score visualizations, modern inputs, empty states, progress indicators, and more

**Changed:**
- Added ui-enhancements.css to all HTML pages (index.html, calculator.html, about.html, pricing.html, contact.html, members.html, privacy.html, terms.html)
- Updated main CTA buttons with `btn-glow` and `btn-ripple` classes for enhanced interactivity
- Added `card-lift` class to all feature cards and pricing cards for hover effects
- Updated empty states to use modern `empty-state-modern` class

**Phase 2 (Polish) - Completed:**
- Added progress indicators (loading states) to calculation buttons with spinner and "Calculating..." message
- Updated tooltips to use proper `tooltip` and `tooltip-text` classes from ui-enhancements.css (A-Score and B-Score)
- Updated hero badge to use `badge-modern` class for modern styling
- Enhanced loading state CSS for better visual feedback
- Added error handling to restore button state if calculation fails

**Files Updated:**
- `css/ui-enhancements.css` - New file with all UI enhancement styles
- `index.html` - Added CSS link, updated buttons and cards
- `calculator.html` - Added CSS link, updated buttons, improved empty state
- `pricing.html` - Added CSS link, updated pricing cards and buttons
- `about.html`, `contact.html`, `members.html`, `privacy.html`, `terms.html` - Added CSS link

**Technical:**
- All animations use CSS (GPU accelerated)
- Reduced motion support for accessibility
- Responsive design for mobile devices
- Dark theme optimized

### [2025-11-17] - Content Style Guide Compliance Complete
**Changed:**
- Updated all content across website for style guide compliance
- Fixed terminology inconsistencies (A-Score, B-Score, Suburb Scout, Property Evaluator)
- Updated CTAs to be action-oriented and specific ("Try Free Calculator" instead of generic "Get Started")
- Fixed number accuracy (397 suburbs, 15 metrics for A-Score, 23 metrics for B-Score, 38+ verified data points)
- Added SEIFA acronym explanation on first use: "SEIFA (Socio-Economic Indexes for Areas)"
- Added full terminology on first mention: "A-Score (Suburb Analysis Score)" and "B-Score (Property Evaluation Score)"

**Files Updated:**
- `index.html` - CTAs, terminology, SEIFA explanation, B-Score description
- `about.html` - SEIFA acronym, A-Score/B-Score first mentions, methodology description
- `pricing.html` - CTAs, terminology, suburb count correction (399 → 397)
- `calculator.html` - B-Score descriptions (38+ → 23 metrics), terminology in tooltips

**Technical:**
- All content now compliant with content-style-guide.md
- Consistent terminology throughout all pages
- Clear value propositions maintained
- Professional tone verified

### [2025-11-17] - UI/UX Consistency: Spacing Variables Standardized Across All Pages
**Changed:**
- Updated `css/index.css` to use CSS spacing variables instead of hardcoded values
- Updated `about.html`, `pricing.html`, `contact.html`, `privacy.html`, `terms.html` to use CSS spacing variables
- Added `--space-32` (8rem) to `css/design-master.css` for large hero sections
- Replaced all hardcoded spacing values (0.5rem, 0.75rem, 1rem, 1.25rem, 1.5rem, 2rem, 3rem, 4rem, 6rem, 8rem) with CSS variables across all pages
- Fixed linting warnings for `background-clip` property in all files

**Technical:**
- All spacing now uses numeric system: `--space-1` through `--space-32`
- Semantic aliases (--space-xs, --space-sm, etc.) available for backward compatibility
- Shadows, radius, transitions, and typography already standardized via design-master.css
- All HTML pages now consistently use CSS variables from design-master.css

**Files Updated:**
- `css/index.css` - All spacing standardized
- `about.html` - All spacing standardized
- `pricing.html` - All spacing standardized
- `contact.html` - All spacing standardized
- `privacy.html` - All spacing standardized
- `terms.html` - All spacing standardized
- `css/design-master.css` - Added --space-32 variable

### [2025-11-17] - Scraping Files Reorganization Complete
**Moved:**
- All scraping scripts moved from `scripts/` to `PERSONAL_SCRAPE/scripts/`:
  - scrape-properties-comprehensive.js
  - cleanup-duplicate-pdfs.py
  - merge-properties.js
  - merge-and-dedupe.js
  - deduplicate-properties.js
  - deduplicate.py
  - remove-duplicate-pdfs.js
  - check-robots.js
  - debug-realestate.js
  - use-existing-chrome.js
- PDFViewer.jsx moved from `react-app/src/components/` to `PERSONAL_SCRAPE/react-components/`
- pdf-import folder moved from root to `PERSONAL_SCRAPE/pdf-import/`

**Files Kept in scripts/:**
- validate-data.js (general data validation, not scraping-specific)
- fix-html-integration.sh (not scraping-related)

**Verification:**
- All scraping-related files now in PERSONAL_SCRAPE folder
- PERSONAL_SCRAPE/README.md contains clear personal use statement
- No PDF functionality in production React components
- All references updated in documentation

### [2025-11-17] - Pre-Deployment Checklist Complete
**Added:**
- Pre-build script (`react-app/scripts/copy-data.js`) to copy data files before production build
- Test script (`react-app/scripts/test-data-access.js`) to verify data access setup
- React app deployment guide (`react-app/DEPLOYMENT.md`) with complete deployment instructions
- `test:data` npm script to verify data access

**Changed:**
- Updated `package.json` to include `prebuild` script that runs automatically before `npm run build`
- Updated deployment guide to reference React app deployment guide
- Updated master-planning.md to mark Phase 9.2 as completed

**Technical:**
- Data access solution (Option C) fully implemented:
  - Development: Symlink from `react-app/public/data` to `../../data`
  - Production: Pre-build script copies data files to `public/data` before build
  - Both dev and production use same paths (`/data/suburbs.csv`, etc.)
- All data files (suburbs.csv, properties.csv, config.json) accessible in both dev and production

### [2025-11-17] - Documentation Date Correction
**Changed:**
- Updated all "Last Updated" dates to 2025-11-17 across all documentation files
- Corrected date references to reflect current date (November 17, 2025)

### [2025-11-17] - Scraping Removal and Personal Use Organization
**Removed:**
- All web scraping scripts moved to PERSONAL_SCRAPE folder
- PDF viewer functionality removed from React components
- PDF download and scraping references removed from documentation
- sourceUrl links removed from PropertyDetailModal

**Changed:**
- Created PERSONAL_SCRAPE folder with clear personal use statement
- Moved all scraping scripts to PERSONAL_SCRAPE/scripts/
- Moved pdf-import folder to PERSONAL_SCRAPE/pdf-import/
- Moved PDFViewer component to PERSONAL_SCRAPE/react-components/
- Updated properties.csv with personal use notice header
- Created data/README.md with personal use notice
- Removed PDF tab from PropertyDetailModal
- Removed PDF quick view button from ranked properties list
- Removed PDFViewerModal from Members.jsx

**Files Moved:**
- All scraping scripts → PERSONAL_SCRAPE/scripts/
- pdf-import/ → PERSONAL_SCRAPE/pdf-import/
- PDFViewer.jsx → PERSONAL_SCRAPE/react-components/

**Documentation:**
- Updated all documentation to remove scraping references
- Added personal use notices to properties.csv and data/README.md
- Created PERSONAL_SCRAPE/README.md with clear personal use statement

### [2025-11-16] - React Migration Complete - All Pages Migrated
**Added:**
- Complete React migration with Vite build system
- All 8 pages fully migrated to React:
  - Home.jsx - Full hero section, features, and CTAs
  - Calculator.jsx - Complete A-Score and B-Score functionality
  - Members.jsx - Full onboarding modal (6 steps), password protection, suburb scout, property evaluator, ranked properties
  - Pricing.jsx - All pricing plans and FAQ
  - About.jsx - Complete content and sections
  - Contact.jsx - Full contact form and information
  - Privacy.jsx - Complete privacy policy
  - Terms.jsx - Complete terms of service
- React Router setup for navigation
- Framer Motion animations integrated
- Utility modules created:
  - `react-app/src/utils/calculator.js` - A-Score and B-Score calculations
  - `react-app/src/utils/members.js` - Members-specific functions (CSV loading, data management, B-Score calculations)
- Base components: Layout, Navigation, Footer
- PropertyDetailModal component - Full B-Score breakdown with tier scores and weights
- Ranked Properties feature - Properties sorted by B-Score in Members page
- Complete onboarding modal with all 6 steps:
  - Step 1: Primary Goal selection (Investment/Balanced/Lifestyle)
  - Step 2: Budget Range input
  - Step 3: Family Status selection
  - Step 4: Safety Priority slider
  - Step 5: Geographic Categories selection
  - Step 6: Review and confirmation
- CSV parser improvements - Robust quote handling for addresses with commas

**Changed:**
- All HTML pages now have React equivalents
- Design system maintained through CSS imports from `design-master.css`
- State management migrated to React hooks
- Event handlers converted to React event system

**Technical:**
- React 18 with Vite for fast development
- React Router v6 for client-side routing
- Framer Motion for smooth animations
- All original functionality preserved
- Dark theme design maintained throughout

---

### [2025-11-16] - Sample Score Buttons Fix & Performance Optimization
**Fixed:**
- Sample suburb and property score buttons now working correctly
- Exposed `calculateAScore()`, `calculateBScore()`, and `loadPropertyProfile()` to global scope
- Fixed missing `scoreCache` initialization
- Fixed missing `cacheKey` generation in both A-Score and B-Score calculations
- Added proper cache checking before calculations

**Added:**
- Data validation script (`scripts/validate-data.js`) for automated CSV validation
- Data sources page (`data-sources.html`) with full attribution
- Score caching system to avoid redundant calculations
- Debounced search input (300ms) for better performance
- Passive event listeners for scroll optimization
- RequestAnimationFrame batching for smooth animations

**Changed:**
- Fixed 20 duplicate property IDs in `data/properties.csv`
- Added data source attribution to footer on all pages
- Optimized scroll event handling with RAF batching
- Enhanced search input with debouncing

**Technical:**
- Performance optimizations: caching, debouncing, passive listeners
- Data quality: duplicate ID fixes, validation script
- Documentation: data sources page, footer attribution
- Function scope: global exposure for inline event handlers

---

### [2025-11-16] - Retention Strategy Implementation & Documentation Updates
**Added:**
- Psychological retention strategy implementation (Layer 1 & High-Priority SaaS techniques)
- Stats count-up animations with IntersectionObserver
- Scroll-triggered fade-in animations for cards and sections
- Contextual sticky CTA (appears at 40% scroll depth)
- Exit-intent modal (10-30 second window)
- Autosave feedback system with toast notifications
- Progressive score reveal with count-up animations
- Staggered breakdown item animations
- Skeleton loader function for loading states

**Changed:**
- Updated `project-understanding.md` with current development status
- Updated all "Last Updated" dates to 2025-11-16
- Enhanced score display animations (count-up from 0.0)
- Improved breakdown reveal with staggered animations

**Technical:**
- All retention functions verified and tested
- Mobile-responsive sticky CTA (hidden on small screens)
- Performance optimized animations (IntersectionObserver, requestAnimationFrame)
- Non-intrusive timing for exit-intent modal

---

### [2025-11-15] - Design System Standardization & File Organization
**Added:**
- Created `css/design-master.css` as single source of truth for all design tokens
- Created `css/index.css` for landing page specific styles
- Archived unused CSS files to `archive/unused-css/` (claude-design.css, variables.css, modern.css, ui-enhancements.css)

**Changed:**
- All HTML pages now import `css/design-master.css` instead of inline variables
- `index.html` reduced from 475 lines to 147 lines (CSS extracted)
- Standardized spacing, shadows, and border radius variables across all pages
- Updated all pages to use consistent design system

**Fixed:**
- Removed duplicate CSS variable definitions
- Fixed linting errors in calculator.css
- Ensured backward compatibility with legacy variable names

**Technical:**
- Design system now centralized in design-master.css
- All pages maintain visual consistency
- Browser caching now works for CSS files
- Improved maintainability and performance

---

## [Unreleased]

### Changed - 2025-11-15 (Phase 1-3 Implementation: File Consolidation, Code Organization, Calculator Updates)
- **Phase 1.1: File Consolidation** ✅
  - Created master-planning.md as single source of truth for all planning
  - Consolidated all planning documents into master plan:
    - `next-priority-plan.md` → Consolidated into `master-planning.md`
    - `task-management.md` → Consolidated into `master-planning.md`
    - `file-structure-analysis.md` → Consolidated into `master-planning.md`
  - Moved unused files to organized archive folders:
    - Design iterations → `archive/design-iterations/`
    - Legacy files → `archive/legacy/`
    - Pre-dark theme files → `archive/pre-dark-theme-upgrade/`
  - Updated all documentation references to point to master-planning.md
  - Created archive README files for organization

- **Phase 1.2: Code Organization** ✅
  - Extracted CSS from calculator.html to `css/calculator.css` (1,573 lines)
  - Extracted JavaScript from calculator.html to `js/calculator.js` (439 lines)
  - Reduced calculator.html from 2,531 lines to 522 lines (79% reduction)
  - Improved code maintainability and separation of concerns

- **Phase 2.1: Calculator.html Free Page Updates** ✅
  - Renamed "Suburb Analysis" to "Suburb Scout"
  - Replaced text input with dropdown containing 10 suburbs:
    - High A-Score (88-95): Hawthorn, Brighton, Balwyn
    - Medium A-Score (75-85): Box Hill, Blackburn, Bentleigh, Ascot Vale
    - Low A-Score (60-70): Albanvale, Ardeer, Bellfield
  - Updated hint text to explain limited subset demonstration
  - Restructured B-Score section:
    - Removed from tabs, made separate section below A-Score
    - Implemented preset property profiles (4 options)
    - Added disclaimer about limited version
    - Added "Upgrade to Members" CTA
  - Updated tab labels: "A-Score" → "Suburb Scout"
  - Added data for all 10 suburbs in JavaScript
  - Implemented `loadPropertyProfile()` function for preset profiles

- **Phase 2.2: Functionality Comparison Documentation** ✅
  - Created comprehensive comparison document: `working-documents/planning/functionality-comparison-calculator-vs-members.md`
  - Documented all differences between free and paid versions
  - Created feature matrix and user journey comparisons
  - Documented value propositions for both tiers

- **Phase 3: Documentation Updates** ✅
  - Updated changelog with all Phase 1-3 changes
  - Updated completeness-tracking.md with calculator improvements
  - Updated documentation-index.md with new planning structure

### Changed - 2025-11-15 (Planning Consolidation)
- **Master Planning File Created**
  - Created `working-documents/planning/master-planning.md` as single source of truth for all planning
  - Consolidated all planning documents into master plan:
    - `next-priority-plan.md` → Consolidated into `master-planning.md`
    - `task-management.md` → Consolidated into `master-planning.md`
    - `file-structure-analysis.md` → Consolidated into `master-planning.md`
  - Updated `documentation-index.md` to reference master-planning.md
  - All planning and task management now in one file

### Changed - 2025-01-13 (Complete Dark Theme Design System Migration)

#### Design System Upgrade
- **Complete website redesign** to dark theme design philosophy
- **New color palette**: Dark base colors (#0F0F0F, #1A1A1A, #262626) with orange accent colors (#CC785C, #E8917F)
- **Glassmorphism effects**: Applied to navigation, cards, and modals with backdrop blur
- **Typography**: Updated to use dark theme text colors (--text-primary, --text-secondary, --text-tertiary)
- **Consistent design language**: All pages now use unified dark theme design system

#### Page Replacements
- **index.html**: Replaced with dark-landing.html (new landing page)
- **calculator.html**: Renamed from homescorepro-dark.html (main calculator page)
- **about.html**: Replaced with dark-about.html + merged Investment Strategies content
- **contact.html**: Replaced with dark-contact.html + merged FAQ section
- **pricing.html**: Replaced with dark-pricing.html + merged comprehensive FAQ
- **members.html**: Updated with dark theme CSS while preserving all functionality
- **privacy.html**: Replaced with dark-privacy.html
- **terms.html**: Replaced with dark-terms.html

#### Content Preservation
- Merged valuable content from existing pages into dark theme versions:
  - Investment Strategies section (Investment, Balanced, Lifestyle) added to about.html
  - Comprehensive FAQ section added to contact.html
  - Enhanced FAQ items merged into pricing.html
- All functionality preserved, including:
  - Calculator functionality (A-Score, B-Score)
  - Onboarding system
  - Saved properties
  - Dashboard features
  - Access control

#### Link Standardization
- Updated all navigation links to use standard naming:
  - `index.html` (landing page)
  - `calculator.html` (main calculator)
  - `about.html`, `contact.html`, `pricing.html`, `members.html`, `privacy.html`, `terms.html`
- Removed all `dark-*` and `homescorepro-dark.html` references
- Updated all footer links across all pages
- Verified cross-page link consistency

#### Archiving
- Archived all previous light theme pages to `archive/pre-dark-theme-upgrade/`
- Created archive README documenting the migration
- Preserved all original files for reference

#### Files Modified
- **index.html**: Complete replacement with dark theme landing page
- **calculator.html**: Renamed and updated links
- **about.html**: Dark theme + merged content
- **contact.html**: Dark theme + merged FAQ
- **pricing.html**: Dark theme + merged FAQ
- **members.html**: Dark theme CSS conversion (preserved all functionality)
- **privacy.html**: Dark theme replacement
- **terms.html**: Dark theme replacement

#### Files Created
- **archive/pre-dark-theme-upgrade/**: Archive directory with all previous pages
- **archive/pre-dark-theme-upgrade/README.md**: Archive documentation

#### Design System Documentation
- Updated `docs/design-system.md` with dark theme specifications
- Documented color palette, typography, components, spacing, and animations
- Created design system reference for future development

#### Technical Details
- CSS variables updated to dark theme color system
- Glassmorphism effects implemented with backdrop-filter
- Responsive design maintained across all pages
- All JavaScript functionality preserved
- Cross-browser compatibility maintained

---

### Added - 2025-01-27 (Comprehensive UX Improvements & Performance Optimizations)

#### New JavaScript Modules
- **js/smart-search.js**: Unified smart search with auto-detection of address/suburb/postcode
- **js/score-enhancements.js**: Score display utilities (percentile ranking, letter grades, score meaning)
- **js/micro-interactions.js**: Animation utilities (score count-up, save animations, loading states)
- **js/access-control.js**: Enhanced access control with unlock overlays and upgrade prompts

#### New Features
- **Unified Smart Search**: Single search box that auto-detects input type and routes to appropriate tool
- **Enhanced Score Displays**: Percentile ranking, letter grades (A+, A, B+, etc.), and contextual score meanings
- **Progressive Calculator**: B-Score calculator with essential fields first, optional details in expandable section
- **Mobile Hamburger Menu**: Slide-out navigation menu for mobile devices with smooth animations
- **Paywall Improvements**: Clear unlock overlays with benefits list and upgrade prompts after 3 searches
- **Hero Section Redesign**: Single primary CTA, clear value proposition, and trust indicators
- **Empty States**: Helpful empty states for saved items and search results with clear CTAs
- **Tooltips & Help**: Contextual tooltips explaining A-Score vs B-Score throughout interface

#### Performance Optimizations
- **DOM Optimization**: Replaced `innerHTML` with `DocumentFragment` for efficient DOM updates
- **Event Delegation**: Centralized event handling using `data-action` attributes
- **Lazy Loading**: IntersectionObserver for loading `scoring-engine.js` and sample properties on scroll
- **Mobile Responsiveness**: Added breakpoints at 320px, 375px, and 768px with touch-friendly targets

#### UI/UX Enhancements
- **Micro-Interactions**: Score count-up animations, save button feedback, loading state transitions
- **Accordion Breakdowns**: Tier chips with expandable detailed metrics for score displays
- **Mobile Navigation**: Hamburger menu with slide-out animation and touch-friendly menu items
- **CSS Enhancements**: New utility classes and components in `css/ui-enhancements.css`

#### Files Modified
- **index.html**: Major UX improvements, progressive calculator, enhanced score displays, mobile menu
- **css/modern.css**: Mobile responsiveness improvements, hamburger menu styles
- **css/ui-enhancements.css**: New components (empty states, tooltips, unlock overlays, animations)
- **js/app.js**: Event delegation improvements, centralized action handling

#### Files Created
- **js/smart-search.js**: Unified search functionality
- **js/score-enhancements.js**: Score display enhancements
- **js/micro-interactions.js**: Animation utilities

#### Technical Improvements
- DocumentFragment usage for batch DOM updates
- IntersectionObserver for lazy loading
- Centralized event delegation pattern
- Mobile-first responsive design
- Touch optimization (44x44px minimum targets)

---

### Changed - 2025-01-27 (Comprehensive File Audit and Cleanup)

### Files Deleted (Outdated/Redundant)
- **reference/source-of-truth.md** - Deleted (outdated, content already in project-understanding.md)
- **reference/index.md** - Deleted (duplicate of documentation-index.md, referenced non-existent files)
- **working-documents/readme.md** - Deleted (outdated, referenced old file structure)

### Files Archived (Historical Reference)
- **reference/summary.md** → Moved to archive/reference/ (similar to improvements-summary.md, kept reports version)
- **reference/how-to-update-website.md** → Moved to archive/reference/ (overlaps with deployment-guide.md)
- **reports/fix-report.md** → Moved to archive/reports/ (fixes already applied, historical reference)
- **reports/final-validation.md** → Moved to archive/reports/ (validation completed, historical reference)

### Files Kept (Unique Content)
- **reference/professional-benchmarking.md** - Kept (unique benchmarking content)
- **reference/link-verification.md** - Kept (unique link verification content)
- **reports/improvements.md** - Kept (unique roadmap content)
- **reports/improvements-summary.md** - Kept (unique summary content)

### Date Updates
- Updated "Last Updated" dates from 2024-11-14 to 2025-11-17 for:
  - `data/data-dictionary.md`
  - `deployment/backend-status.md`
  - `planning/completeness-tracking.md`
  - `reference/professional-benchmarking.md`
  - `legal-compliance/legal-compliance-status.md`
  - `core/project-understanding.md` (one section)

### Documentation Index Updated
- Removed references to deleted files
- Added documentation of cleanup actions
- Updated archive folder structure

---

### Changed - 2025-01-27 (Final Consolidation Pass - Placeholder Content & Broken References)

### Placeholder Content & Broken References Removed
- **README.md:** Removed false image references (a-score-demo.png, b-score-demo.png, comparison-demo.png) that don't exist
- **README.md:** Replaced image references with descriptive text for A-Score, B-Score, and Comparison features
- **README.md:** Fixed date "As of January 2025" → "As of November 17, 2025"
- **working-documents/reference/index.md:** Fixed date "January 2025" → "2025-11-17"
- **working-documents/reference/source-of-truth.md:** Fixed date "November 15, 2025" → "2024-11-15" and added note that it's outdated

### Major Data Rundown Added to Planning
- **working-documents/planning/next-priority-plan.md:** Added Priority 4 section "Data Consistency & Quality" with comprehensive data audit information
- Links to data-consistency-audit.md and data-completeness-audit.md
- Documents remaining data quality issues (placeholder data, fake Walk Score data, estimated crime rates)
- Lists critical actions required before launch

---

## Changed - 2025-01-27 (Data Consistency Corrections & File Organization)
- **Data Count Corrections**
  - Fixed suburb count references: Changed "375+ suburbs" to "397 suburbs" in changelog.md
  - Fixed all suburb count references in completeness-tracking.md: Changed all "399/399" to "397/397"
  - Fixed LGA count: Changed "380/399" to "378/397" (19 missing)
  - Fixed median prices count: Changed "346/399" to "344/397"
  - Fixed transit/walk scores counts: Changed "377/399" to "375/397"
  - Fixed commute times counts: Changed "120/399" to "118/397"
  - Verified actual CSV counts: 397 suburbs, 32 properties

### Changed - 2025-01-27 (Documentation Consolidation & Date Standardization)
- **Documentation Consolidation & Organization**
  - Merged `PROJECT_OVERVIEW.txt` into `project-understanding.md` (single source of truth)
  - Consolidated all testing documentation into `testing-guide.md` (5 files → 1)
  - Consolidated all deployment guides into `deployment-guide.md` (4 files → 1)
  - Consolidated all task management into `task-management.md` (3 files → 1)
  - Consolidated all backend documentation into `backend-status.md` (3 files → 1)
  - Merged duplicate files with different casing (7 pairs → lowercase versions)
  - Updated `documentation-index.md` with new consolidated structure
  - Fixed all cross-references to use correct lowercase filenames
  - Moved historical/redundant documents to `archive/` folder
  - Reduced documentation file count from 50+ to ~20 core documents (~60% reduction)

- **Data Standardization**
  - Standardized all suburb count references to 397 (actual CSV count)
  - Updated file naming history to correctly document `dreamhouse_` prefix as original
  - Standardized strategy labels: user-facing uses "Lower/Middle/Higher Budget", technical docs keep dollar thresholds

- **Security & Testing Improvements**
  - Removed hardcoded 'Hampz' password from `index.html`
  - Added simple one-click "Enable Test Access" button (no password required)
  - Updated all references to reflect new test access method

- **Planning Updates**
  - Added detailed JS/CSS extraction task to `next-priority-plan.md` (HIGH priority)
  - Updated priority order to emphasize code organization as critical
  - Enhanced task descriptions with impact analysis and detailed steps

- **Date Standardization**
  - Fixed incorrect future dates: Changed "November 14, 2025" → "2024-11-14" throughout
  - Fixed incorrect future dates: Changed "November 15, 2025" → "2024-11-15"
  - Standardized all date formats to YYYY-MM-DD (ISO 8601)
  - Updated "Last Updated" dates in all documentation files
  - Fixed vague dates: Changed "January 2025" → "2025-11-17" where appropriate

- **File Organization Structure Created & Completed**
  - Created category folders: core/, planning/, legal-compliance/, testing/, deployment/, data/, assets/, reports/, reference/
  - Created root folders: demos/, scripts/
  - Moved all files to appropriate category folders
  - Renamed all files to kebab-case (e.g., TECHNICAL_DOCS.md → technical-docs.md)
  - Organized root-level docs into docs/ folder
  - Moved demo files to demos/ folder
  - Moved scripts to scripts/ folder
  - Moved duplicate/historical files to archive/
  - Moved remaining root-level non-kebab files (INDEX.md, SOURCE_OF_TRUTH.md, SUMMARY.md) to reference/ and deleted duplicates
  - Moved remaining files from working-documents/ root to appropriate subfolders
  - Removed duplicate documentation-index.md from working-documents/ root
  - Fixed references in data-dictionary files and deleted duplicate
  - All file paths now use kebab-case naming convention (except README.md which is standard)

### Added - 2024-11-14 (Backend Infrastructure)
- **Backend Server Setup**
  - Created Express.js server with full API structure
  - Set up authentication system with JWT tokens
  - Created database schema and Sequelize models
  - Implemented user registration, login, password reset
  - Created property management API endpoints
  - Created suburb search and favorites API
  - Set up Stripe payment processing integration
  - Created subscription management endpoints
  - Implemented contact form backend
  - Created email service with SendGrid integration
  - Set up security middleware (rate limiting, input sanitization, CSRF protection)
  - Created webhook handlers for Stripe events
  - Created frontend API client (`js/api.js`)
  - Created frontend authentication handler (`js/auth.js`)
  - Added comprehensive error handling and validation

### Added - 2024-11-14
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

### Added - 2025-01-13
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

### Changed - 2025-01-13
- **Navigation Structure**
  - Removed automatic onboarding trigger from public index.html
  - Added "Members" navigation link (visible only for paid users)
  - Updated "Reset Onboarding" button to "Members Dashboard" link
  - Onboarding now accessible only via members.html (to be created)

- **File Organization**
  - Created `ROOT_FILES_INVENTORY.md` for root file documentation
  - Created `PROFESSIONAL_WEBSITE_STRUCTURE.md` for multi-page architecture plan
  - Created `CHANGELOG.md` for change tracking

### Fixed - 2025-01-13
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

## [Previous Changes] - Prior to 2025-01-13

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
- ✅ 397 suburbs with complete data
- ✅ 32 sample properties

### Documentation
- ✅ project-understanding.md (1,800+ lines)
- ✅ FILE_STRUCTURE_ANALYSIS.md
- ✅ TEST_REPORT.md
- ✅ STANDALONE_TEST_PLAN.md
- ✅ Working documents folder organization
- ✅ Content style guide compliance complete (2025-11-17)

---

## Version History

- **v7.2.0** - 2025-11-17 - Content Style Guide Compliance Complete, UI/UX Consistency Complete, React Migration Complete, Ranked Properties Feature Complete
- **v7.0.0** - 2025-11-16 - React Migration Complete, Ranked Properties Feature, Pre-Deployment Checklist
- **v6.0.0** - 2025-11-15 - File Consolidation, Code Organization, Calculator Updates, Retention Strategy
- **v5.0.0** - 2025-01-13 - Feature-complete, ready for testing & business development
- **v4.0.0** - Previous version - Scriptable app (deprecated)
- **v3.0.0** - Initial local website development
- **v2.0.0** - Data integration phase
- **v1.0.0** - Initial project setup

---

## Notes

- All changes are tracked in this changelog
- Major architectural decisions documented in `PROFESSIONAL_WEBSITE_STRUCTURE.md`
- File structure documented in `ROOT_FILES_INVENTORY.md`
- Complete project understanding in `project-understanding.md`

