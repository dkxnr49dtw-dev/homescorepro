# Professional Website File Structure - HomeScorePro

**Last Updated:** January 13, 2025  
**Status:** Production Structure

## Root Directory Files (Minimal - Professional Standard)

### Essential Root Files Only:
```
homescorepro/
├── index.html                    # Public landing page (entry point)
├── members.html                   # Paid members dashboard
├── pricing.html                   # Pricing page
├── about.html                     # About us page
├── contact.html                   # Contact page
├── privacy.html                   # Privacy policy (legal)
├── terms.html                     # Terms of service (legal)
├── manifest.json                  # PWA manifest (required in root)
├── service-worker.js              # PWA service worker (required in root)
└── apple-touch-icon.png          # iOS touch icon (required in root)
```

**Rationale:** Only essential files that must be in root for web standards (PWA files, entry point) are kept in root. All other files are organized in subdirectories.

---

## Organized Directory Structure

```
homescorepro/
│
├── index.html                     # Public landing page
├── members.html                   # Paid members dashboard
├── pricing.html                   # Pricing & plans
├── about.html                     # About us
├── contact.html                   # Contact & support
├── privacy.html                   # Privacy policy
├── terms.html                     # Terms of service
│
├── assets/                        # Static assets
│   ├── images/                    # Images (logos, backgrounds, etc.)
│   ├── icons/                     # UI icons
│   │   ├── icon-192.png
│   │   └── icon-512.png
│   ├── fonts/                     # Web fonts
│   └── svg/                       # SVG source files
│       └── homescore-final.svg
│
├── css/                           # Stylesheets (future extraction)
│   ├── main.css
│   ├── calculator.css
│   └── responsive.css
│
├── js/                            # JavaScript modules (future extraction)
│   ├── main.js
│   ├── calculator.js
│   ├── data-loader.js
│   └── auth.js
│
├── data/                          # Data files
│   ├── suburbs.csv
│   ├── properties.csv
│   ├── config.json
│   └── backup/                    # Data backups
│
├── _site/                         # Site documentation & assets
│   ├── docs/                      # Site-specific documentation
│   │   ├── ICON_CREATION_INSTRUCTIONS.md
│   │   ├── ICON_GENERATION_PROMPT.md
│   │   └── TEST_REPORT.md
│   └── assets/                    # Design assets
│       └── homescore-final.svg
│
├── working-documents/             # ALL Project Documentation (Source of Truth)
│   ├── DOCUMENTATION_INDEX.md     # Master documentation navigation (START HERE)
│   ├── PROJECT_UNDERSTANDING.md  # Complete project documentation (SOURCE OF TRUTH)
│   ├── FILE_STRUCTURE_ANALYSIS.md # Architecture analysis
│   ├── PROFESSIONAL_WEBSITE_STRUCTURE.md
│   ├── ROOT_FILES_INVENTORY.md
│   ├── CHANGELOG.md
│   ├── SECURITY_PRIVACY_PROPOSAL.md
│   ├── LEGAL_LICENSING_ANALYSIS.md
│   ├── UX_TEST_REPORT.md
│   ├── IMPLEMENTATION_SUMMARY.md
│   ├── LINK_VERIFICATION.md
│   ├── PLACEHOLDER_CONTENT.md
│   ├── STANDALONE_TEST_PLAN.md
│   └── ...
│
├── user-testing/                  # Standalone test versions
│   ├── standalone-test.html
│   ├── STANDALONE_TEST_PLAN.md
│   ├── build-standalone.sh
│   └── README.md
│
├── tests/                         # Test files
│
├── deployment/                    # Deployment configs & scripts
│   └── create_pages.py           # Page generation script
│
└── archive/                       # Legacy & old files
    ├── docs/                      # Old documentation
    │   └── FILE_STRUCTURE_ANALYSIS.md (old version)
    ├── planning/                  # Old planning docs
    │   └── current-planning-update.md
    ├── legacy/                    # Deprecated Scriptable files
    │   └── ...
    ├── HomeScorePro_Website.html  # Legacy marketing page
    └── homescorepro.code-workspace # VS Code workspace file
```

---

## File Organization Principles

### Root Directory
**Only Essential Files:**
- HTML entry points (index.html, members.html, etc.)
- PWA files (manifest.json, service-worker.js) - must be in root
- Apple touch icon - must be in root for iOS

**Why Minimal Root:**
- Professional web development standard
- Easier to navigate
- Clear separation of concerns
- Better for version control
- Easier deployment

### Assets Directory
**Purpose:** All static media files
- Images, icons, fonts, SVG files
- Organized by type (images/, icons/, fonts/, svg/)

### Data Directory
**Purpose:** Application data files
- CSV files (suburbs, properties)
- JSON configuration
- Backup copies

### Documentation
**Purpose:** Project documentation
- `working-documents/` - Active project docs
- `_site/docs/` - Site-specific documentation
- `archive/` - Old/legacy documentation

### Testing & Development
**Purpose:** Development tools
- `user-testing/` - Standalone test versions
- `tests/` - Automated tests
- `deployment/` - Deployment scripts

---

## Navigation Structure

### Public Pages (index.html, pricing.html, about.html, contact.html)
```
HomeScorePro Logo → index.html
├── Suburb Scout → #location-scout (limited)
├── Property Evaluator → #calculator (limited)
├── Pricing → pricing.html
├── About → about.html
├── Contact → contact.html
├── Privacy → privacy.html
├── Terms → terms.html
└── Sign Up / Login → members.html (with access check)
```

### Members Page (members.html)
```
HomeScorePro Logo → index.html
├── Dashboard → members.html#dashboard
├── Onboarding → members.html#onboarding (if not completed)
├── Suburb Scout → members.html#location-scout (full)
├── Property Evaluator → members.html#calculator (full)
├── My Properties → members.html#my-properties
├── Settings → members.html#settings
└── Logout → index.html (clear session)
```

---

## Implementation Status

### ✅ Completed
- Root file organization
- Directory structure created
- Old files moved to archive
- Documentation organized

### 🔄 In Progress
- Creating all HTML pages
- Implementing navigation
- Setting up shared components

### 📋 To Do
- Extract CSS to separate files
- Extract JavaScript to separate files
- Create shared header/footer components
- Implement authentication system
- Add security measures

---

## Best Practices Applied

1. **Minimal Root:** Only essential files in root
2. **Organized by Type:** Files grouped by purpose
3. **Clear Naming:** Descriptive, consistent names
4. **Version Control Friendly:** Easy to track changes
5. **Professional Standard:** Follows web development best practices
6. **Scalable:** Easy to add new pages/files
7. **Maintainable:** Clear structure for future developers

---

## Migration Notes

**Files Moved:**
- `FILE_STRUCTURE_ANALYSIS.md` → `archive/docs/` (old version)
- `current-planning-update.md` → `archive/planning/`
- `HomeScorePro_Website.html` → `archive/`
- `ICON_CREATION_INSTRUCTIONS.md` → `_site/docs/`
- `ICON_GENERATION_PROMPT.md` → `_site/docs/`
- `TEST_REPORT.md` → `_site/docs/`
- `homescore-final.svg` → `_site/assets/`

**New Files Created:**
- `members.html` - Paid members dashboard
- `pricing.html` - Pricing page
- `about.html` - About page
- `contact.html` - Contact page
- `privacy.html` - Privacy policy
- `terms.html` - Terms of service
- `SECURITY_PRIVACY_PROPOSAL.md` - Security documentation

---

## Implementation Status

### ✅ Completed (January 13, 2025)
- ✅ File structure organized
- ✅ All 7 HTML pages created (index, members, pricing, about, contact, privacy, terms)
- ✅ Navigation implemented across all pages
- ✅ Footer links updated on all pages
- ✅ Root directory cleaned (only essential files)
- ✅ Documentation organized into `working-documents/`
- ✅ Old files moved to `archive/`

### 📋 To Do
- Extract CSS to separate files
- Extract JavaScript to separate files
- Create shared header/footer components
- Implement authentication system
- Add security measures
- Replace placeholder content (see `placeholder-content.md`)

---

## Root Files Inventory

**Essential Root Files Only:**
- `index.html` - Public landing page
- `members.html` - Paid members dashboard
- `pricing.html` - Pricing page
- `about.html` - About us page
- `contact.html` - Contact page
- `privacy.html` - Privacy policy
- `terms.html` - Terms of service
- `manifest.json` - PWA manifest (required in root)
- `service-worker.js` - PWA service worker (required in root)
- `apple-touch-icon.png` - iOS touch icon (required in root)

**All other files organized in subdirectories:**
- Documentation → `working-documents/`
- Data → `data/`
- Assets → `assets/`
- Legacy → `archive/`
