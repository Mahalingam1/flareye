import React, { useEffect, useRef } from 'react';

interface AnimatedFireBackgroundProps {
  intensity?: 'low' | 'medium' | 'high';
}

export const AnimatedFireBackground: React.FC<AnimatedFireBackgroundProps> = ({ intensity = 'medium' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle system for floating fire embers
    const particleCount = intensity === 'high' ? 90 : intensity === 'medium' ? 60 : 35;
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      fadeSpeed: number;
      color: string;
    }> = [];

    const colors = [
      'rgba(239, 68, 68, ',   // Red
      'rgba(249, 115, 22, ',  // Orange
      'rgba(245, 158, 11, ',  // Amber
      'rgba(252, 211, 77, '   // Bright Yellow Ember
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: height + Math.random() * 200,
        size: Math.random() * 3 + 1,
        speedY: Math.random() * 1.8 + 0.6,
        speedX: (Math.random() - 0.5) * 0.8,
        opacity: Math.random() * 0.8 + 0.2,
        fadeSpeed: Math.random() * 0.005 + 0.002,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    let waveTick = 0;

    const render = () => {
      waveTick += 0.02;

      // Dark obsidian ember gradient background
      const bgGradient = ctx.createLinearGradient(0, height, 0, 0);
      bgGradient.addColorStop(0, '#1c0a09');
      bgGradient.addColorStop(0.4, '#0c0a09');
      bgGradient.addColorStop(1, '#050505');

      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // Bottom fiery heat glow gradient
      const flameGlow = ctx.createRadialGradient(
        width / 2,
        height + 100,
        50,
        width / 2,
        height + 100,
        height * 0.7
      );
      flameGlow.addColorStop(0, 'rgba(239, 68, 68, 0.25)');
      flameGlow.addColorStop(0.5, 'rgba(249, 115, 22, 0.12)');
      flameGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = flameGlow;
      ctx.fillRect(0, 0, width, height);

      // Render floating ember particles
      particles.forEach((p) => {
        p.y -= p.speedY;
        p.x += p.speedX + Math.sin(waveTick + p.y * 0.01) * 0.5;
        p.opacity -= p.fadeSpeed;

        if (p.y < -20 || p.opacity <= 0) {
          p.y = height + Math.random() * 50;
          p.x = Math.random() * width;
          p.opacity = Math.random() * 0.8 + 0.2;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.opacity})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(249, 115, 22, 0.8)';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-80"
    />
  );
};
