'use client';

import React from 'react';

// Precomputed 36-ring spirograph wireframe matching exact torus geometry
const SPIRO_RINGS = Array.from({ length: 36 }, (_, i) => {
  const angle = i * 10;
  // Dynamic opacity wave across the torus perimeter
  const opacity = (0.28 + 0.72 * Math.sin((i / 36) * Math.PI)).toFixed(2);
  return { angle, opacity };
});

export default function SpiroSpinner({ size = 52, className = '', label = '' }) {
  return (
    <div className={`spiro-spinner-container ${className}`} style={{ width: size, height: 'auto' }}>
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className="spiro-svg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="spiro-blue-violet-grad" x1="5%" y1="95%" x2="95%" y2="5%">
            <stop offset="0%" stopColor="#1e40af" />
            <stop offset="25%" stopColor="#2563eb" />
            <stop offset="55%" stopColor="#6366f1" />
            <stop offset="80%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#d8b4fe" stopOpacity="0.85" />
          </linearGradient>
        </defs>

        <g className="spiro-group">
          {SPIRO_RINGS.map((ring) => (
            <ellipse
              key={ring.angle}
              cx="50"
              cy="50"
              rx="40"
              ry="19"
              transform={`rotate(${ring.angle} 50 50)`}
              stroke="url(#spiro-blue-violet-grad)"
              strokeWidth="0.85"
              strokeOpacity={ring.opacity}
            />
          ))}
        </g>
      </svg>
      {label && <p className="spiro-label">{label}</p>}
    </div>
  );
}
