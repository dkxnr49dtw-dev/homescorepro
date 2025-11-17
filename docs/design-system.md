# HomeScorePro Design System

**Last Updated:** 2025-11-17  
**Purpose:** Complete reference for CSS variables, colors, typography, spacing, and component library  
**Design Philosophy:** Dark theme with orange accents and glassmorphism effects  
**Status:** ✅ All spacing variables standardized across all pages (2025-11-17)

---

## Design Philosophy

HomeScorePro uses a **dark theme design system** with:
- **Dark base colors** (#0F0F0F, #1A1A1A, #262626) for backgrounds
- **Orange accent colors** (#CC785C, #E8917F) for brand identity
- **Glassmorphism effects** with backdrop blur for navigation and cards
- **High contrast** text colors for readability
- **Subtle texture** with repeating gradient patterns

---

## CSS Variables

All HTML pages use a standardized set of CSS variables defined in the `:root` selector. These variables ensure consistent design across the entire website.

### Dark Theme Base Colors

```css
--dark-950: #0F0F0F;          /* Darkest background - primary page background */
--dark-900: #1A1A1A;          /* Dark background - secondary sections */
--dark-800: #262626;          /* Medium dark - tertiary sections */
--dark-700: #333333;          /* Lighter dark - borders, dividers */
```

**Usage:**
- `--dark-950`: Main page background
- `--dark-900`: Card backgrounds, secondary sections
- `--dark-800`: Nested cards, tertiary sections
- `--dark-700`: Borders, subtle dividers

### Brand Colors (Orange Theme)

```css
--orange-primary: #CC785C;    /* Primary orange - main brand color */
--orange-light: #E8917F;      /* Light orange - hover states, accents */
--orange-subtle: rgba(204, 120, 92, 0.12);  /* Subtle orange - backgrounds */
```

**Usage:**
- `--orange-primary`: Primary buttons, links, brand elements
- `--orange-light`: Hover states, active states, highlights
- `--orange-subtle`: Subtle background highlights, badges

### Legacy Brand Colors (Compatibility)

```css
--primary: #CC785C;           /* Maps to orange-primary */
--secondary: #E8917F;         /* Maps to orange-light */
--accent: #E8917F;            /* Maps to orange-light */
--gradient: linear-gradient(135deg, #E8917F 0%, #CC785C 100%);
--gradient-soft: rgba(204, 120, 92, 0.12);
```

**Usage:**
- Maintained for backward compatibility with existing code
- All map to the new orange theme colors

---

### Semantic Colors

```css
--success: #22c55e;           /* Green - success states, positive indicators */
--warning: #f59e0b;           /* Orange - warnings, caution */
--error: #ef4444;             /* Red - errors, negative states */
--info: #3b82f6;              /* Blue - informational messages */
```

**Usage:**
- `--success`: Success messages, positive scores, completed states
- `--warning`: Warning messages, caution indicators
- `--error`: Error messages, negative indicators, validation errors
- `--info`: Informational tooltips, help text

---

### Text Colors

```css
--text-primary: #F5F5F5;      /* Primary text - headings, important content */
--text-secondary: #D4D4D4;    /* Secondary text - body text, descriptions */
--text-tertiary: #A3A3A3;     /* Tertiary text - labels, captions, hints */
```

**Usage:**
- `--text-primary`: Main headings, important text, primary content
- `--text-secondary`: Body text, descriptions, secondary content
- `--text-tertiary`: Labels, captions, hints, less important text

### Background Colors

```css
--bg-primary: #0F0F0F;        /* Primary background - page background */
--bg-secondary: #1A1A1A;      /* Secondary background - cards, sections */
--bg-tertiary: #262626;       /* Tertiary background - nested cards */
--glass-bg: rgba(26, 26, 26, 0.7);  /* Glassmorphism background */
--glass-border: rgba(64, 64, 64, 0.3);  /* Glassmorphism border */
```

**Usage:**
- `--bg-primary`: Main page background
- `--bg-secondary`: Card backgrounds, section backgrounds
- `--bg-tertiary`: Nested cards, input backgrounds
- `--glass-bg`: Navigation bars, modals with backdrop blur
- `--glass-border`: Borders for glassmorphism elements

### Neutral Colors (Dark Theme Mapping)

```css
/* Legacy compatibility - mapped to dark theme */
--white: #1A1A1A;             /* Maps to bg-secondary */
--gray-50: #262626;           /* Maps to bg-tertiary */
--gray-100: #333333;          /* Maps to dark-700 */
--gray-200: #404040;          /* Lighter dark */
--gray-300: #525252;          /* Medium dark */
--gray-400: #737373;          /* Medium gray */
--gray-500: #A3A3A3;          /* Maps to text-tertiary */
--gray-600: #D4D4D4;          /* Maps to text-secondary */
--gray-700: #E5E5E5;          /* Light gray */
--gray-800: #F5F5F5;          /* Maps to text-primary */
--gray-900: #F5F5F5;          /* Maps to text-primary */
--black: #0F0F0F;             /* Maps to bg-primary */
```

**Usage:**
- Maintained for backward compatibility
- All mapped to appropriate dark theme equivalents

---

### Typography

```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', 'SF Mono', Consolas, monospace;
```

**Usage:**
- `--font-sans`: All body text, headings, UI elements (default)
- `--font-mono`: Code snippets, data values, technical information

**Font Weights:**
- 400: Regular body text
- 500: Medium emphasis (navigation links)
- 600: Semi-bold (buttons, labels)
- 700: Bold (headings, strong emphasis)
- 900: Extra bold (hero headings, large displays)

---

### Spacing Scale

**Numeric System (Primary):**
```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
--space-32: 8rem;     /* 128px - For large hero sections */
```

**Semantic Aliases (Backward Compatibility):**
```css
--space-xs: var(--space-1);   /* 4px - Tight spacing */
--space-sm: var(--space-2);   /* 8px - Small spacing */
--space-md: var(--space-4);   /* 16px - Medium spacing (base unit) */
--space-lg: var(--space-6);   /* 24px - Large spacing */
--space-xl: var(--space-8);   /* 32px - Extra large spacing */
--space-2xl: var(--space-12); /* 48px - 2X large spacing */
--space-3xl: var(--space-16); /* 64px - 3X large spacing */
```

**Usage Guidelines:**
- `--space-xs`: Icon padding, tight gaps
- `--space-sm`: Button padding, small gaps
- `--space-md`: Standard padding, margins between elements
- `--space-lg`: Section spacing, card padding
- `--space-xl`: Major section spacing, large gaps
- `--space-2xl`: Page section spacing
- `--space-3xl`: Hero section spacing, major page divisions

---

### Border Radius

```css
--radius-sm: 0.25rem;         /* 4px - Small elements */
--radius-md: 0.5rem;          /* 8px - Buttons, inputs */
--radius-lg: 1rem;            /* 16px - Cards, panels */
--radius-xl: 1.5rem;          /* 24px - Large cards, modals */
--radius-full: 9999px;        /* Pills, badges, avatars */
```

**Usage:**
- `--radius-sm`: Small badges, tags
- `--radius-md`: Buttons, input fields, small cards
- `--radius-lg`: Standard cards, panels, containers
- `--radius-xl`: Large cards, modals, hero sections
- `--radius-full`: Pills, circular avatars, rounded badges

---

### Shadows

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
```

**Usage:**
- `--shadow-sm`: Subtle elevation, hover states
- `--shadow`: Standard cards, navigation bars
- `--shadow-lg`: Elevated cards, buttons on hover
- `--shadow-xl`: Modals, dropdowns, floating elements
- `--shadow-2xl`: Major modals, overlays

---

### Transitions

```css
--transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
--transition-fast: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
```

**Usage:**
- `--transition`: Standard transitions (buttons, cards, links)
- `--transition-fast`: Quick interactions (hover states, micro-interactions)

**Easing:** `cubic-bezier(0.4, 0, 0.2, 1)` provides smooth, natural motion

---

## Component Library

### Navigation

**Structure:**
```html
<nav>
  <div class="nav-container">
    <a href="index.html" class="nav-logo">🏡 HomeScorePro</a>
    <ul class="nav-links">
      <li><a href="..." class="nav-link">Link</a></li>
    </ul>
    <a href="..." class="nav-cta">Sign In</a>
  </div>
</nav>
```

**Styles:**
- Fixed position, top of page
- Background: `var(--glass-bg)` with `backdrop-filter: blur(20px)`
- Border: `1px solid var(--glass-border)`
- Logo: Gradient text using orange colors
- Links: `var(--text-secondary)` with `var(--orange-light)` on hover
- CTA: `var(--bg-tertiary)` background with orange text

---

### Buttons

**Primary Button:**
```html
<button class="btn btn-primary">Click Me</button>
```
- Background: `linear-gradient(135deg, var(--orange-light), var(--orange-primary))`
- Color: `var(--dark-900)` (dark text on orange)
- Padding: `1rem 2rem`
- Border radius: `var(--radius-lg)`
- Hover: `transform: translateY(-2px)`, increased shadow with orange glow

**Secondary Button:**
```html
<button class="btn btn-secondary">Click Me</button>
```
- Background: `var(--bg-tertiary)`
- Border: `2px solid var(--glass-border)`
- Color: `var(--orange-light)`
- Similar padding and radius

---

### Cards

**Standard Card:**
```html
<div class="card">
  <h3>Card Title</h3>
  <p>Card content</p>
</div>
```
- Background: `var(--bg-secondary)`
- Border: `1px solid var(--glass-border)`
- Padding: `var(--space-xl)`
- Border radius: `var(--radius-xl)`
- Shadow: `var(--shadow-md)` or `var(--shadow-lg)`
- Hover: Border color changes to `var(--orange-primary)`, `transform: translateY(-2px)`

---

### Input Fields

**Standard Input:**
```html
<div class="form-group">
  <label class="form-label">Label</label>
  <input type="text" class="form-input" placeholder="...">
</div>
```
- Background: `var(--bg-tertiary)`
- Border: `2px solid var(--dark-700)` or `var(--glass-border)`
- Color: `var(--text-primary)`
- Border radius: `var(--radius-md)`
- Padding: `var(--space-md)`
- Focus: Border color changes to `var(--orange-primary)`

---

## Usage Guidelines

### Color Contrast
- Ensure WCAG AA compliance (4.5:1 for normal text, 3:1 for large text)
- Primary text on dark: `var(--text-primary)` (#F5F5F5 on #0F0F0F = 15.8:1)
- Secondary text: `var(--text-secondary)` (#D4D4D4 on #0F0F0F = 11.2:1)
- Orange on dark: `var(--orange-light)` (#E8917F on #0F0F0F = 4.8:1)

### Spacing Consistency
- Use spacing variables, not arbitrary values
- Maintain consistent spacing rhythm (multiples of `--space-md`)

### Responsive Design
- Mobile-first approach
- Breakpoints: 768px (tablet), 968px (desktop)
- Use `max-width: 1400px` for containers

### Accessibility
- Maintain focus states with `var(--orange-primary)` color
- Use semantic HTML
- Ensure keyboard navigation works
- Provide alt text for images
- Dark theme maintains high contrast ratios for readability

---

## Glassmorphism Effects

Glassmorphism is a key design element in the dark theme:

```css
background: var(--glass-bg);           /* rgba(26, 26, 26, 0.7) */
backdrop-filter: blur(20px);           /* Blur effect */
border: 1px solid var(--glass-border); /* rgba(64, 64, 64, 0.3) */
```

**Usage:**
- Navigation bars
- Modal overlays
- Floating cards
- Dropdown menus

**Browser Support:**
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Fallback: Solid background if backdrop-filter not supported

---

## Background Texture

All pages include a subtle repeating gradient pattern:

```css
body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: 
        repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.01) 2px, rgba(255,255,255,0.01) 4px),
        repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.01) 2px, rgba(255,255,255,0.01) 4px);
    pointer-events: none;
    z-index: 0;
}
```

**Effect:** Subtle grid texture that adds depth without distraction

---

## File Structure

- `css/modern.css` - Base design system (may use different variable names)
- `css/ui-enhancements.css` - Advanced UI components and animations
- HTML files - Inline CSS variables in `:root` (standardized dark theme set)

**Note:** HTML files use inline CSS variables that define the dark theme. The inline variables take precedence and are the source of truth for the design system. All pages now use the unified dark theme color palette.

---

## New Components (November 2025)

### Enhanced Score Display

**Structure:**
```html
<div class="score-display-enhanced">
    <div class="score-context">
        <span class="score-percentile">Top 15% in Melbourne</span>
    </div>
    <div class="score-main">
        <div class="score-number">92.5</div>
        <div class="score-grade grade-a">A</div>
    </div>
    <div class="score-meaning">
        Excellent - Outstanding investment & lifestyle match
    </div>
</div>
```

**Classes:**
- `.score-display-enhanced`: Container for enhanced score display
- `.score-context`: Percentile ranking container
- `.score-percentile`: Percentile badge styling
- `.score-main`: Main score display container (flex layout)
- `.score-number`: Large score number (4rem, gradient text)
- `.score-grade`: Letter grade badge (A+, A, B+, etc.)
- `.score-meaning`: Contextual score description

**Location**: `css/ui-enhancements.css`

---

### Accordion Breakdown

**Structure:**
```html
<div class="breakdown-summary">
    <div class="tier-chip">
        <span class="tier-chip-icon">💰</span>
        <span class="tier-chip-label">Investment</span>
        <span class="tier-chip-value">28/30</span>
    </div>
    <!-- More tier chips -->
</div>

<details class="breakdown-detail">
    <summary>
        See how we calculated Investment (28/30)
        <span class="breakdown-toggle">▼</span>
    </summary>
    <div class="breakdown-content">
        <!-- Detailed metrics -->
    </div>
</details>
```

**Classes:**
- `.breakdown-summary`: Container for tier chips (flex wrap)
- `.tier-chip`: Individual tier chip with icon, label, and value
- `.tier-chip-icon`: Emoji icon (1.2rem)
- `.tier-chip-label`: Tier name
- `.tier-chip-value`: Score value (bold, primary color)
- `.breakdown-detail`: Accordion details element
- `.breakdown-toggle`: Arrow indicator (rotates when open)
- `.breakdown-content`: Expandable content area

**Location**: `css/ui-enhancements.css`

---

### Empty States

**Structure:**
```html
<div class="empty-state">
    <div class="empty-state-icon">📋</div>
    <h3>No saved properties yet</h3>
    <p>Start evaluating properties to save them for later comparison.</p>
    <a href="#calculator" class="btn-primary">Evaluate a Property</a>
</div>
```

**Classes:**
- `.empty-state`: Container (centered, padding)
- `.empty-state-icon`: Large icon (4rem, 50% opacity)
- `.empty-state h3`: Heading (1.5rem, gray-900)
- `.empty-state p`: Description (1.1rem, max-width 500px)

**Location**: `css/ui-enhancements.css`

---

### Tooltips

**Structure:**
```html
<span class="tooltip">
    (A-Score)
    <span class="tooltip-text">
        A-Score analyzes suburbs using 15 key metrics...
    </span>
</span>
```

**Classes:**
- `.tooltip`: Wrapper (relative positioning, cursor help, dotted underline)
- `.tooltip-text`: Tooltip content (absolute, dark background, white text, fade-in animation)
- `.tooltip-text::after`: Arrow pointer

**Behavior:**
- Visible on hover
- Positioned above element
- Smooth fade-in animation
- Auto-positioned with transform

**Location**: `css/ui-enhancements.css`

---

### Unlock Overlay

**Structure:**
```html
<div class="unlock-overlay">
    <div class="unlock-content">
        <div class="lock-icon">🔒</div>
        <h3>Unlock Full Analysis</h3>
        <p class="unlock-description">See detailed 38-point breakdown with:</p>
        <ul class="unlock-benefits">
            <li>✓ Exact tier weightings</li>
            <!-- More benefits -->
        </ul>
        <a href="pricing.html" class="cta-upgrade">
            Unlock Full Analysis - $19/mo
        </a>
        <p class="unlock-trial">Start with 7-day free trial</p>
    </div>
</div>
```

**Classes:**
- `.unlock-overlay`: Full overlay (absolute, backdrop blur)
- `.unlock-content`: Content container (centered, max-width 400px)
- `.lock-icon`: Large lock icon (3rem)
- `.unlock-benefits`: Benefits list (left-aligned)
- `.cta-upgrade`: Upgrade button (gradient background, hover lift)
- `.unlock-trial`: Trial text (small, gray)

**Location**: `css/ui-enhancements.css`

---

### Upgrade Prompt Modal

**Structure:**
```html
<div class="upgrade-prompt-modal">
    <div class="upgrade-prompt-content">
        <button class="upgrade-prompt-close">×</button>
        <h2>You've used 3 free searches!</h2>
        <ul class="upgrade-benefits">
            <li>✓ Unlimited suburb searches</li>
            <!-- More benefits -->
        </ul>
        <div class="upgrade-prompt-actions">
            <a href="pricing.html" class="btn-primary">Upgrade to Premium</a>
            <button class="btn-secondary">Continue with Limited Access</button>
        </div>
    </div>
</div>
```

**Classes:**
- `.upgrade-prompt-modal`: Full-screen modal overlay (fixed, fade-in animation)
- `.upgrade-prompt-content`: Modal content (white background, slide-up animation)
- `.upgrade-prompt-close`: Close button (top-right, × symbol)
- `.upgrade-benefits`: Benefits list (large text, left-aligned)
- `.upgrade-prompt-actions`: Action buttons container (flex column)

**Animations:**
- Modal: Fade-in (0.3s)
- Content: Slide-up (0.3s)
- Auto-closes after 10 seconds

**Location**: `css/ui-enhancements.css`

---

### Mobile Navigation (Hamburger Menu)

**Structure:**
```html
<button class="hamburger-menu" id="hamburger-menu" aria-label="Toggle menu">
    <span></span>
    <span></span>
    <span></span>
</button>

<ul class="nav-menu" id="nav-menu">
    <li><a href="..." class="nav-link">Link</a></li>
</ul>
```

**Classes:**
- `.hamburger-menu`: Button (hidden on desktop, 44x44px, 3 lines)
- `.hamburger-menu span`: Menu line (24px width, 3px height, transitions)
- `.hamburger-menu[aria-expanded="true"]`: Open state (lines transform to X)
- `.nav-menu`: Menu container (fixed, slide-in from left on mobile)
- `.nav-menu.active`: Open state (transform: translateX(0))

**Breakpoint**: `@media (max-width: 768px)`

**Location**: `index.html` (inline styles) and `css/modern.css`

---

### Micro-Interaction Classes

**Save Animation:**
```html
<button class="saving">Saving...</button>
<button class="saved">✓ Saved</button>
```

**Classes:**
- `.saving`: Saving state (opacity 0.6, scale 0.95)
- `.saved`: Saved state (green background, pulse animation)

**Loading State:**
```html
<div class="loading-state">
    <div class="loading-spinner"></div>
    <span class="loading-message">Loading...</span>
</div>
```

**Classes:**
- `.loading-state`: Container (flex, opacity 0.7)
- `.loading-spinner`: Spinning circle (20px, border animation)
- `.loading-message`: Loading text (gray, 0.9rem)

**Animation Classes:**
- `.pulse-animation`: Pulse effect (scale 1.05, 1s duration)
- `.shake-animation`: Shake effect (horizontal shake, 0.5s)

**Keyframes:**
- `@keyframes savedPulse`: Scale animation for saved state
- `@keyframes spin`: Rotation for loading spinner
- `@keyframes pulse`: Scale pulse animation
- `@keyframes shake`: Horizontal shake animation

**Location**: `css/ui-enhancements.css`

---

### Responsive Breakpoints

**Mobile Portrait (320px - 374px)**:
- Base font: 14px
- Single column layouts
- Full-width buttons
- Touch targets: 44x44px minimum
- Input font: 16px (prevents iOS zoom)

**Mobile Landscape / Small Tablet (375px - 767px)**:
- Base font: 15px
- Two-column grids
- Optimized spacing

**Tablet (768px - 1023px)**:
- Three-column grids
- Enhanced spacing
- Tablet-optimized navigation

**Desktop (1024px+)**:
- Full multi-column layouts
- Maximum width: 1400px
- Desktop navigation menu

**Location**: `css/modern.css` and `css/ui-enhancements.css`

---

### Utility Classes

**Display Utilities:**
- `.hidden-element`: `display: none !important`
- `.flex-column`: `flex-direction: column`
- `.flex-between`: `justify-content: space-between`
- `.flex-end`: `align-items: flex-end`

**Spacing Utilities:**
- `.gap-xs`, `.gap-sm`, `.gap-md`: Gap spacing
- `.mt-xs`, `.mt-sm`, `.mt-md`, etc.: Margin top
- `.mb-xs`, `.mb-sm`, `.mb-md`, etc.: Margin bottom
- `.p-sm`, `.p-md`, `.p-lg`: Padding
- `.px-xs`, `.px-md`: Horizontal padding
- `.py-xs`, `.py-md`: Vertical padding

**Text Utilities:**
- `.text-gradient`: Gradient text effect
- `.text-small`, `.text-xs`: Font size utilities
- `.text-gray-500`, `.text-gray-600`, etc.: Color utilities
- `.text-center`, `.text-right`: Text alignment

**Background Utilities:**
- `.bg-gray-50`, `.bg-gray-100`: Background colors
- `.bg-secondary`: Secondary background color

**Border Radius Utilities:**
- `.rounded-md`, `.rounded-lg`: Border radius utilities

**Location**: `css/ui-enhancements.css` and `css/modern.css`

---

**Last Updated:** November 17, 2025

