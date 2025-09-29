import React from 'react';

export default function Eva() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <svg width="100%" height="100%" className="absolute inset-0">
        <defs>
          <linearGradient id="neonGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FF003C" />
            <stop offset="100%" stopColor="#FF87AB" />
          </linearGradient>

          <pattern
            id="tight-honeycomb"
            x="0"
            y="0"
            width="34.64"
            height="30"
            patternUnits="userSpaceOnUse"
          >
            <polygon
              points="17.32,0 34.64,10 34.64,20 17.32,30 0,20 0,10"
              fill="none"
              stroke="url(#neonGradient)"
              strokeWidth="1.0"
              className="animate-glow"
            />
          </pattern>

          <filter
            id="glow"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
            colorInterpolationFilters="sRGB"
          >
            <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#FF003C" floodOpacity="0.7" />
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#FF87AB" floodOpacity="0.5" />
          </filter>
        </defs>

        <rect
          width="100%"
          height="100%"
          fill="url(#tight-honeycomb)"
          opacity="0.15"
          filter="url(#glow)"
        />
      </svg>

      <style>{`
        @keyframes glowPulse {
          0%, 100% {
            stroke-opacity: 1;
            filter: drop-shadow(0 0 6px #FF003C);
          }
          50% {
            stroke-opacity: 0.4;
            filter: drop-shadow(0 0 12px #FF87AB);
          }
        }
        .animate-glow {
          animation: glowPulse 2.5s ease-in-out infinite;
          filter: drop-shadow(0 0 4px #FF003C);
        }
      `}</style>
    </div>
  );
}
