/**
 * Score Enhancement Utilities
 * Adds percentile ranking, letter grades, and score meaning to score displays
 */

class ScoreEnhancements {
    /**
     * Calculate percentile ranking (0-100)
     * Assumes scores are normally distributed with mean ~75, std dev ~10
     */
    static calculatePercentile(score) {
        // Simplified percentile calculation
        // In production, this would use actual distribution data
        if (score >= 90) return 95;
        if (score >= 85) return 85;
        if (score >= 80) return 75;
        if (score >= 75) return 60;
        if (score >= 70) return 45;
        if (score >= 65) return 30;
        if (score >= 60) return 20;
        if (score >= 55) return 12;
        if (score >= 50) return 8;
        return 5;
    }

    /**
     * Get letter grade from score
     */
    static getLetterGrade(score) {
        if (score >= 90) return { grade: 'A+', color: '#10b981' };
        if (score >= 85) return { grade: 'A', color: '#10b981' };
        if (score >= 80) return { grade: 'A-', color: '#34d399' };
        if (score >= 75) return { grade: 'B+', color: '#3b82f6' };
        if (score >= 70) return { grade: 'B', color: '#3b82f6' };
        if (score >= 65) return { grade: 'B-', color: '#60a5fa' };
        if (score >= 60) return { grade: 'C+', color: '#f59e0b' };
        if (score >= 55) return { grade: 'C', color: '#f59e0b' };
        if (score >= 50) return { grade: 'C-', color: '#f97316' };
        return { grade: 'D', color: '#ef4444' };
    }

    /**
     * Get score meaning/description
     */
    static getScoreMeaning(score) {
        if (score >= 85) {
            return {
                text: 'Excellent - Outstanding investment & lifestyle match',
                description: 'This score indicates exceptional value across all key metrics. Strong growth potential, excellent location, and great lifestyle amenities.'
            };
        }
        if (score >= 75) {
            return {
                text: 'Very Good - Strong investment & lifestyle match',
                description: 'A well-rounded score showing good balance between investment potential and quality of life. Solid choice for most buyers.'
            };
        }
        if (score >= 65) {
            return {
                text: 'Good - Decent investment & lifestyle balance',
                description: 'A solid score indicating reasonable value. May excel in some areas while being average in others.'
            };
        }
        if (score >= 55) {
            return {
                text: 'Fair - Moderate investment & lifestyle value',
                description: 'An average score suggesting the property or suburb has some strengths but also notable weaknesses to consider.'
            };
        }
        return {
            text: 'Below Average - Limited investment & lifestyle value',
            description: 'This score indicates significant concerns across multiple metrics. Proceed with caution and thorough research.'
        };
    }

    /**
     * Create enhanced score display HTML
     */
    static createEnhancedScoreDisplay(score, scoreType = 'A-Score') {
        const percentile = this.calculatePercentile(score);
        const gradeInfo = this.getLetterGrade(score);
        const meaning = this.getScoreMeaning(score);
        
        const fragment = document.createDocumentFragment();
        
        // Score context (percentile)
        const contextDiv = document.createElement('div');
        contextDiv.className = 'score-context';
        const percentileSpan = document.createElement('span');
        percentileSpan.className = 'score-percentile';
        percentileSpan.textContent = `Top ${100 - percentile}% in Melbourne`;
        contextDiv.appendChild(percentileSpan);
        fragment.appendChild(contextDiv);
        
        // Main score display
        const mainDiv = document.createElement('div');
        mainDiv.className = 'score-main';
        
        const numberDiv = document.createElement('div');
        numberDiv.className = 'score-number';
        numberDiv.textContent = score.toFixed(1);
        mainDiv.appendChild(numberDiv);
        
        const gradeDiv = document.createElement('div');
        gradeDiv.className = `score-grade grade-${gradeInfo.grade.toLowerCase().replace('+', 'plus').replace('-', 'minus')}`;
        gradeDiv.textContent = gradeInfo.grade;
        gradeDiv.style.color = gradeInfo.color;
        mainDiv.appendChild(gradeDiv);
        
        fragment.appendChild(mainDiv);
        
        // Score meaning
        const meaningDiv = document.createElement('div');
        meaningDiv.className = 'score-meaning';
        meaningDiv.textContent = meaning.text;
        fragment.appendChild(meaningDiv);
        
        return fragment;
    }

    /**
     * Create accordion breakdown structure
     */
    static createAccordionBreakdown(tiers, scoreType = 'A-Score') {
        const fragment = document.createDocumentFragment();
        
        // Summary chips (always visible)
        const summaryDiv = document.createElement('div');
        summaryDiv.className = 'breakdown-summary';
        
        tiers.forEach(tier => {
            const chip = document.createElement('div');
            chip.className = 'tier-chip';
            chip.innerHTML = `
                <span class="tier-chip-icon">${tier.icon || '💰'}</span>
                <span class="tier-chip-label">${tier.name}</span>
                <span class="tier-chip-value">${tier.score.toFixed(0)}/${tier.max}</span>
            `;
            summaryDiv.appendChild(chip);
        });
        
        fragment.appendChild(summaryDiv);
        
        // Detailed breakdown (in accordion)
        tiers.forEach(tier => {
            const details = document.createElement('details');
            details.className = 'breakdown-detail';
            
            const summary = document.createElement('summary');
            summary.innerHTML = `
                <span>See how we calculated ${tier.name} (${tier.score.toFixed(0)}/${tier.max})</span>
                <span class="breakdown-toggle">▼</span>
            `;
            details.appendChild(summary);
            
            const content = document.createElement('div');
            content.className = 'breakdown-content';
            if (tier.details) {
                content.innerHTML = tier.details;
            }
            details.appendChild(content);
            
            fragment.appendChild(details);
        });
        
        return fragment;
    }
}

// Make available globally
if (typeof window !== 'undefined') {
    window.ScoreEnhancements = ScoreEnhancements;
}



