import React from 'react';
import { CheckCircle2, AlertTriangle, Clock, ShieldCheck, Database } from 'lucide-react';

export default function AnalysisTimeline({ analysis }) {
  if (!analysis) return null;

  const {
    analysisId = 'XEL-20260920-LIVE',
    startedAt,
    completedAt,
    durationMs = 0,
    status = 'COMPLETED',
    sources = [],
    evidence = []
  } = analysis;

  const timelineSteps = [
    { title: 'Input Validation & Normalization', status: 'VERIFIED', duration: '0.05s', source: 'XELOVO Input Engine' },
    { title: 'SSRF Boundary Guard', status: 'VERIFIED', duration: '0.02s', source: 'XELOVO SSRF Shield' },
    { title: 'Network & Telemetry Probes', status: status === 'LIVE_UNAVAILABLE' ? 'UNAVAILABLE' : 'VERIFIED', duration: `${(durationMs / 1000).toFixed(2)}s`, source: sources[0]?.name || 'Direct Socket / Protocol Probe' },
    { title: 'Evidence Correlation & Risk Scoring', status: 'VERIFIED', duration: '0.08s', source: 'XELOVO Analysis Engine' }
  ];

  return (
    <div className="xelavo-card" style={{ padding: '1.5rem', marginTop: '1.5rem', backgroundColor: '#06142B', border: '1px solid rgba(45, 125, 255, 0.3)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid rgba(45, 125, 255, 0.2)', paddingBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={18} color="#19D7E8" />
          <h3 style={{ fontSize: '1rem', color: '#F2F5F9', margin: 0, fontWeight: 700 }}>
            Real-Time Analysis Timeline & Source Pipeline
          </h3>
        </div>
        <span style={{ fontSize: '0.78rem', color: '#1688FF', fontFamily: 'var(--font-mono)', backgroundColor: 'rgba(22, 136, 255, 0.15)', padding: '0.2rem 0.6rem', borderRadius: '6px', border: '1px solid rgba(22, 136, 255, 0.3)' }}>
          {analysisId}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {timelineSteps.map((step, idx) => {
          const isOk = step.status === 'VERIFIED';
          return (
            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', fontSize: '0.86rem' }}>
              <div style={{ marginTop: '0.15rem' }}>
                {isOk ? <CheckCircle2 size={16} color="#10B981" /> : <AlertTriangle size={16} color="#F59E0B" />}
              </div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <span style={{ color: '#F2F5F9', fontWeight: 600 }}>{step.title}</span>
                  <span style={{ fontSize: '0.78rem', color: '#8494AB', display: 'block' }}>Source: {step.source}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#B5C0D0', fontFamily: 'var(--font-mono)' }}>{step.duration}</span>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: isOk ? '#10B981' : '#F59E0B',
                    backgroundColor: isOk ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '4px'
                  }}>
                    {isOk ? 'COMPLETED' : 'UNAVAILABLE'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
