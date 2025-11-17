# Retention Strategy - Practical Implementation Guide
**Created:** 2025-11-15  
**Last Updated:** 2025-11-17  
**Purpose:** Concrete website changes for each psychological layer  
**Shows:** Before/After, code, visual descriptions, user experience

> **⚠️ IMPORTANT:** All tasks and checklists have been moved to `master-planning.md`.  
> **For active task management, see:** `working-documents/planning/master-planning.md` → **Phase 3: Retention Strategy Implementation**

This document now serves as a reference guide only. All actionable tasks are tracked in the master planning file.

---

## Overview: What Actually Changes

This guide shows **exactly** what changes on the website at each layer. Each section includes:
- **Before**: Current state
- **After**: New implementation
- **Code**: Actual implementation
- **Visual**: What users see
- **Experience**: How it feels

---

## Layer 1: Entry & First Impression (0-5 seconds)

### Current State (Before)
```
User lands on calculator.html
→ Sees static page
→ Suburb dropdown visible
→ No immediate score
→ Must select suburb and click to see results
```

### New Implementation (After)

#### 1.1 Hero Score Display (Anchoring)
**What Changes:**
- Large, prominent score card appears immediately on page load
- Shows a "sample" or "featured" suburb score (e.g., Hawthorn: 92/100)
- Acts as visual anchor before user makes selection

**Visual:**
```
┌─────────────────────────────────────┐
│  🏡 HomeScorePro                    │
├─────────────────────────────────────┤
│                                     │
│  Featured Suburb: Hawthorn          │
│  ┌─────────────────────────────┐   │
│  │                             │   │
│  │        92 / 100             │   │
│  │        A+                   │   │
│  │                             │   │
│  │  [See Full Breakdown →]     │   │
│  └─────────────────────────────┘   │
│                                     │
│  [Select Your Suburb ▼]            │
└─────────────────────────────────────┘
```

**Code Implementation:**
```html
<!-- calculator.html - Add after hero section -->
<section class="featured-score-anchor">
    <div class="score-card-large">
        <div class="score-label">Featured Suburb</div>
        <div class="score-value" id="featuredScore">92</div>
        <div class="score-max">/ 100</div>
        <div class="score-grade">A+</div>
        <div class="score-suburb">Hawthorn</div>
        <button class="btn-explore" onclick="scrollToCalculator()">
            Explore Your Suburb →
        </button>
    </div>
</section>
```

```css
/* css/calculator.css - Add new styles */
.featured-score-anchor {
    padding: var(--space-16) var(--space-6);
    background: linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary));
    text-align: center;
}

.score-card-large {
    max-width: 400px;
    margin: 0 auto;
    background: var(--glass-bg);
    backdrop-filter: blur(20px);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-2xl);
    padding: var(--space-12);
    box-shadow: var(--shadow-xl);
}

.score-value {
    font-size: 4rem;
    font-weight: 900;
    background: linear-gradient(135deg, var(--orange-light), var(--orange-primary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    line-height: 1;
    margin: var(--space-4) 0;
    animation: countUp 1.5s ease-out;
}

@keyframes countUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
```

**User Experience:**
- **0s**: Page loads, featured score fades in
- **0.5s**: Score number animates from 0 to 92
- **1s**: Grade "A+" appears
- **1.5s**: "Explore Your Suburb" button appears
- **2s**: User's attention anchored to high score

---

#### 1.2 Minimal Cognitive Load (Cognitive Load Theory)
**What Changes:**
- Simplified initial view
- Hide complex options until needed
- Clear visual hierarchy
- Remove distractions

**Visual:**
```
BEFORE:
┌─────────────────────────────────────┐
│  [Complex form with many fields]    │
│  [Multiple tabs]                    │
│  [Lots of text]                     │
└─────────────────────────────────────┘

AFTER:
┌─────────────────────────────────────┐
│  Select Suburb: [Dropdown ▼]       │
│                                     │
│  [Calculate Score]                  │
│                                     │
│  (Advanced options hidden)          │
└─────────────────────────────────────┘
```

**Code Implementation:**
```html
<!-- Simplify initial calculator section -->
<section id="calculator" class="calculator-section">
    <div class="calculator-simple">
        <h2>Suburb Scout</h2>
        <div class="input-group">
            <label>Select Suburb</label>
            <select id="suburb" class="suburb-select">
                <option value="">Choose a suburb...</option>
                <!-- Options -->
            </select>
        </div>
        <button class="btn-calculate" onclick="calculateAScore()">
            Get Score
        </button>
        <button class="btn-advanced-toggle" onclick="showAdvanced()">
            Advanced Options
        </button>
    </div>
    
    <!-- Advanced options hidden by default -->
    <div id="advancedOptions" class="advanced-options hidden">
        <!-- Complex options here -->
    </div>
</section>
```

```css
.advanced-options.hidden {
    display: none;
}

.calculator-simple {
    max-width: 500px;
    margin: 0 auto;
    padding: var(--space-8);
}

.input-group {
    margin-bottom: var(--space-6);
}

.suburb-select {
    width: 100%;
    padding: var(--space-4);
    background: var(--bg-tertiary);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg);
    color: var(--text-primary);
    font-size: 1rem;
}
```

**User Experience:**
- **0s**: Clean, simple interface
- **1s**: User understands what to do immediately
- **2s**: No cognitive overload
- **3s**: Can take action quickly

---

#### 1.3 Positive First Frame (First Impressions)
**What Changes:**
- Show high-quality suburb first (not random)
- Positive messaging
- Success indicators visible
- Optimistic tone

**Code Implementation:**
```javascript
// js/calculator.js - Featured suburb selection
function initializeFeaturedSuburb() {
    // Always show a high-scoring suburb as anchor
    const featuredSuburbs = [
        { name: 'Hawthorn', score: 92, grade: 'A+' },
        { name: 'Brighton', score: 91, grade: 'A+' },
        { name: 'Balwyn', score: 94, grade: 'A+' }
    ];
    
    const featured = featuredSuburbs[Math.floor(Math.random() * featuredSuburbs.length)];
    displayFeaturedScore(featured);
}

function displayFeaturedScore(suburb) {
    const scoreEl = document.getElementById('featuredScore');
    animateScore(scoreEl, suburb.score);
    
    // Update other elements
    document.querySelector('.score-grade').textContent = suburb.grade;
    document.querySelector('.score-suburb').textContent = suburb.name;
}
```

**User Experience:**
- **0s**: Sees impressive score (92/100, A+)
- **1s**: Positive first impression
- **2s**: Expectation set high
- **3s**: Motivated to explore

---

## Layer 2: Engagement & Exploration (5-30 seconds)

### Current State (Before)
```
User selects suburb
→ Clicks calculate
→ Score appears instantly (all at once)
→ Static display
→ No animation or progression
```

### New Implementation (After)

#### 2.1 Progressive Score Reveal (Flow State + Variable Rewards)
**What Changes:**
- Score animates from 0 to final value
- Breakdown appears progressively
- Each tier reveals sequentially
- Creates anticipation and flow

**Visual:**
```
Step 1 (0ms): Score starts animating
┌─────────────────────┐
│   0 → 92            │
│   (counting up)     │
└─────────────────────┘

Step 2 (1500ms): Score complete, grade appears
┌─────────────────────┐
│   92 / 100          │
│   A+                │
└─────────────────────┘

Step 3 (1800ms): Tier 1 appears
┌─────────────────────┐
│   Investment: 88    │
│   ████████░░ 88%    │
└─────────────────────┘

Step 4 (2100ms): Tier 2 appears
┌─────────────────────┐
│   Investment: 88    │
│   Location: 85      │
│   ████████░░ 88%    │
│   ███████░░░ 85%    │
└─────────────────────┘

Step 5 (2400ms): All tiers visible
┌─────────────────────┐
│   Investment: 88    │
│   Location: 85      │
│   Accessibility: 90 │
│   Lifestyle: 87     │
│   Property: 82      │
└─────────────────────┘
```

**Code Implementation:**
```javascript
// js/calculator.js - Progressive reveal
function displayAScore(scoreData) {
    const scoreCard = document.getElementById('scoreCard');
    
    // Step 1: Animate main score
    const scoreValue = scoreCard.querySelector('.score-value');
    animateScore(scoreValue, scoreData.total, 1500);
    
    // Step 2: Show grade after score
    setTimeout(() => {
        const grade = scoreCard.querySelector('.score-grade');
        grade.textContent = scoreData.grade;
        grade.style.opacity = '0';
        grade.style.transform = 'translateY(10px)';
        grade.style.transition = 'all 0.4s ease-out';
        
        requestAnimationFrame(() => {
            grade.style.opacity = '1';
            grade.style.transform = 'translateY(0)';
        });
    }, 1500);
    
    // Step 3: Reveal breakdown progressively
    const tiers = ['investment', 'location', 'accessibility', 'lifestyle', 'property'];
    tiers.forEach((tier, index) => {
        setTimeout(() => {
            revealTier(tier, scoreData.breakdown[tier], index * 300);
        }, 1800 + (index * 300));
    });
}

function animateScore(element, target, duration = 1500) {
    const start = 0;
    const increment = target / (duration / 16); // 60fps
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = Math.round(target);
            clearInterval(timer);
        } else {
            element.textContent = Math.round(current);
        }
    }, 16);
}

function revealTier(tierName, tierData, delay) {
    const tierElement = document.getElementById(`tier-${tierName}`);
    if (!tierElement) return;
    
    setTimeout(() => {
        tierElement.style.opacity = '0';
        tierElement.style.transform = 'translateX(-20px)';
        tierElement.style.transition = 'all 0.4s ease-out';
        tierElement.classList.remove('hidden');
        
        requestAnimationFrame(() => {
            tierElement.style.opacity = '1';
            tierElement.style.transform = 'translateX(0)';
            
            // Animate progress bar
            const bar = tierElement.querySelector('.progress-bar');
            animateProgressBar(bar, tierData.score);
        });
    }, delay);
}

function animateProgressBar(bar, target) {
    bar.style.width = '0%';
    setTimeout(() => {
        bar.style.transition = 'width 0.8s ease-out';
        bar.style.width = target + '%';
    }, 100);
}
```

**User Experience:**
- **5s**: User clicks "Calculate"
- **5.5s**: Score starts counting up (0 → 92)
- **7s**: Score completes, grade "A+" appears
- **7.5s**: First tier (Investment) slides in
- **8s**: Second tier (Location) slides in
- **8.5s**: Third tier appears... and so on
- **10s**: All tiers visible, user engaged

---

#### 2.2 Staggered Content Appearance (Progressive Disclosure)
**What Changes:**
- Content appears in logical sequence
- Each element has slight delay
- Creates visual rhythm
- Maintains attention

**Code Implementation:**
```javascript
// js/calculator.js - Staggered appearance
function revealContentStaggered() {
    const elements = [
        { selector: '.score-value', delay: 0 },
        { selector: '.score-grade', delay: 300 },
        { selector: '.score-breakdown', delay: 600 },
        { selector: '.score-insights', delay: 1200 },
        { selector: '.score-recommendations', delay: 1800 }
    ];
    
    elements.forEach(({ selector, delay }) => {
        const element = document.querySelector(selector);
        if (!element) return;
        
        setTimeout(() => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'all 0.5s ease-out';
            element.classList.remove('hidden');
            
            requestAnimationFrame(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            });
        }, delay);
    });
}
```

**User Experience:**
- **5s**: Score appears
- **5.3s**: Grade appears
- **5.6s**: Breakdown appears
- **6.2s**: Insights appear
- **6.8s**: Recommendations appear
- Continuous engagement, no overwhelming

---

#### 2.3 Discovery Moments (Variable Rewards)
**What Changes:**
- Unexpected insights appear
- "You might also like..." suggestions
- Hidden gems revealed
- Surprise recommendations

**Visual:**
```
After score calculation:
┌─────────────────────────────────────┐
│  Score: 92 / 100 (A+)               │
│                                     │
│  💡 Insight:                        │
│  "This suburb ranks in the top 15%  │
│   of all Melbourne suburbs"         │
│                                     │
│  🔍 You might also like:            │
│  • Brighton (91/100)                │
│  • Balwyn (94/100)                  │
└─────────────────────────────────────┘
```

**Code Implementation:**
```javascript
// js/calculator.js - Discovery moments
function showDiscoveryMoments(score, suburb) {
    // Wait 2 seconds after score appears
    setTimeout(() => {
        // Insight 1: Percentile ranking
        if (score >= 90) {
            showInsight({
                type: 'percentile',
                message: `This suburb ranks in the top ${calculatePercentile(score)}% of all Melbourne suburbs`,
                icon: '🏆'
            });
        }
        
        // Insight 2: Similar suburbs
        setTimeout(() => {
            const similar = findSimilarSuburbs(suburb, score);
            if (similar.length > 0) {
                showRecommendation({
                    type: 'similar',
                    suburbs: similar,
                    message: 'You might also like:'
                });
            }
        }, 1500);
        
        // Insight 3: Hidden gem (if applicable)
        setTimeout(() => {
            if (score >= 85 && score < 90) {
                showInsight({
                    type: 'hidden-gem',
                    message: 'This suburb offers excellent value with strong growth potential',
                    icon: '💎'
                });
            }
        }, 3000);
    }, 2000);
}

function showInsight(insight) {
    const insightCard = document.createElement('div');
    insightCard.className = 'insight-card';
    insightCard.innerHTML = `
        <div class="insight-icon">${insight.icon}</div>
        <div class="insight-message">${insight.message}</div>
    `;
    
    insightCard.style.opacity = '0';
    insightCard.style.transform = 'translateY(20px)';
    document.getElementById('insightsContainer').appendChild(insightCard);
    
    requestAnimationFrame(() => {
        insightCard.style.transition = 'all 0.5s ease-out';
        insightCard.style.opacity = '1';
        insightCard.style.transform = 'translateY(0)';
    });
    
    // Auto-dismiss after 8 seconds
    setTimeout(() => {
        insightCard.style.opacity = '0';
        setTimeout(() => insightCard.remove(), 500);
    }, 8000);
}
```

**User Experience:**
- **7s**: Score visible
- **9s**: "Top 15%" insight appears (surprise!)
- **10.5s**: Similar suburbs recommendation (discovery!)
- **12s**: Hidden gem insight (value!)

---

## Layer 3: Deep Engagement (30 seconds - 2 minutes)

### Current State (Before)
```
User sees score
→ Static display
→ No customization
→ No comparison tools
→ Limited interaction
```

### New Implementation (After)

#### 3.1 Customization Options (Self-Determination - Autonomy)
**What Changes:**
- Users can adjust metric weights
- Customize preferences
- Save their settings
- Control their experience

**Visual:**
```
┌─────────────────────────────────────┐
│  Customize Your Priorities          │
│                                     │
│  Schools:        [━━━━━━━━━━] 80%  │
│  Transport:      [━━━━━━━━━░] 70%  │
│  Safety:         [━━━━━━━━━━] 80%  │
│  Amenities:      [━━━━━━░░░░] 50%  │
│                                     │
│  [Save Preferences] [Reset]         │
└─────────────────────────────────────┘
```

**Code Implementation:**
```html
<!-- calculator.html - Add customization panel -->
<div id="customizationPanel" class="customization-panel hidden">
    <h3>Customize Your Priorities</h3>
    <p>Adjust weights to match what matters most to you</p>
    
    <div class="weight-controls">
        <div class="weight-control">
            <label>Schools</label>
            <input type="range" id="weight-schools" min="0" max="100" value="80">
            <span class="weight-value">80%</span>
        </div>
        <!-- More controls -->
    </div>
    
    <div class="customization-actions">
        <button onclick="applyCustomWeights()">Apply</button>
        <button onclick="resetWeights()">Reset</button>
        <button onclick="savePreferences()">Save Preferences</button>
    </div>
</div>
```

```javascript
// js/calculator.js - Customization
function applyCustomWeights() {
    const weights = {
        schools: document.getElementById('weight-schools').value / 100,
        transport: document.getElementById('weight-transport').value / 100,
        safety: document.getElementById('weight-safety').value / 100,
        amenities: document.getElementById('weight-amenities').value / 100
    };
    
    // Recalculate score with custom weights
    const newScore = calculateAScoreWithWeights(currentSuburb, weights);
    displayAScore(newScore);
    
    // Show feedback
    showFeedback('Score updated with your preferences!');
}
```

**User Experience:**
- **30s**: User wants more control
- **35s**: Opens customization panel
- **40s**: Adjusts weights
- **45s**: Sees score update in real-time
- **50s**: Feels in control, engaged

---

#### 3.2 Comparison Tools (Zeigarnik Effect)
**What Changes:**
- Side-by-side suburb comparison
- "Incomplete" comparison creates tension
- Progress indicator shows completion
- Encourages finishing comparison

**Visual:**
```
┌─────────────────────────────────────┐
│  Compare Suburbs                    │
│  [2 of 3 selected]                  │
│  ████████░░ 67%                     │
│                                     │
│  ┌──────────┐  ┌──────────┐        │
│  │ Hawthorn │  │ Brighton │        │
│  │   92     │  │   91     │        │
│  │   A+     │  │   A+     │        │
│  └──────────┘  └──────────┘        │
│                                     │
│  [+ Add Another Suburb]             │
│  [View Full Comparison]             │
└─────────────────────────────────────┘
```

**Code Implementation:**
```javascript
// js/calculator.js - Comparison tool
let comparedSuburbs = [];

function addToComparison(suburb, score) {
    comparedSuburbs.push({ suburb, score });
    updateComparisonDisplay();
    updateProgressIndicator();
}

function updateProgressIndicator() {
    const progress = (comparedSuburbs.length / 3) * 100;
    const progressBar = document.getElementById('comparisonProgress');
    progressBar.style.width = progress + '%';
    
    const status = document.getElementById('comparisonStatus');
    status.textContent = `${comparedSuburbs.length} of 3 selected`;
    
    // Zeigarnik effect: Show completion prompt
    if (comparedSuburbs.length === 2) {
        showCompletionPrompt('Add one more suburb to see full comparison');
    }
}

function showCompletionPrompt(message) {
    const prompt = document.createElement('div');
    prompt.className = 'completion-prompt';
    prompt.textContent = message;
    prompt.style.opacity = '0';
    document.body.appendChild(prompt);
    
    requestAnimationFrame(() => {
        prompt.style.transition = 'all 0.3s ease-out';
        prompt.style.opacity = '1';
    });
    
    setTimeout(() => {
        prompt.style.opacity = '0';
        setTimeout(() => prompt.remove(), 300);
    }, 4000);
}
```

**User Experience:**
- **45s**: User adds first suburb to comparison
- **50s**: Adds second suburb
- **52s**: Sees "2 of 3 selected" - feels incomplete
- **55s**: Prompt: "Add one more to see full comparison"
- **60s**: Adds third suburb - feels complete, satisfied

---

#### 3.3 Detailed Information (Elaboration Likelihood - Central Route)
**What Changes:**
- Expandable detailed breakdowns
- Methodology explanations
- Data sources visible
- Deep dive options

**Code Implementation:**
```html
<!-- calculator.html - Detailed breakdown -->
<div class="score-breakdown-detailed">
    <div class="tier-summary" onclick="toggleTierDetails('investment')">
        <div class="tier-header">
            <span>Investment Potential</span>
            <span class="tier-score">88/100</span>
            <span class="expand-icon">▼</span>
        </div>
    </div>
    
    <div id="tier-investment-details" class="tier-details hidden">
        <div class="metric">
            <span>Rental Yield</span>
            <span>4.2%</span>
            <div class="metric-explanation">
                Above Melbourne average of 3.8%
            </div>
        </div>
        <div class="metric">
            <span>Capital Growth (1yr)</span>
            <span>+7.5%</span>
            <div class="metric-explanation">
                Strong growth trend over past 5 years
            </div>
        </div>
        <div class="data-source">
            <small>Data source: CoreLogic, ABS</small>
        </div>
    </div>
</div>
```

**User Experience:**
- **60s**: User wants more details
- **65s**: Clicks to expand tier
- **66s**: Detailed metrics appear
- **70s**: Reads explanations
- **75s**: Feels informed, trusts data

---

## Layer 4: Decision Support (2-5 minutes)

### Current State (Before)
```
User has score
→ No context
→ No social validation
→ No recommendations
→ Must figure out next steps alone
```

### New Implementation (After)

#### 4.1 Positive Framing (Prospect Theory)
**What Changes:**
- Frame scores as gains
- Show opportunities
- Emphasize potential
- Avoid negative language

**Code Implementation:**
```javascript
// js/calculator.js - Positive framing
function frameScoreMessage(score) {
    const messages = {
        excellent: {
            threshold: 90,
            message: "Exceptional suburb with outstanding features",
            submessage: "You're in the top 15% of all Melbourne suburbs"
        },
        strong: {
            threshold: 80,
            message: "Strong suburb with great potential",
            submessage: "Above average performance across key metrics"
        },
        solid: {
            threshold: 70,
            message: "Solid choice with good fundamentals",
            submessage: "Reliable option with room for growth"
        },
        value: {
            threshold: 0,
            message: "Affordable option with growth potential",
            submessage: "Great value for your budget"
        }
    };
    
    let frame = messages.value;
    if (score >= 90) frame = messages.excellent;
    else if (score >= 80) frame = messages.strong;
    else if (score >= 70) frame = messages.solid;
    
    return frame;
}

function displayFramedMessage(score) {
    const frame = frameScoreMessage(score);
    const messageEl = document.getElementById('scoreMessage');
    messageEl.innerHTML = `
        <h3>${frame.message}</h3>
        <p>${frame.submessage}</p>
    `;
    
    // Animate in
    messageEl.style.opacity = '0';
    messageEl.style.transform = 'translateY(10px)';
    setTimeout(() => {
        messageEl.style.transition = 'all 0.5s ease-out';
        messageEl.style.opacity = '1';
        messageEl.style.transform = 'translateY(0)';
    }, 100);
}
```

**User Experience:**
- **120s**: Score calculated
- **121s**: Sees "Exceptional suburb with outstanding features"
- **122s**: Feels positive, motivated
- **125s**: "Top 15%" message reinforces positivity

---

#### 4.2 Social Proof (Social Proof Theory)
**What Changes:**
- Show activity indicators
- Display popularity
- Provide benchmarks
- Show what others chose

**Visual:**
```
┌─────────────────────────────────────┐
│  Score: 92 / 100 (A+)               │
│                                     │
│  📊 This Week:                      │
│  • 1,247 properties analyzed        │
│  • Hawthorn: Most searched suburb   │
│  • Your score: Top 15%              │
│                                     │
│  👥 Others who viewed this also     │
│     checked: Brighton, Balwyn       │
└─────────────────────────────────────┘
```

**Code Implementation:**
```javascript
// js/calculator.js - Social proof
function displaySocialProof(suburb) {
    const proofData = {
        weeklyAnalyses: 1247,
        mostSearched: 'Hawthorn',
        percentile: calculatePercentile(getScore(suburb)),
        alsoViewed: ['Brighton', 'Balwyn', 'Box Hill']
    };
    
    const proofEl = document.getElementById('socialProof');
    proofEl.innerHTML = `
        <div class="proof-item">
            <span class="proof-icon">📊</span>
            <span>${proofData.weeklyAnalyses.toLocaleString()} properties analyzed this week</span>
        </div>
        <div class="proof-item">
            <span class="proof-icon">🔥</span>
            <span>${proofData.mostSearched}: Most searched suburb</span>
        </div>
        <div class="proof-item">
            <span class="proof-icon">🏆</span>
            <span>Your score: Top ${proofData.percentile}%</span>
        </div>
        <div class="proof-item">
            <span class="proof-icon">👥</span>
            <span>Others also viewed: ${proofData.alsoViewed.join(', ')}</span>
        </div>
    `;
    
    // Stagger appearance
    const items = proofEl.querySelectorAll('.proof-item');
    items.forEach((item, index) => {
        item.style.opacity = '0';
        setTimeout(() => {
            item.style.transition = 'all 0.4s ease-out';
            item.style.opacity = '1';
        }, 2000 + (index * 200));
    });
}
```

**User Experience:**
- **130s**: Sees "1,247 properties analyzed"
- **131s**: Feels part of active community
- **132s**: "Top 15%" validates choice
- **133s**: "Others also viewed" provides guidance

---

#### 4.3 Strategic Anchoring (Anchoring & Adjustment)
**What Changes:**
- Show best options first
- Provide context anchors
- Use percentile rankings
- Frame comparisons advantageously

**Code Implementation:**
```javascript
// js/calculator.js - Strategic anchoring
function displayAnchoredRecommendations(currentScore, currentSuburb) {
    // Get similar suburbs, ordered by score (best first)
    const recommendations = getSimilarSuburbs(currentSuburb)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
    
    // Always show current suburb first (if it's high)
    if (currentScore >= 85) {
        recommendations.unshift({
            suburb: currentSuburb,
            score: currentScore,
            isCurrent: true
        });
    }
    
    const recEl = document.getElementById('recommendations');
    recEl.innerHTML = recommendations.map((rec, index) => {
        const percentile = calculatePercentile(rec.score);
        return `
            <div class="recommendation-card ${rec.isCurrent ? 'current' : ''}">
                <div class="rec-rank">${index + 1}</div>
                <div class="rec-suburb">${rec.suburb}</div>
                <div class="rec-score">${rec.score}/100</div>
                <div class="rec-percentile">Top ${percentile}%</div>
                ${rec.isCurrent ? '<div class="rec-badge">Your Selection</div>' : ''}
            </div>
        `;
    }).join('');
}
```

**User Experience:**
- **140s**: Sees recommendations
- **141s**: Current suburb shown first (if high score)
- **142s**: "Top 15%" anchor sets expectation
- **143s**: Other options compared to anchor

---

## Layer 5: Retention & Return (Post-Session)

### Current State (Before)
```
User leaves
→ No save functionality
→ No reminders
→ No progress tracking
→ Must start over next time
```

### New Implementation (After)

#### 5.1 Save State (Commitment & Consistency)
**What Changes:**
- Auto-save searches
- Remember preferences
- Save comparisons
- Return to where they left off

**Code Implementation:**
```javascript
// js/calculator.js - Save state
function autoSaveState() {
    const state = {
        lastSearched: currentSuburb,
        lastScore: currentScore,
        comparedSuburbs: comparedSuburbs,
        preferences: getUserPreferences(),
        timestamp: Date.now()
    };
    
    localStorage.setItem('homescorepro_state', JSON.stringify(state));
}

function loadSavedState() {
    const saved = localStorage.getItem('homescorepro_state');
    if (!saved) return;
    
    const state = JSON.parse(saved);
    const daysSince = (Date.now() - state.timestamp) / (1000 * 60 * 60 * 24);
    
    if (daysSince < 7) {
        showWelcomeBack(state);
        restoreState(state);
    }
}

function showWelcomeBack(state) {
    const welcomeEl = document.createElement('div');
    welcomeEl.className = 'welcome-back-banner';
    welcomeEl.innerHTML = `
        <div class="welcome-content">
            <span>👋 Welcome back!</span>
            <span>Continue where you left off with ${state.lastSearched}</span>
            <button onclick="restoreState(${JSON.stringify(state)})">Continue</button>
        </div>
    `;
    
    document.body.insertBefore(welcomeEl, document.body.firstChild);
    
    setTimeout(() => {
        welcomeEl.style.opacity = '0';
        setTimeout(() => welcomeEl.remove(), 500);
    }, 5000);
}
```

**User Experience:**
- **Next visit**: Sees "Welcome back!"
- **1s**: "Continue with Hawthorn" prompt
- **2s**: Clicks continue
- **3s**: Previous state restored
- **4s**: Feels recognized, continues seamlessly

---

#### 5.2 Progress Tracking (Reciprocity)
**What Changes:**
- Track searches used
- Show progress
- Recognize achievements
- Provide value first

**Visual:**
```
┌─────────────────────────────────────┐
│  Your Progress                      │
│                                     │
│  Suburbs Explored: 5                │
│  ████████░░ 83%                     │
│                                     │
│  🏆 Achievements:                   │
│  • Explorer (5+ suburbs)            │
│  • Researcher (10+ searches)        │
│                                     │
│  [View Full Dashboard]              │
└─────────────────────────────────────┘
```

**Code Implementation:**
```javascript
// js/calculator.js - Progress tracking
function updateProgress() {
    const searches = getSearchCount();
    const achievements = checkAchievements(searches);
    
    const progressEl = document.getElementById('userProgress');
    progressEl.innerHTML = `
        <div class="progress-stats">
            <div class="stat">
                <span class="stat-label">Suburbs Explored</span>
                <span class="stat-value">${searches}</span>
            </div>
            <div class="progress-bar-container">
                <div class="progress-bar" style="width: ${(searches / 10) * 100}%"></div>
            </div>
        </div>
        <div class="achievements">
            ${achievements.map(a => `
                <div class="achievement-badge">
                    <span>${a.icon}</span>
                    <span>${a.name}</span>
                </div>
            `).join('')}
        </div>
    `;
}

function checkAchievements(searches) {
    const achievements = [];
    if (searches >= 5) achievements.push({ icon: '🏆', name: 'Explorer' });
    if (searches >= 10) achievements.push({ icon: '🔍', name: 'Researcher' });
    if (searches >= 20) achievements.push({ icon: '⭐', name: 'Expert' });
    return achievements;
}
```

**User Experience:**
- **Return visit**: Sees progress dashboard
- **1s**: "5 suburbs explored" - feels accomplished
- **2s**: Achievement badge appears
- **3s**: Motivated to continue

---

#### 5.3 Scarcity & Value (Scarcity Principle)
**What Changes:**
- Show remaining free searches
- Highlight exclusive features
- Create urgency (ethical)
- Emphasize value

**Code Implementation:**
```javascript
// js/calculator.js - Scarcity display
function displaySearchLimit() {
    const remaining = MAX_FREE_SEARCHES - searchCount;
    const limitEl = document.getElementById('searchLimit');
    
    if (remaining > 0) {
        limitEl.innerHTML = `
            <div class="limit-indicator">
                <span>${remaining} of ${MAX_FREE_SEARCHES} free searches remaining</span>
                <div class="limit-progress">
                    <div class="limit-bar" style="width: ${(remaining / MAX_FREE_SEARCHES) * 100}%"></div>
                </div>
            </div>
        `;
        
        if (remaining === 1) {
            showUpgradePrompt('Last free search! Upgrade for unlimited access');
        }
    } else {
        showUpgradePrompt('Upgrade to Pro for unlimited searches and detailed insights');
    }
}
```

**User Experience:**
- **During session**: Sees "2 of 3 searches remaining"
- **After 2 searches**: "Last free search!" prompt
- **After 3 searches**: Upgrade prompt with value proposition
- **Feels**: Aware of limit, considers upgrade

---

## Summary: Complete User Journey

### Timeline of Changes

**0-5 seconds (Entry):**
- ✅ Featured score anchor appears
- ✅ Clean, simple interface
- ✅ Positive first impression

**5-30 seconds (Engagement):**
- ✅ Score animates progressively
- ✅ Breakdown reveals tier by tier
- ✅ Discovery moments appear

**30s-2min (Deep Engagement):**
- ✅ Customization options available
- ✅ Comparison tools accessible
- ✅ Detailed information expandable

**2-5 minutes (Decision Support):**
- ✅ Positive framing messages
- ✅ Social proof indicators
- ✅ Strategic recommendations

**Post-Session (Retention):**
- ✅ State auto-saved
- ✅ Progress tracked
- ✅ Welcome back on return

---

## Implementation Checklist

### Phase 1: Entry & First Impression
- [ ] Add featured score anchor component
- [ ] Simplify initial calculator interface
- [ ] Implement positive first frame logic
- [ ] Add hero score animations

### Phase 2: Engagement & Exploration
- [ ] Implement progressive score reveal
- [ ] Add staggered content appearance
- [ ] Create discovery moments system
- [ ] Build insight cards

### Phase 3: Deep Engagement
- [ ] Add customization panel
- [ ] Build comparison tool
- [ ] Create detailed breakdown views
- [ ] Implement progress indicators

### Phase 4: Decision Support
- [ ] Add positive framing messages
- [ ] Implement social proof display
- [ ] Create recommendation engine
- [ ] Build comparison matrix

### Phase 5: Retention & Return
- [ ] Implement auto-save functionality
- [ ] Create progress tracking
- [ ] Add welcome back banner
- [ ] Build achievement system

---

**This guide shows exactly what changes on the website at each layer. Each feature is concrete, implementable, and directly improves user engagement through psychological principles.**

