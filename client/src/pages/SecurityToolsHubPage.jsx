import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Shield, Eye, Lock, Globe, Terminal, FileText, ArrowRight, ShieldCheck, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

export default function SecurityToolsHubPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();

  const toolsList = [
    {
      id: 'phishing-analyzer',
      name: 'Phishing Analyzer',
      category: 'Phishing & Email',
      badge: 'Real-time Rule Engine',
      difficulty: 'Intermediate',
      description: 'Analyze suspicious URLs, email subjects, senders, and messages for phishing indicators, lookalike domain spoofing, and credential harvesting patterns.',
      route: '/security-tools/phishing-analyzer',
      icon: Eye,
      color: '#1688FF'
    },
    {
      id: 'scam-analyzer',
      name: 'Scam Protection Analyzer',
      category: 'Scams & Messages',
      badge: 'Pattern Recognition',
      difficulty: 'Intermediate',
      description: 'Detect financial scams, fake job offers, impersonation tactics, advance payment demands, and emotional manipulation patterns in text & chat messages.',
      route: '/security-tools/scam-analyzer',
      icon: ShieldAlert,
      color: '#19D7E8'
    },
    {
      id: 'image-analyzer',
      name: 'Image Scam & Manipulation Analyzer',
      category: 'Media & Files',
      badge: 'Metadata & Artifacts',
      difficulty: 'Advanced',
      description: 'Inspect uploaded images (JPG, PNG, WEBP) for EXIF metadata headers, compression artifacts, aspect anomalies, and potential visual manipulation indicators.',
      route: '/security-tools/image-analyzer',
      icon: FileText,
      color: '#8B5CF6'
    },
    {
      id: 'header-inspector',
      name: 'Security Header Inspector',
      category: 'Web Security',
      badge: 'HTTP Audit',
      difficulty: 'Beginner',
      description: 'Inspect live HTTP response headers (CSP, HSTS, X-Frame-Options, Referrer-Policy) and check for web server banner disclosures.',
      route: '/tools/header-inspector',
      icon: Lock,
      color: '#10B981'
    },
    {
      id: 'tls-inspector',
      name: 'TLS & Certificate Inspector',
      category: 'Web Security',
      badge: 'Network Protocol',
      difficulty: 'Intermediate',
      description: 'Inspect HTTPS certificate validity, issuer trust chain, Subject Alternative Names (SANs), cipher strength, and expiration timelines.',
      route: '/tools/tls-inspector',
      icon: ShieldCheck,
      color: '#F59E0B'
    },
    {
      id: 'domain-intelligence',
      name: 'Domain & DNS Intelligence',
      category: 'OSINT & DNS',
      badge: 'Public OSINT',
      difficulty: 'Intermediate',
      description: 'Query public DNS records (A, AAAA, MX, TXT, DMARC, NS, SOA) and discover public subdomains for threat assessment.',
      route: '/tools/domain-intelligence',
      icon: Globe,
      color: '#1688FF'
    }
  ];

  const categories = ['All', 'Phishing & Email', 'Scams & Messages', 'Media & Files', 'Web Security', 'OSINT & DNS'];

  const filteredTools = toolsList.filter(tool => {
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '3rem 2rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', width: 'fit-content' }}>
          <span style={{ fontSize: '0.8rem', color: '#19D7E8', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            XELOVO SECURITY ARCHITECTURE
          </span>
        </div>
        <h1 style={{ fontSize: '2.4rem', color: '#F2F5F9', fontFamily: 'var(--font-display)', fontWeight: 800 }}>
          Security Analysis Tools Hub
        </h1>
        <p style={{ fontSize: '1rem', color: '#B5C0D0', maxWidth: '720px', lineHeight: 1.6 }}>
          Practical, transparent security tools designed for threat awareness, phishing detection, scam analysis, and digital exposure evaluation.
        </p>
      </div>

      {/* Search & Category Filter Row */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div className="xelavo-card" style={{ padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <Search size={22} color="#19D7E8" />
          <input
            type="text"
            placeholder="Search tools by capability, keyword, or indicator (e.g. phishing, scam, metadata, headers)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#F2F5F9',
              fontSize: '0.95rem',
              width: '100%',
              outline: 'none',
              fontFamily: 'var(--font-sans)'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                backgroundColor: selectedCategory === cat ? 'rgba(22, 136, 255, 0.2)' : 'rgba(9, 27, 54, 0.7)',
                border: selectedCategory === cat ? '1px solid #19D7E8' : '1px solid rgba(45, 125, 255, 0.25)',
                color: selectedCategory === cat ? '#19D7E8' : '#B5C0D0',
                padding: '0.45rem 1rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tools Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {filteredTools.map((tool) => {
          const IconComp = tool.icon;
          return (
            <div
              key={tool.id}
              className="xelavo-card"
              onClick={() => navigate(tool.route)}
              style={{
                padding: '1.75rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1.25rem',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(6, 20, 43, 0.8)',
                    border: `1px solid ${tool.color}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: tool.color,
                    boxShadow: `0 0 15px ${tool.color}33`
                  }}>
                    <IconComp size={26} />
                  </div>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: tool.color,
                    backgroundColor: `${tool.color}1A`,
                    padding: '0.25rem 0.65rem',
                    borderRadius: '6px',
                    border: `1px solid ${tool.color}40`
                  }}>
                    {tool.badge}
                  </span>
                </div>

                <div>
                  <h3 style={{ fontSize: '1.2rem', color: '#F2F5F9', margin: '0 0 0.3rem 0', fontWeight: 700 }}>
                    {tool.name}
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: '#8494AB', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Category: {tool.category}
                  </span>
                </div>

                <p style={{ fontSize: '0.88rem', color: '#B5C0D0', lineHeight: 1.5, margin: 0 }}>
                  {tool.description}
                </p>
              </div>

              <div style={{
                paddingTop: '0.85rem',
                borderTop: '1px solid rgba(45, 125, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span style={{ fontSize: '0.78rem', color: '#B5C0D0' }}>
                  Level: <strong style={{ color: '#F2F5F9' }}>{tool.difficulty}</strong>
                </span>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#19D7E8', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  Launch Analysis <ArrowRight size={16} />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
