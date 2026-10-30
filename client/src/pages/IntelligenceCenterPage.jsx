import React, { useState, useEffect } from 'react';
import { Shield, Zap, TrendingUp, Search, Sliders, ArrowRightLeft } from 'lucide-react';
import { apiFetchIntelligenceOverview } from '../utils/api';

export default function IntelligenceCenterPage() {
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await apiFetchIntelligenceOverview();
        setOverview(data);
      } catch (e){}
    }
    load();
  }, []);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <span className="badge badge-info">Phase 2 Intelligence Center</span>
        <h1 style={{ fontSize: '2rem', marginTop: '0.4rem' }}>Central Security Intelligence Command</h1>
        <p style={{ fontSize: '0.95rem', color: '#9CA3AF' }}>Correlated threat telemetry, security trends, and multi-scan comparisons</p>
      </div>

      {/* Grid Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Main Timeline Card */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#FFFFFF' }}>Cross-Target Security Timeline</h3>
          {overview && overview.recentScans && overview.recentScans.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {overview.recentScans.map((scan) => (
                <div key={scan.id} style={{ padding: '0.85rem', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', borderLeft: '3px solid #00F0FF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ fontSize: '0.9rem', color: '#FFFFFF' }}>{scan.tool_id}</strong>
                    <span style={{ fontSize: '0.8rem', color: '#00F0FF', marginLeft: '0.75rem', fontFamily: 'var(--font-mono)' }}>{scan.target}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{new Date(scan.created_at).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>No timeline events recorded yet.</p>
          )}
        </div>

        {/* Saved Investigations Card */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#FFFFFF' }}>Saved Investigations</h3>
          {overview && overview.investigations && overview.investigations.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {overview.investigations.map(inv => (
                <div key={inv.id} style={{ padding: '0.75rem', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px' }}>
                  <strong style={{ fontSize: '0.85rem', color: '#FFFFFF' }}>{inv.title}</strong>
                  <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: '0.2rem 0 0 0' }}>{inv.description || 'No description'}</p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '0.82rem', color: '#9CA3AF' }}>No saved investigations yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
