import { SceneScript } from "../types";

// NOTE FOR SCENEDIRECTOR:
// This file defines a single "ending-start" beat with generic closing text.
// The SceneDirector should check fracture level and ChoiceTracker flags BEFORE
// entering this scene and override startBeat accordingly:
//
//   fracture < 0.30                       -> "ending-low"
//   fracture >= 0.30 && fracture <= 0.60  -> "ending-medium"
//   fracture > 0.60                       -> "ending-high"
//   ChoiceTracker.allGayShitDeflected()   -> "ending-alone"
//     (i.e. Simon deflected every single Gay Shit Act choice -- never opened up to Sam)
//
// "ending-start" is the fallback and also serves as the medium ending.

export const SCRIPT: SceneScript = {
  id: "ending",
  title: "SCOUTS",
  beats: [
    // Low fracture ending (< 30%)
    {
      id: "ending-low",
      location: "VoidScene",
      lines: [
        {
          speaker: null,
          text: "Simon walked out of the woods different from how he walked in.",
        },
        {
          speaker: null,
          text: "Not because Brent made a man out of him.",
        },
        {
          speaker: null,
          text: "Because he didn't let Brent take away who he already was.",
        },
      ],
      nextBeat: "ending-credits",
    },
    // Medium fracture ending (30-60%) -- also the default
    {
      id: "ending-start",
      location: "VoidScene",
      lines: [
        {
          speaker: null,
          text: "Simon walked out of the woods.",
        },
        {
          speaker: null,
          text: "He wasn't sure who he was anymore.",
        },
        {
          speaker: null,
          text: "But he knew one thing: Sam's hand was warm, and the stars were still there.",
        },
      ],
      nextBeat: "ending-credits",
    },
    // High fracture ending (> 60%)
    {
      id: "ending-high",
      location: "VoidScene",
      lines: [
        {
          speaker: null,
          text: "Simon walked out of the woods.",
        },
        {
          speaker: null,
          text: "He didn't talk for three days.",
        },
        {
          speaker: null,
          text: "When he finally did, the only word that came out was Sam's name.",
        },
      ],
      nextBeat: "ending-credits",
    },
    // Never opened up to Sam ending
    {
      id: "ending-alone",
      location: "VoidScene",
      lines: [
        {
          speaker: null,
          text: "Simon walked out of the woods alone.",
        },
        {
          speaker: null,
          text: "Sam called after him.",
        },
        {
          speaker: null,
          text: "He didn't turn around.",
        },
      ],
      nextBeat: "ending-credits",
    },
    // Credits -- shared by all paths
    {
      id: "ending-credits",
      location: "VoidScene",
      lines: [
        { speaker: null, text: "..." },
        { speaker: null, text: "SCOUTS" },
        { speaker: null, text: "by Ryann Lynn Murphy" },
        { speaker: null, text: "(Your inventory is displayed. Each item with its final tooltip.)" },
        { speaker: null, text: "(The flower is still in full color. Even if everything else is cracked and gray.)" },
      ],
      nextBeat: "end",
    },
  ],
};

export default SCRIPT;
