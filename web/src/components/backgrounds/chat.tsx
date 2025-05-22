"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

interface ChatBackgroundProps {
  children?: React.ReactNode;
}

interface Circle {
  id: number;
  radius: number;
  targetRadius: number;
  growthRate: number;
  alpha: number;
  hue: number;
  pulseSpeed: number;
  pulsePhase: number;
}

export function ChatBackground({ children }: ChatBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const circlesRef = useRef<Circle[]>([]);
  const frameRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const centerRef = useRef({ x: 0, y: 0 });

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
      centerRef.current = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      };
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

    // Set center point
    centerRef.current = {
      x: dimensions.width / 2,
      y: dimensions.height / 2,
    };

    // Generate initial circles
    const numCircles = 15;
    const maxRadius = Math.max(dimensions.width, dimensions.height) * 0.8;

    circlesRef.current = Array.from({ length: numCircles }, (_, id) => {
      const radius = (id / numCircles) * maxRadius;
      return {
        id,
        radius,
        targetRadius: radius,
        growthRate: 0.01 + Math.random() * 0.03,
        alpha: 0.05 + Math.random() * 0.15,
        hue: 190 + Math.random() * 30,
        pulseSpeed: 0.005 + Math.random() * 0.01,
        pulsePhase: Math.random() * Math.PI * 2,
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

      // Create radial gradient for background
      const gradient = ctx.createRadialGradient(
        centerRef.current.x,
        centerRef.current.y,
        0,
        centerRef.current.x,
        centerRef.current.y,
        dimensions.width * 0.7
      );

      if (theme === "dark") {
        gradient.addColorStop(0, "rgba(30, 60, 100, 0.6)");
        gradient.addColorStop(1, "rgba(10, 20, 40, 0)");
      } else {
        gradient.addColorStop(0, "rgba(180, 220, 255, 0.6)");
        gradient.addColorStop(1, "rgba(240, 248, 255, 0)");
      }

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Calculate center shift based on mouse position
      let centerX = centerRef.current.x;
      let centerY = centerRef.current.y;

      if (mouseRef.current.active) {
        const mouseX = mouseRef.current.x;
        const mouseY = mouseRef.current.y;
        const dx = mouseX - centerX;
        const dy = mouseY - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxShift = 80;

        if (dist > 0) {
          const shift = Math.min(dist * 0.1, maxShift);
          centerX += (dx / dist) * shift;
          centerY += (dy / dist) * shift;
        }
      }

      // Update and draw circles
      const circles = circlesRef.current;
      const baseColor =
        theme === "dark" ? "rgba(100, 180, 255," : "rgba(30, 120, 210,";

      circles.forEach((circle, index) => {
        // Update circle pulse
        circle.pulsePhase += circle.pulseSpeed;
        const pulseFactor = 1 + Math.sin(circle.pulsePhase) * 0.1;

        // Calculate actual radius with pulse
        const actualRadius = circle.radius * pulseFactor;

        // Draw the circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, actualRadius, 0, Math.PI * 2);
        ctx.lineWidth = 1 + (index / circles.length) * 2;
        ctx.strokeStyle = `${baseColor}${
          circle.alpha * (1 - index / circles.length)
        })`;
        ctx.stroke();

        // Occasionally add some glow
        if (Math.random() > 0.7) {
          ctx.beginPath();
          ctx.arc(centerX, centerY, actualRadius, 0, Math.PI * 2);
          ctx.lineWidth = 3 + Math.random() * 2;
          ctx.strokeStyle = `${baseColor}${circle.alpha * 0.5})`;
          ctx.stroke();
        }

        // Add growing effect for outer circles
        if (index > circles.length * 0.6) {
          circle.radius += circle.growthRate;
          if (circle.radius > maxRadius) {
            circle.radius = (index / circles.length) * (maxRadius * 0.3);
          }
        }
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
