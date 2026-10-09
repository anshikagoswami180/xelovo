import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageSquare } from 'lucide-react';
import ShieldVisual from '../components/ShieldVisual';
import FeatureCard from '../components/FeatureCard';

export default function LandingPage() {
  const cards = [
    {
      id: 'digital-protection',
      iconType: 'digital-protection',
      title: 'Digital Protection',
      description: 'Understand common digital risks and improve personal online security.',
      linkUrl: '/tools'
    },
    {
      id: 'investigation',
      iconType: 'investigation',
      title: 'Public Information Investigation',
      description: 'Analyze publicly available information and organize investigation findings responsibly.',
      linkUrl: '/investigation'
    },
    {
      id: 'ai-assistant',
      iconType: 'ai-assistant',
      title: 'AI Security Assistant',
      description: 'Ask questions about cybersecurity, privacy, scams, suspicious activity and digital safety.',
      linkUrl: '/ai-assistant'
    },
    {
      id: 'security-toolkit',
      iconType: 'security-toolkit',
      title: 'Security Toolkit',
      description: 'Use practical tools designed for awareness, analysis and basic security checks.',
      linkUrl: '/tools'
    }
  ];

  return (
    <div style={{ position: 'relative', width: '100%', overflowX: 'hidden' }}>
      {/* Background Cyber Grid */}
      <div className="cyber-grid-bg" />

      {/* MAIN HERO SECTION */}
      <section style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '2.5rem 3rem 1.5rem 3rem',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        alignItems: 'center',
        gap: '2rem',
        position: 'relative',
        zIndex: 1
      }}>
        {/* LEFT SIDE: HERO TEXT CONTENT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Top Pill Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'rgba(6, 20, 43, 0.7)',
            border: '1px solid rgba(45, 125, 255, 0.3)',
            borderRadius: '50px',
            padding: '0.4rem 1rem',
            width: 'fit-content'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#19D7E8',
              boxShadow: '0 0 8px #19D7E8'
            }} />
            <span style={{ fontSize: '0.85rem', color: '#B5C0D0', fontWeight: 500 }}>
              AI-Powered Security Platform
            </span>
          </div>

          {/* MAIN HERO HEADLINE */}
          <h1 style={{
            fontSize: '3.2rem',
            lineHeight: 1.15,
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: '#F2F5F9',
            fontFamily: 'var(--font-display)'
          }}>
            Security Starts With<br />
            <span className="gradient-text-blue">Awareness.</span><br />
            Investigation Starts With<br />
            <span className="gradient-text-blue">Intelligence.</span>
          </h1>

          {/* HERO DESCRIPTION */}
          <p style={{
            fontSize: '1.02rem',
            color: '#B5C0D0',
            lineHeight: 1.6,
            maxWidth: '520px'
          }}>
            XELOVO helps people understand their digital exposure, investigate public information, check security risks and make smarter decisions about online safety.
          </p>

          {/* HERO BUTTONS */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
            <Link 
              to="/tools" 
              className="btn-blue-gradient"
              style={{
                width: '245px',
                height: '48px',
                fontSize: '0.95rem'
              }}
            >
              Explore Security Tools <ArrowRight size={18} />
            </Link>

            <Link 
              to="/ai-assistant"
              className="btn-outline-electric"
              style={{
                height: '48px',
                padding: '0 1.5rem',
                fontSize: '0.95rem'
              }}
            >
              <MessageSquare size={18} color="#1688FF" /> Ask XELA AI
            </Link>
          </div>
        </div>

        {/* RIGHT SIDE: CYBER SHIELD & HUD VISUAL */}
        <div>
          <ShieldVisual />
        </div>
      </section>

      {/* FOUR FEATURE CARDS ROW */}
      <section style={{
        maxWidth: '1440px',
        margin: '1.5rem auto 3rem auto',
        padding: '0 3rem',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1.25rem'
        }}>
          {cards.map((card) => (
            <FeatureCard key={card.id} {...card} />
          ))}
        </div>
      </section>

      {/* BEGINNING OF NEXT SECTION AT BOTTOM */}
      <section style={{
        backgroundColor: '#06142B',
        borderTop: '1px solid rgba(45, 125, 255, 0.22)',
        padding: '4rem 2rem 5rem 2rem',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          {/* Small Uppercase Text */}
          <span style={{
            fontSize: '0.8rem',
            color: '#19D7E8',
            fontWeight: 700,
            letterSpacing: '0.25em',
            textTransform: 'uppercase'
          }}>
            POWERFUL • SECURE • PRIVATE
          </span>

          {/* Main Heading */}
          <h2 style={{
            fontSize: '2.4rem',
            fontWeight: 800,
            color: '#F2F5F9',
            fontFamily: 'var(--font-display)'
          }}>
            Everything You Need for Digital Safety
          </h2>

          {/* Electric-Blue Accent Line */}
          <div style={{
            width: '80px',
            height: '3px',
            backgroundColor: '#1688FF',
            borderRadius: '2px',
            boxShadow: '0 0 12px #19D7E8',
            margin: '0.25rem 0'
          }} />

          {/* Centered Description */}
          <p style={{
            fontSize: '1.05rem',
            color: '#B5C0D0',
            lineHeight: 1.6,
            maxWidth: '680px'
          }}>
            XELOVO combines advanced security tools, intelligent investigation features and AI-powered guidance to help you stay safe in the digital world.
          </p>
        </div>
      </section>
    </div>
  );
}
