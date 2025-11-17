/**
 * Members Page Utility Functions
 * Extracted from members.html for React migration
 */

// Crime data from Victoria Police (rates per 100,000 population)
export const crimeData = {
    'Banyule': 8426.88,
    'Brimbank': 9476.96,
    'Darebin': 11790.89,
    'Hobsons Bay': 8182.20,
    'Hume': 8276.54,
    'Maribyrnong': 12958.47,
    'Melbourne': 23519.82,
    'Melton': 7056.17,
    'Merri-bek': 8523.31,
    'Moonee Valley': 8050.79,
    'Moreland': 8523.31,
    'Nillumbik': 3245.67,
    'Port Phillip': 14532.89,
    'Stonnington': 10234.56,
    'Whitehorse': 5678.90,
    'Whittlesea': 6789.01,
    'Wyndham': 7890.12,
    'Yarra': 15678.90,
    '_default': 8500.00
};

// Strategy weights configuration
export const strategyWeights = {
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

// CSV Parser - handles quoted fields with commas
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];
        
        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                // Escaped quote (double quote)
                current += '"';
                i++; // Skip next quote
            } else {
                // Toggle quote state
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            // Field separator (only when not in quotes)
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    // Add last field
    result.push(current.trim());
    return result;
}

// CSV Parser
export function parseCSV(text) {
    const lines = text.trim().split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];
    
    // Parse header
    const headers = parseCSVLine(lines[0]).map(h => h.replace(/^"|"$/g, '').trim());
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue;
        
        // Parse line with proper quote handling
        const values = parseCSVLine(line);
        const obj = {};
        
        headers.forEach((header, index) => {
            let value = (values[index] || '').replace(/^"|"$/g, '').trim();
            
            if (value === '' || value === 'null' || value === 'undefined') {
                obj[header] = '';
                return;
            }
            
            // Try to parse as number
            const numValue = parseFloat(value);
            if (!isNaN(numValue) && isFinite(numValue) && value !== '') {
                // Check if it's actually a number (not a string that happens to be numeric)
                // Only convert if the original value matches the parsed number exactly
                if (String(numValue) === value || String(numValue) === value.replace(/^0+/, '')) {
                    obj[header] = numValue;
                } else {
                    obj[header] = value;
                }
            } else {
                obj[header] = value;
            }
        });
        
        data.push(obj);
    }
    
    return data;
}

// Load suburbs CSV
export async function loadSuburbsData() {
    try {
        const response = await fetch('/data/suburbs.csv');
        if (!response.ok) throw new Error('Failed to load suburbs.csv');
        const text = await response.text();
        const csvData = parseCSV(text);
        
        const suburbData = csvData.map(row => ({
            name: row.suburb || '',
            postcode: String(row.postcode || ''),
            lga: row.lga || '',
            latitude: row.latitude || null,
            longitude: row.longitude || null,
            medianPrice: row.medianPrice || 0,
            growth1yr: row.growth1yr || 0,
            rentalYield: row.rentalYield || 0,
            irsd_score: row.irsd_score || 0,
            irsd_decile: row.irsd_decile || 0,
            ier_score: row.ier_score || 0,
            ier_decile: row.ier_decile || 0,
            ieo_score: row.ieo_score || 0,
            ieo_decile: row.ieo_decile || 0,
            transitScore: row.transitScore || 0,
            walkScore: row.walkScore || 0,
            schoolRating: row.schoolRating || 60,
            schoolCount: row.schoolCount || 0,
            parksDensity: row.parksDensity || 0,
            childcareCenters: row.childcareCenters || 0,
            shoppingCenters: row.shoppingCenters || 0,
            cafesRestaurants: row.cafesRestaurants || 0,
            cbdDistance: row.primaryCommuteMinutes || 0,
            category: row.category || ''
        })).filter(s => s.name);
        
        return suburbData;
    } catch (error) {
        console.error('Error loading suburbs data:', error);
        return null;
    }
}

// Load properties CSV
export async function loadPropertiesData() {
    try {
        const response = await fetch('/data/properties.csv');
        if (!response.ok) {
            console.error(`Failed to load properties.csv: ${response.status} ${response.statusText}`);
            throw new Error(`Failed to load properties.csv: ${response.status}`);
        }
        const text = await response.text();
        console.log('📄 Properties CSV loaded, length:', text.length, 'characters');
        const parsed = parseCSV(text);
        console.log('✅ Parsed properties:', parsed.length, 'rows');
        if (parsed.length > 0) {
            console.log('📋 First property sample:', parsed[0]);
        }
        return parsed;
    } catch (error) {
        console.error('❌ Error loading properties data:', error);
        console.error('Error details:', error.stack);
        return [];
    }
}

// Load config JSON
export async function loadConfigData() {
    try {
        const response = await fetch('/data/config.json');
        if (!response.ok) throw new Error('Failed to load config.json');
        return await response.json();
    } catch (error) {
        console.error('Error loading config data:', error);
        return null;
    }
}

// Normalize score to 0-100 range
export function normalizeScore(value, min, max, inverse = false) {
    if (inverse) {
        return Math.min(100, Math.max(0, ((max - value) / (max - min)) * 100));
    }
    return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
}

// Get crime rate for suburb
export function getCrimeRate(suburb) {
    const lga = suburb.lga;
    return crimeData[lga] || crimeData._default;
}

// Get strategy from user preferences
export function getStrategyFromPreferences(userPreferences) {
    if (userPreferences && userPreferences.primaryGoal) {
        return userPreferences.primaryGoal.toLowerCase();
    }
    return 'balanced';
}

// Get strategy from property price
export function getStrategyFromPropertyPrice(price, userPreferences) {
    if (!userPreferences || !userPreferences.budgetMin || !userPreferences.budgetMax) {
        return price < 700000 ? 'investment' : price < 1000000 ? 'balanced' : 'lifestyle';
    }
    const minBudget = userPreferences.budgetMin;
    const maxBudget = userPreferences.budgetMax;
    const investmentThreshold = minBudget * 1.15;
    const lifestyleMin = maxBudget * 0.85;
    const lifestyleMax = maxBudget * 1.20;
    
    if (price <= investmentThreshold) {
        return 'investment';
    } else if (price >= lifestyleMin && price <= lifestyleMax) {
        return 'lifestyle';
    } else {
        return 'balanced';
    }
}

// Filter suburbs by geographic category
export function filterSuburbsByCategory(suburbs, userPreferences) {
    if (!userPreferences || !userPreferences.geographicCategories) {
        return suburbs;
    }
    
    const categories = userPreferences.geographicCategories;
    if (categories === 'all' || (Array.isArray(categories) && categories.length === 4)) {
        return suburbs;
    }
    
    if (!Array.isArray(categories) || categories.length === 0) {
        return suburbs;
    }
    
    return suburbs.filter(suburb => {
        const suburbCategory = suburb.category || '';
        return categories.includes(suburbCategory);
    });
}

// Calculate distance between two coordinates (Haversine formula)
export function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Find nearest suburb from coordinates
export function findNearestSuburb(lat, lng, suburbData) {
    let nearest = null;
    let minDistance = Infinity;
    
    suburbData.forEach(suburb => {
        if (suburb.latitude && suburb.longitude) {
            const distance = calculateDistance(lat, lng, suburb.latitude, suburb.longitude);
            if (distance < minDistance) {
                minDistance = distance;
                nearest = suburb;
            }
        }
    });
    
    return nearest;
}

// Normalize search string
export function normalizeSearchString(str) {
    return str.trim().toLowerCase().replace(/\s+/g, ' ');
}

// Property management functions
export function loadPropertiesFromStorage() {
    try {
        const stored = localStorage.getItem('homescorepro_properties');
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error loading properties:', error);
        return [];
    }
}

export function savePropertyToStorage(property) {
    const saved = loadPropertiesFromStorage();
    saved.push({
        ...property,
        id: property.id || Date.now().toString()
    });
    localStorage.setItem('homescorepro_properties', JSON.stringify(saved));
    return saved;
}

export function updatePropertyInStorage(id, property) {
    const saved = loadPropertiesFromStorage();
    const index = saved.findIndex(p => p.id === id);
    if (index !== -1) {
        saved[index] = { ...property, id, timestamp: saved[index].timestamp };
        localStorage.setItem('homescorepro_properties', JSON.stringify(saved));
    }
    return saved;
}

export function deletePropertyFromStorage(id) {
    const saved = loadPropertiesFromStorage();
    const filtered = saved.filter(p => p.id !== id);
    localStorage.setItem('homescorepro_properties', JSON.stringify(filtered));
    return filtered;
}

// Load user preferences
export function loadUserPreferences() {
    try {
        const stored = localStorage.getItem('homescorepro_preferences');
        return stored ? JSON.parse(stored) : null;
    } catch (error) {
        console.error('Error loading preferences:', error);
        return null;
    }
}

// Save user preferences
export function saveUserPreferences(preferences) {
    localStorage.setItem('homescorepro_preferences', JSON.stringify(preferences));
}

// Check if testing mode
export function isTestingMode() {
    return window.testingMode || window.hasPaidAccess || 
           localStorage.getItem('homescorepro_paid_access') === 'true';
}

// Calculate A-Score for a suburb
export function calculateAScoreForSuburb(suburb, strategy, userPreferences) {
    if (!suburb) return null;
    
    const weights = strategyWeights[strategy].aTiers;
    const crimeRate = getCrimeRate(suburb);
    
    // Tier 1: Investment
    const growthScore = normalizeScore(suburb.growth1yr || 0, -5, 15);
    const yieldScore = normalizeScore(suburb.rentalYield || 0, 1, 6);
    const tier1Score = (growthScore * 0.55 + yieldScore * 0.45) * weights.tier1;
    
    // Tier 2: Location (SEIFA + Crime)
    const irsdScore = normalizeScore(suburb.irsd_score || 0, 800, 1200);
    const ierScore = normalizeScore(suburb.ier_score || 0, 800, 1200);
    const ieoScore = normalizeScore(suburb.ieo_score || 0, 800, 1200);
    const crimeScore = normalizeScore(crimeRate, 3000, 25000, true);
    
    const locationWeights = strategy === 'investment' ? 
        { irsd: 0.45, ier: 0.30, ieo: 0.15, crime: 0.10 } :
        strategy === 'balanced' ?
        { irsd: 0.30, ier: 0.25, ieo: 0.30, crime: 0.15 } :
        { irsd: 0.20, ier: 0.20, ieo: 0.50, crime: 0.10 };
    
    const tier2Score = (irsdScore * locationWeights.irsd + 
                       ierScore * locationWeights.ier + 
                       ieoScore * locationWeights.ieo + 
                       crimeScore * locationWeights.crime) * weights.tier2;
    
    // Tier 3: Accessibility
    const cbdScore = normalizeScore(suburb.cbdDistance || 0, 0, 50, true);
    const transitScore = suburb.transitScore || 0;
    const walkScore = suburb.walkScore || 0;
    const tier3Score = (cbdScore * 0.30 + transitScore * 0.45 + walkScore * 0.25) / 100 * weights.tier3 * 100;
    
    // Tier 4: Lifestyle
    const schoolScore = suburb.schoolRating || 60;
    const parksScore = normalizeScore(suburb.parksDensity || 0, 0, 10);
    const childcareScore = normalizeScore(suburb.childcareCenters || 0, 0, 20);
    const shoppingScore = normalizeScore(suburb.shoppingCenters || 0, 0, 10);
    const cafesScore = normalizeScore(suburb.cafesRestaurants || 0, 0, 100);
    
    const tier4Score = (schoolScore * 0.40 + parksScore * 0.25 + 
                       childcareScore * 0.20 + shoppingScore * 0.08 + 
                       cafesScore * 0.07) / 100 * weights.tier4 * 100;
    
    const totalScore = tier1Score + tier2Score + tier3Score + tier4Score;
    
    return {
        score: parseFloat(totalScore.toFixed(1)),
        tier1: parseFloat(tier1Score.toFixed(1)),
        tier2: parseFloat(tier2Score.toFixed(1)),
        tier3: parseFloat(tier3Score.toFixed(1)),
        tier4: parseFloat(tier4Score.toFixed(1)),
        breakdown: {
            growthScore,
            yieldScore,
            irsdScore,
            ierScore,
            ieoScore,
            crimeScore,
            cbdScore,
            transitScore,
            walkScore,
            schoolScore,
            parksScore,
            childcareScore,
            shoppingScore,
            cafesScore
        },
        weights,
        locationWeights,
        strategy,
        suburb: suburb.name
    };
}

// Calculate B-Score for a property
export function calculateBScoreForProperty(propertyData, suburb, userPreferences) {
    if (!suburb || !propertyData) return null;
    
    const price = parseFloat(propertyData.price) || 850000;
    const strategy = getStrategyFromPropertyPrice(price, userPreferences);
    const weights = strategyWeights[strategy].bTiers;
    
    // Tier 1: Investment
    const affordabilityScore = normalizeScore(1000000 / price, 0.5, 2) * 0.40;
    const propertyType = propertyData.propertyType || 'house';
    const propertyTypeScore = propertyType === 'house' ? 100 : 
                            propertyType === 'townhouse' ? 70 : 
                            propertyType === 'unit' ? 50 : 35;
    const tier1Score = (affordabilityScore + propertyTypeScore * 0.35) * weights.tier1;
    
    // Tier 2: Location (uses suburb SEIFA + Crime data)
    const crimeRate = getCrimeRate(suburb);
    const irsdScore = normalizeScore(suburb.irsd_score || 0, 800, 1200);
    const ierScore = normalizeScore(suburb.ier_score || 0, 800, 1200);
    const ieoScore = normalizeScore(suburb.ieo_score || 0, 800, 1200);
    const crimeScore = normalizeScore(crimeRate, 3000, 25000, true); // Inverse - lower is better
    
    const locationWeights = strategy === 'investment' ? 
        { irsd: 0.45, ier: 0.30, ieo: 0.15, crime: 0.10 } :
        strategy === 'balanced' ?
        { irsd: 0.30, ier: 0.25, ieo: 0.30, crime: 0.15 } :
        { irsd: 0.20, ier: 0.20, ieo: 0.50, crime: 0.10 };
    
    const tier2Score = (irsdScore * locationWeights.irsd + 
                       ierScore * locationWeights.ier + 
                       ieoScore * locationWeights.ieo + 
                       crimeScore * locationWeights.crime) * weights.tier2;
    
    // Tier 3: Accessibility (uses suburb transport data)
    // Calculate CBD distance from suburb coordinates if not available
    const cbdLat = -37.8136;
    const cbdLng = 144.9631;
    const suburbLat = parseFloat(suburb.latitude) || 0;
    const suburbLng = parseFloat(suburb.longitude) || 0;
    const cbdDistance = suburbLat && suburbLng ? 
        Math.sqrt(Math.pow((suburbLat - cbdLat) * 111, 2) + Math.pow((suburbLng - cbdLng) * 111 * Math.cos(suburbLat * Math.PI / 180), 2)) : 
        (suburb.primaryCommuteMinutes || 0) / 60 * 50; // Estimate from commute time
    
    const cbdScore = normalizeScore(cbdDistance, 0, 50, true); // Inverse - closer is better
    const transitScore = suburb.transitScore || 0;
    const walkScore = suburb.walkScore || 0;
    const tier3Score = (cbdScore * 0.30 + transitScore * 0.45 + walkScore * 0.25) / 100 * weights.tier3 * 100;
    
    // Tier 4: Property Features
    const landSize = parseInt(propertyData.landSize) || 650;
    const bedrooms = parseInt(propertyData.bedrooms) || 3;
    const bathrooms = parseFloat(propertyData.bathrooms) || 2;
    const streetQuality = parseInt(propertyData.streetQuality) || 3;
    const tier4Score = ((landSize / 10) * 0.35 + bedrooms * 10 * 0.25 + 
                       bathrooms * 12 * 0.25 + streetQuality * 15 * 0.15) * weights.tier4;
    
    // Tier 5: Lifestyle (uses suburb lifestyle data)
    const schoolScore = suburb.schoolRating || 60;
    const parksScore = normalizeScore(suburb.parksDensity || 0, 0, 10);
    const childcareScore = normalizeScore(suburb.childcareCenters || 0, 0, 20);
    const shoppingScore = normalizeScore(suburb.shoppingCenters || 0, 0, 10);
    const cafesScore = normalizeScore(suburb.cafesRestaurants || 0, 0, 100);
    const tier5Score = ((schoolScore * 0.40 + parksScore * 0.25 + childcareScore * 0.20 + 
                        shoppingScore * 0.08 + cafesScore * 0.07) / 100) * weights.tier5 * 100;
    
    const totalScore = Math.min(100, tier1Score + tier2Score + tier3Score + tier4Score + tier5Score);
    
    return {
        score: parseFloat(totalScore.toFixed(1)),
        tier1: parseFloat(tier1Score.toFixed(1)),
        tier2: parseFloat(tier2Score.toFixed(1)),
        tier3: parseFloat(tier3Score.toFixed(1)),
        tier4: parseFloat(tier4Score.toFixed(1)),
        tier5: parseFloat(tier5Score.toFixed(1)),
        breakdown: {
            affordabilityScore,
            propertyTypeScore,
            landSize,
            bedrooms,
            bathrooms,
            streetQuality,
            irsdScore,
            ierScore,
            ieoScore,
            crimeScore,
            cbdDistance,
            transitScore,
            walkScore,
            schoolScore,
            parksScore,
            childcareScore,
            shoppingScore,
            cafesScore
        },
        weights,
        strategy,
        suburb: suburb.name
    };
}

