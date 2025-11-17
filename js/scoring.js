/**
 * HomeScorePro Scoring Algorithms
 * A-Score (Suburb) and B-Score (Property) calculation engines
 */

class ScoringEngine {
    /**
     * Calculate A-Score for a suburb based on user preferences
     * @param {Object} suburb - Suburb data object
     * @param {Object} preferences - User preferences object
     * @returns {Object} - Score breakdown and total
     */
    static calculateAScore(suburb, preferences) {
        const weights = this.getWeightsFromPreferences(preferences);
        
        const scores = {
            schools: this.scoreSchools(suburb, weights.schools),
            transport: this.scoreTransport(suburb, weights.transport),
            lifestyle: this.scoreLifestyle(suburb, preferences, weights.lifestyle),
            investment: this.scoreInvestment(suburb, weights.investment),
            community: this.scoreCommunity(suburb, weights.community)
        };

        // Calculate weighted total (out of 100)
        const total = Object.entries(scores).reduce((sum, [key, score]) => {
            return sum + (score.score * weights[key] / 10);
        }, 0);

        return {
            total: Math.round(total * 10) / 10,
            breakdown: scores,
            grade: this.getGrade(total),
            weights: weights
        };
    }

    /**
     * Calculate B-Score for a specific property
     * @param {Object} property - Property data object
     * @param {Object} suburb - Suburb data object
     * @param {Object} preferences - User preferences object
     * @returns {Object} - Score breakdown and total
     */
    static calculateBScore(property, suburb, preferences) {
        const scores = {
            value: this.scorePropertyValue(property, suburb),
            features: this.scorePropertyFeatures(property, preferences),
            location: this.scorePropertyLocation(property, suburb),
            investment: this.scorePropertyInvestment(property, suburb),
            condition: this.scorePropertyCondition(property)
        };

        // Calculate total (out of 100)
        const weights = { value: 0.25, features: 0.25, location: 0.20, investment: 0.20, condition: 0.10 };
        const total = Object.entries(scores).reduce((sum, [key, score]) => {
            return sum + (score.score * weights[key]);
        }, 0);

        return {
            total: Math.round(total * 10) / 10,
            breakdown: scores,
            grade: this.getGrade(total),
            aScore: this.calculateAScore(suburb, preferences).total
        };
    }

    // ============ A-Score Component Calculations ============

    /**
     * Score schools and education
     */
    static scoreSchools(suburb, weight) {
        let score = 0;
        const reasons = [];

        // School rating (0-100)
        if (suburb.schoolRating) {
            score += suburb.schoolRating * 0.4;
            if (suburb.schoolRating >= 90) {
                reasons.push('Outstanding schools in area');
            } else if (suburb.schoolRating >= 75) {
                reasons.push('Good quality schools');
            }
        }

        // School count
        if (suburb.schoolCount) {
            const schoolScore = Math.min(suburb.schoolCount / 10 * 100, 100);
            score += schoolScore * 0.3;
            if (suburb.schoolCount >= 8) {
                reasons.push(`${suburb.schoolCount} schools nearby`);
            }
        }

        // SEIFA IEO (education & occupation)
        if (suburb.ieo_decile) {
            score += suburb.ieo_decile * 10 * 0.3;
            if (suburb.ieo_decile >= 9) {
                reasons.push('Highly educated community');
            }
        }

        return {
            score: Math.min(score, 100),
            weight: weight,
            reasons: reasons
        };
    }

    /**
     * Score transport and accessibility
     */
    static scoreTransport(suburb, weight) {
        let score = 0;
        const reasons = [];

        // Transit score (0-100)
        if (suburb.transitScore) {
            score += suburb.transitScore * 0.4;
            if (suburb.transitScore >= 80) {
                reasons.push('Excellent public transport');
            } else if (suburb.transitScore >= 60) {
                reasons.push('Good public transport access');
            }
        }

        // Walk score
        if (suburb.walkScore) {
            score += suburb.walkScore * 0.3;
            if (suburb.walkScore >= 80) {
                reasons.push('Highly walkable area');
            }
        }

        // CBD distance
        if (suburb.cbdDistance) {
            const distanceScore = Math.max(0, 100 - (suburb.cbdDistance * 5));
            score += distanceScore * 0.3;
            if (suburb.cbdDistance <= 10) {
                reasons.push(`Only ${suburb.cbdDistance}km from CBD`);
            }
        }

        return {
            score: Math.min(score, 100),
            weight: weight,
            reasons: reasons
        };
    }

    /**
     * Score lifestyle and amenities
     */
    static scoreLifestyle(suburb, preferences, weight) {
        let score = 0;
        const reasons = [];

        // Cafes and restaurants
        if (suburb.cafesRestaurants) {
            const cafeScore = Math.min(suburb.cafesRestaurants / 50 * 100, 100);
            score += cafeScore * 0.25;
            if (suburb.cafesRestaurants >= 30) {
                reasons.push('Vibrant cafe & dining scene');
            }
        }

        // Shopping centers
        if (suburb.shoppingCenters) {
            const shoppingScore = Math.min(suburb.shoppingCenters / 5 * 100, 100);
            score += shoppingScore * 0.15;
        }

        // Parks and outdoor spaces
        if (suburb.parksDensity) {
            const parkScore = Math.min(suburb.parksDensity / 5 * 100, 100);
            score += parkScore * 0.25;
            if (suburb.parksDensity >= 4 && preferences.lifestyle?.outdoors) {
                reasons.push('Abundant parks and green spaces');
            }
        }

        // Childcare (for families)
        if (suburb.childcareCenters) {
            const childcareScore = Math.min(suburb.childcareCenters / 15 * 100, 100);
            score += childcareScore * 0.15;
            if (suburb.childcareCenters >= 10 && preferences.lifestyle?.familyFriendly) {
                reasons.push(`${suburb.childcareCenters} childcare centers`);
            }
        }

        // SEIFA disadvantage (lower is more disadvantaged, so we normalize)
        if (suburb.irsd_decile) {
            score += suburb.irsd_decile * 10 * 0.2;
        }

        return {
            score: Math.min(score, 100),
            weight: weight,
            reasons: reasons
        };
    }

    /**
     * Score investment potential
     */
    static scoreInvestment(suburb, weight) {
        let score = 0;
        const reasons = [];

        // Growth rate (past year)
        if (suburb.growth1yr !== undefined) {
            if (suburb.growth1yr > 0) {
                score += Math.min(suburb.growth1yr * 10, 100) * 0.35;
                if (suburb.growth1yr >= 5) {
                    reasons.push(`Strong ${suburb.growth1yr}% annual growth`);
                } else if (suburb.growth1yr >= 3) {
                    reasons.push(`Solid ${suburb.growth1yr}% growth`);
                }
            } else {
                score += 50; // Neutral score for negative growth
                reasons.push('Price correction phase');
            }
        }

        // Rental yield
        if (suburb.rentalYield) {
            score += Math.min(suburb.rentalYield * 20, 100) * 0.25;
            if (suburb.rentalYield >= 4) {
                reasons.push(`Excellent ${suburb.rentalYield}% rental yield`);
            } else if (suburb.rentalYield >= 3) {
                reasons.push(`Good ${suburb.rentalYield}% rental yield`);
            }
        }

        // Median price (affordability component)
        if (suburb.medianPrice) {
            if (suburb.medianPrice < 800000) {
                score += 100 * 0.2; // Very affordable
                reasons.push('Strong affordability');
            } else if (suburb.medianPrice < 1200000) {
                score += 75 * 0.2; // Moderate
            } else if (suburb.medianPrice < 1800000) {
                score += 50 * 0.2; // Premium
            } else {
                score += 30 * 0.2; // Prestige
                reasons.push('Prestige market');
            }
        }

        // SEIFA relative prosperity
        if (suburb.ier_decile) {
            score += suburb.ier_decile * 10 * 0.2;
            if (suburb.ier_decile >= 9) {
                reasons.push('Affluent area with strong demand');
            }
        }

        return {
            score: Math.min(score, 100),
            weight: weight,
            reasons: reasons
        };
    }

    /**
     * Score community and safety
     */
    static scoreCommunity(suburb, weight) {
        let score = 0;
        const reasons = [];

        // SEIFA disadvantage (higher is better)
        if (suburb.irsd_decile) {
            score += suburb.irsd_decile * 10 * 0.4;
            if (suburb.irsd_decile >= 9) {
                reasons.push('Very low disadvantage');
            } else if (suburb.irsd_decile >= 7) {
                reasons.push('Low disadvantage');
            }
        }

        // Education level (IEO) as proxy for community engagement
        if (suburb.ieo_decile) {
            score += suburb.ieo_decile * 10 * 0.3;
        }

        // Community facilities (childcare + schools as proxy)
        const communityScore = ((suburb.childcareCenters || 0) + (suburb.schoolCount || 0) * 2) / 25 * 100;
        score += Math.min(communityScore, 100) * 0.3;

        if ((suburb.childcareCenters || 0) + (suburb.schoolCount || 0) >= 15) {
            reasons.push('Strong community infrastructure');
        }

        return {
            score: Math.min(score, 100),
            weight: weight,
            reasons: reasons
        };
    }

    // ============ B-Score Component Calculations ============

    /**
     * Score property value
     */
    static scorePropertyValue(property, suburb) {
        let score = 50; // Start neutral
        const reasons = [];

        // Compare to suburb median
        if (property.price && suburb.medianPrice) {
            const ratio = property.price / suburb.medianPrice;
            
            if (ratio < 0.85) {
                score = 90;
                reasons.push('Excellent value vs area median');
            } else if (ratio < 0.95) {
                score = 75;
                reasons.push('Good value vs area median');
            } else if (ratio < 1.05) {
                score = 60;
                reasons.push('Fair value vs area median');
            } else if (ratio < 1.15) {
                score = 45;
                reasons.push('Premium pricing');
            } else {
                score = 30;
                reasons.push('Above market pricing');
            }
        }

        // Price per sqm if available
        if (property.price && property.landSize) {
            const pricePerSqm = property.price / property.landSize;
            reasons.push(`$${Math.round(pricePerSqm)}/sqm`);
        }

        return { score, reasons };
    }

    /**
     * Score property features
     */
    static scorePropertyFeatures(property, preferences) {
        let score = 0;
        const reasons = [];

        // Bedrooms match
        if (property.bedrooms && preferences.bedrooms) {
            if (property.bedrooms >= preferences.bedrooms.min && 
                property.bedrooms <= preferences.bedrooms.max) {
                score += 35;
                reasons.push(`${property.bedrooms} bedrooms (matches preferences)`);
            } else {
                score += 15;
            }
        }

        // Bathrooms (assume 1 bath per 2 beds is good)
        if (property.bathrooms) {
            const idealBaths = Math.ceil(property.bedrooms / 2);
            if (property.bathrooms >= idealBaths) {
                score += 20;
                reasons.push(`${property.bathrooms} bathrooms`);
            } else {
                score += 10;
            }
        }

        // Parking
        if (property.parking) {
            score += Math.min(property.parking * 15, 30);
            if (property.parking >= 2) {
                reasons.push(`${property.parking} car spaces`);
            }
        }

        // Property type preference
        if (property.propertyType && preferences.propertyTypes) {
            if (preferences.propertyTypes.includes(property.propertyType.toLowerCase())) {
                score += 15;
            }
        }

        return { score: Math.min(score, 100), reasons };
    }

    /**
     * Score property location within suburb
     */
    static scorePropertyLocation(property, suburb) {
        let score = 70; // Default good score
        const reasons = [];

        // If we have street-level data
        if (property.streetType) {
            if (property.streetType === 'main road') {
                score = 55;
                reasons.push('Main road location');
            } else if (property.streetType === 'quiet street') {
                score = 85;
                reasons.push('Quiet street location');
            }
        }

        // Proximity to transport
        if (property.transitDistance) {
            if (property.transitDistance < 500) {
                score += 10;
                reasons.push('Very close to public transport');
            } else if (property.transitDistance < 1000) {
                score += 5;
            }
        }

        return { score: Math.min(score, 100), reasons };
    }

    /**
     * Score property investment potential
     */
    static scorePropertyInvestment(property, suburb) {
        let score = 0;
        const reasons = [];

        // Rental yield potential
        if (property.price && suburb.rentalYield) {
            const estimatedRent = (property.price * suburb.rentalYield / 100) / 52;
            score += Math.min(suburb.rentalYield * 15, 40);
            reasons.push(`Est. $${Math.round(estimatedRent)}/week rent`);
        }

        // Growth potential based on suburb
        if (suburb.growth1yr) {
            score += Math.min(suburb.growth1yr * 8, 40);
        }

        // Capital appreciation potential (newer = more upside)
        if (property.yearBuilt) {
            const age = new Date().getFullYear() - property.yearBuilt;
            if (age < 5) {
                score += 20;
                reasons.push('New property');
            } else if (age < 15) {
                score += 15;
                reasons.push('Modern property');
            } else if (age < 30) {
                score += 10;
            } else {
                score += 5;
            }
        }

        return { score: Math.min(score, 100), reasons };
    }

    /**
     * Score property condition
     */
    static scorePropertyCondition(property) {
        let score = 70; // Default good condition
        const reasons = [];

        if (property.yearBuilt) {
            const age = new Date().getFullYear() - property.yearBuilt;
            
            if (age < 5) {
                score = 95;
                reasons.push('Brand new condition');
            } else if (age < 10) {
                score = 85;
                reasons.push('Excellent condition');
            } else if (age < 20) {
                score = 75;
                reasons.push('Good condition');
            } else if (age < 40) {
                score = 60;
                reasons.push('Established property');
            } else {
                score = 50;
                reasons.push('Period property');
            }
        }

        // Renovations boost score
        if (property.renovationYear) {
            const renovationAge = new Date().getFullYear() - property.renovationYear;
            if (renovationAge < 5) {
                score += 15;
                reasons.push('Recently renovated');
            } else if (renovationAge < 10) {
                score += 10;
            }
        }

        return { score: Math.min(score, 100), reasons };
    }

    // ============ Helper Methods ============

    /**
     * Extract weights from user preferences
     */
    static getWeightsFromPreferences(preferences) {
        if (preferences.priorities) {
            return {
                schools: preferences.priorities.schools || 5,
                transport: preferences.priorities.transport || 5,
                lifestyle: preferences.priorities.lifestyle || 5,
                investment: preferences.priorities.investment || 5,
                community: preferences.priorities.community || 5
            };
        }
        
        // Default balanced weights
        return {
            schools: 6,
            transport: 7,
            lifestyle: 6,
            investment: 5,
            community: 7
        };
    }

    /**
     * Convert numeric score to letter grade
     */
    static getGrade(score) {
        if (score >= 90) return 'A+';
        if (score >= 85) return 'A';
        if (score >= 80) return 'A-';
        if (score >= 75) return 'B+';
        if (score >= 70) return 'B';
        if (score >= 65) return 'B-';
        if (score >= 60) return 'C+';
        if (score >= 55) return 'C';
        if (score >= 50) return 'C-';
        if (score >= 45) return 'D+';
        if (score >= 40) return 'D';
        return 'F';
    }

    /**
     * Get color for score visualization
     */
    static getScoreColor(score) {
        if (score >= 80) return '#10b981'; // green
        if (score >= 65) return '#3b82f6'; // blue
        if (score >= 50) return '#f59e0b'; // orange
        return '#ef4444'; // red
    }

    /**
     * Generate comparison between two suburbs
     */
    static compareSuburbs(suburb1, suburb2, preferences) {
        const score1 = this.calculateAScore(suburb1, preferences);
        const score2 = this.calculateAScore(suburb2, preferences);

        return {
            suburb1: { ...suburb1, score: score1 },
            suburb2: { ...suburb2, score: score2 },
            winner: score1.total > score2.total ? suburb1.name : suburb2.name,
            difference: Math.abs(score1.total - score2.total)
        };
    }
}

// Export for use in other modules
window.ScoringEngine = ScoringEngine;
