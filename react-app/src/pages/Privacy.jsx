import { motion } from 'framer-motion'

function Privacy() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="legal-container" style={{ marginTop: '80px', maxWidth: '900px', marginLeft: 'auto', marginRight: 'auto', padding: '4rem 1.5rem' }}>
        <div className="legal-header" style={{ marginBottom: '3rem' }}>
          <h1 className="legal-title" style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1rem' }}>Privacy Policy</h1>
          <p className="legal-updated" style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>Last updated: November 15, 2024</p>
        </div>

        <div className="legal-content" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-2xl)', padding: '3rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '2.5rem', marginBottom: '1rem', color: 'var(--orange-light)' }}>Introduction</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>
            At HomeScorePro, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our property analysis platform.
          </p>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '2.5rem', marginBottom: '1rem', color: 'var(--orange-light)' }}>Information We Collect</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}><strong style={{ color: 'var(--text-primary)' }}>Personal Information:</strong></p>
          <ul style={{ color: 'var(--text-secondary)', marginBottom: '1rem', paddingLeft: '2rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>Name and email address (when you create an account)</li>
            <li style={{ marginBottom: '0.5rem' }}>Payment information (processed securely through third-party providers)</li>
            <li style={{ marginBottom: '0.5rem' }}>Property search history and saved properties</li>
            <li style={{ marginBottom: '0.5rem' }}>Communication preferences and correspondence</li>
          </ul>

          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}><strong style={{ color: 'var(--text-primary)' }}>Automatically Collected Information:</strong></p>
          <ul style={{ color: 'var(--text-secondary)', marginBottom: '1rem', paddingLeft: '2rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>IP address and browser type</li>
            <li style={{ marginBottom: '0.5rem' }}>Device information and operating system</li>
            <li style={{ marginBottom: '0.5rem' }}>Pages visited and time spent on platform</li>
            <li style={{ marginBottom: '0.5rem' }}>Referral sources and click patterns</li>
          </ul>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '2.5rem', marginBottom: '1rem', color: 'var(--orange-light)' }}>How We Use Your Information</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>We use collected information to:</p>
          <ul style={{ color: 'var(--text-secondary)', marginBottom: '1rem', paddingLeft: '2rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>Provide and maintain our property scoring services</li>
            <li style={{ marginBottom: '0.5rem' }}>Process your searches and generate property reports</li>
            <li style={{ marginBottom: '0.5rem' }}>Send service updates and relevant property alerts (if opted in)</li>
            <li style={{ marginBottom: '0.5rem' }}>Improve our algorithms and user experience</li>
            <li style={{ marginBottom: '0.5rem' }}>Detect and prevent fraud or abuse</li>
            <li style={{ marginBottom: '0.5rem' }}>Comply with legal obligations</li>
          </ul>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '2.5rem', marginBottom: '1rem', color: 'var(--orange-light)' }}>Information Sharing</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>We do NOT sell your personal information. We may share information with:</p>
          <ul style={{ color: 'var(--text-secondary)', marginBottom: '1rem', paddingLeft: '2rem' }}>
            <li style={{ marginBottom: '0.5rem' }}><strong style={{ color: 'var(--text-primary)' }}>Service Providers:</strong> Payment processors, email services, and analytics tools</li>
            <li style={{ marginBottom: '0.5rem' }}><strong style={{ color: 'var(--text-primary)' }}>Legal Requirements:</strong> When required by law or to protect our rights</li>
            <li style={{ marginBottom: '0.5rem' }}><strong style={{ color: 'var(--text-primary)' }}>Business Transfers:</strong> In case of merger, acquisition, or sale of assets</li>
          </ul>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '2.5rem', marginBottom: '1rem', color: 'var(--orange-light)' }}>Data Security</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>
            We implement industry-standard security measures including encryption, secure servers, and regular security audits. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
          </p>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '2.5rem', marginBottom: '1rem', color: 'var(--orange-light)' }}>Your Rights</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>You have the right to:</p>
          <ul style={{ color: 'var(--text-secondary)', marginBottom: '1rem', paddingLeft: '2rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>Access your personal data</li>
            <li style={{ marginBottom: '0.5rem' }}>Request correction of inaccurate information</li>
            <li style={{ marginBottom: '0.5rem' }}>Request deletion of your account and data</li>
            <li style={{ marginBottom: '0.5rem' }}>Opt-out of marketing communications</li>
            <li style={{ marginBottom: '0.5rem' }}>Export your property search history</li>
          </ul>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '2.5rem', marginBottom: '1rem', color: 'var(--orange-light)' }}>Cookies</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>
            We use essential cookies to maintain your session and preferences. We also use analytics cookies to understand how users interact with our platform. You can control cookies through your browser settings.
          </p>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '2.5rem', marginBottom: '1rem', color: 'var(--orange-light)' }}>Third-Party Services</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>Our platform integrates with:</p>
          <ul style={{ color: 'var(--text-secondary)', marginBottom: '1rem', paddingLeft: '2rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>Payment processors (Stripe)</li>
            <li style={{ marginBottom: '0.5rem' }}>Analytics services (Google Analytics)</li>
            <li style={{ marginBottom: '0.5rem' }}>Email providers</li>
          </ul>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>These services have their own privacy policies, which we encourage you to review.</p>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '2.5rem', marginBottom: '1rem', color: 'var(--orange-light)' }}>Data Retention</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>
            We retain your personal information for as long as your account is active or as needed to provide services. We will retain and use your information as necessary to comply with legal obligations, resolve disputes, and enforce our agreements.
          </p>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '2.5rem', marginBottom: '1rem', color: 'var(--orange-light)' }}>Children's Privacy</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>
            Our services are not intended for users under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
          </p>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '2.5rem', marginBottom: '1rem', color: 'var(--orange-light)' }}>Changes to This Policy</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>
            We may update this Privacy Policy from time to time. We will notify you of significant changes via email or prominent notice on our platform. Your continued use after changes constitutes acceptance of the updated policy.
          </p>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '2.5rem', marginBottom: '1rem', color: 'var(--orange-light)' }}>Contact Us</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>
            For privacy-related questions or to exercise your rights, contact us at:
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            <strong style={{ color: 'var(--text-primary)' }}>Email:</strong> privacy@homescorepro.com.au<br />
            <strong style={{ color: 'var(--text-primary)' }}>Mail:</strong> HomeScorePro, Melbourne, VIC, Australia
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default Privacy
