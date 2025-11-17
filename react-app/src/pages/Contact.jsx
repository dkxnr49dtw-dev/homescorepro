import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Message sent! We\'ll get back to you within 24 hours.')
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="contact-hero" style={{ marginTop: '80px', padding: '6rem 1.5rem 4rem', textAlign: 'center' }}>
        <h1 className="hero-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, marginBottom: '1rem' }}>Get in Touch</h1>
        <p className="hero-subtitle" style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          Have questions? We're here to help you make confident property decisions.
        </p>
      </div>

      <div className="contact-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem 6rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
        <form className="contact-form" onSubmit={handleSubmit} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-2xl)', padding: '3rem' }}>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Name</label>
            <input
              type="text"
              name="name"
              className="form-input"
              required
              placeholder="Your full name"
              value={formData.name}
              onChange={handleChange}
              style={{ width: '100%', padding: '1rem 1.25rem', background: 'var(--bg-tertiary)', border: '2px solid var(--dark-700)', borderRadius: 'var(--radius-lg)', color: 'var(--text-primary)', fontFamily: 'inherit', fontSize: '1rem', transition: 'all var(--transition-base)' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</label>
            <input
              type="email"
              name="email"
              className="form-input"
              required
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              style={{ width: '100%', padding: '1rem 1.25rem', background: 'var(--bg-tertiary)', border: '2px solid var(--dark-700)', borderRadius: 'var(--radius-lg)', color: 'var(--text-primary)', fontFamily: 'inherit', fontSize: '1rem', transition: 'all var(--transition-base)' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Subject</label>
            <select
              name="subject"
              className="form-input"
              required
              value={formData.subject}
              onChange={handleChange}
              style={{ width: '100%', padding: '1rem 1.25rem', background: 'var(--bg-tertiary)', border: '2px solid var(--dark-700)', borderRadius: 'var(--radius-lg)', color: 'var(--text-primary)', fontFamily: 'inherit', fontSize: '1rem', transition: 'all var(--transition-base)', WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none' }}
            >
              <option value="">Select a subject...</option>
              <option value="general">General Inquiry</option>
              <option value="support">Technical Support</option>
              <option value="billing">Billing Question</option>
              <option value="partnership">Partnership Inquiry</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Message</label>
            <textarea
              name="message"
              className="form-textarea"
              required
              placeholder="Tell us more about your inquiry..."
              value={formData.message}
              onChange={handleChange}
              style={{ width: '100%', padding: '1rem 1.25rem', background: 'var(--bg-tertiary)', border: '2px solid var(--dark-700)', borderRadius: 'var(--radius-lg)', color: 'var(--text-primary)', fontFamily: 'inherit', fontSize: '1rem', transition: 'all var(--transition-base)', resize: 'vertical', minHeight: '150px' }}
            />
          </div>

          <button type="submit" className="form-submit" style={{ width: '100%', padding: '1rem', background: 'linear-gradient(135deg, var(--orange-light), var(--orange-primary))', color: 'var(--dark-900)', border: 'none', borderRadius: 'var(--radius-lg)', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', transition: 'all var(--transition-base)' }}>
            Send Message →
          </button>
        </form>

        <div className="contact-info" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="info-card" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-xl)', padding: '2rem' }}>
            <div className="info-icon" style={{ width: '56px', height: '56px', background: 'var(--orange-subtle)', borderRadius: 'var(--radius-xl)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', marginBottom: '1rem' }}>📧</div>
            <div className="info-title" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Email</div>
            <div className="info-text" style={{ color: 'var(--text-secondary)' }}>support@homescorepro.com.au</div>
          </div>

          <div className="info-card" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-xl)', padding: '2rem' }}>
            <div className="info-icon" style={{ width: '56px', height: '56px', background: 'var(--orange-subtle)', borderRadius: 'var(--radius-xl)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', marginBottom: '1rem' }}>💬</div>
            <div className="info-title" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Response Time</div>
            <div className="info-text" style={{ color: 'var(--text-secondary)' }}>We typically respond within 24 hours on business days</div>
          </div>

          <div className="info-card" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-xl)', padding: '2rem' }}>
            <div className="info-icon" style={{ width: '56px', height: '56px', background: 'var(--orange-subtle)', borderRadius: 'var(--radius-xl)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', marginBottom: '1rem' }}>📍</div>
            <div className="info-title" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Location</div>
            <div className="info-text" style={{ color: 'var(--text-secondary)' }}>Melbourne, Victoria, Australia</div>
          </div>

          <div className="info-card" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-xl)', padding: '2rem' }}>
            <div className="info-icon" style={{ width: '56px', height: '56px', background: 'var(--orange-subtle)', borderRadius: 'var(--radius-xl)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', marginBottom: '1rem' }}>🏢</div>
            <div className="info-title" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Enterprise Inquiries</div>
            <div className="info-text" style={{ color: 'var(--text-secondary)' }}>For API access, bulk analysis, or custom solutions, mention "Enterprise" in your subject</div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="faq-section" style={{ maxWidth: '800px', margin: '4rem auto 0', padding: '0 1.5rem 6rem' }}>
        <h2 className="faq-title" style={{ fontSize: '2.5rem', fontWeight: 900, textAlign: 'center', marginBottom: '3rem', color: 'var(--text-primary)' }}>Frequently Asked Questions</h2>
        
        <div className="faq-item" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-xl)', padding: '1.5rem', marginBottom: '1rem' }}>
          <div className="faq-question" style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>How does HomeScorePro calculate scores?</div>
          <div className="faq-answer" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            HomeScorePro uses 38+ data points for A-Scores (suburb analysis) and 23+ data points for B-Scores (property analysis). 
            All calculations are transparent and based on verified data from ABS, Victoria Police, and other trusted public data sources. 
            See our <Link to="/about" style={{ color: 'var(--orange-light)', textDecoration: 'none' }}>About page</Link> for more details.
          </div>
        </div>
        
        <div className="faq-item" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-xl)', padding: '1.5rem', marginBottom: '1rem' }}>
          <div className="faq-question" style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>Is my data secure?</div>
          <div className="faq-answer" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Yes. We take privacy seriously. Property evaluations are stored locally in your browser (localStorage) with your permission. 
            For paid users, data can be stored securely on our servers. See our <Link to="/privacy" style={{ color: 'var(--orange-light)', textDecoration: 'none' }}>Privacy Policy</Link> for details.
          </div>
        </div>
        
        <div className="faq-item" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-xl)', padding: '1.5rem', marginBottom: '1rem' }}>
          <div className="faq-question" style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>Can I cancel my subscription?</div>
          <div className="faq-answer" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Yes, you can cancel your subscription at any time. See our <Link to="/terms" style={{ color: 'var(--orange-light)', textDecoration: 'none' }}>Terms of Service</Link> for details.
          </div>
        </div>
        
        <div className="faq-item" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-xl)', padding: '1.5rem', marginBottom: '1rem' }}>
          <div className="faq-question" style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>Do you offer refunds?</div>
          <div className="faq-answer" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            We offer a 30-day money-back guarantee for new subscriptions. See our <Link to="/terms" style={{ color: 'var(--orange-light)', textDecoration: 'none' }}>Terms of Service</Link> for details.
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Contact
