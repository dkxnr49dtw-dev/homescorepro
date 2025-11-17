<!-- 333a1b44-1a40-494e-a11a-cb86cd56e4f0 a8b705ca-31f8-4a64-bb59-4dfd7e95fcff -->
# Documentation Update, Planning Audit, and Scraping Removal

## Phase 1: Remove Scraping References and Reorganize Files (CRITICAL - Do First)

### 1.1 Create PERSONAL_SCRAPE Folder Structure

**Status:** Pending | **Priority:** CRITICAL | **Time:** 1 hour

**Tasks:**

- Create `PERSONAL_SCRAPE/` folder at root level
- Create subfolders:
  - `PERSONAL_SCRAPE/scripts/` - All scraping scripts
  - `PERSONAL_SCRAPE/pdf-import/` - PDF files and related
- Create `PERSONAL_SCRAPE/README.md` with clear personal use statement

**Files to Create:**

- `PERSONAL_SCRAPE/README.md` - Clear statement: "FOR PERSONAL USE ONLY - Web scraping scripts and PDF files for personal testing only. Not for commercial use or distribution."

### 1.2 Move Scraping Files to PERSONAL_SCRAPE

**Status:** Pending | **Priority:** CRITICAL | **Time:** 1 hour

**Files to Move:**

- `scripts/scrape-properties-comprehensive.js` → `PERSONAL_SCRAPE/scripts/`
- `scripts/cleanup-duplicate-pdfs.py` → `PERSONAL_SCRAPE/scripts/`
- `scripts/merge-properties.js` → `PERSONAL_SCRAPE/scripts/`
- `scripts/merge-and-dedupe.js` → `PERSONAL_SCRAPE/scripts/`
- `scripts/deduplicate-properties.js` → `PERSONAL_SCRAPE/scripts/`
- `scripts/deduplicate.py` → `PERSONAL_SCRAPE/scripts/`
- `scripts/remove-duplicate-pdfs.py` → `PERSONAL_SCRAPE/scripts/`
- `scripts/check-robots.js` → `PERSONAL_SCRAPE/scripts/`
- `scripts/debug-realestate.js` → `PERSONAL_SCRAPE/scripts/`
- `scripts/use-existing-chrome.js` → `PERSONAL_SCRAPE/scripts/`
- `pdf-import/` folder (entire folder) → `PERSONAL_SCRAPE/pdf-import/`

**Files to Keep in scripts/:**

- `scripts/validate-data.js` (general data validation, not scraping-specific)
- `scripts/fix-html-integration.sh` (if not scraping-related)

### 1.3 Update properties.csv with Personal Use Notice

**Status:** Pending | **Priority:** CRITICAL | **Time:** 30 minutes

**Tasks:**

- Add header comment to `data/properties.csv` stating "FOR PERSONAL USE ONLY - Testing B-Score functionality. Contains test data for simulating user property evaluations."
- Keep sourceUrl field but add note it's for personal testing only
- Create `data/README.md` with personal use notice for properties.csv

**Files to Update:**

- `data/properties.csv` - Add header comment
- `data/README.md` - Create with personal use notice

### 1.4 Remove Scraping References from Documentation

**Status:** Pending | **Priority:** CRITICAL | **Time:** 2-3 hours

**Files to Update:**

- `working-documents/core/project-understanding.md` - Remove property scraping section, update property count note to mention personal use
- `working-documents/core/changelog.md` - Remove or mark scraping entries as personal use only
- `working-documents/core/documentation-index.md` - Remove scraping references
- `working-documents/data/data-dictionary.md` - Mark sourceUrl as personal use only or remove
- `docs/technical-docs.md` - Remove scraping scripts documentation
- `docs/ACCESSING_RANKED_PROPERTIES.md` - Remove PDF references or mark as personal use only
- `docs/roadmap.md` - Remove Domain.com.au/realestate.com.au integration items
- `working-documents/planning/master-planning.md` - Remove scraping-related tasks
- `working-documents/planning/completeness-tracking.md` - Remove scraping-related items
- All other docs with scraping references

**References to Remove/Update:**

- Property scraping scripts → Move to PERSONAL_SCRAPE
- PDF download functionality → Mark as personal use only
- Domain.com.au scraping → Remove references
- realestate.com.au references → Remove references
- PDF viewer components → Remove or mark as personal use only
- sourceUrl field → Mark as personal use only

### 1.5 Update React Components (Remove PDF Functionality)

**Status:** Pending | **Priority:** HIGH | **Time:** 1 hour

**Tasks:**

- Remove PDFViewer component completely OR move to PERSONAL_SCRAPE
- Remove PDF tab from PropertyDetailModal
- Remove PDF quick view button from ranked properties list
- Update Members.jsx to remove all PDF functionality
- Update any imports or references to PDFViewer

**Files to Check/Update:**

- `react-app/src/components/PDFViewer.jsx` - Remove or move to PERSONAL_SCRAPE
- `react-app/src/components/PropertyDetailModal.jsx` - Remove PDF tab
- `react-app/src/pages/Members.jsx` - Remove PDF button and functionality

### 1.6 Create PERSONAL_SCRAPE/README.md

**Status:** Pending | **Priority:** CRITICAL | **Time:** 30 minutes

**Content Required:**

```
# PERSONAL SCRAPE - FOR PERSONAL USE ONLY

## ⚠️ IMPORTANT NOTICE

**ALL SCRIPTS AND FILES IN THIS FOLDER ARE FOR PERSONAL USE ONLY**

This folder contains:
- Web scraping scripts for personal testing
- PDF files downloaded for personal analysis
- Data files created from personal scraping activities

**NOT FOR:**
- Commercial use
- Distribution
- Production deployment
- Public sharing

**LEGAL CONSIDERATIONS:**
- Web scraping may violate terms of service of target websites
- Use at your own risk
- Respect robots.txt and website terms
- Only for personal, non-commercial testing

## Contents

- `scripts/` - Scraping scripts (Playwright, Node.js)
- `pdf-import/` - Downloaded PDF files
- `data/` - Scraped data files (if any)

## Usage

These scripts are provided for personal testing of B-Score functionality only.
Do not use for commercial purposes or distribute scraped data.
```

## Phase 2: Update Baseline Documentation (After Scraping Removal)

### 2.1 Update project-understanding.md

**Status:** Pending | **Priority:** CRITICAL | **Time:** 2-3 hours

**Updates Required:**

- Update "Last Updated" date to current date
- Add React migration section (all 8 pages)
- Add ranked properties feature section
- Remove property scraping section (moved to PERSONAL_SCRAPE)
- Add note that properties.csv is for personal testing only
- Add data access solution (Option C)
- Update property count: Note that properties.csv contains test data for personal use
- Remove sourceUrl field references or mark as personal use
- Update file structure to include react-app/ and PERSONAL_SCRAPE/

**Files to Update:**

- `working-documents/core/project-understanding.md`

### 2.2 Update documentation-index.md

**Status:** Pending | **Priority:** HIGH | **Time:** 30 minutes

**Updates Required:**

- Add React migration entry
- Add ranked properties feature entry
- Remove property scraping entry
- Remove PDF viewer components entry (or mark as personal use)
- Update file locations for React components
- Add data access solution documentation
- Add note about PERSONAL_SCRAPE folder

**Files to Update:**

- `working-documents/core/documentation-index.md`

### 2.3 Update changelog.md

**Status:** Pending | **Priority:** HIGH | **Time:** 1 hour

**Updates Required:**

- Add React migration entry (2025-11-16)
- Add ranked properties feature entry
- Remove or mark scraping entries as personal use only
- Add CSV parser fixes entry
- Remove PDF viewer entries (or mark as personal use)
- Add data access solution (Option C) entry
- Add scraping removal entry

**Files to Update:**

- `working-documents/core/changelog.md`

### 2.4 Update data-dictionary.md

**Status:** Pending | **Priority:** MEDIUM | **Time:** 30 minutes

**Updates Required:**

- Mark sourceUrl field as personal use only or remove
- Update property count note to mention personal testing
- Remove PDF file references section
- Add note about properties.csv being for personal testing only

**Files to Update:**

- `working-documents/data/data-dictionary.md`

### 2.5 Update technical-docs.md

**Status:** Pending | **Priority:** MEDIUM | **Time:** 1 hour

**Updates Required:**

- Add React architecture section
- Remove scraping scripts documentation
- Remove PDF viewer components (or mark as personal use)
- Add CSV parser improvements
- Add data access solution (Option C)
- Add note about PERSONAL_SCRAPE folder

**Files to Update:**

- `docs/technical-docs.md`

### 2.6 Update ui-ux-guide.md

**Status:** Pending | **Priority:** MEDIUM | **Time:** 1 hour

**Updates Required:**

- Add ranked properties UI section
- Add PropertyDetailModal component documentation (without PDF tab)
- Remove PDFViewer component documentation (or mark as personal use)
- Update design system references

**Files to Update:**

- `docs/ui-ux-guide.md`

### 2.7 Update roadmap.md

**Status:** Pending | **Priority:** MEDIUM | **Time:** 30 minutes

**Updates Required:**

- Mark React migration as completed
- Mark ranked properties as completed
- Remove property scraping entries
- Remove Domain.com.au/realestate.com.au integration items
- Update Q1 2025 status

**Files to Update:**

- `docs/roadmap.md`

## Phase 3: Audit Planning Files for Missing Tasks

### 3.1-3.10 Audit All Planning Files

**Status:** Pending | **Priority:** HIGH | **Time:** 6-8 hours

**Same as original plan - audit all planning files and verify tasks are in master-planning.md**

## Phase 4: Update master-planning.md

### 4.1-4.3 Update Master Planning

**Status:** Pending | **Priority:** HIGH | **Time:** 3-4 hours

**Same as original plan - add missing tasks, mark completed items, highlight for review**

## Phase 5: Pre-Deployment Tasks

### 5.1 Fix React Data Access (Option C)

**Status:** Pending | **Priority:** CRITICAL | **Time:** 2-3 hours

**Same as original plan**

### 5.2 Create Integration Layer (if desired)

**Status:** Pending | **Priority:** MEDIUM | **Time:** 4-6 hours

**Same as original plan**

### 5.3 Unified Deployment Strategy

**Status:** Pending | **Priority:** HIGH | **Time:** 2-3 hours

**Same as original plan**

## Deliverables

1. All scraping files moved to PERSONAL_SCRAPE folder with clear personal use statement
2. All scraping references removed from documentation
3. PDF functionality removed from React components
4. properties.csv marked as personal use only
5. All baseline documentation updated (without scraping references)
6. Complete audit of all planning files
7. master-planning.md updated with all missing tasks
8. Pre-deployment tasks documented and ready for implementation

## Success Criteria

- No scraping references in main documentation
- All scraping files in PERSONAL_SCRAPE folder with clear README
- properties.csv clearly marked as personal use only
- PDF functionality removed from production code
- All documentation files updated and current
- All uncompleted tasks from planning files are in master-planning.md
- Pre-deployment tasks clearly identified and prioritized

### To-dos

- [ ] Update project-understanding.md with React migration, ranked properties, PDF viewer, property scraping (45 properties), CSV parser fixes
- [ ] Update technical-docs.md with React architecture, new components, CSV parser improvements, property scraping scripts