import React, { useState } from 'react';
import { Zap, AlertTriangle, ShieldAlert, CheckCircle, Info, FileText } from 'lucide-react';

export default function SignalZeroTimeline({ signalData }) {
  const [activeFilter, setActiveFilter] = useState('all');

  if (!signalData || !signalData.signalSummary) {
    return (
      <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: '#9CA3AF' }}>
        No Signal Zero timeline data loaded.
      </div>
    );
  }

  const { totalSignals, threats, warnings, notices, normal, signals } = signalData.signalSummary;

  const filteredSignals = activeFilter === 'all' ? signals : signals.filter(s => s.classification.toLowerCase() === activeFilter);

  const getSignalBadge = (classification) => {
    switch (classification) {
      case 'Threat': return { badge: 'badge-critical', icon: ShieldAlert, color: '#EF4444' };
      case 'Warning': return { badge: 'badge-guarded', icon: AlertTriangle, color: '#F59E0B' };
      case 'Notice': return { badge: 'badge-info', icon: Info, color: '#00F0FF' };
      default: return { badge: 'badge-safe', icon: CheckCircle, color: '#10B981' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Telemetry Metric Header */}
      <div className="glass-panel" style={{
        padding: '1.5rem',
        backgroundColor: '#0F141C',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: 'rgba(245, 158, 11, 0.15)', borderRadius: '12px', color: '#F59E0B' }}>
            <Zap size={28} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.3rem', margin: 0 }}>Signal Zero Early Warning Engine</h2>
            <p style={{ fontSize: '0.8rem', color: '#9CA3AF', margin: '0.2rem 0 0 0' }}>
              Target Domain: <strong style={{ color: '#00F0FF' }}>{signalData.target}</strong> | Real-Time Correlated Telemetry
            </p>
          </div>
        </div>

        {/* Counter Pills */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['all', 'threat', 'warning', 'notice', 'normal'].map((filter) => {
            const count = filter === 'all' ? totalSignals : filter === 'threat' ? threats : filter === 'warning' ? warnings : filter === 'notice' ? notices : normal;
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                style={{
                  backgroundColor: activeFilter === filter ? 'rgba(0, 240, 255, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                  border: activeFilter === filter ? '1px solid #00F0FF' : '1px solid rgba(255, 255, 255, 0.08)',
                  color: activeFilter === filter ? '#00F0FF' : '#9CA3AF',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {filter} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Signal Timeline Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
        {filteredSignals.map((sig, idx) => {
          const config = getSignalBadge(sig.classification);
          const IconComp = config.icon;

          return (
            <div 
              key={sig.id || idx}
              className="glass-panel"
              style={{
                padding: '1.25rem 1.5rem',
                backgroundColor: '#0F141C',
                borderLeft: `4px solid ${config.color}`,
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem'
              }}
            >
              <div style={{
                backgroundColor: `rgba(${config.color === '#EF4444' ? '239, 68, 68' : config.color === '#F59E0B' ? '245, 158, 11' : '0, 240, 255'}, 0.15)`,
                padding: '0.6rem',
                borderRadius: '10px',
                color: config.color
              }}>
                <IconComp size={22} />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className={`badge ${config.badge}`}>{sig.classification}</span>
                    <span style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{sig.category}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#6B7280', fontFamily: 'var(--font-mono)' }}>
                    Tool Ref: {sig.toolRef}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.05rem', margin: '0.4rem 0 0.2rem 0', color: '#FFFFFF' }}>{sig.title}</h3>
                <p style={{ fontSize: '0.85rem', color: '#D1D5DB', margin: '0 0 0.6rem 0' }}>{sig.message}</p>

                {/* Evidence Link Box */}
                <div style={{
                  backgroundColor: '#07090E',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '6px',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.75rem',
                  color: '#9CA3AF',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <FileText size={14} color="#00F0FF" />
                  <span><strong>Empirical Evidence:</strong> {sig.evidence}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
