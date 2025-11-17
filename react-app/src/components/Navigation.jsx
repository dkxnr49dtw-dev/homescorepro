import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/calculator', label: 'Calculator' },
    { path: '/pricing', label: 'Pricing' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ]

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
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
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link 
                to={link.path} 
                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        
        <Link to="/members" className="nav-cta">
          Sign In
        </Link>
        
        <button 
          className="nav-mobile-toggle" 
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem'
          }}
        >
          <span style={{ 
            display: 'block', 
            width: '24px', 
            height: '2px', 
            background: 'var(--text-primary)',
            transition: 'all 0.3s ease'
          }}></span>
          <span style={{ 
            display: 'block', 
            width: '24px', 
            height: '2px', 
            background: 'var(--text-primary)',
            transition: 'all 0.3s ease'
          }}></span>
          <span style={{ 
            display: 'block', 
            width: '24px', 
            height: '2px', 
            background: 'var(--text-primary)',
            transition: 'all 0.3s ease'
          }}></span>
        </button>
      </div>
      
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="nav-mobile-menu"
            initial={{ opacity: 0, maxHeight: 0 }}
            animate={{ opacity: 1, maxHeight: 500 }}
            exit={{ opacity: 0, maxHeight: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="nav-mobile-link"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/members"
                  className="nav-mobile-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navigation

