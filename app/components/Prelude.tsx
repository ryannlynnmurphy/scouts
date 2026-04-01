"use client";

import { useState, useEffect, useRef } from "react";

const FRAGMENTS = [
  "Be a man",
  "I feel like I'm constantly performing",
  "What does being a man mean to you?",
  "GAYYY",
  "Can I please be your girl?",
  "Do I have to be a man?",
  "I don't like being outside",
  "LITTLE FAGGOT",
  "You're my girl",
  "I'm trying to grab life by the balls",
  "You're soft",
  "DOMINANCE",
  "cold all the time",
  "What kind of scout",
  "We're gonna make men out of you",
];

interface PreludeProps {
  onComplete: () => void;
}

interface FloatingFragment {
  id: number;
  text: string;
  x: number;
  y: number;
  size: number;
  opacity: number;
}

export default function Prelude({ onComplete }: PreludeProps) {
  const [fragments, setFragments] = useState<FloatingFragment[]>([]);
  const [phase, setPhase] = useState<"cacophony" | "fadeout" | "black">("cacophony");
  const idRef = useRef(0);
  const elapsedRef = useRef(0);

  // Spawn fragments
  useEffect(() => {
    if (phase !== "cacophony") return;

    const startTime = Date.now();

    const spawnInterval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      elapsedRef.current = elapsed;

      // End after 20 seconds
      if (elapsed > 20) {
        clearInterval(spawnInterval);
        setPhase("fadeout");
        return;
      }

      // Increase intensity over time: more fragments spawn faster
      const intensity = Math.min(1, elapsed / 15);
      const spawnCount = Math.floor(1 + intensity * 3);

      const newFragments: FloatingFragment[] = [];
      for (let s = 0; s < spawnCount; s++) {
        const text = FRAGMENTS[Math.floor(Math.random() * FRAGMENTS.length)];
        newFragments.push({
          id: idRef.current++,
          text,
          x: Math.random() * 80 + 5,
          y: Math.random() * 80 + 5,
          size: 1 + Math.random() * 2,
          opacity: 0.3 + intensity * 0.7,
        });
      }

      setFragments((prev) => {
        const combined = [...prev, ...newFragments];
        // Keep max 30 on screen
        return combined.slice(-30);
      });
    }, 200);

    return () => clearInterval(spawnInterval);
  }, [phase]);

  // Remove fragments after they appear (200-400ms visible)
  useEffect(() => {
    if (phase !== "cacophony") return;

    const cleanup = setInterval(() => {
      setFragments((prev) => {
        if (prev.length <= 3) return prev;
        // Remove oldest fragments
        return prev.slice(Math.floor(prev.length / 3));
      });
    }, 300);

    return () => clearInterval(cleanup);
  }, [phase]);

  // Fadeout phase
  useEffect(() => {
    if (phase === "fadeout") {
      setFragments([]);
      const timer = setTimeout(() => setPhase("black"), 500);
      return () => clearTimeout(timer);
    }
    if (phase === "black") {
      const timer = setTimeout(() => onComplete(), 2000);
      return () => clearTimeout(timer);
    }
  }, [phase, onComplete]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#000",
        overflow: "hidden",
        opacity: phase === "fadeout" ? 0 : 1,
        transition: "opacity 0.5s",
      }}
    >
      {fragments.map((frag) => (
        <span
          key={frag.id}
          style={{
            position: "absolute",
            left: `${frag.x}%`,
            top: `${frag.y}%`,
            fontSize: `${frag.size}rem`,
            color: "#f8f0e3",
            opacity: frag.opacity,
            fontFamily: "Georgia, serif",
            fontWeight: frag.text === frag.text.toUpperCase() ? 700 : 400,
            whiteSpace: "nowrap",
            pointerEvents: "none",
            animation: "fragment-pulse 0.4s ease-out forwards",
            textShadow:
              frag.text === "LITTLE FAGGOT" || frag.text === "GAYYY"
                ? "0 0 20px rgba(255,68,68,0.5)"
                : "none",
          }}
        >
          {frag.text}
        </span>
      ))}

      {phase === "black" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "#000",
          }}
        />
      )}

      <style>{`
        @keyframes fragment-pulse {
          0% { transform: scale(0.8); opacity: 0; }
          30% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: var(--frag-opacity, 0.8); }
        }
      `}</style>
    </div>
  );
}
