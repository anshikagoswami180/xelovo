import React from 'react';
import { Shield, Eye, Lock } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>Privacy Policy & Data Handling</h1>
        <p style={{ fontSize: '0.95rem', color: '#9CA3AF' }}>User data isolation and telemetry processing transparency</p>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
        <p>
          XELOVO prioritizes privacy and security data isolation. Passwords entered in the Password Strength Analyzer are calculated 100% locally in the browser and never transmitted over the network. Scan telemetry is isolated per authenticated analyst account.
        </p>
      </div>
    </div>
  );
}
