# HomeScorePro - Detailed Implementation Guide

**Created:** 2025-11-25  
**Purpose:** Maximum-detail implementation specifications for priority improvements  
**Status:** Ready for implementation

---

## Table of Contents

1. [Fill Data Gaps](#1-fill-data-gaps)
2. [Add Loading States](#2-add-loading-states)
3. [Accessibility Audit](#3-accessibility-audit)
4. [Extract Inline Styles](#4-extract-inline-styles)
5. [Implement Autocomplete Search](#5-implement-autocomplete-search)
6. [Add Property Images](#6-add-property-images)

---

## 1. Fill Data Gaps

### Current State Analysis

**Critical Statistics from `suburbs.csv`:**
- **Total Suburbs:** 397
- **Suburbs with 0 Primary Schools:** 334 (84% missing!)
- **Suburbs with 0 Secondary Schools:** 339 (85% missing!)
- **Suburbs with walkScore of 0:** 22
- **schoolRating defaulted to 60.0:** Nearly all suburbs

**Data Structure (29 columns):**
```
suburb, postcode, lga, latitude, longitude, irsd_score, irsd_decile,
ier_score, ier_decile, ieo_score, ieo_decile, medianPrice, growth1yr,
crimeRate, schoolRating, schoolCount, primarySchools, secondarySchools,
primaryCommuteMinutes, secondaryCommuteMinutes, rentalYield, transitScore,
walkScore, parksDensity, childcareCenters, shoppingCenters, cafesRestaurants,
medicalCenters, bikeScore, category
```

### Data Sources for Missing Metrics

#### 1.1 School Data (Primary & Secondary Schools)

**Primary Source: Australian Curriculum, Assessment and Reporting Authority (ACARA)**
- Website: https://myschool.edu.au
- Data: School locations, NAPLAN results, ICSEA scores
- API: No public API, requires web scraping or data request

**Implementation Strategy:**

```python
# scripts/fill-school-data.py
import pandas as pd
import requests
from geopy.distance import geodesic

# School data structure to collect
SCHOOL_FIELDS = [
    'school_name',
    'school_type',  # Primary, Secondary, Combined
    'latitude',
    'longitude',
    'icsea_score',  # Index of Community Socio-Educational Advantage
    'naplan_avg',   # Average NAPLAN score
    'sector'        # Government, Catholic, Independent
]

def get_schools_within_radius(suburb_lat, suburb_lng, radius_km=5):
    """
    For each suburb, count schools within radius.
    Calculate weighted school rating based on:
    - ICSEA scores (40% weight)
    - NAPLAN results (40% weight)
    - School diversity - mix of govt/private (20% weight)
    """
    pass

def calculate_school_rating(schools):
    """
    schoolRating = (
        icsea_normalized * 0.4 +
        naplan_normalized * 0.4 +
        diversity_score * 0.2
    ) * 10  # Scale to 0-100
    """
    pass
```

**Fallback Data Sources:**
1. **Victorian Government Open Data:** https://discover.data.vic.gov.au
   - Dataset: "Victorian Schools Location" (free, CSV format)
   - Contains: School name, type, address, coordinates
   
2. **Better Education:** https://bettereducation.com.au
   - Has school rankings, requires scraping

3. **Manual Research Process:**
   ```
   For each suburb with missing data:
   1. Query Google Maps API: "primary schools near [suburb], VIC"
   2. Cross-reference with MySchool.edu.au
   3. Calculate average ICSEA/NAPLAN scores
   4. Store in structured format
   ```

#### 1.2 Amenity Data (childcareCenters, shoppingCenters, cafesRestaurants, medicalCenters)

**Primary Source: Google Places API**

```javascript
// scripts/fetch-amenities.js
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_KEY;

const AMENITY_TYPES = {
  childcareCenters: ['child_care', 'kindergarten'],
  shoppingCenters: ['shopping_mall', 'supermarket'],
  cafesRestaurants: ['cafe', 'restaurant', 'bar'],
  medicalCenters: ['hospital', 'doctor', 'pharmacy', 'health']
};

async function fetchAmenitiesForSuburb(suburb, lat, lng) {
  const results = {};
  
  for (const [category, types] of Object.entries(AMENITY_TYPES)) {
    let count = 0;
    
    for (const type of types) {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
        `location=${lat},${lng}&radius=2000&type=${type}&key=${GOOGLE_PLACES_API_KEY}`
      );
      const data = await response.json();
      count += data.results?.length || 0;
    }
    
    results[category] = count;
  }
  
  return results;
}
```

**Cost Estimate:**
- Google Places API: $17 per 1000 requests
- 397 suburbs × 4 amenity types = ~1,600 requests = ~$28

**Free Alternative: OpenStreetMap (Overpass API)**

```javascript
// scripts/fetch-amenities-osm.js
const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

async function fetchAmenitiesOSM(lat, lng, radiusMeters = 2000) {
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="childcare"](around:${radiusMeters},${lat},${lng});
      node["amenity"="kindergarten"](around:${radiusMeters},${lat},${lng});
      node["amenity"="school"]["isced:level"="0"](around:${radiusMeters},${lat},${lng});
      node["shop"="mall"](around:${radiusMeters},${lat},${lng});
      node["shop"="supermarket"](around:${radiusMeters},${lat},${lng});
      node["amenity"="cafe"](around:${radiusMeters},${lat},${lng});
      node["amenity"="restaurant"](around:${radiusMeters},${lat},${lng});
      node["amenity"="hospital"](around:${radiusMeters},${lat},${lng});
      node["amenity"="doctors"](around:${radiusMeters},${lat},${lng});
      node["amenity"="pharmacy"](around:${radiusMeters},${lat},${lng});
    );
    out count;
  `;
  
  const response = await fetch(OVERPASS_URL, {
    method: 'POST',
    body: `data=${encodeURIComponent(query)}`
  });
  
  return response.json();
}
```

#### 1.3 Walk Score & Transit Score

**Official Source: Walk Score API**
- Website: https://www.walkscore.com/professional/api.php
- Free tier: 5,000 calls/day
- Returns: walkscore, transit_score, bike_score

```javascript
// scripts/fetch-walkscores.js
const WALKSCORE_API_KEY = process.env.WALKSCORE_KEY;

async function getWalkScore(lat, lng, address) {
  const response = await fetch(
    `https://api.walkscore.com/score?` +
    `format=json&` +
    `lat=${lat}&lon=${lng}&` +
    `transit=1&bike=1&` +
    `wsapikey=${WALKSCORE_API_KEY}`
  );
  
  const data = await response.json();
  
  return {
    walkScore: data.walkscore,
    transitScore: data.transit?.score || 0,
    bikeScore: data.bike?.score || 0
  };
}
```

#### 1.4 Commute Times

**Source: Google Distance Matrix API**

```javascript
// scripts/fetch-commute-times.js
async function getCommuteTimes(originLat, originLng) {
  const CBD_COORDS = '-37.8136,144.9631'; // Melbourne CBD
  
  // Get transit commute time
  const transitResponse = await fetch(
    `https://maps.googleapis.com/maps/api/distancematrix/json?` +
    `origins=${originLat},${originLng}&` +
    `destinations=${CBD_COORDS}&` +
    `mode=transit&` +
    `departure_time=now&` +
    `key=${GOOGLE_MAPS_KEY}`
  );
  
  const transitData = await transitResponse.json();
  const transitMinutes = Math.round(
    transitData.rows[0].elements[0].duration.value / 60
  );
  
  // Get driving commute time
  const drivingResponse = await fetch(
    `https://maps.googleapis.com/maps/api/distancematrix/json?` +
    `origins=${originLat},${originLng}&` +
    `destinations=${CBD_COORDS}&` +
    `mode=driving&` +
    `departure_time=now&` +
    `key=${GOOGLE_MAPS_KEY}`
  );
  
  const drivingData = await drivingResponse.json();
  const drivingMinutes = Math.round(
    drivingData.rows[0].elements[0].duration_in_traffic.value / 60
  );
  
  return {
    primaryCommuteMinutes: transitMinutes,
    secondaryCommuteMinutes: drivingMinutes
  };
}
```

### Complete Data Fill Script

```javascript
// scripts/fill-all-data-gaps.js
const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

async function fillDataGaps() {
  const suburbs = [];
  
  // Read existing data
  await new Promise((resolve) => {
    fs.createReadStream('public/data/suburbs.csv')
      .pipe(csv())
      .on('data', (row) => suburbs.push(row))
      .on('end', resolve);
  });
  
  console.log(`Processing ${suburbs.length} suburbs...`);
  
  for (let i = 0; i < suburbs.length; i++) {
    const suburb = suburbs[i];
    
    // Skip if already has complete data
    if (hasCompleteData(suburb)) continue;
    
    console.log(`[${i+1}/${suburbs.length}] Processing ${suburb.suburb}...`);
    
    const lat = parseFloat(suburb.latitude);
    const lng = parseFloat(suburb.longitude);
    
    // Fill missing school data
    if (parseInt(suburb.primarySchools) === 0) {
      const schoolData = await fetchSchoolData(lat, lng);
      Object.assign(suburb, schoolData);
    }
    
    // Fill missing walkscores
    if (parseInt(suburb.walkScore) === 0) {
      const scores = await getWalkScore(lat, lng, suburb.suburb);
      suburb.walkScore = scores.walkScore;
      suburb.transitScore = scores.transitScore;
      suburb.bikeScore = scores.bikeScore;
    }
    
    // Fill missing amenity counts
    if (needsAmenityData(suburb)) {
      const amenities = await fetchAmenitiesForSuburb(suburb.suburb, lat, lng);
      Object.assign(suburb, amenities);
    }
    
    // Fill missing commute times
    if (parseInt(suburb.primaryCommuteMinutes) === 0) {
      const commute = await getCommuteTimes(lat, lng);
      suburb.primaryCommuteMinutes = commute.primaryCommuteMinutes;
      suburb.secondaryCommuteMinutes = commute.secondaryCommuteMinutes;
    }
    
    // Rate limit: 100ms between requests
    await sleep(100);
  }
  
  // Write updated CSV
  const csvWriter = createCsvWriter({
    path: 'public/data/suburbs-complete.csv',
    header: Object.keys(suburbs[0]).map(key => ({ id: key, title: key }))
  });
  
  await csvWriter.writeRecords(suburbs);
  console.log('✅ Data gaps filled successfully!');
}

function hasCompleteData(suburb) {
  return (
    parseInt(suburb.primarySchools) > 0 &&
    parseInt(suburb.walkScore) > 0 &&
    parseInt(suburb.primaryCommuteMinutes) > 0
  );
}

function needsAmenityData(suburb) {
  // Check if amenity data looks like defaults
  return (
    suburb.childcareCenters === '3' &&
    suburb.shoppingCenters === '2' &&
    suburb.cafesRestaurants === '10'
  );
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

fillDataGaps();
```

### Data Validation Script

```javascript
// scripts/validate-suburb-data.js
const fs = require('fs');
const csv = require('csv-parser');

async function validateData() {
  const suburbs = [];
  const issues = [];
  
  await new Promise((resolve) => {
    fs.createReadStream('public/data/suburbs.csv')
      .pipe(csv())
      .on('data', (row) => suburbs.push(row))
      .on('end', resolve);
  });
  
  for (const suburb of suburbs) {
    const suburbIssues = [];
    
    // Validate school data
    if (parseInt(suburb.primarySchools) === 0) {
      suburbIssues.push('Missing primary school count');
    }
    if (parseInt(suburb.secondarySchools) === 0) {
      suburbIssues.push('Missing secondary school count');
    }
    if (parseFloat(suburb.schoolRating) === 60.0) {
      suburbIssues.push('Default school rating (60.0)');
    }
    
    // Validate location scores
    if (parseInt(suburb.walkScore) === 0) {
      suburbIssues.push('Missing walk score');
    }
    if (parseInt(suburb.transitScore) === 0) {
      suburbIssues.push('Missing transit score');
    }
    
    // Validate commute times
    if (parseInt(suburb.primaryCommuteMinutes) === 0) {
      suburbIssues.push('Missing primary commute time');
    }
    
    // Validate price data
    if (parseInt(suburb.medianPrice) === 0) {
      suburbIssues.push('Missing median price');
    }
    
    if (suburbIssues.length > 0) {
      issues.push({
        suburb: suburb.suburb,
        postcode: suburb.postcode,
        issues: suburbIssues
      });
    }
  }
  
  // Generate report
  console.log('\n📊 DATA VALIDATION REPORT\n');
  console.log(`Total suburbs: ${suburbs.length}`);
  console.log(`Suburbs with issues: ${issues.length}`);
  console.log(`Complete suburbs: ${suburbs.length - issues.length}\n`);
  
  // Categorize issues
  const issueCounts = {};
  for (const item of issues) {
    for (const issue of item.issues) {
      issueCounts[issue] = (issueCounts[issue] || 0) + 1;
    }
  }
  
  console.log('Issue breakdown:');
  for (const [issue, count] of Object.entries(issueCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${issue}: ${count} suburbs (${((count/suburbs.length)*100).toFixed(1)}%)`);
  }
  
  // Write detailed report
  fs.writeFileSync(
    'public/data/validation-report.json',
    JSON.stringify({ summary: issueCounts, details: issues }, null, 2)
  );
  
  console.log('\n✅ Detailed report written to validation-report.json');
}

validateData();
```

### Required Environment Variables

```bash
# .env.local
GOOGLE_PLACES_KEY=your_google_places_api_key
GOOGLE_MAPS_KEY=your_google_maps_api_key
WALKSCORE_KEY=your_walkscore_api_key
```

### Estimated Costs & Timeline

| Data Type | Source | Cost | Time |
|-----------|--------|------|------|
| School Data | ACARA/Manual | Free (manual) | 2-3 days |
| Amenities | Google Places | ~$30 | 1 hour |
| Walk/Transit/Bike Scores | Walk Score API | Free (5k/day) | 2 hours |
| Commute Times | Google Distance Matrix | ~$10 | 1 hour |

**Total Estimated Cost:** $40-50  
**Total Estimated Time:** 3-4 days (mostly school data research)

---

## 2. Add Loading States

### Current Problems

1. **No visual feedback** during auth check in `ProtectedRoute.jsx`
2. **No skeleton loaders** during data fetches
3. **Abrupt content appearance** feels jarring

### Skeleton Components to Create

#### 2.1 Base Skeleton Component

```jsx
// src/components/Skeleton.jsx
import { motion } from 'framer-motion'
import './Skeleton.css'

/**
 * Base skeleton component with shimmer animation
 */
export function Skeleton({ 
  width = '100%', 
  height = '1rem', 
  variant = 'text',
  className = '',
  style = {}
}) {
  const baseClasses = `skeleton skeleton--${variant} ${className}`
  
  return (
    <motion.div
      className={baseClasses}
      style={{ width, height, ...style }}
      initial={{ opacity: 0.5 }}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      aria-hidden="true"
      role="presentation"
    />
  )
}

/**
 * Skeleton text with multiple lines
 */
export function SkeletonText({ lines = 3, lastLineWidth = '60%' }) {
  return (
    <div className="skeleton-text">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i}
          variant="text"
          width={i === lines - 1 ? lastLineWidth : '100%'}
          height="1rem"
          style={{ marginBottom: i < lines - 1 ? '0.5rem' : 0 }}
        />
      ))}
    </div>
  )
}

/**
 * Circular skeleton for avatars/icons
 */
export function SkeletonCircle({ size = 48 }) {
  return (
    <Skeleton
      variant="circular"
      width={size}
      height={size}
    />
  )
}
```

#### 2.2 Skeleton CSS

```css
/* src/components/Skeleton.css */

.skeleton {
  background: linear-gradient(
    90deg,
    var(--dark-700) 0%,
    var(--dark-600) 50%,
    var(--dark-700) 100%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s ease-in-out infinite;
  border-radius: var(--radius-sm);
}

.skeleton--text {
  border-radius: var(--radius-sm);
}

.skeleton--circular {
  border-radius: 50%;
}

.skeleton--rectangular {
  border-radius: var(--radius-md);
}

.skeleton--card {
  border-radius: var(--radius-xl);
}

@keyframes skeleton-shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Skeleton Card Layout */
.skeleton-card {
  background: var(--bg-secondary);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  overflow: hidden;
}

.skeleton-card__header {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

.skeleton-card__body {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

/* Score Display Skeleton */
.skeleton-score {
  text-align: center;
  padding: var(--space-10);
}

.skeleton-score__value {
  margin: var(--space-6) auto;
}

.skeleton-score__rating {
  margin: var(--space-4) auto;
}

/* Property Card Skeleton */
.skeleton-property-card {
  background: var(--bg-tertiary);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-xl);
  overflow: hidden;
}

.skeleton-property-card__image {
  width: 100%;
  height: 200px;
}

.skeleton-property-card__content {
  padding: var(--space-6);
}

.skeleton-property-card__stats {
  display: flex;
  justify-content: space-between;
  margin-top: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid var(--dark-600);
}
```

#### 2.3 Specific Skeleton Components

```jsx
// src/components/skeletons/ScoreDisplaySkeleton.jsx
import { Skeleton, SkeletonCircle } from '../Skeleton'

export function ScoreDisplaySkeleton() {
  return (
    <div className="skeleton-score">
      {/* Label */}
      <Skeleton width="60%" height="0.875rem" style={{ margin: '0 auto' }} />
      
      {/* Large score number */}
      <Skeleton 
        width="150px" 
        height="6rem" 
        variant="rectangular"
        className="skeleton-score__value"
      />
      
      {/* Rating badge */}
      <Skeleton 
        width="200px" 
        height="3rem" 
        variant="rectangular"
        className="skeleton-score__rating"
        style={{ borderRadius: 'var(--radius-full)' }}
      />
      
      {/* Percentile text */}
      <Skeleton width="40%" height="0.8rem" style={{ margin: 'var(--space-4) auto 0' }} />
      
      {/* Description */}
      <div style={{ marginTop: 'var(--space-6)', paddingTop: 'var(--space-6)', borderTop: '1px solid var(--glass-border)' }}>
        <Skeleton width="100%" height="0.875rem" />
        <Skeleton width="80%" height="0.875rem" style={{ marginTop: 'var(--space-2)' }} />
      </div>
    </div>
  )
}

// src/components/skeletons/BreakdownSkeleton.jsx
import { Skeleton } from '../Skeleton'

export function BreakdownSkeleton({ items = 7 }) {
  return (
    <div className="breakdown-skeleton">
      <Skeleton width="40%" height="1.25rem" style={{ marginBottom: 'var(--space-6)' }} />
      
      {Array.from({ length: items }).map((_, i) => (
        <div 
          key={i}
          className="breakdown-item"
          style={{ 
            background: 'var(--bg-tertiary)',
            padding: 'var(--space-5)',
            marginBottom: 'var(--space-4)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--dark-600)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <Skeleton width="1.25rem" height="1.25rem" variant="circular" />
              <Skeleton width="120px" height="1rem" />
            </div>
            <Skeleton width="40px" height="1.25rem" />
          </div>
          <Skeleton width="100%" height="6px" style={{ borderRadius: 'var(--radius-full)' }} />
        </div>
      ))}
    </div>
  )
}

// src/components/skeletons/PropertyCardSkeleton.jsx
import { Skeleton, SkeletonText } from '../Skeleton'

export function PropertyCardSkeleton() {
  return (
    <div className="skeleton-property-card">
      {/* Image placeholder */}
      <Skeleton 
        width="100%" 
        height="200px" 
        variant="rectangular"
        className="skeleton-property-card__image"
        style={{ borderRadius: 0 }}
      />
      
      {/* Content */}
      <div className="skeleton-property-card__content">
        {/* Location */}
        <Skeleton width="40%" height="0.875rem" />
        
        {/* Address */}
        <Skeleton width="70%" height="1.125rem" style={{ marginTop: 'var(--space-2)' }} />
        
        {/* Stats */}
        <div className="skeleton-property-card__stats">
          <div style={{ textAlign: 'center' }}>
            <Skeleton width="50px" height="0.75rem" style={{ margin: '0 auto' }} />
            <Skeleton width="40px" height="1.25rem" style={{ margin: 'var(--space-1) auto 0' }} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <Skeleton width="50px" height="0.75rem" style={{ margin: '0 auto' }} />
            <Skeleton width="40px" height="1.25rem" style={{ margin: 'var(--space-1) auto 0' }} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <Skeleton width="40px" height="0.75rem" style={{ margin: '0 auto' }} />
            <Skeleton width="50px" height="1.25rem" style={{ margin: 'var(--space-1) auto 0' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

// src/components/skeletons/CalculatorCardSkeleton.jsx
import { Skeleton, SkeletonCircle } from '../Skeleton'

export function CalculatorCardSkeleton() {
  return (
    <div className="skeleton-card">
      {/* Header */}
      <div className="skeleton-card__header">
        <Skeleton width="56px" height="56px" variant="rectangular" style={{ borderRadius: 'var(--radius-xl)' }} />
        <div style={{ flex: 1 }}>
          <Skeleton width="60%" height="1.5rem" />
          <Skeleton width="40%" height="0.875rem" style={{ marginTop: 'var(--space-2)' }} />
        </div>
      </div>
      
      {/* Form group */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <Skeleton width="30%" height="0.875rem" style={{ marginBottom: 'var(--space-3)' }} />
        <Skeleton width="100%" height="52px" variant="rectangular" style={{ borderRadius: 'var(--radius-lg)' }} />
        <Skeleton width="80%" height="0.8rem" style={{ marginTop: 'var(--space-2)' }} />
      </div>
      
      {/* Button */}
      <Skeleton width="100%" height="48px" variant="rectangular" style={{ borderRadius: 'var(--radius-lg)' }} />
    </div>
  )
}
```

#### 2.4 Updated ProtectedRoute with Loading State

```jsx
// src/components/ProtectedRoute.jsx
import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Login from './Login';

function LoadingScreen() {
  return (
    <div 
      style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 'var(--space-6)',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
      }}
    >
      {/* Animated logo */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          fontSize: '2rem',
          fontWeight: 800,
          background: 'linear-gradient(135deg, var(--orange-light), var(--orange-primary))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}
      >
        HomeScorePro
      </motion.div>
      
      {/* Loading spinner */}
      <motion.div
        style={{
          width: '48px',
          height: '48px',
          border: '3px solid var(--dark-600)',
          borderTopColor: 'var(--orange-primary)',
          borderRadius: '50%'
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      
      {/* Loading text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        style={{
          color: 'var(--text-secondary)',
          fontSize: '0.9375rem'
        }}
      >
        Verifying authentication...
      </motion.p>
    </div>
  );
}

export function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/status', {
        credentials: 'include'
      });
      const data = await response.json();
      setIsAuthenticated(data.authenticated);
    } catch (err) {
      setIsAuthenticated(false);
    } finally {
      // Add minimum loading time for smoother UX
      setTimeout(() => setLoading(false), 500);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
```

#### 2.5 Calculator with Loading States

```jsx
// Add these states to Calculator.jsx
const [isCalculating, setIsCalculating] = useState(false);

// Update handleCalculateAScore
const handleCalculateAScore = async () => {
  if (!suburb) return;
  
  setIsCalculating(true);
  setShowAscoreDisplay(false);
  
  // Simulate async operation (replace with actual API call later)
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const result = calculateAScore(suburb);
  if (result) {
    setAscoreResult(result);
    setShowAscoreDisplay(true);
    setShowAscoreBreakdown(false);
    setShowAscoreInsights(false);
    
    if (ascoreValueRef.current) {
      animateCountUp(ascoreValueRef.current, result.score, 1500);
    }
    
    setTimeout(() => {
      setShowAscoreBreakdown(true);
      setTimeout(() => setShowAscoreInsights(true), 200);
    }, 1500);
  }
  
  setIsCalculating(false);
};

// In the JSX, show skeleton during calculation:
{isCalculating && (
  <>
    <ScoreDisplaySkeleton />
    <BreakdownSkeleton items={7} />
  </>
)}

{!isCalculating && showAscoreDisplay && ascoreResult && (
  // ... existing score display
)}
```

#### 2.6 Async Data Loading Pattern

```jsx
// src/hooks/useAsyncData.js
import { useState, useEffect, useCallback } from 'react';

export function useAsyncData(fetchFn, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    execute();
  }, dependencies);

  return { data, loading, error, refetch: execute };
}

// Usage example:
function SuburbsList() {
  const { data: suburbs, loading, error } = useAsyncData(
    () => fetch('/data/suburbs.csv').then(res => res.text()),
    []
  );
  
  if (loading) {
    return <SuburbsListSkeleton />;
  }
  
  if (error) {
    return <ErrorState message={error} />;
  }
  
  return <SuburbsListContent suburbs={suburbs} />;
}
```

---

## 3. Accessibility Audit

### Current Issues Identified

#### 3.1 Missing ARIA Attributes

**Problem Areas:**
1. Tooltip icons lack proper accessibility
2. Score displays don't announce to screen readers
3. Mobile menu lacks focus management
4. Form inputs missing labels in some places

**Fixes Required:**

```jsx
// BEFORE (Current tooltip in Calculator.jsx)
<span className="tooltip-icon" title="A-Score evaluates...">?</span>

// AFTER (Accessible tooltip)
<button
  type="button"
  className="tooltip-trigger"
  aria-label="What is A-Score?"
  aria-describedby="ascore-tooltip"
  aria-expanded={tooltipOpen}
  onClick={() => setTooltipOpen(!tooltipOpen)}
  onKeyDown={(e) => {
    if (e.key === 'Escape') setTooltipOpen(false);
  }}
>
  <span aria-hidden="true">?</span>
</button>
<div
  id="ascore-tooltip"
  role="tooltip"
  className={`tooltip-content ${tooltipOpen ? 'visible' : ''}`}
  aria-hidden={!tooltipOpen}
>
  A-Score evaluates the suburb itself across 15 key metrics including
  location quality, amenities, safety, schools, and growth potential.
</div>
```

#### 3.2 Accessible Tooltip Component

```jsx
// src/components/AccessibleTooltip.jsx
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './AccessibleTooltip.css';

export function AccessibleTooltip({ 
  id, 
  label, 
  content,
  position = 'top'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);
  
  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        triggerRef.current && 
        !triggerRef.current.contains(event.target) &&
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Handle escape key
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);
  
  return (
    <span className="tooltip-wrapper">
      <button
        ref={triggerRef}
        type="button"
        className="tooltip-trigger"
        aria-label={label}
        aria-describedby={isOpen ? id : undefined}
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
      >
        <span aria-hidden="true">?</span>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={tooltipRef}
            id={id}
            role="tooltip"
            className={`tooltip-content tooltip-content--${position}`}
            initial={{ opacity: 0, y: position === 'top' ? 8 : -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: position === 'top' ? 8 : -8 }}
            transition={{ duration: 0.15 }}
          >
            {content}
            <span className="tooltip-arrow" aria-hidden="true" />
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}
```

```css
/* src/components/AccessibleTooltip.css */

.tooltip-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.tooltip-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  margin-left: var(--space-2);
  background: var(--orange-subtle);
  border: 1px solid var(--orange-primary);
  border-radius: 50%;
  color: var(--orange-light);
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.tooltip-trigger:hover,
.tooltip-trigger:focus {
  background: var(--orange-primary);
  color: var(--dark-900);
  outline: none;
  box-shadow: 0 0 0 3px var(--orange-subtle);
}

.tooltip-content {
  position: absolute;
  z-index: 1000;
  padding: var(--space-3) var(--space-4);
  background: var(--bg-elevated);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  font-size: 0.875rem;
  font-weight: 400;
  color: var(--text-secondary);
  line-height: 1.5;
  white-space: normal;
  max-width: 280px;
  text-align: left;
}

.tooltip-content--top {
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
}

.tooltip-content--bottom {
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
}

.tooltip-arrow {
  position: absolute;
  width: 8px;
  height: 8px;
  background: var(--bg-elevated);
  border-right: 1px solid var(--glass-border);
  border-bottom: 1px solid var(--glass-border);
}

.tooltip-content--top .tooltip-arrow {
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
}

.tooltip-content--bottom .tooltip-arrow {
  top: -5px;
  left: 50%;
  transform: translateX(-50%) rotate(-135deg);
}
```

#### 3.3 Keyboard Navigation for Mobile Menu

```jsx
// src/components/Navigation.jsx - Updated for accessibility
import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const firstLinkRef = useRef(null);
  const lastLinkRef = useRef(null);
  const menuButtonRef = useRef(null);
  const location = useLocation();
  
  // Close menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);
  
  // Focus management
  useEffect(() => {
    if (isMobileMenuOpen && firstLinkRef.current) {
      firstLinkRef.current.focus();
    }
  }, [isMobileMenuOpen]);
  
  // Handle escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);
  
  // Trap focus within menu
  const handleKeyDown = (e) => {
    if (!isMobileMenuOpen) return;
    
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstLinkRef.current) {
        e.preventDefault();
        lastLinkRef.current?.focus();
      } else if (!e.shiftKey && document.activeElement === lastLinkRef.current) {
        e.preventDefault();
        firstLinkRef.current?.focus();
      }
    }
  };
  
  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/calculator', label: 'Calculator' },
    { to: '/members', label: 'Members' },
    { to: '/about', label: 'About' },
    { to: '/pricing', label: 'Pricing' }
  ];
  
  return (
    <nav className="nav" role="navigation" aria-label="Main navigation">
      <div className="nav-container">
        <Link to="/" className="nav-logo" aria-label="HomeScorePro - Go to homepage">
          HomeScorePro
        </Link>
        
        {/* Desktop Navigation */}
        <ul className="nav-links" role="menubar">
          {navLinks.map((link) => (
            <li key={link.to} role="none">
              <Link
                to={link.to}
                className="nav-link"
                role="menuitem"
                aria-current={location.pathname === link.to ? 'page' : undefined}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        
        <Link to="/login" className="nav-cta">
          Sign In
        </Link>
        
        {/* Mobile Menu Button */}
        <button
          ref={menuButtonRef}
          className="nav-mobile-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </span>
        </button>
        
        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                className="nav-mobile-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                aria-hidden="true"
              />
              
              {/* Menu */}
              <motion.div
                ref={menuRef}
                id="mobile-menu"
                className="nav-mobile-menu"
                role="menu"
                aria-label="Mobile navigation"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
                onKeyDown={handleKeyDown}
              >
                <ul className="nav-mobile-links" role="menubar" aria-orientation="vertical">
                  {navLinks.map((link, index) => (
                    <li key={link.to} role="none">
                      <Link
                        ref={
                          index === 0 ? firstLinkRef : 
                          index === navLinks.length - 1 ? lastLinkRef : 
                          null
                        }
                        to={link.to}
                        className="nav-mobile-link"
                        role="menuitem"
                        aria-current={location.pathname === link.to ? 'page' : undefined}
                        onClick={() => setIsMobileMenuOpen(false)}
                        tabIndex={isMobileMenuOpen ? 0 : -1}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                
                <Link
                  to="/login"
                  className="btn btn-primary"
                  style={{ marginTop: 'var(--space-6)', width: '100%' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  tabIndex={isMobileMenuOpen ? 0 : -1}
                >
                  Sign In
                </Link>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

export default Navigation;
```

#### 3.4 Color Contrast Issues

**Current Issues:**
- `--text-tertiary` (#808080) on `--bg-primary` (#121212): Ratio ~4.0:1 (FAIL AA for body text)
- `--text-disabled` (#555555) on `--bg-primary`: Ratio ~2.5:1 (FAIL)

**Recommended Fixes:**

```css
/* Updated color variables for WCAG AA compliance */
:root {
  /* Text colors - Updated for contrast */
  --text-tertiary: #9ca3af;        /* Was #808080, now 5.0:1 ratio */
  --text-disabled: #71717a;        /* Was #555555, now 4.5:1 ratio */
  
  /* Alternative: Use opacity on white for more flexibility */
  --text-tertiary-alt: rgba(255, 255, 255, 0.65);  /* ~5.2:1 ratio */
  --text-disabled-alt: rgba(255, 255, 255, 0.45);  /* ~4.5:1 ratio */
}
```

**Contrast Checking Tool:**

```javascript
// src/utils/contrastChecker.js
export function getContrastRatio(foreground, background) {
  const getLuminance = (hex) => {
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = rgb & 0xff;
    
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };
  
  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

export function checkWCAG(foreground, background) {
  const ratio = getContrastRatio(foreground, background);
  
  return {
    ratio: ratio.toFixed(2),
    AA_normal: ratio >= 4.5,      // Normal text (< 18pt)
    AA_large: ratio >= 3.0,       // Large text (>= 18pt or 14pt bold)
    AAA_normal: ratio >= 7.0,     // Enhanced
    AAA_large: ratio >= 4.5
  };
}

// Usage:
// checkWCAG('#9ca3af', '#121212')
// => { ratio: '5.00', AA_normal: true, AA_large: true, ... }
```

#### 3.5 Screen Reader Announcements for Score Results

```jsx
// src/components/ScoreAnnouncement.jsx
import { useEffect, useRef } from 'react';

/**
 * Announces score results to screen readers
 */
export function ScoreAnnouncement({ score, type, suburb }) {
  const announcementRef = useRef(null);
  
  useEffect(() => {
    if (score && announcementRef.current) {
      // Trigger announcement
      announcementRef.current.textContent = '';
      requestAnimationFrame(() => {
        announcementRef.current.textContent = 
          `${type === 'ascore' ? 'A-Score' : 'B-Score'} calculated. ` +
          `${suburb ? `${suburb} scored` : 'Score:'} ${score} out of 100. ` +
          `Rating: ${getRatingDescription(score)}.`;
      });
    }
  }, [score, type, suburb]);
  
  return (
    <div
      ref={announcementRef}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    />
  );
}

function getRatingDescription(score) {
  if (score >= 90) return 'Excellent, A grade';
  if (score >= 80) return 'Very good, B plus grade';
  if (score >= 70) return 'Good, B grade';
  if (score >= 60) return 'Average, C grade';
  return 'Below average';
}

// Add to CSS:
// .sr-only {
//   position: absolute;
//   width: 1px;
//   height: 1px;
//   padding: 0;
//   margin: -1px;
//   overflow: hidden;
//   clip: rect(0, 0, 0, 0);
//   white-space: nowrap;
//   border: 0;
// }
```

#### 3.6 Form Accessibility Improvements

```jsx
// Update form inputs to include proper labels and error handling

// BEFORE
<select
  className="form-select"
  value={suburb}
  onChange={handleSuburbChange}
>

// AFTER
<div className="form-group">
  <label 
    htmlFor="suburb-select"
    className="form-label"
  >
    <span className="form-label-icon" aria-hidden="true">🗺️</span>
    Suburb Name
    <span className="sr-only"> (required)</span>
  </label>
  <select
    id="suburb-select"
    className="form-select"
    value={suburb}
    onChange={handleSuburbChange}
    aria-describedby="suburb-hint"
    aria-required="true"
    aria-invalid={!suburb && submitted ? 'true' : undefined}
  >
    <option value="">Select a suburb...</option>
    {/* options */}
  </select>
  <p id="suburb-hint" className="form-hint">
    This is a limited subset of suburbs provided as a demonstration.
  </p>
  {!suburb && submitted && (
    <p 
      id="suburb-error" 
      className="form-error"
      role="alert"
    >
      Please select a suburb
    </p>
  )}
</div>
```

#### 3.7 Skip Link for Keyboard Users

```jsx
// Add to Layout.jsx or App.jsx
<a 
  href="#main-content" 
  className="skip-link"
>
  Skip to main content
</a>

// In the main content area:
<main id="main-content" tabIndex="-1">
  {/* Page content */}
</main>
```

```css
/* Skip link styles */
.skip-link {
  position: absolute;
  top: -100%;
  left: 50%;
  transform: translateX(-50%);
  padding: var(--space-3) var(--space-6);
  background: var(--orange-primary);
  color: var(--dark-900);
  font-weight: 700;
  border-radius: var(--radius-md);
  z-index: 9999;
  transition: top 0.2s;
}

.skip-link:focus {
  top: var(--space-4);
  outline: 3px solid var(--orange-light);
  outline-offset: 2px;
}
```

#### 3.8 Complete Accessibility Checklist

```markdown
## WCAG 2.1 AA Compliance Checklist

### Perceivable
- [ ] All images have alt text
- [ ] Color contrast ratio ≥ 4.5:1 for normal text
- [ ] Color contrast ratio ≥ 3:1 for large text
- [ ] Information not conveyed by color alone
- [ ] Text can be resized up to 200% without loss of content

### Operable
- [ ] All functionality available via keyboard
- [ ] Focus indicator visible on all interactive elements
- [ ] Skip navigation link provided
- [ ] Page titles are descriptive and unique
- [ ] Focus order is logical
- [ ] No keyboard traps

### Understandable
- [ ] Language of page is specified (<html lang="en">)
- [ ] Form inputs have labels
- [ ] Error messages are descriptive
- [ ] Instructions don't rely solely on sensory characteristics

### Robust
- [ ] Valid HTML
- [ ] ARIA attributes used correctly
- [ ] Compatible with assistive technologies
```

---

## 4. Extract Inline Styles

### Current Problem

`Calculator.jsx` contains **97+ inline style declarations** making the code:
- Hard to maintain
- Impossible to override with CSS
- Inconsistent with the design system
- Larger bundle size

### Style Extraction Plan

#### 4.1 Create Calculator-Specific CSS File

```css
/* src/styles/calculator.css */

/* =================================================
   SCORE EXPLANATION BOX
   ================================================= */

.score-explanation-box {
  background: var(--orange-subtle);
  border: 2px solid var(--orange-glow);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  margin-top: var(--space-8);
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.score-explanation-box__title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--orange-light);
  margin-bottom: var(--space-4);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.score-explanation-box__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-6);
  margin-top: var(--space-4);
}

@media (max-width: 768px) {
  .score-explanation-box__grid {
    grid-template-columns: 1fr;
  }
}

.score-explanation-box__footer {
  margin-top: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid var(--glass-border);
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

/* =================================================
   SCORE TYPE CARDS
   ================================================= */

.score-type-card {
  background: var(--bg-secondary);
  padding: var(--space-5);
  border-radius: var(--radius-lg);
  border: 1px solid var(--glass-border);
}

.score-type-card__icon {
  font-size: 2rem;
  margin-bottom: var(--space-2);
}

.score-type-card__title {
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-2);
  font-size: 1.125rem;
}

.score-type-card__description {
  color: var(--text-secondary);
  font-size: 0.9375rem;
  line-height: 1.6;
  margin-bottom: var(--space-3);
}

.score-type-card__tagline {
  font-size: 0.875rem;
  color: var(--text-tertiary);
  font-style: italic;
}

/* =================================================
   EMPTY STATE (Calculator-specific)
   ================================================= */

.calculator-empty-state {
  text-align: center;
  padding: var(--space-12) var(--space-6);
  color: var(--text-secondary);
}

.calculator-empty-state__icon {
  font-size: 4rem;
  margin-bottom: var(--space-4);
  opacity: 0.5;
}

.calculator-empty-state__title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-3);
}

.calculator-empty-state__description {
  font-size: 1rem;
  color: var(--text-secondary);
  margin-bottom: var(--space-6);
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.calculator-empty-state__cta {
  margin-top: var(--space-4);
}

/* =================================================
   TOOLTIP ICON (Inline replacement)
   ================================================= */

.score-tooltip-icon {
  display: inline-block;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--orange-subtle);
  color: var(--orange-primary);
  font-size: 0.75rem;
  text-align: center;
  line-height: 18px;
  margin-left: var(--space-2);
  cursor: help;
  font-weight: 700;
}

/* =================================================
   FORM HINT BOX (Warning style)
   ================================================= */

.form-hint-warning {
  margin-top: var(--space-4);
  padding: var(--space-4);
  background: var(--warning-dim);
  border: 1px solid var(--warning);
  border-radius: var(--radius-md);
}

.form-hint-warning strong {
  color: var(--warning);
}

/* =================================================
   SECTION SPACING
   ================================================= */

.calculator-section--no-padding-top {
  padding-top: 0;
}

.section-title--small {
  margin-bottom: var(--space-8);
  font-size: 2rem;
}

/* =================================================
   PROPERTY IMAGE PLACEHOLDER
   ================================================= */

.property-image-placeholder {
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, var(--dark-700) 0%, var(--dark-600) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  border-bottom: 1px solid var(--glass-border);
}

/* =================================================
   BUTTON FULL WIDTH MODIFIER
   ================================================= */

.btn--full-width {
  width: 100%;
}

.btn--margin-top {
  margin-top: var(--space-6);
}

.btn--margin-top-sm {
  margin-top: var(--space-4);
}
```

#### 4.2 Refactored Calculator.jsx (Key Sections)

```jsx
// BEFORE (Lines 301-397 in current file)
<div className="score-explanation-box" style={{
  background: 'var(--orange-subtle)',
  border: '2px solid var(--orange-glow)',
  borderRadius: 'var(--radius-xl)',
  padding: 'var(--space-6)',
  marginTop: 'var(--space-8)',
  maxWidth: '800px',
  marginLeft: 'auto',
  marginRight: 'auto'
}}>

// AFTER
<div className="score-explanation-box">

// BEFORE (Lines 311-320)
<h3 style={{
  fontSize: '1.25rem',
  fontWeight: 700,
  color: 'var(--orange-light)',
  marginBottom: 'var(--space-4)',
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-2)'
}}>

// AFTER
<h3 className="score-explanation-box__title">

// BEFORE (Lines 321-327)
<div style={{
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 'var(--space-6)',
  marginTop: 'var(--space-4)'
}}>

// AFTER
<div className="score-explanation-box__grid">

// BEFORE (Lines 328-357)
<div className="score-type-card" style={{
  background: 'var(--bg-secondary)',
  padding: 'var(--space-5)',
  borderRadius: 'var(--radius-lg)',
  border: '1px solid var(--glass-border)'
}}>
  <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>📍</div>
  <h4 style={{
    fontWeight: 700,
    color: 'var(--text-primary)',
    marginBottom: 'var(--space-2)',
    fontSize: '1.125rem'
  }}>A-Score: Suburb Quality</h4>
  ...

// AFTER
<div className="score-type-card">
  <div className="score-type-card__icon">📍</div>
  <h4 className="score-type-card__title">A-Score: Suburb Quality</h4>
  <p className="score-type-card__description">
    Evaluates the suburb itself across 15 key metrics including 
    location quality, amenities, safety, schools, and growth potential.
  </p>
  <div className="score-type-card__tagline">
    "How good is this suburb?"
  </div>
</div>

// BEFORE (Button with inline styles)
<button className="btn btn-primary" style={{ width: '100%' }} onClick={handleCalculateAScore}>

// AFTER
<button className="btn btn-primary btn--full-width" onClick={handleCalculateAScore}>
```

#### 4.3 Import the New CSS

```jsx
// src/pages/Calculator.jsx (top of file)
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { calculateAScore, calculateBScore, propertyProfiles, getScoreRating, animateCountUp } from '../utils/calculator'
import '../styles/calculator.css'  // <-- Add this import
```

#### 4.4 Complete Inline Style Inventory

Here's every inline style in `Calculator.jsx` that needs extraction:

| Line(s) | Current Style | New Class Name |
|---------|---------------|----------------|
| 301-309 | score-explanation-box container | `.score-explanation-box` |
| 311-319 | h3 title | `.score-explanation-box__title` |
| 321-326 | grid container | `.score-explanation-box__grid` |
| 328-333 | score-type-card | `.score-type-card` |
| 334 | icon | `.score-type-card__icon` |
| 335-340 | h4 title | `.score-type-card__title` |
| 341-346 | p description | `.score-type-card__description` |
| 348-352 | tagline | `.score-type-card__tagline` |
| 387-395 | footer | `.score-explanation-box__footer` |
| 448 | button width | `.btn--full-width` |
| 466-470 | empty state container | `.calculator-empty-state` |
| 471 | empty icon | `.calculator-empty-state__icon` |
| 472-477 | empty title | `.calculator-empty-state__title` |
| 478-485 | empty description | `.calculator-empty-state__description` |
| 488 | empty cta | `.calculator-empty-state__cta` |
| 498-512 | tooltip icon | `.score-tooltip-icon` |
| 573 | section title | `.section-title--small` |
| 596 | margin-top | `.section-header--margin-top` |
| 604 | no padding | `.calculator-section--no-padding-top` |
| 632-638 | warning box | `.form-hint-warning` |
| 643, 647 | buttons | `.btn--full-width`, `.btn--margin-top` |
| 665-670, 695-712 | repeat empty state + tooltip | Same as above |
| 772 | section title | `.section-title--small` |

---

## 5. Implement Autocomplete Search

### Current Limitation

The suburb dropdown only shows 12 hardcoded suburbs, while the CSV contains 397.

### Complete Autocomplete Component

```jsx
// src/components/SuburbAutocomplete.jsx
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebounce } from '../hooks/useDebounce';
import './SuburbAutocomplete.css';

// Load suburbs data
let suburbsCache = null;
async function loadSuburbs() {
  if (suburbsCache) return suburbsCache;
  
  const response = await fetch('/data/suburbs.csv');
  const text = await response.text();
  
  const lines = text.split('\n').slice(1); // Skip header
  suburbsCache = lines
    .filter(line => line.trim())
    .map(line => {
      const [suburb, postcode, lga, lat, lng, ...rest] = line.split(',');
      const category = rest[rest.length - 1]?.trim() || 'UNKNOWN';
      return { suburb, postcode, lga, category };
    });
  
  return suburbsCache;
}

export function SuburbAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = 'Search suburbs...',
  label = 'Suburb',
  error,
  disabled = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [suburbs, setSuburbs] = useState([]);
  
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const containerRef = useRef(null);
  
  const debouncedValue = useDebounce(value, 150);
  
  // Load suburbs on mount
  useEffect(() => {
    loadSuburbs().then(setSuburbs);
  }, []);
  
  // Search when value changes
  useEffect(() => {
    if (!debouncedValue || debouncedValue.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    
    setLoading(true);
    
    const query = debouncedValue.toLowerCase();
    const filtered = suburbs.filter(item => 
      item.suburb.toLowerCase().includes(query) ||
      item.postcode.includes(query) ||
      item.lga?.toLowerCase().includes(query)
    );
    
    // Sort by relevance (exact matches first, then starts with, then contains)
    const sorted = filtered.sort((a, b) => {
      const aLower = a.suburb.toLowerCase();
      const bLower = b.suburb.toLowerCase();
      
      // Exact match
      if (aLower === query) return -1;
      if (bLower === query) return 1;
      
      // Starts with
      if (aLower.startsWith(query) && !bLower.startsWith(query)) return -1;
      if (bLower.startsWith(query) && !aLower.startsWith(query)) return 1;
      
      // Alphabetical
      return aLower.localeCompare(bLower);
    });
    
    setResults(sorted.slice(0, 20)); // Limit to 20 results
    setIsOpen(sorted.length > 0);
    setHighlightedIndex(-1);
    setLoading(false);
  }, [debouncedValue, suburbs]);
  
  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' && results.length > 0) {
        setIsOpen(true);
        setHighlightedIndex(0);
      }
      return;
    }
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : 0
        );
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : results.length - 1
        );
        break;
        
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && results[highlightedIndex]) {
          handleSelect(results[highlightedIndex]);
        }
        break;
        
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.focus();
        break;
        
      case 'Tab':
        setIsOpen(false);
        break;
    }
  }, [isOpen, results, highlightedIndex]);
  
  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('[role="option"]');
      items[highlightedIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex]);
  
  const handleSelect = (item) => {
    onChange(item.suburb);
    onSelect?.(item);
    setIsOpen(false);
    setResults([]);
    inputRef.current?.focus();
  };
  
  const handleInputChange = (e) => {
    onChange(e.target.value);
  };
  
  const handleFocus = () => {
    if (results.length > 0) {
      setIsOpen(true);
    }
  };
  
  // Group results by category
  const groupedResults = results.reduce((acc, item) => {
    const category = item.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {});
  
  const id = `suburb-autocomplete-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div 
      ref={containerRef}
      className="suburb-autocomplete"
    >
      <label htmlFor={id} className="form-label">
        <span className="form-label-icon" aria-hidden="true">🗺️</span>
        {label}
      </label>
      
      <div className="suburb-autocomplete__input-wrapper">
        <input
          ref={inputRef}
          id={id}
          type="text"
          className={`form-input suburb-autocomplete__input ${error ? 'form-input--error' : ''}`}
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls={`${id}-listbox`}
          aria-activedescendant={
            highlightedIndex >= 0 ? `${id}-option-${highlightedIndex}` : undefined
          }
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={error ? 'true' : undefined}
        />
        
        {/* Loading indicator */}
        {loading && (
          <div className="suburb-autocomplete__loading" aria-hidden="true">
            <span className="spinner" />
          </div>
        )}
        
        {/* Clear button */}
        {value && !loading && (
          <button
            type="button"
            className="suburb-autocomplete__clear"
            onClick={() => {
              onChange('');
              inputRef.current?.focus();
            }}
            aria-label="Clear search"
          >
            <span aria-hidden="true">×</span>
          </button>
        )}
      </div>
      
      {/* Results dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={listRef}
            id={`${id}-listbox`}
            className="suburb-autocomplete__dropdown"
            role="listbox"
            aria-label="Suburb suggestions"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            {Object.entries(groupedResults).map(([category, items]) => (
              <div key={category} className="suburb-autocomplete__group">
                <div className="suburb-autocomplete__group-label">
                  {category.replace('_', ' ')}
                </div>
                {items.map((item, index) => {
                  const flatIndex = results.indexOf(item);
                  return (
                    <div
                      key={`${item.suburb}-${item.postcode}`}
                      id={`${id}-option-${flatIndex}`}
                      className={`suburb-autocomplete__option ${
                        flatIndex === highlightedIndex ? 'suburb-autocomplete__option--highlighted' : ''
                      }`}
                      role="option"
                      aria-selected={flatIndex === highlightedIndex}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setHighlightedIndex(flatIndex)}
                    >
                      <div className="suburb-autocomplete__option-main">
                        <span className="suburb-autocomplete__option-name">
                          {highlightQuery(item.suburb, value)}
                        </span>
                        <span className="suburb-autocomplete__option-postcode">
                          {item.postcode}
                        </span>
                      </div>
                      {item.lga && (
                        <div className="suburb-autocomplete__option-lga">
                          {item.lga}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
            
            {results.length === 0 && !loading && (
              <div className="suburb-autocomplete__no-results">
                No suburbs found matching "{value}"
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Error message */}
      {error && (
        <p id={`${id}-error`} className="form-error" role="alert">
          {error}
        </p>
      )}
      
      {/* Hint */}
      <p className="form-hint">
        Search by suburb name, postcode, or local government area
      </p>
    </div>
  );
}

// Helper to highlight matching text
function highlightQuery(text, query) {
  if (!query) return text;
  
  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) return text;
  
  return (
    <>
      {text.slice(0, index)}
      <mark className="suburb-autocomplete__highlight">
        {text.slice(index, index + query.length)}
      </mark>
      {text.slice(index + query.length)}
    </>
  );
}
```

#### Autocomplete CSS

```css
/* src/components/SuburbAutocomplete.css */

.suburb-autocomplete {
  position: relative;
  width: 100%;
}

.suburb-autocomplete__input-wrapper {
  position: relative;
}

.suburb-autocomplete__input {
  padding-right: var(--space-10);
}

.suburb-autocomplete__loading,
.suburb-autocomplete__clear {
  position: absolute;
  right: var(--space-3);
  top: 50%;
  transform: translateY(-50%);
}

.suburb-autocomplete__loading .spinner {
  display: block;
  width: 18px;
  height: 18px;
  border: 2px solid var(--dark-600);
  border-top-color: var(--orange-primary);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

.suburb-autocomplete__clear {
  width: 24px;
  height: 24px;
  padding: 0;
  background: var(--dark-600);
  border: none;
  border-radius: 50%;
  color: var(--text-secondary);
  font-size: 1rem;
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
}

.suburb-autocomplete__clear:hover {
  background: var(--orange-primary);
  color: var(--dark-900);
}

.suburb-autocomplete__dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  max-height: 320px;
  overflow-y: auto;
  background: var(--bg-elevated);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  z-index: 1000;
}

.suburb-autocomplete__group {
  padding: var(--space-2) 0;
}

.suburb-autocomplete__group:not(:last-child) {
  border-bottom: 1px solid var(--glass-border);
}

.suburb-autocomplete__group-label {
  padding: var(--space-2) var(--space-4);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--orange-light);
  background: var(--bg-tertiary);
}

.suburb-autocomplete__option {
  padding: var(--space-3) var(--space-4);
  cursor: pointer;
  transition: background var(--transition-fast);
}

.suburb-autocomplete__option:hover,
.suburb-autocomplete__option--highlighted {
  background: var(--orange-subtle);
}

.suburb-autocomplete__option-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.suburb-autocomplete__option-name {
  font-weight: 600;
  color: var(--text-primary);
}

.suburb-autocomplete__option-postcode {
  font-size: 0.875rem;
  color: var(--text-tertiary);
  font-family: var(--font-mono);
}

.suburb-autocomplete__option-lga {
  font-size: 0.8125rem;
  color: var(--text-tertiary);
  margin-top: 2px;
}

.suburb-autocomplete__highlight {
  background: var(--orange-primary);
  color: var(--dark-900);
  padding: 0 2px;
  border-radius: 2px;
}

.suburb-autocomplete__no-results {
  padding: var(--space-6) var(--space-4);
  text-align: center;
  color: var(--text-tertiary);
}

/* Scrollbar styling */
.suburb-autocomplete__dropdown::-webkit-scrollbar {
  width: 8px;
}

.suburb-autocomplete__dropdown::-webkit-scrollbar-track {
  background: var(--dark-700);
  border-radius: 4px;
}

.suburb-autocomplete__dropdown::-webkit-scrollbar-thumb {
  background: var(--dark-500);
  border-radius: 4px;
}

.suburb-autocomplete__dropdown::-webkit-scrollbar-thumb:hover {
  background: var(--orange-primary);
}
```

#### Debounce Hook

```javascript
// src/hooks/useDebounce.js
import { useState, useEffect } from 'react';

export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
```

---

## 6. Add Property Images

### Implementation Options

#### Option A: Placeholder Images (Free, Immediate)

```jsx
// src/components/PropertyImage.jsx
import { useState } from 'react';

const PLACEHOLDER_IMAGES = {
  house: [
    '/images/placeholders/house-1.webp',
    '/images/placeholders/house-2.webp',
    '/images/placeholders/house-3.webp',
  ],
  unit: [
    '/images/placeholders/unit-1.webp',
    '/images/placeholders/unit-2.webp',
  ],
  townhouse: [
    '/images/placeholders/townhouse-1.webp',
  ]
};

export function PropertyImage({ 
  src, 
  alt, 
  propertyType = 'house',
  suburb,
  className = ''
}) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  
  // Generate consistent placeholder based on property/suburb
  const getPlaceholder = () => {
    const images = PLACEHOLDER_IMAGES[propertyType] || PLACEHOLDER_IMAGES.house;
    const index = suburb 
      ? suburb.charCodeAt(0) % images.length 
      : Math.floor(Math.random() * images.length);
    return images[index];
  };
  
  const imageSrc = error || !src ? getPlaceholder() : src;
  
  return (
    <div className={`property-image-container ${className}`}>
      {!loaded && (
        <div className="property-image-skeleton">
          <div className="property-image-skeleton__icon">🏡</div>
        </div>
      )}
      <img
        src={imageSrc}
        alt={alt}
        className={`property-image ${loaded ? 'property-image--loaded' : ''}`}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        loading="lazy"
      />
    </div>
  );
}
```

```css
/* src/components/PropertyImage.css */

.property-image-container {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: linear-gradient(135deg, var(--dark-700) 0%, var(--dark-600) 100%);
}

.property-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.property-image--loaded {
  opacity: 1;
}

.property-image-skeleton {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--dark-700) 0%, var(--dark-600) 100%);
}

.property-image-skeleton__icon {
  font-size: 3rem;
  opacity: 0.5;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.05); }
}
```

#### Option B: AI-Generated Placeholders

Use DALL-E or Midjourney to generate consistent property images:

**Prompt for generating Melbourne-style houses:**
```
Modern Australian suburban house, Melbourne architecture style, 
brick and weatherboard exterior, neat front garden, 
clear blue sky, professional real estate photography style,
--ar 16:9 --style raw
```

**Recommended images to generate:**
1. `house-modern-1.webp` - Modern single-story house
2. `house-federation-1.webp` - Federation-style house
3. `house-victorian-1.webp` - Victorian terrace
4. `unit-highrise-1.webp` - High-rise apartment
5. `unit-lowrise-1.webp` - Low-rise apartment block
6. `townhouse-modern-1.webp` - Modern townhouse

#### Option C: Stock Photo Integration

```javascript
// Using Unsplash API (Free)
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

async function getPropertyImage(query = 'melbourne house') {
  const response = await fetch(
    `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=landscape`,
    {
      headers: {
        'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
      }
    }
  );
  
  const data = await response.json();
  return data.urls.regular;
}
```

#### Option D: Map-Based Visualization

Instead of photos, show location context:

```jsx
// src/components/PropertyMapPreview.jsx
export function PropertyMapPreview({ lat, lng, suburb, postcode }) {
  const mapUrl = `https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/` +
    `pin-s+ff6b35(${lng},${lat})/${lng},${lat},14,0/400x200@2x` +
    `?access_token=${MAPBOX_TOKEN}`;
  
  return (
    <div className="property-map-preview">
      <img 
        src={mapUrl} 
        alt={`Map showing ${suburb}, ${postcode}`}
        loading="lazy"
      />
      <div className="property-map-preview__overlay">
        <span className="property-map-preview__suburb">{suburb}</span>
        <span className="property-map-preview__postcode">{postcode}</span>
      </div>
    </div>
  );
}
```

### Recommended Approach

For a prototype, use **Option A + Option D combined**:

1. Generate 6-10 AI placeholder images covering different property types
2. Use Mapbox/Google Maps static images as an alternative view
3. Add a toggle to switch between "Photo" and "Map" views

```jsx
// src/components/PropertyCard.jsx - Updated
import { useState } from 'react';
import { PropertyImage } from './PropertyImage';
import { PropertyMapPreview } from './PropertyMapPreview';

export function PropertyCard({ property }) {
  const [viewMode, setViewMode] = useState('photo'); // 'photo' | 'map'
  
  return (
    <div className="property-card">
      <div className="property-card__image-container">
        {viewMode === 'photo' ? (
          <PropertyImage
            propertyType={property.type}
            suburb={property.suburb}
            alt={`${property.address}, ${property.suburb}`}
          />
        ) : (
          <PropertyMapPreview
            lat={property.latitude}
            lng={property.longitude}
            suburb={property.suburb}
            postcode={property.postcode}
          />
        )}
        
        {/* View toggle */}
        <div className="property-card__view-toggle">
          <button
            className={`view-toggle-btn ${viewMode === 'photo' ? 'active' : ''}`}
            onClick={() => setViewMode('photo')}
            aria-pressed={viewMode === 'photo'}
          >
            📷
          </button>
          <button
            className={`view-toggle-btn ${viewMode === 'map' ? 'active' : ''}`}
            onClick={() => setViewMode('map')}
            aria-pressed={viewMode === 'map'}
          >
            🗺️
          </button>
        </div>
      </div>
      
      {/* Rest of card content */}
      <div className="property-card__content">
        {/* ... */}
      </div>
    </div>
  );
}
```

---

## Summary

| Task | Priority | Effort | Impact |
|------|----------|--------|--------|
| Fill Data Gaps | 🔴 High | 3-4 days | Critical for accuracy |
| Add Loading States | 🟡 Medium | 1 day | Better UX |
| Accessibility Audit | 🔴 High | 2 days | Legal compliance |
| Extract Inline Styles | 🟢 Low | 0.5 days | Code quality |
| Autocomplete Search | 🔴 High | 1 day | Core functionality |
| Property Images | 🟡 Medium | 0.5 days | Visual appeal |

**Recommended Order:**
1. Extract inline styles (quick win, improves maintainability)
2. Implement autocomplete (unlocks full suburb data)
3. Add loading states (better UX for existing features)
4. Accessibility audit (important for all users)
5. Fill data gaps (ongoing, requires API keys)
6. Property images (nice-to-have)

---

*This document was generated to provide maximum implementation detail for the HomeScorePro improvement roadmap.*
