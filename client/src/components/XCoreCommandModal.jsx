import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, Network, Zap, X, Search, ArrowRight } from 'lucide-react';
import XCoreLogo from './XCoreLogo';

export default function XCoreCommandModal({ isOpen, onClose }) {
  const [targetInput, setTargetInput] = useState('');
  const [selectedTool, setSelectedTool] = useState('exposure-map');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(true); // Toggle open
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const flagships = [
    {
      id: 'exposure-map',
      name: 'XELOVO EXPOSURE MAP',
      tagline: 'Interactive Exposure Constellation Graph',
      icon: Network,
      color: '#00F0FF',
      placeholder: 'e.g. example.com'
    },
    {
      id: 'link-dna',
      name: 'XELOVO LINK DNA',
      tagline: 'Suspicious-Link & Phishing Fingerprint Analysis',
      icon: Eye,
      color: '#3B82F6',
      placeholder: 'e.g. https://verify-security-update.com'
    },
    {
      id: 'shadow-surface',
      name: 'XELOVO SHADOW SURFACE',
      tagline: 'Defensive 5-Layer Attack Surface Visibility',
      icon: Shield,
      color: '#8B5CF6',
      placeholder: 'e.g. targetdomain.org'
    },
    {
      id: 'signal-zero',
      name: 'XELOVO SIGNAL ZERO',
      tagline: 'Early-Warning Multi-Source Security Intelligence',
      icon: Zap,
      color: '#F59E0B',
      placeholder: 'e.g. domain.com'
    }
  ];

  const activeToolObj = flagships.find(f => f.id === selectedTool);

  const handleLaunch = (e) => {
    e.preventDefault();
    if (!targetInput.trim()) return;
    onClose();
    navigate(`/tools/${selectedTool}?target=${encodeURIComponent(targetInput.trim())}`);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(7, 9, 14, 0.85)',
      backdropFilter: 'blur(12px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '680px',
        backgroundColor: '#0F141C',
        border: '1px solid rgba(0, 240, 255, 0.3)',
        borderRadius: '16px',
        boxShadow: '0 0 50px rgba(0, 240, 255, 0.15)',
        overflow: 'hidden'
      }}>
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'linear-gradient(90deg, rgba(0, 240, 255, 0.05) 0%, transparent 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <XCoreLogo size={28} />
            <div>
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>X-CORE COMMAND</h3>
              <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: 0 }}>Quick-Launch Flagship Security Workstation</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#9CA3AF',
              cursor: 'pointer',
              padding: '0.25rem'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Input */}
        <form onSubmit={handleLaunch} style={{ padding: '1.5rem 1.5rem 1rem 1.5rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(0, 240, 255, 0.3)',
            borderRadius: '10px',
            padding: '0.75rem 1rem',
            gap: '0.75rem'
          }}>
            <Search size={20} color="#00F0FF" />
            <input 
              type="text"
              placeholder={activeToolObj ? activeToolObj.placeholder : "Enter domain or URL..."}
              value={targetInput}
              onChange={(e) => setTargetInput(e.target.value)}
              autoFocus
              style={{
                background: 'transparent',
                border: 'none',
                color: '#FFFFFF',
                fontSize: '1rem',
                width: '100%',
                outline: 'none',
                fontFamily: 'var(--font-mono)'
              }}
            />
            <button type="submit" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              Launch <ArrowRight size={16} />
            </button>
          </div>
        </form>

        {/* Flagship Tool Selector */}
        <div style={{ padding: '0 1.5rem 1.5rem 1.5rem' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
            Select Flagship Engine
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {flagships.map((f) => {
              const IconComp = f.icon;
              const isSelected = selectedTool === f.id;
              return (
                <div 
                  key={f.id}
                  onClick={() => setSelectedTool(f.id)}
                  style={{
                    backgroundColor: isSelected ? 'rgba(0, 240, 255, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                    border: isSelected ? `1px solid ${f.color}` : '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '10px',
                    padding: '0.85rem 1rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem'
                  }}
                >
                  <div style={{
                    backgroundColor: `rgba(${f.color === '#00F0FF' ? '0, 240, 255' : '59, 130, 246'}, 0.15)`,
                    padding: '0.5rem',
                    borderRadius: '8px',
                    color: f.color
                  }}>
                    <IconComp size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.85rem', margin: 0, color: isSelected ? '#FFFFFF' : '#D1D5DB' }}>{f.name}</h4>
                    <p style={{ fontSize: '0.72rem', color: '#9CA3AF', margin: '0.2rem 0 0 0' }}>{f.tagline}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          padding: '0.75rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          fontSize: '0.75rem',
          color: '#6B7280'
        }}>
          <span>Press <kbd style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>ESC</kbd> to exit</span>
          <span>Shortcut: <kbd style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>Ctrl + K</kbd></span>
        </div>
      </div>
    </div>
  );
}
