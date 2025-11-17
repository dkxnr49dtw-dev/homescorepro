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

function Members() {
  // State management
  const [onboardingStep, setOnboardingStep] = useState(1)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [activeTab, setActiveTab] = useState('suburb')
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
  
  // Onboarding state
  const [onboardingData, setOnboardingData] = useState({
    primaryGoal: '',
    budgetMin: 500000,
    budgetMax: 750000,
    familyStatus: '',
    safetyPriority: 8,
    geographicCategories: []
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
  const nextStep = () => {
    if (!validateStep()) return
    
    if (onboardingStep < 6) {
      setOnboardingStep(onboardingStep + 1)
    } else {
      completeOnboarding()
    }
  }

  const previousStep = () => {
    if (onboardingStep > 1) {
      setOnboardingStep(onboardingStep - 1)
    }
  }

  const skipOnboarding = () => {
    completeOnboarding()
  }

  const completeOnboarding = () => {
    const preferences = {
      primaryGoal: onboardingData.primaryGoal || 'Balanced',
      budgetMin: onboardingData.budgetMin || 500000,
      budgetMax: onboardingData.budgetMax || 750000,
      familyStatus: onboardingData.familyStatus || 'Couple',
      safetyPriority: onboardingData.safetyPriority || 8,
      geographicCategories: onboardingData.geographicCategories || []
    }
    saveUserPreferences(preferences)
    setUserPreferences(preferences)
    localStorage.setItem('homescorepro_onboarding_complete', 'true')
    setShowOnboarding(false)
  }
  
  // Onboarding handlers
  const selectOption = (key, value) => {
    setOnboardingData({ ...onboardingData, [key]: value })
  }
  
  const toggleGeographicCategory = (category) => {
    const categories = [...onboardingData.geographicCategories]
    const index = categories.indexOf(category)
    if (index > -1) {
      categories.splice(index, 1)
    } else {
      categories.push(category)
    }
    setOnboardingData({ ...onboardingData, geographicCategories: categories })
  }
  
  const selectAllGeographic = () => {
    setOnboardingData({ 
      ...onboardingData, 
      geographicCategories: ['BAYSIDE', 'HILLS & RANGES', 'INNER METRO', 'OUTER GROWTH'] 
    })
  }
  
  const validateStep = () => {
    if (onboardingStep === 1 && !onboardingData.primaryGoal) {
      alert('Please select your primary goal')
      return false
    }
    if (onboardingStep === 3 && !onboardingData.familyStatus) {
      alert('Please select your family situation')
      return false
    }
    return true
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
          
          <div className="calculator-tabs" style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
            <button 
              className={`tab-btn ${activeTab === 'suburb' ? 'active' : ''}`}
              onClick={() => setActiveTab('suburb')}
              style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
            >
              <span>📍</span>
              <span>Suburb Analysis (A-Score)</span>
            </button>
            <button 
              className={`tab-btn ${activeTab === 'property' ? 'active' : ''}`}
              onClick={() => setActiveTab('property')}
              style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
            >
              <span>🏠</span>
              <span>Property Evaluation (B-Score)</span>
            </button>
            <button 
              className={`tab-btn ${activeTab === 'ranked' ? 'active' : ''}`}
              onClick={() => {
                console.log('Ranked tab clicked, activeTab:', activeTab)
                setActiveTab('ranked')
              }}
              style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
            >
              <span>🏆</span>
              <span>Ranked Properties</span>
            </button>
          </div>
          
          {activeTab === 'suburb' && (
            <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--text-secondary)' }}>
              <p>Use the "📍 Suburb Scout (A-Score)" section above to analyze suburbs.</p>
              <p style={{ marginTop: 'var(--space-4)' }}>
                Or select a property tab to evaluate individual properties, or view ranked properties below.
              </p>
            </div>
          )}
          
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
                            {property.address || 'Address not provided'}
                          </h4>
                          <p style={{ 
                            margin: 0, 
                            color: 'var(--text-secondary)', 
                            fontSize: '0.9375rem', 
                            marginBottom: 'var(--space-2)' 
                          }}>
                            {property.suburb} {property.postcode} • ${(property.price || 0).toLocaleString()}
                          </p>
                          <div style={{ 
                            display: 'flex', 
                            gap: 'var(--space-3)', 
                            fontSize: '0.875rem', 
                            color: 'var(--text-tertiary)',
                            flexWrap: 'wrap'
                          }}>
                            <span>{property.bedrooms || 0} bed</span>
                            <span>{property.bathrooms || 0} bath</span>
                            {property.landSize && <span>{property.landSize} m²</span>}
                            <span style={{ textTransform: 'capitalize' }}>{property.propertyType || 'house'}</span>
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

      {/* Onboarding Modal - Simplified for now */}
      <AnimatePresence>
        {showOnboarding && (
          <motion.div
            className="onboarding-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10001
            }}
          >
            <motion.div
              className="onboarding-container"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                background: 'var(--bg-secondary)',
                padding: 'var(--space-8)',
                borderRadius: 'var(--radius-xl)',
                maxWidth: '600px',
                width: '90%',
                maxHeight: '90vh',
                overflow: 'auto'
              }}
            >
              <h2 style={{ marginBottom: 'var(--space-4)' }}>Welcome to HomeScorePro</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-8)' }}>
                Let's personalize your experience
              </p>
              <div style={{ marginBottom: 'var(--space-8)' }}>
                <p>Step {onboardingStep} of 6</p>
                <div style={{ 
                  display: 'flex', 
                  gap: 'var(--space-2)', 
                  marginTop: 'var(--space-4)' 
                }}>
                  {[1, 2, 3, 4, 5, 6].map((step) => (
                    <div
                      key={step}
                      style={{
                        flex: 1,
                        height: '4px',
                        background: step <= onboardingStep ? 'var(--orange-primary)' : 'var(--bg-tertiary)',
                        borderRadius: '2px'
                      }}
                    />
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: 'var(--space-8)', minHeight: '300px' }}>
                {/* Step 1: Primary Goal */}
                {onboardingStep === 1 && (
                  <div>
                    <h3 style={{ color: 'var(--orange-primary)', marginBottom: 'var(--space-4)', fontSize: '1.5rem' }}>
                      What's your primary goal?
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
                      This helps us tailor the scoring to your needs
                    </p>
                    <div style={{ display: 'grid', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                      {[
                        { value: 'Investment', icon: '💰', title: 'Investment Focus', desc: 'Maximize growth and rental yield' },
                        { value: 'Balanced', icon: '⚖️', title: 'Balanced', desc: 'Equal focus on investment and lifestyle' },
                        { value: 'Lifestyle', icon: '🏖️', title: 'Lifestyle Focus', desc: 'Prioritize amenities and quality of life' }
                      ].map((option) => (
                        <div
                          key={option.value}
                          onClick={() => selectOption('primaryGoal', option.value)}
                          style={{
                            padding: 'var(--space-5)',
                            border: `2px solid ${onboardingData.primaryGoal === option.value ? 'var(--orange-primary)' : 'var(--glass-border)'}`,
                            borderRadius: 'var(--radius-lg)',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                            textAlign: 'center',
                            background: onboardingData.primaryGoal === option.value ? 'var(--orange-subtle)' : 'var(--bg-tertiary)'
                          }}
                        >
                          <h4 style={{ fontSize: '1.125rem', marginBottom: 'var(--space-2)' }}>
                            {option.icon} {option.title}
                          </h4>
                          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{option.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Budget Range */}
                {onboardingStep === 2 && (
                  <div>
                    <h3 style={{ color: 'var(--orange-primary)', marginBottom: 'var(--space-4)', fontSize: '1.5rem' }}>
                      What's your budget range?
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
                      This determines which suburbs match your strategy
                    </p>
                    <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: 'var(--space-2)', color: 'var(--text-primary)' }}>
                          Minimum Budget ($)
                        </label>
                        <input
                          type="number"
                          value={onboardingData.budgetMin}
                          min="100000"
                          max="5000000"
                          step="10000"
                          onChange={(e) => selectOption('budgetMin', parseInt(e.target.value))}
                          style={{
                            width: '100%',
                            padding: 'var(--space-3)',
                            background: 'var(--bg-tertiary)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--text-primary)',
                            fontSize: '1rem'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: 'var(--space-2)', color: 'var(--text-primary)' }}>
                          Maximum Budget ($)
                        </label>
                        <input
                          type="number"
                          value={onboardingData.budgetMax}
                          min="100000"
                          max="5000000"
                          step="10000"
                          onChange={(e) => selectOption('budgetMax', parseInt(e.target.value))}
                          style={{
                            width: '100%',
                            padding: 'var(--space-3)',
                            background: 'var(--bg-tertiary)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--text-primary)',
                            fontSize: '1rem'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Family Status */}
                {onboardingStep === 3 && (
                  <div>
                    <h3 style={{ color: 'var(--orange-primary)', marginBottom: 'var(--space-4)', fontSize: '1.5rem' }}>
                      What's your family situation?
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
                      This helps prioritize relevant amenities
                    </p>
                    <div style={{ display: 'grid', gap: 'var(--space-4)', gridTemplateColumns: 'repeat(2, 1fr)' }}>
                      {[
                        { value: 'Single', icon: '👤' },
                        { value: 'Couple', icon: '👫' },
                        { value: 'Family', icon: '👨‍👩‍👧‍👦', title: 'Family with Children' },
                        { value: 'Empty Nesters', icon: '👴👵' }
                      ].map((option) => (
                        <div
                          key={option.value}
                          onClick={() => selectOption('familyStatus', option.value)}
                          style={{
                            padding: 'var(--space-5)',
                            border: `2px solid ${onboardingData.familyStatus === option.value ? 'var(--orange-primary)' : 'var(--glass-border)'}`,
                            borderRadius: 'var(--radius-lg)',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                            textAlign: 'center',
                            background: onboardingData.familyStatus === option.value ? 'var(--orange-subtle)' : 'var(--bg-tertiary)'
                          }}
                        >
                          <h4 style={{ fontSize: '1.125rem' }}>
                            {option.icon} {option.title || option.value}
                          </h4>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 4: Safety Priority */}
                {onboardingStep === 4 && (
                  <div>
                    <h3 style={{ color: 'var(--orange-primary)', marginBottom: 'var(--space-4)', fontSize: '1.5rem' }}>
                      How important is safety to you?
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
                      Rate from 1 (not important) to 10 (very important)
                    </p>
                    <div>
                      <label style={{ display: 'block', marginBottom: 'var(--space-4)', color: 'var(--text-primary)' }}>
                        Safety Priority (1-10)
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={onboardingData.safetyPriority}
                        onChange={(e) => selectOption('safetyPriority', parseInt(e.target.value))}
                        style={{
                          width: '100%',
                          marginBottom: 'var(--space-4)'
                        }}
                      />
                      <div style={{ textAlign: 'center' }}>
                        <span style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--orange-primary)' }}>
                          {onboardingData.safetyPriority}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 5: Geographic Categories */}
                {onboardingStep === 5 && (
                  <div>
                    <h3 style={{ color: 'var(--orange-primary)', marginBottom: 'var(--space-4)', fontSize: '1.5rem' }}>
                      Which areas interest you?
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
                      Select all that apply, or choose "See All"
                    </p>
                    <div style={{ display: 'grid', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
                      {[
                        { value: 'BAYSIDE', icon: '🌊' },
                        { value: 'HILLS & RANGES', icon: '⛰️' },
                        { value: 'INNER METRO', icon: '🏙️' },
                        { value: 'OUTER GROWTH', icon: '🏘️' }
                      ].map((option) => {
                        const isSelected = onboardingData.geographicCategories.includes(option.value)
                        return (
                          <div
                            key={option.value}
                            onClick={() => toggleGeographicCategory(option.value)}
                            style={{
                              padding: 'var(--space-4)',
                              border: `2px solid ${isSelected ? 'var(--orange-primary)' : 'var(--glass-border)'}`,
                              borderRadius: 'var(--radius-md)',
                              cursor: 'pointer',
                              transition: 'all 0.3s',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 'var(--space-3)',
                              background: isSelected ? 'var(--orange-subtle)' : 'var(--bg-tertiary)'
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleGeographicCategory(option.value)}
                              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                            />
                            <label style={{ cursor: 'pointer', flex: 1, fontSize: '1rem' }}>
                              {option.icon} {option.value}
                            </label>
                          </div>
                        )
                      })}
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <button
                        className="btn btn-secondary"
                        onClick={selectAllGeographic}
                        style={{ width: '100%' }}
                      >
                        I want to see all
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 6: Review */}
                {onboardingStep === 6 && (
                  <div>
                    <h3 style={{ color: 'var(--orange-primary)', marginBottom: 'var(--space-4)', fontSize: '1.5rem' }}>
                      Review your preferences
                    </h3>
                    <div style={{
                      background: 'var(--bg-tertiary)',
                      padding: 'var(--space-6)',
                      borderRadius: 'var(--radius-md)',
                      marginBottom: 'var(--space-6)'
                    }}>
                      <div style={{ marginBottom: 'var(--space-4)' }}>
                        <strong>Primary Goal:</strong> {onboardingData.primaryGoal || 'Not selected'}
                      </div>
                      <div style={{ marginBottom: 'var(--space-4)' }}>
                        <strong>Budget Range:</strong> ${onboardingData.budgetMin.toLocaleString()} - ${onboardingData.budgetMax.toLocaleString()}
                      </div>
                      <div style={{ marginBottom: 'var(--space-4)' }}>
                        <strong>Family Status:</strong> {onboardingData.familyStatus || 'Not selected'}
                      </div>
                      <div style={{ marginBottom: 'var(--space-4)' }}>
                        <strong>Safety Priority:</strong> {onboardingData.safetyPriority}/10
                      </div>
                      <div>
                        <strong>Geographic Areas:</strong>{' '}
                        {onboardingData.geographicCategories.length > 0
                          ? onboardingData.geographicCategories.join(', ')
                          : 'All areas'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-4)' }}>
                <button 
                  className="btn btn-secondary"
                  onClick={skipOnboarding}
                >
                  Skip
                </button>
                <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                  {onboardingStep > 1 && (
                    <button 
                      className="btn btn-secondary"
                      onClick={previousStep}
                    >
                      Back
                    </button>
                  )}
                  <button 
                    className="btn btn-primary"
                    onClick={nextStep}
                  >
                    {onboardingStep === 6 ? 'Complete' : 'Next'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default Members
