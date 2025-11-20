# Build Validation Script

## Purpose

Prevents common build errors by validating configuration before deployment.

## What It Checks

1. **CSS @import Order**
   - Ensures all `@import` statements are at the top of CSS files
   - Prevents Vite CSS parsing errors

2. **Vite Configuration**
   - Validates `outDir` is set correctly (`dist`, not `../dist`)
   - Ensures output directory matches Netlify expectations

3. **Netlify Configuration**
   - Validates `base`, `command`, and `publish` settings
   - Prevents double `cd react-app` errors
   - Ensures publish path matches Vite output

4. **Configuration Consistency**
   - Verifies Vite and Netlify configs are aligned
   - Prevents path mismatches

## Usage

### Automatic (Before Every Build)
The validation runs automatically before `npm run build` via the `prebuild:validate` hook.

### Manual
```bash
npm run validate
```

## Common Errors Prevented

### Error 1: CSS @import Order
**Symptom:** `@import must precede all other statements`
**Prevention:** Script checks that all @import statements are before other CSS rules

### Error 2: Output Directory Mismatch
**Symptom:** `Deploy directory does not exist`
**Prevention:** Script validates Vite outDir matches Netlify publish path

### Error 3: Double cd Error
**Symptom:** `No such file or directory: react-app/react-app`
**Prevention:** Script checks that command doesn't include `cd react-app` when base is already set

## Configuration Rules

- **CSS:** All `@import` must be at top of file (before any other rules)
- **Vite:** `outDir` must be `'dist'` (relative to react-app)
- **Netlify:** 
  - `base = "react-app"`
  - `publish = "dist"` (relative to base)
  - `command` should NOT include `cd react-app`

## Error Log

See `.build-errors.log` for history of errors and fixes (if not gitignored).

