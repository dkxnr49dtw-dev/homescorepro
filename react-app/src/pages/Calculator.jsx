import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { calculateAScore, calculateBScore, propertyProfiles, getScoreRating, animateCountUp } from '../utils/calculator'

function Calculator() {
  const [suburb, setSuburb] = useState('Hawthorn')
  const [propertyProfile, setPropertyProfile] = useState('')
  const [ascoreResult, setAscoreResult] = useState(null)
  const [bscoreResult, setBscoreResult] = useState(null)
  const [showAscoreDisplay, setShowAscoreDisplay] = useState(false)
  const [showBscoreDisplay, setShowBscoreDisplay] = useState(false)
  const [showAscoreBreakdown, setShowAscoreBreakdown] = useState(false)
  const [showBscoreBreakdown, setShowBscoreBreakdown] = useState(false)
  const [showAscoreInsights, setShowAscoreInsights] = useState(false)
  const [showBscoreInsights, setShowBscoreInsights] = useState(false)
  const [smartSearch, setSmartSearch] = useState('')
  
  const ascoreValueRef = useRef(null)
  const bscoreValueRef = useRef(null)

  // Handle A-Score calculation
  const handleCalculateAScore = () => {
    if (!suburb) return
    
    const result = calculateAScore(suburb)
    if (result) {
      setAscoreResult(result)
      setShowAscoreDisplay(true)
      setShowAscoreBreakdown(false)
      setShowAscoreInsights(false)
      
      // Animate score count-up
      if (ascoreValueRef.current) {
        animateCountUp(ascoreValueRef.current, result.score, 1500)
      }
      
      // Show breakdown and insights after animation
      setTimeout(() => {
        setShowAscoreBreakdown(true)
        setTimeout(() => setShowAscoreInsights(true), 200)
      }, 1500)
    }
  }

  // Handle B-Score calculation
  const handleCalculateBScore = () => {
    if (!propertyProfile) {
      alert('Please select a property profile first.')
      return
    }
    
    const profile = propertyProfiles[propertyProfile]
    if (!profile) return
    
    const result = calculateBScore(
      propertyProfile,
      profile.price,
      profile.cbdDistance,
      profile.trainDistance,
      profile.safetyRating,
      profile.lifestyleType
    )
    
    if (result) {
      setBscoreResult(result)
      setShowBscoreDisplay(true)
      setShowBscoreBreakdown(false)
      setShowBscoreInsights(false)
      
      // Animate score count-up
      if (bscoreValueRef.current) {
        animateCountUp(bscoreValueRef.current, result.score, 1500)
      }
      
      // Show breakdown and insights after animation
      setTimeout(() => {
        setShowBscoreBreakdown(true)
        setTimeout(() => setShowBscoreInsights(true), 200)
      }, 1500)
    }
  }

  // Handle property profile change
  const handleProfileChange = (e) => {
    setPropertyProfile(e.target.value)
  }

  // Handle suburb change
  const handleSuburbChange = (e) => {
    setSuburb(e.target.value)
    setShowAscoreDisplay(false)
    setShowAscoreBreakdown(false)
    setShowAscoreInsights(false)
  }

  // Try example handlers
  const tryHawthornExample = () => {
    setSuburb('Hawthorn')
    setTimeout(() => handleCalculateAScore(), 100)
  }

  const tryFamilyHomeExample = () => {
    setPropertyProfile('family')
    setTimeout(() => handleCalculateBScore(), 100)
  }

  // Get letter grade and percentile
  const getLetterGrade = (score) => {
    if (score >= 95) return 'A+'
    if (score >= 90) return 'A'
    if (score >= 85) return 'A-'
    if (score >= 80) return 'B+'
    if (score >= 75) return 'B'
    if (score >= 70) return 'B-'
    if (score >= 65) return 'C+'
    if (score >= 60) return 'C'
    return 'C-'
  }

  const getPercentile = (score) => {
    if (score >= 95) return 5
    if (score >= 90) return 10
    if (score >= 85) return 15
    if (score >= 80) return 25
    if (score >= 75) return 35
    return 50
  }

  const getRatingText = (score, type) => {
    if (type === 'ascore') {
      if (score >= 90) return { icon: '🌟', text: 'Exceptional Suburb' }
      if (score >= 80) return { icon: '✅', text: 'Excellent Suburb' }
      if (score >= 70) return { icon: '👍', text: 'Good Suburb' }
      return { icon: '⚠️', text: 'Fair Suburb' }
    } else {
      if (score >= 90) return { icon: '🚀', text: 'Outstanding Property' }
      if (score >= 80) return { icon: '⭐', text: 'Excellent Property' }
      if (score >= 70) return { icon: '✅', text: 'Strong Property' }
      return { icon: '👍', text: 'Good Property' }
    }
  }

  // Generate insights
  const generateInsights = (totalScore, scores) => {
    const insights = []
    const topCategory = Object.entries(scores).sort((a, b) => b[1] - a[1])[0]
    
    insights.push({
      icon: '✨',
      title: 'Top Strength',
      message: `Outstanding ${topCategory[0]} score of ${topCategory[1].toFixed(1)}. This is a major advantage.`
    })
    
    if (totalScore >= 85) {
      insights.push({
        icon: '🚀',
        title: 'Premium Investment',
        message: 'This property scores in the top tier. Exceptional fundamentals across multiple categories.'
      })
    } else if (totalScore >= 75) {
      insights.push({
        icon: '⭐',
        title: 'Strong Performer',
        message: 'Solid performance across key metrics with strong long-term potential.'
      })
    }
    
    const weakCategory = Object.entries(scores).sort((a, b) => a[1] - b[1])[0]
    if (weakCategory[1] < 7) {
      insights.push({
        icon: '🔍',
        title: 'Area for Consideration',
        message: `${weakCategory[0].charAt(0).toUpperCase() + weakCategory[0].slice(1)} scores ${weakCategory[1].toFixed(1)}. Review if this aligns with your priorities.`
      })
    }
    
    insights.push({
      icon: '💡',
      title: 'Investment Tip',
      message: 'Consider this score alongside market trends and your personal circumstances. Schedule an inspection to validate.'
    })
    
    return insights
  }

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
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Hero Section */}
      <section id="hero" className="hero">
        <div className="hero-container">
          <div className="hero-badge">✨ Data-Driven Property Intelligence</div>
          <h1>
            Find Your Perfect <span className="hero-gradient">Melbourne Home</span> with Confidence
          </h1>
          <p className="hero-subtitle">
            Sophisticated property analysis powered by 38+ data points. Make smarter decisions with transparent, data-driven suburb and property scores.
          </p>
          <div className="hero-cta">
            <a href="#calculator" className="btn btn-primary btn-lg">
              Start Scoring <span>→</span>
            </a>
            <button 
              className="btn btn-secondary btn-lg" 
              onClick={() => document.getElementById('samples')?.scrollIntoView({ behavior: 'smooth' })}
            >
              See Sample Properties
            </button>
          </div>
        </div>
      </section>

      {/* Smart Search Section */}
      <section className="search-section">
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search suburb, address, or postcode..."
            value={smartSearch}
            onChange={(e) => setSmartSearch(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && smartSearch) {
                // Auto-detect and search
                if (/^\d{4}$/.test(smartSearch)) {
                  alert(`Searching for properties in postcode ${smartSearch}...`)
                } else {
                  setSuburb(smartSearch)
                  setTimeout(() => handleCalculateAScore(), 100)
                }
              }
            }}
          />
          <button 
            className="search-btn" 
            onClick={() => {
              if (smartSearch) {
                setSuburb(smartSearch)
                setTimeout(() => handleCalculateAScore(), 100)
              }
            }}
          >
            🔍 Search
          </button>
        </div>
        <div className="search-hint">
          Try: "Hawthorn", "3122", or "123 Glenferrie Road"
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item" data-animate="true" data-target="397" data-delay="100">
            <div className="stat-value" data-count-up="true">397</div>
            <div className="stat-label">Melbourne Suburbs</div>
          </div>
          <div className="stat-item" data-animate="true" data-target="38" data-delay="200">
            <div className="stat-value" data-count-up="true">38+</div>
            <div className="stat-label">Data Points</div>
          </div>
          <div className="stat-item" data-animate="true" data-target="2" data-delay="300">
            <div className="stat-value" data-count-up="true">2</div>
            <div className="stat-label">Score Types</div>
          </div>
          <div className="stat-item" data-animate="true" data-target="100" data-delay="400">
            <div className="stat-value" data-count-up="true">100%</div>
            <div className="stat-label">Transparent</div>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section id="calculator" className="calculator-section">
        <div className="section-header">
          <div className="section-pretitle">Property Intelligence</div>
          <h2 className="section-title">Score Your Property</h2>
          <p className="section-subtitle">
            Analyze suburbs and properties with our comprehensive scoring system
          </p>
          
          {/* Dual-Score Explanation */}
          <div className="score-explanation-box" style={{
            background: 'var(--orange-subtle)',
            border: '2px solid var(--orange-glow)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-6)',
            marginTop: 'var(--space-8)',
            maxWidth: '800px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'var(--orange-light)',
              marginBottom: 'var(--space-4)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)'
            }}>
              <span>💡</span> Understanding Our Dual-Score System
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'var(--space-6)',
              marginTop: 'var(--space-4)'
            }}>
              <div className="score-type-card" style={{
                background: 'var(--bg-secondary)',
                padding: 'var(--space-5)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--glass-border)'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>📍</div>
                <h4 style={{
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: 'var(--space-2)',
                  fontSize: '1.125rem'
                }}>A-Score: Suburb Quality</h4>
                <p style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.9375rem',
                  lineHeight: 1.6,
                  marginBottom: 'var(--space-3)'
                }}>
                  Evaluates the suburb itself across 15 key metrics including location quality, amenities, safety, schools, and growth potential.
                </p>
                <div style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-tertiary)',
                  fontStyle: 'italic'
                }}>
                  "How good is this suburb?"
                </div>
              </div>
              <div className="score-type-card" style={{
                background: 'var(--bg-secondary)',
                padding: 'var(--space-5)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--glass-border)'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>🏠</div>
                <h4 style={{
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: 'var(--space-2)',
                  fontSize: '1.125rem'
                }}>B-Score: Property Match</h4>
                <p style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.9375rem',
                  lineHeight: 1.6,
                  marginBottom: 'var(--space-3)'
                }}>
                  Combines A-Score with property-specific factors across 38+ data points for comprehensive analysis including investment potential and lifestyle fit.
                </p>
                <div style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-tertiary)',
                  fontStyle: 'italic'
                }}>
                  "How well does this property match your needs?"
                </div>
              </div>
            </div>
            <div style={{
              marginTop: 'var(--space-4)',
              paddingTop: 'var(--space-4)',
              borderTop: '1px solid var(--glass-border)',
              textAlign: 'center',
              color: 'var(--text-secondary)',
              fontSize: '0.875rem'
            }}>
              <strong>💡 Tip:</strong> Start with A-Score to find great suburbs, then use B-Score to evaluate specific properties within those suburbs.
            </div>
          </div>
        </div>

        {/* Suburb Scout Section */}
        <div id="ascore-tab">
          <div className="calculator-grid">
            {/* Input Card */}
            <div className="card">
              <div className="card-header">
                <div className="card-icon">📍</div>
                <div>
                  <div className="card-title">Suburb Scout</div>
                  <div className="card-subtitle">Select a suburb to analyze</div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span className="form-label-icon">🗺️</span>
                  Suburb Name
                </label>
                <select
                  className="form-select"
                  value={suburb}
                  onChange={handleSuburbChange}
                >
                  <option value="">Select a suburb...</option>
                  <optgroup label="High A-Score (88-95)">
                    <option value="Hawthorn">Hawthorn</option>
                    <option value="Brighton">Brighton</option>
                    <option value="Balwyn">Balwyn</option>
                  </optgroup>
                  <optgroup label="Medium A-Score (75-85)">
                    <option value="Box Hill">Box Hill</option>
                    <option value="Blackburn">Blackburn</option>
                    <option value="Bentleigh">Bentleigh</option>
                    <option value="Ascot Vale">Ascot Vale</option>
                    <option value="Camberwell">Camberwell</option>
                  </optgroup>
                  <optgroup label="Low A-Score (60-70)">
                    <option value="Albanvale">Albanvale</option>
                    <option value="Ardeer">Ardeer</option>
                    <option value="Bellfield">Bellfield</option>
                    <option value="Broadmeadows">Broadmeadows</option>
                  </optgroup>
                </select>
                <div className="form-hint">
                  This is a limited subset of suburbs provided as a demonstration. The full version includes all 397 Melbourne suburbs with comprehensive data.
                </div>
              </div>

              <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleCalculateAScore}>
                Calculate A-Score <span>✨</span>
              </button>
            </div>

            {/* Results Card */}
            <div className="card">
              <div className="card-header">
                <div className="card-icon">📊</div>
                <div>
                  <div className="card-title">Score Results</div>
                  <div className="card-subtitle">Suburb-level analysis</div>
                </div>
              </div>

              <div id="ascoreResults">
                {/* Empty State */}
                {!showAscoreDisplay && (
                  <div className="empty-state" style={{
                    textAlign: 'center',
                    padding: 'var(--space-12) var(--space-6)',
                    color: 'var(--text-secondary)'
                  }}>
                    <div style={{ fontSize: '4rem', marginBottom: 'var(--space-4)', opacity: 0.5 }}>📍</div>
                    <h3 style={{
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      marginBottom: 'var(--space-3)'
                    }}>Ready to Analyze a Suburb?</h3>
                    <p style={{
                      fontSize: '1rem',
                      color: 'var(--text-secondary)',
                      marginBottom: 'var(--space-6)',
                      maxWidth: '400px',
                      marginLeft: 'auto',
                      marginRight: 'auto'
                    }}>
                      Select a suburb from the dropdown above to see its A-Score and detailed analysis.
                    </p>
                    <button className="btn btn-secondary" style={{ marginTop: 'var(--space-4)' }} onClick={tryHawthornExample}>
                      <span>✨</span> Try Example: Hawthorn
                    </button>
                  </div>
                )}
                
                {/* Score Display */}
                {showAscoreDisplay && ascoreResult && (
                  <div className="score-display">
                    <div className="score-label">
                      A-Score (Suburb Quality)
                      <span className="tooltip-icon" title="A-Score evaluates the suburb itself across 15 key metrics including location quality, amenities, safety, schools, and growth potential." style={{
                        display: 'inline-block',
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        background: 'var(--orange-subtle)',
                        color: 'var(--orange-primary)',
                        fontSize: '0.75rem',
                        textAlign: 'center',
                        lineHeight: '18px',
                        marginLeft: 'var(--space-2)',
                        cursor: 'help',
                        fontWeight: 700
                      }}>?</span>
                    </div>
                    <div className="score-value-container">
                      <div className="score-value" ref={ascoreValueRef}>0.0</div>
                    </div>
                    <div className="score-rating">
                      <span>{getRatingText(ascoreResult.score, 'ascore').icon}</span>
                      {getRatingText(ascoreResult.score, 'ascore').text} <span className="score-grade">{getLetterGrade(ascoreResult.score)}</span>
                    </div>
                    <div className="score-percentile">
                      Top {getPercentile(ascoreResult.score)}% of Melbourne suburbs
                    </div>
                    <div className="score-description">
                      <strong>Suburb Quality Score:</strong> Evaluates how good this suburb is overall based on location, amenities, safety, schools, and growth potential (15 metrics).
                    </div>
                  </div>
                )}

                {/* Breakdown */}
                {showAscoreBreakdown && ascoreResult && (
                  <div className="breakdown-section">
                    <h4 className="breakdown-title">📈 Score Breakdown</h4>
                    <div id="ascoreBreakdownItems">
                      {Object.entries(ascoreResult.breakdown).map(([key, score], index) => {
                        const category = categoryData[key] || { emoji: '📊', name: key }
                        return (
                          <motion.div
                            key={key}
                            className="breakdown-item"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className="breakdown-header">
                              <div className="breakdown-label">
                                <span className="breakdown-emoji">{category.emoji}</span>
                                {category.name}
                              </div>
                              <div className="breakdown-value">{score.toFixed(1)}</div>
                            </div>
                            <div className="breakdown-bar">
                              <motion.div
                                className="breakdown-fill"
                                initial={{ width: 0 }}
                                animate={{ width: `${score * 10}%` }}
                                transition={{ delay: index * 0.1 + 0.1, duration: 0.8 }}
                              />
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Insights */}
          {showAscoreInsights && ascoreResult && (
            <div className="insights-section">
              <h3 className="section-title" style={{ marginBottom: 'var(--space-8)', fontSize: '2rem' }}>🎯 Key Insights</h3>
              <div className="insights-grid">
                {generateInsights(ascoreResult.score, ascoreResult.breakdown).map((insight, index) => (
                  <motion.div
                    key={index}
                    className="insight-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="insight-header">
                      <div className="insight-icon">{insight.icon}</div>
                      <div className="insight-title">{insight.title}</div>
                    </div>
                    <div className="insight-message">{insight.message}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* B-Score Section */}
        <div className="section-header" style={{ marginTop: 'var(--space-20)' }}>
          <div className="section-pretitle">Property Analysis</div>
          <h2 className="section-title">Property Analysis</h2>
          <p className="section-subtitle">
            Evaluate specific properties with our simplified property scoring system
          </p>
        </div>

        <div className="calculator-section" style={{ paddingTop: 0 }}>
          <div className="calculator-grid">
            {/* Input Card */}
            <div className="card">
              <div className="card-header">
                <div className="card-icon">🏠</div>
                <div>
                  <div className="card-title">Property Analysis</div>
                  <div className="card-subtitle">Select a property profile to analyze</div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span className="form-label-icon">🏡</span>
                  Property Profile
                </label>
                <select
                  className="form-select"
                  value={propertyProfile}
                  onChange={handleProfileChange}
                >
                  <option value="">Select a property profile...</option>
                  <option value="starter">Starter Home ($650K, 2 bed, 1 bath, 400sqm, Unit)</option>
                  <option value="family">Family Home ($1.2M, 4 bed, 2 bath, 600sqm, House)</option>
                  <option value="investment">Investment Property ($850K, 3 bed, 2 bath, 500sqm, Townhouse)</option>
                  <option value="luxury">Luxury Home ($2.5M, 5 bed, 3 bath, 800sqm, House)</option>
                </select>
                <div className="form-hint" style={{
                  marginTop: 'var(--space-4)',
                  padding: 'var(--space-4)',
                  background: 'var(--warning-dim)',
                  border: '1px solid var(--warning)',
                  borderRadius: 'var(--radius-md)'
                }}>
                  <strong>⚠️ Limited Version:</strong> This is a simplified demonstration version. Members get access to all 397 suburbs, unlimited searches, property saving, comparison tools, and detailed 23-point B-Score breakdowns.
                </div>
              </div>

              <button className="btn btn-primary" style={{ width: '100%', marginTop: 'var(--space-6)' }} onClick={handleCalculateBScore}>
                Calculate B-Score <span>🚀</span>
              </button>

              <Link to="/members" className="btn btn-secondary" style={{ width: '100%', marginTop: 'var(--space-4)', textAlign: 'center' }}>
                Upgrade to Members for Full Features <span>→</span>
              </Link>
            </div>

            {/* Results Card */}
            <div className="card">
              <div className="card-header">
                <div className="card-icon">📊</div>
                <div>
                  <div className="card-title">Comprehensive Analysis</div>
                  <div className="card-subtitle">Property-level evaluation</div>
                </div>
              </div>

              <div id="bscoreResults">
                {/* Empty State */}
                {!showBscoreDisplay && (
                  <div className="empty-state" style={{
                    textAlign: 'center',
                    padding: 'var(--space-12) var(--space-6)',
                    color: 'var(--text-secondary)'
                  }}>
                    <div style={{ fontSize: '4rem', marginBottom: 'var(--space-4)', opacity: 0.5 }}>🏠</div>
                    <h3 style={{
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      marginBottom: 'var(--space-3)'
                    }}>Ready to Evaluate a Property?</h3>
                    <p style={{
                      fontSize: '1rem',
                      color: 'var(--text-secondary)',
                      marginBottom: 'var(--space-6)',
                      maxWidth: '400px',
                      marginLeft: 'auto',
                      marginRight: 'auto'
                    }}>
                      Select a property profile from the dropdown above to see its B-Score and comprehensive analysis.
                    </p>
                    <button className="btn btn-secondary" style={{ marginTop: 'var(--space-4)' }} onClick={tryFamilyHomeExample}>
                      <span>✨</span> Try Example: Family Home
                    </button>
                  </div>
                )}
                
                {/* Score Display */}
                {showBscoreDisplay && bscoreResult && (
                  <div className="score-display">
                    <div className="score-label">
                      B-Score (Property Match)
                      <span className="tooltip-icon" title="B-Score combines A-Score with property-specific factors across 38+ data points for comprehensive analysis including investment potential and lifestyle fit." style={{
                        display: 'inline-block',
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        background: 'var(--orange-subtle)',
                        color: 'var(--orange-primary)',
                        fontSize: '0.75rem',
                        textAlign: 'center',
                        lineHeight: '18px',
                        marginLeft: 'var(--space-2)',
                        cursor: 'help',
                        fontWeight: 700
                      }}>?</span>
                    </div>
                    <div className="score-value-container">
                      <div className="score-value" ref={bscoreValueRef}>0.0</div>
                    </div>
                    <div className="score-rating">
                      <span>{getRatingText(bscoreResult.score, 'bscore').icon}</span>
                      {getRatingText(bscoreResult.score, 'bscore').text} <span className="score-grade">{getLetterGrade(bscoreResult.score)}</span>
                    </div>
                    <div className="score-percentile">
                      Top {getPercentile(bscoreResult.score)}% of Melbourne properties
                    </div>
                    <div className="score-description">
                      <strong>Property Match Score:</strong> Combines suburb quality (A-Score) with property-specific factors to show how well this property matches your needs (38+ data points).
                    </div>
                  </div>
                )}

                {/* Breakdown */}
                {showBscoreBreakdown && bscoreResult && (
                  <div className="breakdown-section">
                    <h4 className="breakdown-title">📈 Detailed Breakdown</h4>
                    <div id="bscoreBreakdownItems">
                      {Object.entries(bscoreResult.breakdown).map(([key, score], index) => {
                        const category = categoryData[key] || { emoji: '📊', name: key }
                        return (
                          <motion.div
                            key={key}
                            className="breakdown-item"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className="breakdown-header">
                              <div className="breakdown-label">
                                <span className="breakdown-emoji">{category.emoji}</span>
                                {category.name}
                              </div>
                              <div className="breakdown-value">{score.toFixed(1)}</div>
                            </div>
                            <div className="breakdown-bar">
                              <motion.div
                                className="breakdown-fill"
                                initial={{ width: 0 }}
                                animate={{ width: `${score * 10}%` }}
                                transition={{ delay: index * 0.1 + 0.1, duration: 0.8 }}
                              />
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Insights */}
          {showBscoreInsights && bscoreResult && (
            <div className="insights-section">
              <h3 className="section-title" style={{ marginBottom: 'var(--space-8)', fontSize: '2rem' }}>🎯 Expert Insights</h3>
              <div className="insights-grid">
                {generateInsights(bscoreResult.score, bscoreResult.breakdown).map((insight, index) => (
                  <motion.div
                    key={index}
                    className="insight-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="insight-header">
                      <div className="insight-icon">{insight.icon}</div>
                      <div className="insight-title">{insight.title}</div>
                    </div>
                    <div className="insight-message">{insight.message}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Sample Properties Section */}
      <section id="samples" className="samples-section">
        <div className="samples-container">
          <div className="section-header">
            <div className="section-pretitle">Live Examples</div>
            <h2 className="section-title">Sample Properties</h2>
            <p className="section-subtitle">
              Explore real property scores from our database of Melbourne homes
            </p>
          </div>

          <div className="samples-grid">
            <div className="property-card">
              <div className="property-image">🏡</div>
              <div className="property-content">
                <div className="property-location">Hawthorn, VIC 3122</div>
                <div className="property-address">123 Glenferrie Road</div>
                <div className="property-stats">
                  <div className="property-stat">
                    <div className="property-stat-label">A-Score</div>
                    <div className="property-stat-value">92.5</div>
                  </div>
                  <div className="property-stat">
                    <div className="property-stat-label">B-Score</div>
                    <div className="property-stat-value">89.3</div>
                  </div>
                  <div className="property-stat">
                    <div className="property-stat-label">Price</div>
                    <div className="property-stat-value">$1.2M</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="property-card">
              <div className="property-image">🏠</div>
              <div className="property-content">
                <div className="property-location">Richmond, VIC 3121</div>
                <div className="property-address">45 Church Street</div>
                <div className="property-stats">
                  <div className="property-stat">
                    <div className="property-stat-label">A-Score</div>
                    <div className="property-stat-value">88.7</div>
                  </div>
                  <div className="property-stat">
                    <div className="property-stat-label">B-Score</div>
                    <div className="property-stat-value">91.2</div>
                  </div>
                  <div className="property-stat">
                    <div className="property-stat-label">Price</div>
                    <div className="property-stat-value">$980K</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="property-card">
              <div className="property-image">🏡</div>
              <div className="property-content">
                <div className="property-location">Brighton, VIC 3186</div>
                <div className="property-address">78 Bay Street</div>
                <div className="property-stats">
                  <div className="property-stat">
                    <div className="property-stat-label">A-Score</div>
                    <div className="property-stat-value">95.1</div>
                  </div>
                  <div className="property-stat">
                    <div className="property-stat-label">B-Score</div>
                    <div className="property-stat-value">87.6</div>
                  </div>
                  <div className="property-stat">
                    <div className="property-stat-label">Price</div>
                    <div className="property-stat-value">$2.8M</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="property-card">
              <div className="property-image">🏠</div>
              <div className="property-content">
                <div className="property-location">Frankston, VIC 3199</div>
                <div className="property-address">12 Nepean Highway</div>
                <div className="property-stats">
                  <div className="property-stat">
                    <div className="property-stat-label">A-Score</div>
                    <div className="property-stat-value">72.4</div>
                  </div>
                  <div className="property-stat">
                    <div className="property-stat-label">B-Score</div>
                    <div className="property-stat-value">78.9</div>
                  </div>
                  <div className="property-stat">
                    <div className="property-stat-label">Price</div>
                    <div className="property-stat-value">$650K</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  )
}

export default Calculator
