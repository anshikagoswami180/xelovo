import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Moon, Sun } from 'lucide-react';

export default function Navbar() {
  const [activeItem, setActiveItem] = useState('Home');
  const [openDropdown, setOpenDropdown] = useState(null);

  const navItems = [
    { name: 'Home', hasChevron: false, href: '/' },
    { name: 'Security Tools', hasChevron: true, href: '/security-tools' },
    { name: 'Investigation', hasChevron: true, href: '/investigation' },
    { name: 'XELA AI', hasChevron: false, href: '/ai-assistant' },
    { name: 'Learn', hasChevron: true, href: '/learn' },
    { name: 'About', hasChevron: false, href: '/about' },
    { name: 'Contact', hasChevron: false, href: '/contact' }
  ];

  return (
    <nav style={{
      height: '80px',
      backgroundColor: 'rgba(3, 11, 28, 0.92)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(45, 125, 255, 0.22)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2.5rem'
    }}>
      {/* LEFT SIDE: LOGO & WORDMARK */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          {/* Symmetrical Geometric X Shield Icon */}
          <svg width="32" height="38" viewBox="0 0 240 290" fill="none">
            <defs>
              <linearGradient id="navShieldBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#091B36" />
                <stop offset="100%" stopColor="#030B1C" />
              </linearGradient>
              <linearGradient id="navXRightUpper" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1688FF" />
                <stop offset="100%" stopColor="#1558C0" />
              </linearGradient>
              <linearGradient id="navXRightLower" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1688FF" />
                <stop offset="100%" stopColor="#19D7E8" />
              </linearGradient>
            </defs>
            <path d="M 120 15 L 215 50 C 215 170 170 245 120 275 C 70 245 25 170 25 50 Z" fill="url(#navShieldBg)" stroke="#1688FF" strokeWidth="8" />
            <g transform="translate(120, 130)">
              {/* Upper Left */}
              <polygon points="-40,-40 -12,-12 -28,4 -56,-24" fill="#F2F5F9" opacity="0.95" />
              {/* Lower Left */}
              <polygon points="-40,40 -12,12 -28,-4 -56,24" fill="#B5C0D0" opacity="0.85" />
              {/* Upper Right */}
              <polygon points="40,-40 12,-12 28,4 56,-24" fill="url(#navXRightUpper)" />
              {/* Lower Right */}
              <polygon points="40,40 12,12 28,-4 56,24" fill="url(#navXRightLower)" />
              {/* Center Diamond */}
              <polygon points="0,-14 14,0 0,14 -14,0" fill="#58F0FF" />
            </g>
          </svg>
          <span style={{
            fontSize: '1.45rem',
            fontWeight: 800,
            color: '#FFFFFF',
            fontFamily: 'var(--font-display)',
            letterSpacing: '2px',
            textTransform: 'uppercase'
          }}>
            XELOVO
          </span>
        </Link>
      </div>

      {/* CENTER NAVIGATION */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        {navItems.map((item) => {
          const isActive = activeItem === item.name;
          return (
            <div 
              key={item.name}
              style={{ position: 'relative' }}
              onMouseEnter={() => item.hasChevron && setOpenDropdown(item.name)}
              onMouseLeave={() => item.hasChevron && setOpenDropdown(null)}
            >
              <Link
                to={item.href}
                onClick={() => setActiveItem(item.name)}
                style={{
                  color: isActive ? '#1688FF' : '#B5C0D0',
                  textDecoration: 'none',
                  fontSize: '0.92rem',
                  fontWeight: isActive ? 600 : 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.5rem 0',
                  position: 'relative',
                  transition: 'color 0.2s ease'
                }}
              >
                {item.name}
                {item.hasChevron && (
                  <ChevronDown size={15} style={{ color: isActive ? '#1688FF' : '#8494AB' }} />
                )}

                {/* Active Glowing Blue Line */}
                {isActive && (
                  <span style={{
                    position: 'absolute',
                    bottom: '-1px',
                    left: 0,
                    right: 0,
                    height: '2.5px',
                    backgroundColor: '#1688FF',
                    borderRadius: '2px',
                    boxShadow: '0 0 10px #19D7E8'
                  }} />
                )}
              </Link>

              {/* Dropdown Visual Behavior */}
              {item.hasChevron && openDropdown === item.name && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  width: '240px',
                  backgroundColor: '#091B36',
                  border: '1px solid rgba(45, 125, 255, 0.3)',
                  borderRadius: '10px',
                  padding: '0.75rem 0',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                  zIndex: 110
                }}>
                  <div style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', color: '#8494AB', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {item.name} Suites
                  </div>
                  <Link to="/security-tools/phishing-analyzer" style={{ display: 'block', padding: '0.5rem 1rem', color: '#F2F5F9', fontSize: '0.85rem', textDecoration: 'none' }}>
                    Phishing Analyzer
                  </Link>
                  <Link to="/security-tools/scam-analyzer" style={{ display: 'block', padding: '0.5rem 1rem', color: '#F2F5F9', fontSize: '0.85rem', textDecoration: 'none' }}>
                    Scam Protection Analyzer
                  </Link>
                  <Link to="/security-tools/image-analyzer" style={{ display: 'block', padding: '0.5rem 1rem', color: '#F2F5F9', fontSize: '0.85rem', textDecoration: 'none' }}>
                    Image Scam & Manipulation
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* RIGHT SIDE ACTIONS */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Moon Icon Toggle Button */}
        <button 
          style={{
            background: 'rgba(6, 20, 43, 0.6)',
            border: '1px solid rgba(45, 125, 255, 0.25)',
            borderRadius: '8px',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#19D7E8',
            cursor: 'pointer'
          }}
          title="Toggle Theme"
        >
          <Moon size={18} />
        </button>

        {/* Login Button */}
        <Link 
          to="/login"
          className="btn-outline-electric"
          style={{
            padding: '0.55rem 1.4rem',
            fontSize: '0.9rem'
          }}
        >
          Login
        </Link>

        {/* Sign Up Button */}
        <Link 
          to="/register"
          className="btn-blue-gradient"
          style={{
            padding: '0.55rem 1.4rem',
            fontSize: '0.9rem'
          }}
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
}
