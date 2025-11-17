/**
 * Calculator utility functions
 * Migrated from js/calculator.js
 */

// Score caching for performance optimization
const scoreCache = new Map();

// Suburb data for selected suburbs
export const suburbData = {
  // High A-Score (88-95)
  'Hawthorn': {
    location: 9.5,
    schools: 9.8,
    safety: 9.2,
    amenities: 9.0,
    transport: 8.8,
    lifestyle: 9.3,
    growth: 7.5
  },
  'Brighton': {
    location: 9.2,
    schools: 9.5,
    safety: 9.0,
    amenities: 8.8,
    transport: 8.5,
    lifestyle: 9.5,
    growth: 6.8
  },
  'Balwyn': {
    location: 9.0,
    schools: 9.7,
    safety: 9.1,
    amenities: 8.9,
    transport: 8.2,
    lifestyle: 9.2,
    growth: 7.2
  },
  // Medium A-Score (75-85)
  'Box Hill': {
    location: 8.0,
    schools: 8.2,
    safety: 7.8,
    amenities: 8.5,
    transport: 9.0,
    lifestyle: 8.0,
    growth: 6.5
  },
  'Blackburn': {
    location: 7.8,
    schools: 8.0,
    safety: 7.9,
    amenities: 7.5,
    transport: 8.2,
    lifestyle: 8.2,
    growth: 6.8
  },
  'Bentleigh': {
    location: 8.2,
    schools: 8.1,
    safety: 8.0,
    amenities: 7.8,
    transport: 7.5,
    lifestyle: 8.5,
    growth: 6.2
  },
  'Ascot Vale': {
    location: 7.5,
    schools: 7.8,
    safety: 7.6,
    amenities: 8.0,
    transport: 8.8,
    lifestyle: 8.0,
    growth: 6.0
  },
  'Camberwell': {
    location: 8.3,
    schools: 8.5,
    safety: 8.1,
    amenities: 8.2,
    transport: 8.0,
    lifestyle: 8.3,
    growth: 6.5
  },
  // Low A-Score (60-70)
  'Albanvale': {
    location: 6.0,
    schools: 6.2,
    safety: 6.5,
    amenities: 5.8,
    transport: 6.2,
    lifestyle: 6.0,
    growth: 5.5
  },
  'Ardeer': {
    location: 5.8,
    schools: 6.0,
    safety: 6.2,
    amenities: 5.5,
    transport: 6.0,
    lifestyle: 5.8,
    growth: 5.2
  },
  'Bellfield': {
    location: 6.2,
    schools: 6.5,
    safety: 6.0,
    amenities: 6.0,
    transport: 6.5,
    lifestyle: 6.2,
    growth: 5.8
  },
  'Broadmeadows': {
    location: 6.1,
    schools: 6.3,
    safety: 6.1,
    amenities: 5.9,
    transport: 6.3,
    lifestyle: 6.1,
    growth: 5.6
  }
};

// Property profiles
export const propertyProfiles = {
  starter: {
    price: 650000,
    cbdDistance: 12,
    trainDistance: 600,
    safetyRating: 7.5,
    lifestyleType: 'professional'
  },
  family: {
    price: 1200000,
    cbdDistance: 8,
    trainDistance: 500,
    safetyRating: 8.5,
    lifestyleType: 'family'
  },
  investment: {
    price: 850000,
    cbdDistance: 15,
    trainDistance: 800,
    safetyRating: 7.8,
    lifestyleType: 'investor'
  },
  luxury: {
    price: 2500000,
    cbdDistance: 5,
    trainDistance: 300,
    safetyRating: 9.5,
    lifestyleType: 'retiree'
  }
};

/**
 * Calculate A-Score for a suburb
 */
export function calculateAScore(suburb) {
  if (!suburb || !suburbData[suburb]) {
    return null;
  }

  // Check cache first
  const cacheKey = `ascore-${suburb}`;
  if (scoreCache.has(cacheKey)) {
    return scoreCache.get(cacheKey);
  }

  const data = suburbData[suburb];
  
  // Weighted calculation
  const weights = {
    location: 0.20,
    schools: 0.18,
    safety: 0.15,
    amenities: 0.15,
    transport: 0.12,
    lifestyle: 0.12,
    growth: 0.08
  };

  let totalScore = 0;
  for (const [key, value] of Object.entries(data)) {
    totalScore += value * weights[key] * 10;
  }

  const result = {
    score: parseFloat(totalScore.toFixed(1)),
    breakdown: data,
    suburb
  };

  // Cache the result
  scoreCache.set(cacheKey, result);
  return result;
}

/**
 * Calculate B-Score for a property
 */
export function calculateBScore(profile, price, cbdDistance, trainDistance, safetyRating, lifestyleType) {
  if (!profile || !propertyProfiles[profile]) {
    return null;
  }

  // Check cache first
  const cacheKey = `bscore-${profile}-${price}-${cbdDistance}-${trainDistance}-${safetyRating}-${lifestyleType}`;
  if (scoreCache.has(cacheKey)) {
    return scoreCache.get(cacheKey);
  }

  const scores = {
    location: calculateLocationScore(cbdDistance),
    transportation: calculateTransportScore(trainDistance),
    safety: safetyRating,
    affordability: calculateAffordabilityScore(price),
    amenities: 8.2,
    schools: 8.5,
    lifestyle: calculateLifestyleScore(lifestyleType),
    growth: 7.8,
    investment: 8.0
  };

  const weights = {
    location: 0.20,
    transportation: 0.15,
    safety: 0.12,
    affordability: 0.10,
    amenities: 0.12,
    schools: 0.10,
    lifestyle: 0.08,
    growth: 0.08,
    investment: 0.05
  };

  let totalScore = 0;
  for (const [key, score] of Object.entries(scores)) {
    totalScore += score * weights[key] * 10;
  }

  const result = {
    score: parseFloat(totalScore.toFixed(1)),
    breakdown: scores
  };

  // Cache the result
  scoreCache.set(cacheKey, result);
  return result;
}

function calculateLocationScore(cbdDistance) {
  if (cbdDistance <= 5) return 10;
  if (cbdDistance <= 10) return 9;
  if (cbdDistance <= 15) return 7.5;
  if (cbdDistance <= 25) return 6;
  return 4.5;
}

function calculateTransportScore(trainDistance) {
  if (trainDistance <= 400) return 10;
  if (trainDistance <= 800) return 9;
  if (trainDistance <= 1200) return 7.5;
  if (trainDistance <= 2000) return 6;
  return 4.5;
}

function calculateAffordabilityScore(price) {
  const medianPrice = 1100000;
  const ratio = price / medianPrice;
  
  if (ratio < 0.7) return 10;
  if (ratio < 0.85) return 9;
  if (ratio < 1.0) return 8;
  if (ratio < 1.15) return 6.5;
  if (ratio < 1.3) return 5;
  return 3.5;
}

function calculateLifestyleScore(lifestyleType) {
  const scores = {
    family: 8.8,
    professional: 8.5,
    retiree: 7.8,
    investor: 7.2,
    starter: 7.0,
    investment: 7.5,
    luxury: 9.5
  };
  return scores[lifestyleType] || 7.5;
}

/**
 * Get score rating (A+, A, B+, etc.)
 */
export function getScoreRating(score) {
  if (score >= 90) return { grade: 'A+', label: 'Excellent', color: 'var(--success)' };
  if (score >= 85) return { grade: 'A', label: 'Very Good', color: 'var(--success)' };
  if (score >= 80) return { grade: 'B+', label: 'Good', color: 'var(--orange-light)' };
  if (score >= 75) return { grade: 'B', label: 'Above Average', color: 'var(--orange-light)' };
  if (score >= 70) return { grade: 'C+', label: 'Average', color: 'var(--warning)' };
  if (score >= 65) return { grade: 'C', label: 'Below Average', color: 'var(--warning)' };
  return { grade: 'C-', label: 'Needs Improvement', color: 'var(--error)' };
}

/**
 * Animate count-up for numbers
 */
export function animateCountUp(element, target, duration = 2000) {
  if (!element) return;
  
  const start = 0;
  const increment = target / (duration / 16); // 60fps
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target + (target === 38 ? '+' : target === 100 ? '%' : '');
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current) + (target === 38 ? '+' : target === 100 ? '%' : '');
    }
  }, 16);
}

