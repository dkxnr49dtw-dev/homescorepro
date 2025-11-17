        /**
         * =====================================================
         * HOMESCOREPRO - PROPERTY SCORING ENGINE
         * Complete functionality with all features
         * =====================================================
         */
        
        // State Management
        // Note: Access control is now handled by js/access-control.js
        // This file should use AccessControl.trackSearch() instead of managing search count directly
        
        // Score caching for performance optimization
        const scoreCache = new Map();
        
        // =====================================================
        // RETENTION STRATEGY: Layer 1 - Entry & First Impression
        // =====================================================
        
        /**
         * Animate numbers counting up (for stats section)
         */
        function animateCountUp(element, target, duration = 2000) {
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
        
        /**
         * Initialize count-up animations when stats section is visible
         */
        function initStatsAnimations() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && entry.target.dataset.animate === 'true') {
                        const statValue = entry.target.querySelector('[data-count-up="true"]');
                        const target = parseInt(entry.target.dataset.target);
                        const delay = parseInt(entry.target.dataset.delay || '0');
                        
                        setTimeout(() => {
                            animateCountUp(statValue, target);
                        }, delay);
                        
                        entry.target.dataset.animate = 'false'; // Only animate once
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });
            
            document.querySelectorAll('.stat-item[data-animate="true"]').forEach(item => {
                observer.observe(item);
            });
        }
        
        /**
         * Fade in elements on scroll (staggered appearance)
         */
        function initScrollAnimations() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }, index * 100); // Stagger by 100ms
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            
            // Add fade-in class to cards and sections
            document.querySelectorAll('.card, .section-header, .score-explanation-box').forEach((el, index) => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                observer.observe(el);
            });
        }
        
        // Mobile Menu Toggle
        function toggleMobileMenu() {
            const menu = document.getElementById('mobileMenu');
            menu.classList.toggle('active');
        }
        
        // Tab Switching
        function switchTab(tab) {
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.closest('.tab-btn').classList.add('active');
            
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`${tab}-tab`).classList.add('active');
        }
        
        // Progressive Form Toggle
        function toggleOptionalFields() {
            const content = document.getElementById('optionalFields');
            const icon = document.getElementById('optionalIcon');
            content.classList.toggle('expanded');
            icon.textContent = content.classList.contains('expanded') ? '▲' : '▼';
        }
        
        // Debounce function for performance optimization
        function debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }
        
        // Smart Search with Auto-Detection (debounced for performance)
        const performSmartSearchDebounced = debounce(() => {
            const input = document.getElementById('smartSearch').value.trim();
            
            if (!input) return;
            
            performSmartSearch();
        }, 300);
        
        function performSmartSearch() {
            const input = document.getElementById('smartSearch').value.trim();
            
            if (!input) return;
            
            // Use centralized access control
            if (window.AccessControl && !window.AccessControl.canSearch()) {
                if (window.AccessControl.showUpgradePrompt) {
                    window.AccessControl.showUpgradePrompt();
                } else {
                    showUpgradePrompt();
                }
                return;
            }
            
            // Track search using centralized system
            if (window.AccessControl && window.AccessControl.trackSearch) {
                const allowed = window.AccessControl.trackSearch();
                if (!allowed) {
                    return; // Limit reached, upgrade prompt already shown
                }
            }
            
            // Auto-detect input type
            if (/^\d{4}$/.test(input)) {
                // Postcode
                searchByPostcode(input);
            } else if (/^\d+\s+/.test(input)) {
                // Address (starts with number)
                searchByAddress(input);
            } else {
                // Suburb name
                searchBySuburb(input);
            }
        }
        
        function searchBySuburb(suburb) {
            document.getElementById('suburb').value = suburb;
            document.getElementById('calculator').scrollIntoView({behavior: 'smooth'});
            setTimeout(() => calculateAScore(), 500);
        }
        
        function searchByPostcode(postcode) {
            // In production, lookup suburb by postcode
            alert(`Searching for properties in postcode ${postcode}...`);
        }
        
        function searchByAddress(address) {
            // In production, lookup property by address
            alert(`Looking up property at ${address}...`);
        }
        
        function showUpgradePrompt() {
            alert('You\'ve reached your limit of 3 free searches.\n\nUpgrade to Pro for unlimited searches and detailed insights!');
        }
        
        // A-Score Calculation
        function calculateAScore() {
            // Show loading state
            const btn = document.getElementById('ascoreBtn');
            if (btn) {
                const btnText = btn.querySelector('.btn-text');
                const btnIcon = btn.querySelector('.btn-icon');
                const loadingState = btn.querySelector('.loading-state');
                if (btnText) btnText.style.display = 'none';
                if (btnIcon) btnIcon.style.display = 'none';
                if (loadingState) loadingState.style.display = 'flex';
                btn.disabled = true;
            }
            const suburb = document.getElementById('suburb').value;
            
            if (!suburb) {
                // Hide loading state if no suburb selected
                if (btn) {
                    const btnText = btn.querySelector('.btn-text');
                    const btnIcon = btn.querySelector('.btn-icon');
                    const loadingState = btn.querySelector('.loading-state');
                    if (btnText) btnText.style.display = 'inline';
                    if (btnIcon) btnIcon.style.display = 'inline';
                    if (loadingState) loadingState.style.display = 'none';
                    btn.disabled = false;
                }
                return; // Don't calculate if no suburb selected
            }
            
            // Suburb data for 10 selected suburbs
            const suburbData = {
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
                // Additional Medium A-Score suburb
                'Camberwell': {
                    location: 8.3,
                    schools: 8.5,
                    safety: 8.1,
                    amenities: 8.2,
                    transport: 8.0,
                    lifestyle: 8.4,
                    growth: 7.0
                },
                // Additional Low A-Score suburb
                'Broadmeadows': {
                    location: 5.2,
                    schools: 4.8,
                    safety: 5.5,
                    amenities: 5.0,
                    transport: 5.8,
                    lifestyle: 5.2,
                    growth: 4.2
                }
            };
            
            const data = suburbData[suburb];
            
            if (!data) {
                // Hide loading state if suburb data not found
                if (btn) {
                    const btnText = btn.querySelector('.btn-text');
                    const btnIcon = btn.querySelector('.btn-icon');
                    const loadingState = btn.querySelector('.loading-state');
                    if (btnText) btnText.style.display = 'inline';
                    if (btnIcon) btnIcon.style.display = 'inline';
                    if (loadingState) loadingState.style.display = 'none';
                    btn.disabled = false;
                }
                alert('Suburb data not found. Please select a suburb from the dropdown.');
                return;
            }
            
            const weights = {
                location: 0.25,
                schools: 0.20,
                safety: 0.15,
                amenities: 0.15,
                transport: 0.15,
                lifestyle: 0.05,
                growth: 0.05
            };
            
            // Check cache first
            const cacheKey = `ascore-${suburb}`;
            if (scoreCache.has(cacheKey)) {
                const cached = scoreCache.get(cacheKey);
                displayAScore(cached.score, cached.breakdown);
                return;
            }
            
            let totalScore = 0;
            for (const [key, score] of Object.entries(data)) {
                totalScore += score * weights[key] * 10;
            }
            
            // Cache the result
            scoreCache.set(cacheKey, { score: totalScore, breakdown: data });
            
            displayAScore(totalScore, data);
        }
        
        function displayAScore(score, breakdown) {
            // Hide loading state
            const btn = document.getElementById('ascoreBtn');
            if (btn) {
                const btnText = btn.querySelector('.btn-text');
                const btnIcon = btn.querySelector('.btn-icon');
                const loadingState = btn.querySelector('.loading-state');
                if (btnText) btnText.style.display = 'inline';
                if (btnIcon) btnIcon.style.display = 'inline';
                if (loadingState) loadingState.style.display = 'none';
                btn.disabled = false;
            }
            
            // Hide empty state, show score display
            const emptyState = document.getElementById('ascoreEmptyState');
            const scoreDisplay = document.getElementById('ascoreDisplay');
            if (emptyState) emptyState.style.display = 'none';
            if (scoreDisplay) scoreDisplay.style.display = 'block';
            
            // Progressive score reveal with count-up animation
            const scoreElement = document.getElementById('ascoreValue');
            scoreElement.textContent = '0.0';
            scoreElement.style.animation = 'none';
            
            // Count-up animation
            animateCountUp(scoreElement, parseFloat(score.toFixed(1)), 1500);
            
            // Show autosave feedback
            showAutosaveFeedback('Calculating score...', false);
            setTimeout(() => {
                showAutosaveFeedback('Score calculated!', true);
            }, 1500);
            
            // Show rating and breakdown after score animation completes
            setTimeout(() => {
                // Rating with grade
                const ratingElement = document.getElementById('ascoreRating');
                const grade = getLetterGrade(score);
                if (score >= 90) {
                    ratingElement.innerHTML = `<span>🌟</span> Exceptional Suburb <span class="score-grade">${grade}</span>`;
                } else if (score >= 80) {
                    ratingElement.innerHTML = `<span>✅</span> Excellent Suburb <span class="score-grade">${grade}</span>`;
                } else if (score >= 70) {
                    ratingElement.innerHTML = `<span>👍</span> Good Suburb <span class="score-grade">${grade}</span>`;
                } else {
                    ratingElement.innerHTML = `<span>⚠️</span> Fair Suburb <span class="score-grade">${grade}</span>`;
                }
                
                // Percentile
                const percentile = getPercentile(score);
                document.getElementById('ascorePercentile').textContent = `Top ${percentile}% of Melbourne suburbs`;
                
                // Staggered breakdown reveal
                setTimeout(() => {
                    displayBreakdown('ascore', breakdown);
                }, 200);
                
                setTimeout(() => {
                    displayInsights('ascore', score, breakdown);
                }, 400);
            }, 1500);
        }
        
        // Load Property Profile
        function loadPropertyProfile() {
            const profile = document.getElementById('propertyProfile').value;
            
            const profiles = {
                'starter': {
                    price: 650000,
                    cbdDistance: 12,
                    trainDistance: 600,
                    safetyRating: 7.5,
                    lifestyleType: 'professional'
                },
                'family': {
                    price: 1200000,
                    cbdDistance: 8,
                    trainDistance: 500,
                    safetyRating: 8.5,
                    lifestyleType: 'family'
                },
                'investment': {
                    price: 850000,
                    cbdDistance: 15,
                    trainDistance: 800,
                    safetyRating: 7.8,
                    lifestyleType: 'investor'
                },
                'luxury': {
                    price: 2500000,
                    cbdDistance: 5,
                    trainDistance: 300,
                    safetyRating: 9.5,
                    lifestyleType: 'retiree'
                }
            };
            
            if (profile && profiles[profile]) {
                const p = profiles[profile];
                document.getElementById('price').value = p.price;
                document.getElementById('cbdDistance').value = p.cbdDistance;
                document.getElementById('trainDistance').value = p.trainDistance;
                document.getElementById('safetyRating').value = p.safetyRating;
                document.getElementById('lifestyleType').value = p.lifestyleType;
            }
        }
        
        // B-Score Calculation
        function calculateBScore() {
            // Show loading state
            const btn = document.getElementById('bscoreBtn');
            if (btn) {
                const btnText = btn.querySelector('.btn-text');
                const btnIcon = btn.querySelector('.btn-icon');
                const loadingState = btn.querySelector('.loading-state');
                if (btnText) btnText.style.display = 'none';
                if (btnIcon) btnIcon.style.display = 'none';
                if (loadingState) loadingState.style.display = 'flex';
                btn.disabled = true;
            }
            
            const profile = document.getElementById('propertyProfile').value;
            
            if (!profile) {
                // Hide loading state if no profile selected
                if (btn) {
                    const btnText = btn.querySelector('.btn-text');
                    const btnIcon = btn.querySelector('.btn-icon');
                    const loadingState = btn.querySelector('.loading-state');
                    if (btnText) btnText.style.display = 'inline';
                    if (btnIcon) btnIcon.style.display = 'inline';
                    if (loadingState) loadingState.style.display = 'none';
                    btn.disabled = false;
                }
                alert('Please select a property profile first.');
                return;
            }
            
            const price = parseFloat(document.getElementById('price').value);
            const cbdDistance = parseFloat(document.getElementById('cbdDistance').value);
            const trainDistance = parseFloat(document.getElementById('trainDistance').value) || 800;
            const safetyRating = parseFloat(document.getElementById('safetyRating').value) || 8;
            const lifestyleType = document.getElementById('lifestyleType').value;
            
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
            
            // Check cache first
            const cacheKey = `bscore-${profile}-${price}-${cbdDistance}-${trainDistance}-${safetyRating}-${lifestyleType}`;
            if (scoreCache.has(cacheKey)) {
                const cached = scoreCache.get(cacheKey);
                displayBScore(cached.score, cached.breakdown);
                return;
            }
            
            let totalScore = 0;
            for (const [key, score] of Object.entries(scores)) {
                totalScore += score * weights[key] * 10;
            }
            
            // Cache the result
            scoreCache.set(cacheKey, { score: totalScore, breakdown: scores });
            
            displayBScore(totalScore, scores);
        }
        
        function displayBScore(score, breakdown) {
            // Hide loading state
            const btn = document.getElementById('bscoreBtn');
            if (btn) {
                const btnText = btn.querySelector('.btn-text');
                const btnIcon = btn.querySelector('.btn-icon');
                const loadingState = btn.querySelector('.loading-state');
                if (btnText) btnText.style.display = 'inline';
                if (btnIcon) btnIcon.style.display = 'inline';
                if (loadingState) loadingState.style.display = 'none';
                btn.disabled = false;
            }
            
            // Hide empty state, show score display
            const emptyState = document.getElementById('bscoreEmptyState');
            const scoreDisplay = document.getElementById('bscoreDisplay');
            if (emptyState) emptyState.style.display = 'none';
            if (scoreDisplay) scoreDisplay.style.display = 'block';
            
            // Progressive score reveal with count-up animation
            const scoreElement = document.getElementById('bscoreValue');
            scoreElement.textContent = '0.0';
            scoreElement.style.animation = 'none';
            
            // Count-up animation
            animateCountUp(scoreElement, parseFloat(score.toFixed(1)), 1500);
            
            // Show autosave feedback
            showAutosaveFeedback('Calculating score...', false);
            setTimeout(() => {
                showAutosaveFeedback('Score calculated!', true);
            }, 1500);
            
            // Show rating and breakdown after score animation completes
            setTimeout(() => {
                const ratingElement = document.getElementById('bscoreRating');
                const grade = getLetterGrade(score);
                if (score >= 90) {
                    ratingElement.innerHTML = `<span>🚀</span> Outstanding Property <span class="score-grade">${grade}</span>`;
                } else if (score >= 80) {
                    ratingElement.innerHTML = `<span>⭐</span> Excellent Property <span class="score-grade">${grade}</span>`;
                } else if (score >= 70) {
                    ratingElement.innerHTML = `<span>✅</span> Strong Property <span class="score-grade">${grade}</span>`;
                } else {
                    ratingElement.innerHTML = `<span>👍</span> Good Property <span class="score-grade">${grade}</span>`;
                }
                
                const percentile = getPercentile(score);
                document.getElementById('bscorePercentile').textContent = `Top ${percentile}% of Melbourne properties`;
                
                // Staggered breakdown reveal
                setTimeout(() => {
                    displayBreakdown('bscore', breakdown);
                }, 200);
                
                setTimeout(() => {
                    displayInsights('bscore', score, breakdown);
                }, 400);
            }, 1500);
        }
        
        // Helper Functions
        function getLetterGrade(score) {
            if (score >= 95) return 'A+';
            if (score >= 90) return 'A';
            if (score >= 85) return 'A-';
            if (score >= 80) return 'B+';
            if (score >= 75) return 'B';
            if (score >= 70) return 'B-';
            if (score >= 65) return 'C+';
            if (score >= 60) return 'C';
            return 'C-';
        }
        
        function getPercentile(score) {
            if (score >= 95) return 5;
            if (score >= 90) return 10;
            if (score >= 85) return 15;
            if (score >= 80) return 25;
            if (score >= 75) return 35;
            return 50;
        }
        
        // =====================================================
        // RETENTION STRATEGY: High-Priority SaaS Techniques
        // =====================================================
        
        /**
         * Skeleton Loader - Show loading placeholder
         */
        function showSkeletonLoader(containerId) {
            const container = document.getElementById(containerId);
            if (!container) return;
            
            container.innerHTML = `
                <div class="skeleton-loader" style="
                    background: var(--bg-secondary);
                    border-radius: var(--radius-lg);
                    padding: var(--space-6);
                    animation: skeletonPulse 1.5s ease-in-out infinite;
                ">
                    <div style="
                        height: 40px;
                        background: var(--bg-tertiary);
                        border-radius: var(--radius-md);
                        margin-bottom: var(--space-4);
                        width: 60%;
                    "></div>
                    <div style="
                        height: 20px;
                        background: var(--bg-tertiary);
                        border-radius: var(--radius-sm);
                        margin-bottom: var(--space-2);
                        width: 100%;
                    "></div>
                    <div style="
                        height: 20px;
                        background: var(--bg-tertiary);
                        border-radius: var(--radius-sm);
                        width: 80%;
                    "></div>
                </div>
            `;
        }
        
        /**
         * Autosave with visual feedback
         */
        function showAutosaveFeedback(message = 'Saving...', success = false) {
            // Remove existing feedback
            const existing = document.getElementById('autosave-feedback');
            if (existing) existing.remove();
            
            const feedback = document.createElement('div');
            feedback.id = 'autosave-feedback';
            feedback.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: ${success ? 'var(--success)' : 'var(--bg-elevated)'};
                color: ${success ? 'var(--bg-primary)' : 'var(--text-primary)'};
                padding: var(--space-3) var(--space-5);
                border-radius: var(--radius-lg);
                box-shadow: var(--shadow-lg);
                z-index: 10000;
                font-size: 0.875rem;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: var(--space-2);
                animation: slideInUp 0.3s ease-out;
            `;
            feedback.innerHTML = `
                ${success ? '✓' : '⏳'} ${message}
            `;
            
            document.body.appendChild(feedback);
            
            if (success) {
                setTimeout(() => {
                    feedback.style.animation = 'slideOutDown 0.3s ease-out';
                    setTimeout(() => feedback.remove(), 300);
                }, 2000);
            }
        }
        
        /**
         * Contextual Sticky CTA - Appears at 40% scroll depth
         */
        function initStickyCTA() {
            let ctaShown = false;
            const cta = document.createElement('div');
            cta.id = 'sticky-cta';
            cta.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%) translateY(100px);
                background: linear-gradient(135deg, var(--orange-light) 0%, var(--orange-primary) 100%);
                color: var(--bg-primary);
                padding: var(--space-4) var(--space-8);
                border-radius: var(--radius-full);
                box-shadow: var(--shadow-xl), var(--shadow-orange);
                z-index: 9999;
                font-weight: 700;
                font-size: 1rem;
                cursor: pointer;
                transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                display: flex;
                align-items: center;
                gap: var(--space-2);
                white-space: nowrap;
            `;
            cta.innerHTML = `
                <span>🚀</span> Start Scoring Your Property
            `;
            cta.onclick = () => {
                document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
            };
            document.body.appendChild(cta);
            
            window.addEventListener('scroll', () => {
                const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
                
                if (scrollPercent >= 40 && !ctaShown) {
                    ctaShown = true;
                    setTimeout(() => {
                        cta.style.transform = 'translateX(-50%) translateY(0)';
                    }, 100);
                } else if (scrollPercent < 40 && ctaShown) {
                    ctaShown = false;
                    cta.style.transform = 'translateX(-50%) translateY(100px)';
                }
            });
        }
        
        /**
         * Modal Timing Psychology - Exit intent detection
         */
        function initExitIntentModal() {
            let exitIntentShown = false;
            let timeOnPage = 0;
            const startTime = Date.now();
            
            // Track time on page
            setInterval(() => {
                timeOnPage = (Date.now() - startTime) / 1000;
            }, 1000);
            
            // Exit intent detection
            document.addEventListener('mouseleave', (e) => {
                if (e.clientY <= 0 && !exitIntentShown && timeOnPage >= 10 && timeOnPage <= 30) {
                    exitIntentShown = true;
                    showExitIntentOffer();
                }
            });
        }
        
        function showExitIntentOffer() {
            const modal = document.createElement('div');
            modal.id = 'exit-intent-modal';
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(10px);
                z-index: 10001;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.3s ease-out;
            `;
            
            modal.innerHTML = `
                <div style="
                    background: var(--bg-secondary);
                    border: 2px solid var(--orange-primary);
                    border-radius: var(--radius-2xl);
                    padding: var(--space-8);
                    max-width: 500px;
                    margin: var(--space-4);
                    text-align: center;
                    box-shadow: var(--shadow-2xl);
                ">
                    <button onclick="this.closest('#exit-intent-modal').remove()" style="
                        position: absolute;
                        top: var(--space-4);
                        right: var(--space-4);
                        background: none;
                        border: none;
                        color: var(--text-secondary);
                        font-size: 1.5rem;
                        cursor: pointer;
                        width: 32px;
                        height: 32px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: var(--radius-full);
                        transition: all var(--transition-base);
                    " onmouseover="this.style.background='var(--bg-tertiary)'; this.style.color='var(--text-primary)'"
                       onmouseout="this.style.background='none'; this.style.color='var(--text-secondary)'">×</button>
                    
                    <div style="font-size: 3rem; margin-bottom: var(--space-4);">🎯</div>
                    <h2 style="
                        font-size: 1.75rem;
                        font-weight: 700;
                        color: var(--text-primary);
                        margin-bottom: var(--space-4);
                    ">Wait! Don't Miss Out</h2>
                    <p style="
                        color: var(--text-secondary);
                        margin-bottom: var(--space-6);
                        line-height: 1.6;
                    ">
                        Get started with property scoring in seconds. See how our 38+ data points can help you make smarter property decisions.
                    </p>
                    <div style="display: flex; gap: var(--space-4); justify-content: center; flex-wrap: wrap;">
                        <a href="#calculator" onclick="document.getElementById('exit-intent-modal').remove()" class="btn btn-primary" style="
                            padding: var(--space-4) var(--space-8);
                            text-decoration: none;
                        ">
                            Start Scoring Now
                        </a>
                        <button onclick="document.getElementById('exit-intent-modal').remove()" class="btn btn-secondary" style="
                            padding: var(--space-4) var(--space-8);
                        ">
                            Maybe Later
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Auto-close after 10 seconds
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.style.animation = 'fadeOut 0.3s ease-out';
                    setTimeout(() => modal.remove(), 300);
                }
            }, 10000);
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
        
        function calculateLifestyleScore(type) {
            const scores = {
                family: 8.8,
                professional: 8.5,
                retiree: 7.8,
                investor: 7.2
            };
            return scores[type] || 7.5;
        }
        
        function displayBreakdown(scoreType, scores) {
            const breakdownSection = document.getElementById(`${scoreType}Breakdown`);
            const breakdownItems = document.getElementById(`${scoreType}BreakdownItems`);
            
            breakdownSection.classList.remove('hidden');
            breakdownItems.innerHTML = '';
            
            const categoryData = {
                location: { emoji: '📍', name: 'Location Quality' },
                schools: { emoji: '🎓', name: 'School Quality' },
                safety: { emoji: '🛡️', name: 'Safety & Security' },
                amenities: { emoji: '🏪', name: 'Nearby Amenities' },
                transport: { emoji: '🚇', name: 'Transport Access' },
                transportation: { emoji: '🚇', name: 'Transportation' },
                lifestyle: { emoji: '🎨', name: 'Lifestyle Match' },
                growth: { emoji: '📈', name: 'Growth Potential' },
                affordability: { emoji: '💰', name: 'Affordability' },
                investment: { emoji: '💼', name: 'Investment Value' }
            };
            
            let index = 0;
            for (const [key, score] of Object.entries(scores)) {
                const category = categoryData[key] || { emoji: '📊', name: key };
                const item = document.createElement('div');
                item.className = 'breakdown-item';
                item.style.opacity = '0';
                item.style.transform = 'translateX(-20px)';
                item.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';
                item.innerHTML = `
                    <div class="breakdown-header">
                        <div class="breakdown-label">
                            <span class="breakdown-emoji">${category.emoji}</span>
                            ${category.name}
                        </div>
                        <div class="breakdown-value">${score.toFixed(1)}</div>
                    </div>
                    <div class="breakdown-bar">
                        <div class="breakdown-fill" style="width: 0%; transition: width 0.8s ease-out;"></div>
                    </div>
                `;
                breakdownItems.appendChild(item);
                
                // Staggered reveal animation
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateX(0)';
                    
                    // Animate progress bar
                    const fill = item.querySelector('.breakdown-fill');
                    setTimeout(() => {
                        fill.style.width = (score * 10) + '%';
                    }, 100);
                }, index * 100);
                
                index++;
            }
        }
        
        function displayInsights(scoreType, totalScore, scores) {
            const insightsSection = document.getElementById(`${scoreType}Insights`);
            const insightsContainer = document.getElementById(`${scoreType}InsightsContainer`);
            
            insightsSection.classList.remove('hidden');
            insightsContainer.innerHTML = '';
            
            const insights = generateInsights(totalScore, scores);
            
            insights.forEach(insight => {
                const card = document.createElement('div');
                card.className = 'insight-card';
                card.innerHTML = `
                    <div class="insight-header">
                        <div class="insight-icon">${insight.icon}</div>
                        <div class="insight-title">${insight.title}</div>
                    </div>
                    <div class="insight-message">${insight.message}</div>
                `;
                insightsContainer.appendChild(card);
            });
        }
        
        function generateInsights(totalScore, scores) {
            const insights = [];
            
            const topCategory = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
            insights.push({
                icon: '✨',
                title: 'Top Strength',
                message: `Outstanding ${topCategory[0]} score of ${topCategory[1].toFixed(1)}. This is a major advantage.`
            });
            
            if (totalScore >= 85) {
                insights.push({
                    icon: '🚀',
                    title: 'Premium Investment',
                    message: 'This property scores in the top tier. Exceptional fundamentals across multiple categories.'
                });
            } else if (totalScore >= 75) {
                insights.push({
                    icon: '⭐',
                    title: 'Strong Performer',
                    message: 'Solid performance across key metrics with strong long-term potential.'
                });
            }
            
            const weakCategory = Object.entries(scores).sort((a, b) => a[1] - b[1])[0];
            if (weakCategory[1] < 7) {
                insights.push({
                    icon: '🔍',
                    title: 'Area for Consideration',
                    message: `${weakCategory[0].charAt(0).toUpperCase() + weakCategory[0].slice(1)} scores ${weakCategory[1].toFixed(1)}. Review if this aligns with your priorities.`
                });
            }
            
            insights.push({
                icon: '💡',
                title: 'Investment Tip',
                message: 'Consider this score alongside market trends and your personal circumstances. Schedule an inspection to validate.'
            });
            
            return insights;
        }
        
        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            const nav = document.getElementById('mainNav');
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });
        
        // Smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        
        // Expose functions to global scope for inline onclick handlers
        window.calculateAScore = calculateAScore;
        window.calculateBScore = calculateBScore;
        window.loadPropertyProfile = loadPropertyProfile;
        
        // Initialize retention features on page load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                initStatsAnimations();
                initScrollAnimations();
                initStickyCTA();
                initExitIntentModal();
            });
        } else {
            // DOM already loaded
            initStatsAnimations();
            initScrollAnimations();
            initStickyCTA();
            initExitIntentModal();
        }
