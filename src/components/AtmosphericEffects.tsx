import React from 'react';

/**
 * Atmospheric effects for Vietnam War theme
 * - Fog/mist layers (representing highland mist)
 * - Smoke effects
 * - Atmospheric depth
 */
export default function AtmosphericEffects() {
  return (
    <div className="fixed inset-0 -z-8 pointer-events-none">
      {/* Fog layer 1 - bottom */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-96 opacity-30 animate-fog-drift-1"
        style={{
          background: 'linear-gradient(to top, rgba(139, 92, 46, 0.3) 0%, rgba(139, 92, 46, 0.1) 40%, transparent 100%)',
        }}
      />
      
      {/* Fog layer 2 - mid */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-80 opacity-20 animate-fog-drift-2"
        style={{
          background: 'linear-gradient(to top, rgba(180, 160, 120, 0.4) 0%, rgba(180, 160, 120, 0.15) 50%, transparent 100%)',
        }}
      />

      {/* Smoke wisps */}
      <div className="absolute inset-0">
        <div 
          className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full opacity-5 animate-smoke-rise-1 blur-[40px]"
          style={{
            background: 'radial-gradient(circle, rgba(200, 200, 200, 0.6) 0%, transparent 70%)',
          }}
        />
        <div 
          className="absolute bottom-1/3 right-1/3 w-80 h-80 rounded-full opacity-5 animate-smoke-rise-2 blur-[50px]"
          style={{
            background: 'radial-gradient(circle, rgba(180, 180, 180, 0.5) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Depth haze - atmospheric perspective */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(20, 60, 40, 0.1) 0%, transparent 30%, transparent 70%, rgba(80, 50, 30, 0.1) 100%)',
        }}
      />

      {/* Animated cloud shadows */}
      <div 
        className="absolute inset-0 opacity-10 animate-cloud-shadow"
        style={{
          background: 'radial-gradient(ellipse 800px 400px at 20% 30%, rgba(0, 0, 0, 0.3) 0%, transparent 50%)',
        }}
      />
    </div>
  );
}
