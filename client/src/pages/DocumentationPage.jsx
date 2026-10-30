import React from 'react';
import { BookOpen, Shield, Code, Terminal, Layers } from 'lucide-react';

export default function DocumentationPage() {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <span className="badge badge-info">Platform Architecture & Reference</span>
        <h1 style={{ fontSize: '2rem', marginTop: '0.4rem' }}>XELOVO Documentation</h1>
        <p style={{ fontSize: '0.95rem', color: '#9CA3AF' }}>Technical guide, methodology, API integration, and Phase 3 roadmap</p>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <section>
          <h2 style={{ fontSize: '1.3rem', color: '#00F0FF', marginBottom: '0.5rem' }}>1. Platform Overview</h2>
          <p style={{ fontSize: '0.9rem', color: '#D1D5DB', lineHeight: 1.6 }}>
            XELOVO is a production cybersecurity and ethical threat intelligence platform designed for defensive security analysts, developers, and security auditors. It provides real-time empirical network telemetry without mock or fabricated vulnerability claims.
          </p>
        </section>

        <section style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1.5rem' }}>
          <h2 style={{ fontSize: '1.3rem', color: '#3B82F6', marginBottom: '0.5rem' }}>2. Ethical Hacking & Authorization Controls</h2>
          <p style={{ fontSize: '0.9rem', color: '#D1D5DB', lineHeight: 1.6 }}>
            All target-specific security assessments require explicit user authorization confirmation. XELOVO performs defensive, non-destructive public DNS, TLS, HTTP response header, and link structure inspections. No unauthorized exploits or invasive penetration attacks are conducted.
          </p>
        </section>

        <section style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1.5rem' }}>
          <h2 style={{ fontSize: '1.3rem', color: '#8B5CF6', marginBottom: '0.5rem' }}>3. Flagship Methodologies</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.88rem', color: '#D1D5DB', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li><strong>XELOVO Exposure Map:</strong> Renders target domains and subdomains as node-link constellation graphs.</li>
            <li><strong>XELOVO Link DNA:</strong> Deconstructs URLs across identity, path, redirect, trust, and risk signals.</li>
            <li><strong>XELOVO Shadow Surface:</strong> Compares expected organizational exposure vs publicly observable attack surface across 5 structural layers.</li>
            <li><strong>XELOVO Signal Zero:</strong> Cross-correlates multi-scanner findings into an early-warning signal timeline.</li>
          </ul>
        </section>

        <section style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1.5rem' }}>
          <h2 style={{ fontSize: '1.3rem', color: '#F59E0B', marginBottom: '0.5rem' }}>4. Phase 3 Technical Roadmap</h2>
          <p style={{ fontSize: '0.9rem', color: '#D1D5DB', lineHeight: 1.6 }}>
            Upcoming developments include automated scheduled domain monitoring, continuous TLS expiration webhooks, custom enterprise SIEM integrations, and expanded local AI model sidecars.
          </p>
        </section>
      </div>
    </div>
  );
}
