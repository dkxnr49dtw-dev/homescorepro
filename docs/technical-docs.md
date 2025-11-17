# HomeScorePro - Technical Documentation

## System Architecture

### Overview
HomeScorePro is a client-side web application with two implementations:
1. **Vanilla HTML/CSS/JS** - Original implementation (calculator.html, members.html, etc.)
2. **React + Vite** - Modern React application (react-app/) with all 8 pages migrated

All calculations happen in the browser, with data stored locally for privacy.

### Technology Stack

**Frontend (Vanilla)**:
- HTML5 (semantic markup)
- CSS3 (custom properties, Grid, Flexbox)
- Vanilla JavaScript (ES6+)
- Service Worker (PWA support)

**Frontend (React)**:
- React 18
- React Router v6 (navigation)
- Framer Motion (animations)
- Vite (build tool and dev server)
- CSS Modules (design system integration)

**Data Storage**:
- LocalStorage (user preferences, saved properties)
- SessionStorage (temporary session data)
- CSV files (suburb and property data)
- JSON (configuration)

**External Dependencies (React)**:
- react, react-dom, react-router-dom
- framer-motion
- vite

### File Structure

```
homescorepro/
├── index.html              # Landing page (vanilla)
├── calculator.html         # Free tier calculator (vanilla)
├── members.html            # Members dashboard (vanilla)
├── pricing.html            # Pricing page (vanilla)
├── about.html              # About page (vanilla)
├── contact.html            # Contact form (vanilla)
├── privacy.html            # Privacy policy (vanilla)
├── terms.html              # Terms of service (vanilla)
├── css/
│   ├── design-master.css   # Single source of truth for design tokens
│   ├── calculator.css      # Calculator page styles
│   └── index.css           # Landing page styles
├── js/
│   ├── calculator.js       # Calculator functionality
│   ├── access-control.js   # Centralized paywall logic
│   ├── smart-search.js     # Smart search functionality
│   ├── score-enhancements.js # Score display utilities
│   └── micro-interactions.js # Animation utilities
├── react-app/              # React application (Vite + React 18)
│   ├── src/
│   │   ├── pages/          # All 8 pages (Home, Calculator, Members, etc.)
│   │   ├── components/     # React components (Layout, Navigation, Footer, PropertyDetailModal)
│   │   ├── utils/          # Utility functions (calculator.js, members.js)
│   │   └── styles/         # CSS imports
│   ├── public/
│   │   └── data/           # Symlinked/copied from root data/ folder
│   └── vite.config.js      # Vite configuration
├── data/
│   ├── suburbs.csv         # 397 suburb data
│   ├── properties.csv      # Test properties (FOR PERSONAL USE ONLY)
│   ├── config.json         # Configuration
│   └── README.md           # Personal use notice for properties.csv
└── PERSONAL_SCRAPE/        # FOR PERSONAL USE ONLY - Scraping scripts and PDFs
    ├── README.md           # Personal use statement
    ├── scripts/            # Scraping scripts
    ├── pdf-import/         # PDF files
    └── react-components/   # PDFViewer component (moved from react-app)
```

## Data Model

### Suburb Data Structure

```javascript
{
  name: String,              // Suburb name (e.g., "Hawthorn")
  postcode: String,          // Postcode (e.g., "3122")
  lga: String,              // Local Government Area
  latitude: Number,         // GPS coordinate
  longitude: Number,        // GPS coordinate
  medianPrice: Number,      // Median house price
  growth1yr: Number,        // 1-year growth %
  rentalYield: Number,      // Rental yield %
  
  // SEIFA Scores
  irsd_score: Number,       // Index of Relative Socio-economic Disadvantage
  irsd_decile: Number,      // IRSD decile (1-10)
  ier_score: Number,        // Index of Economic Resources
  ier_decile: Number,       // IER decile (1-10)
  ieo_score: Number,        // Index of Education and Occupation
  ieo_decile: Number,       // IEO decile (1-10)
  
  // Accessibility
  transitScore: Number,     // Public transport score (0-100)
  walkScore: Number,        // Walkability score (0-100)
  cbdDistance: Number,      // Distance to CBD (km)
  
  // Amenities
  schoolRating: Number,     // School quality rating (0-100)
  schoolCount: Number,      // Number of schools
  parksDensity: Number,     // Parks per sq km
  childcareCenters: Number, // Number of childcare centers
  shoppingCenters: Number,  // Number of shopping centers
  cafesRestaurants: Number, // Number of cafes/restaurants
  
  // Geographic
  category: String          // Geographic category
}
```

### Property Data Structure

```javascript
{
  id: String,               // Unique identifier
  address: String,          // Street address
  suburb: String,           // Suburb name
  postcode: String,         // Postcode
  price: Number,            // Property price
  propertyType: String,     // house/apartment/townhouse/unit
  bedrooms: Number,         // Number of bedrooms
  bathrooms: Number,        // Number of bathrooms
  parking: Number,          // Parking spaces
  landSize: Number,         // Land size (sqm)
  yearBuilt: Number,        // Year built
  streetQuality: Number,    // Street quality (1-5)
  bScore: Number,           // Calculated B-Score
  timestamp: String         // ISO timestamp
}
```

### User Preferences Structure

```javascript
{
  onboardingComplete: Boolean,
  primaryGoal: String,      // Investment/Balanced/Lifestyle
  budgetMin: Number,
  budgetMax: Number,
  familyStatus: String,     // Single/Couple/Family/Empty Nesters
  safetyPriority: Number,   // 1-10
  geographicCategories: Array<String>, // Selected categories or "all"
  priorities: {
    schools: Number,        // 0-10
    transport: Number,      // 0-10
    lifestyle: Number,      // 0-10
    investment: Number,     // 0-10
    community: Number       // 0-10
  }
}
```

## Scoring Algorithms

### A-Score (Suburb Analysis)

**Purpose**: Evaluate suburbs based on investment potential, location quality, accessibility, and lifestyle amenities.

**Range**: 0-100 (higher is better)

**Calculation**:

```javascript
A-Score = (Tier1 × W1) + (Tier2 × W2) + (Tier3 × W3) + (Tier4 × W4)

Where:
- W1, W2, W3, W4 = Strategy-dependent weights
- Strategy weights vary by budget/goal
```

#### Tier 1: Investment (Weight: 30-45%)

```javascript
// Capital Growth Score
growthScore = normalize(growth1yr, -5, 15) // min/max range

// Rental Yield Score  
yieldScore = normalize(rentalYield, 1, 6)

// Combined
tier1 = (growthScore × 0.55) + (yieldScore × 0.45)
```

#### Tier 2: Location (Weight: 30-35%)

```javascript
// SEIFA Scores
irsdScore = normalize(irsd_score, 800, 1200)
ierScore = normalize(ier_score, 800, 1200)
ieoScore = normalize(ieo_score, 800, 1200)

// Crime Rate (inverse - lower is better)
crimeScore = normalize(crimeRate, 3000, 25000, inverse=true)

// Strategy-dependent sub-weights
tier2 = (irsdScore × w_irsd) + (ierScore × w_ier) + 
        (ieoScore × w_ieo) + (crimeScore × w_crime)
```

#### Tier 3: Accessibility (Weight: 15-20%)

```javascript
cbdScore = normalize(cbdDistance, 0, 50, inverse=true)
transitScore = transitScore / 100  // Already 0-100
walkScore = walkScore / 100        // Already 0-100

tier3 = (cbdScore × 0.30) + (transitScore × 0.45) + (walkScore × 0.25)
```

#### Tier 4: Lifestyle (Weight: 10-30%)

```javascript
schoolScore = schoolRating / 100   // Already 0-100
parksScore = normalize(parksDensity, 0, 10)
childcareScore = normalize(childcareCenters, 0, 20)
shoppingScore = normalize(shoppingCenters, 0, 10)
cafesScore = normalize(cafesRestaurants, 0, 100)

tier4 = (schoolScore × 0.40) + (parksScore × 0.25) + 
        (childcareScore × 0.20) + (shoppingScore × 0.08) + 
        (cafesScore × 0.07)
```

### B-Score (Property Evaluation)

**Purpose**: Evaluate individual properties based on features, price, location, and investment potential.

**Range**: 0-100 (higher is better)

**Calculation**:

```javascript
B-Score = (Tier1 × W1) + (Tier2 × W2) + (Tier3 × W3) + 
          (Tier4 × W4) + (Tier5 × W5)

Where W1-W5 are strategy-dependent weights
```

#### Tier 1: Investment (Weight: 18-40%)

```javascript
// Price Affordability
affordabilityScore = normalize(1000000 / price, 0.5, 2)

// Property Type Score
typeScore = {
  house: 100,
  townhouse: 70,
  unit: 50,
  apartment: 35
}[propertyType]

// Capital Growth (from suburb)
growthScore = from suburb data

// Rental Yield (from suburb)
yieldScore = from suburb data

tier1 = (affordabilityScore × 0.35) + (typeScore × 0.30) + 
        (growthScore × 0.20) + (yieldScore × 0.15)
```

#### Tier 2: Location (Weight: 23%)

```javascript
// Uses suburb's SEIFA scores and crime data
tier2 = calculated from associated suburb
```

#### Tier 3: Accessibility (Weight: 20-26%)

```javascript
// Uses suburb's commute, transit, and walk scores
tier3 = calculated from associated suburb
```

#### Tier 4: Property Features (Weight: 12-20%)

```javascript
landScore = (landSize / 10) × 0.35
bedroomScore = (bedrooms × 10) × 0.25
bathroomScore = (bathrooms × 12) × 0.25
streetScore = (streetQuality × 15) × 0.15

tier4 = landScore + bedroomScore + bathroomScore + streetScore
```

#### Tier 5: Lifestyle (Weight: 5-19%)

```javascript
// Uses suburb's amenity scores
tier5 = calculated from associated suburb
```

### Strategy Weights

```javascript
const strategyWeights = {
  investment: {
    aTiers: { tier1: 0.45, tier2: 0.30, tier3: 0.15, tier4: 0.10 },
    bTiers: { tier1: 0.40, tier2: 0.23, tier3: 0.20, tier4: 0.12, tier5: 0.05 }
  },
  balanced: {
    aTiers: { tier1: 0.30, tier2: 0.30, tier3: 0.20, tier4: 0.20 },
    bTiers: { tier1: 0.28, tier2: 0.23, tier3: 0.26, tier4: 0.15, tier5: 0.08 }
  },
  lifestyle: {
    aTiers: { tier1: 0.20, tier2: 0.35, tier3: 0.15, tier4: 0.30 },
    bTiers: { tier1: 0.18, tier2: 0.23, tier3: 0.20, tier4: 0.20, tier5: 0.19 }
  }
};
```

### Normalization Function

```javascript
function normalizeScore(value, min, max, inverse = false) {
  if (inverse) {
    return Math.min(100, Math.max(0, ((max - value) / (max - min)) × 100));
  }
  return Math.min(100, Math.max(0, ((value - min) / (max - min)) × 100));
}
```

## API Endpoints

Currently, HomeScorePro operates entirely client-side with no backend API. Future API plans:

### Future API v1 Endpoints

```
GET  /api/v1/suburbs              # List all suburbs
GET  /api/v1/suburbs/:name        # Get suburb details
POST /api/v1/suburbs/search       # Search suburbs
GET  /api/v1/suburbs/:name/score  # Calculate A-Score

POST /api/v1/properties/score     # Calculate B-Score
GET  /api/v1/properties/:id       # Get property details

GET  /api/v1/user/preferences     # Get preferences
POST /api/v1/user/preferences     # Update preferences
GET  /api/v1/user/saved           # Get saved properties
POST /api/v1/user/saved           # Save property
```

## Performance Optimization

### DOM Optimization

**DocumentFragment Usage**: Replaced `innerHTML` with `DocumentFragment` for efficient DOM updates:

```javascript
// Before: Multiple DOM reflows
container.innerHTML = '<div>...</div>';

// After: Single DOM update
const fragment = document.createDocumentFragment();
fragment.appendChild(createElement());
container.appendChild(fragment);
```

**Benefits**:
- Reduces DOM reflows and repaints
- Improves rendering performance
- Better memory management

### Event Delegation

**Centralized Event Handling**: Implemented centralized event delegation using `data-action` attributes:

```javascript
// Single event listener for all actions
document.addEventListener('click', (e) => {
    const action = e.target.closest('[data-action]')?.dataset.action;
    if (action) {
        handleAction(action, e);
    }
});
```

**Benefits**:
- Reduced memory footprint
- Better performance with dynamic content
- Easier to maintain and extend

### Lazy Loading

**IntersectionObserver Implementation**: Lazy load resources when they come into view:

```javascript
// Lazy load scoring-engine.js when calculator section is visible
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            loadScoringEngine();
            observer.unobserve(entry.target);
        }
    });
}, { rootMargin: '200px' });
```

**Lazy Loaded Resources**:
- `scoring-engine.js`: Loaded when calculator section is visible
- Sample properties: Loaded when scrolled into view
- Reduces initial page load time

### Loading Strategy

1. **Critical CSS**: Inline above-the-fold styles
2. **Lazy Loading**: Load suburb data and scripts on demand using IntersectionObserver
3. **Service Worker**: Cache static assets
4. **Debouncing**: Limit search input frequency
5. **Virtual Scrolling**: For large data tables
6. **RequestAnimationFrame**: Batch DOM updates for smooth animations

### Caching Strategy

```javascript
// Cache static assets for 1 week
const CACHE_NAME = 'homescorepro-v1';
const CACHE_URLS = [
  '/',
  '/index.html',
  '/css/modern.css',
  '/css/ui-enhancements.css',
  '/js/app.js',
  '/js/scoring.js',
  '/js/scoring-engine.js',
  '/js/components.js',
  '/js/smart-search.js',
  '/js/score-enhancements.js',
  '/js/micro-interactions.js',
  '/js/access-control.js',
  '/data/suburbs.csv',
  '/data/config.json'
];
```

### Optimization Metrics

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Lighthouse Score**: 95+
- **Bundle Size**: < 200KB

## Security Considerations

### Data Privacy

- **No Server Storage**: All data stored locally
- **No Tracking**: No analytics cookies
- **No PII Collection**: Minimal personal data
- **Export Control**: User controls their data

### Input Validation

```javascript
// Validate all user inputs
function validatePrice(price) {
  return typeof price === 'number' && 
         price > 0 && 
         price < 100000000;
}

function validateSuburb(name) {
  return typeof name === 'string' && 
         name.length > 0 && 
         name.length < 100;
}
```

### XSS Prevention

- Sanitize all user-generated content
- Use textContent instead of innerHTML where possible
- Escape HTML entities in dynamic content

## Testing Strategy

### Unit Tests (Future)

```javascript
// Example test structure
describe('ScoringEngine', () => {
  describe('calculateAScore', () => {
    it('should return score between 0-100', () => {
      const score = calculateAScore(mockSuburb, mockPreferences);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });
    
    it('should apply correct strategy weights', () => {
      // Test implementation
    });
  });
});
```

### Integration Tests

- Test data loading from CSV
- Test localStorage persistence
- Test cross-browser compatibility

### E2E Tests (Playwright)

Already implemented in `/tests/` directory:
- Suburb search flow
- Property evaluation flow
- Save/compare functionality

## Deployment

### Build Process

1. Minify CSS/JS
2. Optimize images
3. Generate service worker
4. Update manifest.json version

### Hosting

**Current**: Static hosting (Netlify/Vercel/GitHub Pages)

**Requirements**:
- HTTPS enabled
- Custom domain support
- CDN for global delivery
- Auto-deploy from git

### Monitoring

**Tools to implement**:
- Error tracking (Sentry)
- Performance monitoring (Web Vitals)
- User analytics (privacy-friendly)
- Uptime monitoring

## Mobile Responsiveness

### Breakpoints

**Mobile Portrait (320px - 374px)**:
- Single column layouts
- Touch-friendly targets (44x44px minimum)
- Font size: 14px base
- Full-width buttons and inputs

**Mobile Landscape / Small Tablet (375px - 767px)**:
- Two-column grids where appropriate
- Font size: 15px base
- Optimized spacing

**Tablet (768px - 1023px)**:
- Three-column grids
- Enhanced spacing
- Tablet-optimized navigation

**Desktop (1024px+)**:
- Full multi-column layouts
- Maximum content width: 1400px
- Desktop navigation menu

### Mobile Navigation

**Hamburger Menu**: Slide-out navigation menu for mobile devices:
- Fixed position overlay
- Smooth slide-in animation
- Touch-friendly menu items
- Auto-close on link click or outside click

### Touch Optimization

- Minimum touch target size: 44x44px
- Input font size: 16px (prevents iOS zoom)
- Swipe gestures for navigation
- Pull-to-refresh support

## Browser Support

**Supported Browsers**:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Mobile Support**:
- iOS Safari 14+
- Chrome Android 90+

**Progressive Enhancement**:
- Core functionality works without JS
- Graceful degradation for older browsers
- Feature detection for modern APIs (IntersectionObserver, etc.)

## Accessibility

### WCAG 2.1 Compliance

- **Level AA**: Target compliance level
- **Keyboard Navigation**: Full support
- **Screen Readers**: ARIA labels
- **Color Contrast**: 4.5:1 minimum
- **Focus Indicators**: Visible on all interactive elements

### Implementation

```html
<!-- Example accessible component -->
<button aria-label="Calculate A-Score for Hawthorn" 
        aria-describedby="score-description">
  Calculate Score
</button>
```

## React Application Architecture

### Component Structure

**Pages** (`react-app/src/pages/`):
- `Home.jsx` - Landing page
- `Calculator.jsx` - Free tier calculator
- `Members.jsx` - Members dashboard with ranked properties
- `Pricing.jsx` - Pricing tiers
- `About.jsx` - Company story
- `Contact.jsx` - Contact form
- `Privacy.jsx` - Privacy policy
- `Terms.jsx` - Terms of service

**Components** (`react-app/src/components/`):
- `Layout.jsx` - Main layout wrapper
- `Navigation.jsx` - Navigation bar
- `Footer.jsx` - Footer component
- `PropertyDetailModal.jsx` - Detailed property breakdown modal

**Utilities** (`react-app/src/utils/`):
- `calculator.js` - Calculator logic (A-Score, B-Score)
- `members.js` - Members page utilities (CSV loading, property management)

### Data Access (Option C - Hybrid)

**Development**:
- Symlink: `ln -s ../../data react-app/public/data`
- React app accesses data via `/data/properties.csv`

**Production**:
- Prebuild script copies `data/` to `react-app/public/data/`
- `npm run prebuild` → `npm run build`

### CSV Parser Improvements

**Robust Quote Handling**:
- Handles multi-line quoted fields
- Properly escapes quotes within fields
- Supports CSV files with complex formatting

**Features**:
- Loads `suburbs.csv` (397 suburbs)
- Loads `properties.csv` (test properties for personal use)
- Real-time B-Score calculation
- Ranked properties sorting

### Ranked Properties Feature

**Implementation**:
- Properties loaded from `properties.csv`
- B-Score calculated for each property
- Sorted by B-Score (descending)
- Displayed with rank badges, tier scores
- Click to view detailed breakdown modal

**Components**:
- Ranked properties list in `Members.jsx`
- `PropertyDetailModal` for detailed breakdown
- Real-time calculation if B-Score not in CSV

## Future Enhancements

### Phase 1 (Q1 2025)
- Mobile app (React Native)
- Enhanced comparisons
- Alert system

### Phase 2 (Q2 2025)
- Predictive analytics
- API platform
- Team features

### Phase 3 (Q3 2025)
- White-label solution
- Multi-city support (Sydney, Brisbane)
- Advanced filters
- Custom data imports

## Contributing

### Code Style

```javascript
// Use ES6+ features
const calculateScore = (suburb, prefs) => {
  // Clear variable names
  const investmentWeight = prefs.investment || 5;
  
  // Comment complex logic
  // Normalize growth: -5% to 15% mapped to 0-100
  const growthScore = normalize(suburb.growth1yr, -5, 15);
  
  return score;
};
```

### Git Workflow

1. Create feature branch from `main`
2. Make changes with clear commits
3. Test locally
4. Create pull request
5. Code review
6. Merge to main
7. Deploy

### Commit Messages

```
feat: Add property comparison tool
fix: Correct A-Score calculation for lifestyle strategy
docs: Update API documentation
style: Format scoring.js
refactor: Simplify data loading logic
test: Add tests for B-Score calculation
```

## Support

### Documentation
- User guide: `/docs/user-guide.md`
- API docs: `/docs/api.md`
- FAQ: `/docs/faq.md`

### Contact
- Email: support@homescorepro.com
- Twitter: @homescorepro
- GitHub: github.com/homescorepro

---

**Last Updated**: November 17, 2025  
**Version**: 1.0.0  
**Maintainer**: HomeScorePro Team  
**Recent Updates:**
- UI/UX Consistency - All spacing variables standardized across all pages (2025-11-17)
- Content Style Guide Compliance - All content reviewed and updated for style guide compliance (2025-11-17)
