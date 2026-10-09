import React, { useState } from 'react';
import { Network, Server, Globe, ShieldAlert, Cpu, User, Info, CheckCircle, AlertTriangle } from 'lucide-react';

export default function ExposureMapConstellation({ constellationData }) {
  const [selectedNode, setSelectedNode] = useState(null);
  const [filterType, setFilterType] = useState('all');

  if (!constellationData || !constellationData.nodes) {
    return (
      <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: '#9CA3AF' }}>
        No exposure constellation graph loaded.
      </div>
    );
  }

  const { nodes, links, totalNodes, totalLinks } = constellationData;
  const filteredNodes = filterType === 'all' ? nodes : nodes.filter(n => n.type === filterType);

  // Simple layout calculation for constellation rendering
  const width = 700;
  const height = 450;
  const centerX = width / 2;
  const centerY = height / 2;

  // Calculate node positions around central target node
  const positionedNodes = nodes.map((node, index) => {
    if (node.type === 'target') {
      return { ...node, x: centerX, y: centerY };
    }
    const totalOuter = nodes.length - 1;
    const angle = (index / (totalOuter || 1)) * 2 * Math.PI;
    const radius = 160 + (index % 2 === 0 ? 30 : -20);
    return {
      ...node,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  });

  const getNodeColor = (type, severity) => {
    if (type === 'target') return '#00F0FF';
    if (severity === 'warning') return '#F59E0B';
    if (severity === 'critical') return '#EF4444';
    if (type === 'subdomain') return '#3B82F6';
    if (type === 'certificate') return '#10B981';
    if (type === 'technology') return '#8B5CF6';
    return '#9CA3AF';
  };

  const activeNodeObj = selectedNode ? positionedNodes.find(n => n.id === selectedNode) : positionedNodes[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Top Controls Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Filter View:</span>
          {['all', 'target', 'domain', 'subdomain', 'certificate', 'exposure'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterType(cat)}
              style={{
                backgroundColor: filterType === cat ? 'rgba(0, 240, 255, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                border: filterType === cat ? '1px solid #00F0FF' : '1px solid rgba(255, 255, 255, 0.08)',
                color: filterType === cat ? '#00F0FF' : '#9CA3AF',
                fontSize: '0.75rem',
                padding: '0.25rem 0.65rem',
                borderRadius: '6px',
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
        <div style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>
          Constellation Nodes: <strong style={{ color: '#00F0FF' }}>{totalNodes}</strong> | Edges: <strong style={{ color: '#3B82F6' }}>{totalLinks}</strong>
        </div>
      </div>

      {/* Main Interactive Graph & Detail Split Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1rem', minHeight: '450px' }}>
        {/* SVG Constellation Canvas */}
        <div className="glass-panel" style={{ position: 'relative', overflow: 'hidden', backgroundColor: '#0A0E17' }}>
          <svg width="100%" height="450" viewBox={`0 0 ${width} ${height}`}>
            <defs>
              <radialGradient id="targetGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#00F0FF" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Connecting Edges */}
            {links.map((link, idx) => {
              const sourceNode = positionedNodes.find(n => n.id === link.source);
              const targetNode = positionedNodes.find(n => n.id === link.target);
              if (!sourceNode || !targetNode) return null;
              return (
                <line
                  key={idx}
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  stroke={selectedNode && (selectedNode === link.source || selectedNode === link.target) ? "#00F0FF" : "rgba(255, 255, 255, 0.15)"}
                  strokeWidth={selectedNode && (selectedNode === link.source || selectedNode === link.target) ? "2" : "1"}
                  strokeDasharray={link.relation === 'vulnerable_to' ? '4 3' : 'none'}
                />
              );
            })}

            {/* Target Central Halo Glow */}
            <circle cx={centerX} cy={centerY} r="65" fill="url(#targetGlow)" />

            {/* Nodes */}
            {positionedNodes.map((node) => {
              const color = getNodeColor(node.type, node.severity);
              const isSelected = selectedNode === node.id;
              const isTarget = node.type === 'target';
              const r = isTarget ? 22 : 14;

              return (
                <g 
                  key={node.id} 
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={() => setSelectedNode(node.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <circle
                    r={isSelected ? r + 6 : r}
                    fill={isTarget ? "#07090E" : "#0F141C"}
                    stroke={color}
                    strokeWidth={isSelected ? "3" : "2"}
                    style={{ transition: 'all 0.2s ease' }}
                  />
                  {isTarget && (
                    <circle r="8" fill="#00F0FF" />
                  )}
                  <text
                    y={r + 14}
                    textAnchor="middle"
                    fill={isSelected ? "#FFFFFF" : "#9CA3AF"}
                    fontSize="10"
                    fontFamily="var(--font-mono)"
                  >
                    {node.label.length > 18 ? node.label.substring(0, 15) + '...' : node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Node Evidence Inspector Panel */}
        <div className="glass-panel" style={{ padding: '1.25rem', backgroundColor: '#0F141C', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.75rem' }}>
            <Info size={18} color="#00F0FF" />
            <h4 style={{ fontSize: '0.9rem', margin: 0 }}>Constellation Inspector</h4>
          </div>

          {activeNodeObj ? (
            <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <span className="badge badge-info">{activeNodeObj.category}</span>
                <h3 style={{ fontSize: '1rem', marginTop: '0.4rem', color: '#FFFFFF', wordBreak: 'break-all' }}>{activeNodeObj.label}</h3>
              </div>

              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: '0 0 0.3rem 0' }}>Node ID:</p>
                <code style={{ fontSize: '0.75rem', color: '#00F0FF', fontFamily: 'var(--font-mono)' }}>{activeNodeObj.id}</code>
              </div>

              <div>
                <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: '0 0 0.4rem 0' }}>Discovered Attributes:</p>
                <pre style={{
                  backgroundColor: '#07090E',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  fontSize: '0.72rem',
                  color: '#D1D5DB',
                  overflowX: 'auto',
                  fontFamily: 'var(--font-mono)'
                }}>
                  {JSON.stringify(activeNodeObj.details || {}, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <p style={{ fontSize: '0.8rem', color: '#6B7280' }}>Click any constellation node to view empirical evidence.</p>
          )}
        </div>
      </div>
    </div>
  );
}
