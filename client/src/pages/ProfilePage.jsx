import React from 'react';
import { User, Shield, Key, Clock, Award } from 'lucide-react';

export default function ProfilePage({ user }) {
  const current = user || { fullName: 'Security Analyst', email: 'analyst@xelovo.io', role: 'lead_analyst' };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>Analyst Profile</h1>
        <p style={{ fontSize: '0.95rem', color: '#9CA3AF' }}>User identity, authentication credentials, and platform role</p>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', backgroundColor: '#0F141C', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '1.25rem' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(0, 240, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00F0FF' }}>
            <User size={32} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.3rem', margin: 0 }}>{current.fullName || current.full_name}</h2>
            <span style={{ fontSize: '0.85rem', color: '#00F0FF', fontFamily: 'var(--font-mono)' }}>{current.email}</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.88rem' }}>
          <div>
            <span style={{ color: '#6B7280' }}>Role Assignment:</span>
            <p style={{ color: '#FFFFFF', fontWeight: 600, marginTop: '0.2rem' }}>{current.role || 'Security Analyst'}</p>
          </div>
          <div>
            <span style={{ color: '#6B7280' }}>Platform Tier:</span>
            <p style={{ color: '#10B981', fontWeight: 600, marginTop: '0.2rem' }}>XELOVO Enterprise / Pro</p>
          </div>
        </div>
      </div>
    </div>
  );
}
