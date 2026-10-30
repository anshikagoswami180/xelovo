import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Star, Network, Eye, Shield, Zap, Lock, Terminal, FileText, Globe, Code, Hash, Key, CheckCircle } from 'lucide-react';

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState(['exposure-map', 'link-dna']);
  const navigate = useNavigate();

  const allTools = [
    // TOP 4 FLAGSHIPS
    {
      id: 'exposure-map',
      name: 'XELOVO Exposure Map',
      category: 'Intelligence & OSINT',
      flagship: true,
      difficulty: 'Advanced',
      authRequired: false,
      description: 'Build an interactive exposure constellation graph mapping domains, subdomains, certificates, and exposures.',
      icon: Network
    },
    {
      id: 'link-dna',
      name: 'XELOVO Link DNA',
      category: 'Web Security',
      flagship: true,
      difficulty: 'Intermediate',
      authRequired: false,
      description: 'Deconstruct suspicious URLs into Link DNA profiles to evaluate phishing risk and domain spoofing.',
      icon: Eye
    },
    {
      id: 'shadow-surface',
      name: 'XELOVO Shadow Surface',
      category: 'Network Analysis',
      flagship: true,
      difficulty: 'Advanced',
      authRequired: true,
      description: 'Defensive attack surface visibility analyzing expected vs observable exposure across 5 structural layers.',
      icon: Shield
    },
    {
      id: 'signal-zero',
      name: 'XELOVO Signal Zero',
      category: 'Intelligence & OSINT',
      flagship: true,
      difficulty: 'Expert',
      authRequired: false,
      description: 'Early-warning threat intelligence timeline cross-correlating evidence across XELOVO scanners.',
      icon: Zap
    },

    // OTHER 14 FUNCTIONAL TOOLS
    {
      id: 'header-inspector',
      name: 'Security Header Inspector',
      category: 'Web Security',
      flagship: false,
      difficulty: 'Beginner',
      authRequired: false,
      description: 'Analyze CSP, HSTS, X-Frame-Options, Referrer-Policy, and MIME security headers.',
      icon: Lock
    },
    {
      id: 'tls-inspector',
      name: 'TLS & Certificate Inspector',
      category: 'Network Analysis',
      flagship: false,
      difficulty: 'Intermediate',
      authRequired: false,
      description: 'Inspect HTTPS availability, SSL certificate chain, issuer, SAN domains, and expiration.',
      icon: Shield
    },
    {
      id: 'domain-intelligence',
      name: 'Domain Intelligence',
      category: 'Intelligence & OSINT',
      flagship: false,
      difficulty: 'Intermediate',
      authRequired: false,
      description: 'Query public DNS records (A, AAAA, MX, TXT, DMARC, NS) and domain infrastructure.',
      icon: Globe
    },
    {
      id: 'redirect-trace',
      name: 'Redirect Trace Engine',
      category: 'Web Security',
      flagship: false,
      difficulty: 'Beginner',
      authRequired: false,
      description: 'Safely trace URL redirect chains step-by-step to detect open redirects or HTTPS downgrades.',
      icon: Terminal
    },
    {
      id: 'privacy-scanner',
      name: 'Privacy & Tracker Scanner',
      category: 'Privacy',
      flagship: false,
      difficulty: 'Intermediate',
      authRequired: false,
      description: 'Detect third-party trackers, analytics pixels, ad scripts, cookies, and privacy policy links.',
      icon: Eye
    },
    {
      id: 'cookie-inspector',
      name: 'Cookie Security Inspector',
      category: 'Privacy',
      flagship: false,
      difficulty: 'Beginner',
      authRequired: false,
      description: 'Inspect cookie attributes including Secure, HttpOnly, SameSite policy, and expiration.',
      icon: Lock
    },
    {
      id: 'digital-footprint',
      name: 'Digital Footprint Check',
      category: 'Intelligence & OSINT',
      flagship: false,
      difficulty: 'Intermediate',
      authRequired: false,
      description: 'Investigate authorized public online footprint using legitimate OSINT techniques.',
      icon: Globe
    },
    {
      id: 'breach-check',
      name: 'Breach Exposure Check',
      category: 'Intelligence & OSINT',
      flagship: false,
      difficulty: 'Beginner',
      authRequired: false,
      description: 'Check authorized email addresses against known breach datasets via k-Anonymity API standard.',
      icon: Shield
    },
    {
      id: 'file-hash',
      name: 'File Hash Intelligence',
      category: 'Utilities',
      flagship: false,
      difficulty: 'Beginner',
      authRequired: false,
      description: 'Generate SHA-256, SHA-1, MD5 file hashes and check malware reputation databases.',
      icon: Hash
    },
    {
      id: 'encoding-utility',
      name: 'Encoding & Hash Utility',
      category: 'Utilities',
      flagship: false,
      difficulty: 'Beginner',
      authRequired: false,
      description: 'Base64 encode/decode, URL encode/decode, SHA-256/512 cryptographic text hashing.',
      icon: Code
    },
    {
      id: 'metadata-inspector',
      name: 'Metadata Inspector & Cleaner',
      category: 'Privacy',
      flagship: false,
      difficulty: 'Intermediate',
      authRequired: false,
      description: 'Inspect image EXIF properties, GPS location tags, document author tags, and sanitize files.',
      icon: FileText
    },
    {
      id: 'security-header-generator',
      name: 'Security Header Generator',
      category: 'Utilities',
      flagship: false,
      difficulty: 'Beginner',
      authRequired: false,
      description: 'Generate copy-paste security header configurations for Nginx, Apache, Node.js, and Next.js.',
      icon: Code
    },
    {
      id: 'password-analyzer',
      name: 'Password Strength Analyzer',
      category: 'Utilities',
      flagship: false,
      difficulty: 'Beginner',
      authRequired: false,
      description: '100% local client-side entropy calculation, character diversity, and pattern analysis.',
      icon: Key
    },
    {
      id: 'report-builder',
      name: 'Security Report Builder',
      category: 'Utilities',
      flagship: false,
      difficulty: 'Intermediate',
      authRequired: false,
      description: 'Convert scan findings into professional HTML/PDF security reports for stakeholders.',
      icon: FileText
    }
  ];

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const categories = ['All', 'Intelligence & OSINT', 'Web Security', 'Privacy', 'Network Analysis', 'Utilities'];

  const filteredTools = allTools.filter(tool => {
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>XELOVO Security Tool Directory</h1>
        <p style={{ fontSize: '0.95rem', color: '#9CA3AF' }}>18 Real Security Intelligence Tools for Authorized Defensive Testing</p>
      </div>

      {/* Search & Category Tabs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Search Bar */}
        <div className="glass-panel" style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Search size={20} color="#00F0FF" />
          <input
            type="text"
            placeholder="Search tools by name, keyword, or capability..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', fontSize: '0.95rem', width: '100%', outline: 'none' }}
          />
        </div>

        {/* Category Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                backgroundColor: selectedCategory === cat ? 'rgba(0, 240, 255, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                border: selectedCategory === cat ? '1px solid #00F0FF' : '1px solid rgba(255, 255, 255, 0.08)',
                color: selectedCategory === cat ? '#00F0FF' : '#9CA3AF',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tool Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {filteredTools.map((tool) => {
          const IconComp = tool.icon;
          const isFav = favorites.includes(tool.id);

          return (
            <div
              key={tool.id}
              className="glass-panel"
              onClick={() => navigate(`/tools/${tool.id}`)}
              style={{
                padding: '1.5rem',
                border: tool.flagship ? '1px solid rgba(0, 240, 255, 0.3)' : '1px solid var(--border-subtle)',
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    backgroundColor: tool.flagship ? 'rgba(0, 240, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                    padding: '0.65rem',
                    borderRadius: '10px',
                    color: tool.flagship ? '#00F0FF' : '#3B82F6'
                  }}>
                    <IconComp size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', margin: 0, color: '#FFFFFF' }}>{tool.name}</h3>
                    <span style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>{tool.category}</span>
                  </div>
                </div>

                <button
                  onClick={(e) => toggleFavorite(tool.id, e)}
                  style={{ background: 'none', border: 'none', color: isFav ? '#F59E0B' : '#4B5563', cursor: 'pointer', padding: '0.2rem' }}
                >
                  <Star size={18} fill={isFav ? '#F59E0B' : 'none'} />
                </button>
              </div>

              <p style={{ fontSize: '0.85rem', color: '#9CA3AF', margin: 0 }}>{tool.description}</p>

              <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <span className="badge badge-info">{tool.difficulty}</span>
                  {tool.authRequired && <span className="badge badge-high">Auth Required</span>}
                  {tool.flagship && <span className="badge badge-safe">Flagship</span>}
                </div>
                <span style={{ fontSize: '0.8rem', color: '#00F0FF', fontWeight: 600 }}>Launch &rarr;</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
