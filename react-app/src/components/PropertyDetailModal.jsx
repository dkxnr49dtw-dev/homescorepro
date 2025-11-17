import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateBScoreForProperty } from '../utils/members';

export function PropertyDetailModal({ property, suburb, userPreferences, isOpen, onClose }) {
  const [bscoreResult, setBscoreResult] = useState(null);
  
  useEffect(() => {
    if (property && suburb && isOpen) {
      // Calculate bScore if not already calculated
      if (!property.bScore || property.bScore === 0) {
        const result = calculateBScoreForProperty(property, suburb, userPreferences);
        setBscoreResult(result);
      } else {
        // Use existing bScore but still calculate breakdown
        const result = calculateBScoreForProperty(property, suburb, userPreferences);
        setBscoreResult(result);
      }
    }
  }, [property, suburb, userPreferences, isOpen]);
  
  if (!property || !isOpen) return null;
  
  const tierLabels = {
    tier1: { name: 'Investment Value', emoji: '💰', desc: 'Affordability and property type' },
    tier2: { name: 'Location Quality', emoji: '📍', desc: 'Suburb location and desirability' },
    tier3: { name: 'Accessibility', emoji: '🚇', desc: 'Transport and connectivity' },
    tier4: { name: 'Property Features', emoji: '🏠', desc: 'Land size, bedrooms, bathrooms, street quality' },
    tier5: { name: 'Lifestyle', emoji: '🎨', desc: 'Lifestyle match and amenities' }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: 'var(--space-4)',
            overflow: 'auto'
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            style={{
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-xl)',
              width: '90%',
              maxWidth: '1200px',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{
              padding: 'var(--space-6)',
              borderBottom: '1px solid var(--glass-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'start',
              background: 'var(--bg-secondary)'
            }}>
              <div style={{ flex: 1 }}>
                <h2 style={{ 
                  margin: 0, 
                  marginBottom: 'var(--space-2)', 
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)'
                }}>
                  {property.address || 'Property Details'}
                </h2>
                <p style={{ 
                  margin: 0, 
                  color: 'var(--text-secondary)', 
                  fontSize: '0.9375rem' 
                }}>
                  {property.suburb} {property.postcode} • ${(property.price || 0).toLocaleString()}
                </p>
              </div>
              <button
                onClick={onClose}
                className="btn btn-secondary"
                style={{
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--glass-border)',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: 'var(--text-primary)',
                  padding: 'var(--space-2) var(--space-3)',
                  lineHeight: 1,
                  borderRadius: 'var(--radius-md)',
                  minWidth: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </button>
            </div>
            
            {/* Content */}
            <div style={{
              flex: 1,
              overflow: 'auto',
              padding: 'var(--space-6)'
            }}>
              {bscoreResult && (
                <div>
                  {/* Overall Score */}
                  <div className="score-display" style={{
                    background: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--space-6)',
                    marginBottom: 'var(--space-6)',
                    textAlign: 'center',
                    border: '1px solid var(--glass-border)'
                  }}>
                    <div className="score-value" style={{ 
                      fontSize: '3rem', 
                      fontWeight: 700, 
                      color: 'var(--orange-primary)', 
                      marginBottom: 'var(--space-2)',
                      lineHeight: 1
                    }}>
                      {bscoreResult.score.toFixed(1)}
                    </div>
                    <div className="score-label" style={{ 
                      fontSize: '1.125rem', 
                      color: 'var(--text-secondary)', 
                      marginBottom: 'var(--space-4)',
                      fontWeight: 500
                    }}>
                      Overall B-Score
                    </div>
                    <div style={{ 
                      fontSize: '0.875rem', 
                      color: 'var(--text-tertiary)',
                      textTransform: 'capitalize'
                    }}>
                      Strategy: {bscoreResult.strategy || 'Balanced'}
                    </div>
                  </div>
                  
                  {/* Tier Scores */}
                  <div style={{ marginBottom: 'var(--space-6)' }}>
                    <h3 style={{ 
                      marginBottom: 'var(--space-4)', 
                      fontSize: '1.25rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)'
                    }}>
                      Tier Scores
                    </h3>
                    <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                      {['tier1', 'tier2', 'tier3', 'tier4', 'tier5'].map((tier) => {
                        const tierData = tierLabels[tier];
                        const tierScore = bscoreResult[tier] || 0;
                        const weight = bscoreResult.weights?.[tier] || 0;
                        
                        return (
                          <div
                            key={tier}
                            className="results-panel"
                            style={{
                              padding: 'var(--space-4)',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = 'var(--orange-primary)'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = 'var(--glass-border)'
                            }}
                          >
                            <div style={{ flex: 1 }}>
                              <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 'var(--space-2)', 
                                marginBottom: 'var(--space-1)' 
                              }}>
                                <span style={{ fontSize: '1.25rem' }}>{tierData.emoji}</span>
                                <strong style={{ 
                                  fontSize: '1rem',
                                  color: 'var(--text-primary)',
                                  fontWeight: 600
                                }}>
                                  {tierData.name}
                                </strong>
                              </div>
                              <div style={{ 
                                fontSize: '0.875rem', 
                                color: 'var(--text-secondary)', 
                                marginLeft: '1.8rem' 
                              }}>
                                {tierData.desc}
                              </div>
                            </div>
                            <div style={{ textAlign: 'right', marginLeft: 'var(--space-4)' }}>
                              <div style={{ 
                                fontSize: '1.5rem', 
                                fontWeight: 700, 
                                color: 'var(--orange-primary)',
                                lineHeight: 1
                              }}>
                                {tierScore.toFixed(1)}
                              </div>
                              <div style={{ 
                                fontSize: '0.75rem', 
                                color: 'var(--text-tertiary)',
                                marginTop: 'var(--space-1)'
                              }}>
                                Weight: {(weight * 100).toFixed(0)}%
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Detailed Breakdown */}
                  {bscoreResult.breakdown && (
                    <div style={{ marginBottom: 'var(--space-6)' }}>
                      <h3 style={{ 
                        marginBottom: 'var(--space-4)', 
                        fontSize: '1.25rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)'
                      }}>
                        Detailed Metrics
                      </h3>
                      <div className="results-panel" style={{
                        padding: 'var(--space-4)'
                      }}>
                        <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
                          {Object.entries(bscoreResult.breakdown).map(([key, value]) => (
                            <div
                              key={key}
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: 'var(--space-3)',
                                borderBottom: '1px solid var(--glass-border)',
                                alignItems: 'center'
                              }}
                            >
                              <span style={{ 
                                textTransform: 'capitalize', 
                                color: 'var(--text-secondary)',
                                fontSize: '0.9375rem'
                              }}>
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </span>
                              <span style={{ 
                                fontWeight: 600,
                                color: 'var(--text-primary)',
                                fontSize: '0.9375rem'
                              }}>
                                {value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Property Details */}
                  <div style={{ marginTop: 'var(--space-6)' }}>
                    <h3 style={{ 
                      marginBottom: 'var(--space-4)', 
                      fontSize: '1.25rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)'
                    }}>
                      Property Information
                    </h3>
                    <div className="results-panel" style={{
                      padding: 'var(--space-4)',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: 'var(--space-4)'
                    }}>
                      <div>
                        <div style={{ 
                          fontSize: '0.875rem', 
                          color: 'var(--text-secondary)', 
                          marginBottom: 'var(--space-2)',
                          fontWeight: 500
                        }}>
                          Type
                        </div>
                        <div style={{ 
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                          textTransform: 'capitalize'
                        }}>
                          {property.propertyType || 'N/A'}
                        </div>
                      </div>
                      <div>
                        <div style={{ 
                          fontSize: '0.875rem', 
                          color: 'var(--text-secondary)', 
                          marginBottom: 'var(--space-2)',
                          fontWeight: 500
                        }}>
                          Bedrooms
                        </div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          {property.bedrooms || 'N/A'}
                        </div>
                      </div>
                      <div>
                        <div style={{ 
                          fontSize: '0.875rem', 
                          color: 'var(--text-secondary)', 
                          marginBottom: 'var(--space-2)',
                          fontWeight: 500
                        }}>
                          Bathrooms
                        </div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          {property.bathrooms || 'N/A'}
                        </div>
                      </div>
                      <div>
                        <div style={{ 
                          fontSize: '0.875rem', 
                          color: 'var(--text-secondary)', 
                          marginBottom: 'var(--space-2)',
                          fontWeight: 500
                        }}>
                          Land Size
                        </div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          {property.landSize ? `${property.landSize} m²` : 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

