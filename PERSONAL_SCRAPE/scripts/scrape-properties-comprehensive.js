const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const pdfParseModule = require('pdf-parse');
// pdf-parse v2+ exports an object with PDFParse property containing the function
const pdfParse = pdfParseModule.PDFParse || pdfParseModule;

/**
 * Comprehensive property scraper for domain.com.au
 * Scrapes Frankston, Cranbourne, and bordering suburbs
 * Filters by price <= $700k (after calculating 70% towards high end of range)
 * Extracts all fields matching properties.csv structure
 * Uses intelligent extraction and validation instead of regex
 */

// Suburbs to search - Original comprehensive list
const SUBURBS_TO_SEARCH = [
  // Frankston and immediate borders
  { name: 'Frankston', postcode: '3199', state: 'vic' },
  { name: 'Frankston North', postcode: '3200', state: 'vic' },
  { name: 'Frankston South', postcode: '3199', state: 'vic' },
  { name: 'Seaford', postcode: '3198', state: 'vic' },
  { name: 'Carrum Downs', postcode: '3201', state: 'vic' },
  { name: 'Langwarrin', postcode: '3910', state: 'vic' },
  { name: 'Karingal', postcode: '3199', state: 'vic' },
  { name: 'Skye', postcode: '3977', state: 'vic' },
  
  // Frankston 2-link suburbs
  { name: 'Carrum', postcode: '3197', state: 'vic' },
  { name: 'Bonbeach', postcode: '3196', state: 'vic' },
  { name: 'Chelsea', postcode: '3196', state: 'vic' },
  { name: 'Baxter', postcode: '3911', state: 'vic' },
  { name: 'Pearcedale', postcode: '3912', state: 'vic' },
  
  // Cranbourne and immediate borders
  { name: 'Cranbourne', postcode: '3977', state: 'vic' },
  { name: 'Cranbourne North', postcode: '3977', state: 'vic' },
  { name: 'Cranbourne East', postcode: '3977', state: 'vic' },
  { name: 'Cranbourne West', postcode: '3977', state: 'vic' },
  { name: 'Cranbourne South', postcode: '3977', state: 'vic' },
  { name: 'Lynbrook', postcode: '3975', state: 'vic' },
  { name: 'Lyndhurst', postcode: '3975', state: 'vic' },
  { name: 'Hampton Park', postcode: '3976', state: 'vic' },
  
  // Cranbourne 2-link suburbs
  { name: 'Narre Warren', postcode: '3805', state: 'vic' },
  { name: 'Narre Warren South', postcode: '3805', state: 'vic' },
  { name: 'Berwick', postcode: '3806', state: 'vic' },
  { name: 'Dandenong', postcode: '3175', state: 'vic' },
  { name: 'Dandenong North', postcode: '3175', state: 'vic' }
];

const SEARCH_MAX_PRICE = 750000; // Search filter - cast wider net
const SAVE_MAX_PRICE = 680000; // Only save properties where calculated price (70% towards high end) is below this
const OUTPUT_CSV = path.join(__dirname, '..', 'data', 'scraped-properties.csv');
const PROPERTY_FILES_DIR = path.join(__dirname, '..', 'pdf-import', 'property-files');
const HTML_OUTPUT = path.join(__dirname, '..', 'pdf-import', 'properties-viewer.html');

// Load suburbs data for validation
let suburbsData = null;
function loadSuburbsData() {
  try {
    const suburbsPath = path.join(__dirname, '..', 'data', 'suburbs.csv');
    if (fs.existsSync(suburbsPath)) {
      const content = fs.readFileSync(suburbsPath, 'utf-8');
      const lines = content.split('\n').filter(l => l.trim());
      const headers = lines[0].split(',');
      const suburbIndex = headers.indexOf('suburb');
      const postcodeIndex = headers.indexOf('postcode');
      
      suburbsData = {};
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',');
        if (cols[suburbIndex] && cols[postcodeIndex]) {
          const suburb = cols[suburbIndex].toLowerCase().trim();
          const postcode = cols[postcodeIndex].trim();
          suburbsData[suburb] = postcode;
        }
      }
      console.log(`✅ Loaded ${Object.keys(suburbsData).length} suburbs for validation`);
    }
  } catch (error) {
    console.log(`⚠️  Could not load suburbs.csv for validation: ${error.message}`);
  }
}

// Helper functions
function randomDelay(minSeconds, maxSeconds) {
  const delay = (minSeconds + Math.random() * (maxSeconds - minSeconds)) * 1000;
  return new Promise(resolve => setTimeout(resolve, delay));
}

// Intelligent price extraction with context awareness
function extractPriceIntelligently(pageContent, selectors) {
  // Strategy 1: Look for price in specific price elements
  const priceElements = [];
  for (const selector of selectors) {
    const elements = pageContent.querySelectorAll(selector);
    elements.forEach(el => {
      const text = el.textContent.trim();
      if (text && text.length < 50) { // Price text should be short
        priceElements.push({ text, element: el });
      }
    });
  }
  
  // Strategy 2: Look for price patterns in context
  const bodyText = pageContent.body ? pageContent.body.innerText : '';
  const priceCandidates = [];
  
  // Find all potential price mentions
  const priceKeywords = ['price', 'guide', 'offers', 'auction', 'sold', 'asking'];
  const lines = bodyText.split('\n').filter(l => l.trim().length > 0);
  
  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    if (priceKeywords.some(kw => lowerLine.includes(kw))) {
      // This line might contain price
      priceCandidates.push(line);
    }
  }
  
  // Strategy 3: Extract from price elements first
  for (const { text } of priceElements) {
    const price = parsePriceText(text);
    if (price && price > 100000 && price < 10000000) {
      return price;
    }
  }
  
  // Strategy 4: Extract from candidate lines
  for (const line of priceCandidates) {
    const price = parsePriceText(line);
    if (price && price > 100000 && price < 10000000) {
      return price;
    }
  }
  
  // Strategy 5: Search entire body for price patterns (last resort)
  const price = parsePriceText(bodyText);
  if (price && price > 100000 && price < 10000000) {
    return price;
  }
  
  return 0;
}

// Parse price text intelligently (handles ranges, formats, etc.)
function parsePriceText(text) {
  if (!text) return 0;
  
  // Remove common non-price text
  const cleanText = text.replace(/contact|agent|inspect|auction|guide|offers|over|from|to|between/gi, '');
  
  // Look for price range pattern: "$600k - $700k" or "$600,000 - $700,000"
  const rangePattern = /\$?\s*([\d,]+)\s*(?:k|K|000)?\s*[-–—to]+\s*\$?\s*([\d,]+)\s*(?:k|K|000)?/i;
  const rangeMatch = cleanText.match(rangePattern);
  
  if (rangeMatch) {
    let minPrice = rangeMatch[1].replace(/,/g, '');
    let maxPrice = rangeMatch[2].replace(/,/g, '');
    
    // Handle "k" suffix
    if (text.toLowerCase().includes('k') && !minPrice.endsWith('000')) {
      minPrice = minPrice + '000';
    }
    if (text.toLowerCase().includes('k') && !maxPrice.endsWith('000')) {
      maxPrice = maxPrice + '000';
    }
    
    minPrice = parseInt(minPrice);
    maxPrice = parseInt(maxPrice);
    
    if (minPrice > 0 && maxPrice > 0 && maxPrice > minPrice) {
      // Calculate 70% towards the higher end
      const range = maxPrice - minPrice;
      return Math.round(minPrice + (range * 0.7));
    }
  }
  
  // Look for single price: "$650,000" or "$650k" or "650000"
  const singlePricePatterns = [
    /\$\s*([\d,]+)\s*(?:k|K|000)?/i,
    /([\d,]+)\s*(?:k|K)\b/i,
    /\b([\d]{6,7})\b/ // 6-7 digit number (likely price)
  ];
  
  for (const pattern of singlePricePatterns) {
    const match = cleanText.match(pattern);
    if (match) {
      let priceStr = match[1].replace(/,/g, '');
      
      // Handle "k" suffix
      if (text.toLowerCase().includes('k') && priceStr.length <= 3) {
        priceStr = priceStr + '000';
      }
      
      const price = parseInt(priceStr);
      
      // Validate it's a reasonable price (not a year like 1980)
      if (price >= 100000 && price <= 10000000) {
        return price;
      }
    }
  }
  
  return 0;
}

// Validate extracted data against expected patterns
function validatePropertyData(data, expectedSuburb) {
  const errors = [];
  
  // Validate price
  if (!data.price || data.price < 100000 || data.price > 10000000) {
    errors.push(`Invalid price: ${data.price} (expected 100k-10M)`);
  }
  
  // Validate bedrooms
  if (data.bedrooms !== undefined && (data.bedrooms < 0 || data.bedrooms > 10)) {
    errors.push(`Invalid bedrooms: ${data.bedrooms} (expected 0-10)`);
  }
  
  // Validate bathrooms
  if (data.bathrooms !== undefined && (data.bathrooms < 0 || data.bathrooms > 10)) {
    errors.push(`Invalid bathrooms: ${data.bathrooms} (expected 0-10)`);
  }
  
  // Validate land size (0 is OK for units)
  if (data.landSize !== undefined && data.landSize < 0) {
    errors.push(`Invalid landSize: ${data.landSize} (expected >= 0)`);
  }
  
  // Validate postcode format
  if (data.postcode && !/^\d{4}$/.test(data.postcode.toString())) {
    errors.push(`Invalid postcode format: ${data.postcode} (expected 4 digits)`);
  }
  
  // Cross-validate suburb and postcode
  if (data.suburb && data.postcode && suburbsData) {
    const suburbKey = data.suburb.toLowerCase().trim();
    const expectedPostcode = suburbsData[suburbKey];
    if (expectedPostcode && expectedPostcode !== data.postcode.toString()) {
      errors.push(`Postcode mismatch: ${data.suburb} should be ${expectedPostcode}, got ${data.postcode}`);
    }
  }
  
  // Validate property type
  const validTypes = ['house', 'unit', 'townhouse', 'apartment', 'villa', 'duplex'];
  if (data.propertyType && !validTypes.includes(data.propertyType.toLowerCase())) {
    errors.push(`Invalid propertyType: ${data.propertyType} (expected: ${validTypes.join(', ')})`);
  }
  
  // Cross-validate price vs property type (rough sanity check)
  if (data.price && data.propertyType) {
    const type = data.propertyType.toLowerCase();
    if (type === 'unit' && data.price > 2000000) {
      errors.push(`Suspicious: Unit priced at $${data.price} (very high for unit)`);
    }
    if (type === 'house' && data.price < 200000) {
      errors.push(`Suspicious: House priced at $${data.price} (very low for house)`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

async function scrollWhileReading(page, durationSeconds) {
  const startTime = Date.now();
  const maxScroll = await page.evaluate(() => {
    return Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight
    ) - window.innerHeight;
  });
  
  let currentScroll = 0;
  let targetScroll = 0;
  
  while (Date.now() - startTime < durationSeconds * 1000) {
    const elapsed = (Date.now() - startTime) / 1000;
    const progress = Math.min(elapsed / durationSeconds, 1);
    const speedVariation = 0.2 + Math.random() * 1.3;
    targetScroll = maxScroll * progress * speedVariation;
    targetScroll = Math.min(targetScroll, maxScroll);
    
    if (targetScroll > currentScroll) {
      const scrollStep = (targetScroll - currentScroll) / 3;
      currentScroll += scrollStep;
      currentScroll = Math.min(currentScroll, maxScroll);
      await page.evaluate((scroll) => {
        window.scrollTo({ top: scroll, behavior: 'auto' });
      }, currentScroll);
    }
    
    if (Math.random() < 0.15) {
      await randomDelay(0.2, 0.6);
    }
    const baseDelay = 0.03 + (1 - speedVariation) * 0.12;
    await randomDelay(baseDelay, baseDelay * 1.5);
  }
  
  await page.evaluate((scroll) => {
    window.scrollTo({ top: scroll, behavior: 'smooth' });
  }, Math.min(targetScroll, maxScroll));
}

async function waitAndRead(page) {
  const waitTime = 1.212312 + Math.random() * (6.89822 - 1.212312);
  await scrollWhileReading(page, waitTime);
}

// Extract property data from PDF text using context-aware extraction
async function extractPropertyDataFromPDF(pdfText, expectedSuburb, expectedPostcode) {
  try {
    if (!pdfText || pdfText.length < 100) {
      return null;
    }
    
    // Context-aware extraction from PDF text
    const lines = pdfText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const fullText = pdfText.toLowerCase();
    
    // Extract address - look for street address pattern
    let address = '';
    for (const line of lines) {
      // Look for address pattern: number + street name
      if (/^\d+[a-z]?\s+[a-z\s]+(?:street|road|avenue|drive|court|crescent|way|place|lane|grove|terrace|boulevard|close|circuit|parade)/i.test(line)) {
        address = line.trim();
        // Take first 100 chars to avoid extra text
        if (address.length > 100) {
          address = address.substring(0, 100).trim();
        }
        break;
      }
    }
    
    // Extract suburb and postcode
    let suburb = expectedSuburb || '';
    let postcode = expectedPostcode || '';
    
    // Try to extract from address or text
    if (address) {
      const postcodeMatch = address.match(/\b(\d{4})\b/);
      if (postcodeMatch) {
        postcode = postcodeMatch[1];
      }
      
      // Extract suburb name
      const suburbMatch = address.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+\d{4}/);
      if (suburbMatch) {
        suburb = suburbMatch[1];
      }
    }
    
    // Fallback: search for suburb and postcode in text
    if (!suburb || !postcode) {
      for (const line of lines) {
        // Look for suburb pattern
        if (!suburb && /^[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+VIC\s+\d{4}$/i.test(line)) {
          const match = line.match(/^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+VIC\s+(\d{4})$/i);
          if (match) {
            suburb = match[1];
            postcode = match[2];
            break;
          }
        }
      }
    }
    
    // Extract price - context-aware (prioritize listing prices, exclude sold prices)
    let price = 0;
    
    // Define keywords for filtering
    const listingPriceKeywords = ['price', 'guide', 'offers', 'auction', 'asking', 'for sale'];
    const soldKeywords = ['sold', 'sold for', 'sold at', 'sold price', 'sold by'];
    
    // First, try to find listing prices (not sold prices)
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lowerLine = line.toLowerCase();
      
      // Skip if this line mentions "sold"
      if (soldKeywords.some(kw => lowerLine.includes(kw))) {
        continue;
      }
      
      if (listingPriceKeywords.some(kw => lowerLine.includes(kw))) {
        // This line might contain listing price
        const extractedPrice = parsePriceFromText(line);
        if (extractedPrice && extractedPrice >= 100000 && extractedPrice <= 10000000) {
          price = extractedPrice;
          break;
        }
      }
    }
    
    // Strategy 2: Look for dollar amounts in reasonable range (avoid sold prices)
    if (price === 0) {
      const pricePatterns = [
        /\$?\s*([\d,]{6,7})\b/g, // 6-7 digit numbers (likely prices)
        /\$?\s*([\d,]+)\s*(?:k|K|000)\b/gi, // Prices with k suffix
        /\$?\s*([\d,]+)\s*[-–—to]+\s*\$?\s*([\d,]+)/gi // Price ranges
      ];
      
      const fullTextLower = pdfText.toLowerCase();
      
      for (const pattern of pricePatterns) {
        const matches = [...pdfText.matchAll(pattern)];
        for (const match of matches) {
          const matchText = match[0];
          const matchIndex = match.index || 0;
          
          // Check context around the match - skip if near "sold" keywords
          const contextStart = Math.max(0, matchIndex - 50);
          const contextEnd = Math.min(pdfText.length, matchIndex + matchText.length + 50);
          const context = pdfText.substring(contextStart, contextEnd).toLowerCase();
          
          // Skip if context contains sold keywords
          if (soldKeywords.some(kw => context.includes(kw))) {
            continue;
          }
          
          const extractedPrice = parsePriceFromText(matchText);
          if (extractedPrice && extractedPrice >= 100000 && extractedPrice <= 10000000) {
            price = extractedPrice;
            break;
          }
        }
        if (price > 0) break;
      }
    }
    
    // Extract bedrooms - improved context-aware extraction
    let bedrooms = 0;
    const bedPatterns = [
      /(\d+)\s*(?:bed|bedroom|bedrooms|br|beds)/i,
      /bedrooms?[:\s]+(\d+)/i,
      /(\d+)\s*bed/i,
      /bed[:\s]+(\d+)/i,
      /(\d+)\s*br\b/i,
      /\b(\d+)\s*(?:bedroom|bed)/i
    ];
    
    // Try each pattern and take the first valid match
    for (const pattern of bedPatterns) {
      const matches = [...pdfText.matchAll(new RegExp(pattern.source, 'gi'))];
      for (const match of matches) {
        const bedCount = parseInt(match[1]);
        // Validate it's a reasonable bedroom count (1-10)
        if (bedCount >= 1 && bedCount <= 10) {
          bedrooms = bedCount;
          break;
        }
      }
      if (bedrooms > 0) break;
    }
    
    // Fallback: look for common patterns like "3 bed 2 bath" or "3BR 2BA"
    if (bedrooms === 0) {
      const commonPattern = /(\d+)\s*(?:bed|br|bedroom).*?(\d+)\s*(?:bath|ba|bathroom)/i;
      const match = pdfText.match(commonPattern);
      if (match && parseInt(match[1]) >= 1 && parseInt(match[1]) <= 10) {
        bedrooms = parseInt(match[1]);
      }
    }
    
    // Extract bathrooms
    let bathrooms = 0;
    const bathPatterns = [
      /(\d+(?:\.\d+)?)\s*(?:bath|bathroom|bathrooms)/i,
      /bathrooms?[:\s]+(\d+(?:\.\d+)?)/i
    ];
    for (const pattern of bathPatterns) {
      const match = pdfText.match(pattern);
      if (match) {
        bathrooms = parseFloat(match[1]);
        if (bathrooms >= 0 && bathrooms <= 10) break;
      }
    }
    
    // Extract land size
    let landSize = 0;
    const landPatterns = [
      /(\d+)\s*(?:m²|sqm|sq\s*m|square\s*meter)/i,
      /land[:\s]+(\d+)/i
    ];
    for (const pattern of landPatterns) {
      const match = pdfText.match(pattern);
      if (match) {
        landSize = parseInt(match[1]);
        if (landSize >= 0) break;
      }
    }
    
    // Extract property type
    let propertyType = 'house';
    const typeKeywords = {
      'house': ['house', 'home', 'residence'],
      'unit': ['unit', 'apartment', 'flat'],
      'townhouse': ['townhouse', 'town house'],
      'apartment': ['apartment', 'flat'],
      'villa': ['villa'],
      'duplex': ['duplex']
    };
    
    for (const [type, keywords] of Object.entries(typeKeywords)) {
      if (keywords.some(kw => fullText.includes(kw))) {
        propertyType = type;
        break;
      }
    }
    
    return {
      address,
      suburb: suburb || expectedSuburb,
      postcode: postcode || expectedPostcode,
      price,
      propertyType,
      landSize,
      bedrooms,
      bathrooms
    };
  } catch (error) {
    console.error(`   Error extracting data from PDF: ${error.message}`);
    return null;
  }
}

// Helper to parse price from text
function parsePriceFromText(text) {
  if (!text) return 0;
  
  // Look for range
  const rangeMatch = text.match(/\$?\s*([\d,]+)\s*(?:k|K|000)?\s*[-–—to]+\s*\$?\s*([\d,]+)\s*(?:k|K|000)?/i);
  if (rangeMatch) {
    let minPrice = rangeMatch[1].replace(/,/g, '');
    let maxPrice = rangeMatch[2].replace(/,/g, '');
    
    if (text.toLowerCase().includes('k')) {
      if (!minPrice.endsWith('000')) minPrice = minPrice + '000';
      if (!maxPrice.endsWith('000')) maxPrice = maxPrice + '000';
    }
    
    minPrice = parseInt(minPrice);
    maxPrice = parseInt(maxPrice);
    
    if (minPrice > 0 && maxPrice > 0 && maxPrice > minPrice) {
      const range = maxPrice - minPrice;
      return Math.round(minPrice + (range * 0.7));
    }
  }
  
  // Single price
  let cleanPrice = text.replace(/[^0-9kK]/g, '');
  if (cleanPrice.toLowerCase().includes('k')) {
    cleanPrice = cleanPrice.replace(/[^0-9]/g, '') + '000';
  } else {
    cleanPrice = cleanPrice.replace(/[^0-9]/g, '');
  }
  
  if (cleanPrice) {
    const price = parseInt(cleanPrice);
    if (price >= 100000 && price <= 10000000) {
      return price;
    }
  }
  
  return 0;
}

// Legacy function - kept for compatibility but not used
async function extractPropertyData(page, url, expectedSuburb) {
  try {
    const data = await page.evaluate((expectedSuburb) => {
      const getText = (selector) => {
        const el = document.querySelector(selector);
        return el ? el.textContent.trim() : '';
      };
      
      const getNumber = (selector) => {
        const text = getText(selector);
        const match = text.replace(/[^0-9]/g, '');
        return match ? parseInt(match) : 0;
      };
      
      // Extract address - multiple strategies
      let address = '';
      const addressSelectors = [
        '[data-testid="address"]',
        'h1[data-testid="property-address"]',
        'h1[class*="address"]',
        'h1',
        '.property-address',
        '[class*="address"]'
      ];
      
      for (const selector of addressSelectors) {
        const el = document.querySelector(selector);
        if (el) {
          const text = el.textContent.trim();
          // Address should contain street name and number
          if (text.length > 5 && text.length < 100 && /\d/.test(text)) {
            address = text;
            break;
          }
        }
      }
      
      // Extract suburb and postcode from address or separate fields
      let suburb = expectedSuburb || '';
      let postcode = '';
      
      // Try to extract from address
      if (address) {
        const postcodeMatch = address.match(/\b(\d{4})\b/);
        if (postcodeMatch) {
          postcode = postcodeMatch[1];
        }
        
        // Extract suburb name (usually before postcode)
        const suburbMatch = address.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+\d{4}/);
        if (suburbMatch) {
          suburb = suburbMatch[1];
        }
      }
      
      // Try separate suburb/postcode fields
      if (!suburb || !postcode) {
        const suburbSelectors = [
          '[data-testid*="suburb"]',
          '[class*="suburb"]',
          '.suburb'
        ];
        for (const selector of suburbSelectors) {
          const el = document.querySelector(selector);
          if (el) {
            const text = el.textContent.trim();
            if (text && !suburb) suburb = text;
          }
        }
        
        const postcodeSelectors = [
          '[data-testid*="postcode"]',
          '[class*="postcode"]'
        ];
        for (const selector of postcodeSelectors) {
          const el = document.querySelector(selector);
          if (el) {
            const text = el.textContent.trim();
            const match = text.match(/\d{4}/);
            if (match) {
              postcode = match[0];
              break;
            }
          }
        }
      }
      
      // Extract price using intelligent extraction
      let price = 0;
      const priceSelectors = [
        '[data-testid="price"]',
        '[class*="price"]',
        '.price',
        '[aria-label*="price" i]',
        'h2[class*="price"]',
        'div[class*="price"]',
        '[data-testid*="price"]'
      ];
      
      // Use intelligent extraction
      const pageContent = document;
      const priceElements = [];
      for (const selector of priceSelectors) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          const text = el.textContent.trim();
          if (text && text.length < 50) {
            priceElements.push(text);
          }
        });
      }
      
      // Try to parse price from elements
      for (const priceText of priceElements) {
        // Look for range
        const rangeMatch = priceText.match(/\$?\s*([\d,]+)\s*(?:k|K|000)?\s*[-–—to]+\s*\$?\s*([\d,]+)\s*(?:k|K|000)?/i);
        if (rangeMatch) {
          let minPrice = rangeMatch[1].replace(/,/g, '');
          let maxPrice = rangeMatch[2].replace(/,/g, '');
          if (priceText.toLowerCase().includes('k')) {
            if (!minPrice.endsWith('000')) minPrice = minPrice + '000';
            if (!maxPrice.endsWith('000')) maxPrice = maxPrice + '000';
          }
          minPrice = parseInt(minPrice);
          maxPrice = parseInt(maxPrice);
          if (minPrice > 0 && maxPrice > 0 && maxPrice > minPrice) {
            const range = maxPrice - minPrice;
            price = Math.round(minPrice + (range * 0.7));
            if (price >= 100000 && price <= 10000000) break;
          }
        } else {
          // Single price
          let cleanPrice = priceText.replace(/[^0-9kK]/g, '');
          if (cleanPrice.toLowerCase().includes('k')) {
            cleanPrice = cleanPrice.replace(/[^0-9]/g, '') + '000';
          } else {
            cleanPrice = cleanPrice.replace(/[^0-9]/g, '');
          }
          if (cleanPrice) {
            const parsedPrice = parseInt(cleanPrice);
            if (parsedPrice >= 100000 && parsedPrice <= 10000000) {
              price = parsedPrice;
              break;
            }
          }
        }
      }
      
      // Fallback: search body text
      if (price === 0) {
        const bodyText = document.body ? document.body.innerText : '';
        const pricePatterns = [
          /\$?\s*([\d,]+)\s*(?:k|K|000)?\s*[-–—to]+\s*\$?\s*([\d,]+)\s*(?:k|K|000)?/i,
          /\$\s*([\d,]{6,7})\b/i, // 6-7 digit price
          /\$\s*([\d,]+)\s*(?:k|K)\b/i
        ];
        
        for (const pattern of pricePatterns) {
          const match = bodyText.match(pattern);
          if (match) {
            if (match[2]) {
              // Range
              let minPrice = match[1].replace(/,/g, '');
              let maxPrice = match[2].replace(/,/g, '');
              if (bodyText.toLowerCase().includes('k')) {
                if (!minPrice.endsWith('000')) minPrice = minPrice + '000';
                if (!maxPrice.endsWith('000')) maxPrice = maxPrice + '000';
              }
              minPrice = parseInt(minPrice);
              maxPrice = parseInt(maxPrice);
              if (minPrice > 0 && maxPrice > 0 && maxPrice > minPrice) {
                const range = maxPrice - minPrice;
                price = Math.round(minPrice + (range * 0.7));
                if (price >= 100000 && price <= 10000000) break;
              }
            } else {
              // Single price
              let cleanPrice = match[1].replace(/,/g, '');
              if (bodyText.toLowerCase().includes('k') && cleanPrice.length <= 3) {
                cleanPrice = cleanPrice + '000';
              }
              const parsedPrice = parseInt(cleanPrice);
              if (parsedPrice >= 100000 && parsedPrice <= 10000000) {
                price = parsedPrice;
                break;
              }
            }
          }
        }
      }
      
      // Extract property features
      let bedrooms = 0;
      let bathrooms = 0;
      let landSize = 0;
      let propertyType = 'house';
      
      const pageBodyText = document.body ? document.body.innerText.toLowerCase() : '';
      
      // Extract bedrooms
      const bedMatch = pageBodyText.match(/(\d+)\s*(?:bed|bedroom|bedrooms)/i);
      if (bedMatch) {
        bedrooms = parseInt(bedMatch[1]);
      } else {
        const bedEl = document.querySelector('[data-testid*="bed"], [aria-label*="bed" i], [class*="bed"]');
        if (bedEl) {
          bedrooms = getNumber('[data-testid*="bed"], [aria-label*="bed" i], [class*="bed"]');
        }
      }
      
      // Extract bathrooms
      const bathMatch = pageBodyText.match(/(\d+(?:\.\d+)?)\s*(?:bath|bathroom|bathrooms)/i);
      if (bathMatch) {
        bathrooms = parseFloat(bathMatch[1]);
      } else {
        const bathEl = document.querySelector('[data-testid*="bath"], [aria-label*="bath" i], [class*="bath"]');
        if (bathEl) {
          bathrooms = getNumber('[data-testid*="bath"], [aria-label*="bath" i], [class*="bath"]');
        }
      }
      
      // Extract land size
      const landMatch = pageBodyText.match(/(\d+)\s*(?:m²|sqm|sq\s*m|square\s*meter)/i);
      if (landMatch) {
        landSize = parseInt(landMatch[1]);
      } else {
        const landEl = document.querySelector('[data-testid*="land"], [class*="land"]');
        if (landEl) {
          landSize = getNumber('[data-testid*="land"], [class*="land"]');
        }
      }
      
      // Extract property type
      const typeKeywords = {
        'house': ['house', 'home', 'residence'],
        'unit': ['unit', 'apartment', 'flat'],
        'townhouse': ['townhouse', 'town house'],
        'apartment': ['apartment', 'flat'],
        'villa': ['villa'],
        'duplex': ['duplex']
      };
      
      for (const [type, keywords] of Object.entries(typeKeywords)) {
        if (keywords.some(kw => pageBodyText.includes(kw))) {
          propertyType = type;
          break;
        }
      }
      
      return {
        address,
        suburb,
        postcode,
        price,
        propertyType,
        landSize,
        bedrooms,
        bathrooms,
        url: window.location.href
      };
    }, expectedSuburb);
    
    // Validate extracted data
    const validation = validatePropertyData(data, expectedSuburb);
    
    if (!validation.isValid) {
      console.log(`   ⚠️  Validation warnings for ${data.address || 'property'}:`);
      validation.errors.forEach(err => console.log(`      - ${err}`));
    }
    
    // Ensure suburb and postcode are set from expected values if missing
    if (!data.suburb && expectedSuburb) {
      data.suburb = expectedSuburb;
    }
    
    return data;
  } catch (error) {
    console.error(`   Error extracting data: ${error.message}`);
    return null;
  }
}

// Write CSV header (only if file doesn't exist or is empty)
function writeCSVHeader() {
  const header = 'id,address,suburb,postcode,price,propertyType,landSize,bedrooms,bathrooms,streetQuality,renovationCost,hampzScore,gaheeScore,bScore,isFavorite,tags,notes,dateAdded,sourceUrl\n';
  
  // Only write header if file doesn't exist or is empty
  if (!fs.existsSync(OUTPUT_CSV) || fs.readFileSync(OUTPUT_CSV, 'utf-8').trim().length === 0) {
    fs.writeFileSync(OUTPUT_CSV, header);
    console.log('📝 Created new CSV file with header');
  } else {
    console.log('📝 Appending to existing CSV file');
  }
  
  // Create property-files directory
  if (!fs.existsSync(PROPERTY_FILES_DIR)) {
    fs.mkdirSync(PROPERTY_FILES_DIR, { recursive: true });
  }
}

// Download PDF for property (returns temp filename, will be renamed later)
async function downloadPropertyPDF(page, tempId) {
  try {
    const filename = `temp-${tempId}.pdf`;
    const filepath = path.join(PROPERTY_FILES_DIR, filename);
    
    await page.pdf({
      path: filepath,
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
    });
    
    return filepath;
  } catch (error) {
    console.log(`      ⚠️  Could not download PDF: ${error.message}`);
    return null;
  }
}

// Extract text from PDF
async function extractTextFromPDF(pdfPath) {
  try {
    const dataBuffer = fs.readFileSync(pdfPath);
    // pdf-parse v2+ - PDFParse class constructor takes options object with 'data' property
    const parser = new pdfParse({ data: dataBuffer });
    const result = await parser.getText();
    return result.text || '';
  } catch (error) {
    console.log(`      ⚠️  Could not extract text from PDF: ${error.message}`);
    return '';
  }
}

// Rename PDF to property address
function renamePDFToAddress(oldPath, address) {
  try {
    if (!oldPath || !fs.existsSync(oldPath)) return null;
    
    // Clean address for filename
    const cleanAddress = address
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .toLowerCase()
      .substring(0, 100); // Limit length
    
    const dir = path.dirname(oldPath);
    const newFilename = `${cleanAddress}.pdf`;
    const newPath = path.join(dir, newFilename);
    
    // If file already exists, add timestamp
    if (fs.existsSync(newPath)) {
      const timestamp = Date.now();
      const newFilenameWithTimestamp = `${cleanAddress}-${timestamp}.pdf`;
      const newPathWithTimestamp = path.join(dir, newFilenameWithTimestamp);
      fs.renameSync(oldPath, newPathWithTimestamp);
      return path.basename(newPathWithTimestamp);
    }
    
    fs.renameSync(oldPath, newPath);
    return path.basename(newPath);
  } catch (error) {
    console.log(`      ⚠️  Could not rename PDF: ${error.message}`);
    return null;
  }
}

// Append property to CSV (saves immediately after each property)
async function appendPropertyToCSV(property) {
  const id = Date.now() + Math.floor(Math.random() * 1000);
  const dateAdded = new Date().toISOString().split('T')[0];
  
  const row = [
    id,
    `"${(property.address || '').replace(/"/g, '""')}"`,
    `"${property.suburb || ''}"`,
    property.postcode || '',
    property.price || 0,
    property.propertyType || 'house',
    property.landSize || 0,
    property.bedrooms || 0,
    property.bathrooms || 0,
    3, // streetQuality (default)
    0, // renovationCost (default)
    0, // hampzScore (default)
    0, // gaheeScore (default)
    0, // bScore (default)
    'No', // isFavorite
    'FALSE', // tags
    '', // notes
    dateAdded,
    `"${property.url || ''}"`
  ].join(',') + '\n';
  
  // Append and save immediately (synchronous write)
  fs.appendFileSync(OUTPUT_CSV, row);
  
  // Verify file was written
  if (fs.existsSync(OUTPUT_CSV)) {
    // File successfully saved
  }
  
  return { ...property, id };
}

// Generate HTML viewer page
function generateHTMLViewer(properties) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Scraped Properties - ${properties.length} Properties</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: #f5f5f5;
            padding: 20px;
        }
        .header {
            background: white;
            padding: 30px;
            border-radius: 10px;
            margin-bottom: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header h1 { color: #333; margin-bottom: 10px; }
        .stats {
            display: flex;
            gap: 20px;
            margin-top: 20px;
        }
        .stat {
            padding: 10px 20px;
            background: #f0f0f0;
            border-radius: 5px;
        }
        .properties-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 20px;
        }
        .property-card {
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            transition: transform 0.2s;
        }
        .property-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }
        .property-content {
            padding: 20px;
        }
        .property-price {
            font-size: 24px;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 10px;
        }
        .property-address {
            font-size: 18px;
            color: #34495e;
            margin-bottom: 5px;
        }
        .property-location {
            color: #7f8c8d;
            margin-bottom: 15px;
        }
        .property-type {
            display: inline-block;
            padding: 5px 10px;
            background: #ecf0f1;
            border-radius: 5px;
            font-size: 12px;
            margin-bottom: 15px;
        }
        .property-details {
            display: flex;
            gap: 15px;
            margin-bottom: 15px;
        }
        .detail {
            color: #555;
        }
        .btn {
            display: inline-block;
            padding: 10px 20px;
            background: #3498db;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            transition: background 0.2s;
        }
        .btn:hover {
            background: #2980b9;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🏠 Scraped Properties</h1>
        <p>Properties where calculated price (70% towards high end) < $${SAVE_MAX_PRICE.toLocaleString()} in Frankston, Cranbourne, and surrounding suburbs</p>
        <div class="stats">
            <div class="stat"><strong>${properties.length}</strong> Properties</div>
            <div class="stat"><strong>${properties.length > 0 ? new Set(properties.map(p => p.suburb)).size : 0}</strong> Suburbs</div>
            ${properties.length > 0 ? `<div class="stat"><strong>$${Math.min(...properties.map(p => p.price)).toLocaleString()}</strong> - <strong>$${Math.max(...properties.map(p => p.price)).toLocaleString()}</strong></div>` : ''}
        </div>
    </div>
    
    <div class="properties-grid">
${properties.map(property => {
  return `        <div class="property-card">
                <div class="property-content">
                    <div class="property-price">$${property.price.toLocaleString()}</div>
                    <div class="property-address">${property.address || 'Address not available'}</div>
                    <div class="property-location">${property.suburb}, VIC ${property.postcode}</div>
                    <span class="property-type">${property.propertyType || 'house'}</span>
                    <div class="property-details">
                        ${property.bedrooms ? `<div class="detail">🛏️ ${property.bedrooms} bed</div>` : ''}
                        ${property.bathrooms ? `<div class="detail">🚿 ${property.bathrooms} bath</div>` : ''}
                        ${property.landSize ? `<div class="detail">📐 ${property.landSize}m²</div>` : ''}
                    </div>
                    <div class="property-links">
                        <a href="${property.url}" target="_blank" class="btn btn-primary">View on Domain</a>
                    </div>
                </div>
            </div>`;
}).join('\n')}
    </div>
    
    <script>
        console.log('Properties loaded: ${properties.length}');
    </script>
</body>
</html>`;
  fs.writeFileSync(HTML_OUTPUT, html);
}

// Main scraping function
async function scrapeProperties() {
  console.log('🚀 Starting comprehensive property scraper...\n');
  console.log(`📋 Searching ${SUBURBS_TO_SEARCH.length} suburbs`);
  console.log(`🔍 Search filter: Up to $${SEARCH_MAX_PRICE.toLocaleString()}`);
  console.log(`💰 Save filter: Only properties where calculated price (70% towards high end) < $${SAVE_MAX_PRICE.toLocaleString()}\n`);

  // Load suburbs data for validation
  loadSuburbsData();

  // Initialize CSV
  writeCSVHeader();
  let totalProperties = 0;
  const allProperties = [];

  // Try to use installed Chrome
  let browser;
  try {
    browser = await chromium.launch({
      headless: false,
      channel: 'chrome',
      slowMo: 100,
      args: ['--disable-blink-features=AutomationControlled']
    });
    console.log('✅ Using your installed Chrome\n');
  } catch (e) {
    browser = await chromium.launch({
      headless: false,
      slowMo: 100,
      args: ['--disable-blink-features=AutomationControlled']
    });
    console.log('✅ Using Playwright browser\n');
  }

  try {
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });

    const page = await context.newPage();

    // Stealth: Override webdriver property
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
    });

    for (let i = 0; i < SUBURBS_TO_SEARCH.length; i++) {
      const suburb = SUBURBS_TO_SEARCH[i];
      console.log(`\n[${i + 1}/${SUBURBS_TO_SEARCH.length}] Processing ${suburb.name} (${suburb.postcode})...`);

      try {
        // Build search URL with price filter - Domain.com.au uses ?price=0-750000 format
        const searchUrl = `https://www.domain.com.au/sale/${suburb.name.toLowerCase().replace(/\s+/g, '-')}-${suburb.state}-${suburb.postcode}/?price=0-${SEARCH_MAX_PRICE}`;
        
        console.log(`   🔍 Using price filter: $0 - $${SEARCH_MAX_PRICE.toLocaleString()}`);
        
        await page.goto(searchUrl, {
          waitUntil: 'domcontentloaded',
          timeout: 30000
        });

        await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
        await waitAndRead(page);
        
        // Also try to apply filter using website's filter controls as backup
        console.log(`   🔍 Verifying price filter is applied...`);
        try {
          // Look for price filter controls - Domain.com.au typically has filter buttons/inputs
          const filterSelectors = [
            'button[aria-label*="price" i]',
            'button[aria-label*="filter" i]',
            '[data-testid*="filter"]',
            '[data-testid*="price"]',
            'button:has-text("Filters")',
            'button:has-text("Filter")',
            '.filter-button',
            '[class*="filter"] button'
          ];
          
          let filterButton = null;
          for (const selector of filterSelectors) {
            try {
              const button = page.locator(selector).first();
              if (await button.isVisible({ timeout: 2000 })) {
                filterButton = button;
                break;
              }
            } catch (e) {
              continue;
            }
          }
          
          if (filterButton) {
            await filterButton.click();
            await randomDelay(1, 2);
            
            // Look for max price dropdown/slider - Domain.com.au uses dropdowns
            const priceDropdownSelectors = [
              'select[name*="maxprice" i]',
              'select[name*="price-max" i]',
              '[data-testid*="max-price"] select',
              '[data-testid*="price-max"]',
              'select[aria-label*="max price" i]',
              '.price-filter select',
              '[class*="price"] select',
              'select:has(option[value*="750"])',
              'select:has(option:has-text("750"))'
            ];
            
            let priceSet = false;
            
            // Try dropdown first
            for (const selector of priceDropdownSelectors) {
              try {
                const dropdown = page.locator(selector).first();
                if (await dropdown.isVisible({ timeout: 2000 })) {
                  // Try to select option with value closest to 750000
                  const options = await dropdown.locator('option').all();
                  let bestOption = null;
                  let bestValue = 0;
                  
                  for (const option of options) {
                    const value = await option.getAttribute('value');
                    const text = await option.textContent();
                    if (value) {
                      const numValue = parseInt(value.replace(/[^0-9]/g, ''));
                      if (numValue >= SEARCH_MAX_PRICE && (bestValue === 0 || numValue < bestValue)) {
                        bestValue = numValue;
                        bestOption = option;
                      }
                    } else if (text) {
                      const numValue = parseInt(text.replace(/[^0-9]/g, ''));
                      if (numValue >= SEARCH_MAX_PRICE && (bestValue === 0 || numValue < bestValue)) {
                        bestValue = numValue;
                        bestOption = option;
                      }
                    }
                  }
                  
                  if (bestOption) {
                    await dropdown.selectOption({ value: bestValue.toString() });
                    priceSet = true;
                    await randomDelay(0.5, 1);
                    break;
                  } else {
                    // Try selecting by text
                    await dropdown.selectOption({ label: /750/i });
                    priceSet = true;
                    await randomDelay(0.5, 1);
                    break;
                  }
                }
              } catch (e) {
                continue;
              }
            }
            
            // If dropdown not found, try range slider
            if (!priceSet) {
              const sliderSelectors = [
                'input[type="range"]',
                '[role="slider"]',
                '[data-testid*="slider"]',
                '[class*="slider"]',
                '[class*="range"]'
              ];
              
              for (const selector of sliderSelectors) {
                try {
                  const slider = page.locator(selector).first();
                  if (await slider.isVisible({ timeout: 2000 })) {
                    // Get slider attributes
                    const max = await slider.getAttribute('max');
                    const min = await slider.getAttribute('min');
                    const step = await slider.getAttribute('step') || '10000';
                    
                    if (max) {
                      const maxValue = parseInt(max);
                      const targetValue = Math.min(SEARCH_MAX_PRICE, maxValue);
                      await slider.fill(targetValue.toString());
                      // Also try setting value attribute
                      await page.evaluate((el, val) => {
                        el.value = val;
                        el.dispatchEvent(new Event('input', { bubbles: true }));
                        el.dispatchEvent(new Event('change', { bubbles: true }));
                      }, await slider.elementHandle(), targetValue);
                      priceSet = true;
                      await randomDelay(0.5, 1);
                      break;
                    }
                  }
                } catch (e) {
                  continue;
                }
              }
            }
            
            // If still not set, try input field
            if (!priceSet) {
              const priceInputSelectors = [
                'input[name*="maxprice" i]',
                'input[name*="price-max" i]',
                'input[placeholder*="max" i]',
                'input[aria-label*="max price" i]',
                '[data-testid*="max-price"] input',
                'input[type="number"]'
              ];
              
              for (const selector of priceInputSelectors) {
                try {
                  const input = page.locator(selector).first();
                  if (await input.isVisible({ timeout: 2000 })) {
                    await input.fill(SEARCH_MAX_PRICE.toString());
                    priceSet = true;
                    await randomDelay(0.5, 1);
                    break;
                  }
                } catch (e) {
                  continue;
                }
              }
            }
            
            // Apply the filter if we set a price
            if (priceSet) {
              // Look for apply/submit button
              const applySelectors = [
                'button:has-text("Apply")',
                'button:has-text("Search")',
                'button:has-text("Show results")',
                'button[type="submit"]',
                '[data-testid*="apply"]',
                '[data-testid*="search"]'
              ];
              
              for (const applySelector of applySelectors) {
                try {
                  const applyBtn = page.locator(applySelector).first();
                  if (await applyBtn.isVisible({ timeout: 2000 })) {
                    await applyBtn.click();
                    await randomDelay(2, 3);
                    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
                    break;
                  }
                } catch (e) {
                  continue;
                }
              }
            }
          } else {
            // URL parameter already set, filter should be applied
            console.log(`   ✅ Price filter applied via URL parameter`);
          }
          
          await waitAndRead(page);
        } catch (filterError) {
          console.log(`   ⚠️  Error applying filters: ${filterError.message}, continuing with search...`);
        }

        // Find all property links (exclude sold properties)
        const propertyLinks = await page.evaluate(() => {
          const links = Array.from(document.querySelectorAll('a[href]'));
          return links
            .map(link => {
              const href = link.getAttribute('href');
              const text = link.textContent?.toLowerCase() || '';
              // Check if link or nearby text indicates sold
              const isSold = text.includes('sold') || 
                           (link.closest('[class*="sold"]') !== null) ||
                           (link.closest('article')?.textContent?.toLowerCase().includes('sold'));
              return { href, isSold };
            })
            .filter(item => item.href && (
              item.href.includes('/property/') || 
              /\/\d+-[a-z-]+-[a-z]+-\d+-\d+/.test(item.href)
            ))
            .filter(item => !item.href.includes('#') && 
                           !item.href.includes('list-') && 
                           !item.href.includes('page-') &&
                           !item.href.includes('/sold/') &&
                           !item.isSold)
            .map(item => item.href);
        });

        // Get unique links - process ALL properties
        const uniqueLinks = [...new Set(propertyLinks)]
          .map(link => link.startsWith('http') ? link : `https://www.domain.com.au${link}`);

        if (uniqueLinks.length === 0) {
          console.log(`   ⚠️  No properties found for ${suburb.name}`);
          continue;
        }

        console.log(`   📋 Found ${uniqueLinks.length} properties`);

        // Process each property
        for (let j = 0; j < uniqueLinks.length; j++) {
          const propertyUrl = uniqueLinks[j];
          console.log(`\n   [${j + 1}/${uniqueLinks.length}] Processing: ${propertyUrl}`);

          try {
            await page.goto(propertyUrl, {
              waitUntil: 'domcontentloaded',
              timeout: 30000
            });

            await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
            await waitAndRead(page);

            // Check if property is sold - skip if it is
            const isSold = await page.evaluate(() => {
              const bodyText = document.body?.textContent?.toLowerCase() || '';
              const url = window.location.href.toLowerCase();
              return bodyText.includes('sold') && 
                     (bodyText.includes('sold by') || bodyText.includes('sold for') || bodyText.includes('sold price')) ||
                     url.includes('/sold/');
            });
            
            if (isSold) {
              console.log(`   ⏭️  Skipped: Property is sold`);
              continue;
            }

            // Download PDF first (before extracting data)
            const tempId = Date.now() + Math.floor(Math.random() * 1000);
            const pdfPath = await downloadPropertyPDF(page, tempId);
            
            if (!pdfPath) {
              console.log(`   ⚠️  Could not download PDF, skipping...`);
              continue;
            }
            
            console.log(`      📄 PDF downloaded: ${path.basename(pdfPath)}`);
            
            // Extract text from PDF
            const pdfText = await extractTextFromPDF(pdfPath);
            
            if (!pdfText || pdfText.length < 100) {
              console.log(`   ⚠️  Could not extract text from PDF, skipping...`);
              fs.unlinkSync(pdfPath); // Clean up
              continue;
            }
            
            // Extract property data from PDF text
            const propertyData = await extractPropertyDataFromPDF(pdfText, suburb.name, suburb.postcode);
            
            if (!propertyData) {
              console.log(`   ⚠️  Could not extract property data from PDF, skipping...`);
              fs.unlinkSync(pdfPath); // Clean up
              continue;
            }
            
            // Add URL to property data
            propertyData.url = propertyUrl;

            // Filter by price: calculated price (70% towards high end) must be below $680k
            if (propertyData && propertyData.price > 0 && propertyData.price <= SAVE_MAX_PRICE) {
              // Ensure suburb and postcode are set
              if (!propertyData.suburb) {
                propertyData.suburb = suburb.name;
              }
              if (!propertyData.postcode) {
                propertyData.postcode = suburb.postcode;
              }

              // Validate extracted data
              const validation = validatePropertyData(propertyData, suburb.name);
              if (!validation.isValid) {
                console.log(`   ⚠️  Validation warnings:`);
                validation.errors.forEach(err => console.log(`      - ${err}`));
              }

              // Save to CSV immediately (saves after each property)
              const savedProperty = await appendPropertyToCSV(propertyData);
              allProperties.push(savedProperty);
              totalProperties++;
              
              console.log(`   ✅ [${totalProperties}] ${propertyData.address} - $${propertyData.price.toLocaleString()}`);
              console.log(`      💰 Price: $${propertyData.price.toLocaleString()} (70% towards high end if range)`);
              console.log(`      💾 Saved to CSV: ${OUTPUT_CSV}`);
              
              // Rename PDF to property address
              if (propertyData.address) {
                const renamedFilename = renamePDFToAddress(pdfPath, propertyData.address);
                if (renamedFilename) {
                  console.log(`      📄 PDF renamed to: ${renamedFilename}`);
                }
              } else {
                // Keep temp name if no address
                console.log(`      📄 PDF kept as: ${path.basename(pdfPath)}`);
              }
            } else {
              console.log(`   ⏭️  Skipped: Calculated price $${propertyData?.price || 0} exceeds $${SAVE_MAX_PRICE.toLocaleString()}`);
              // Clean up PDF if price doesn't match
              if (fs.existsSync(pdfPath)) {
                fs.unlinkSync(pdfPath);
              }
            }

            // Go back to search results
            if (j < uniqueLinks.length - 1) {
              await randomDelay(2, 4);
              await page.goBack();
              await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
              await waitAndRead(page);
            }
          } catch (error) {
            console.error(`   ❌ Error processing property: ${error.message}`);
            continue;
          }
        }

        // Pause between suburbs
        if (i < SUBURBS_TO_SEARCH.length - 1) {
          console.log(`   ⏸️  Pausing before next suburb...`);
          await randomDelay(5, 8);
        }
      } catch (error) {
        console.error(`   ❌ Error processing ${suburb.name}: ${error.message}`);
        continue;
      }
    }

    console.log(`\n✨ Scraping complete!`);
    console.log(`📊 Total properties found: ${totalProperties}`);
    console.log(`💾 Saved to: ${OUTPUT_CSV}`);
    
    // Generate HTML viewer
    console.log('\n📄 Generating HTML viewer...');
    generateHTMLViewer(allProperties);
    console.log(`✅ HTML viewer saved to: ${HTML_OUTPUT}`);
    
    console.log('\n⏸️  Browser will stay open for 10 seconds...');
    await randomDelay(10, 10);

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

// Run the scraper
scrapeProperties()
  .then(() => {
    console.log('\n✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });

