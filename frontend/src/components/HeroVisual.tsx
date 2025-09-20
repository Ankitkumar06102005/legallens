import React from 'react';

// Decorative hero visual for the dashboard header
// Lightweight SVG with subtle animated gradients/blur for a premium look
export default function HeroVisual() {
  return (
    <div style={{ position: 'relative', height: 140 }} className="panel">
      <svg viewBox="0 0 600 160" width="100%" height="100%" style={{ display: 'block' }}>
        <defs>
          <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#5b7cfa" />
            <stop offset="100%" stopColor="#7b5bfa" />
          </linearGradient>
          <linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#56d37a" />
            <stop offset="100%" stopColor="#5b7cfa" />
          </linearGradient>
          <filter id="blur1" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="18" />
          </filter>
        </defs>
        <g>
          <circle cx="80" cy="80" r="60" fill="url(#g1)" filter="url(#blur1)">
            <animate attributeName="cx" values="80;120;80" dur="12s" repeatCount="indefinite" />
            <animate attributeName="cy" values="80;60;80" dur="10s" repeatCount="indefinite" />
          </circle>
          <circle cx="260" cy="70" r="50" fill="url(#g2)" filter="url(#blur1)">
            <animate attributeName="cx" values="260;300;260" dur="14s" repeatCount="indefinite" />
            <animate attributeName="cy" values="70;90;70" dur="11s" repeatCount="indefinite" />
          </circle>
          <circle cx="480" cy="85" r="70" fill="url(#g1)" filter="url(#blur1)">
            <animate attributeName="cx" values="480;440;480" dur="16s" repeatCount="indefinite" />
            <animate attributeName="cy" values="85;100;85" dur="13s" repeatCount="indefinite" />
          </circle>
        </g>
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px' }}>
        <div>
          <div style={{ color: '#c8d2ff', fontWeight: 700, letterSpacing: 0.5 }}>LegalLens Dashboard</div>
          <div style={{ color: '#a9b3d6', fontSize: 13 }}>Summaries • Risk Insights • Translations</div>
        </div>
        <div style={{ color: '#e6ebff', fontSize: 12, opacity: .9 }}>v1.0.0</div>
      </div>
    </div>
  );
}
