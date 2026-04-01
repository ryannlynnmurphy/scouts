"use client";

import { useState } from "react";

export default function PlayPage() {
  const [storyText, setStoryText] = useState<string[]>([
    "The campfire crackles. Five scouts sit in a circle, flashlights pointed at the ground.",
    "This is where the story begins.",
  ]);
  const [choices, setChoices] = useState<string[]>([
    "Look around the campsite",
    "Talk to the scout next to you",
    "Listen to the woods",
  ]);

  function handleChoice(index: number) {
    setStoryText((prev) => [...prev, `> ${choices[index]}`, "The story continues... (Ink.js integration coming in v0.2.0)"]);
    setChoices(["Continue"]);
  }

  return (
    <main className="min-h-screen bg-[#2D2A26] text-[#FAF8F5] p-8 max-w-2xl mx-auto">
      <div className="space-y-4 mb-8">
        {storyText.map((text, i) => (
          <p key={i} className={`${text.startsWith(">") ? "text-[#C9A96E] italic" : "text-[#FAF8F5]/90"} leading-relaxed`}>
            {text}
          </p>
        ))}
      </div>
      <div className="space-y-2">
        {choices.map((choice, i) => (
          <button key={i} onClick={() => handleChoice(i)} className="block w-full text-left px-4 py-3 border border-[#C9A96E]/30 rounded hover:bg-[#C9A96E]/10 hover:border-[#C9A96E] transition-colors">
            {choice}
          </button>
        ))}
      </div>
    </main>
  );
}
