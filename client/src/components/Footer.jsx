import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: 'var(--footer-bg)',
      borderTop: '1px solid var(--border-subtle)',
      padding: '3rem 2.5rem 2rem 2.5rem',
      color: 'var(--text-secondary)',
      fontSize: '0.85rem',
      transition: 'background-color 0.25s ease, border-color 0.25s ease'
    }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-contrast)', fontFamily: 'var(--font-display)', letterSpacing: '1px' }}>XELOVO</span>
          </div>
          <p style={{ maxWidth: '320px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            Empirical Threat Telemetry & Security Intelligence Platform for online safety, threat awareness, and digital exposure analysis.
          </p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--cyan)' }}>
            Official Email: <a href="mailto:xelavo.sec26@gmail.com" style={{ color: 'var(--cyan)', textDecoration: 'underline' }}>xelavo.sec26@gmail.com</a>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
          <div>
            <h4 style={{ color: 'var(--text-main)', marginBottom: '0.75rem', fontSize: '0.9rem' }}>Platform</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', padding: 0 }}>
              <li><Link to="/security-tools" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Security Tools</Link></li>
              <li><Link to="/investigation" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Investigation</Link></li>
              <li><Link to="/reports" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Security Reports</Link></li>
              <li><Link to="/learn" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Learn</Link></li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: 'var(--text-main)', marginBottom: '0.75rem', fontSize: '0.9rem' }}>Company</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', padding: 0 }}>
              <li><Link to="/about" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>About XELOVO</Link></li>
              <li><Link to="/contact" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Contact</Link></li>
              <li><Link to="/privacy" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1440px', margin: '2rem auto 0 auto', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
        <span>&copy; {new Date().getFullYear()} XELOVO Platform. Founded by Anshika G. | Technical Lead: Dhruvi Solanki. All rights reserved.</span>
        <span>Empowering digital awareness and security intelligence.</span>
      </div>
    </footer>
  );
}
