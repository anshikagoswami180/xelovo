import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { History, Play, Terminal } from 'lucide-react';
import { apiFetchScanHistory } from '../utils/api';

export default function HistoryPage() {
  const [scans, setScans] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await apiFetchScanHistory();
        setScans(res.scans || []);
      } catch (e){}
    }
    load();
  }, []);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>Scan History & Audit Logs</h1>
        <p style={{ fontSize: '0.95rem', color: '#9CA3AF' }}>Complete empirical record of executed security intelligence scans</p>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#6B7280' }}>
              <th style={{ padding: '0.75rem 0.5rem' }}>Scan ID</th>
              <th style={{ padding: '0.75rem 0.5rem' }}>Tool Engine</th>
              <th style={{ padding: '0.75rem 0.5rem' }}>Target</th>
              <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
              <th style={{ padding: '0.75rem 0.5rem' }}>Executed Date</th>
              <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Re-run</th>
            </tr>
          </thead>
          <tbody>
            {scans.map((s) => (
              <tr key={s.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                <td style={{ padding: '0.75rem 0.5rem', color: '#6B7280', fontFamily: 'var(--font-mono)' }}>{s.id}</td>
                <td style={{ padding: '0.75rem 0.5rem', color: '#FFFFFF', fontWeight: 600 }}>{s.tool_id}</td>
                <td style={{ padding: '0.75rem 0.5rem', color: '#00F0FF', fontFamily: 'var(--font-mono)' }}>{s.target}</td>
                <td style={{ padding: '0.75rem 0.5rem' }}><span className="badge badge-safe">{s.status}</span></td>
                <td style={{ padding: '0.75rem 0.5rem', color: '#9CA3AF', fontSize: '0.78rem' }}>{new Date(s.created_at).toLocaleString()}</td>
                <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>
                  <Link to={`/tools/${s.tool_id}?target=${encodeURIComponent(s.target)}`} className="btn-secondary" style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}>
                    <Play size={12} /> Re-run
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
