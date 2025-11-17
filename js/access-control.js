/**
 * HomeScorePro Access Control Utilities
 * CENTRALIZED ACCESS CONTROL - Single source of truth for all paywall logic
 * Last Updated: 2025-11-16
 */

// =====================================================
// ACCESS TIER CONSTANTS
// =====================================================
const ACCESS_TIERS = {
    FREE: 'free',
    PAID: 'paid',
    TESTING: 'testing'
};

const FREE_TIER_LIMITS = {
    MAX_SEARCHES: 3,
    MAX_PROPERTIES_SAVED: 5,
    BLURRED_METRICS: true,
    EXPORT_ENABLED: false
};

// =====================================================
// ACCESS STATE MANAGEMENT
// =====================================================
let accessState = {
    tier: ACCESS_TIERS.FREE,
    searchCount: 0,
    propertiesSaved: 0,
    initialized: false
};

/**
 * Initialize access control system
 * Must be called on page load
 */
function initAccessControl() {
    if (accessState.initialized) return;
    
    // Load search count from storage
    const storedCount = parseInt(sessionStorage.getItem('homescorepro_search_count') || '0');
    accessState.searchCount = storedCount;
    
    // Determine access tier
    accessState.tier = determineAccessTier();
    
    // Load saved properties count
    try {
        const savedProps = localStorage.getItem('homescorepro_saved_properties');
        if (savedProps) {
            const props = JSON.parse(savedProps);
            accessState.propertiesSaved = Array.isArray(props) ? props.length : 0;
        }
    } catch (e) {
        console.error('Error loading saved properties count:', e);
    }
    
    accessState.initialized = true;
    
    // Apply restrictions based on tier
    applyAccessRestrictions();
    
    return accessState;
}

/**
 * Determine user's access tier
 * @returns {string} Access tier (free, paid, testing)
 */
function determineAccessTier() {
    // Check testing mode first
    if (window.testingMode || window.hasPaidAccess) {
        return ACCESS_TIERS.TESTING;
    }
    
    // Check localStorage for paid access
    if (localStorage.getItem('homescorepro_paid_access') === 'true') {
        return ACCESS_TIERS.PAID;
    }
    
    // Check sessionStorage for paid access
    if (sessionStorage.getItem('homescorepro_paid_access') === 'true') {
        return ACCESS_TIERS.PAID;
    }
    
    // Default to free
    return ACCESS_TIERS.FREE;
}

/**
 * Check if user has testing mode or paid access enabled
 * @returns {boolean} True if user has access
 */
function isTestingMode() {
    return accessState.tier === ACCESS_TIERS.TESTING || accessState.tier === ACCESS_TIERS.PAID;
}

/**
 * Check if user has paid access (not just testing)
 * @returns {boolean} True if user has paid access
 */
function hasPaidAccess() {
    return accessState.tier === ACCESS_TIERS.PAID || accessState.tier === ACCESS_TIERS.TESTING;
}

/**
 * Check if user can perform a search
 * @returns {boolean} True if user can search
 */
function canSearch() {
    if (hasPaidAccess()) {
        return true; // Unlimited for paid users
    }
    
    return accessState.searchCount < FREE_TIER_LIMITS.MAX_SEARCHES;
}

/**
 * Track a search attempt
 * @returns {boolean} True if search was allowed, false if limit reached
 */
function trackSearch() {
    if (hasPaidAccess()) {
        return true; // No limit for paid users
    }
    
    if (accessState.searchCount >= FREE_TIER_LIMITS.MAX_SEARCHES) {
        showUpgradePrompt();
        return false;
    }
    
    accessState.searchCount++;
    sessionStorage.setItem('homescorepro_search_count', accessState.searchCount.toString());
    
    // Show warning when approaching limit
    const remaining = FREE_TIER_LIMITS.MAX_SEARCHES - accessState.searchCount;
    if (remaining === 1) {
        showSearchLimitWarning();
    }
    
    updateSearchLimitDisplay();
    return true;
}

/**
 * Get remaining searches for free users
 * @returns {number} Remaining searches (or Infinity for paid users)
 */
function getRemainingSearches() {
    if (hasPaidAccess()) {
        return Infinity;
    }
    
    return Math.max(0, FREE_TIER_LIMITS.MAX_SEARCHES - accessState.searchCount);
}

/**
 * Reset search count (for testing or admin)
 */
function resetSearchCount() {
    accessState.searchCount = 0;
    sessionStorage.removeItem('homescorepro_search_count');
    updateSearchLimitDisplay();
}

/**
 * Apply access restrictions to blurred metrics
 * Blurs detailed metrics for users without paid access
 */
function applyAccessRestrictions() {
    const hasAccess = hasPaidAccess();
    const blurredElements = document.querySelectorAll('.blurred-metrics, [data-blur-on-restricted], .score-breakdown, .detailed-metrics');
    
    blurredElements.forEach(el => {
        if (!hasAccess) {
            el.style.filter = 'blur(3px)';
            el.style.opacity = '0.6';
            el.style.pointerEvents = 'none';
            el.classList.add('restricted');
            
            // Add unlock overlay if not already present
            if (!el.querySelector('.unlock-overlay')) {
                const overlay = createUnlockOverlay();
                if (getComputedStyle(el).position === 'static') {
                    el.style.position = 'relative';
                }
                el.appendChild(overlay);
            }
        } else {
            el.style.filter = '';
            el.style.opacity = '';
            el.style.pointerEvents = '';
            el.classList.remove('restricted');
            
            // Remove unlock overlay
            const overlay = el.querySelector('.unlock-overlay');
            if (overlay) {
                overlay.remove();
            }
        }
    });
    
    // Update search limit display
    updateSearchLimitDisplay();
}

/**
 * Update search limit display in UI
 */
function updateSearchLimitDisplay() {
    const limitElements = document.querySelectorAll('.search-limit, #searchLimitWarning, .searches-remaining');
    const remaining = getRemainingSearches();
    
    limitElements.forEach(el => {
        if (hasPaidAccess()) {
            el.style.display = 'none';
        } else {
            el.style.display = 'block';
            const remainingSpan = el.querySelector('.searches-remaining, #searchesRemaining');
            if (remainingSpan) {
                remainingSpan.textContent = remaining;
            }
            
            if (remaining === 0) {
                el.classList.add('limit-reached');
            } else {
                el.classList.remove('limit-reached');
            }
        }
    });
}

/**
 * Show search limit warning
 */
function showSearchLimitWarning() {
    const warning = document.getElementById('searchLimitWarning');
    if (warning) {
        warning.style.display = 'block';
        warning.classList.add('warning-active');
    }
}

/**
 * Create unlock overlay with CTA and benefits
 */
function createUnlockOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'unlock-overlay';
    overlay.innerHTML = `
        <div class="unlock-content">
            <div class="lock-icon">🔒</div>
            <h3>Unlock Full Analysis</h3>
            <p class="unlock-description">See detailed 38-point breakdown with:</p>
            <ul class="unlock-benefits">
                <li>✓ Exact tier weightings</li>
                <li>✓ Crime statistics</li>
                <li>✓ School ratings</li>
                <li>✓ Growth projections</li>
                <li>✓ All 38 data points</li>
            </ul>
            <a href="pricing.html" class="cta-upgrade">
                Unlock Full Analysis - $19/mo
            </a>
            <p class="unlock-trial">Start with 7-day free trial</p>
        </div>
    `;
    return overlay;
}

/**
 * Enable paid features (for testing or after payment)
 */
function enablePaidFeatures() {
    accessState.tier = ACCESS_TIERS.TESTING;
    window.hasPaidAccess = true;
    window.testingMode = true;
    
    localStorage.setItem('homescorepro_paid_access', 'true');
    sessionStorage.setItem('homescorepro_paid_access', 'true');
    
    // Remove all restrictions
    applyAccessRestrictions();
    updateSearchLimitDisplay();
    
    // Update UI elements
    const upgradeLinks = document.querySelectorAll('.nav-cta-upgrade, .upgrade-cta');
    upgradeLinks.forEach(link => {
        link.textContent = '✓ Paid Access Active';
        link.style.background = 'var(--success)';
    });
}

/**
 * Disable paid features (logout)
 */
function disablePaidFeatures() {
    accessState.tier = ACCESS_TIERS.FREE;
    window.hasPaidAccess = false;
    window.testingMode = false;
    
    localStorage.removeItem('homescorepro_paid_access');
    sessionStorage.removeItem('homescorepro_paid_access');
    
    // Apply restrictions
    applyAccessRestrictions();
    updateSearchLimitDisplay();
}

/**
 * Show upgrade prompt modal after search limit
 */
function showUpgradePrompt() {
    // Create upgrade prompt modal
    const prompt = document.createElement('div');
    prompt.className = 'upgrade-prompt-modal';
    prompt.innerHTML = `
        <div class="upgrade-prompt-content">
            <button class="upgrade-prompt-close" onclick="this.closest('.upgrade-prompt-modal').remove()">×</button>
            <h2>You've used 3 free searches!</h2>
            <p>Continue exploring with unlimited access:</p>
            <ul class="upgrade-benefits">
                <li>✓ Unlimited suburb searches</li>
                <li>✓ Unlimited property evaluations</li>
                <li>✓ Full 38-point data breakdown</li>
                <li>✓ Save unlimited properties</li>
                <li>✓ Export reports</li>
            </ul>
            <div class="upgrade-prompt-actions">
                <a href="pricing.html" class="btn-primary">Upgrade to Premium</a>
                <button class="btn-secondary" onclick="this.closest('.upgrade-prompt-modal').remove()">Continue with Limited Access</button>
            </div>
        </div>
    `;
    document.body.appendChild(prompt);
    
    // Auto-close after 10 seconds
    setTimeout(() => {
        if (prompt.parentNode) {
            prompt.remove();
        }
    }, 10000);
}

/**
 * Remove blur from metrics (for testing mode)
 */
function removeBlurFromMetrics() {
    const blurredElements = document.querySelectorAll('.blurred-metrics, [data-blur-on-restricted]');
    blurredElements.forEach(el => {
        el.style.filter = '';
        el.style.opacity = '';
        el.style.pointerEvents = '';
        el.classList.remove('restricted');
    });
}

// =====================================================
// FIRST-VISIT DETECTION & ONBOARDING
// =====================================================

/**
 * Check if this is user's first visit
 * @returns {boolean} True if first visit
 */
function isFirstVisit() {
    const firstVisit = !localStorage.getItem('homescorepro_first_visit_complete');
    return firstVisit;
}

/**
 * Mark first visit as complete
 */
function markFirstVisitComplete() {
    localStorage.setItem('homescorepro_first_visit_complete', 'true');
}

/**
 * Check if onboarding should be shown
 * @returns {boolean} True if onboarding should be shown
 */
function shouldShowOnboarding() {
    // Only show onboarding for paid users
    if (!hasPaidAccess()) {
        return false;
    }
    
    // Check if onboarding already completed
    const preferences = localStorage.getItem('homescorepro_preferences');
    if (preferences) {
        try {
            const prefs = JSON.parse(preferences);
            if (prefs.onboardingComplete === true) {
                return false;
            }
        } catch (e) {
            console.error('Error parsing preferences:', e);
        }
    }
    
    return true;
}

// =====================================================
// INITIALIZATION
// =====================================================

// Auto-initialize on page load
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAccessControl);
    } else {
        initAccessControl();
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.AccessControl = {
        init: initAccessControl,
        isTestingMode: isTestingMode,
        hasPaidAccess: hasPaidAccess,
        canSearch: canSearch,
        trackSearch: trackSearch,
        getRemainingSearches: getRemainingSearches,
        resetSearchCount: resetSearchCount,
        applyAccessRestrictions: applyAccessRestrictions,
        enablePaidFeatures: enablePaidFeatures,
        disablePaidFeatures: disablePaidFeatures,
        isFirstVisit: isFirstVisit,
        markFirstVisitComplete: markFirstVisitComplete,
        shouldShowOnboarding: shouldShowOnboarding,
        removeBlurFromMetrics: removeBlurFromMetrics,
        showUpgradePrompt: showUpgradePrompt,
        getState: () => ({ ...accessState }) // Return copy of state
    };
    
    // Backward compatibility
    window.isTestingMode = isTestingMode;
    window.applyAccessRestrictions = applyAccessRestrictions;
    window.removeBlurFromMetrics = removeBlurFromMetrics;
    window.trackSearch = trackSearch;
    window.showUpgradePrompt = showUpgradePrompt;
    window.enablePaidFeatures = enablePaidFeatures;
}

