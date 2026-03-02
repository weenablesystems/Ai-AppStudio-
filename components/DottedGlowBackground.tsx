/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useEffect, useRef } from 'react';

type DottedGlowBackgroundProps = {
  className?: string;
  gap?: number;
  radius?: number;
  color?: string;
  glowColor?: string;
  opacity?: number;
  speedMin?: number;
  speedMax?: number;
  speedScale?: number;
};

export default function DottedGlowBackground({
  className,
  gap = 12,
  radius = 2,
  color = "rgba(0,0,0,0.05)",
  glowColor = "rgba(26, 115, 232, 0.2)",
  opacity = 1,
  speedMin = 0.5,
  speedMax = 1.5,
  speedScale = 0.8,
}: DottedGlowBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = canvasRef.current;
    const container = containerRef.current;
    if (!el || !container) return;

    const ctx = el.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let stopped = false;

    const dpr = Math.max(1, window.devicePixelRatio || 1);

    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      el.width = Math.max(1, Math.floor(width * dpr));
      el.height = Math.max(1, Math.floor(height * dpr));
      el.style.width = `${width}px`;
      el.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(container);
    setTimeout(resize, 0);

    let particles: { x: number; y: number; radius: number; speedY: number; speedX: number; phase: number }[] = [];

    const initParticles = () => {
      particles = [];
      const { width, height } = container.getBoundingClientRect();
      const particleCount = Math.floor((width * height) / 20000); // Responsive particle count
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 3 + 1,
          speedY: -(Math.random() * 0.5 + 0.2) * speedScale,
          speedX: (Math.random() - 0.5) * 0.5 * speedScale,
          phase: Math.random() * Math.PI * 2,
        });
      }
    };

    initParticles();
    window.addEventListener("resize", initParticles);

    const draw = (now: number) => {
      if (stopped) return;
      const { width, height } = container.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);
      ctx.globalAlpha = opacity;

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(now / 1000 + p.phase) * 0.2;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        
        ctx.fillStyle = color;
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = p.radius * 3;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", initParticles);
      ro.disconnect();
    };
  }, [color, glowColor, opacity, speedScale]);

  return (
    <div ref={containerRef} className={className} style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
      <canvas ref={canvasRef} style={{ display: "block" }} />
    </div>
  );
}