import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Search, FileText, Briefcase, UserCheck, ArrowRight } from 'lucide-react';

export default function FeatureCard({ id, iconType, iconColor, title, description, linkUrl }) {
  const renderIcon = () => {
    switch (iconType) {
      case 'digital-protection':
        return (
          <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={32} color="#1688FF" />
            <UserCheck size={16} color="#19D7E8" style={{ position: 'absolute' }} />
          </div>
        );
      case 'investigation':
        return <Search size={30} color="#1688FF" />;
      case 'reports':
        return <FileText size={30} color="#1688FF" />;
      case 'security-toolkit':
        return <Briefcase size={30} color="#10B981" />;
      default:
        return <Shield size={30} color="#1688FF" />;
    }
  };

  return (
    <div className="xelavo-card" style={{
      height: '220px',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative'
    }}>
      {/* Icon */}
      <div style={{
        width: '52px',
        height: '52px',
        borderRadius: '10px',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-dark)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '0.75rem'
      }}>
        {renderIcon()}
      </div>

      {/* Content */}
      <div>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--text-contrast)', marginBottom: '0.4rem', fontWeight: 700 }}>
          {title}
        </h3>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
          {description}
        </p>
      </div>

      {/* Bottom Link */}
      <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
        <Link 
          to={linkUrl || '/'} 
          style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#19D7E8',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            transition: 'color 0.2s ease'
          }}
        >
          Learn more <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
