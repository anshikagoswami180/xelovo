import React from 'react';
import { Layers, Shield, Server, Globe, Lock, Eye, AlertTriangle } from 'lucide-react';

export default function ShadowSurfaceStack({ shadowData }) {
  if (!shadowData || !shadowData.shadowSurfaceSummary) {
    return (
      <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: '#9CA3AF' }}>
        No Shadow Surface scan data loaded.
      </div>
    );
  }

  const { overallExposureScore, exposureLevel, layers } = shadowData.shadowSurfaceSummary;

  const layerList = Object.values(layers);

  const getLayerColor = (score) => {
    if (score >= 65) return '#EF4444';
    if (score >= 40) return '#F59E0B';
    return '#10B981';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Overview Card */}
      <div className="glass-panel" style={{
        padding: '1.5rem',
        border: '1px solid rgba(0, 240, 255, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <span className="badge badge-info">Defensive Surface Visibility</span>
          <h2 style={{ fontSize: '1.4rem', marginTop: '0.4rem' }}>Shadow Surface: {shadowData.domain}</h2>
          <p style={{ fontSize: '0.82rem', color: '#9CA3AF', margin: '0.2rem 0 0 0' }}>
            Comparison between expected external exposure vs publicly observable attack surface.
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: getLayerColor(overallExposureScore), fontFamily: 'var(--font-mono)' }}>
            {overallExposureScore}/100
          </div>
          <span style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>{exposureLevel}</span>
        </div>
      </div>

      {/* 5-Layer Stack Visualizer */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {layerList.map((layer) => (
          <div 
            key={layer.layerId}
            className="glass-panel"
            style={{
              padding: '1.25rem 1.5rem',
              backgroundColor: '#0F141C',
              borderLeft: `4px solid ${getLayerColor(layer.exposureScore)}`,
              display: 'grid',
              gridTemplateColumns: '80px 1fr 1fr 120px',
              alignItems: 'center',
              gap: '1rem'
            }}
          >
            {/* Layer ID Badge */}
            <div>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: getLayerColor(layer.exposureScore),
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Layer {layer.layerId}
              </span>
            </div>

            {/* Layer Title & Description */}
            <div>
              <h4 style={{ fontSize: '1rem', margin: 0, color: '#FFFFFF' }}>{layer.name}</h4>
              <p style={{ fontSize: '0.78rem', color: '#9CA3AF', margin: '0.2rem 0 0 0' }}>{layer.description}</p>
            </div>

            {/* Expected vs Observable Surface */}
            <div style={{ fontSize: '0.78rem' }}>
              <div style={{ color: '#6B7280' }}>
                Expected: <span style={{ color: '#9CA3AF' }}>{layer.expectedExposed.join(', ')}</span>
              </div>
              <div style={{ color: '#00F0FF', marginTop: '0.2rem' }}>
                Observable: <span style={{ color: '#D1D5DB' }}>{layer.observableExposed.join(' • ')}</span>
              </div>
            </div>

            {/* Exposure Score Meter */}
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: getLayerColor(layer.exposureScore), fontFamily: 'var(--font-mono)' }}>
                {layer.exposureScore}% Exp.
              </span>
              <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', marginTop: '0.4rem' }}>
                <div style={{ width: `${layer.exposureScore}%`, height: '100%', backgroundColor: getLayerColor(layer.exposureScore), borderRadius: '2px' }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
