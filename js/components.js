/**
 * HomeScorePro UI Components
 * Reusable component library for consistent interface elements
 */

class UIComponents {
    /**
     * Create a suburb card component
     */
    static createSuburbCard(suburb, score) {
        const isSaved = SavedItemsManager.isSuburbSaved(suburb.name);
        
        return `
            <div class="suburb-card" data-suburb="${suburb.name}">
                <div class="suburb-card-header">
                    <div class="suburb-info">
                        <h3 class="suburb-name">${suburb.name}</h3>
                        <p class="suburb-meta">${suburb.postcode} • ${suburb.lga}</p>
                    </div>
                    <div class="suburb-score" style="--score-color: ${ScoringEngine.getScoreColor(score.total)}">
                        <div class="score-circle">
                            <span class="score-value">${score.total}</span>
                            <span class="score-grade">${score.grade}</span>
                        </div>
                    </div>
                </div>

                <div class="suburb-card-body">
                    <div class="suburb-stats">
                        <div class="stat">
                            <span class="stat-label">Median Price</span>
                            <span class="stat-value">${Utils.formatCurrency(suburb.medianPrice)}</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">Growth (1yr)</span>
                            <span class="stat-value ${suburb.growth1yr >= 0 ? 'positive' : 'negative'}">
                                ${suburb.growth1yr >= 0 ? '+' : ''}${suburb.growth1yr}%
                            </span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">Rental Yield</span>
                            <span class="stat-value">${suburb.rentalYield}%</span>
                        </div>
                    </div>

                    <div class="score-breakdown">
                        ${this.createScoreBreakdownBars(score.breakdown, score.weights)}
                    </div>

                    <div class="suburb-highlights">
                        ${this.createHighlights(score.breakdown)}
                    </div>
                </div>

                <div class="suburb-card-footer">
                    <button class="btn btn-secondary save-suburb-btn ${isSaved ? 'saved' : ''}" 
                            data-suburb="${suburb.name}">
                        ${isSaved ? '♥ Saved' : '♡ Save'}
                    </button>
                    <a href="/suburb/${suburb.name}" class="btn btn-primary">
                        View Details →
                    </a>
                </div>
            </div>
        `;
    }

    /**
     * Create property card component
     */
    static createPropertyCard(property, suburb) {
        const isSaved = SavedItemsManager.isPropertySaved(property.id);
        const score = ScoringEngine.calculateBScore(property, suburb, PreferencesManager.getPreferences());
        
        return `
            <div class="property-card" data-property-id="${property.id}">
                <div class="property-image">
                    <img src="${property.image || '/images/placeholder-property.jpg'}" 
                         alt="${property.address}" 
                         loading="lazy">
                    <div class="property-badge">${score.grade}</div>
                    <button class="save-property-btn ${isSaved ? 'saved' : ''}" 
                            data-property-id="${property.id}">
                        ${isSaved ? '♥' : '♡'}
                    </button>
                </div>

                <div class="property-card-body">
                    <div class="property-header">
                        <h3 class="property-price">${Utils.formatCurrency(property.price)}</h3>
                        <div class="property-score" style="--score-color: ${ScoringEngine.getScoreColor(score.total)}">
                            ${score.total}
                        </div>
                    </div>

                    <p class="property-address">${property.address}</p>
                    <p class="property-suburb">${suburb.name}, ${suburb.postcode}</p>

                    <div class="property-features">
                        <span class="feature">
                            <i class="icon-bed"></i> ${property.bedrooms} bed
                        </span>
                        <span class="feature">
                            <i class="icon-bath"></i> ${property.bathrooms} bath
                        </span>
                        <span class="feature">
                            <i class="icon-car"></i> ${property.parking} car
                        </span>
                        ${property.landSize ? `
                            <span class="feature">
                                <i class="icon-size"></i> ${property.landSize}m²
                            </span>
                        ` : ''}
                    </div>

                    <div class="property-highlights">
                        ${score.breakdown.value.reasons.slice(0, 2).map(reason => 
                            `<span class="highlight">✓ ${reason}</span>`
                        ).join('')}
                    </div>
                </div>

                <div class="property-card-footer">
                    <a href="/property/${property.id}" class="btn btn-primary btn-block">
                        View Property →
                    </a>
                </div>
            </div>
        `;
    }

    /**
     * Create score breakdown bars
     */
    static createScoreBreakdownBars(breakdown, weights) {
        const categories = [
            { key: 'schools', icon: '🎓', label: 'Schools' },
            { key: 'transport', icon: '🚇', label: 'Transport' },
            { key: 'lifestyle', icon: '☕', label: 'Lifestyle' },
            { key: 'investment', icon: '📈', label: 'Investment' },
            { key: 'community', icon: '👥', label: 'Community' }
        ];

        return categories.map(cat => {
            const score = breakdown[cat.key].score;
            const weight = weights[cat.key];
            const color = ScoringEngine.getScoreColor(score);
            
            return `
                <div class="score-bar-item">
                    <div class="score-bar-header">
                        <span class="score-bar-label">
                            <span class="score-bar-icon">${cat.icon}</span>
                            ${cat.label}
                        </span>
                        <span class="score-bar-value">${Math.round(score)}</span>
                    </div>
                    <div class="score-bar-track">
                        <div class="score-bar-fill" 
                             style="width: ${score}%; background-color: ${color}">
                        </div>
                    </div>
                    <div class="score-bar-weight">Weight: ${weight}/10</div>
                </div>
            `;
        }).join('');
    }

    /**
     * Create highlights from score reasons
     */
    static createHighlights(breakdown) {
        const allReasons = [];
        Object.values(breakdown).forEach(category => {
            if (category.reasons) {
                allReasons.push(...category.reasons);
            }
        });

        return allReasons.slice(0, 3).map(reason => 
            `<span class="highlight">✓ ${reason}</span>`
        ).join('');
    }

    /**
     * Create filter panel
     */
    static createFilterPanel(preferences) {
        return `
            <div class="filter-panel">
                <div class="filter-section">
                    <h3>Budget</h3>
                    <div class="range-input">
                        <input type="range" 
                               class="filter-input" 
                               name="budget-min" 
                               min="0" 
                               max="5000000" 
                               step="50000"
                               value="${preferences.budget.min}">
                        <span class="range-value">${Utils.formatCurrency(preferences.budget.min)}</span>
                    </div>
                    <div class="range-input">
                        <input type="range" 
                               class="filter-input" 
                               name="budget-max" 
                               min="0" 
                               max="5000000" 
                               step="50000"
                               value="${preferences.budget.max}">
                        <span class="range-value">${Utils.formatCurrency(preferences.budget.max)}</span>
                    </div>
                </div>

                <div class="filter-section">
                    <h3>Property Type</h3>
                    <div class="checkbox-group">
                        ${['house', 'apartment', 'townhouse', 'unit'].map(type => `
                            <label class="checkbox-label">
                                <input type="checkbox" 
                                       class="filter-input" 
                                       name="property-type" 
                                       value="${type}"
                                       ${preferences.propertyTypes.includes(type) ? 'checked' : ''}>
                                <span>${type.charAt(0).toUpperCase() + type.slice(1)}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>

                <div class="filter-section">
                    <h3>Bedrooms</h3>
                    <div class="number-input">
                        <label>
                            Min
                            <input type="number" 
                                   class="filter-input" 
                                   name="bedrooms-min" 
                                   min="1" 
                                   max="6"
                                   value="${preferences.bedrooms.min}">
                        </label>
                        <label>
                            Max
                            <input type="number" 
                                   class="filter-input" 
                                   name="bedrooms-max" 
                                   min="1" 
                                   max="6"
                                   value="${preferences.bedrooms.max}">
                        </label>
                    </div>
                </div>

                <div class="filter-section">
                    <h3>Priorities</h3>
                    ${this.createPrioritySliders(preferences.priorities)}
                </div>

                <div class="filter-actions">
                    <button class="btn btn-secondary" id="reset-filters">Reset</button>
                    <button class="btn btn-primary" id="apply-filters">Apply Filters</button>
                </div>
            </div>
        `;
    }

    /**
     * Create priority sliders
     */
    static createPrioritySliders(priorities) {
        const categories = [
            { key: 'schools', label: 'Schools & Education', icon: '🎓' },
            { key: 'transport', label: 'Transport & Access', icon: '🚇' },
            { key: 'lifestyle', label: 'Lifestyle & Amenities', icon: '☕' },
            { key: 'investment', label: 'Investment Potential', icon: '📈' },
            { key: 'community', label: 'Community & Safety', icon: '👥' }
        ];

        return categories.map(cat => `
            <div class="priority-slider">
                <label class="priority-label">
                    <span class="priority-icon">${cat.icon}</span>
                    ${cat.label}
                </label>
                <input type="range" 
                       class="filter-input priority-range" 
                       name="priority-${cat.key}" 
                       min="0" 
                       max="10" 
                       value="${priorities[cat.key] || 5}">
                <span class="priority-value">${priorities[cat.key] || 5}/10</span>
            </div>
        `).join('');
    }

    /**
     * Create comparison table
     */
    static createComparisonTable(suburbs, preferences) {
        const scores = suburbs.map(suburb => ({
            suburb,
            score: ScoringEngine.calculateAScore(suburb, preferences)
        }));

        return `
            <div class="comparison-table">
                <table>
                    <thead>
                        <tr>
                            <th>Suburb</th>
                            ${scores.map(s => `
                                <th>${s.suburb.name}</th>
                            `).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Overall Score</strong></td>
                            ${scores.map(s => `
                                <td class="score-cell" style="--score-color: ${ScoringEngine.getScoreColor(s.score.total)}">
                                    ${s.score.total} (${s.score.grade})
                                </td>
                            `).join('')}
                        </tr>
                        <tr>
                            <td>Median Price</td>
                            ${scores.map(s => `
                                <td>${Utils.formatCurrency(s.suburb.medianPrice)}</td>
                            `).join('')}
                        </tr>
                        <tr>
                            <td>Growth (1yr)</td>
                            ${scores.map(s => `
                                <td class="${s.suburb.growth1yr >= 0 ? 'positive' : 'negative'}">
                                    ${s.suburb.growth1yr >= 0 ? '+' : ''}${s.suburb.growth1yr}%
                                </td>
                            `).join('')}
                        </tr>
                        <tr>
                            <td>Rental Yield</td>
                            ${scores.map(s => `
                                <td>${s.suburb.rentalYield}%</td>
                            `).join('')}
                        </tr>
                        <tr>
                            <td>Schools Score</td>
                            ${scores.map(s => `
                                <td>${Math.round(s.score.breakdown.schools.score)}</td>
                            `).join('')}
                        </tr>
                        <tr>
                            <td>Transport Score</td>
                            ${scores.map(s => `
                                <td>${Math.round(s.score.breakdown.transport.score)}</td>
                            `).join('')}
                        </tr>
                        <tr>
                            <td>Lifestyle Score</td>
                            ${scores.map(s => `
                                <td>${Math.round(s.score.breakdown.lifestyle.score)}</td>
                            `).join('')}
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    }

    /**
     * Create modal component
     */
    static createModal(id, title, content, actions = []) {
        return `
            <div class="modal" id="${id}">
                <div class="modal-overlay"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>${title}</h2>
                        <button class="modal-close" aria-label="Close">×</button>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                    ${actions.length > 0 ? `
                        <div class="modal-footer">
                            ${actions.map(action => `
                                <button class="btn ${action.class}" 
                                        onclick="${action.onClick}">
                                    ${action.label}
                                </button>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    /**
     * Create loading skeleton
     */
    static createLoadingSkeleton(type = 'card') {
        if (type === 'card') {
            return `
                <div class="skeleton-card">
                    <div class="skeleton-header"></div>
                    <div class="skeleton-line"></div>
                    <div class="skeleton-line short"></div>
                    <div class="skeleton-footer"></div>
                </div>
            `;
        }
        return `<div class="skeleton"></div>`;
    }

    /**
     * Create empty state
     */
    static createEmptyState(icon, title, message, action = null) {
        return `
            <div class="empty-state">
                <div class="empty-state-icon">${icon}</div>
                <h3 class="empty-state-title">${title}</h3>
                <p class="empty-state-message">${message}</p>
                ${action ? `
                    <button class="btn btn-primary" onclick="${action.onClick}">
                        ${action.label}
                    </button>
                ` : ''}
            </div>
        `;
    }

    /**
     * Create pagination component
     */
    static createPagination(currentPage, totalPages, onPageChange) {
        const pages = [];
        const maxVisible = 5;
        
        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);
        
        if (endPage - startPage < maxVisible - 1) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        return `
            <div class="pagination">
                <button class="pagination-btn" 
                        ${currentPage === 1 ? 'disabled' : ''}
                        onclick="${onPageChange}(${currentPage - 1})">
                    ← Previous
                </button>
                
                ${startPage > 1 ? `
                    <button class="pagination-btn" onclick="${onPageChange}(1)">1</button>
                    ${startPage > 2 ? '<span class="pagination-ellipsis">...</span>' : ''}
                ` : ''}
                
                ${Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i)
                    .map(page => `
                        <button class="pagination-btn ${page === currentPage ? 'active' : ''}" 
                                onclick="${onPageChange}(${page})">
                            ${page}
                        </button>
                    `).join('')}
                
                ${endPage < totalPages ? `
                    ${endPage < totalPages - 1 ? '<span class="pagination-ellipsis">...</span>' : ''}
                    <button class="pagination-btn" onclick="${onPageChange}(${totalPages})">${totalPages}</button>
                ` : ''}
                
                <button class="pagination-btn" 
                        ${currentPage === totalPages ? 'disabled' : ''}
                        onclick="${onPageChange}(${currentPage + 1})">
                    Next →
                </button>
            </div>
        `;
    }

    /**
     * Create breadcrumb navigation
     */
    static createBreadcrumb(items) {
        return `
            <nav class="breadcrumb">
                ${items.map((item, index) => `
                    ${index > 0 ? '<span class="breadcrumb-separator">›</span>' : ''}
                    ${item.href ? `
                        <a href="${item.href}" class="breadcrumb-item">${item.label}</a>
                    ` : `
                        <span class="breadcrumb-item active">${item.label}</span>
                    `}
                `).join('')}
            </nav>
        `;
    }
}

// Modal helper functions
const ModalHelper = {
    open(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    },

    close(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    },

    init() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('.modal-close, .modal-overlay')) {
                const modal = e.target.closest('.modal');
                if (modal) {
                    this.close(modal.id);
                }
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const activeModal = document.querySelector('.modal.active');
                if (activeModal) {
                    this.close(activeModal.id);
                }
            }
        });
    }
};

// Initialize modal helper on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ModalHelper.init());
} else {
    ModalHelper.init();
}

// Export for use in other modules
window.UIComponents = UIComponents;
window.ModalHelper = ModalHelper;
