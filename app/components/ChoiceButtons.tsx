"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { ChoiceType } from "@/lib/fracture";

export interface Choice {
  label: string;
  type: ChoiceType;
  locked?: boolean;
}

interface ChoiceButtonsProps {
  choices: Choice[];
  onSelect: (index: number) => void;
  timerSeconds?: number;
  timeoutIndex?: number; // which choice to auto-select on timeout
}

export default function ChoiceButtons({
  choices,
  onSelect,
  timerSeconds,
  timeoutIndex,
}: ChoiceButtonsProps) {
  const [timeLeft, setTimeLeft] = useState(timerSeconds ?? 0);
  const [selected, setSelected] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!timerSeconds) return;
    startTimeRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const remaining = timerSeconds - elapsed;
      if (remaining <= 0) {
        setTimeLeft(0);
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (!selected && timeoutIndex !== undefined) {
          setSelected(true);
          onSelect(timeoutIndex);
        }
      } else {
        setTimeLeft(remaining);
      }
    }, 50);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerSeconds, timeoutIndex, onSelect, selected]);

  const handleSelect = useCallback(
    (index: number) => {
      if (selected) return;
      if (choices[index].locked) return;
      setSelected(true);
      if (intervalRef.current) clearInterval(intervalRef.current);
      onSelect(index);
    },
    [selected, choices, onSelect]
  );

  const timerFraction = timerSeconds ? timeLeft / timerSeconds : 1;

  return (
    <div>
      {timerSeconds && (
        <div
          style={{
            width: "100%",
            height: "3px",
            background: "#333",
            marginBottom: "16px",
            borderRadius: "2px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${timerFraction * 100}%`,
              height: "100%",
              background:
                timerFraction > 0.3
                  ? "#C9A96E"
                  : timerFraction > 0.1
                    ? "#cc7722"
                    : "#ff4444",
              transition: "width 0.05s linear, background 0.3s",
            }}
          />
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {choices.map((choice, i) => (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            disabled={choice.locked || selected}
            style={{
              display: "block",
              width: "100%",
              textAlign: "left",
              padding: "14px 20px",
              background: "transparent",
              border: choice.locked
                ? "1px solid #333"
                : "1px solid #555",
              borderRadius: "4px",
              color: choice.locked
                ? "rgba(248, 240, 227, 0.3)"
                : "#f8f0e3",
              fontFamily: "Georgia, serif",
              fontSize: "1rem",
              cursor: choice.locked || selected ? "default" : "pointer",
              textDecoration: choice.locked ? "line-through" : "none",
              opacity: selected ? 0.5 : 1,
              transition: "border-color 0.2s, opacity 0.3s",
              lineHeight: 1.5,
            }}
            onMouseEnter={(e) => {
              if (!choice.locked && !selected) {
                (e.target as HTMLButtonElement).style.borderColor = "#C9A96E";
              }
            }}
            onMouseLeave={(e) => {
              if (!choice.locked && !selected) {
                (e.target as HTMLButtonElement).style.borderColor = "#555";
              }
            }}
          >
            {choice.label}
            {choice.locked && (
              <span
                style={{
                  fontSize: "0.75rem",
                  marginLeft: "8px",
                  color: "rgba(248, 240, 227, 0.2)",
                }}
              >
                [locked]
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
