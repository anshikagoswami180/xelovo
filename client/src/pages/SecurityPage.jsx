import React from 'react';
import { ShieldCheck, Lock, AlertTriangle } from 'lucide-react';

export default function SecurityPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>Ethical Security Pledge & Policy</h1>
        <p style={{ fontSize: '0.95rem', color: '#9CA3AF' }}>XELOVO rules of engagement and defensive testing governance</p>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', backgroundColor: '#0F141C', display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.9rem', color: '#D1D5DB', lineHeight: 1.6 }}>
        <h3 style={{ fontSize: '1.1rem', color: '#00F0FF' }}>Authorized Defensive Testing Only</h3>
        <p>
          XELOVO is built strictly for authorized defensive security analysis, domain exposure mapping, link risk evaluation, and infrastructure hardening. All tools execute standard non-destructive HTTP/DNS/TLS queries.
        </p>
        <h3 style={{ fontSize: '1.1rem', color: '#00F0FF' }}>Zero Fabricated Findings</h3>
        <p>
          XELOVO strictly adheres to empirical telemetry. Scan results are never simulated or fabricated with fake risk metrics.
        </p>
      </div>
    </div>
  );
}
