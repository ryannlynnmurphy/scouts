import { SceneScript } from "../types";

// NOTE FOR SCENEDIRECTOR:
// This file defines endings for all five suspicion/fracture paths.
// The SceneDirector should check suspicion level, fracture level, and
// ChoiceTracker flags BEFORE entering this scene and override startBeat:
//
// SUSPICION-BASED PATHS (check suspicion first):
//   suspicion < 0.3 at end                -> "ending-invisible"    (Path 1: The Invisible Path)
//   suspicion 0.3-0.6 at end              -> "ending-suspicion"    (Path 2: The Suspicion Path)
//   ChoiceTracker.chose("callout-so-what") -> "ending-defiance"    (Path 3: The Defiance Path)
//   ChoiceTracker.chose("exposure-*")      -> "ending-exposure"    (Path 4: The Exposure Path)
//   ChoiceTracker.protectionScore() high   -> "ending-protection"  (Path 5: The Protection Path)
//
// FRACTURE-BASED PATHS (fallback if no suspicion path triggers):
//   fracture < 0.30                       -> "ending-low"
//   fracture >= 0.30 && fracture <= 0.60  -> "ending-medium" (= "ending-start")
//   fracture > 0.60                       -> "ending-high"
//   ChoiceTracker.allGayShitDeflected()   -> "ending-alone"
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
    // === SUSPICION PATH ENDINGS ===

    // Path 1: The Invisible Path (suspicion < 0.3 at end)
    {
      id: "ending-invisible",
      location: "VoidScene",
      lines: [
        {
          speaker: null,
          text: "Simon walked out of the woods the way he walked in.",
        },
        {
          speaker: null,
          text: "Invisible. Safe. Empty.",
        },
        {
          speaker: null,
          text: "No one knows who he really is. Not even Sam knows how much Simon sacrificed to keep them safe.",
        },
      ],
      nextBeat: "ending-credits",
    },
    // Path 2: The Suspicion Path (suspicion 0.3-0.6 at end)
    {
      id: "ending-suspicion",
      location: "VoidScene",
      lines: [
        {
          speaker: null,
          text: "Simon walked out of the woods with Brent's eyes still on his back.",
        },
        {
          speaker: null,
          text: "He never confirmed anything. He never denied anything.",
        },
        {
          speaker: null,
          text: "The flower stayed half-open. Waiting for a braver day.",
        },
      ],
      nextBeat: "ending-credits",
    },
    // Path 3: The Defiance Path (Simon chose "So what if we are?")
    {
      id: "ending-defiance",
      location: "VoidScene",
      lines: [
        {
          speaker: null,
          text: "Simon walked out of the woods with blood on his hands and Sam's hand in his.",
        },
        {
          speaker: null,
          text: "He didn't know if it was worth it.",
        },
        {
          speaker: null,
          text: "But he knew who he was.",
        },
      ],
      nextBeat: "ending-credits",
    },
    // Path 4: The Exposure Path (Brent caught them at the lake)
    {
      id: "ending-exposure",
      location: "VoidScene",
      lines: [
        {
          speaker: null,
          text: "The stars were still there.",
        },
        {
          speaker: null,
          text: "Even after everything.",
        },
        {
          speaker: null,
          text: "Simon looked up and they were still there.",
        },
      ],
      nextBeat: "ending-credits",
    },
    // Path 5: The Protection Path (Simon consistently protected Sam)
    {
      id: "ending-protection",
      location: "VoidScene",
      lines: [
        {
          speaker: null,
          text: "Simon walked out of the woods alone.",
        },
        {
          speaker: null,
          text: "He told Sam to go ahead. He needed a minute.",
        },
        {
          speaker: null,
          text: "He sat on a stump and looked at his hands. Then he looked at the flower Sam gave him.",
        },
        {
          speaker: null,
          text: "It was still blooming.",
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
