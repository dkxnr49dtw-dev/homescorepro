import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

function About() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="hero" style={{ marginTop: '80px', padding: '6rem 1.5rem 4rem', textAlign: 'center' }}>
        <h1 className="hero-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, marginBottom: '1rem' }}>
          Built by Property Enthusiasts,<br />For Property Hunters
        </h1>
        <p className="hero-subtitle" style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto' }}>
          We believe finding the right property shouldn't require guesswork. That's why we built HomeScorePro.
        </p>
      </div>

      <div className="content-section" style={{ maxWidth: '900px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        <div className="content-card" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-2xl)', padding: '3rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--orange-light)' }}>Our Story</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>
            HomeScorePro was born from frustration. The property search process in Melbourne was overwhelming—too much data, too many variables, and no clear way to compare properties objectively.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>
            We spent months talking to first-time buyers, investors, and real estate professionals. Everyone had the same problem: information overload without actionable insights.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            So we built a solution. HomeScorePro combines 38+ verified data points into two simple scores that actually mean something. No jargon. No hidden algorithms. Just transparent, data-driven property intelligence.
          </p>
        </div>

        <div className="content-card" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-2xl)', padding: '3rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--orange-light)' }}>Our Values</h2>
          <div className="values-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
            <div className="value-item" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-xl)', padding: '2rem', textAlign: 'center' }}>
              <div className="value-icon" style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
              <div className="value-title" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Transparency</div>
              <div className="value-description" style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>Every score is explained. No black boxes.</div>
            </div>
            
            <div className="value-item" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-xl)', padding: '2rem', textAlign: 'center' }}>
              <div className="value-icon" style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
              <div className="value-title" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Data-Driven</div>
              <div className="value-description" style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>38+ verified data points. Updated monthly.</div>
            </div>
            
            <div className="value-item" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-xl)', padding: '2rem', textAlign: 'center' }}>
              <div className="value-icon" style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
              <div className="value-title" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Simplicity</div>
              <div className="value-description" style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>Complex analysis, simple presentation.</div>
            </div>
            
            <div className="value-item" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-xl)', padding: '2rem', textAlign: 'center' }}>
              <div className="value-icon" style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
              <div className="value-title" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Independence</div>
              <div className="value-description" style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>No agent bias. No property listings.</div>
            </div>
          </div>
        </div>

        <div className="content-card" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-2xl)', padding: '3rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--orange-light)' }}>Our Methodology</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>
            HomeScorePro uses 38+ data points to calculate A-Scores (suburb analysis) and 23+ data points for B-Scores (property analysis). Every metric is sourced from verified data providers:
          </p>
          <ul style={{ marginLeft: '2rem', marginTop: '1rem', marginBottom: '1rem', color: 'var(--text-secondary)', lineHeight: 2 }}>
            <li><strong style={{ color: 'var(--text-primary)' }}>ABS SEIFA</strong> - Socio-Economic Indexes for Areas (IRSD, IER, IEO)</li>
            <li><strong style={{ color: 'var(--text-primary)' }}>Victoria Police</strong> - Crime statistics by LGA</li>
            <li><strong style={{ color: 'var(--text-primary)' }}>Public Property Data</strong> - Property prices, growth rates, rental yields (sourced from publicly available data)</li>
            <li><strong style={{ color: 'var(--text-primary)' }}>Local Government Data</strong> - Schools, amenities, infrastructure</li>
            <li><strong style={{ color: 'var(--text-primary)' }}>Walk Score & Transit Data</strong> - Accessibility metrics</li>
          </ul>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>
            Our scoring weights are derived from 30+ years of professional auctioneer experience in Melbourne, ensuring that the calculations reflect real-world property value factors.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>
            <strong style={{ color: 'var(--text-primary)' }}>A-Score (Suburb Analysis):</strong> Evaluates suburbs across 15 key metrics including location quality, school ratings, safety statistics, transport access, amenities, and growth potential. Perfect for narrowing down where to search.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>
            <strong style={{ color: 'var(--text-primary)' }}>B-Score (Property Analysis):</strong> Comprehensive property-level evaluation using 38+ data points. Combines A-Score fundamentals with property-specific factors like affordability, investment potential, and lifestyle fit.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            All data is sourced from government statistics, verified transport databases, school performance reports, and real estate market analysis. We update our database monthly to ensure accuracy.
          </p>
        </div>

        <div className="content-card" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-2xl)', padding: '3rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--orange-light)' }}>Investment Strategies</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>
            Your budget range suggests strategy weightings based on typical consumer behavior patterns. The labels 'Investment', 'Balanced', and 'Lifestyle' are preset weighting configurations that reflect how most buyers in each budget range prioritize factors. However, you can browse and change weighting presets for any budget category if you're curious.
          </p>
          
          <div style={{ background: 'var(--bg-tertiary)', borderLeft: '4px solid var(--orange-primary)', padding: '2rem', borderRadius: 'var(--radius-xl)', marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--orange-light)' }}>Investment Strategy (Lower Budget Range)</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>
              When you're buying at the lower end of your mortgage budget, you're making a strategic choice. You're okay with a lower-priced house because you won't be there long - instead, you want maximum growth in value to get ahead of pricing for your following house. This strategy optimizes scoring weightings for capital growth and rental yield.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Consumer Behavior:</strong> Buyers in this range prioritize growth over lifestyle because they're planning to upgrade. They want their property to appreciate faster so they can build equity and move up the property ladder sooner.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Weightings:</strong> Investment tier: 30-45% (highest), Location: 30-35%, Accessibility: 15-20%, Lifestyle: 10-20% (lower), Community: 10-15%
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              <strong style={{ color: 'var(--text-primary)' }}>Example:</strong> A suburb with 5% growth and 4% rental yield scores significantly higher under Investment strategy because growth metrics receive 35% weight (vs 20% in Balanced). This helps you find suburbs where your property will appreciate faster, giving you more equity to upgrade.
            </p>
          </div>
          
          <div style={{ background: 'var(--bg-tertiary)', borderLeft: '4px solid var(--orange-primary)', padding: '2rem', borderRadius: 'var(--radius-xl)', marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--orange-light)' }}>Balanced Strategy (Middle Budget Range)</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>
              When you're buying in the middle of your mortgage budget, you want both growth potential and quality of life. This strategy provides equal consideration of investment potential and lifestyle factors - the sweet spot for most Melbourne buyers who want their property to appreciate while also being a wonderful place to live.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Consumer Behavior:</strong> Buyers in this range are balancing financial goals with lifestyle needs. They want their property to grow in value AND provide a great living experience. They're not planning to move as quickly as Investment buyers, but they still want growth.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Weightings:</strong> Investment tier: 30-35% (balanced), Location: 30-35% (balanced), Accessibility: 15-20%, Lifestyle: 10-20% (balanced), Community: 10-15%
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              <strong style={{ color: 'var(--text-primary)' }}>Example:</strong> A suburb with moderate growth (3%), good schools (75 rating), and decent transport scores well under Balanced strategy because all factors receive similar weight. This helps you find suburbs that offer the best of both worlds - growth potential AND quality of life.
            </p>
          </div>
          
          <div style={{ background: 'var(--bg-tertiary)', borderLeft: '4px solid var(--orange-primary)', padding: '2rem', borderRadius: 'var(--radius-xl)', marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--orange-light)' }}>Lifestyle Strategy (Higher Budget Range)</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>
              When you're buying at the higher end of your mortgage budget, you're making a lifestyle choice. You're willing to pay more because the home and area are amazing and worth it to you. You care less about investment growth because you plan to live in that great home for longer. This strategy optimizes scoring weightings for quality of life factors.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Consumer Behavior:</strong> Buyers in this range prioritize lifestyle over growth because they're planning to stay longer. They want an exceptional place to live, even if growth potential is moderate. The home itself is the investment in their quality of life.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Weightings:</strong> Investment tier: 18-25% (lower), Location: 23-30%, Accessibility: 20-26%, Lifestyle: 15-30% (highest), Community: 10-19%
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              <strong style={{ color: 'var(--text-primary)' }}>Example:</strong> A suburb with top-rated schools (90+ rating) and abundant parks (5+ per km²) scores significantly higher under Lifestyle strategy because lifestyle metrics receive 25% weight (vs 15% in Balanced). This helps you find suburbs where you'll love living long-term, even if growth isn't the highest.
            </p>
          </div>
          
          <div style={{ background: 'var(--orange-subtle)', borderLeft: '4px solid var(--orange-primary)', padding: '2rem', borderRadius: 'var(--radius-xl)', marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--orange-light)' }}>💡 Explore Different Strategies</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              You can explore different weighting strategies regardless of your budget. Want to see how a lower-budget suburb scores under Lifestyle strategy? Or how a higher-budget area scores under Investment strategy? Browse and experiment with different weighting presets to understand how each factor affects scores. We suggest weightings based on your budget, but you can explore any strategy to see how it affects scores.
            </p>
          </div>
        </div>

        <div className="content-card" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-2xl)', padding: '3rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--orange-light)' }}>Why Melbourne?</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>
            We started in Melbourne because it's home. We know these suburbs, understand the market dynamics, and recognize what makes each area unique.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            Melbourne's property market is one of the most complex in Australia, with 397 distinct suburbs each having their own character. We're building the tool we wish existed when we were property hunting.
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default About
