import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle, Lock, Unlock, Compass, ExternalLink } from 'lucide-react';

export default function LinkDnaVisualizer({ linkDnaData }) {
  if (!linkDnaData || !linkDnaData.linkDnaProfile) {
    return (
      <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: '#9CA3AF' }}>
        No Link DNA profile loaded.
      </div>
    );
  }

  const { identity, path, redirectBehavior, trustSignals, riskSignals, reputation } = linkDnaData.linkDnaProfile;

  const getBadgeStyle = (level) => {
    switch (level) {
      case 'Critical': return 'badge-critical';
      case 'High': return 'badge-high';
      case 'Guarded': return 'badge-guarded';
      case 'Low': return 'badge-low';
      default: return 'badge-safe';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Reputation & Verdict Header Card */}
      <div className="glass-panel" style={{
        padding: '1.5rem',
        border: `1px solid ${reputation.riskLevel === 'Critical' || reputation.riskLevel === 'High' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(0, 240, 255, 0.25)'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: reputation.riskLevel === 'Critical' || reputation.riskLevel === 'High' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: reputation.riskLevel === 'Critical' || reputation.riskLevel === 'High' ? '#EF4444' : '#10B981',
            fontSize: '1.4rem',
            fontWeight: 800,
            fontFamily: 'var(--font-mono)'
          }}>
            {reputation.score}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span className={`badge ${getBadgeStyle(reputation.riskLevel)}`}>{reputation.riskLevel} Risk</span>
              <span style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>Link DNA Score: {reputation.score}/100</span>
            </div>
            <h2 style={{ fontSize: '1.3rem', marginTop: '0.4rem' }}>{reputation.verdict}</h2>
            <p style={{ fontSize: '0.8rem', color: '#9CA3AF', margin: '0.2rem 0 0 0', wordBreak: 'break-all' }}>
              Target URL: <code style={{ color: '#00F0FF', fontFamily: 'var(--font-mono)' }}>{linkDnaData.url}</code>
            </p>
          </div>
        </div>
      </div>

      {/* DNA Helix Strand Component Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
        {/* 1. Structural Identity */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <h4 style={{ fontSize: '0.95rem', color: '#00F0FF', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Compass size={18} /> Structural Identity
          </h4>
          <div style={{ fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '0.3rem' }}>
              <span style={{ color: '#9CA3AF' }}>Hostname:</span>
              <span style={{ color: '#FFFFFF', fontFamily: 'var(--font-mono)' }}>{identity.hostname}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '0.3rem' }}>
              <span style={{ color: '#9CA3AF' }}>Protocol:</span>
              <span style={{ color: identity.protocol === 'https:' ? '#10B981' : '#EF4444', fontFamily: 'var(--font-mono)' }}>{identity.protocol}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '0.3rem' }}>
              <span style={{ color: '#9CA3AF' }}>TLD:</span>
              <span style={{ color: '#FFFFFF', fontFamily: 'var(--font-mono)' }}>.{identity.tld}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#9CA3AF' }}>Homograph Deception:</span>
              <span style={{ color: identity.homographRisk ? '#EF4444' : '#10B981' }}>{identity.homographRisk ? 'Detected' : 'None'}</span>
            </div>
          </div>
        </div>

        {/* 2. Path & Parameter Analysis */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <h4 style={{ fontSize: '0.95rem', color: '#3B82F6', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Lock size={18} /> Path & Obfuscation
          </h4>
          <div style={{ fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '0.3rem' }}>
              <span style={{ color: '#9CA3AF' }}>Path Length:</span>
              <span style={{ color: '#FFFFFF', fontFamily: 'var(--font-mono)' }}>{path.length} chars</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '0.3rem' }}>
              <span style={{ color: '#9CA3AF' }}>Path String:</span>
              <span style={{ color: '#FFFFFF', fontFamily: 'var(--font-mono)' }}>{path.pathname || '/'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#9CA3AF' }}>Double Encoding:</span>
              <span style={{ color: path.hasObfuscation ? '#EF4444' : '#10B981' }}>{path.hasObfuscation ? 'Detected' : 'None'}</span>
            </div>
          </div>
        </div>

        {/* 3. Redirect Behavior */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <h4 style={{ fontSize: '0.95rem', color: '#8B5CF6', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ExternalLink size={18} /> Redirect Trajectory
          </h4>
          <div style={{ fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '0.3rem' }}>
              <span style={{ color: '#9CA3AF' }}>Total Hops:</span>
              <span style={{ color: '#FFFFFF', fontFamily: 'var(--font-mono)' }}>{redirectBehavior.totalHops}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '0.3rem' }}>
              <span style={{ color: '#9CA3AF' }}>External Domain Changes:</span>
              <span style={{ color: redirectBehavior.domainChanges > 0 ? '#F59E0B' : '#10B981', fontFamily: 'var(--font-mono)' }}>{redirectBehavior.domainChanges}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Signals Evidence List */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h4 style={{ fontSize: '1rem', color: '#FFFFFF', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldAlert size={20} color="#EF4444" /> Empirical Risk Evidence ({riskSignals.length})
        </h4>

        {riskSignals.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {riskSignals.map((sig, idx) => (
              <div 
                key={idx}
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  borderRadius: '8px',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem'
                }}
              >
                <AlertTriangle size={18} color="#EF4444" style={{ marginTop: '0.1rem' }} />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className={`badge ${getBadgeStyle(sig.level)}`}>{sig.level}</span>
                    <strong style={{ fontSize: '0.85rem', color: '#FFFFFF' }}>{sig.code}</strong>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#D1D5DB', margin: '0.3rem 0 0 0' }}>{sig.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '8px', color: '#10B981', fontSize: '0.85rem' }}>
            No high-risk phishing indicators detected for this URL.
          </div>
        )}
      </div>
    </div>
  );
}
