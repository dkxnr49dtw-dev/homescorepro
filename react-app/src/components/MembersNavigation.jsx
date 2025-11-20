import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function MembersNavigation({ onResetOnboarding }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
    if (!mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        toggleMobileMenu()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [mobileMenuOpen])

  const handleResetOnboarding = () => {
    if (window.confirm('Are you sure you want to reset your onboarding preferences? This will clear your saved choices and restart the questionnaire.')) {
      localStorage.removeItem('homescorepro_preferences')
      localStorage.removeItem('homescorepro_onboarding_complete')
      if (onResetOnboarding) {
        onResetOnboarding()
      }
      alert('Onboarding preferences have been reset.')
    }
  }

  return (
    <motion.nav 
      className="nav" 
      id="mainNav"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          HomeScorePro
        </Link>
        
        <ul className="nav-links">
          <li><Link to="/members#location-scout" className="nav-link">Suburb Scout</Link></li>
          <li><Link to="/members#calculator" className="nav-link">Property Evaluator</Link></li>
          <li><Link to="/members#my-properties" className="nav-link">My Properties</Link></li>
          <li><Link to="/members#settings" className="nav-link">Settings</Link></li>
        </ul>
        
        <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
          <button 
            onClick={handleResetOnboarding} 
            className="nav-cta" 
            style={{
              background: 'var(--orange-light)',
              color: 'var(--white)',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem',
              padding: 'var(--space-xs) var(--space-md)'
            }}
          >
            Reset Onboarding
          </button>
          <Link to="/" className="nav-cta" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>
            Back to Home
          </Link>
        </div>
        
        <button 
          className={`nav-mobile-toggle ${mobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="nav-mobile-menu"
            id="mobileMenu"
            initial={{ right: '-100%' }}
            animate={{ right: 0 }}
            exit={{ right: '-100%' }}
            transition={{ duration: 0.3 }}
            aria-hidden={!mobileMenuOpen}
          >
            <ul className="nav-mobile-links">
              <li>
                <Link
                  to="/members#location-scout"
                  className="nav-mobile-link"
                  onClick={toggleMobileMenu}
                >
                  Suburb Scout
                </Link>
              </li>
              <li>
                <Link
                  to="/members#calculator"
                  className="nav-mobile-link"
                  onClick={toggleMobileMenu}
                >
                  Property Evaluator
                </Link>
              </li>
              <li>
                <Link
                  to="/members#my-properties"
                  className="nav-mobile-link"
                  onClick={toggleMobileMenu}
                >
                  My Properties
                </Link>
              </li>
              <li>
                <Link
                  to="/members#settings"
                  className="nav-mobile-link"
                  onClick={toggleMobileMenu}
                >
                  Settings
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    handleResetOnboarding()
                    toggleMobileMenu()
                  }}
                  className="nav-mobile-link"
                  style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}
                >
                  Reset Onboarding
                </button>
              </li>
              <li>
                <Link
                  to="/"
                  className="nav-mobile-link"
                  onClick={toggleMobileMenu}
                >
                  Back to Home
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default MembersNavigation

