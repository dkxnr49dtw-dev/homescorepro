/**
 * HomeScorePro Smart Search
 * Auto-detects input type (address, postcode, suburb) and routes to appropriate tool
 */

class SmartSearch {
    constructor() {
        this.searchInput = null;
        this.autocompleteContainer = null;
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupSearch());
        } else {
            this.setupSearch();
        }
    }

    setupSearch() {
        // Create unified search input if it doesn't exist
        const existingSearch = document.getElementById('unified-smart-search');
        if (!existingSearch) {
            this.createUnifiedSearch();
        } else {
            this.searchInput = existingSearch;
            this.attachListeners();
        }
    }

    createUnifiedSearch() {
        // Find location scout section
        const locationScout = document.getElementById('location-scout');
        if (!locationScout) return;

        const sectionContainer = locationScout.querySelector('.section-container');
        if (!sectionContainer) return;

        // Create unified search container
        const searchContainer = document.createElement('div');
        searchContainer.className = 'unified-search-container';
        searchContainer.innerHTML = `
            <div class="input-group">
                <label class="input-label">Enter suburb, address, or postcode</label>
                <div class="search-wrapper">
                    <input 
                        type="text" 
                        class="input-field unified-search-input" 
                        id="unified-smart-search"
                        placeholder="e.g., 'Hawthorn', '123 Smith St, Richmond', or '3122'..."
                        autocomplete="off"
                    />
                    <button class="btn-primary search-btn" id="unified-search-btn">Search</button>
                </div>
                <div id="unified-search-autocomplete" class="autocomplete-dropdown"></div>
                <div id="unified-search-limit-message" class="search-limit-message hidden-element"></div>
            </div>
        `;

        // Insert at the beginning of the section
        const sectionHeader = sectionContainer.querySelector('.section-header');
        if (sectionHeader) {
            sectionHeader.insertAdjacentElement('afterend', searchContainer);
        }

        this.searchInput = document.getElementById('unified-smart-search');
        this.autocompleteContainer = document.getElementById('unified-search-autocomplete');
        this.attachListeners();
    }

    attachListeners() {
        if (!this.searchInput) return;

        // Search on Enter key
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.handleSearch();
            }
        });

        // Search button click
        const searchBtn = document.getElementById('unified-search-btn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.handleSearch());
        }

        // Autocomplete on input
        this.searchInput.addEventListener('input', (e) => {
            this.handleAutocomplete(e.target.value);
        });

        // Close autocomplete on outside click
        document.addEventListener('click', (e) => {
            if (!this.searchInput.contains(e.target) && 
                !this.autocompleteContainer.contains(e.target)) {
                this.autocompleteContainer.classList.add('hidden');
            }
        });
    }

    /**
     * Detect input type: address, postcode, or suburb
     */
    detectInputType(input) {
        const trimmed = input.trim();
        
        // Check for street number (address)
        if (/^\d+\s+/.test(trimmed)) {
            return 'address';
        }
        
        // Check for postcode (4 digits)
        if (/^\d{4}$/.test(trimmed)) {
            return 'postcode';
        }
        
        // Default to suburb
        return 'suburb';
    }

    /**
     * Handle search based on detected input type
     */
    handleSearch() {
        const query = this.searchInput.value.trim();
        if (!query) return;

        const inputType = this.detectInputType(query);
        
        switch(inputType) {
            case 'address':
                this.evaluateProperty(query);
                break;
            case 'postcode':
                this.showSuburbsInPostcode(query);
                break;
            case 'suburb':
                this.showSuburbScore(query);
                break;
        }
    }

    /**
     * Show suburb A-Score
     */
    showSuburbScore(suburbName) {
        // Use existing searchSuburb function if available
        if (typeof searchSuburb === 'function') {
            // Temporarily set the suburb search input
            const oldInput = document.getElementById('suburb-search-input');
            if (oldInput) {
                oldInput.value = suburbName;
            }
            searchSuburb();
        } else {
            // Fallback: scroll to location scout and show message
            const locationScout = document.getElementById('location-scout');
            if (locationScout) {
                locationScout.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }

    /**
     * Evaluate property B-Score
     */
    evaluateProperty(address) {
        // Scroll to calculator section
        const calculator = document.getElementById('calculator');
        if (calculator) {
            calculator.scrollIntoView({ behavior: 'smooth' });
            
            // Switch to property tab
            if (typeof switchTab === 'function') {
                switchTab('property');
            }
            
            // Fill in address field if it exists
            setTimeout(() => {
                const addressInput = document.getElementById('property-address');
                if (addressInput) {
                    addressInput.value = address;
                }
            }, 300);
        }
    }

    /**
     * Show suburbs in postcode
     */
    showSuburbsInPostcode(postcode) {
        // Filter suburbs by postcode and display
        if (typeof suburbData !== 'undefined' && suburbData) {
            const suburbsInPostcode = suburbData.filter(s => 
                s.postcode && s.postcode.toString() === postcode
            );
            
            if (suburbsInPostcode.length > 0) {
                // Show results
                this.displaySuburbsList(suburbsInPostcode);
            } else {
                alert(`No suburbs found for postcode ${postcode}`);
            }
        }
    }

    /**
     * Display list of suburbs
     */
    displaySuburbsList(suburbs) {
        const locationScout = document.getElementById('location-scout');
        if (!locationScout) return;

        // Create results container
        let resultsContainer = document.getElementById('postcode-results');
        if (!resultsContainer) {
            resultsContainer = document.createElement('div');
            resultsContainer.id = 'postcode-results';
            resultsContainer.className = 'postcode-results';
            locationScout.appendChild(resultsContainer);
        }

        // Clear and populate
        const fragment = document.createDocumentFragment();
        suburbs.forEach(suburb => {
            const card = document.createElement('div');
            card.className = 'suburb-card';
            card.innerHTML = `
                <h3>${suburb.name}</h3>
                <p>Postcode: ${suburb.postcode}</p>
                <button class="btn-primary" onclick="smartSearch.showSuburbScore('${suburb.name}')">
                    View A-Score
                </button>
            `;
            fragment.appendChild(card);
        });

        resultsContainer.textContent = '';
        resultsContainer.appendChild(fragment);
        resultsContainer.scrollIntoView({ behavior: 'smooth' });
    }

    /**
     * Handle autocomplete suggestions
     */
    handleAutocomplete(query) {
        if (!query || query.length < 2) {
            this.autocompleteContainer.classList.add('hidden');
            return;
        }

        if (typeof suburbData === 'undefined' || !suburbData) {
            return;
        }

        // Filter suburbs matching query
        const matches = suburbData
            .filter(s => {
                const name = (s.name || '').toLowerCase();
                const postcode = (s.postcode || '').toString();
                return name.includes(query.toLowerCase()) || postcode.includes(query);
            })
            .slice(0, 5);

        if (matches.length === 0) {
            this.autocompleteContainer.classList.add('hidden');
            return;
        }

        // Display suggestions
        const fragment = document.createDocumentFragment();
        matches.forEach(suburb => {
            const item = document.createElement('div');
            item.className = 'autocomplete-item';
            item.innerHTML = `
                <span class="autocomplete-name">${suburb.name}</span>
                <span class="autocomplete-postcode">${suburb.postcode}</span>
            `;
            item.addEventListener('click', () => {
                this.searchInput.value = suburb.name;
                this.autocompleteContainer.classList.add('hidden');
                this.handleSearch();
            });
            fragment.appendChild(item);
        });

        this.autocompleteContainer.textContent = '';
        this.autocompleteContainer.appendChild(fragment);
        this.autocompleteContainer.classList.remove('hidden');
    }
}

// Initialize smart search
let smartSearch;
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        smartSearch = new SmartSearch();
        window.smartSearch = smartSearch;
    });
}



