"use client";

import { useState, useEffect, useCallback } from "react";

const CHARACTER_COLORS: Record<string, string> = {
  BRENT: "#ff4444",
  QUINN: "#d4a0d0",
  MATT: "#7eb8c9",
};

interface DialogueEntry {
  character?: string;
  text: string;
  isStageDirection?: boolean;
}

interface DialogueBoxProps {
  entries: DialogueEntry[];
  onComplete: () => void;
  typingSpeed?: number;
}

export default function DialogueBox({
  entries,
  onComplete,
  typingSpeed = 30,
}: DialogueBoxProps) {
  const [currentEntryIndex, setCurrentEntryIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  const currentEntry = entries[currentEntryIndex];
  const fullText = currentEntry?.text ?? "";

  useEffect(() => {
    setDisplayedText("");
    setIsTyping(true);
  }, [currentEntryIndex]);

  useEffect(() => {
    if (!isTyping || !currentEntry) return;

    if (displayedText.length >= fullText.length) {
      setIsTyping(false);
      return;
    }

    const timer = setTimeout(() => {
      setDisplayedText(fullText.slice(0, displayedText.length + 1));
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayedText, fullText, isTyping, typingSpeed, currentEntry]);

  const handleClick = useCallback(() => {
    if (isTyping) {
      // Skip to full text
      setDisplayedText(fullText);
      setIsTyping(false);
    } else if (currentEntryIndex < entries.length - 1) {
      setCurrentEntryIndex((i) => i + 1);
    } else {
      onComplete();
    }
  }, [isTyping, fullText, currentEntryIndex, entries.length, onComplete]);

  if (!currentEntry) return null;

  return (
    <div
      onClick={handleClick}
      style={{ cursor: "pointer", minHeight: "120px" }}
    >
      {/* Show all completed entries */}
      {entries.slice(0, currentEntryIndex).map((entry, i) => (
        <div key={i} style={{ marginBottom: "16px" }}>
          {entry.isStageDirection ? (
            <p
              style={{
                fontFamily: "'Courier New', monospace",
                fontStyle: "italic",
                color: "rgba(248, 240, 227, 0.6)",
                paddingLeft: "24px",
                margin: 0,
                lineHeight: 1.7,
              }}
            >
              {entry.text}
            </p>
          ) : (
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              {entry.character && (
                <span
                  style={{
                    fontWeight: 700,
                    color: CHARACTER_COLORS[entry.character] ?? "#f8f0e3",
                    marginRight: "8px",
                  }}
                >
                  {entry.character}:
                </span>
              )}
              <span style={{ color: "#f8f0e3" }}>{entry.text}</span>
            </p>
          )}
        </div>
      ))}

      {/* Current entry being typed */}
      <div style={{ marginBottom: "16px" }}>
        {currentEntry.isStageDirection ? (
          <p
            style={{
              fontFamily: "'Courier New', monospace",
              fontStyle: "italic",
              color: "rgba(248, 240, 227, 0.6)",
              paddingLeft: "24px",
              margin: 0,
              lineHeight: 1.7,
            }}
          >
            {displayedText}
            {isTyping && (
              <span style={{ opacity: 0.5 }}>|</span>
            )}
          </p>
        ) : (
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            {currentEntry.character && (
              <span
                style={{
                  fontWeight: 700,
                  color:
                    CHARACTER_COLORS[currentEntry.character] ?? "#f8f0e3",
                  marginRight: "8px",
                }}
              >
                {currentEntry.character}:
              </span>
            )}
            <span style={{ color: "#f8f0e3" }}>
              {displayedText}
              {isTyping && (
                <span style={{ opacity: 0.5 }}>|</span>
              )}
            </span>
          </p>
        )}
      </div>

      {!isTyping && currentEntryIndex < entries.length - 1 && (
        <p
          style={{
            color: "rgba(248, 240, 227, 0.3)",
            fontSize: "0.85rem",
            textAlign: "center",
            marginTop: "24px",
          }}
        >
          click to continue
        </p>
      )}
    </div>
  );
}

export type { DialogueEntry };
