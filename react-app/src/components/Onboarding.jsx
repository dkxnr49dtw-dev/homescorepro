import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import '../styles/onboarding.css'

function Onboarding({ isOpen, onComplete, onSkip, userPreferences, onSavePreferences }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [onboardingData, setOnboardingData] = useState({
    primaryGoal: userPreferences?.primaryGoal || '',
    budgetMin: userPreferences?.budgetMin || 500000,
    budgetMax: userPreferences?.budgetMax || 750000,
    familyStatus: userPreferences?.familyStatus || '',
    safetyPriority: userPreferences?.safetyPriority || 8,
    geographicCategories: userPreferences?.geographicCategories || []
  })

  const totalSteps = 6

  const impactExplanations = {
    1: {
      title: "How this affects your experience:",
      items: [
        { label: "Scoring:", text: "Investment = focuses on growth/yield (45%), Lifestyle = focuses on amenities (30%)" },
        { label: "What You See:", text: "Scores change based on your choice" },
        { label: "Data:", text: "All suburbs shown, but ranked differently" },
        { label: "How It Works:", text: "Your choice changes which factors matter most" }
      ]
    },
    2: {
      title: "How this affects your experience:",
      items: [
        { label: "Scoring:", text: "Budget picks strategy automatically (Investment/Balanced/Lifestyle)" },
        { label: "What You See:", text: "Properties matched to your budget get better scores" },
        { label: "Data:", text: "All suburbs shown, affordable ones score higher" },
        { label: "How It Works:", text: "System compares property prices to your budget range" }
      ]
    },
    3: {
      title: "How this affects your experience:",
      items: [
        { label: "Scoring:", text: "Saved for future use" },
        { label: "What You See:", text: "No change right now" },
        { label: "Data:", text: "All suburbs shown" },
        { label: "How It Works:", text: "Will help prioritize schools and childcare later" }
      ]
    },
    4: {
      title: "How this affects your experience:",
      items: [
        { label: "Scoring:", text: "Saved for future use" },
        { label: "What You See:", text: "No change right now" },
        { label: "Data:", text: "All suburbs shown" },
        { label: "How It Works:", text: "Will help prioritize safer areas later" }
      ]
    },
    5: {
      title: "How this affects your experience:",
      items: [
        { label: "Scoring:", text: "Doesn't change scores" },
        { label: "What You See:", text: "Only shows suburbs in selected areas" },
        { label: "Data:", text: "Filters to your chosen areas (Bayside, Hills, Inner Metro, Outer Growth)" },
        { label: "How It Works:", text: "Hides suburbs outside your selected areas" }
      ]
    }
  }

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
    if (currentStep === 1 && !onboardingData.primaryGoal) {
      alert('Please select your primary goal')
      return false
    }
    if (currentStep === 3 && !onboardingData.familyStatus) {
      alert('Please select your family situation')
      return false
    }
    return true
  }

  const nextStep = () => {
    if (!validateStep()) return
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      completeOnboarding()
    }
  }

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
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
    if (onSavePreferences) {
      onSavePreferences(preferences)
    }
    localStorage.setItem('homescorepro_onboarding_complete', 'true')
    if (onComplete) {
      onComplete(preferences)
    }
  }

  const skipOnboarding = () => {
    completeOnboarding()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="onboarding-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="onboarding-container"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          <div className="onboarding-header">
            <h2>Welcome to HomeScorePro</h2>
            <p>Let's personalize your experience</p>
            <div className="onboarding-progress">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i + 1}
                  className={`onboarding-progress-dot ${i + 1 <= currentStep ? 'active' : ''}`}
                />
              ))}
            </div>
          </div>

          <div className="onboarding-content">
            {/* Step 1: Primary Goal */}
            {currentStep === 1 && (
              <div className="onboarding-step">
                <h3>What's your primary goal?</h3>
                <p>This helps us tailor the scoring to your needs</p>
                {impactExplanations[1] && (
                  <div className="onboarding-impact-info">
                    <strong>{impactExplanations[1].title}</strong>
                    <ul>
                      {impactExplanations[1].items.map((item, idx) => (
                        <li key={idx}>
                          <strong>{item.label}</strong> {item.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="onboarding-options">
                  {[
                    { value: 'Investment', icon: '💰', title: 'Investment Focus', desc: 'Maximize growth and rental yield' },
                    { value: 'Balanced', icon: '⚖️', title: 'Balanced', desc: 'Equal focus on investment and lifestyle' },
                    { value: 'Lifestyle', icon: '🏖️', title: 'Lifestyle Focus', desc: 'Prioritize amenities and quality of life' }
                  ].map((option) => (
                    <div
                      key={option.value}
                      className={`onboarding-option ${onboardingData.primaryGoal === option.value ? 'selected' : ''}`}
                      onClick={() => selectOption('primaryGoal', option.value)}
                    >
                      <h4>{option.icon} {option.title}</h4>
                      <p>{option.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Budget Range */}
            {currentStep === 2 && (
              <div className="onboarding-step">
                <h3>What's your budget range?</h3>
                <p>This determines which suburbs match your strategy</p>
                {impactExplanations[2] && (
                  <div className="onboarding-impact-info">
                    <strong>{impactExplanations[2].title}</strong>
                    <ul>
                      {impactExplanations[2].items.map((item, idx) => (
                        <li key={idx}>
                          <strong>{item.label}</strong> {item.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="onboarding-input-group">
                  <label>Minimum Budget ($)</label>
                  <input
                    type="number"
                    value={onboardingData.budgetMin}
                    min="100000"
                    max="5000000"
                    step="10000"
                    onChange={(e) => selectOption('budgetMin', parseInt(e.target.value))}
                  />
                </div>
                <div className="onboarding-input-group">
                  <label>Maximum Budget ($)</label>
                  <input
                    type="number"
                    value={onboardingData.budgetMax}
                    min="100000"
                    max="5000000"
                    step="10000"
                    onChange={(e) => selectOption('budgetMax', parseInt(e.target.value))}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Family Status */}
            {currentStep === 3 && (
              <div className="onboarding-step">
                <h3>What's your family situation?</h3>
                <p>This helps prioritize relevant amenities</p>
                {impactExplanations[3] && (
                  <div className="onboarding-impact-info">
                    <strong>{impactExplanations[3].title}</strong>
                    <ul>
                      {impactExplanations[3].items.map((item, idx) => (
                        <li key={idx}>
                          <strong>{item.label}</strong> {item.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="onboarding-options">
                  {[
                    { value: 'Single', icon: '👤' },
                    { value: 'Couple', icon: '👫' },
                    { value: 'Family', icon: '👨‍👩‍👧‍👦', title: 'Family with Children' },
                    { value: 'Empty Nesters', icon: '👴👵' }
                  ].map((option) => (
                    <div
                      key={option.value}
                      className={`onboarding-option ${onboardingData.familyStatus === option.value ? 'selected' : ''}`}
                      onClick={() => selectOption('familyStatus', option.value)}
                    >
                      <h4>{option.icon} {option.title || option.value}</h4>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Safety Priority */}
            {currentStep === 4 && (
              <div className="onboarding-step">
                <h3>How important is safety to you?</h3>
                <p>Rate from 1 (not important) to 10 (very important)</p>
                {impactExplanations[4] && (
                  <div className="onboarding-impact-info">
                    <strong>{impactExplanations[4].title}</strong>
                    <ul>
                      {impactExplanations[4].items.map((item, idx) => (
                        <li key={idx}>
                          <strong>{item.label}</strong> {item.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="onboarding-input-group">
                  <label>Safety Priority (1-10)</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={onboardingData.safetyPriority}
                    onChange={(e) => selectOption('safetyPriority', parseInt(e.target.value))}
                  />
                  <div style={{ textAlign: 'center', marginTop: 'var(--space-sm)' }}>
                    <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--orange-primary)' }}>
                      {onboardingData.safetyPriority}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Geographic Categories */}
            {currentStep === 5 && (
              <div className="onboarding-step">
                <h3>Which areas interest you?</h3>
                <p>Select all that apply, or choose "See All"</p>
                {impactExplanations[5] && (
                  <div className="onboarding-impact-info">
                    <strong>{impactExplanations[5].title}</strong>
                    <ul>
                      {impactExplanations[5].items.map((item, idx) => (
                        <li key={idx}>
                          <strong>{item.label}</strong> {item.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="onboarding-checkbox-group">
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
                        className={`onboarding-checkbox ${isSelected ? 'selected' : ''}`}
                        onClick={() => toggleGeographicCategory(option.value)}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleGeographicCategory(option.value)}
                        />
                        <label>{option.icon} {option.value}</label>
                      </div>
                    )
                  })}
                </div>
                <div style={{ textAlign: 'center', marginTop: 'var(--space-lg)' }}>
                  <button className="onboarding-btn onboarding-btn-secondary" onClick={selectAllGeographic}>
                    I want to see all
                  </button>
                </div>
              </div>
            )}

            {/* Step 6: Review */}
            {currentStep === 6 && (
              <div className="onboarding-step">
                <h3>Review your preferences</h3>
                <div className="onboarding-review">
                  <div><strong>Primary Goal:</strong> {onboardingData.primaryGoal || 'Not selected'}</div>
                  <div><strong>Budget Range:</strong> ${onboardingData.budgetMin.toLocaleString()} - ${onboardingData.budgetMax.toLocaleString()}</div>
                  <div><strong>Family Status:</strong> {onboardingData.familyStatus || 'Not selected'}</div>
                  <div><strong>Safety Priority:</strong> {onboardingData.safetyPriority}/10</div>
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

          <div className="onboarding-actions">
            <button className="onboarding-btn onboarding-btn-secondary" onClick={skipOnboarding}>
              Skip
            </button>
            <div>
              {currentStep > 1 && (
                <button className="onboarding-btn onboarding-btn-secondary" onClick={previousStep}>
                  Back
                </button>
              )}
              <button className="onboarding-btn onboarding-btn-primary" onClick={nextStep}>
                {currentStep === totalSteps ? 'Complete' : 'Next'}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default Onboarding

