import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#030B1C',
      borderTop: '1px solid rgba(45, 125, 255, 0.18)',
      padding: '3rem 2.5rem 2rem 2.5rem',
      color: '#B5C0D0',
      fontSize: '0.85rem'
    }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#F2F5F9', fontFamily: 'var(--font-display)', letterSpacing: '1px' }}>XELOVO</span>
          </div>
          <p style={{ maxWidth: '320px', color: '#8494AB', lineHeight: 1.5 }}>
            Empirical Threat Telemetry & AI Security Intelligence Platform for online safety, threat awareness, and digital exposure analysis.
          </p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#19D7E8' }}>
            Official Email: <a href="mailto:xelavo.sec26@gmail.com" style={{ color: '#19D7E8', textDecoration: 'underline' }}>xelavo.sec26@gmail.com</a>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
          <div>
            <h4 style={{ color: '#F2F5F9', marginBottom: '0.75rem', fontSize: '0.9rem' }}>Platform</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', padding: 0 }}>
              <li><Link to="/security-tools" style={{ color: '#B5C0D0', textDecoration: 'none' }}>Security Tools</Link></li>
              <li><Link to="/investigation" style={{ color: '#B5C0D0', textDecoration: 'none' }}>Investigation</Link></li>
              <li><Link to="/ai-assistant" style={{ color: '#B5C0D0', textDecoration: 'none' }}>XELA AI Assistant</Link></li>
              <li><Link to="/learn" style={{ color: '#B5C0D0', textDecoration: 'none' }}>Learn</Link></li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: '#F2F5F9', marginBottom: '0.75rem', fontSize: '0.9rem' }}>Company</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', padding: 0 }}>
              <li><Link to="/about" style={{ color: '#B5C0D0', textDecoration: 'none' }}>About XELOVO</Link></li>
              <li><Link to="/contact" style={{ color: '#B5C0D0', textDecoration: 'none' }}>Contact</Link></li>
              <li><Link to="/privacy" style={{ color: '#B5C0D0', textDecoration: 'none' }}>Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1440px', margin: '2rem auto 0 auto', paddingTop: '1.5rem', borderTop: '1px solid rgba(45, 125, 255, 0.1)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', color: '#8494AB', fontSize: '0.78rem' }}>
        <span>&copy; {new Date().getFullYear()} XELOVO Platform. Founded by Anshika G. | Technical Lead: Dhruvi Solanki. All rights reserved.</span>
        <span>Empowering digital awareness and security intelligence.</span>
      </div>
    </footer>
  );
}
