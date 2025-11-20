import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  loadSuburbsData, 
  loadPropertiesData, 
  loadUserPreferences, 
  saveUserPreferences,
  calculateAScoreForSuburb,
  calculateBScoreForProperty,
  loadPropertiesFromStorage,
  savePropertyToStorage,
  deletePropertyFromStorage,
  isTestingMode
} from '../utils/members'
import { animateCountUp } from '../utils/calculator'
import { PropertyDetailModal } from '../components/PropertyDetailModal'
import Onboarding from '../components/Onboarding'
import MembersNavigation from '../components/MembersNavigation'

function Members() {
  // State management
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [activeTab, setActiveTab] = useState('property')
  const [suburbsData, setSuburbsData] = useState([])
  const [propertiesData, setPropertiesData] = useState([])
  const [savedProperties, setSavedProperties] = useState([])
  const [userPreferences, setUserPreferences] = useState(null)
  const [selectedSuburb, setSelectedSuburb] = useState('')
  const [ascoreResult, setAscoreResult] = useState(null)
  const [bscoreResult, setBscoreResult] = useState(null)
  const [rankedProperties, setRankedProperties] = useState([])
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [showPropertyModal, setShowPropertyModal] = useState(false)
  const [currentProperty, setCurrentProperty] = useState({
    address: '',
    suburb: '',
    postcode: '',
    price: '',
    propertyType: 'house',
    bedrooms: 3,
    bathrooms: 2,
    landSize: '',
    streetQuality: 3
  })
  
  // Refs
  const ascoreValueRef = useRef(null)
  const bscoreValueRef = useRef(null)

  // Load data on mount
  useEffect(() => {
    checkAccess()
    loadInitialData()
  }, [])

  // Check access and show onboarding
  const checkAccess = () => {
    if (!isTestingMode()) {
      setShowPasswordModal(true)
      return
    }
    
    const hasCompletedOnboarding = localStorage.getItem('homescorepro_onboarding_complete') === 'true'
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true)
    }
    
    const prefs = loadUserPreferences()
    if (prefs) {
      setUserPreferences(prefs)
    }
  }

  // Load initial data
  const loadInitialData = async () => {
    try {
      const [suburbs, properties] = await Promise.all([
        loadSuburbsData(),
        loadPropertiesData()
      ])
      
      console.log('📊 Data loaded:', {
        suburbs: suburbs?.length || 0,
        properties: properties?.length || 0,
        propertiesSample: properties?.slice(0, 3)
      })
      
      if (!properties || properties.length === 0) {
        console.warn('⚠️ No properties loaded from CSV')
      }
      
      if (!suburbs || suburbs.length === 0) {
        console.warn('⚠️ No suburbs loaded from CSV')
      }
      
      setSuburbsData(suburbs || [])
      setPropertiesData(properties || [])
      setSavedProperties(loadPropertiesFromStorage())
      
      // Calculate ranked properties
      if (properties && properties.length > 0 && suburbs && suburbs.length > 0) {
        calculateRankedProperties(properties, suburbs)
      } else {
        console.warn('⚠️ Cannot calculate ranked properties - missing data')
      }
    } catch (error) {
      console.error('❌ Error loading data:', error)
      console.error('Error details:', error.stack)
    }
  }
  
  // Calculate ranked properties with bScores
  const calculateRankedProperties = (properties, suburbs) => {
    const prefs = userPreferences || loadUserPreferences()
    console.log('🏆 Calculating ranked properties:', { 
      propertiesCount: properties.length, 
      suburbsCount: suburbs.length,
      sampleProperty: properties[0]
    })
    
    // Helper function to normalize suburb names for matching
    const normalizeSuburbName = (name) => {
      if (!name) return ''
      return name.trim().toLowerCase().replace(/\s+/g, ' ')
    }
    
    // Create a lookup map for faster suburb matching
    const suburbMap = new Map()
    suburbs.forEach(suburb => {
      const normalized = normalizeSuburbName(suburb.name || suburb.suburb)
      if (!suburbMap.has(normalized)) {
        suburbMap.set(normalized, suburb)
      }
    })
    
    let matchedCount = 0
    let unmatchedCount = 0
    const unmatchedSuburbs = new Set()
    
    const ranked = properties.map(property => {
      const suburbName = property.suburb || ''
      const normalizedSuburbName = normalizeSuburbName(suburbName)
      
      // Try exact match first
      let suburb = suburbMap.get(normalizedSuburbName)
      
      // If no exact match, try partial match (e.g., "Frankston North" matches "Frankston")
      if (!suburb) {
        suburb = suburbs.find(s => {
          const sName = normalizeSuburbName(s.name || s.suburb)
          return sName.includes(normalizedSuburbName) || normalizedSuburbName.includes(sName)
        })
      }
      
      if (!suburb) {
        unmatchedCount++
        unmatchedSuburbs.add(suburbName)
        console.warn(`⚠️ No suburb found for property: ${property.address} (suburb: "${suburbName}")`)
        return null
      }
      
      matchedCount++
      
      // Calculate bScore if not already set
      let bScore = property.bScore || 0
      let bscoreResult = null
      
      try {
        if (!bScore || bScore === 0) {
          bscoreResult = calculateBScoreForProperty(property, suburb, prefs)
          bScore = bscoreResult?.score || 0
        } else {
          // Still calculate for breakdown
          bscoreResult = calculateBScoreForProperty(property, suburb, prefs)
        }
      } catch (error) {
        console.error(`❌ Error calculating B-Score for property ${property.address}:`, error)
        return null
      }
      
      return {
        ...property,
        bScore,
        bscoreResult,
        suburbData: suburb
      }
    }).filter(p => p !== null)
    
    // Sort by bScore descending
    ranked.sort((a, b) => (b.bScore || 0) - (a.bScore || 0))
    
    console.log('✅ Ranked properties calculated:', {
      total: ranked.length,
      matched: matchedCount,
      unmatched: unmatchedCount,
      unmatchedSuburbs: Array.from(unmatchedSuburbs).slice(0, 5) // Show first 5 unmatched
    })
    
    if (unmatchedCount > 0) {
      console.warn(`⚠️ ${unmatchedCount} properties could not be matched to suburbs. Unmatched suburbs:`, Array.from(unmatchedSuburbs))
    }
    
    setRankedProperties(ranked)
  }
  
  // Recalculate when data or preferences change
  useEffect(() => {
    if (propertiesData.length > 0 && suburbsData.length > 0) {
      calculateRankedProperties(propertiesData, suburbsData)
    }
  }, [propertiesData, suburbsData, userPreferences])
  
  // Handle property click
  const handlePropertyClick = (property) => {
    setSelectedProperty(property)
    setShowPropertyModal(true)
  }
  

  // Onboarding handlers
  const handleOnboardingComplete = (preferences) => {
    saveUserPreferences(preferences)
    setUserPreferences(preferences)
    setShowOnboarding(false)
  }

  const handleOnboardingSkip = () => {
    setShowOnboarding(false)
  }

  const handleResetOnboarding = () => {
    setShowOnboarding(true)
  }

  // Password modal handlers
  const checkPassword = () => {
    const input = document.getElementById('password-input')
    if (input && input.value === 'Hampz') {
      localStorage.setItem('homescorepro_paid_access', 'true')
      window.hasPaidAccess = true
      setShowPasswordModal(false)
      if (!localStorage.getItem('homescorepro_onboarding_complete')) {
        setShowOnboarding(true)
      }
    } else {
      const errorEl = document.getElementById('password-error')
      if (errorEl) errorEl.style.display = 'block'
    }
  }

  // A-Score calculation
  const handleCalculateAScore = () => {
    if (!selectedSuburb) return
    
    const suburb = suburbsData.find(s => s.name === selectedSuburb)
    if (!suburb) return
    
    const strategy = userPreferences?.primaryGoal?.toLowerCase() || 'balanced'
    const result = calculateAScoreForSuburb(suburb, strategy, userPreferences)
    
    if (result) {
      setAscoreResult(result)
      if (ascoreValueRef.current) {
        animateCountUp(ascoreValueRef.current, result.score, 1500)
      }
    }
  }

  // B-Score calculation
  const handleCalculateBScore = () => {
    const suburb = suburbsData.find(s => s.name === currentProperty.suburb)
    if (!suburb) {
      alert('Please select a suburb first')
      return
    }
    
    const propertyData = {
      ...currentProperty,
      price: parseFloat(currentProperty.price) || 0,
      landSize: parseFloat(currentProperty.landSize) || 0
    }
    
    const result = calculateBScoreForProperty(propertyData, suburb, userPreferences)
    
    if (result) {
      setBscoreResult(result)
      if (bscoreValueRef.current) {
        animateCountUp(bscoreValueRef.current, result.score, 1500)
      }
    }
  }

  // Helper functions (same as Calculator.jsx)
  const getLetterGrade = (score) => {
    if (score >= 90) return 'A+'
    if (score >= 85) return 'A'
    if (score >= 80) return 'B+'
    if (score >= 75) return 'B'
    if (score >= 70) return 'C+'
    if (score >= 65) return 'C'
    return 'C-'
  }

  const getPercentile = (score) => {
    if (score >= 95) return '5'
    if (score >= 90) return '10'
    if (score >= 85) return '20'
    if (score >= 80) return '30'
    if (score >= 75) return '40'
    if (score >= 70) return '50'
    if (score >= 65) return '60'
    return '70'
  }

  const getRatingText = (score, type) => {
    if (score >= 90) return { icon: '🚀', text: type === 'ascore' ? 'Outstanding Suburb' : 'Outstanding Property' }
    if (score >= 80) return { icon: '⭐', text: type === 'ascore' ? 'Excellent Suburb' : 'Excellent Property' }
    if (score >= 70) return { icon: '✅', text: type === 'ascore' ? 'Strong Suburb' : 'Strong Property' }
    return { icon: '👍', text: type === 'ascore' ? 'Good Suburb' : 'Good Property' }
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
      <MembersNavigation onResetOnboarding={handleResetOnboarding} />
      
      <Onboarding
        isOpen={showOnboarding}
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
        userPreferences={userPreferences}
        onSavePreferences={saveUserPreferences}
      />
      
      {/* Hero Section */}
      <section className="hero" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
        <div className="hero-container">
          <div className="hero-content">
            <h1 style={{ fontSize: '3rem', marginBottom: 'var(--space-6)' }}>
              Find Your Perfect Suburb & Score Every Home Like a Pro
            </h1>
            <p className="tagline" style={{ fontSize: '1.25rem', marginBottom: 'var(--space-6)', color: 'var(--text-secondary)' }}>
              HomeScorePro uses 38 data points to help you make smarter property decisions.<br />
              <strong>A-Score: Scout & Analyze Suburbs</strong> | <strong>B-Score: Evaluate Individual Properties</strong>
            </p>
            <div style={{ 
              background: 'var(--bg-secondary)', 
              padding: 'var(--space-4)', 
              borderRadius: 'var(--radius-md)', 
              marginBottom: 'var(--space-6)', 
              fontSize: '0.9rem', 
              color: 'var(--text-secondary)' 
            }}>
              <strong>A-Score analyzes suburbs at a high level.</strong> B-Score evaluates specific properties in detail.
            </div>
            <div className="hero-buttons" style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
              <a href="#location-scout" className="btn btn-primary">
                <span>📍 Scout Suburbs (A-Score)</span>
                <span>→</span>
              </a>
              <a href="#calculator" className="btn btn-secondary">
                <span>🏠 Evaluate Properties (B-Score)</span>
              </a>
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  setActiveTab('ranked')
                  setTimeout(() => {
                    document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })
                  }, 100)
                }}
                style={{ 
                  background: 'var(--orange-subtle)',
                  border: '2px solid var(--orange-primary)',
                  color: 'var(--orange-primary)'
                }}
              >
                <span>🏆 View Ranked Properties</span>
              </button>
            </div>
            <div style={{ 
              marginTop: 'var(--space-8)', 
              display: 'flex', 
              gap: 'var(--space-8)', 
              color: 'var(--text-tertiary)', 
              flexWrap: 'wrap' 
            }}>
              <div>✓ 399 Melbourne suburbs analyzed</div>
              <div>✓ Real crime statistics integrated</div>
              <div>✓ Live calculations</div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Scout Section */}
      <section id="location-scout" className="calculator-section" style={{ paddingTop: 'var(--space-20)' }}>
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">📍 Suburb Scout (A-Score)</h2>
            <p className="section-subtitle">
              Analyze suburbs using location, investment potential, and lifestyle data. Find your current location or search for suburbs.
            </p>
          </div>
          
          <div className="input-panel" style={{ maxWidth: '600px', margin: '0 auto var(--space-8)' }}>
            <div className="input-group">
              <label className="input-label">Search Suburb by Name</label>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Enter suburb name..."
                  value={selectedSuburb}
                  onChange={(e) => setSelectedSuburb(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleCalculateAScore()
                  }}
                />
                <button className="btn btn-primary" onClick={handleCalculateAScore}>
                  Search
                </button>
              </div>
            </div>
          </div>
          
          {ascoreResult && (
            <div className="results-panel" style={{ maxWidth: '800px', margin: '0 auto' }}>
              <div className="score-display">
                <div className="score-value" ref={ascoreValueRef}>{ascoreResult.score.toFixed(1)}</div>
                <div className="score-label">Suburb Analysis Score (A-Score)</div>
                <div className="score-rating">
                  <span>{getRatingText(ascoreResult.score, 'ascore').icon}</span>
                  {getRatingText(ascoreResult.score, 'ascore').text} <span className="score-grade">{getLetterGrade(ascoreResult.score)}</span>
                </div>
                <div className="score-percentile">
                  Top {getPercentile(ascoreResult.score)}% of Melbourne suburbs
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Calculator Section with Tabs */}
      <section id="calculator" className="calculator-section" style={{ paddingTop: 'var(--space-20)' }}>
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">🏠 Property Evaluator (B-Score)</h2>
            <p className="section-subtitle">
              Evaluate specific properties using property features, price, and suburb context.
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-6)', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button 
              className={`btn ${activeTab === 'property' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('property')}
            >
              <span style={{
                display: 'inline-block',
                width: '16px',
                height: '14px',
                border: `2px solid ${activeTab === 'property' ? 'var(--dark-900)' : 'var(--orange-primary)'}`,
                borderRadius: '2px 2px 0 0',
                position: 'relative',
                flexShrink: 0
              }}>
                <span style={{
                  position: 'absolute',
                  bottom: '-4px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '20px',
                  height: '4px',
                  background: activeTab === 'property' ? 'var(--dark-900)' : 'var(--orange-primary)',
                  borderRadius: '0 0 2px 2px'
                }}></span>
              </span>
              <span>Property Evaluation (B-Score)</span>
            </button>
            <button 
              className={`btn ${activeTab === 'ranked' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('ranked')}
            >
              <span style={{
                display: 'inline-block',
                width: '16px',
                height: '16px',
                background: activeTab === 'ranked' ? 'var(--dark-900)' : 'var(--orange-primary)',
                clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                flexShrink: 0
              }}></span>
              <span>Ranked Properties</span>
            </button>
          </div>
          
          {activeTab === 'property' && (
            <div className="calculator-grid">
              <div className="input-panel">
                <h3 style={{ marginBottom: 'var(--space-6)' }}>Property Details</h3>
                <div className="input-group">
                  <label className="input-label">Property Address</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="123 Example Street"
                    value={currentProperty.address}
                    onChange={(e) => setCurrentProperty({ ...currentProperty, address: e.target.value })}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Suburb</label>
                  <select 
                    className="input-select"
                    value={currentProperty.suburb}
                    onChange={(e) => setCurrentProperty({ ...currentProperty, suburb: e.target.value })}
                  >
                    <option value="">Select suburb...</option>
                    {suburbsData.map((suburb) => (
                      <option key={suburb.name} value={suburb.name}>{suburb.name}</option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Price ($)</label>
                  <input 
                    type="number" 
                    className="input-field" 
                    placeholder="850000"
                    value={currentProperty.price}
                    onChange={(e) => setCurrentProperty({ ...currentProperty, price: e.target.value })}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Property Type</label>
                  <select 
                    className="input-select"
                    value={currentProperty.propertyType}
                    onChange={(e) => setCurrentProperty({ ...currentProperty, propertyType: e.target.value })}
                  >
                    <option value="house">House</option>
                    <option value="townhouse">Townhouse</option>
                    <option value="unit">Unit</option>
                    <option value="apartment">Apartment</option>
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                  <div className="input-group">
                    <label className="input-label">Bedrooms</label>
                    <input 
                      type="number" 
                      className="input-field" 
                      value={currentProperty.bedrooms}
                      onChange={(e) => setCurrentProperty({ ...currentProperty, bedrooms: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Bathrooms</label>
                    <input 
                      type="number" 
                      className="input-field" 
                      step="0.5"
                      value={currentProperty.bathrooms}
                      onChange={(e) => setCurrentProperty({ ...currentProperty, bathrooms: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                <div className="input-group">
                  <label className="input-label">Land Size (sqm)</label>
                  <input 
                    type="number" 
                    className="input-field" 
                    placeholder="650"
                    value={currentProperty.landSize}
                    onChange={(e) => setCurrentProperty({ ...currentProperty, landSize: e.target.value })}
                  />
                </div>
                <button className="btn btn-primary" style={{ width: '100%', marginTop: 'var(--space-6)' }} onClick={handleCalculateBScore}>
                  Calculate B-Score
                </button>
              </div>
              
              {bscoreResult && (
                <div className="results-panel score-type-property">
                  <div className="score-display">
                    <div className="score-value" ref={bscoreValueRef}>{bscoreResult.score.toFixed(1)}</div>
                    <div className="score-label">Property Evaluation Score (B-Score)</div>
                    <div className="score-rating">
                      <span>{getRatingText(bscoreResult.score, 'bscore').icon}</span>
                      {getRatingText(bscoreResult.score, 'bscore').text} <span className="score-grade">{getLetterGrade(bscoreResult.score)}</span>
                    </div>
                    <div className="score-percentile">
                      Top {getPercentile(bscoreResult.score)}% of Melbourne properties
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'ranked' && (
            <div className="calculator-grid" style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <div className="section-header" style={{ gridColumn: '1 / -1', marginBottom: 'var(--space-6)' }}>
                <h2 className="section-title">🏆 Ranked Properties</h2>
                <p className="section-subtitle">
                  Properties sorted by B-Score - Click any property to view detailed breakdown
                </p>
                <div style={{
                  background: 'var(--orange-subtle)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-4)',
                  marginTop: 'var(--space-4)',
                  textAlign: 'center'
                }}>
                  <strong style={{ color: 'var(--orange-primary)' }}>{rankedProperties.length}</strong>
                  <span style={{ color: 'var(--text-secondary)', marginLeft: 'var(--space-2)' }}>
                    properties analyzed and ranked
                  </span>
                </div>
              </div>
              
              {rankedProperties.length === 0 ? (
                <div className="results-panel" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 'var(--space-8)' }}>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
                    No properties found. Properties will be ranked here once loaded.
                  </div>
                </div>
              ) : (
                <div style={{ gridColumn: '1 / -1', display: 'grid', gap: 'var(--space-4)' }}>
                  {rankedProperties.map((property, index) => {
                    return (
                      <motion.div
                        key={property.id || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="card"
                        style={{
                          cursor: 'pointer',
                          display: 'flex',
                          gap: 'var(--space-4)',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          padding: 'var(--space-5)'
                        }}
                        onClick={() => handlePropertyClick(property)}
                      >
                        {/* Rank Badge */}
                        <div style={{
                          minWidth: '60px',
                          textAlign: 'center',
                          padding: 'var(--space-3)',
                          background: index < 3 ? 'var(--orange-primary)' : 'var(--bg-tertiary)',
                          borderRadius: 'var(--radius-md)',
                          color: index < 3 ? 'white' : 'var(--text-primary)',
                          fontWeight: 700,
                          fontSize: '1.2rem',
                          border: index < 3 ? 'none' : '1px solid var(--glass-border)'
                        }}>
                          #{index + 1}
                        </div>
                        
                        {/* Property Info */}
                        <div style={{ flex: 1, minWidth: '200px' }}>
                          <h4 style={{ 
                            margin: 0, 
                            marginBottom: 'var(--space-2)', 
                            fontSize: '1.125rem',
                            fontWeight: 600,
                            color: 'var(--text-primary)'
                          }}>
                            {(property.address && property.address.trim()) ? property.address.trim().replace(/,$/, '') : 'Address not provided'}
                          </h4>
                          <p style={{ 
                            margin: 0, 
                            color: 'var(--text-secondary)', 
                            fontSize: '0.9375rem', 
                            marginBottom: 'var(--space-2)' 
                          }}>
                            {property.suburb || ''} {property.postcode || ''} {property.price ? `• $${parseInt(property.price).toLocaleString()}` : ''}
                          </p>
                          <div style={{ 
                            display: 'flex', 
                            gap: 'var(--space-3)', 
                            fontSize: '0.875rem', 
                            color: 'var(--text-tertiary)',
                            flexWrap: 'wrap'
                          }}>
                            {property.bedrooms && <span>{parseInt(property.bedrooms) || 0} bed</span>}
                            {property.bathrooms && <span>{parseFloat(property.bathrooms) || 0} bath</span>}
                            {property.landSize && <span>{parseInt(property.landSize)} m²</span>}
                            {property.propertyType && <span style={{ textTransform: 'capitalize' }}>{property.propertyType}</span>}
                          </div>
                        </div>
                        
                        {/* B-Score Display */}
                        <div style={{
                          minWidth: '100px',
                          textAlign: 'center',
                          padding: 'var(--space-4)',
                          background: 'var(--bg-tertiary)',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--glass-border)'
                        }}>
                          <div style={{
                            fontSize: '2rem',
                            fontWeight: 700,
                            color: 'var(--orange-primary)',
                            marginBottom: 'var(--space-1)',
                            lineHeight: 1
                          }}>
                            {(property.bScore || 0).toFixed(1)}
                          </div>
                          <div style={{ 
                            fontSize: '0.75rem', 
                            color: 'var(--text-secondary)',
                            fontWeight: 500
                          }}>
                            B-Score
                          </div>
                        </div>
                        
                        {/* Tier Scores */}
                        {property.bscoreResult && (
                          <div style={{
                            display: 'flex',
                            gap: 'var(--space-2)',
                            minWidth: '180px',
                            flexWrap: 'wrap'
                          }}>
                            {['tier1', 'tier2', 'tier3', 'tier4', 'tier5'].map((tier) => (
                              <div
                                key={tier}
                                style={{
                                  flex: '1 1 0',
                                  minWidth: '30px',
                                  textAlign: 'center',
                                  padding: 'var(--space-2)',
                                  background: 'var(--bg-tertiary)',
                                  borderRadius: 'var(--radius-sm)',
                                  fontSize: '0.75rem',
                                  border: '1px solid var(--glass-border)'
                                }}
                                title={`${tier}: ${(property.bscoreResult[tier] || 0).toFixed(1)}`}
                              >
                                <div style={{ 
                                  fontWeight: 600, 
                                  color: 'var(--orange-primary)',
                                  fontSize: '0.875rem'
                                }}>
                                  {(property.bscoreResult[tier] || 0).toFixed(0)}
                                </div>
                                <div style={{ 
                                  fontSize: '0.65rem', 
                                  color: 'var(--text-tertiary)',
                                  marginTop: '2px'
                                }}>
                                  {tier.replace('tier', 'T')}
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </motion.div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Property Detail Modal */}
      {selectedProperty && (
        <PropertyDetailModal
          property={selectedProperty}
          suburb={selectedProperty.suburbData}
          userPreferences={userPreferences}
          isOpen={showPropertyModal}
          onClose={() => {
            setShowPropertyModal(false)
            setSelectedProperty(null)
          }}
        />
      )}

      {/* Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div 
            className="password-modal"
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
              zIndex: 10000
            }}
          >
            <motion.div 
              className="password-modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                background: 'var(--bg-secondary)',
                padding: 'var(--space-8)',
                borderRadius: 'var(--radius-xl)',
                maxWidth: '400px',
                width: '90%',
                position: 'relative'
              }}
            >
              <button 
                className="password-close"
                onClick={() => setShowPasswordModal(false)}
                style={{
                  position: 'absolute',
                  top: 'var(--space-4)',
                  right: 'var(--space-4)',
                  background: 'none',
                  border: 'none',
                  fontSize: '2rem',
                  color: 'var(--text-primary)',
                  cursor: 'pointer'
                }}
              >
                &times;
              </button>
              <h3 style={{ marginBottom: 'var(--space-4)' }}>Testing Access</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
                Enter password to access paid features for testing
              </p>
              <input 
                type="password" 
                className="password-input" 
                id="password-input"
                placeholder="Enter password"
                style={{
                  width: '100%',
                  padding: 'var(--space-3)',
                  marginBottom: 'var(--space-4)',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)'
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') checkPassword()
                }}
              />
              <button 
                className="password-submit btn btn-primary"
                onClick={checkPassword}
                style={{ width: '100%' }}
              >
                Submit
              </button>
              <p 
                className="password-error" 
                id="password-error"
                style={{ 
                  display: 'none', 
                  color: 'var(--error)', 
                  marginTop: 'var(--space-4)',
                  fontSize: '0.875rem'
                }}
              >
                contact Jason
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  )
}

export default Members
