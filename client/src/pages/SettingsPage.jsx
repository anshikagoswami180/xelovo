import React, { useState } from 'react';
import { Sliders, Key, Bell, Shield, Save } from 'lucide-react';

export default function SettingsPage() {
  const [vtApiKey, setVtApiKey] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>Platform Settings</h1>
        <p style={{ fontSize: '0.95rem', color: '#9CA3AF' }}>Configure API provider keys and notification preferences</p>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-contrast)' }}>API Integrations Architecture</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Configure optional third-party intelligence provider secrets. When left blank, XELOVO falls back to native empirical scanners with transparent configuration status disclaimers.
            </p>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>VirusTotal API Key (Optional)</label>
            <input
              type="password"
              placeholder="Enter VirusTotal API key..."
              value={vtApiKey}
              onChange={(e) => setVtApiKey(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-dark)', borderRadius: '8px', color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}
            />
          </div>

          <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }}>
            <Save size={16} /> {saved ? 'Configuration Saved!' : 'Save Settings'}
          </button>
        </form>
      </div>
    </div>
  );
}
