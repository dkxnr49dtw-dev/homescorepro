import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <section id="hero" className="hero">
        <div className="hero-container">
          <motion.div
            className="hero-badge"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            ✨ Melbourne's Property Intelligence Platform
          </motion.div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Data-Driven <span className="hero-gradient">Property Decisions</span>
          </motion.h1>
          <motion.p
            className="hero-subtitle"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Sophisticated analysis across 397 Melbourne suburbs using 38+ data points. Make confident property decisions backed by real insights.
          </motion.p>
          <motion.div
            className="cta-group"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Link to="/calculator" className="btn btn-primary">
              Start Free Analysis →
            </Link>
            <Link to="/pricing" className="btn btn-secondary">
              View Pricing
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="features">
        <div className="features-container">
          <div className="section-header">
            <h2 className="section-title">Powerful Property Intelligence</h2>
            <p className="section-subtitle">Everything you need to make smarter property decisions</p>
          </div>
          
          <div className="features-grid">
            <motion.div 
              className="feature-card"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="feature-icon">📊</div>
              <h3 className="feature-title">Dual Scoring System</h3>
              <p className="feature-description">A-Score for suburb analysis (15 metrics) and B-Score for comprehensive property evaluation (38+ data points).</p>
            </motion.div>
            
            <motion.div 
              className="feature-card"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="feature-icon">🎯</div>
              <h3 className="feature-title">Smart Search</h3>
              <p className="feature-description">Auto-detects suburbs, postcodes, or addresses. Get instant insights on any Melbourne property.</p>
            </motion.div>
            
            <motion.div 
              className="feature-card"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div className="feature-icon">📈</div>
              <h3 className="feature-title">Detailed Breakdowns</h3>
              <p className="feature-description">Visual analysis of location, schools, safety, transport, amenities, and growth potential.</p>
            </motion.div>
            
            <motion.div 
              className="feature-card"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="feature-icon">🏆</div>
              <h3 className="feature-title">Letter Grades</h3>
              <p className="feature-description">Clear A+ to C- ratings with percentile rankings against all Melbourne properties.</p>
            </motion.div>
            
            <motion.div 
              className="feature-card"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <div className="feature-icon">💡</div>
              <h3 className="feature-title">Expert Insights</h3>
              <p className="feature-description">Contextual recommendations based on your lifestyle, budget, and investment goals.</p>
            </motion.div>
            
            <motion.div 
              className="feature-card"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.0 }}
            >
              <div className="feature-icon">🔒</div>
              <h3 className="feature-title">100% Transparent</h3>
              <p className="feature-description">Every score explained. No black boxes. Full visibility into how properties are evaluated.</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-box">
          <motion.h2 
            className="section-title"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            Ready to Find Your Perfect Property?
          </motion.h2>
          <motion.p 
            className="section-subtitle" 
            style={{ marginBottom: '2rem' }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            Start with 3 free searches. Upgrade anytime for unlimited access.
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.3 }}
          >
            <Link to="/calculator" className="btn btn-primary">
              Get Started Free →
            </Link>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}

export default Home

