import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

function Pricing() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="pricing-hero" style={{ marginTop: '80px', padding: '6rem 1.5rem 4rem', textAlign: 'center' }}>
        <h1 className="hero-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, marginBottom: '1rem' }}>
          Simple, <span className="hero-gradient">Transparent</span> Pricing
        </h1>
        <p className="hero-subtitle" style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          Choose the plan that fits your property search journey
        </p>
      </div>

      <div className="pricing-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem 6rem' }}>
        <div className="pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
          {/* Free Plan */}
          <div className="pricing-card" style={{ background: 'var(--bg-secondary)', border: '2px solid var(--glass-border)', borderRadius: 'var(--radius-2xl)', padding: '2.5rem', transition: 'all var(--transition-base)' }}>
            <div className="plan-name" style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Explorer</div>
            <div className="plan-description" style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9375rem' }}>Perfect for getting started with suburb research</div>
            <div className="plan-price" style={{ fontSize: '3rem', fontWeight: 900, background: 'linear-gradient(135deg, var(--orange-light), var(--orange-primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>$0</div>
            <div className="plan-price-period" style={{ color: 'var(--text-tertiary)', fontSize: '1rem', fontWeight: 600 }}>Forever free</div>
            <Link to="/calculator" className="plan-cta secondary" style={{ width: '100%', padding: '1rem', margin: '1.5rem 0', background: 'var(--bg-tertiary)', color: 'var(--orange-light)', border: '2px solid var(--glass-border)', borderRadius: 'var(--radius-lg)', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', textDecoration: 'none', display: 'block', textAlign: 'center' }}>
              Get Started Free
            </Link>
            <ul className="plan-features" style={{ listStyle: 'none', padding: '1.5rem 0 0', borderTop: '1px solid var(--glass-border)' }}>
              <li className="plan-feature" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.75rem 0', color: 'var(--text-secondary)' }}>
                <span className="feature-icon" style={{ color: 'var(--orange-light)', fontSize: '1.25rem', flexShrink: 0 }}>✓</span>
                <span><strong>Unlimited A-Score calculations</strong> (suburb analysis)</span>
              </li>
              <li className="plan-feature" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.75rem 0', color: 'var(--text-secondary)' }}>
                <span className="feature-icon" style={{ color: 'var(--orange-light)', fontSize: '1.25rem', flexShrink: 0 }}>✓</span>
                <span>Access to 399 Melbourne suburbs</span>
              </li>
              <li className="plan-feature" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.75rem 0', color: 'var(--text-secondary)' }}>
                <span className="feature-icon" style={{ color: 'var(--orange-light)', fontSize: '1.25rem', flexShrink: 0 }}>✓</span>
                <span>Basic scoring breakdown (4 tiers)</span>
              </li>
              <li className="plan-feature" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.75rem 0', color: 'var(--text-secondary)' }}>
                <span className="feature-icon" style={{ color: 'var(--orange-light)', fontSize: '1.25rem', flexShrink: 0 }}>✓</span>
                <span>Compare up to 3 suburbs</span>
              </li>
              <li className="plan-feature" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.75rem 0', color: 'var(--text-tertiary)' }}>
                <span className="feature-icon" style={{ color: 'var(--text-tertiary)', fontSize: '1.25rem', flexShrink: 0 }}>○</span>
                <span>B-Score calculations (blurred)</span>
              </li>
              <li className="plan-feature" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.75rem 0', color: 'var(--text-tertiary)' }}>
                <span className="feature-icon" style={{ color: 'var(--text-tertiary)', fontSize: '1.25rem', flexShrink: 0 }}>○</span>
                <span>Detailed 38-point analysis (blurred)</span>
              </li>
              <li className="plan-feature" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.75rem 0', color: 'var(--text-tertiary)' }}>
                <span className="feature-icon" style={{ color: 'var(--text-tertiary)', fontSize: '1.25rem', flexShrink: 0 }}>○</span>
                <span>Save & track properties</span>
              </li>
            </ul>
          </div>

          {/* Pro Plan */}
          <div className="pricing-card featured" style={{ background: 'var(--bg-secondary)', border: '2px solid var(--orange-primary)', borderRadius: 'var(--radius-2xl)', padding: '2.5rem', transition: 'all var(--transition-base)', position: 'relative', boxShadow: '0 0 0 1px var(--orange-subtle), var(--shadow-lg)' }}>
            <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, var(--orange-light), var(--orange-primary))', color: 'var(--dark-900)', padding: '0.5rem 1.5rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em' }}>MOST POPULAR</div>
            <div className="plan-name" style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Pro Buyer</div>
            <div className="plan-description" style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9375rem' }}>For serious buyers making informed decisions</div>
            <div className="plan-price" style={{ fontSize: '3rem', fontWeight: 900, background: 'linear-gradient(135deg, var(--orange-light), var(--orange-primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>$29</div>
            <div className="plan-price-period" style={{ color: 'var(--text-tertiary)', fontSize: '1rem', fontWeight: 600 }}>/month</div>
            <Link to="/members" className="plan-cta" style={{ width: '100%', padding: '1rem', margin: '1.5rem 0', background: 'linear-gradient(135deg, var(--orange-light), var(--orange-primary))', color: 'var(--dark-900)', border: 'none', borderRadius: 'var(--radius-lg)', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', textDecoration: 'none', display: 'block', textAlign: 'center' }}>
              Start Free Trial
            </Link>
            <ul className="plan-features" style={{ listStyle: 'none', padding: '1.5rem 0 0', borderTop: '1px solid var(--glass-border)' }}>
              <li className="plan-feature" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.75rem 0', color: 'var(--text-secondary)' }}>
                <span className="feature-icon" style={{ color: 'var(--orange-light)', fontSize: '1.25rem', flexShrink: 0 }}>✓</span>
                <span><strong>Everything in Explorer</strong></span>
              </li>
              <li className="plan-feature" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.75rem 0', color: 'var(--text-secondary)' }}>
                <span className="feature-icon" style={{ color: 'var(--orange-light)', fontSize: '1.25rem', flexShrink: 0 }}>✓</span>
                <span><strong>Unlimited B-Score calculations</strong> (property analysis)</span>
              </li>
              <li className="plan-feature" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.75rem 0', color: 'var(--text-secondary)' }}>
                <span className="feature-icon" style={{ color: 'var(--orange-light)', fontSize: '1.25rem', flexShrink: 0 }}>✓</span>
                <span><strong>Full 38-point detailed breakdown</strong></span>
              </li>
              <li className="plan-feature" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.75rem 0', color: 'var(--text-secondary)' }}>
                <span className="feature-icon" style={{ color: 'var(--orange-light)', fontSize: '1.25rem', flexShrink: 0 }}>✓</span>
                <span>Save unlimited properties locally</span>
              </li>
              <li className="plan-feature" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.75rem 0', color: 'var(--text-secondary)' }}>
                <span className="feature-icon" style={{ color: 'var(--orange-light)', fontSize: '1.25rem', flexShrink: 0 }}>✓</span>
                <span>Side-by-side property comparison</span>
              </li>
              <li className="plan-feature" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.75rem 0', color: 'var(--text-secondary)' }}>
                <span className="feature-icon" style={{ color: 'var(--orange-light)', fontSize: '1.25rem', flexShrink: 0 }}>✓</span>
                <span>Export reports (JSON)</span>
              </li>
              <li className="plan-feature" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.75rem 0', color: 'var(--text-secondary)' }}>
                <span className="feature-icon" style={{ color: 'var(--orange-light)', fontSize: '1.25rem', flexShrink: 0 }}>✓</span>
                <span>Priority email support</span>
              </li>
              <li className="plan-feature" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.75rem 0', color: 'var(--text-secondary)' }}>
                <span className="feature-icon" style={{ color: 'var(--orange-light)', fontSize: '1.25rem', flexShrink: 0 }}>✓</span>
                <span>14-day free trial</span>
              </li>
            </ul>
          </div>

          {/* Premium Plan */}
          <div className="pricing-card" style={{ background: 'var(--bg-secondary)', border: '2px solid var(--glass-border)', borderRadius: 'var(--radius-2xl)', padding: '2.5rem', transition: 'all var(--transition-base)' }}>
            <div className="plan-name" style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Investor Pro</div>
            <div className="plan-description" style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9375rem' }}>For investors & professionals managing portfolios</div>
            <div className="plan-price" style={{ fontSize: '3rem', fontWeight: 900, background: 'linear-gradient(135deg, var(--orange-light), var(--orange-primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>$79</div>
            <div className="plan-price-period" style={{ color: 'var(--text-tertiary)', fontSize: '1rem', fontWeight: 600 }}>/month</div>
            <Link to="/contact" className="plan-cta secondary" style={{ width: '100%', padding: '1rem', margin: '1.5rem 0', background: 'var(--bg-tertiary)', color: 'var(--orange-light)', border: '2px solid var(--glass-border)', borderRadius: 'var(--radius-lg)', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', textDecoration: 'none', display: 'block', textAlign: 'center' }}>
              Contact Sales
            </Link>
            <ul className="plan-features" style={{ listStyle: 'none', padding: '1.5rem 0 0', borderTop: '1px solid var(--glass-border)' }}>
              <li className="plan-feature" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.75rem 0', color: 'var(--text-secondary)' }}>
                <span className="feature-icon" style={{ color: 'var(--orange-light)', fontSize: '1.25rem', flexShrink: 0 }}>✓</span>
                <span><strong>Everything in Pro Buyer</strong></span>
              </li>
              <li className="plan-feature" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.75rem 0', color: 'var(--text-secondary)' }}>
                <span className="feature-icon" style={{ color: 'var(--orange-light)', fontSize: '1.25rem', flexShrink: 0 }}>✓</span>
                <span><strong>Advanced analytics & trends</strong></span>
              </li>
              <li className="plan-feature" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.75rem 0', color: 'var(--text-secondary)' }}>
                <span className="feature-icon" style={{ color: 'var(--orange-light)', fontSize: '1.25rem', flexShrink: 0 }}>✓</span>
                <span>Historical data access (5+ years)</span>
              </li>
              <li className="plan-feature" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.75rem 0', color: 'var(--text-secondary)' }}>
                <span className="feature-icon" style={{ color: 'var(--orange-light)', fontSize: '1.25rem', flexShrink: 0 }}>✓</span>
                <span>API access for automation</span>
              </li>
              <li className="plan-feature" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.75rem 0', color: 'var(--text-secondary)' }}>
                <span className="feature-icon" style={{ color: 'var(--orange-light)', fontSize: '1.25rem', flexShrink: 0 }}>✓</span>
                <span>White-label reports for clients</span>
              </li>
              <li className="plan-feature" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.75rem 0', color: 'var(--text-secondary)' }}>
                <span className="feature-icon" style={{ color: 'var(--orange-light)', fontSize: '1.25rem', flexShrink: 0 }}>✓</span>
                <span>Portfolio tracking (up to 50 properties)</span>
              </li>
              <li className="plan-feature" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.75rem 0', color: 'var(--text-secondary)' }}>
                <span className="feature-icon" style={{ color: 'var(--orange-light)', fontSize: '1.25rem', flexShrink: 0 }}>✓</span>
                <span>Custom scoring weights</span>
              </li>
              <li className="plan-feature" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.75rem 0', color: 'var(--text-secondary)' }}>
                <span className="feature-icon" style={{ color: 'var(--orange-light)', fontSize: '1.25rem', flexShrink: 0 }}>✓</span>
                <span>Priority phone & chat support</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Guarantee Section */}
        <div style={{ background: 'linear-gradient(135deg, var(--bg-tertiary), var(--bg-secondary))', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-2xl)', padding: '4rem 2rem', textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem', color: 'var(--text-primary)' }}>🔒 100% Money-Back Guarantee</h2>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto' }}>
            Try HomeScorePro Pro risk-free for 14 days. If you're not completely satisfied, 
            we'll refund your money—no questions asked.
          </p>
        </div>

        {/* FAQ Section */}
        <div className="faq-section" style={{ maxWidth: '800px', margin: '0 auto 6rem', padding: '0 1.5rem' }}>
          <h2 className="faq-title" style={{ fontSize: '2.5rem', fontWeight: 900, textAlign: 'center', marginBottom: '3rem' }}>Frequently Asked Questions</h2>
          
          <div className="faq-item" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-xl)', padding: '1.5rem', marginBottom: '1rem' }}>
            <div className="faq-question" style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem' }}>Can I start with the free plan and upgrade later?</div>
            <div className="faq-answer" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              Absolutely! Start with our free Explorer plan and upgrade to Pro anytime. 
              Your saved data stays with you, and you'll instantly unlock all Pro features.
            </div>
          </div>
          
          <div className="faq-item" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-xl)', padding: '1.5rem', marginBottom: '1rem' }}>
            <div className="faq-question" style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem' }}>What's included in the 14-day free trial?</div>
            <div className="faq-answer" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              Full access to all Pro Buyer features—unlimited B-Scores, detailed breakdowns, 
              property saving, comparisons, and exports. No credit card required to start.
            </div>
          </div>
          
          <div className="faq-item" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-xl)', padding: '1.5rem', marginBottom: '1rem' }}>
            <div className="faq-question" style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem' }}>How do annual subscriptions work?</div>
            <div className="faq-answer" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              Save 20% with annual billing. Pro Buyer annual is $279/year (vs $348/year monthly), 
              and Investor Pro annual is $758/year (vs $948/year monthly). 
              Billed once per year.
            </div>
          </div>
          
          <div className="faq-item" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-xl)', padding: '1.5rem', marginBottom: '1rem' }}>
            <div className="faq-question" style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem' }}>Can I cancel anytime?</div>
            <div className="faq-answer" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              Yes! Cancel anytime from your account settings. No contracts, no cancellation fees. 
              If you cancel, you'll retain access until the end of your billing period.
            </div>
          </div>
          
          <div className="faq-item" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-xl)', padding: '1.5rem', marginBottom: '1rem' }}>
            <div className="faq-question" style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem' }}>Is my data private and secure?</div>
            <div className="faq-answer" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              Yes! All your saved properties and preferences are stored locally on your device. 
              We don't store or access your personal property data on our servers.
            </div>
          </div>
          
          <div className="faq-item" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-xl)', padding: '1.5rem', marginBottom: '1rem' }}>
            <div className="faq-question" style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem' }}>Do you offer discounts for students or first home buyers?</div>
            <div className="faq-answer" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              Yes! We offer a 30% discount for verified students and first home buyers. 
              Contact us at pricing@homescorepro.com.au with proof of eligibility.
            </div>
          </div>
          
          <div className="faq-item" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-xl)', padding: '1.5rem', marginBottom: '1rem' }}>
            <div className="faq-question" style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem' }}>What makes HomeScorePro different from other property tools?</div>
            <div className="faq-answer" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              Complete transparency. Unlike other tools with "black box" algorithms, we show you 
              every data point, every weight, and every calculation. Plus, our scoring is based on 
              30+ years of professional auctioneer experience in Melbourne.
            </div>
          </div>
          
          <div className="faq-item" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-xl)', padding: '1.5rem', marginBottom: '1rem' }}>
            <div className="faq-question" style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem' }}>Can I use HomeScorePro for investment properties?</div>
            <div className="faq-answer" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              Absolutely! Our scoring adapts to your strategy—investment, lifestyle, or balanced. 
              The Investor Pro plan is specifically designed for property investors and includes 
              portfolio tracking, historical data, and advanced analytics.
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Pricing
