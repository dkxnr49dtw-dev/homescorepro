/**
 * HomeScorePro Advanced Scoring Engine
 * Sophisticated property evaluation with ML-inspired weighting
 */

class ScoringEngine {
    constructor() {
        // Dynamic weight system based on user preferences
        this.weights = {
            location: 0.25,
            transportation: 0.20,
            amenities: 0.15,
            safety: 0.15,
            affordability: 0.10,
            growth: 0.10,
            lifestyle: 0.05
        };
        
        // Cached calculations for performance
        this.cache = new Map();
    }

    /**
     * Calculate comprehensive property score with detailed breakdown
     */
    calculateScore(property, preferences = {}) {
        const cacheKey = `${property.id}_${JSON.stringify(preferences)}`;
        
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        const scores = {
            location: this.calculateLocationScore(property),
            transportation: this.calculateTransportScore(property),
            amenities: this.calculateAmenitiesScore(property),
            safety: this.calculateSafetyScore(property),
            affordability: this.calculateAffordabilityScore(property),
            growth: this.calculateGrowthScore(property),
            lifestyle: this.calculateLifestyleScore(property, preferences)
        };

        // Adjust weights based on user preferences
        const adjustedWeights = this.adjustWeights(preferences);
        
        // Calculate weighted total
        let totalScore = 0;
        const breakdown = {};
        
        for (const [category, score] of Object.entries(scores)) {
            const weighted = score * adjustedWeights[category];
            breakdown[category] = {
                raw: score,
                weight: adjustedWeights[category],
                weighted: weighted,
                percentage: (weighted / adjustedWeights[category]) * 100
            };
            totalScore += weighted;
        }

        const result = {
            total: Math.round(totalScore * 10) / 10,
            breakdown,
            confidence: this.calculateConfidence(property),
            insights: this.generateInsights(scores, preferences),
            recommendations: this.generateRecommendations(scores)
        };

        this.cache.set(cacheKey, result);
        return result;
    }

    /**
     * Location score based on multiple factors
     */
    calculateLocationScore(property) {
        const factors = {
            cbdDistance: this.normalizeCBDDistance(property.cbdDistance),
            beachDistance: this.normalizeBeachDistance(property.beachDistance),
            elevation: this.normalizeElevation(property.elevation),
            quietStreet: property.quietStreet ? 10 : 7,
            treeLinedStreet: property.treeLinedStreet ? 9 : 7,
            waterViews: property.waterViews ? 10 : 0
        };

        return this.weightedAverage(factors, {
            cbdDistance: 0.3,
            beachDistance: 0.2,
            elevation: 0.1,
            quietStreet: 0.2,
            treeLinedStreet: 0.1,
            waterViews: 0.1
        });
    }

    /**
     * Transportation accessibility score
     */
    calculateTransportScore(property) {
        const factors = {
            trainStation: this.normalizeDistance(property.nearestTrain, 2000),
            busStop: this.normalizeDistance(property.nearestBus, 500),
            tramStop: this.normalizeDistance(property.nearestTram, 1000),
            bikeTrails: property.bikeTrailAccess ? 9 : 5,
            walkability: property.walkScore || 5,
            parking: property.parkingSpaces ? Math.min(10, property.parkingSpaces * 3) : 3
        };

        return this.weightedAverage(factors, {
            trainStation: 0.35,
            busStop: 0.15,
            tramStop: 0.15,
            bikeTrails: 0.1,
            walkability: 0.15,
            parking: 0.1
        });
    }

    /**
     * Amenities and services score
     */
    calculateAmenitiesScore(property) {
        const amenityScores = {
            schools: this.calculateSchoolScore(property),
            shopping: this.calculateShoppingScore(property),
            healthcare: this.calculateHealthcareScore(property),
            recreation: this.calculateRecreationScore(property),
            dining: this.calculateDiningScore(property)
        };

        return this.weightedAverage(amenityScores, {
            schools: 0.3,
            shopping: 0.2,
            healthcare: 0.2,
            recreation: 0.15,
            dining: 0.15
        });
    }

    /**
     * Safety and security score
     */
    calculateSafetyScore(property) {
        const baseScore = 10 - (property.crimeRate || 5);
        const adjustments = {
            streetLighting: property.wellLit ? 1 : -0.5,
            neighborhoodWatch: property.neighborhoodWatch ? 0.5 : 0,
            securityFeatures: property.securityScore ? property.securityScore / 10 : 0
        };

        return Math.min(10, Math.max(0, 
            baseScore + adjustments.streetLighting + 
            adjustments.neighborhoodWatch + adjustments.securityFeatures
        ));
    }

    /**
     * Affordability relative to market
     */
    calculateAffordabilityScore(property) {
        const medianPrice = property.suburbMedian || 1000000;
        const priceRatio = property.price / medianPrice;
        
        if (priceRatio < 0.8) return 10;
        if (priceRatio < 0.9) return 9;
        if (priceRatio < 1.0) return 8;
        if (priceRatio < 1.1) return 6;
        if (priceRatio < 1.2) return 4;
        return 2;
    }

    /**
     * Growth potential score
     */
    calculateGrowthScore(property) {
        const factors = {
            historicalGrowth: property.growth5Year ? Math.min(10, property.growth5Year) : 5,
            plannedInfrastructure: property.upcomingProjects ? 8 : 5,
            gentrification: property.gentrificationIndex || 5,
            demandSupply: 10 - (property.daysOnMarket / 10) || 5
        };

        return this.weightedAverage(factors, {
            historicalGrowth: 0.4,
            plannedInfrastructure: 0.3,
            gentrification: 0.2,
            demandSupply: 0.1
        });
    }

    /**
     * Lifestyle compatibility score
     */
    calculateLifestyleScore(property, preferences) {
        const scores = {
            familyFriendly: property.familyScore || 5,
            petFriendly: property.petFriendly ? 9 : 5,
            nightlife: property.nightlifeScore || 5,
            quietEnvironment: property.noiseLevel ? 10 - property.noiseLevel : 5,
            greenSpaces: property.parksNearby || 5
        };

        // Adjust based on user preferences
        if (preferences.hasChildren) {
            return scores.familyFriendly * 0.7 + scores.greenSpaces * 0.3;
        }
        if (preferences.youngProfessional) {
            return scores.nightlife * 0.4 + scores.quietEnvironment * 0.3 + scores.greenSpaces * 0.3;
        }
        
        return this.average(Object.values(scores));
    }

    /**
     * Adjust weights based on user preferences
     */
    adjustWeights(preferences) {
        const adjusted = { ...this.weights };
        
        if (preferences.prioritizeTransport) {
            adjusted.transportation *= 1.5;
            adjusted.location *= 0.8;
        }
        if (preferences.prioritizeSafety) {
            adjusted.safety *= 1.5;
            adjusted.lifestyle *= 0.7;
        }
        if (preferences.investmentFocus) {
            adjusted.growth *= 1.8;
            adjusted.affordability *= 1.3;
            adjusted.lifestyle *= 0.5;
        }
        
        // Normalize weights to sum to 1
        const total = Object.values(adjusted).reduce((a, b) => a + b, 0);
        for (const key in adjusted) {
            adjusted[key] /= total;
        }
        
        return adjusted;
    }

    /**
     * Calculate confidence in the score
     */
    calculateConfidence(property) {
        const dataCompleteness = this.calculateDataCompleteness(property);
        const dataFreshness = this.calculateDataFreshness(property);
        const sourceReliability = property.verifiedData ? 0.9 : 0.7;
        
        return Math.round((dataCompleteness * 0.4 + dataFreshness * 0.3 + sourceReliability * 0.3) * 100);
    }

    /**
     * Generate actionable insights
     */
    generateInsights(scores, preferences) {
        const insights = [];
        const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);
        
        // Highlight strengths
        const topStrengths = sortedScores.filter(([_, score]) => score >= 8).slice(0, 3);
        topStrengths.forEach(([category, score]) => {
            insights.push({
                type: 'strength',
                category,
                message: this.getStrengthMessage(category, score),
                impact: 'positive'
            });
        });
        
        // Identify opportunities
        const opportunities = sortedScores.filter(([_, score]) => score < 6);
        opportunities.forEach(([category, score]) => {
            insights.push({
                type: 'opportunity',
                category,
                message: this.getOpportunityMessage(category, score),
                impact: 'consideration'
            });
        });
        
        return insights;
    }

    /**
     * Generate personalized recommendations
     */
    generateRecommendations(scores) {
        const recommendations = [];
        
        for (const [category, score] of Object.entries(scores)) {
            if (score < 7) {
                recommendations.push({
                    category,
                    priority: score < 5 ? 'high' : 'medium',
                    suggestions: this.getCategoryRecommendations(category, score)
                });
            }
        }
        
        return recommendations.sort((a, b) => 
            a.priority === 'high' && b.priority !== 'high' ? -1 : 1
        );
    }

    // Helper methods
    normalizeDistance(distance, ideal) {
        if (!distance) return 5;
        if (distance <= ideal) return 10;
        if (distance <= ideal * 2) return 8;
        if (distance <= ideal * 3) return 6;
        if (distance <= ideal * 5) return 4;
        return 2;
    }

    normalizeCBDDistance(km) {
        if (!km) return 5;
        if (km <= 5) return 10;
        if (km <= 10) return 8;
        if (km <= 15) return 6;
        if (km <= 25) return 4;
        return 2;
    }

    normalizeBeachDistance(km) {
        if (!km) return 5;
        if (km <= 2) return 10;
        if (km <= 5) return 8;
        if (km <= 10) return 6;
        return 3;
    }

    normalizeElevation(meters) {
        if (!meters) return 5;
        if (meters > 50) return 9;
        if (meters > 20) return 7;
        if (meters > 10) return 5;
        return 3;
    }

    weightedAverage(values, weights) {
        let sum = 0;
        let weightSum = 0;
        
        for (const [key, value] of Object.entries(values)) {
            if (weights[key]) {
                sum += value * weights[key];
                weightSum += weights[key];
            }
        }
        
        return weightSum > 0 ? sum / weightSum : 0;
    }

    average(values) {
        return values.reduce((a, b) => a + b, 0) / values.length;
    }

    calculateDataCompleteness(property) {
        const requiredFields = [
            'price', 'cbdDistance', 'nearestTrain', 'crimeRate',
            'schools', 'shopping', 'suburbMedian'
        ];
        
        const present = requiredFields.filter(field => property[field] !== undefined).length;
        return present / requiredFields.length;
    }

    calculateDataFreshness(property) {
        if (!property.lastUpdated) return 0.5;
        const daysSinceUpdate = (Date.now() - new Date(property.lastUpdated)) / (1000 * 60 * 60 * 24);
        if (daysSinceUpdate < 7) return 1;
        if (daysSinceUpdate < 30) return 0.8;
        if (daysSinceUpdate < 90) return 0.6;
        return 0.4;
    }

    calculateSchoolScore(property) {
        if (!property.schools) return 5;
        const factors = {
            primaryDistance: this.normalizeDistance(property.schools.primary?.distance, 1000),
            primaryRating: property.schools.primary?.rating || 5,
            secondaryDistance: this.normalizeDistance(property.schools.secondary?.distance, 2000),
            secondaryRating: property.schools.secondary?.rating || 5
        };
        return this.average(Object.values(factors));
    }

    calculateShoppingScore(property) {
        if (!property.shopping) return 5;
        const factors = {
            supermarket: this.normalizeDistance(property.shopping.supermarket, 1000),
            shoppingCentre: this.normalizeDistance(property.shopping.centre, 3000),
            localStores: property.shopping.localStores ? 8 : 5
        };
        return this.average(Object.values(factors));
    }

    calculateHealthcareScore(property) {
        if (!property.healthcare) return 5;
        const factors = {
            gp: this.normalizeDistance(property.healthcare.gp, 2000),
            hospital: this.normalizeDistance(property.healthcare.hospital, 5000),
            pharmacy: this.normalizeDistance(property.healthcare.pharmacy, 1000)
        };
        return this.average(Object.values(factors));
    }

    calculateRecreationScore(property) {
        const factors = {
            parks: property.parksNearby || 5,
            gym: this.normalizeDistance(property.nearestGym, 2000),
            sportsFields: property.sportsFields ? 8 : 5,
            beach: this.normalizeBeachDistance(property.beachDistance)
        };
        return this.average(Object.values(factors));
    }

    calculateDiningScore(property) {
        const factors = {
            cafes: property.cafesNearby || 5,
            restaurants: property.restaurantsNearby || 5,
            variety: property.cuisineVariety || 5
        };
        return this.average(Object.values(factors));
    }

    getStrengthMessage(category, score) {
        const messages = {
            location: `Excellent location score of ${score.toFixed(1)} - prime positioning`,
            transportation: `Outstanding transport links with score of ${score.toFixed(1)}`,
            amenities: `Comprehensive amenities nearby scoring ${score.toFixed(1)}`,
            safety: `Very safe area with security score of ${score.toFixed(1)}`,
            affordability: `Great value compared to area median`,
            growth: `Strong growth potential of ${score.toFixed(1)} - excellent investment`,
            lifestyle: `Perfect lifestyle match scoring ${score.toFixed(1)}`
        };
        return messages[category] || `Strong ${category} score`;
    }

    getOpportunityMessage(category, score) {
        const messages = {
            location: `Location score of ${score.toFixed(1)} - consider proximity factors`,
            transportation: `Transport score of ${score.toFixed(1)} - may require vehicle`,
            amenities: `Limited nearby amenities (${score.toFixed(1)}) - check essentials`,
            safety: `Safety score of ${score.toFixed(1)} - research area statistics`,
            affordability: `Above median pricing - negotiate opportunity`,
            growth: `Modest growth potential of ${score.toFixed(1)}`,
            lifestyle: `Lifestyle score of ${score.toFixed(1)} - verify preferences`
        };
        return messages[category] || `${category} could be improved`;
    }

    getCategoryRecommendations(category, score) {
        const recommendations = {
            location: [
                'Research upcoming infrastructure projects',
                'Check flood zones and environmental factors',
                'Visit at different times of day'
            ],
            transportation: [
                'Test commute during peak hours',
                'Check parking availability and costs',
                'Explore alternative transport options'
            ],
            amenities: [
                'Map essential services within 15 minutes',
                'Verify school catchment zones',
                'Check future development plans'
            ],
            safety: [
                'Review crime statistics for past 3 years',
                'Talk to local residents',
                'Check street lighting at night'
            ],
            affordability: [
                'Compare with 5 similar properties',
                'Factor in all ongoing costs',
                'Get independent valuation'
            ],
            growth: [
                'Research demographic trends',
                'Check council development applications',
                'Review historical price data'
            ],
            lifestyle: [
                'Spend time in the neighborhood',
                'Check noise levels at different times',
                'Verify lifestyle amenities match needs'
            ]
        };
        return recommendations[category] || ['Further investigation recommended'];
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScoringEngine;
}