# SCOUTS: Animated Movie — Design Spec

## Overview

Strip all game mechanics from the SCOUTS Phaser project and rebuild it as a linear cinematic playback of the six-person script (`scouts-choices.txt`). The viewer clicks to advance dialogue. No choices, no branching, no fracture system, no inventory. Every word of the script, performed in order, with theatrical lighting and staging drawn from the Fordham production.

Simon is renamed **Quinn**. Sam is renamed **Matt**.

## Source of Truth

`C:/Users/cjpmu/scouts-choices.txt` — the six-person version of the script. Every line transcribed faithfully with Quinn/Matt name replacements.

## Characters

| Script Name | Game Name | Color     | Role                              |
|-------------|-----------|-----------|-----------------------------------|
| Simon       | Quinn     | #d4a0d0   | The heart. Trans/GNC.             |
| Sam         | Matt      | #7eb8c9   | The "straight" one. Quinn's person. |
| Brent       | Brent     | #ff4444   | The alpha. The wound.             |
| Josh        | Josh      | #8a9a5a   | The soldier.                      |
| Noah        | Noah      | #d4a44a   | The brain.                        |
| Lucas       | Lucas     | #5a9a8a   | The quiet one / nice guy.         |

## Architecture

### What Gets Removed

- `ChoiceTracker` — no player choices
- `FractureManager` — no psychological meter
- `InventoryManager` — no items
- `ChoiceButtons` — no choice UI
- `InventoryBar` — no item display
- `items.ts` — no item definitions
- All choice/timer/fracture/branching logic in `DialogueManager`
- All branching beat paths in scene data files
- The `Beat.choices`, `Beat.timer`, `Beat.onEnter` (item/fracture hooks) fields from the type system

### What Gets Kept and Refactored

- **`DialogueManager`** — becomes a linear playback engine. Lines advance on click/tap. Some lines auto-advance with configurable delays.
- **`SceneDirector`** — walks through scenes in fixed linear order. No branching.
- **`DialogueBox`** — typewriter text (~30ms/char), speaker name with character color, stage directions in italic at 50% alpha. Click to skip typewriter, click again to advance.
- **`CharacterSprites`** — character positions per scene, idle breathing tween, speaker highlighting (dim non-speakers to 0.5 alpha, bounce active speaker).
- **`TransitionOverlay`** — fade to black between scenes.
- **`AudioManager`** — ambient loops per scene location (forest, cliff wind, meadow birds, lake water, silence for void). Transition sound on scene changes.

### New System: LightingDirector

Controls scene tint and color over time, matching the Fordham production's lighting design:

- **Blue** (#2233aa wash) — vulnerability, tenderness, the Gay Shit scenes, Different monologues
- **Red** (#aa2222 flood) — violence, the ceremony escalation, blood, Brent's ghost
- **Green/amber** (#334422 / #aa8833) — campfire normality, group scenes
- **Black + spotlight** — void monologues, pure isolation
- **Purple/blue** (#442266) — the meadow, the transition between tenderness and reality

Lighting cues are embedded in the scene data. The LightingDirector applies them as tinted overlays and camera color adjustments. Within a scene, lighting can shift (e.g., the ceremony starts amber and transitions to red as violence escalates).

## Data Format

### Types

```typescript
type SceneKey = "CampfireScene" | "CliffScene" | "MeadowScene" | "LakeScene" | "VoidScene";

type CharacterKey = "quinn" | "matt" | "brent" | "josh" | "noah" | "lucas";

interface LightingCue {
  tint: string;         // hex color for scene tint overlay
  intensity: number;    // 0-1
  transition: number;   // ms to fade to this state
}

interface StageDirection {
  enter?: string[];     // characters entering
  exit?: string[];      // characters exiting
  position?: Record<string, { x: number; y: number }>; // reposition characters
  effect?: "shake" | "flash" | "blood"; // visual effects
}

interface CinematicLine {
  speaker: string | null;       // character key, null = stage direction
  text: string;
  autoAdvance?: number;         // ms — auto-advance after this delay
  pause?: number;               // ms — pause before showing this line
  lighting?: LightingCue;       // color/intensity shift on this line
  direction?: StageDirection;   // character movement/effects
  overlap?: boolean;            // true = show simultaneously with next lines (for cacophony)
  expression?: string;          // character expression change
}

interface CinematicScene {
  id: string;
  title: string;
  location: SceneKey;
  characters: string[];         // who starts on stage
  lines: CinematicLine[];
  ambientKey?: string;          // audio ambient to play
  initialLighting?: LightingCue;
}
```

### Scene Data Files

Each scene from the script becomes one TypeScript file in `game/data/scenes/` exporting a `CinematicScene`. The script text is transcribed line-by-line from `scouts-choices.txt` with Quinn/Matt substitutions.

## Scenes (in order)

| # | ID | Title | Location | Characters | Lighting |
|---|---|---|---|---|---|
| 1 | prelude | The Different Prelude | VoidScene | All 6 | Black, shifting spotlights |
| 2 | scene1-oath | Scene One: The Oath | CampfireScene | All 6 | Green/amber |
| 3 | different-noah | Different 1: Noah | VoidScene | Noah | Gold spotlight |
| 4 | scene1-sacrifice | Scene One: The Sacrifice | CampfireScene | All 6 | Green/amber -> red |
| 5 | different-quinn | Different 2: Quinn | VoidScene | Quinn | Lavender spotlight |
| 6 | scene1-kiss-test | Scene One: The Kiss Test | CampfireScene | All 6 | Green/amber |
| 7 | different-lucas | Different 3: Lucas | VoidScene | Lucas | Sage spotlight |
| 8 | scene1-pickup-lines | Scene One: Pickup Lines | CampfireScene | All 6 | Green/amber |
| 9 | scene1-resistance | Scene One: The Resistance | CampfireScene | All 6 | Green/amber |
| 10 | different-josh | Different 4: Josh | VoidScene | Josh | Olive spotlight |
| 11 | gay-shit-anthem | The National Anthem | CampfireScene | All 6 | Rainbow / joyful |
| 12 | gay-shit-act1 | Gay Shit Act 1: The Cliff | CliffScene | Quinn, Matt | Deep blue |
| 13 | gay-shit-act2 | Gay Shit Act 2: The Meadow | MeadowScene | Quinn, Matt | Purple/blue |
| 14 | gay-shit-act3 | Gay Shit Act 3: The Stars | LakeScene | Quinn, Matt | Deep blue |
| 15 | different-matt | Different 5: Matt | VoidScene | Matt | Teal spotlight |
| 16 | ceremony | The Ceremony | CampfireScene | All 6 | Amber -> red |
| 17 | different-brent | Different 6: Brent | VoidScene | Brent | Red spotlight |
| 18 | ending | END PLAY | VoidScene | None | Black |

## Interaction Model

- **Click/tap anywhere on the canvas** advances to the next line
- **Typewriter effect** at ~30ms per character; click to instantly complete the current line, click again to advance
- **Auto-advance sequences** for: the Prelude cacophony, Scout oath/law recitations, the Gay anthem lyrics, the ceremony chants, howling. These play out on timers without requiring clicks.
- **Pause beats** between scenes: fade to black (800ms), hold (400ms), fade in (800ms)
- **No HUD** besides the dialogue box at the bottom of the screen

## Visual Design

### Staging (from production photos)

- **Group scenes (CampfireScene):** Characters in a line, the branch arch silhouette behind them, campfire glow at bottom center. Brent paces in front.
- **Monologues (VoidScene):** Single character center stage in a circle of colored light. Pure black everywhere else. Other characters may be dimly visible lying/sitting at edges (per the production photos).
- **Gay Shit scenes (Cliff/Meadow/Lake):** Quinn and Matt only. Intimate positioning — sitting side by side, back to back, one leaning on the other. Minimal environment.
- **The Ceremony climax:** Characters shift from formation to chaos. Red light floods. After Quinn kills Brent, Brent's sprite disappears.
- **Brent's ghost:** Blood-soaked tank top sprite. Single red spotlight. The arch visible in deep red behind.

### Character Sprites

- Scout uniforms with neckerchiefs (default state)
- Multiple expressions per character (neutral, scared, angry, tender, etc.)
- Blood appears on Quinn after the squirrel scene
- Brent's final monologue: different sprite — tank top, covered in blood

### The Campfire

A warm-colored glow effect at bottom center of group scenes. Not a detailed sprite — more of a light source. Matches the rope/cloth campfire from the production.

### The Branch Arch

A dark silhouette of curved branches forming an arch behind the characters in CampfireScene. Minimal, theatrical.

## Title Screen

Keep the existing dark (#1a1714) / gold (#c9a96e) / cream (#f8f0e3) aesthetic. 

- "SCOUTS" in large Playfair Display
- "by Ryann Lynn Murphy" beneath
- Content warning text
- "Begin" button
- No game-specific language

## Audio

| Location | Ambient | Notes |
|---|---|---|
| CampfireScene | Forest (crickets, wind) | Warm, present |
| CliffScene | Cliff wind | Exposed, vulnerable |
| MeadowScene | Meadow birds | Gentle, safe |
| LakeScene | Lake water | Still, intimate |
| VoidScene | Silence | Total isolation |

Transition sound plays between scenes. No tinnitus, no heartbeat, no fracture-driven audio changes.

## File Structure (final)

```
app/
  page.tsx              -- Title screen (updated, no game language)
  play/
    page.tsx            -- Mounts Phaser game
  globals.css
  layout.tsx
game/
  Game.tsx              -- React Phaser wrapper
  config.ts             -- Phaser config (same 5 scenes)
  constants.ts          -- GAME_WIDTH, GAME_HEIGHT
  data/
    types.ts            -- CinematicLine, CinematicScene, LightingCue, etc.
    characters.ts       -- 6 characters (Quinn, Matt, Brent, Josh, Noah, Lucas)
    scene-order.ts      -- Linear array of 18 scene entries
    scenes/
      prelude.ts
      scene1-oath.ts
      different-noah.ts
      scene1-sacrifice.ts
      different-quinn.ts
      scene1-kiss-test.ts
      different-lucas.ts
      scene1-pickup-lines.ts
      scene1-resistance.ts
      different-josh.ts
      gay-shit-anthem.ts
      gay-shit-act1.ts
      gay-shit-act2.ts
      gay-shit-act3.ts
      different-matt.ts
      ceremony.ts
      different-brent.ts
      ending.ts
  scenes/
    BootScene.ts        -- Asset preload
    CampfireScene.ts    -- Group scenes
    CliffScene.ts       -- Gay Shit Act 1
    MeadowScene.ts      -- Gay Shit Act 2
    LakeScene.ts        -- Gay Shit Act 3
    VoidScene.ts        -- Monologues, prelude, ending
  systems/
    AudioManager.ts     -- Simplified (no fracture-driven changes)
    DialogueManager.ts  -- Linear playback, no choices
    LightingDirector.ts -- NEW: scene tint/color control
    SceneDirector.ts    -- Linear scene advancement
  ui/
    CharacterSprites.ts -- Positioning, expressions, speaker highlighting
    DialogueBox.ts      -- Typewriter text, speaker names
    TransitionOverlay.ts -- Fade transitions
public/
  assets/
    audio/              -- Ambient loops, transition sound
    sprites/            -- Character sprites, backgrounds
```

## What This Is Not

- Not a game. No player agency beyond advancing dialogue.
- Not a video file. It runs live in the engine with real-time rendering.
- Not an adaptation. It is the script, performed digitally.
