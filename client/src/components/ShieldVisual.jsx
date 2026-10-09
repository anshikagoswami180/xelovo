import React from 'react';
import { Users, Search, Bot, Shield } from 'lucide-react';

export default function ShieldVisual() {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      maxWidth: '560px',
      height: '520px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto'
    }}>
      {/* 1. BACKGROUND HUD RINGS & RADIAL SCANNING EFFECTS */}
      <svg 
        width="540" 
        height="540" 
        viewBox="0 0 500 500" 
        fill="none" 
        style={{
          position: 'absolute',
          inset: 0,
          margin: 'auto',
          pointerEvents: 'none'
        }}
      >
        <defs>
          <linearGradient id="ringGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1688FF" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#19D7E8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#1558C0" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="cyanArc" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#19D7E8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#58F0FF" stopOpacity="0.1" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Incomplete Blue Ring */}
        <circle 
          cx="250" 
          cy="240" 
          r="210" 
          stroke="url(#ringGradient1)" 
          strokeWidth="2.5" 
          strokeDasharray="320 80 140 60"
          className="animate-hud-cw"
        />

        {/* Cyan Partial Arc */}
        <circle 
          cx="250" 
          cy="240" 
          r="185" 
          stroke="url(#cyanArc)" 
          strokeWidth="3" 
          strokeDasharray="180 200"
          className="animate-hud-ccw"
          filter="url(#glow)"
        />

        {/* Thin Technical Circular Grid Lines & Dotted Nodes */}
        <circle cx="250" cy="240" r="160" stroke="rgba(25, 215, 232, 0.25)" strokeWidth="1" strokeDasharray="4 8" />
        <circle cx="250" cy="240" r="230" stroke="rgba(22, 136, 255, 0.15)" strokeWidth="1" />

        {/* Small Glowing Circular Nodes */}
        <circle cx="100" cy="150" r="4" fill="#19D7E8" filter="url(#glow)" />
        <circle cx="390" cy="120" r="5" fill="#1688FF" filter="url(#glow)" />
        <circle cx="430" cy="310" r="4" fill="#58F0FF" filter="url(#glow)" />
        <circle cx="70" cy="330" r="5" fill="#1976F3" filter="url(#glow)" />
      </svg>

      {/* 2. CENTRAL XELOVO SHIELD ICON & EMBEDDED WORDMARK */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transform: 'translateY(-20px)'
      }}>
        <svg width="240" height="290" viewBox="0 0 240 290" fill="none" style={{ filter: 'drop-shadow(0 0 35px rgba(22, 136, 255, 0.45))' }}>
          <defs>
            {/* Shield Interior Gradient */}
            <linearGradient id="shieldBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#091B36" />
              <stop offset="70%" stopColor="#06142B" />
              <stop offset="100%" stopColor="#030B1C" />
            </linearGradient>

            {/* Shield Outer Edge Gradient */}
            <linearGradient id="shieldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1688FF" />
              <stop offset="60%" stopColor="#19D7E8" />
              <stop offset="100%" stopColor="#58F0FF" />
            </linearGradient>

            {/* Upper Right Section Gradient */}
            <linearGradient id="xUpperRight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1688FF" />
              <stop offset="100%" stopColor="#1558C0" />
            </linearGradient>

            {/* Lower Right Section Gradient */}
            <linearGradient id="xLowerRight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1688FF" />
              <stop offset="100%" stopColor="#19D7E8" />
            </linearGradient>
          </defs>

          {/* Outer Shield Outline */}
          <path 
            d="M 120 15 L 215 50 C 215 170 170 245 120 275 C 70 245 25 170 25 50 Z" 
            fill="url(#shieldBg)" 
            stroke="url(#shieldBorder)" 
            strokeWidth="5" 
            strokeLinejoin="round" 
          />

          {/* Right Edge Cyan Glow Layer */}
          <path 
            d="M 120 15 L 215 50 C 215 170 170 245 120 275" 
            fill="none" 
            stroke="#58F0FF" 
            strokeWidth="6" 
            opacity="0.85"
            filter="url(#glow)" 
          />

          {/* Geometric Inner Shield Grid Lines */}
          <path d="M 120 25 L 120 265" stroke="rgba(25, 215, 232, 0.15)" strokeWidth="1.5" strokeDasharray="4 4" />
          <path d="M 40 100 L 200 100" stroke="rgba(25, 215, 232, 0.12)" strokeWidth="1.5" strokeDasharray="4 4" />

          {/* PROPER SYMMETRICAL GEOMETRIC LETTER X MARK */}
          <g transform="translate(120, 105)">
            {/* Upper-Left Arm (Navy / Off-White Contrast) */}
            <polygon points="-48,-48 -14,-14 -32,4 -66,-30" fill="#F2F5F9" opacity="0.95" />
            
            {/* Lower-Left Arm (Secondary Light Navy) */}
            <polygon points="-48,48 -14,14 -32,-4 -66,30" fill="#B5C0D0" opacity="0.85" />
            
            {/* Upper-Right Arm (Electric Blue) */}
            <polygon points="48,-48 14,-14 32,4 66,-30" fill="url(#xUpperRight)" />
            
            {/* Lower-Right Arm (Blue-to-Cyan Gradient) */}
            <polygon points="48,48 14,14 32,-4 66,30" fill="url(#xLowerRight)" />
            
            {/* Defined Center Diamond Intersection Node */}
            <polygon points="0,-16 16,0 0,16 -16,0" fill="#58F0FF" />
            <polygon points="0,-8 8,0 0,8 -8,0" fill="#030B1C" />
          </g>

          {/* Embedded XELOVO Text inside Shield */}
          <text 
            x="120" 
            y="200" 
            textAnchor="middle" 
            fill="#FFFFFF" 
            fontSize="21" 
            fontWeight="800" 
            fontFamily="var(--font-display)" 
            letterSpacing="3"
          >
            XELOVO
          </text>

          {/* Mini Shield with Symmetrical Geometric X Below Wordmark */}
          <g transform="translate(108, 212)">
            <path d="M 12 0 L 22 4 C 22 16 17 22 12 25 C 7 22 2 16 2 4 Z" fill="#06142B" stroke="#19D7E8" strokeWidth="1.5" />
            {/* Mini Symmetrical X */}
            <path d="M 6 6 L 12 12 L 18 6" stroke="#F2F5F9" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 6 18 L 12 12 L 18 18" stroke="#1688FF" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        </svg>
      </div>

      {/* 3. GLOWING ELLIPTICAL HOLOGRAM PLATFORM DIRECTLY BELOW SHIELD */}
      <div style={{
        position: 'absolute',
        bottom: '25px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '360px',
        height: '80px',
        pointerEvents: 'none'
      }}>
        <svg width="360" height="80" viewBox="0 0 360 80" fill="none">
          <ellipse cx="180" cy="40" rx="160" ry="32" fill="rgba(22, 136, 255, 0.12)" filter="url(#glow)" />
          <ellipse cx="180" cy="40" rx="150" ry="28" stroke="#1688FF" strokeWidth="1.5" strokeDasharray="12 6" />
          <ellipse cx="180" cy="40" rx="110" ry="20" stroke="#19D7E8" strokeWidth="2" />
          <ellipse cx="180" cy="40" rx="60" ry="10" stroke="#58F0FF" strokeWidth="1" strokeDasharray="4 4" />
        </svg>
      </div>

      {/* 4. FOUR FLOATING FEATURE CIRCULAR ICONS AROUND THE SHIELD */}
      
      {/* Top Left: People Security */}
      <div style={{
        position: 'absolute',
        top: '40px',
        left: '15px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 20
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'rgba(9, 27, 54, 0.85)',
          border: '1.5px solid #19D7E8',
          boxShadow: '0 0 15px rgba(25, 215, 232, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#19D7E8',
          backdropFilter: 'blur(8px)'
        }}>
          <Users size={24} />
        </div>
        <span style={{ fontSize: '0.78rem', color: '#F2F5F9', marginTop: '0.4rem', fontWeight: 600, textAlign: 'center' }}>
          People Security
        </span>
      </div>

      {/* Left Middle: Investigation Tools */}
      <div style={{
        position: 'absolute',
        top: '210px',
        left: '0px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 20
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'rgba(9, 27, 54, 0.85)',
          border: '1.5px solid #1688FF',
          boxShadow: '0 0 15px rgba(22, 136, 255, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#1688FF',
          backdropFilter: 'blur(8px)'
        }}>
          <Search size={24} />
        </div>
        <span style={{ fontSize: '0.78rem', color: '#F2F5F9', marginTop: '0.4rem', fontWeight: 600, textAlign: 'center', lineHeight: 1.2 }}>
          Investigation<br />Tools
        </span>
      </div>

      {/* Top Right: AI Assistant */}
      <div style={{
        position: 'absolute',
        top: '40px',
        right: '15px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 20
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'rgba(9, 27, 54, 0.85)',
          border: '1.5px solid #19D7E8',
          boxShadow: '0 0 15px rgba(25, 215, 232, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#19D7E8',
          backdropFilter: 'blur(8px)'
        }}>
          <Bot size={24} />
        </div>
        <span style={{ fontSize: '0.78rem', color: '#F2F5F9', marginTop: '0.4rem', fontWeight: 600, textAlign: 'center' }}>
          AI Assistant
        </span>
      </div>

      {/* Right Middle: Security Toolkit */}
      <div style={{
        position: 'absolute',
        top: '210px',
        right: '0px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 20
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'rgba(9, 27, 54, 0.85)',
          border: '1.5px solid #1688FF',
          boxShadow: '0 0 15px rgba(22, 136, 255, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#1688FF',
          backdropFilter: 'blur(8px)'
        }}>
          <Shield size={24} />
        </div>
        <span style={{ fontSize: '0.78rem', color: '#F2F5F9', marginTop: '0.4rem', fontWeight: 600, textAlign: 'center', lineHeight: 1.2 }}>
          Security<br />Toolkit
        </span>
      </div>
    </div>
  );
}
