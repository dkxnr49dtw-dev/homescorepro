/**
 * HomeScorePro Main Application
 * Central app initialization and management
 */

// Application State Manager
class AppStateManager {
    constructor() {
        this.state = {
            user: null,
            suburbs: [],
            properties: [],
            config: null,
            userPreferences: null,
            currentPage: null,
            isLoading: false
        };
        this.listeners = new Map();
    }

    /**
     * Update state and notify listeners
     */
    setState(key, value) {
        this.state[key] = value;
        this.notifyListeners(key, value);
    }

    /**
     * Get state value
     */
    getState(key) {
        return this.state[key];
    }

    /**
     * Subscribe to state changes
     */
    subscribe(key, callback) {
        if (!this.listeners.has(key)) {
            this.listeners.set(key, []);
        }
        this.listeners.get(key).push(callback);
    }

    /**
     * Notify all listeners for a state key
     */
    notifyListeners(key, value) {
        if (this.listeners.has(key)) {
            this.listeners.get(key).forEach(callback => callback(value));
        }
    }
}

// Data Loader Service
class DataLoader {
    static async loadSuburbsData() {
        try {
            const response = await fetch('/data/suburbs.csv');
            if (!response.ok) throw new Error('Failed to load suburbs data');
            
            const text = await response.text();
            const data = Utils.parseCSV(text);
            
            return data;
        } catch (error) {
            console.error('❌ Error loading suburbs data:', error);
            return [];
        }
    }

    static async loadPropertiesData() {
        try {
            const response = await fetch('/data/properties.csv');
            if (!response.ok) throw new Error('Failed to load properties data');
            
            const text = await response.text();
            const data = Utils.parseCSV(text);
            
            return data;
        } catch (error) {
            console.error('❌ Error loading properties data:', error);
            return [];
        }
    }

    static async loadConfig() {
        try {
            const response = await fetch('/data/config.json');
            if (!response.ok) throw new Error('Failed to load config');
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('❌ Error loading config:', error);
            return null;
        }
    }

    static async loadAll() {
        const [suburbs, properties, config] = await Promise.all([
            this.loadSuburbsData(),
            this.loadPropertiesData(),
            this.loadConfig()
        ]);

        return { suburbs, properties, config };
    }
}

// User Preferences Manager
class PreferencesManager {
    static STORAGE_KEY = 'homescore_preferences';

    static getPreferences() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (error) {
                console.error('Error parsing preferences:', error);
            }
        }
        return this.getDefaultPreferences();
    }

    static getDefaultPreferences() {
        return {
            budget: { min: 500000, max: 2000000 },
            propertyTypes: ['house', 'apartment', 'townhouse'],
            bedrooms: { min: 2, max: 4 },
            priorities: {
                schools: 8,
                transport: 7,
                lifestyle: 6,
                investment: 5,
                community: 7
            },
            lifestyle: {
                cbdCommute: true,
                familyFriendly: true,
                nightlife: false,
                outdoors: true
            }
        };
    }

    static savePreferences(preferences) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(preferences));
            return true;
        } catch (error) {
            console.error('Error saving preferences:', error);
            return false;
        }
    }

    static updatePreferences(updates) {
        const current = this.getPreferences();
        const updated = { ...current, ...updates };
        return this.savePreferences(updated);
    }
}

// Saved Items Manager
class SavedItemsManager {
    static SUBURBS_KEY = 'homescore_saved_suburbs';
    static PROPERTIES_KEY = 'homescore_saved_properties';

    static getSavedSuburbs() {
        const stored = localStorage.getItem(this.SUBURBS_KEY);
        return stored ? JSON.parse(stored) : [];
    }

    static getSavedProperties() {
        const stored = localStorage.getItem(this.PROPERTIES_KEY);
        return stored ? JSON.parse(stored) : [];
    }

    static saveSuburb(suburb) {
        const saved = this.getSavedSuburbs();
        const index = saved.findIndex(s => s.name === suburb.name);
        
        if (index === -1) {
            saved.push({ ...suburb, savedAt: new Date().toISOString() });
            localStorage.setItem(this.SUBURBS_KEY, JSON.stringify(saved));
            return true;
        }
        return false;
    }

    static removeSuburb(suburbName) {
        const saved = this.getSavedSuburbs();
        const filtered = saved.filter(s => s.name !== suburbName);
        localStorage.setItem(this.SUBURBS_KEY, JSON.stringify(filtered));
        return true;
    }

    static isSuburbSaved(suburbName) {
        const saved = this.getSavedSuburbs();
        return saved.some(s => s.name === suburbName);
    }

    static saveProperty(property) {
        const saved = this.getSavedProperties();
        const index = saved.findIndex(p => p.id === property.id);
        
        if (index === -1) {
            saved.push({ ...property, savedAt: new Date().toISOString() });
            localStorage.setItem(this.PROPERTIES_KEY, JSON.stringify(saved));
            return true;
        }
        return false;
    }

    static removeProperty(propertyId) {
        const saved = this.getSavedProperties();
        const filtered = saved.filter(p => p.id !== propertyId);
        localStorage.setItem(this.PROPERTIES_KEY, JSON.stringify(filtered));
        return true;
    }

    static isPropertySaved(propertyId) {
        const saved = this.getSavedProperties();
        return saved.some(p => p.id === propertyId);
    }
}

// UI Manager
class UIManager {
    static showLoading(message = 'Loading...') {
        const loader = document.getElementById('loading-overlay');
        if (loader) {
            const messageEl = loader.querySelector('.loading-message');
            if (messageEl) messageEl.textContent = message;
            loader.classList.remove('hidden');
        }
    }

    static hideLoading() {
        const loader = document.getElementById('loading-overlay');
        if (loader) {
            loader.classList.add('hidden');
        }
    }

    static showError(message, duration = 5000) {
        const toast = this.createToast('error', message);
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    static showSuccess(message, duration = 3000) {
        const toast = this.createToast('success', message);
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    static createToast(type, message) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        // Use DocumentFragment instead of innerHTML
        const fragment = document.createDocumentFragment();
        
        const iconSpan = document.createElement('span');
        iconSpan.className = 'toast-icon';
        iconSpan.textContent = type === 'error' ? '⚠️' : '✓';
        fragment.appendChild(iconSpan);
        
        const messageSpan = document.createElement('span');
        messageSpan.className = 'toast-message';
        messageSpan.textContent = message;
        fragment.appendChild(messageSpan);
        
        toast.appendChild(fragment);
        return toast;
    }

    static updateOnboardingProgress(step, total) {
        const progress = document.querySelector('.onboarding-progress');
        if (progress) {
            const percentage = (step / total) * 100;
            progress.style.width = `${percentage}%`;
        }

        const stepIndicators = document.querySelectorAll('.step-indicator');
        stepIndicators.forEach((indicator, index) => {
            if (index < step) {
                indicator.classList.add('completed');
            } else if (index === step) {
                indicator.classList.add('active');
            }
        });
    }
}

// Router for SPA navigation
class Router {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
    }

    register(path, handler) {
        this.routes.set(path, handler);
    }

    navigate(path, data = {}) {
        const handler = this.routes.get(path);
        if (handler) {
            this.currentRoute = path;
            handler(data);
            
            // Update URL without reload
            if (window.history) {
                window.history.pushState({ path }, '', path);
            }
        } else {
            console.warn(`No route handler for: ${path}`);
        }
    }

    init() {
        // Handle browser back/forward
        window.addEventListener('popstate', (event) => {
            if (event.state && event.state.path) {
                this.navigate(event.state.path);
            }
        });
    }
}

// Main Application Controller
class HomeScoreApp {
    constructor() {
        this.state = new AppStateManager();
        this.router = new Router();
        this.initialized = false;
    }

    async init() {
        if (this.initialized) return;

        
        try {
            UIManager.showLoading('Loading application...');

            // Load all data
            const { suburbs, properties, config } = await DataLoader.loadAll();
            
            this.state.setState('suburbs', suburbs);
            this.state.setState('properties', properties);
            this.state.setState('config', config);

            // Load user preferences
            const preferences = PreferencesManager.getPreferences();
            this.state.setState('userPreferences', preferences);

            // Check if user needs onboarding
            const hasCompletedOnboarding = localStorage.getItem('homescore_onboarding_complete');
            
            if (!hasCompletedOnboarding && window.location.pathname === '/') {
                this.router.navigate('/onboarding');
            }

            // Initialize auth if available
            if (window.Auth) {
                const user = await Auth.getCurrentUser();
                this.state.setState('user', user);
            }

            // Setup event listeners
            this.setupEventListeners();

            // Initialize router
            this.router.init();

            this.initialized = true;
            
            UIManager.hideLoading();

        } catch (error) {
            console.error('❌ Error initializing app:', error);
            UIManager.hideLoading();
            UIManager.showError('Failed to initialize application. Please refresh.');
        }
    }

    setupEventListeners() {
        // Centralized event delegation using data-action attributes
        document.addEventListener('click', (e) => {
            const action = e.target.closest('[data-action]')?.dataset.action;
            if (!action) return;
            
            // Handle all click actions through centralized handler
            this.handleAction(action, e);
        });

        // Handle search inputs with delegation
        document.addEventListener('input', Utils.debounce((e) => {
            if (e.target.matches('.search-input')) {
                this.handleSearch(e.target.value);
            }
        }, 300));

        // Handle filter changes with delegation
        document.addEventListener('change', (e) => {
            if (e.target.matches('.filter-input')) {
                this.handleFilterChange(e);
            }
        });
    }

    /**
     * Centralized action handler for all data-action elements
     */
    handleAction(action, event) {
        const target = event.target.closest('[data-action]');
        
        switch(action) {
            case 'save-suburb':
                this.handleSaveSuburb(event);
                break;
            case 'save-property':
                this.handleSaveProperty(event);
                break;
            case 'delete-suburb':
                this.handleDeleteSuburb(target);
                break;
            case 'delete-property':
                this.handleDeleteProperty(target);
                break;
            case 'edit-property':
                this.handleEditProperty(target);
                break;
            case 'export-property':
                this.handleExportProperty(target);
                break;
            default:
                // Allow custom handlers to be registered
                if (this.customActionHandlers && this.customActionHandlers[action]) {
                    this.customActionHandlers[action](event, target);
                }
        }
    }

    /**
     * Register custom action handlers
     */
    registerActionHandler(action, handler) {
        if (!this.customActionHandlers) {
            this.customActionHandlers = {};
        }
        this.customActionHandlers[action] = handler;
    }

    handleSaveSuburb(event) {
        const button = event.target.closest('[data-action="save-suburb"]') || event.target;
        const suburbName = button.dataset.suburb || button.closest('[data-suburb]')?.dataset.suburb;
        
        const suburbs = this.state.getState('suburbs');
        const suburb = suburbs.find(s => s.name === suburbName);
        
        if (suburb) {
            if (SavedItemsManager.isSuburbSaved(suburbName)) {
                SavedItemsManager.removeSuburb(suburbName);
                button.textContent = '♡ Save';
                button.classList.remove('saved');
                UIManager.showSuccess('Suburb removed from saved items');
            } else {
                SavedItemsManager.saveSuburb(suburb);
                button.textContent = '♥ Saved';
                button.classList.add('saved');
                UIManager.showSuccess('Suburb saved successfully');
            }
        }
    }

    handleSaveProperty(event) {
        const button = event.target.closest('[data-action="save-property"]') || event.target;
        const propertyId = button.dataset.propertyId || button.closest('[data-property-id]')?.dataset.propertyId;
        
        const properties = this.state.getState('properties');
        const property = properties.find(p => p.id === propertyId);
        
        if (property) {
            if (SavedItemsManager.isPropertySaved(propertyId)) {
                SavedItemsManager.removeProperty(propertyId);
                button.textContent = '♡ Save';
                button.classList.remove('saved');
                UIManager.showSuccess('Property removed from saved items');
            } else {
                SavedItemsManager.saveProperty(property);
                button.textContent = '♥ Saved';
                button.classList.add('saved');
                UIManager.showSuccess('Property saved successfully');
            }
        }
    }

    handleSearch(query) {
        // Implement search functionality
    }

    handleFilterChange(event) {
        // Implement filter functionality
    }

    // Public API methods
    getState() {
        return this.state;
    }

    getPreferences() {
        return PreferencesManager.getPreferences();
    }

    updatePreferences(updates) {
        const success = PreferencesManager.updatePreferences(updates);
        if (success) {
            this.state.setState('userPreferences', PreferencesManager.getPreferences());
        }
        return success;
    }

    getSavedSuburbs() {
        return SavedItemsManager.getSavedSuburbs();
    }

    getSavedProperties() {
        return SavedItemsManager.getSavedProperties();
    }
}

// Utility Functions
const Utils = {
    /**
     * Parse CSV text to array of objects
     */
    parseCSV(text) {
        const lines = text.trim().split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        
        return lines.slice(1).map(line => {
            const values = line.split(',');
            const obj = {};
            
            headers.forEach((header, index) => {
                let value = values[index]?.trim() || '';
                
                // Try to convert to number
                if (value && !isNaN(value)) {
                    obj[header] = parseFloat(value);
                } else {
                    obj[header] = value;
                }
            });
            
            return obj;
        });
    },

    /**
     * Debounce function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Format currency
     */
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-AU', {
            style: 'currency',
            currency: 'AUD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    },

    /**
     * Format percentage
     */
    formatPercentage(value, decimals = 1) {
        return `${value.toFixed(decimals)}%`;
    },

    /**
     * Calculate distance between two coordinates
     */
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth's radius in km
        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);
        
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    },

    toRad(degrees) {
        return degrees * (Math.PI / 180);
    }
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.app = new HomeScoreApp();
        window.app.init();
    });
} else {
    window.app = new HomeScoreApp();
    window.app.init();
}

// Export for use in other modules
window.HomeScoreApp = HomeScoreApp;
window.Utils = Utils;
window.UIManager = UIManager;
window.PreferencesManager = PreferencesManager;
window.SavedItemsManager = SavedItemsManager;
