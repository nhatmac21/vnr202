import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  type: 'leaf' | 'dust' | 'spark';
  rotation: number;
  rotationSpeed: number;
}

export default function WarBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create particles
    const particles: Particle[] = [];
    const particleCount = 80;

    for (let i = 0; i < particleCount; i++) {
      const type = Math.random() < 0.6 ? 'leaf' : Math.random() < 0.8 ? 'dust' : 'spark';
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: Math.random() * 0.3 + 0.2,
        size: type === 'leaf' ? Math.random() * 4 + 3 : Math.random() * 2 + 1,
        opacity: Math.random() * 0.4 + 0.2,
        type,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02
      });
    }

    let animationFrame: number;
    let time = 0;

    // Hàm vẽ ngôi sao 5 cánh
    const drawStar = (ctx: CanvasRenderingContext2D, size: number, fillStyle: string) => {
      const spikes = 5;
      const outerRadius = size;
      const innerRadius = size * 0.4;
      
      ctx.beginPath();
      for (let i = 0; i < spikes * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (i * Math.PI) / spikes - Math.PI / 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.fillStyle = fillStyle;
      ctx.fill();
    };

    const animate = () => {
      time += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw particles
      particles.forEach((p) => {
        // Update position
        p.x += p.vx + Math.sin(time + p.y * 0.01) * 0.2;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        // Wrap around
        if (p.y > canvas.height + 10) {
          p.y = -10;
          p.x = Math.random() * canvas.width;
        }
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.x < -10) p.x = canvas.width + 10;

        ctx.save();
        ctx.globalAlpha = p.opacity * (0.8 + Math.sin(time * 2 + p.x) * 0.2);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.type === 'leaf') {
          // Ngôi sao vàng nhạt
          drawStar(ctx, p.size, `rgba(${200 + Math.sin(p.x) * 30}, ${180 + Math.sin(p.y) * 30}, 100, 1)`);
        } else if (p.type === 'dust') {
          // Ngôi sao đỏ
          drawStar(ctx, p.size, 'rgba(220, 120, 80, 1)');
        } else {
          // Ngôi sao vàng sáng
          drawStar(ctx, p.size, 'rgba(255, 220, 120, 1)');
        }

        ctx.restore();
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <>
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-amber-900 to-stone-900 animate-gradient-shift"></div>
        
        {/* Mountain silhouettes */}
        <svg className="absolute bottom-0 w-full h-64 opacity-20" viewBox="0 0 1200 300" preserveAspectRatio="none">
          <path d="M0,300 L0,200 Q150,100 300,150 T600,120 T900,160 T1200,140 L1200,300 Z" fill="rgba(0,0,0,0.4)"/>
          <path d="M0,300 L0,240 Q200,160 400,200 T800,180 T1200,200 L1200,300 Z" fill="rgba(0,0,0,0.3)"/>
        </svg>

        {/* Particle canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-70" />

        {/* Light rays effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-yellow-200/20 via-transparent to-transparent rotate-12 animate-light-ray-1"></div>
          <div className="absolute top-0 right-1/3 w-1 h-full bg-gradient-to-b from-orange-200/15 via-transparent to-transparent -rotate-12 animate-light-ray-2"></div>
        </div>

        {/* Noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay">
          <div className="w-full h-full bg-noise animate-noise"></div>
        </div>
      </div>
    </>
  );
}
