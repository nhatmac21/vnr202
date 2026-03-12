import React from 'react';

export default function HistoricalOverlay() {
  return (
    <div className="fixed inset-0 -z-5 pointer-events-none overflow-hidden">
      {/* Bamboo pattern overlay - subtle */}
      <div className="absolute inset-0 opacity-[0.04]">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="bamboo" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <line x1="10" y1="0" x2="10" y2="100" stroke="currentColor" strokeWidth="2"/>
              <line x1="30" y1="0" x2="30" y2="100" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" strokeWidth="2.5"/>
              <line x1="70" y1="0" x2="70" y2="100" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="90" y1="0" x2="90" y2="100" stroke="currentColor" strokeWidth="2"/>
              <circle cx="10" cy="20" r="3" fill="currentColor"/>
              <circle cx="30" cy="40" r="3" fill="currentColor"/>
              <circle cx="50" cy="60" r="3" fill="currentColor"/>
              <circle cx="70" cy="80" r="3" fill="currentColor"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#bamboo)" className="text-green-900"/>
        </svg>
      </div>

      {/* Star 5-pointed decorations - representing spirit */}
      <div className="absolute top-20 left-10 w-16 h-16 opacity-10 animate-pulse-slow">
        <svg viewBox="0 0 100 100" className="text-yellow-500">
          <path d="M50,5 L61,38 L95,38 L68,58 L79,91 L50,71 L21,91 L32,58 L5,38 L39,38 Z" fill="currentColor"/>
        </svg>
      </div>
      
      <div className="absolute bottom-32 right-20 w-12 h-12 opacity-10 animate-pulse-slow" style={{animationDelay: '1s'}}>
        <svg viewBox="0 0 100 100" className="text-red-600">
          <path d="M50,5 L61,38 L95,38 L68,58 L79,91 L50,71 L21,91 L32,58 L5,38 L39,38 Z" fill="currentColor"/>
        </svg>
      </div>

      <div className="absolute top-1/2 right-1/4 w-10 h-10 opacity-10 animate-pulse-slow" style={{animationDelay: '2s'}}>
        <svg viewBox="0 0 100 100" className="text-yellow-600">
          <path d="M50,5 L61,38 L95,38 L68,58 L79,91 L50,71 L21,91 L32,58 L5,38 L39,38 Z" fill="currentColor"/>
        </svg>
      </div>

      {/* Horizon glow effect */}
      <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-orange-600/10 via-amber-600/5 to-transparent animate-horizon-glow"></div>
      
      {/* Top atmospheric fade */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-emerald-950/20 via-transparent to-transparent"></div>

      {/* Vignette effect */}
      <div className="absolute inset-0 bg-radial-vignette"></div>
    </div>
  );
}
