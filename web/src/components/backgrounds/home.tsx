"use client";

import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";

interface HomeBackgroundProps {
  children?: React.ReactNode;
}

interface BubbleShape {
  id: string;
  type: "bubble";
  size: number;
  left: string;
  delay: number;
  duration: number;
}

interface WaveShape {
  id: string;
  type: "wave";
  width: number;
  height: number;
  left: string;
  top: string;
  delay: number;
}

interface ConnectionShape {
  id: string;
  type: "connection";
  width: number;
  length: number;
  left: string;
  top: string;
  angle: number;
  delay: number;
}

type ShapeType = BubbleShape | WaveShape | ConnectionShape;

export function HomeBackground({ children }: HomeBackgroundProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Only run on client-side to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Define floating shapes with different sizes and animation patterns
  const floatingShapes: ShapeType[] = [
    // Rising bubbles (representing lightness and positive emotions)
    ...Array.from({ length: 8 }, (_, i) => ({
      id: `bubble-${i}`,
      type: "bubble" as const,
      size: Math.floor(Math.random() * 150) + 50, // 50-200px
      left: `${Math.random() * 90}%`,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 15, // 15-25s
    })),

    // Gentle waves (representing conversation flow)
    ...Array.from({ length: 4 }, (_, i) => ({
      id: `wave-${i}`,
      type: "wave" as const,
      width: Math.floor(Math.random() * 300) + 200, // 200-500px
      height: Math.floor(Math.random() * 50) + 30, // 30-80px
      left: `${Math.random() * 80}%`,
      top: `${20 + Math.random() * 60}%`,
      delay: Math.random() * 3,
    })),

    // Connection lines (representing relationships)
    ...Array.from({ length: 3 }, (_, i) => ({
      id: `connection-${i}`,
      type: "connection" as const,
      width: Math.floor(Math.random() * 2) + 1, // 1-3px
      length: Math.floor(Math.random() * 200) + 100, // 100-300px
      left: `${Math.random() * 70}%`,
      top: `${10 + Math.random() * 70}%`,
      angle: Math.random() * 60 - 30, // -30 to 30 degrees
      delay: Math.random() * 2,
    })),
  ];

  if (!mounted) return <>{children}</>;

  return (
    <div className="fixed inset-0 overflow-hidden -z-10">
      {floatingShapes.map((shape) => {
        if (shape.type === "bubble") {
          return (
            <motion.div
              key={shape.id}
              className="absolute rounded-full bg-primary"
              style={{
                opacity: theme === "dark" ? 0.06 : 0.03,
              }}
              initial={{
                width: shape.size,
                height: shape.size,
                x: shape.left,
                y: "110vh",
              }}
              animate={{
                y: "-20vh",
              }}
              transition={{
                duration: shape.duration,
                repeat: Infinity,
                delay: shape.delay,
                ease: "linear",
              }}
            />
          );
        }

        if (shape.type === "wave") {
          return (
            <motion.div
              key={shape.id}
              className="absolute bg-primary rounded-full"
              style={{
                width: shape.width,
                height: shape.height,
                left: shape.left,
                top: shape.top,
                opacity: theme === "dark" ? 0.04 : 0.02,
              }}
              animate={{
                scaleX: [1, 1.2, 1],
                scaleY: [1, 0.8, 1],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                delay: shape.delay,
                ease: "easeInOut",
              }}
            />
          );
        }

        if (shape.type === "connection") {
          return (
            <motion.div
              key={shape.id}
              className="absolute bg-primary"
              style={{
                width: shape.length,
                height: shape.width,
                left: shape.left,
                top: shape.top,
                opacity: theme === "dark" ? 0.07 : 0.04,
                transformOrigin: "left center",
                transform: `rotate(${shape.angle}deg)`,
              }}
              animate={{
                opacity: [
                  theme === "dark" ? 0.07 : 0.04,
                  theme === "dark" ? 0.12 : 0.08,
                  theme === "dark" ? 0.07 : 0.04,
                ],
                scaleX: [1, 1.1, 1],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                delay: shape.delay,
                ease: "easeInOut",
              }}
            />
          );
        }

        return null;
      })}
      {children}
    </div>
  );
}
