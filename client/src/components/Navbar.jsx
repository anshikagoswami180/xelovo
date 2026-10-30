import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Moon, Sun, Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { theme, toggleTheme, isDark } = useTheme();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState(null);
  const navRef = useRef(null);
  const location = useLocation();

  // Distinct, verified menu configuration mapping to actual platform routes
  const navItems = [
    { name: 'Home', href: '/' },
    {
      name: 'Security Tools',
      href: '/security-tools',
      dropdownHeader: 'Security Analysis Tools',
      items: [
        { name: 'Security Tools Hub', href: '/security-tools', description: 'Central search & categorized analyzer hub' },
        { name: 'Phishing Analyzer', href: '/security-tools/phishing-analyzer', description: 'Evaluate suspicious URLs, senders & email headers' },
        { name: 'Scam Protection Analyzer', href: '/security-tools/scam-analyzer', description: 'Detect financial fraud, coercion & fake offers' },
        { name: 'Image Scam & Manipulation', href: '/security-tools/image-analyzer', description: 'Inspect EXIF metadata, headers & compression artifacts' },
        { name: 'All 20 Workstations', href: '/tools', description: 'Complete catalog of specialized security tools' }
      ]
    },
    {
      name: 'Investigation',
      href: '/investigation',
      dropdownHeader: 'Investigation & Telemetry',
      items: [
        { name: 'Intelligence Command', href: '/investigation', description: 'Correlated threat telemetry & cross-target timeline' },
        { name: 'Operations Dashboard', href: '/dashboard', description: 'Attack surface monitoring & station quick-launch' },
        { name: 'Scan History & Logs', href: '/history', description: 'Empirical record of executed scans & re-run links' }
      ]
    },
    { name: 'Reports', href: '/reports' },
    {
      name: 'Learn',
      href: '/learn',
      dropdownHeader: 'Documentation & Knowledge',
      items: [
        { name: 'Platform Documentation', href: '/learn', description: 'Technical guide, methodologies & Phase 3 roadmap' },
        { name: 'Ethical Security Policy', href: '/security', description: 'Authorized testing rules & defensive security pledge' },
        { name: 'Privacy & Data Governance', href: '/privacy', description: 'Zero-data-leakage architecture & local processing' }
      ]
    },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ];

  // Dynamically resolve active section from current location.pathname
  const isItemActive = (item) => {
    const path = location.pathname;
    if (item.name === 'Home') return path === '/';
    if (item.name === 'Security Tools') return path.startsWith('/security-tools') || path.startsWith('/tools');
    if (item.name === 'Investigation') return path.startsWith('/investigation') || path.startsWith('/dashboard') || path.startsWith('/history');
    if (item.name === 'Reports') return path.startsWith('/reports');
    if (item.name === 'Learn') return path.startsWith('/learn') || path.startsWith('/documentation') || path.startsWith('/security') || path.startsWith('/privacy');
    if (item.name === 'About') return path.startsWith('/about');
    if (item.name === 'Contact') return path.startsWith('/contact');
    return false;
  };

  // Close menus when route changes
  useEffect(() => {
    setOpenDropdown(null);
    setMobileMenuOpen(false);
    setMobileAccordion(null);
  }, [location.pathname]);

  // Handle outside clicks to close active dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpenDropdown(null);
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Handle keyboard Escape to dismiss dropdowns
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setOpenDropdown(null);
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Explicit dropdown toggle handler
  const handleDropdownToggle = (e, itemName) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenDropdown((prev) => (prev === itemName ? null : itemName));
  };

  return (
    <nav
      ref={navRef}
      style={{
        height: '80px',
        backgroundColor: 'var(--nav-bg)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-dark)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2.5rem',
        transition: 'background-color 0.25s ease, border-color 0.25s ease'
      }}
    >
      <style>{`
        @media (max-width: 1024px) {
          .nav-desktop-center { display: none !important; }
          .nav-mobile-toggle { display: flex !important; }
        }
        @media (min-width: 1025px) {
          .nav-desktop-center { display: flex !important; }
          .nav-mobile-toggle { display: none !important; }
        }
      `}</style>

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
            color: 'var(--text-contrast)',
            fontFamily: 'var(--font-display)',
            letterSpacing: '2px',
            textTransform: 'uppercase'
          }}>
            XELOVO
          </span>
        </Link>
      </div>

      {/* CENTER NAVIGATION (DESKTOP) */}
      <div className="nav-desktop-center" style={{ alignItems: 'center', gap: '2rem' }}>
        {navItems.map((item) => {
          const isActive = isItemActive(item);
          const hasDropdown = Boolean(item.items && item.items.length > 0);
          const isDropdownOpen = openDropdown === item.name;

          return (
            <div
              key={item.name}
              style={{ position: 'relative' }}
              onMouseEnter={() => {
                if (hasDropdown) setOpenDropdown(item.name);
              }}
              onMouseLeave={() => {
                if (hasDropdown) setOpenDropdown(null);
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Link
                  to={item.href}
                  onClick={() => setOpenDropdown(null)}
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
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.color = '#F2F5F9';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.color = '#B5C0D0';
                  }}
                >
                  {item.name}

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

                {/* Dropdown Chevron Toggle Button */}
                {hasDropdown && (
                  <button
                    type="button"
                    onClick={(e) => handleDropdownToggle(e, item.name)}
                    aria-label={`Toggle ${item.name} dropdown`}
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="true"
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '0.5rem 0 0.5rem 0.25rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      color: isActive || isDropdownOpen ? '#1688FF' : '#8494AB',
                      transition: 'transform 0.2s ease, color 0.2s ease',
                      transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}
                  >
                    <ChevronDown size={15} />
                  </button>
                )}
              </div>

              {/* SECTION-SPECIFIC DROPDOWN */}
              {hasDropdown && isDropdownOpen && (
                <div
                  role="menu"
                  aria-label={`${item.name} Submenu`}
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 4px)',
                    left: 0,
                    minWidth: '290px',
                    backgroundColor: 'var(--dropdown-bg)',
                    border: '1px solid var(--border-dark)',
                    borderRadius: '10px',
                    padding: '0.6rem 0',
                    boxShadow: 'var(--dropdown-shadow)',
                    zIndex: 110,
                    backdropFilter: 'blur(12px)',
                    transition: 'background-color 0.25s ease, border-color 0.25s ease'
                  }}
                >
                  <div style={{
                    padding: '0.4rem 1rem 0.5rem 1rem',
                    fontSize: '0.74rem',
                    color: '#8494AB',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    fontWeight: 700,
                    borderBottom: '1px solid rgba(45, 125, 255, 0.12)',
                    marginBottom: '0.35rem'
                  }}>
                    {item.dropdownHeader || item.name}
                  </div>

                  {item.items.map((subItem) => {
                    const isSubActive = location.pathname === subItem.href;

                    return (
                      <Link
                        key={subItem.href}
                        to={subItem.href}
                        onClick={() => setOpenDropdown(null)}
                        style={{
                          display: 'block',
                          padding: '0.55rem 1rem',
                          color: isSubActive ? 'var(--cyan)' : 'var(--text-main)',
                          backgroundColor: isSubActive ? 'rgba(22, 136, 255, 0.12)' : 'transparent',
                          borderLeft: isSubActive ? '3px solid var(--electric-blue)' : '3px solid transparent',
                          textDecoration: 'none',
                          transition: 'all 0.18s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (!isSubActive) {
                            e.currentTarget.style.backgroundColor = 'rgba(22, 136, 255, 0.12)';
                            e.currentTarget.style.color = 'var(--cyan)';
                            e.currentTarget.style.borderLeft = '3px solid var(--cyan)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSubActive) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = 'var(--text-main)';
                            e.currentTarget.style.borderLeft = '3px solid transparent';
                          }
                        }}
                      >
                        <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{subItem.name}</div>
                        {subItem.description && (
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.15rem', lineHeight: 1.3 }}>
                            {subItem.description}
                          </div>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* RIGHT SIDE ACTIONS */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          style={{
            background: isDark ? 'rgba(6, 20, 43, 0.6)' : 'rgba(227, 234, 245, 0.8)',
            border: '1px solid var(--border-dark)',
            borderRadius: '8px',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--cyan)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          {isDark ? <Moon size={18} /> : <Sun size={18} />}
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

        {/* Mobile Hamburger Menu Toggle */}
        <button
          className="nav-mobile-toggle"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label={mobileMenuOpen ? 'Close mobile menu' : 'Open mobile menu'}
          aria-expanded={mobileMenuOpen}
          style={{
            background: 'rgba(6, 20, 43, 0.6)',
            border: '1px solid rgba(45, 125, 255, 0.25)',
            borderRadius: '8px',
            width: '40px',
            height: '40px',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#19D7E8',
            cursor: 'pointer'
          }}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* MOBILE ACCORDION DRAWER */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'absolute',
            top: '80px',
            left: 0,
            right: 0,
            backgroundColor: 'var(--nav-bg)',
            borderBottom: '1px solid var(--border-dark)',
            padding: '1.5rem',
            maxHeight: 'calc(100vh - 80px)',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            boxShadow: 'var(--dropdown-shadow)',
            zIndex: 99,
            backdropFilter: 'blur(16px)'
          }}
        >
          {/* Mobile Theme Toggle Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 600 }}>Theme Mode</span>
            <button
              type="button"
              onClick={toggleTheme}
              style={{
                background: isDark ? 'rgba(6, 20, 43, 0.6)' : 'rgba(227, 234, 245, 0.8)',
                border: '1px solid var(--border-dark)',
                borderRadius: '8px',
                padding: '0.4rem 0.8rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'var(--cyan)',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              {isDark ? <><Moon size={16} /> Dark</> : <><Sun size={16} /> Light</>}
            </button>
          </div>

          {navItems.map((item) => {
            const isActive = isItemActive(item);
            const hasDropdown = Boolean(item.items && item.items.length > 0);
            const isAccordionOpen = mobileAccordion === item.name;

            return (
              <div key={`mobile-${item.name}`} style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Link
                    to={item.href}
                    onClick={() => {
                      if (!hasDropdown) {
                        setMobileMenuOpen(false);
                      }
                    }}
                    style={{
                      color: isActive ? 'var(--cyan)' : 'var(--text-main)',
                      fontSize: '1rem',
                      fontWeight: isActive ? 700 : 500,
                      textDecoration: 'none'
                    }}
                  >
                    {item.name}
                  </Link>

                  {hasDropdown && (
                    <button
                      type="button"
                      onClick={() => setMobileAccordion((prev) => (prev === item.name ? null : item.name))}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--cyan)',
                        cursor: 'pointer',
                        padding: '0.25rem'
                      }}
                      aria-label={`Toggle ${item.name} mobile menu`}
                    >
                      <ChevronDown
                        size={18}
                        style={{
                          transform: isAccordionOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s ease'
                        }}
                      />
                    </button>
                  )}
                </div>

                {/* Sub-items accordion */}
                {hasDropdown && isAccordionOpen && (
                  <div style={{ marginTop: '0.5rem', paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {item.items.map((subItem) => (
                      <Link
                        key={`mobile-sub-${subItem.href}`}
                        to={subItem.href}
                        onClick={() => setMobileMenuOpen(false)}
                        style={{
                          color: location.pathname === subItem.href ? 'var(--cyan)' : 'var(--text-secondary)',
                          fontSize: '0.88rem',
                          textDecoration: 'none',
                          padding: '0.35rem 0'
                        }}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </nav>
  );
}
