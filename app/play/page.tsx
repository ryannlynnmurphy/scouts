"use client";

import { useState, useCallback } from "react";
import Prelude from "@/app/components/Prelude";
import Scene1 from "@/app/components/Scene1";
import Scene2 from "@/app/components/Scene2";
import { getFractureCSS } from "@/lib/fracture";

type GameScene = "prelude" | "transition1" | "scene1" | "transition2" | "scene2" | "transition3" | "end";

export default function PlayPage() {
  const [scene, setScene] = useState<GameScene>("prelude");
  const [fracture, setFracture] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const transitionTo = useCallback((next: GameScene) => {
    setTransitioning(true);
    setTimeout(() => {
      setScene(next);
      setTimeout(() => {
        setTransitioning(false);
      }, 100);
    }, 1500);
  }, []);

  const handlePreludeComplete = useCallback(() => {
    setScene("scene1");
  }, []);

  const handleScene1Complete = useCallback(() => {
    transitionTo("scene2");
  }, [transitionTo]);

  const handleScene2Complete = useCallback(() => {
    transitionTo("end");
  }, [transitionTo]);

  const fractureStyle = getFractureCSS(fracture);

  return (
    <div
      style={{
        ...fractureStyle,
        minHeight: "100vh",
        background: "#1a1714",
        color: "#f8f0e3",
        position: "relative",
      }}
    >
      {/* Fade overlay for transitions */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "#000",
          opacity: transitioning ? 1 : 0,
          transition: "opacity 1s ease",
          pointerEvents: transitioning ? "all" : "none",
          zIndex: 100,
        }}
      />

      {scene === "prelude" && (
        <Prelude onComplete={handlePreludeComplete} />
      )}

      {scene === "scene1" && (
        <div
          style={{
            opacity: transitioning ? 0 : 1,
            transition: "opacity 0.8s ease",
          }}
        >
          <div
            style={{
              textAlign: "center",
              padding: "60px 24px 0",
              fontFamily: "Georgia, serif",
            }}
          >
            <p
              style={{
                fontSize: "0.85rem",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "rgba(248, 240, 227, 0.4)",
                marginBottom: "8px",
              }}
            >
              Scene One
            </p>
            <h2
              style={{
                fontSize: "1.8rem",
                color: "#ff4444",
                fontWeight: 400,
                margin: 0,
              }}
            >
              The Oath
            </h2>
          </div>
          <Scene1
            fracture={fracture}
            onFractureChange={setFracture}
            onComplete={handleScene1Complete}
          />
        </div>
      )}

      {scene === "scene2" && (
        <div
          style={{
            opacity: transitioning ? 0 : 1,
            transition: "opacity 0.8s ease",
          }}
        >
          <div
            style={{
              textAlign: "center",
              padding: "60px 24px 0",
              fontFamily: "Georgia, serif",
            }}
          >
            <p
              style={{
                fontSize: "0.85rem",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "rgba(248, 240, 227, 0.4)",
                marginBottom: "8px",
              }}
            >
              Scene Two
            </p>
            <h2
              style={{
                fontSize: "1.8rem",
                color: "#7eb8c9",
                fontWeight: 400,
                margin: 0,
              }}
            >
              The Cliff
            </h2>
          </div>
          <Scene2
            fracture={fracture}
            onFractureChange={setFracture}
            onComplete={handleScene2Complete}
          />
        </div>
      )}

      {scene === "end" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            fontFamily: "Georgia, serif",
            textAlign: "center",
            padding: "40px 24px",
            opacity: transitioning ? 0 : 1,
            transition: "opacity 1.5s ease",
          }}
        >
          <p
            style={{
              fontSize: "1.5rem",
              color: "#f8f0e3",
              marginBottom: "32px",
              fontStyle: "italic",
            }}
          >
            To be continued...
          </p>
          <p
            style={{
              fontSize: "0.85rem",
              color: "rgba(248, 240, 227, 0.4)",
              marginBottom: "8px",
            }}
          >
            Fracture: {Math.round(fracture * 100)}%
          </p>
          <p
            style={{
              fontSize: "0.75rem",
              color: "rgba(248, 240, 227, 0.3)",
              maxWidth: "400px",
              lineHeight: 1.6,
              marginBottom: "48px",
            }}
          >
            {fracture < 0.1
              ? "Quinn held on to who he is. For now."
              : fracture < 0.3
                ? "The cracks are forming, but Quinn can still feel."
                : fracture < 0.6
                  ? "Quinn is learning to perform. The real Quinn is getting harder to find."
                  : "Quinn is breaking. The performance is becoming the person."}
          </p>
          <button
            onClick={() => {
              setFracture(0);
              setScene("prelude");
            }}
            style={{
              padding: "12px 32px",
              background: "transparent",
              border: "1px solid #555",
              color: "#f8f0e3",
              fontFamily: "Georgia, serif",
              fontSize: "1rem",
              cursor: "pointer",
              borderRadius: "4px",
              transition: "border-color 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.borderColor = "#C9A96E";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.borderColor = "#555";
            }}
          >
            Play Again
          </button>
          <p
            style={{
              fontSize: "0.7rem",
              color: "rgba(248, 240, 227, 0.2)",
              marginTop: "64px",
            }}
          >
            SCOUTS -- based on the play by Ryann Murphy
          </p>
        </div>
      )}
    </div>
  );
}
