import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Network, Eye, Zap, Activity, Clock, Star, FileText, ArrowRight, Play } from 'lucide-react';
import { apiFetchIntelligenceOverview } from '../utils/api';

export default function DashboardPage({ user, onOpenCommand }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        const res = await apiFetchIntelligenceOverview();
        setData(res);
      } catch (e) {
        console.error('Failed loading dashboard overview', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const flagships = [
    { id: 'exposure-map', name: 'Exposure Map', icon: Network, color: '#00F0FF' },
    { id: 'link-dna', name: 'Link DNA', icon: Eye, color: '#3B82F6' },
    { id: 'shadow-surface', name: 'Shadow Surface', icon: Shield, color: '#8B5CF6' },
    { id: 'signal-zero', name: 'Signal Zero', icon: Zap, color: '#F59E0B' }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{
        padding: '2rem',
        backgroundColor: '#0F141C',
        border: '1px solid rgba(0, 240, 255, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <span className="badge badge-info">Analyst Station</span>
          <h1 style={{ fontSize: '1.8rem', marginTop: '0.4rem' }}>
            Welcome back, {user ? user.fullName || user.full_name : 'Security Analyst'}
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#9CA3AF', marginTop: '0.25rem' }}>
            Empirical security telemetry & threat intelligence command
          </p>
        </div>
        <button onClick={onOpenCommand} className="btn-primary" style={{ padding: '0.75rem 1.25rem' }}>
          <Zap size={18} /> Quick-Launch X-CORE COMMAND
        </button>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Executed Scans</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#00F0FF', marginTop: '0.4rem', fontFamily: 'var(--font-mono)' }}>
            {data && data.metrics ? data.metrics.totalScans : 0}
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Investigations</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#3B82F6', marginTop: '0.4rem', fontFamily: 'var(--font-mono)' }}>
            {data && data.metrics ? data.metrics.activeInvestigations : 0}
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Favorite Tools</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#8B5CF6', marginTop: '0.4rem', fontFamily: 'var(--font-mono)' }}>
            {data && data.metrics ? data.metrics.favoriteToolsCount : 0}
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Security Posture</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#10B981', marginTop: '0.6rem' }}>
            {data && data.metrics ? data.metrics.securityStatus : 'Active Monitoring'}
          </div>
        </div>
      </div>

      {/* Flagship Quick Launch Grid */}
      <div>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#FFFFFF' }}>Flagship Intelligence Launchers</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          {flagships.map((f) => {
            const IconComp = f.icon;
            return (
              <div 
                key={f.id}
                className="glass-panel"
                onClick={() => navigate(`/tools/${f.id}`)}
                style={{
                  padding: '1.25rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  transition: 'border-color 0.2s ease'
                }}
              >
                <div style={{
                  backgroundColor: `rgba(${f.color === '#00F0FF' ? '0, 240, 255' : f.color === '#3B82F6' ? '59, 130, 246' : '245, 158, 11'}, 0.15)`,
                  padding: '0.75rem',
                  borderRadius: '10px',
                  color: f.color
                }}>
                  <IconComp size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', margin: 0, color: '#FFFFFF' }}>{f.name}</h4>
                  <span style={{ fontSize: '0.75rem', color: f.color, fontWeight: 500 }}>Launch Workstation &rarr;</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Scans Table */}
      <div className="glass-panel" style={{ padding: '1.5rem', backgroundColor: '#0F141C' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Recent Security Investigations</h3>
          <Link to="/history" style={{ fontSize: '0.82rem', color: '#00F0FF', textDecoration: 'none' }}>View Full Log &rarr;</Link>
        </div>

        {data && data.recentScans && data.recentScans.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#6B7280' }}>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Tool</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Target</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Timestamp</th>
                  <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.recentScans.map((scan) => (
                  <tr key={scan.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <td style={{ padding: '0.75rem 0.5rem', color: '#FFFFFF', fontWeight: 600 }}>{scan.tool_id}</td>
                    <td style={{ padding: '0.75rem 0.5rem', color: '#00F0FF', fontFamily: 'var(--font-mono)' }}>{scan.target}</td>
                    <td style={{ padding: '0.75rem 0.5rem' }}><span className="badge badge-safe">{scan.status}</span></td>
                    <td style={{ padding: '0.75rem 0.5rem', color: '#9CA3AF', fontSize: '0.78rem' }}>{new Date(scan.created_at).toLocaleString()}</td>
                    <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>
                      <Link to={`/tools/${scan.tool_id}?target=${encodeURIComponent(scan.target)}`} className="btn-secondary" style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}>
                        <Play size={12} /> Re-run
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>No security scans recorded yet. Use the launcher above to begin analysis.</p>
        )}
      </div>
    </div>
  );
}
