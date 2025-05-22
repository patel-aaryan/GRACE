"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

interface ChatBackground {
  children?: React.ReactNode;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  side: "top" | "right" | "bottom" | "left";
  progress: number;
  progressSpeed: number;
  amplitude: number;
  hue: number;
  alpha: number;
}

export function ChatBackground({ children }: ChatBackground) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const particlesRef = useRef<Particle[]>([]);
  const frameRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0, active: false });

  // Use state for canvas dimensions
  const [dimensions, setDimensions] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Only run on client-side to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    // Generate initial particles along the sides
    const numParticles = 80;
    const sides: Array<"top" | "right" | "bottom" | "left"> = [
      "top",
      "right",
      "bottom",
      "left",
    ];

    particlesRef.current = Array.from({ length: numParticles }, (_, id) => {
      const side = sides[Math.floor(Math.random() * sides.length)];
      const progress = Math.random();
      const size = 2 + Math.random() * 3;
      let x = 0,
        y = 0;

      // Position particle based on which side it belongs to
      switch (side) {
        case "top":
          x = dimensions.width * progress;
          y = 0 + size + Math.random() * 60;
          break;
        case "right":
          x = dimensions.width - size - Math.random() * 60;
          y = dimensions.height * progress;
          break;
        case "bottom":
          x = dimensions.width * progress;
          y = dimensions.height - size - Math.random() * 60;
          break;
        case "left":
          x = 0 + size + Math.random() * 60;
          y = dimensions.height * progress;
          break;
      }

      return {
        id,
        x,
        y,
        size,
        vx: 0,
        vy: 0,
        side,
        progress,
        progressSpeed: 0.0005 + Math.random() * 0.001,
        amplitude: 10 + Math.random() * 20,
        hue: 190 + Math.random() * 30,
        alpha: 0.3 + Math.random() * 0.4,
      };
    });

    // Add mouse event listeners
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
        active: true,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      const particles = particlesRef.current;
      const baseColor =
        theme === "dark" ? "rgba(110, 200, 255," : "rgba(0, 100, 180,";

      // Draw connections first (so they appear behind particles)
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        // Only draw lines between some particles to reduce visual clutter
        if (Math.random() > 0.97) {
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Only connect nearby particles
            if (distance < 120 && p1.side === p2.side) {
              const alpha =
                Math.max(0, 0.6 - distance / 120) * p1.alpha * p2.alpha;

              ctx.beginPath();
              ctx.strokeStyle = `${baseColor}${alpha})`;

              // Draw a bezier curve for more organic connection
              const midX = (p1.x + p2.x) / 2;
              const midY = (p1.y + p2.y) / 2 - 10 + Math.random() * 20;

              ctx.moveTo(p1.x, p1.y);
              ctx.quadraticCurveTo(midX, midY, p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
      }

      // Update and draw each particle
      particles.forEach((p) => {
        // Update progress for movement along the side
        p.progress += p.progressSpeed;
        if (p.progress > 1) p.progress = 0;

        // Calculate position based on side and progress
        let targetX = p.x,
          targetY = p.y;
        const perpOffset = Math.sin(p.progress * Math.PI * 4) * p.amplitude;

        switch (p.side) {
          case "top":
            targetX = dimensions.width * p.progress;
            targetY = 0 + p.size + Math.abs(perpOffset);
            break;
          case "right":
            targetX = dimensions.width - p.size - Math.abs(perpOffset);
            targetY = dimensions.height * p.progress;
            break;
          case "bottom":
            targetX = dimensions.width * (1 - p.progress);
            targetY = dimensions.height - p.size - Math.abs(perpOffset);
            break;
          case "left":
            targetX = 0 + p.size + Math.abs(perpOffset);
            targetY = dimensions.height * (1 - p.progress);
            break;
        }

        // Attraction to mouse if active
        if (mouseRef.current.active) {
          const mouseX = mouseRef.current.x;
          const mouseY = mouseRef.current.y;
          const dx = mouseX - p.x;
          const dy = mouseY - p.y;
          const mouseDistance = Math.sqrt(dx * dx + dy * dy);

          if (mouseDistance < 150) {
            const force = (1 - mouseDistance / 150) * 0.3;
            p.vx += (dx * force) / mouseDistance;
            p.vy += (dy * force) / mouseDistance;
          }
        }

        // Gentle attraction back to frame position
        p.vx += (targetX - p.x) * 0.03;
        p.vy += (targetY - p.y) * 0.03;

        // Apply velocity with damping
        p.vx *= 0.92;
        p.vy *= 0.92;
        p.x += p.vx;
        p.y += p.vy;

        // Draw the particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${baseColor}${p.alpha})`;
        ctx.fill();
      });

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      cancelAnimationFrame(frameRef.current);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [dimensions, mounted, theme]);

  if (!mounted) return <>{children}</>;

  return (
    <>
      <div className="fixed inset-0 overflow-hidden -z-10">
        <canvas
          ref={canvasRef}
          className="absolute inset-0"
          style={{ pointerEvents: "none" }}
        />
      </div>
      <div className="relative z-0 min-h-screen">{children}</div>
    </>
  );
}
