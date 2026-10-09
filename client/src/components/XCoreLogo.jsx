import React, { useState } from 'react';

export default function XCoreLogo({ size = 36, onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="xelavo-x-logo-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}
      title="XELOVO Geometric Security Mark"
    >
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        fill="none" 
        style={{
          transition: 'transform 0.25s ease, filter 0.25s ease',
          transform: isHovered ? 'scale(1.08)' : 'scale(1)',
          filter: isHovered ? 'drop-shadow(0 0 12px rgba(25, 215, 232, 0.6))' : 'drop-shadow(0 0 4px rgba(22, 136, 255, 0.3))'
        }}
      >
        <rect width="100" height="100" rx="20" fill="#06142B" stroke="rgba(45, 125, 255, 0.3)" strokeWidth="2" />
        
        {/* Symmetrical Geometric X Mark */}
        <g transform="translate(50, 50)">
          {/* Upper Left */}
          <polygon points="-28,-28 -8,-8 -20,3 -40,-17" fill="#F2F5F9" opacity="0.95" />
          {/* Lower Left */}
          <polygon points="-28,28 -8,8 -20,-3 -40,17" fill="#B5C0D0" opacity="0.85" />
          {/* Upper Right */}
          <polygon points="28,-28 8,-8 20,3 40,-17" fill="#1688FF" />
          {/* Lower Right */}
          <polygon points="28,28 8,8 20,-3 40,17" fill="#19D7E8" />
          {/* Center Diamond */}
          <polygon points="0,-10 10,0 0,10 -10,0" fill="#58F0FF" />
        </g>
      </svg>
    </div>
  );
}
