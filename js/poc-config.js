/**
 * HomeScorePro - Proof of Concept Configuration
 * Legal-compliant, cost-effective approach for testing and scaling
 */

// ============================================
// ENVIRONMENT CONFIGURATION
// ============================================

const POC_CONFIG = {
    // Current Phase
    phase: 'proof_of_concept', // 'proof_of_concept', 'beta', 'production'
    
    // Data Sources (avoid API costs during POC)
    dataSource: {
        mode: 'local', // 'local', 'hybrid', 'api'
        files: {
            suburbs: '/data/suburbs.csv',
            properties: '/data/properties.csv',
            config: '/data/config.json'
        }
    },
    
    // API Configuration (disabled for POC)
    apis: {
        enabled: false, // Set to true only after investment secured
        
        domain: {
            enabled: false,
            endpoint: null,
            costPerCall: 0.50,
            monthlyLimit: 0
        },
        
        ptv: {
            enabled: false,
            endpoint: null,
            costPerCall: 0.10,
            monthlyLimit: 0
        },
        
        crime: {
            enabled: false,
            endpoint: null,
            costPerCall: 0.05,
            monthlyLimit: 0
        }
    },
    
    // Testing Mode
    testing: {
        enabled: true,
        password: null, // Set via environment variable
        features: {
            unlimitedSearches: true,
            detailedMetrics: true,
            bulkImport: true,
            exportData: true
        }
    },
    
    // Cost Control
    costControl: {
        dailyLimit: 0, // $0 during POC
        monthlyLimit: 10, // $10 max during testing phase
        alertThreshold: 5, // Alert at $5
        autoShutoff: true // Stop API calls when limit reached
    },
    
    // Feature Flags
    features: {
        onboarding: true,
        saveProperties: true,
        comparison: true,
        locationScout: true,
        dataTable: true,
        sampleProperties: true
    },
    
    // Analytics (privacy-compliant)
    analytics: {
        enabled: false, // Enable only with user consent
        anonymize: true,
        retention: 30 // days
    }
};

// ============================================
// COST-BENEFIT ANALYSIS
// ============================================

const COST_BENEFIT_ANALYSIS = {
    // Phase 1: Proof of Concept (Current)
    poc: {
        duration: '30 days',
        costs: {
            development: 0, // Already built
            hosting: 0, // GitHub Pages free
            data: 0, // Local CSV files
            apis: 0, // Disabled
            total: 0
        },
        metrics: {
            targetUsers: 100,
            conversionRate: 0.15, // 15% target
            avgSessionTime: 300, // 5 minutes
            returnRate: 0.30 // 30% return visitors
        },
        milestones: [
            'Validate core functionality',
            'Gather user feedback',
            'Measure conversion rates',
            'Identify key features'
        ]
    },
    
    // Phase 2: Beta Testing
    beta: {
        duration: '60 days',
        costs: {
            development: 500, // Minor improvements
            hosting: 20, // Upgraded hosting
            data: 50, // Limited API testing
            apis: 100, // 2000 API calls
            total: 670
        },
        metrics: {
            targetUsers: 500,
            conversionRate: 0.20,
            avgSessionTime: 420,
            returnRate: 0.40
        },
        expectedRevenue: {
            subscriptions: 100, // 100 users × $10/month
            monthly: 1000,
            roi: 1.49 // 149% ROI
        }
    },
    
    // Phase 3: Production
    production: {
        duration: 'Ongoing',
        costs: {
            development: 2000, // Full features
            hosting: 100, // Professional hosting
            data: 200, // Full API access
            apis: 500, // 10,000 API calls
            marketing: 500,
            total: 3300
        },
        metrics: {
            targetUsers: 2000,
            conversionRate: 0.25,
            avgSessionTime: 600,
            returnRate: 0.50
        },
        expectedRevenue: {
            subscriptions: 500, // 500 users × $15/month
            monthly: 7500,
            roi: 2.27 // 227% ROI
        }
    },
    
    // Decision Criteria
    triggers: {
        moveToBeta: {
            minUsers: 50,
            minConversion: 0.10,
            minFeedbackScore: 7, // out of 10
            funding: 1000
        },
        moveToProduction: {
            minUsers: 300,
            minConversion: 0.15,
            minRevenue: 500,
            funding: 5000
        }
    }
};

// ============================================
// DEPENDENCY CHECK
// ============================================

function checkDependencies() {
    logger.log('🔍 Running dependency check...');
    
    const dependencies = {
        // Core Files
        'CSS Files': {
            '/css/styles.css': false,
            '/css/modern.css': false,
            '/css/ui-enhancements.css': false
        },
        
        // JavaScript Modules
        'JS Modules': {
            '/js/main.js': false,
            '/js/app.js': false,
            '/js/scoring.js': false,
            '/js/scoring-engine.js': false,
            '/js/data-visualizer.js': false,
            '/js/components.js': false,
            '/js/api.js': false,
            '/js/auth.js': false
        },
        
        // Data Files
        'Data Files': {
            '/data/suburbs.csv': false,
            '/data/properties.csv': false,
            '/data/config.json': false
        },
        
        // Global Objects
        'Global Objects': {
            'Utils': typeof Utils !== 'undefined',
            'UIManager': typeof UIManager !== 'undefined',
            'ScoringEngine': typeof ScoringEngine !== 'undefined',
            'DataVisualizer': typeof DataVisualizer !== 'undefined',
            'HomeScoreApp': typeof HomeScoreApp !== 'undefined',
            'API': typeof API !== 'undefined'
        }
    };
    
    // Check file existence
    const checkFile = async (path, category, key) => {
        try {
            const response = await fetch(path);
            dependencies[category][key] = response.ok;
            return response.ok;
        } catch {
            dependencies[category][key] = false;
            return false;
        }
    };
    
    // Run all checks
    const promises = [];
    
    Object.entries(dependencies).forEach(([category, items]) => {
        if (category !== 'Global Objects') {
            Object.keys(items).forEach(path => {
                promises.push(checkFile(path, category, path));
            });
        }
    });
    
    Promise.all(promises).then(() => {
        // Report results
        logger.log('📊 Dependency Check Results:');
        logger.log('========================');
        
        Object.entries(dependencies).forEach(([category, items]) => {
            logger.log(`\n${category}:`);
            Object.entries(items).forEach(([name, loaded]) => {
                logger.log(`  ${loaded ? '✅' : '❌'} ${name}`);
            });
        });
        
        // Check if all critical dependencies are loaded
        const critical = [
            dependencies['Data Files']['/data/suburbs.csv'],
            dependencies['Data Files']['/data/properties.csv']
        ];
        
        if (critical.every(c => c)) {
            logger.log('\n✅ All critical dependencies loaded!');
        } else {
            logger.error('\n❌ Missing critical dependencies!');
        }
    });
    
    return dependencies;
}

// ============================================
// FUNCTION TEST SUITE
// ============================================

async function testAllFunctions() {
    logger.log('🧪 Running function tests...');
    
    const tests = {
        'Data Loading': {
            test: async () => {
                const response = await fetch('/data/suburbs.csv');
                const text = await response.text();
                return text.length > 0;
            },
            critical: true
        },
        
        'CSV Parsing': {
            test: () => {
                if (typeof parseCSV === 'function') {
                    const sample = 'header1,header2\nvalue1,value2';
                    const result = parseCSV(sample);
                    return result.length === 1;
                }
                return false;
            },
            critical: true
        },
        
        'Scoring Engine': {
            test: () => {
                if (typeof ScoringEngine === 'function') {
                    const engine = new ScoringEngine();
                    const score = engine.calculateScore({
                        price: 1000000,
                        cbdDistance: 10
                    });
                    return score.total > 0;
                }
                return false;
            },
            critical: false
        },
        
        'Data Visualizer': {
            test: () => {
                if (typeof DataVisualizer === 'function') {
                    const viz = new DataVisualizer();
                    return viz !== null;
                }
                return false;
            },
            critical: false
        },
        
        'Local Storage': {
            test: () => {
                try {
                    const testKey = 'test_' + Date.now();
                    localStorage.setItem(testKey, 'test');
                    const value = localStorage.getItem(testKey);
                    localStorage.removeItem(testKey);
                    return value === 'test';
                } catch {
                    return false;
                }
            },
            critical: true
        },
        
        'Session Storage': {
            test: () => {
                try {
                    const testKey = 'test_' + Date.now();
                    sessionStorage.setItem(testKey, 'test');
                    const value = sessionStorage.getItem(testKey);
                    sessionStorage.removeItem(testKey);
                    return value === 'test';
                } catch {
                    return false;
                }
            },
            critical: false
        },
        
        'A-Score Calculation': {
            test: () => {
                if (typeof calculateAScoreForSuburb === 'function') {
                    const suburb = {
                        name: 'Test',
                        growth1yr: 5,
                        rentalYield: 3,
                        irsd_score: 1000
                    };
                    const score = calculateAScoreForSuburb(suburb, 'balanced');
                    return score > 0 && score <= 100;
                }
                return false;
            },
            critical: true
        },
        
        'B-Score Calculation': {
            test: () => {
                // Check if B-Score calculation elements exist
                const elements = [
                    'property-price',
                    'property-type',
                    'bedrooms',
                    'bathrooms'
                ].every(id => document.getElementById(id) !== null);
                return elements;
            },
            critical: false
        }
    };
    
    const results = [];
    
    for (const [name, config] of Object.entries(tests)) {
        try {
            const passed = await config.test();
            results.push({ name, passed, critical: config.critical });
            logger.log(`${passed ? '✅' : '❌'} ${name}${config.critical ? ' (CRITICAL)' : ''}`);
        } catch (error) {
            results.push({ name, passed: false, critical: config.critical, error });
            logger.error(`❌ ${name}${config.critical ? ' (CRITICAL)' : ''}: ${error.message}`);
        }
    }
    
    // Summary
    const passed = results.filter(r => r.passed).length;
    const failed = results.filter(r => !r.passed).length;
    const criticalFailed = results.filter(r => !r.passed && r.critical).length;
    
    logger.log('\n📊 Test Summary:');
    logger.log(`  Passed: ${passed}/${results.length}`);
    logger.log(`  Failed: ${failed}/${results.length}`);
    
    if (criticalFailed > 0) {
        logger.error(`  ⚠️ ${criticalFailed} CRITICAL tests failed!`);
    } else {
        logger.log('  ✅ All critical tests passed!');
    }
    
    return results;
}

// ============================================
// CONSOLE LOGGING CONTROL
// ============================================

const DEBUG = window.location.hostname === 'localhost' || POC_CONFIG.testing.enabled;

const logger = {
    log: (...args) => DEBUG && console.log(...args),
    error: (...args) => console.error(...args), // Always log errors
    warn: (...args) => DEBUG && console.warn(...args),
    info: (...args) => DEBUG && console.info(...args),
    debug: (...args) => DEBUG && console.debug(...args)
};

// Override console methods in production
if (!DEBUG) {
    console.log = () => {};
    console.debug = () => {};
    console.info = () => {};
    // Keep console.error and console.warn for important messages
}

// ============================================
// INITIALIZATION
// ============================================

// Set API URL based on configuration
window.API_BASE_URL = POC_CONFIG.apis.enabled ? 
    'https://api.homescorepro.com' : 
    null; // No API during POC

// Set testing password from environment (not hardcoded)
// This should be set via deployment configuration
window.TESTING_PASSWORD = null; // Remove hardcoded password

// Export configuration for use in other modules
window.POC_CONFIG = POC_CONFIG;
window.COST_BENEFIT_ANALYSIS = COST_BENEFIT_ANALYSIS;
window.checkDependencies = checkDependencies;
window.testAllFunctions = testAllFunctions;
window.logger = logger;

// Auto-run checks if in testing mode
if (POC_CONFIG.testing.enabled) {
    window.addEventListener('DOMContentLoaded', () => {
        logger.log('🚀 HomeScorePro POC Configuration Loaded');
        logger.log(`Phase: ${POC_CONFIG.phase}`);
        logger.log(`Data Source: ${POC_CONFIG.dataSource.mode}`);
        logger.log(`APIs Enabled: ${POC_CONFIG.apis.enabled}`);
        
        // Add test button to page
        const testBtn = document.createElement('button');
        testBtn.textContent = '🧪 Run Tests';
        testBtn.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:9999;padding:10px 20px;background:#4F46E5;color:white;border:none;border-radius:8px;font-weight:600;cursor:pointer;box-shadow:0 4px 6px rgba(0,0,0,0.1);';
        testBtn.onclick = async () => {
            checkDependencies();
            await testAllFunctions();
        };
        document.body.appendChild(testBtn);
    });
}