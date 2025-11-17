import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer>
      <div className="footer-container">
        <div className="footer-section">
          <h4>Product</h4>
          <ul className="footer-links">
            <li><Link to="/calculator" className="footer-link">Calculator</Link></li>
            <li><Link to="/pricing" className="footer-link">Pricing</Link></li>
            <li><a href="#" className="footer-link">Features</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Company</h4>
          <ul className="footer-links">
            <li><Link to="/about" className="footer-link">About</Link></li>
            <li><Link to="/contact" className="footer-link">Contact</Link></li>
            <li><a href="#" className="footer-link">Careers</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Legal</h4>
          <ul className="footer-links">
            <li><Link to="/privacy" className="footer-link">Privacy</Link></li>
            <li><Link to="/terms" className="footer-link">Terms</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Account</h4>
          <ul className="footer-links">
            <li><Link to="/members" className="footer-link">Sign In</Link></li>
            <li><Link to="/pricing" className="footer-link">Upgrade</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>© 2024 HomeScorePro. Built with precision. Powered by data.</p>
        <p style={{ marginTop: 'var(--space-2)', fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>
          Data Sources: Australian Bureau of Statistics (SEIFA), Victoria Police, 
          <Link to="/data-sources" style={{ color: 'var(--orange-primary)', textDecoration: 'none' }}> View all sources</Link>
        </p>
      </div>
    </footer>
  )
}

export default Footer

