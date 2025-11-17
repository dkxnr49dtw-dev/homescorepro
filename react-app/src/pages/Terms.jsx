import { motion } from 'framer-motion'

function Terms() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="legal-container" style={{ marginTop: '80px', maxWidth: '900px', marginLeft: 'auto', marginRight: 'auto', padding: '4rem 1.5rem' }}>
        <div className="legal-header" style={{ marginBottom: '3rem' }}>
          <h1 className="legal-title" style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1rem' }}>Terms of Service</h1>
          <p className="legal-updated" style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>Last updated: November 15, 2024</p>
        </div>

        <div className="legal-content" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-2xl)', padding: '3rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0', marginBottom: '1rem', color: 'var(--orange-light)' }}>Agreement to Terms</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>
            By accessing or using HomeScorePro, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you may not use our service.
          </p>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '2.5rem', marginBottom: '1rem', color: 'var(--orange-light)' }}>Description of Service</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>
            HomeScorePro is a property analysis platform that provides data-driven scores and insights for Melbourne properties. Our service includes:
          </p>
          <ul style={{ color: 'var(--text-secondary)', marginBottom: '1rem', paddingLeft: '2rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>A-Score: Suburb-level analysis across 15 metrics</li>
            <li style={{ marginBottom: '0.5rem' }}>B-Score: Property-level evaluation using 38+ data points</li>
            <li style={{ marginBottom: '0.5rem' }}>Search functionality for suburbs, postcodes, and addresses</li>
            <li style={{ marginBottom: '0.5rem' }}>Property comparison tools (Pro plan)</li>
            <li style={{ marginBottom: '0.5rem' }}>Saved searches and alerts (Pro plan)</li>
          </ul>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '2.5rem', marginBottom: '1rem', color: 'var(--orange-light)' }}>User Accounts</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}><strong style={{ color: 'var(--text-primary)' }}>Account Creation:</strong></p>
          <ul style={{ color: 'var(--text-secondary)', marginBottom: '1rem', paddingLeft: '2rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>You must provide accurate and complete information</li>
            <li style={{ marginBottom: '0.5rem' }}>You are responsible for maintaining account security</li>
            <li style={{ marginBottom: '0.5rem' }}>You must be at least 18 years old to create an account</li>
            <li style={{ marginBottom: '0.5rem' }}>One account per person; no sharing of accounts</li>
          </ul>

          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}><strong style={{ color: 'var(--text-primary)' }}>Account Termination:</strong></p>
          <ul style={{ color: 'var(--text-secondary)', marginBottom: '1rem', paddingLeft: '2rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>We reserve the right to suspend or terminate accounts for violations</li>
            <li style={{ marginBottom: '0.5rem' }}>You may cancel your account at any time</li>
            <li style={{ marginBottom: '0.5rem' }}>Upon termination, your data will be deleted as per our Privacy Policy</li>
          </ul>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '2.5rem', marginBottom: '1rem', color: 'var(--orange-light)' }}>Subscription Plans</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}><strong style={{ color: 'var(--text-primary)' }}>Free Plan:</strong></p>
          <ul style={{ color: 'var(--text-secondary)', marginBottom: '1rem', paddingLeft: '2rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>3 property searches per account</li>
            <li style={{ marginBottom: '0.5rem' }}>Basic score access</li>
            <li style={{ marginBottom: '0.5rem' }}>No payment required</li>
          </ul>

          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}><strong style={{ color: 'var(--text-primary)' }}>Pro Plan ($29/month):</strong></p>
          <ul style={{ color: 'var(--text-secondary)', marginBottom: '1rem', paddingLeft: '2rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>Unlimited searches</li>
            <li style={{ marginBottom: '0.5rem' }}>Full breakdowns and insights</li>
            <li style={{ marginBottom: '0.5rem' }}>Save and compare properties</li>
            <li style={{ marginBottom: '0.5rem' }}>Billed monthly; cancel anytime</li>
            <li style={{ marginBottom: '0.5rem' }}>30-day money-back guarantee</li>
          </ul>

          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}><strong style={{ color: 'var(--text-primary)' }}>Enterprise Plan (Custom pricing):</strong></p>
          <ul style={{ color: 'var(--text-secondary)', marginBottom: '1rem', paddingLeft: '2rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>API access and bulk analysis</li>
            <li style={{ marginBottom: '0.5rem' }}>White-label reports</li>
            <li style={{ marginBottom: '0.5rem' }}>Custom terms apply per contract</li>
          </ul>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '2.5rem', marginBottom: '1rem', color: 'var(--orange-light)' }}>Payment Terms</h2>
          <ul style={{ color: 'var(--text-secondary)', marginBottom: '1rem', paddingLeft: '2rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>All payments are processed securely through third-party providers</li>
            <li style={{ marginBottom: '0.5rem' }}>Subscriptions auto-renew unless cancelled</li>
            <li style={{ marginBottom: '0.5rem' }}>Refunds available within 30 days of purchase (Pro plan only)</li>
            <li style={{ marginBottom: '0.5rem' }}>Price changes will be communicated 30 days in advance</li>
            <li style={{ marginBottom: '0.5rem' }}>Failed payments may result in service suspension</li>
          </ul>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '2.5rem', marginBottom: '1rem', color: 'var(--orange-light)' }}>Acceptable Use</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>You agree NOT to:</p>
          <ul style={{ color: 'var(--text-secondary)', marginBottom: '1rem', paddingLeft: '2rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>Use automated tools to scrape or extract data</li>
            <li style={{ marginBottom: '0.5rem' }}>Share your account credentials with others</li>
            <li style={{ marginBottom: '0.5rem' }}>Attempt to circumvent search limits or paywalls</li>
            <li style={{ marginBottom: '0.5rem' }}>Reverse engineer or copy our scoring algorithms</li>
            <li style={{ marginBottom: '0.5rem' }}>Use the service for illegal or fraudulent purposes</li>
            <li style={{ marginBottom: '0.5rem' }}>Resell or redistribute our data without authorization</li>
          </ul>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '2.5rem', marginBottom: '1rem', color: 'var(--orange-light)' }}>Intellectual Property</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>
            All content, including scores, algorithms, designs, and data, is owned by HomeScorePro and protected by copyright and intellectual property laws. You may not reproduce, distribute, or create derivative works without written permission.
          </p>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '2.5rem', marginBottom: '1rem', color: 'var(--orange-light)' }}>Data Accuracy and Disclaimers</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}><strong style={{ color: 'var(--text-primary)' }}>Important:</strong> HomeScorePro provides informational tools only. We do not:</p>
          <ul style={{ color: 'var(--text-secondary)', marginBottom: '1rem', paddingLeft: '2rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>Provide financial, legal, or real estate advice</li>
            <li style={{ marginBottom: '0.5rem' }}>Guarantee accuracy of scores or data</li>
            <li style={{ marginBottom: '0.5rem' }}>Make property recommendations or endorsements</li>
            <li style={{ marginBottom: '0.5rem' }}>Act as real estate agents or brokers</li>
          </ul>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>
            Our scores are based on publicly available data and proprietary analysis. Property values, market conditions, and other factors change constantly. Always conduct your own due diligence and consult professionals before making property decisions.
          </p>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '2.5rem', marginBottom: '1rem', color: 'var(--orange-light)' }}>Limitation of Liability</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>
            HomeScorePro is provided "as is" without warranties of any kind. We are not liable for:
          </p>
          <ul style={{ color: 'var(--text-secondary)', marginBottom: '1rem', paddingLeft: '2rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>Financial losses from property decisions</li>
            <li style={{ marginBottom: '0.5rem' }}>Data inaccuracies or service interruptions</li>
            <li style={{ marginBottom: '0.5rem' }}>Third-party actions or content</li>
            <li style={{ marginBottom: '0.5rem' }}>Indirect, incidental, or consequential damages</li>
          </ul>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>
            Our total liability shall not exceed the amount you paid for the service in the past 12 months.
          </p>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '2.5rem', marginBottom: '1rem', color: 'var(--orange-light)' }}>Data Sources</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>Our scores are derived from multiple sources including:</p>
          <ul style={{ color: 'var(--text-secondary)', marginBottom: '1rem', paddingLeft: '2rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>Government statistics and public records</li>
            <li style={{ marginBottom: '0.5rem' }}>School performance data</li>
            <li style={{ marginBottom: '0.5rem' }}>Transport network information</li>
            <li style={{ marginBottom: '0.5rem' }}>Real estate market analysis</li>
            <li style={{ marginBottom: '0.5rem' }}>Safety and crime statistics</li>
          </ul>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '2.5rem', marginBottom: '1rem', color: 'var(--orange-light)' }}>Changes to Service</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>
            We reserve the right to modify, suspend, or discontinue any part of the service at any time. We will provide reasonable notice for significant changes affecting paid subscribers.
          </p>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '2.5rem', marginBottom: '1rem', color: 'var(--orange-light)' }}>Governing Law</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>
            These Terms are governed by the laws of Victoria, Australia. Any disputes shall be resolved in the courts of Melbourne, Victoria.
          </p>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '2.5rem', marginBottom: '1rem', color: 'var(--orange-light)' }}>Contact</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>
            For questions about these Terms, contact us at:
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            <strong style={{ color: 'var(--text-primary)' }}>Email:</strong> legal@homescorepro.com.au<br />
            <strong style={{ color: 'var(--text-primary)' }}>Mail:</strong> HomeScorePro, Melbourne, VIC, Australia
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default Terms
