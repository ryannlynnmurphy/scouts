# SCOUTS Game Engine Foundation -- Implementation Plan (Plan A of 4)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the core Phaser.js game engine with dialogue system, choice system, fracture mechanic, inventory, and scene management -- producing a playable skeleton that content (Plan C) plugs into.

**Architecture:** Next.js hosts a landing page at `/` and mounts a Phaser 3 canvas at `/play`. Phaser manages 6 scene classes (5 locations + void). A custom dialogue engine reads JSON scene scripts and renders text with typewriter effect, character portraits, and timed/untimed choice buttons. The fracture system is a global state manager that drives a post-processing pipeline (desaturation, vignette, audio mixing). Inventory is a persistent UI overlay.

**Tech Stack:** Next.js 16, Phaser 3.80+, TypeScript, Howler.js (audio), Vite (bundled by Next.js)

**Source spec:** `docs/superpowers/specs/2026-04-01-scouts-game-overhaul-design.md`

---

## File Structure

```
/c/Users/cjpmu/SCOUTS/
  app/
    page.tsx                    -- Landing page (title screen, content warning, "Begin")
    play/
      page.tsx                  -- Mounts Phaser canvas as client component
    globals.css                 -- Global styles (already exists)
    layout.tsx                  -- Root layout (already exists)
  game/
    config.ts                   -- Phaser game config (dimensions, scenes, physics off)
    Game.tsx                    -- React component that initializes Phaser
    scenes/
      BootScene.ts              -- Preloads all assets, shows loading bar
      CampfireScene.ts          -- Main campfire clearing (most scenes happen here)
      CliffScene.ts             -- Gay Shit Act 1
      MeadowScene.ts            -- Gay Shit Act 2
      LakeScene.ts              -- Gay Shit Act 3
      VoidScene.ts              -- Monologue spotlight scenes
    systems/
      DialogueManager.ts        -- Reads scene scripts, renders text/choices, manages flow
      FractureManager.ts        -- Global fracture state, world effect calculations
      InventoryManager.ts       -- Item tracking, tooltip rendering
      SceneDirector.ts          -- Orchestrates scene order, transitions, handles the full play flow
      ChoiceTracker.ts          -- Records all player choices for ending calculation
    ui/
      DialogueBox.ts            -- Phaser UI: text area, speaker name, portrait frame
      ChoiceButtons.ts          -- Phaser UI: 2-3 choice buttons with optional timer bar
      InventoryBar.ts           -- Phaser UI: 6 slots top-right
      TransitionOverlay.ts      -- Fade to black / fade in overlay
    data/
      characters.ts             -- Character definitions (name, color, portrait keys, expressions)
      items.ts                  -- Inventory item definitions (id, name, icon, tooltips by fracture)
      scene-order.ts            -- The full play sequence as an ordered list
      scenes/                   -- One JSON-like TS file per scene block
        scene1-oath.ts          -- Dialogue + choices for oath/interrogation
        scene1-sacrifice.ts     -- Dialogue + choices for squirrel sacrifice
        scene1-kiss-test.ts     -- Dialogue + choices for kiss test + oath
        scene1-pickup-lines.ts  -- Dialogue + choices for sex doll + pickup lines
        scene1-resistance.ts    -- Dialogue + choices for boys pushing back
        ceremony.ts             -- Dialogue + choices for alpha chants + fight
        monologue-noah.ts       -- Noah's monologue
        monologue-simon.ts      -- Simon's monologue (with choices)
        monologue-lucas.ts      -- Lucas's monologue
        monologue-josh.ts       -- Josh's monologue
        monologue-simon-sam.ts  -- Simon & Sam meta scene
        monologue-sam.ts        -- Sam's pillow monologue
        monologue-brent.ts      -- Brent's final monologue
        gay-shit-anthem.ts      -- National Anthem sequence
        gay-shit-act1.ts        -- The Cliff
        gay-shit-act2.ts        -- The Meadow
        gay-shit-act3.ts        -- The Lake
        ending.ts               -- Ending text calculations
    assets/
      placeholder/              -- Colored rectangles standing in for real art (Plan B)
  public/
    assets/
      audio/                    -- Audio files (Plan D)
      sprites/                  -- Pixel art spritesheets (Plan B)
      ui/                       -- UI graphics (Plan B)
```

---

## Task 1: Strip Current App + Install Phaser

**Files:**
- Modify: `app/play/page.tsx`
- Modify: `package.json`
- Delete: `app/components/Prelude.tsx`, `Scene1.tsx`, `Scene2.tsx`, `DialogueBox.tsx`, `ChoiceButtons.tsx`
- Delete: `lib/fracture.ts`

- [ ] **Step 1: Install Phaser and Howler**

```bash
cd /c/Users/cjpmu/SCOUTS
npm install phaser howler
npm install --save-dev @types/howler
```

- [ ] **Step 2: Remove old components**

Delete the old React-based game components:
```bash
rm -rf app/components/Prelude.tsx app/components/Scene1.tsx app/components/Scene2.tsx app/components/DialogueBox.tsx app/components/ChoiceButtons.tsx lib/fracture.ts
```

- [ ] **Step 3: Create the game directory structure**

```bash
mkdir -p game/scenes game/systems game/ui game/data game/data/scenes game/assets/placeholder
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: strip old React game, install Phaser 3 + Howler"
```

---

## Task 2: Phaser Game Config + React Mount

**Files:**
- Create: `game/config.ts`
- Create: `game/Game.tsx`
- Modify: `app/play/page.tsx`

- [ ] **Step 1: Create game/config.ts**

```typescript
import Phaser from "phaser";
import { BootScene } from "./scenes/BootScene";
import { CampfireScene } from "./scenes/CampfireScene";
import { CliffScene } from "./scenes/CliffScene";
import { MeadowScene } from "./scenes/MeadowScene";
import { LakeScene } from "./scenes/LakeScene";
import { VoidScene } from "./scenes/VoidScene";

export const GAME_WIDTH = 960;
export const GAME_HEIGHT = 540;

export function createGameConfig(parent: string): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    parent,
    backgroundColor: "#1a1714",
    scene: [BootScene, CampfireScene, CliffScene, MeadowScene, LakeScene, VoidScene],
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    render: {
      pixelArt: true,
      antialias: false,
    },
  };
}
```

- [ ] **Step 2: Create game/Game.tsx**

```tsx
"use client";

import { useEffect, useRef } from "react";
import Phaser from "phaser";
import { createGameConfig } from "./config";

export default function Game() {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && !gameRef.current) {
      const config = createGameConfig("game-container");
      gameRef.current = new Phaser.Game(config);
    }
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div
      id="game-container"
      ref={containerRef}
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0a",
      }}
    />
  );
}
```

- [ ] **Step 3: Update app/play/page.tsx**

```tsx
"use client";

import dynamic from "next/dynamic";

const Game = dynamic(() => import("../../game/Game"), { ssr: false });

export default function PlayPage() {
  return <Game />;
}
```

- [ ] **Step 4: Create stub scenes so Phaser doesn't crash**

Create `game/scenes/BootScene.ts`:
```typescript
import Phaser from "phaser";

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: "BootScene" });
  }

  preload() {
    // Placeholder: loading bar will go here
    this.add.text(480, 270, "Loading...", {
      fontFamily: "Georgia, serif",
      fontSize: "24px",
      color: "#f8f0e3",
    }).setOrigin(0.5);
  }

  create() {
    this.scene.start("CampfireScene");
  }
}
```

Create `game/scenes/CampfireScene.ts`:
```typescript
import Phaser from "phaser";

export class CampfireScene extends Phaser.Scene {
  constructor() {
    super({ key: "CampfireScene" });
  }

  create() {
    this.cameras.main.setBackgroundColor("#0d1a0d");
    this.add.text(480, 270, "Campfire Clearing", {
      fontFamily: "Georgia, serif",
      fontSize: "20px",
      color: "#f8f0e3",
    }).setOrigin(0.5);
  }
}
```

Create `game/scenes/CliffScene.ts`:
```typescript
import Phaser from "phaser";

export class CliffScene extends Phaser.Scene {
  constructor() {
    super({ key: "CliffScene" });
  }

  create() {
    this.cameras.main.setBackgroundColor("#1a1a2a");
    this.add.text(480, 270, "The Cliff", {
      fontFamily: "Georgia, serif",
      fontSize: "20px",
      color: "#f8f0e3",
    }).setOrigin(0.5);
  }
}
```

Create `game/scenes/MeadowScene.ts`:
```typescript
import Phaser from "phaser";

export class MeadowScene extends Phaser.Scene {
  constructor() {
    super({ key: "MeadowScene" });
  }

  create() {
    this.cameras.main.setBackgroundColor("#1a2a1a");
    this.add.text(480, 270, "The Meadow", {
      fontFamily: "Georgia, serif",
      fontSize: "20px",
      color: "#f8f0e3",
    }).setOrigin(0.5);
  }
}
```

Create `game/scenes/LakeScene.ts`:
```typescript
import Phaser from "phaser";

export class LakeScene extends Phaser.Scene {
  constructor() {
    super({ key: "LakeScene" });
  }

  create() {
    this.cameras.main.setBackgroundColor("#0a1a2a");
    this.add.text(480, 270, "The Lake", {
      fontFamily: "Georgia, serif",
      fontSize: "20px",
      color: "#f8f0e3",
    }).setOrigin(0.5);
  }
}
```

Create `game/scenes/VoidScene.ts`:
```typescript
import Phaser from "phaser";

export class VoidScene extends Phaser.Scene {
  constructor() {
    super({ key: "VoidScene" });
  }

  create() {
    this.cameras.main.setBackgroundColor("#000000");
    this.add.text(480, 270, "The Void", {
      fontFamily: "Georgia, serif",
      fontSize: "20px",
      color: "#f8f0e3",
    }).setOrigin(0.5);
  }
}
```

- [ ] **Step 5: Test that Phaser boots**

```bash
cd /c/Users/cjpmu/SCOUTS
npm run dev
```

Open http://localhost:3000/play -- should show green background with "Campfire Clearing" text.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: Phaser 3 game engine mounted in Next.js with 6 stub scenes"
```

---

## Task 3: Data Types + Character Definitions

**Files:**
- Create: `game/data/characters.ts`
- Create: `game/data/items.ts`
- Create: `game/data/types.ts`

- [ ] **Step 1: Create game/data/types.ts** -- Core types for the entire game

```typescript
export type ChoiceType = "authentic" | "performed" | "deflect" | "timeout";

export type FractureContext = "safe" | "dangerous" | "forced";

export interface DialogueLine {
  speaker: string | null; // null = stage direction
  text: string;
  expression?: string;
  delay?: number; // ms pause before this line
}

export interface Choice {
  id: string;
  text: string;
  type: ChoiceType;
  fractureDelta: number;
  context: FractureContext;
  nextBeat: string; // which beat to jump to after this choice
  locked?: {
    minFracture: number; // lock this choice when fracture exceeds this
    lockedText?: string; // text to show when locked (e.g., strikethrough)
  };
}

export interface Beat {
  id: string;
  location: SceneKey;
  lines: DialogueLine[];
  choices?: Choice[];
  timer?: number; // seconds, undefined = no timer
  onEnter?: {
    addItem?: string;
    removeItem?: string;
    fractureChange?: number;
    expression?: Record<string, string>; // character -> expression
  };
  nextBeat?: string; // auto-advance to this beat (if no choices)
}

export interface SceneScript {
  id: string;
  title: string;
  beats: Beat[];
}

export type SceneKey =
  | "CampfireScene"
  | "CliffScene"
  | "MeadowScene"
  | "LakeScene"
  | "VoidScene";

export type CharacterKey =
  | "simon"
  | "sam"
  | "brent"
  | "josh"
  | "noah"
  | "lucas";

export interface Character {
  key: CharacterKey;
  name: string;
  age: string;
  color: string;
  expressions: string[];
}

export interface InventoryItem {
  id: string;
  name: string;
  iconKey: string;
  tooltips: {
    low: string;    // fracture 0-0.5
    high: string;   // fracture 0.5+
  };
  neverDegrades?: boolean; // true for the flower
}
```

- [ ] **Step 2: Create game/data/characters.ts**

```typescript
import { Character } from "./types";

export const CHARACTERS: Record<string, Character> = {
  simon: {
    key: "simon",
    name: "SIMON",
    age: "12",
    color: "#d4a0d0",
    expressions: ["neutral", "scared", "defiant", "hurt", "tender", "shattered"],
  },
  sam: {
    key: "sam",
    name: "SAM",
    age: "12",
    color: "#7eb8c9",
    expressions: ["neutral", "shy", "warm", "conflicted", "brave"],
  },
  brent: {
    key: "brent",
    name: "BRENT",
    age: "16",
    color: "#ff4444",
    expressions: ["neutral", "angry", "mocking", "unhinged", "broken"],
  },
  josh: {
    key: "josh",
    name: "JOSH",
    age: "11",
    color: "#8a9a5a",
    expressions: ["neutral", "eager", "angry", "scared"],
  },
  noah: {
    key: "noah",
    name: "NOAH",
    age: "12",
    color: "#d4a44a",
    expressions: ["neutral", "smug", "nervous", "defiant"],
  },
  lucas: {
    key: "lucas",
    name: "LUCAS",
    age: "12",
    color: "#5a9a8a",
    expressions: ["neutral", "earnest", "uncomfortable", "brave"],
  },
};

export const STAGE_DIRECTION_COLOR = "#f8f0e3";
export const STAGE_DIRECTION_ALPHA = 0.5;
```

- [ ] **Step 3: Create game/data/items.ts**

```typescript
import { InventoryItem } from "./types";

export const ITEMS: Record<string, InventoryItem> = {
  neckerchief: {
    id: "neckerchief",
    name: "Scout Neckerchief",
    iconKey: "item-neckerchief",
    tooltips: {
      low: "I don't even know the outdoor code.",
      high: "I don't deserve to wear this.",
    },
  },
  marshmallow: {
    id: "marshmallow",
    name: "Marshmallow",
    iconKey: "item-marshmallow",
    tooltips: {
      low: "At least someone's having a good time.",
      high: "This was supposed to be fun.",
    },
  },
  squirrelBlood: {
    id: "squirrelBlood",
    name: "Squirrel Blood",
    iconKey: "item-blood-hands",
    tooltips: {
      low: "I can still feel it.",
      high: "I'm no different from them.",
    },
  },
  flower: {
    id: "flower",
    name: "Flower",
    iconKey: "item-flower",
    neverDegrades: true,
    tooltips: {
      low: "Sam picked this for me.",
      high: "Sam picked this for me.",
    },
  },
  samsKiss: {
    id: "samsKiss",
    name: "Sam's Kiss",
    iconKey: "item-kiss",
    tooltips: {
      low: "It was just a joke... right?",
      high: "The only real thing that happened tonight.",
    },
  },
  brentsBlood: {
    id: "brentsBlood",
    name: "Brent's Blood",
    iconKey: "item-blood-knuckles",
    tooltips: {
      low: "What did I do?",
      high: "What did I become?",
    },
  },
};
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: core data types, character definitions, inventory items"
```

---

## Task 4: Fracture Manager

**Files:**
- Create: `game/systems/FractureManager.ts`

- [ ] **Step 1: Create game/systems/FractureManager.ts**

```typescript
import Phaser from "phaser";
import { ChoiceType, FractureContext } from "../data/types";

export class FractureManager {
  private _fracture: number = 0;
  private scene: Phaser.Scene;
  private vignette: Phaser.GameObjects.Graphics | null = null;
  private colorMatrix: Phaser.FX.ColorMatrix | null = null;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  get fracture(): number {
    return this._fracture;
  }

  get level(): "intact" | "cracking" | "fracturing" | "shattered" {
    if (this._fracture <= 0.25) return "intact";
    if (this._fracture <= 0.5) return "cracking";
    if (this._fracture <= 0.75) return "fracturing";
    return "shattered";
  }

  applyChoice(type: ChoiceType, context: FractureContext): void {
    let delta = 0;
    switch (type) {
      case "authentic":
        delta = context === "safe" ? -0.03 : 0.03;
        break;
      case "performed":
        delta = 0.05;
        break;
      case "deflect":
        delta = 0.01;
        break;
      case "timeout":
        delta = 0.02;
        break;
    }
    this.changeFracture(delta);
  }

  changeFracture(delta: number): void {
    this._fracture = Phaser.Math.Clamp(this._fracture + delta, 0, 1);
    this.updateVisuals();
  }

  /** Call when entering a Gay Shit scene */
  applyGayShitHealing(act: 1 | 2 | 3): void {
    const healing = { 1: -0.08, 2: -0.10, 3: -0.12 };
    this.changeFracture(healing[act]);
  }

  getSaturation(): number {
    if (this._fracture <= 0.25) return 1.0;
    if (this._fracture <= 0.5) return 0.7;
    if (this._fracture <= 0.75) return 0.4;
    return 0.15;
  }

  getVignetteStrength(): number {
    return Phaser.Math.Linear(0, 0.8, this._fracture);
  }

  /** Returns true if a choice should be locked based on its fracture threshold */
  isChoiceLocked(minFracture: number): boolean {
    return this._fracture >= minFracture;
  }

  /** Apply visual effects to the current scene's camera */
  attachToCamera(camera: Phaser.Cameras.Scene2D.Camera): void {
    if (camera.postFX) {
      this.colorMatrix = camera.postFX.addColorMatrix();
    }
    this.updateVisuals();
  }

  private updateVisuals(): void {
    if (this.colorMatrix) {
      this.colorMatrix.reset();
      const sat = this.getSaturation();
      if (sat < 1) {
        this.colorMatrix.saturate(sat - 1); // saturate takes -1 to 0 for desaturation
      }
      const contrast = 1 + this._fracture * 0.3;
      this.colorMatrix.contrast(contrast - 1);
    }
  }

  /** Serialize for save/load */
  toJSON(): { fracture: number } {
    return { fracture: this._fracture };
  }

  fromJSON(data: { fracture: number }): void {
    this._fracture = data.fracture;
    this.updateVisuals();
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: FractureManager with choice impact, visual effects, and Gay Shit healing"
```

---

## Task 5: Choice Tracker

**Files:**
- Create: `game/systems/ChoiceTracker.ts`

- [ ] **Step 1: Create game/systems/ChoiceTracker.ts**

```typescript
import { ChoiceType } from "../data/types";

export interface RecordedChoice {
  choiceId: string;
  beatId: string;
  type: ChoiceType;
  text: string;
  timestamp: number;
}

export class ChoiceTracker {
  private choices: RecordedChoice[] = [];

  record(choiceId: string, beatId: string, type: ChoiceType, text: string): void {
    this.choices.push({
      choiceId,
      beatId,
      type,
      text,
      timestamp: Date.now(),
    });
  }

  getAll(): RecordedChoice[] {
    return [...this.choices];
  }

  wasChosen(choiceId: string): boolean {
    return this.choices.some((c) => c.choiceId === choiceId);
  }

  countByType(type: ChoiceType): number {
    return this.choices.filter((c) => c.type === type).length;
  }

  /** Key choices that affect the ending */
  get simonOpenedUp(): boolean {
    return this.wasChosen("act3-monologue-continue-girl");
  }

  get simonBrokeCycle(): boolean {
    return this.wasChosen("fight-stop-all");
  }

  get simonBeatBrent(): boolean {
    return this.wasChosen("fight-pussy-rage");
  }

  get simonKissedBack(): boolean {
    return (
      this.wasChosen("act1-stay") ||
      this.wasChosen("act1-kiss-back")
    );
  }

  toJSON(): RecordedChoice[] {
    return this.choices;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: ChoiceTracker records all player decisions for ending calculation"
```

---

## Task 6: Inventory Manager

**Files:**
- Create: `game/systems/InventoryManager.ts`

- [ ] **Step 1: Create game/systems/InventoryManager.ts**

```typescript
import { ITEMS } from "../data/items";
import { InventoryItem } from "../data/types";

export class InventoryManager {
  private heldItems: string[] = [];
  private maxSlots = 6;

  addItem(itemId: string): boolean {
    if (this.heldItems.includes(itemId)) return false;
    if (this.heldItems.length >= this.maxSlots) return false;
    if (!ITEMS[itemId]) return false;
    this.heldItems.push(itemId);
    return true;
  }

  removeItem(itemId: string): boolean {
    const idx = this.heldItems.indexOf(itemId);
    if (idx === -1) return false;
    this.heldItems.splice(idx, 1);
    return true;
  }

  hasItem(itemId: string): boolean {
    return this.heldItems.includes(itemId);
  }

  getItems(): InventoryItem[] {
    return this.heldItems
      .map((id) => ITEMS[id])
      .filter((item): item is InventoryItem => item !== undefined);
  }

  getTooltip(itemId: string, fracture: number): string {
    const item = ITEMS[itemId];
    if (!item) return "";
    if (item.neverDegrades) return item.tooltips.low;
    return fracture >= 0.5 ? item.tooltips.high : item.tooltips.low;
  }

  toJSON(): string[] {
    return [...this.heldItems];
  }

  fromJSON(data: string[]): void {
    this.heldItems = data.filter((id) => ITEMS[id]);
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: InventoryManager with fracture-sensitive tooltips"
```

---

## Task 7: Dialogue Box UI

**Files:**
- Create: `game/ui/DialogueBox.ts`

- [ ] **Step 1: Create game/ui/DialogueBox.ts**

```typescript
import Phaser from "phaser";
import { CHARACTERS } from "../data/characters";
import { GAME_WIDTH, GAME_HEIGHT } from "../config";

const BOX_HEIGHT = 160;
const BOX_PADDING = 16;
const BOX_Y = GAME_HEIGHT - BOX_HEIGHT;
const PORTRAIT_SIZE = 80;
const TEXT_SPEED = 30; // ms per character

export class DialogueBox {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private background: Phaser.GameObjects.Graphics;
  private speakerText: Phaser.GameObjects.Text;
  private dialogueText: Phaser.GameObjects.Text;
  private portraitRect: Phaser.GameObjects.Graphics;
  private isTyping: boolean = false;
  private fullText: string = "";
  private currentCharIndex: number = 0;
  private typeTimer: Phaser.Time.TimerEvent | null = null;
  private onComplete: (() => void) | null = null;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.container = scene.add.container(0, BOX_Y).setDepth(100);

    // Semi-transparent black box
    this.background = scene.add.graphics();
    this.background.fillStyle(0x000000, 0.85);
    this.background.fillRoundedRect(0, 0, GAME_WIDTH, BOX_HEIGHT, 8);
    this.container.add(this.background);

    // Portrait placeholder (colored rectangle)
    this.portraitRect = scene.add.graphics();
    this.portraitRect.setPosition(BOX_PADDING, BOX_PADDING);
    this.container.add(this.portraitRect);

    // Speaker name
    this.speakerText = scene.add.text(
      BOX_PADDING + PORTRAIT_SIZE + BOX_PADDING,
      BOX_PADDING,
      "",
      {
        fontFamily: "Georgia, serif",
        fontSize: "16px",
        color: "#ffffff",
        fontStyle: "bold",
      }
    );
    this.container.add(this.speakerText);

    // Dialogue text
    this.dialogueText = scene.add.text(
      BOX_PADDING + PORTRAIT_SIZE + BOX_PADDING,
      BOX_PADDING + 24,
      "",
      {
        fontFamily: "Georgia, serif",
        fontSize: "14px",
        color: "#f8f0e3",
        wordWrap: { width: GAME_WIDTH - PORTRAIT_SIZE - BOX_PADDING * 4 },
        lineSpacing: 4,
      }
    );
    this.container.add(this.dialogueText);

    // Click to skip typewriter
    scene.input.on("pointerdown", () => {
      if (this.isTyping) {
        this.skipTypewriter();
      }
    });

    this.hide();
  }

  show(): void {
    this.container.setVisible(true);
  }

  hide(): void {
    this.container.setVisible(false);
  }

  showLine(
    speaker: string | null,
    text: string,
    onComplete: () => void
  ): void {
    this.show();
    this.onComplete = onComplete;

    if (speaker) {
      const char = CHARACTERS[speaker.toLowerCase()];
      const color = char ? char.color : "#f8f0e3";
      const name = char ? char.name : speaker;

      this.speakerText.setText(name);
      this.speakerText.setColor(color);

      // Draw portrait placeholder
      this.portraitRect.clear();
      this.portraitRect.fillStyle(
        Phaser.Display.Color.HexStringToColor(color).color,
        0.8
      );
      this.portraitRect.fillRoundedRect(0, 0, PORTRAIT_SIZE, PORTRAIT_SIZE, 6);
    } else {
      // Stage direction
      this.speakerText.setText("");
      this.portraitRect.clear();
      this.dialogueText.setColor("#f8f0e3");
      this.dialogueText.setAlpha(0.5);
      this.dialogueText.setFontStyle("italic");
    }

    this.startTypewriter(text);
  }

  private startTypewriter(text: string): void {
    this.fullText = text;
    this.currentCharIndex = 0;
    this.dialogueText.setText("");
    this.dialogueText.setAlpha(1);
    this.dialogueText.setFontStyle("normal");
    this.isTyping = true;

    this.typeTimer = this.scene.time.addEvent({
      delay: TEXT_SPEED,
      callback: () => {
        this.currentCharIndex++;
        this.dialogueText.setText(this.fullText.substring(0, this.currentCharIndex));
        if (this.currentCharIndex >= this.fullText.length) {
          this.finishTypewriter();
        }
      },
      repeat: this.fullText.length - 1,
    });
  }

  private skipTypewriter(): void {
    if (this.typeTimer) {
      this.typeTimer.destroy();
      this.typeTimer = null;
    }
    this.dialogueText.setText(this.fullText);
    this.finishTypewriter();
  }

  private finishTypewriter(): void {
    this.isTyping = false;
    // Wait for next click to advance
    this.scene.input.once("pointerdown", () => {
      if (this.onComplete) this.onComplete();
    });
  }

  destroy(): void {
    this.container.destroy();
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: DialogueBox UI with typewriter effect, portraits, and stage directions"
```

---

## Task 8: Choice Buttons UI

**Files:**
- Create: `game/ui/ChoiceButtons.ts`

- [ ] **Step 1: Create game/ui/ChoiceButtons.ts**

```typescript
import Phaser from "phaser";
import { Choice } from "../data/types";
import { GAME_WIDTH, GAME_HEIGHT } from "../config";

const BUTTON_WIDTH = GAME_WIDTH - 40;
const BUTTON_HEIGHT = 40;
const BUTTON_GAP = 8;
const BUTTON_X = 20;
const TIMER_BAR_HEIGHT = 4;

export class ChoiceButtons {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private timerBar: Phaser.GameObjects.Graphics | null = null;
  private timerEvent: Phaser.Time.TimerEvent | null = null;
  private buttons: Phaser.GameObjects.Container[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.container = scene.add.container(0, 0).setDepth(110);
    this.container.setVisible(false);
  }

  showChoices(
    choices: Choice[],
    timerSeconds: number | undefined,
    fractureLevel: number,
    onSelect: (choice: Choice) => void
  ): void {
    this.clear();
    this.container.setVisible(true);

    const startY = GAME_HEIGHT - 180 - choices.length * (BUTTON_HEIGHT + BUTTON_GAP);

    choices.forEach((choice, i) => {
      const y = startY + i * (BUTTON_HEIGHT + BUTTON_GAP);
      const isLocked = choice.locked && fractureLevel >= choice.locked.minFracture;

      const btn = this.scene.add.container(BUTTON_X, y);

      // Button background
      const bg = this.scene.add.graphics();
      bg.lineStyle(1, isLocked ? 0x333333 : 0x555555);
      bg.fillStyle(isLocked ? 0x111111 : 0x1a1a1a, 0.9);
      bg.fillRoundedRect(0, 0, BUTTON_WIDTH, BUTTON_HEIGHT, 6);
      bg.strokeRoundedRect(0, 0, BUTTON_WIDTH, BUTTON_HEIGHT, 6);
      btn.add(bg);

      // Button text
      const displayText = isLocked
        ? choice.locked?.lockedText || choice.text
        : choice.text;
      const textObj = this.scene.add.text(16, BUTTON_HEIGHT / 2, displayText, {
        fontFamily: "Georgia, serif",
        fontSize: "14px",
        color: isLocked ? "#444444" : "#f8f0e3",
        fontStyle: isLocked ? "italic" : "normal",
      }).setOrigin(0, 0.5);

      if (isLocked) {
        // Strikethrough line
        const lineY = BUTTON_HEIGHT / 2;
        const line = this.scene.add.graphics();
        line.lineStyle(1, 0x444444);
        line.lineBetween(16, lineY, 16 + textObj.width, lineY);
        btn.add(line);
      }

      btn.add(textObj);

      if (!isLocked) {
        // Hover effect
        const hitArea = new Phaser.Geom.Rectangle(0, 0, BUTTON_WIDTH, BUTTON_HEIGHT);
        bg.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

        bg.on("pointerover", () => {
          bg.clear();
          bg.lineStyle(2, 0xc9a96e);
          bg.fillStyle(0x2a2a2a, 0.9);
          bg.fillRoundedRect(0, 0, BUTTON_WIDTH, BUTTON_HEIGHT, 6);
          bg.strokeRoundedRect(0, 0, BUTTON_WIDTH, BUTTON_HEIGHT, 6);
        });

        bg.on("pointerout", () => {
          bg.clear();
          bg.lineStyle(1, 0x555555);
          bg.fillStyle(0x1a1a1a, 0.9);
          bg.fillRoundedRect(0, 0, BUTTON_WIDTH, BUTTON_HEIGHT, 6);
          bg.strokeRoundedRect(0, 0, BUTTON_WIDTH, BUTTON_HEIGHT, 6);
        });

        bg.on("pointerdown", () => {
          this.clear();
          onSelect(choice);
        });
      }

      this.container.add(btn);
      this.buttons.push(btn);
    });

    // Timer bar
    if (timerSeconds) {
      this.showTimer(timerSeconds, choices, onSelect);
    }
  }

  private showTimer(
    seconds: number,
    choices: Choice[],
    onSelect: (choice: Choice) => void
  ): void {
    const barY = GAME_HEIGHT - 185 - choices.length * (BUTTON_HEIGHT + BUTTON_GAP);
    this.timerBar = this.scene.add.graphics().setDepth(111);
    const totalWidth = BUTTON_WIDTH;
    const duration = seconds * 1000;
    const startTime = this.scene.time.now;

    this.timerEvent = this.scene.time.addEvent({
      delay: 16, // ~60fps
      loop: true,
      callback: () => {
        if (!this.timerBar) return;
        const elapsed = this.scene.time.now - startTime;
        const progress = 1 - elapsed / duration;

        if (progress <= 0) {
          // Time's up -- find deflect/timeout option or last option
          const timeoutChoice =
            choices.find((c) => c.type === "timeout") ||
            choices.find((c) => c.type === "deflect") ||
            choices[choices.length - 1];
          this.clear();
          onSelect(timeoutChoice);
          return;
        }

        this.timerBar.clear();
        // Gold to red gradient based on progress
        const r = Math.floor(Phaser.Math.Linear(0xff, 0xc9, progress));
        const g = Math.floor(Phaser.Math.Linear(0x22, 0xa9, progress));
        const b = Math.floor(Phaser.Math.Linear(0x22, 0x6e, progress));
        const color = (r << 16) | (g << 8) | b;

        this.timerBar.fillStyle(color);
        this.timerBar.fillRect(
          BUTTON_X,
          barY,
          totalWidth * progress,
          TIMER_BAR_HEIGHT
        );
      },
    });
  }

  clear(): void {
    this.buttons.forEach((b) => b.destroy());
    this.buttons = [];
    if (this.timerBar) {
      this.timerBar.destroy();
      this.timerBar = null;
    }
    if (this.timerEvent) {
      this.timerEvent.destroy();
      this.timerEvent = null;
    }
    this.container.setVisible(false);
  }

  destroy(): void {
    this.clear();
    this.container.destroy();
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: ChoiceButtons UI with timer bar, hover effects, and fracture-locked options"
```

---

## Task 9: Inventory Bar UI

**Files:**
- Create: `game/ui/InventoryBar.ts`

- [ ] **Step 1: Create game/ui/InventoryBar.ts**

```typescript
import Phaser from "phaser";
import { InventoryManager } from "../systems/InventoryManager";
import { FractureManager } from "../systems/FractureManager";
import { GAME_WIDTH } from "../config";

const SLOT_SIZE = 32;
const SLOT_GAP = 6;
const SLOT_PADDING = 8;
const BAR_X = GAME_WIDTH - (SLOT_SIZE + SLOT_GAP) * 6 - SLOT_PADDING;
const BAR_Y = 8;

export class InventoryBar {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private slots: Phaser.GameObjects.Graphics[] = [];
  private itemIcons: Phaser.GameObjects.Graphics[] = [];
  private tooltip: Phaser.GameObjects.Container | null = null;
  private inventory: InventoryManager;
  private fracture: FractureManager;

  constructor(
    scene: Phaser.Scene,
    inventory: InventoryManager,
    fracture: FractureManager
  ) {
    this.scene = scene;
    this.inventory = inventory;
    this.fracture = fracture;
    this.container = scene.add.container(BAR_X, BAR_Y).setDepth(90);

    // Create 6 empty slots
    for (let i = 0; i < 6; i++) {
      const x = i * (SLOT_SIZE + SLOT_GAP);
      const slot = scene.add.graphics();
      slot.fillStyle(0xffffff, 0.05);
      slot.lineStyle(1, 0x333333);
      slot.fillRoundedRect(x, 0, SLOT_SIZE, SLOT_SIZE, 4);
      slot.strokeRoundedRect(x, 0, SLOT_SIZE, SLOT_SIZE, 4);
      this.container.add(slot);
      this.slots.push(slot);
    }
  }

  update(): void {
    // Clear old icons
    this.itemIcons.forEach((icon) => icon.destroy());
    this.itemIcons = [];

    const items = this.inventory.getItems();
    items.forEach((item, i) => {
      const x = i * (SLOT_SIZE + SLOT_GAP);
      const icon = this.scene.add.graphics();

      // Color based on character association and fracture
      const isDegraded =
        !item.neverDegrades && this.fracture.fracture >= 0.5;
      const alpha = isDegraded ? 0.4 : 0.9;

      // Simple colored square as placeholder for pixel art icons
      let color = 0xc9a96e; // default gold
      if (item.id === "squirrelBlood" || item.id === "brentsBlood")
        color = 0xff4444;
      if (item.id === "flower") color = 0xff88aa;
      if (item.id === "samsKiss") color = 0x7eb8c9;
      if (item.id === "marshmallow") color = 0xf8f0e3;

      icon.fillStyle(color, alpha);
      icon.fillRoundedRect(x + 4, 4, SLOT_SIZE - 8, SLOT_SIZE - 8, 3);
      this.container.add(icon);
      this.itemIcons.push(icon);

      // Make interactive for tooltip
      const hitArea = new Phaser.Geom.Rectangle(
        x,
        0,
        SLOT_SIZE,
        SLOT_SIZE
      );
      icon.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

      icon.on("pointerover", () => {
        this.showTooltip(
          x + SLOT_SIZE / 2,
          SLOT_SIZE + 8,
          item.name,
          this.inventory.getTooltip(item.id, this.fracture.fracture)
        );
      });

      icon.on("pointerout", () => {
        this.hideTooltip();
      });
    });
  }

  private showTooltip(
    x: number,
    y: number,
    name: string,
    description: string
  ): void {
    this.hideTooltip();
    this.tooltip = this.scene.add.container(x, y).setDepth(200);

    const bg = this.scene.add.graphics();
    const text = this.scene.add.text(8, 8, `${name}\n${description}`, {
      fontFamily: "Georgia, serif",
      fontSize: "11px",
      color: "#f8f0e3",
      wordWrap: { width: 180 },
      lineSpacing: 2,
    });

    const width = Math.max(text.width + 16, 100);
    const height = text.height + 16;
    bg.fillStyle(0x000000, 0.9);
    bg.lineStyle(1, 0x333333);
    bg.fillRoundedRect(0, 0, width, height, 4);
    bg.strokeRoundedRect(0, 0, width, height, 4);

    this.tooltip.add(bg);
    this.tooltip.add(text);
    this.container.add(this.tooltip);
  }

  private hideTooltip(): void {
    if (this.tooltip) {
      this.tooltip.destroy();
      this.tooltip = null;
    }
  }

  destroy(): void {
    this.container.destroy();
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: InventoryBar UI with fracture-sensitive item display and tooltips"
```

---

## Task 10: Transition Overlay

**Files:**
- Create: `game/ui/TransitionOverlay.ts`

- [ ] **Step 1: Create game/ui/TransitionOverlay.ts**

```typescript
import Phaser from "phaser";
import { GAME_WIDTH, GAME_HEIGHT } from "../config";

export class TransitionOverlay {
  private scene: Phaser.Scene;
  private overlay: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.overlay = scene.add.graphics().setDepth(500);
    this.overlay.fillStyle(0x000000);
    this.overlay.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    this.overlay.setAlpha(0);
  }

  fadeOut(duration: number = 1000): Promise<void> {
    return new Promise((resolve) => {
      this.scene.tweens.add({
        targets: this.overlay,
        alpha: 1,
        duration,
        ease: "Power2",
        onComplete: () => resolve(),
      });
    });
  }

  fadeIn(duration: number = 1000): Promise<void> {
    return new Promise((resolve) => {
      this.overlay.setAlpha(1);
      this.scene.tweens.add({
        targets: this.overlay,
        alpha: 0,
        duration,
        ease: "Power2",
        onComplete: () => resolve(),
      });
    });
  }

  async transition(callback: () => void, holdMs: number = 500): Promise<void> {
    await this.fadeOut();
    await new Promise((r) => this.scene.time.delayedCall(holdMs, r));
    callback();
    await this.fadeIn();
  }

  destroy(): void {
    this.overlay.destroy();
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: TransitionOverlay with fade-to-black scene transitions"
```

---

## Task 11: Dialogue Manager (Core Game Loop)

**Files:**
- Create: `game/systems/DialogueManager.ts`

- [ ] **Step 1: Create game/systems/DialogueManager.ts**

```typescript
import Phaser from "phaser";
import { Beat, Choice, SceneScript, SceneKey } from "../data/types";
import { DialogueBox } from "../ui/DialogueBox";
import { ChoiceButtons } from "../ui/ChoiceButtons";
import { FractureManager } from "./FractureManager";
import { InventoryManager } from "./InventoryManager";
import { ChoiceTracker } from "./ChoiceTracker";

export class DialogueManager {
  private scene: Phaser.Scene;
  private dialogueBox: DialogueBox;
  private choiceButtons: ChoiceButtons;
  private fracture: FractureManager;
  private inventory: InventoryManager;
  private tracker: ChoiceTracker;
  private beats: Map<string, Beat> = new Map();
  private currentBeat: Beat | null = null;
  private currentLineIndex: number = 0;
  private onSceneChange: ((sceneKey: SceneKey) => void) | null = null;
  private onScriptComplete: (() => void) | null = null;

  constructor(
    scene: Phaser.Scene,
    fracture: FractureManager,
    inventory: InventoryManager,
    tracker: ChoiceTracker
  ) {
    this.scene = scene;
    this.fracture = fracture;
    this.inventory = inventory;
    this.tracker = tracker;
    this.dialogueBox = new DialogueBox(scene);
    this.choiceButtons = new ChoiceButtons(scene);
  }

  loadScript(script: SceneScript): void {
    this.beats.clear();
    for (const beat of script.beats) {
      this.beats.set(beat.id, beat);
    }
  }

  startBeat(
    beatId: string,
    onSceneChange: (sceneKey: SceneKey) => void,
    onScriptComplete: () => void
  ): void {
    this.onSceneChange = onSceneChange;
    this.onScriptComplete = onScriptComplete;

    const beat = this.beats.get(beatId);
    if (!beat) {
      console.error(`Beat not found: ${beatId}`);
      onScriptComplete();
      return;
    }

    this.currentBeat = beat;
    this.currentLineIndex = 0;

    // Handle onEnter effects
    if (beat.onEnter) {
      if (beat.onEnter.addItem) {
        this.inventory.addItem(beat.onEnter.addItem);
      }
      if (beat.onEnter.removeItem) {
        this.inventory.removeItem(beat.onEnter.removeItem);
      }
      if (beat.onEnter.fractureChange) {
        this.fracture.changeFracture(beat.onEnter.fractureChange);
      }
    }

    this.advanceLine();
  }

  private advanceLine(): void {
    if (!this.currentBeat) return;

    if (this.currentLineIndex >= this.currentBeat.lines.length) {
      // All lines shown -- show choices or auto-advance
      if (this.currentBeat.choices && this.currentBeat.choices.length > 0) {
        this.showChoices(this.currentBeat.choices, this.currentBeat.timer);
      } else if (this.currentBeat.nextBeat) {
        this.goToBeat(this.currentBeat.nextBeat);
      } else {
        // Script complete
        this.dialogueBox.hide();
        if (this.onScriptComplete) this.onScriptComplete();
      }
      return;
    }

    const line = this.currentBeat.lines[this.currentLineIndex];
    this.currentLineIndex++;

    const delay = line.delay || 0;

    if (delay > 0) {
      this.scene.time.delayedCall(delay, () => {
        this.dialogueBox.showLine(line.speaker, line.text, () => {
          this.advanceLine();
        });
      });
    } else {
      this.dialogueBox.showLine(line.speaker, line.text, () => {
        this.advanceLine();
      });
    }
  }

  private showChoices(choices: Choice[], timerSeconds?: number): void {
    this.choiceButtons.showChoices(
      choices,
      timerSeconds,
      this.fracture.fracture,
      (selected) => {
        // Record the choice
        this.tracker.record(
          selected.id,
          this.currentBeat?.id || "",
          selected.type,
          selected.text
        );

        // Apply fracture
        this.fracture.applyChoice(selected.type, selected.context);

        // Go to next beat
        this.goToBeat(selected.nextBeat);
      }
    );
  }

  private goToBeat(beatId: string): void {
    const beat = this.beats.get(beatId);
    if (!beat) {
      // Check if it's a scene change directive
      if (beatId.startsWith("scene:")) {
        const sceneKey = beatId.replace("scene:", "") as SceneKey;
        this.dialogueBox.hide();
        if (this.onSceneChange) this.onSceneChange(sceneKey);
        return;
      }
      if (beatId === "end") {
        this.dialogueBox.hide();
        if (this.onScriptComplete) this.onScriptComplete();
        return;
      }
      console.error(`Beat not found: ${beatId}`);
      return;
    }

    // Check if beat requires a different scene
    if (
      this.currentBeat &&
      beat.location !== this.currentBeat.location
    ) {
      this.dialogueBox.hide();
      if (this.onSceneChange) this.onSceneChange(beat.location);
      return;
    }

    this.currentBeat = beat;
    this.currentLineIndex = 0;

    if (beat.onEnter) {
      if (beat.onEnter.addItem) this.inventory.addItem(beat.onEnter.addItem);
      if (beat.onEnter.removeItem) this.inventory.removeItem(beat.onEnter.removeItem);
      if (beat.onEnter.fractureChange) this.fracture.changeFracture(beat.onEnter.fractureChange);
    }

    this.advanceLine();
  }

  getDialogueBox(): DialogueBox {
    return this.dialogueBox;
  }

  destroy(): void {
    this.dialogueBox.destroy();
    this.choiceButtons.destroy();
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: DialogueManager orchestrates text, choices, fracture, and scene flow"
```

---

## Task 12: Scene Director + Scene Order

**Files:**
- Create: `game/systems/SceneDirector.ts`
- Create: `game/data/scene-order.ts`

- [ ] **Step 1: Create game/data/scene-order.ts**

```typescript
import { SceneKey } from "./types";

export interface SceneEntry {
  scriptId: string;
  location: SceneKey;
  startBeat: string;
  isGayShit?: boolean;
  gayShitAct?: 1 | 2 | 3;
}

export const SCENE_ORDER: SceneEntry[] = [
  { scriptId: "scene1-oath", location: "CampfireScene", startBeat: "oath-start" },
  { scriptId: "monologue-noah", location: "VoidScene", startBeat: "noah-start" },
  { scriptId: "monologue-simon", location: "VoidScene", startBeat: "simon-mono-start" },
  { scriptId: "scene1-sacrifice", location: "CampfireScene", startBeat: "sacrifice-start" },
  { scriptId: "monologue-lucas", location: "VoidScene", startBeat: "lucas-start" },
  { scriptId: "scene1-kiss-test", location: "CampfireScene", startBeat: "kiss-test-start" },
  { scriptId: "monologue-josh", location: "VoidScene", startBeat: "josh-start" },
  { scriptId: "scene1-pickup-lines", location: "CampfireScene", startBeat: "pickup-start" },
  { scriptId: "scene1-resistance", location: "CampfireScene", startBeat: "resistance-start" },
  { scriptId: "monologue-simon-sam", location: "VoidScene", startBeat: "simon-sam-start" },
  { scriptId: "gay-shit-anthem", location: "CampfireScene", startBeat: "anthem-start" },
  { scriptId: "gay-shit-act1", location: "CliffScene", startBeat: "act1-start", isGayShit: true, gayShitAct: 1 },
  { scriptId: "gay-shit-act2", location: "MeadowScene", startBeat: "act2-start", isGayShit: true, gayShitAct: 2 },
  { scriptId: "gay-shit-act3", location: "LakeScene", startBeat: "act3-start", isGayShit: true, gayShitAct: 3 },
  { scriptId: "monologue-sam", location: "VoidScene", startBeat: "sam-mono-start" },
  { scriptId: "ceremony", location: "CampfireScene", startBeat: "ceremony-start" },
  { scriptId: "monologue-brent", location: "VoidScene", startBeat: "brent-mono-start" },
  { scriptId: "ending", location: "VoidScene", startBeat: "ending-start" },
];
```

- [ ] **Step 2: Create game/systems/SceneDirector.ts**

```typescript
import Phaser from "phaser";
import { SCENE_ORDER, SceneEntry } from "../data/scene-order";
import { DialogueManager } from "./DialogueManager";
import { FractureManager } from "./FractureManager";
import { InventoryManager } from "./InventoryManager";
import { ChoiceTracker } from "./ChoiceTracker";
import { InventoryBar } from "../ui/InventoryBar";
import { TransitionOverlay } from "../ui/TransitionOverlay";
import { SceneKey } from "../data/types";

/**
 * SceneDirector lives on the active Phaser scene and drives the entire play.
 * It loads scene scripts, manages transitions, and moves through SCENE_ORDER.
 */
export class SceneDirector {
  private currentIndex: number = 0;
  private dialogueManager: DialogueManager | null = null;
  private inventoryBar: InventoryBar | null = null;
  private transition: TransitionOverlay | null = null;

  // Shared state across all scenes
  public fracture: FractureManager;
  public inventory: InventoryManager;
  public tracker: ChoiceTracker;

  constructor() {
    this.fracture = new FractureManager(null as unknown as Phaser.Scene);
    this.inventory = new InventoryManager();
    this.tracker = new ChoiceTracker();
  }

  /** Called when a Phaser scene's create() fires */
  attachToScene(scene: Phaser.Scene): void {
    // Update fracture's scene reference
    this.fracture = new FractureManager(scene);
    // Restore fracture level
    this.fracture.changeFracture(0); // triggers visual update

    this.dialogueManager = new DialogueManager(
      scene,
      this.fracture,
      this.inventory,
      this.tracker
    );
    this.inventoryBar = new InventoryBar(scene, this.inventory, this.fracture);
    this.transition = new TransitionOverlay(scene);

    // Attach fracture effects to camera
    this.fracture.attachToCamera(scene.cameras.main);
  }

  /** Start the play from the beginning or continue from current index */
  async startCurrentScene(scene: Phaser.Scene): Promise<void> {
    if (!this.dialogueManager || !this.transition) return;

    const entry = SCENE_ORDER[this.currentIndex];
    if (!entry) {
      console.log("Play complete!");
      return;
    }

    // Apply Gay Shit healing
    if (entry.isGayShit && entry.gayShitAct) {
      this.fracture.applyGayShitHealing(entry.gayShitAct);
    }

    // Load the script for this scene entry
    const scriptModule = await this.loadScriptModule(entry.scriptId);
    if (!scriptModule) {
      console.error(`Script not found: ${entry.scriptId}`);
      return;
    }

    this.dialogueManager.loadScript(scriptModule);

    // Fade in
    await this.transition.fadeIn(800);

    // Update inventory display
    this.inventoryBar?.update();

    // Start the dialogue
    this.dialogueManager.startBeat(
      entry.startBeat,
      // Scene change handler
      (sceneKey: SceneKey) => {
        this.transitionToScene(scene, sceneKey);
      },
      // Script complete handler
      () => {
        this.advanceToNextScene(scene);
      }
    );
  }

  private async advanceToNextScene(currentScene: Phaser.Scene): Promise<void> {
    this.currentIndex++;
    if (this.currentIndex >= SCENE_ORDER.length) {
      console.log("Play complete!");
      return;
    }

    const next = SCENE_ORDER[this.currentIndex];
    const currentKey = currentScene.scene.key;

    if (next.location !== currentKey) {
      await this.transitionToScene(currentScene, next.location);
    } else {
      await this.startCurrentScene(currentScene);
    }
  }

  private async transitionToScene(
    currentScene: Phaser.Scene,
    targetSceneKey: SceneKey
  ): Promise<void> {
    if (this.transition) {
      await this.transition.fadeOut(800);
    }

    // Store state before switching
    const fractureState = this.fracture.toJSON();
    const inventoryState = this.inventory.toJSON();

    // Switch Phaser scene
    currentScene.scene.start(targetSceneKey, {
      director: this,
      fractureState,
      inventoryState,
    });
  }

  private async loadScriptModule(scriptId: string): Promise<any> {
    // Dynamic import of scene script files
    try {
      const module = await import(`../data/scenes/${scriptId}`);
      return module.default || module.SCRIPT;
    } catch (e) {
      console.error(`Failed to load script: ${scriptId}`, e);
      return null;
    }
  }
}

// Singleton -- shared across all Phaser scenes
export const sceneDirector = new SceneDirector();
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: SceneDirector orchestrates full play sequence with transitions"
```

---

## Task 13: Wire Scenes to SceneDirector

**Files:**
- Modify: `game/scenes/CampfireScene.ts`
- Modify: `game/scenes/CliffScene.ts`
- Modify: `game/scenes/MeadowScene.ts`
- Modify: `game/scenes/LakeScene.ts`
- Modify: `game/scenes/VoidScene.ts`
- Modify: `game/scenes/BootScene.ts`

- [ ] **Step 1: Update all 5 location scenes to use SceneDirector**

Each scene follows the same pattern. Update `game/scenes/CampfireScene.ts`:

```typescript
import Phaser from "phaser";
import { sceneDirector } from "../systems/SceneDirector";

export class CampfireScene extends Phaser.Scene {
  constructor() {
    super({ key: "CampfireScene" });
  }

  init(data: any) {
    if (data.fractureState) {
      sceneDirector.fracture.fromJSON(data.fractureState);
    }
    if (data.inventoryState) {
      sceneDirector.inventory.fromJSON(data.inventoryState);
    }
  }

  create() {
    this.cameras.main.setBackgroundColor("#0d1a0d");

    // Placeholder background -- will be replaced by pixel art in Plan B
    this.add.text(480, 40, "~ The Campfire Clearing ~", {
      fontFamily: "Georgia, serif",
      fontSize: "14px",
      color: "#f8f0e3",
    }).setOrigin(0.5).setAlpha(0.3);

    sceneDirector.attachToScene(this);
    sceneDirector.startCurrentScene(this);
  }
}
```

Apply the same pattern to CliffScene (bg: `#1a1a2a`, text: "The Cliff"), MeadowScene (bg: `#1a2a1a`, text: "The Meadow"), LakeScene (bg: `#0a1a2a`, text: "The Lake"), VoidScene (bg: `#000000`, text: none).

- [ ] **Step 2: Update BootScene to start the play**

```typescript
import Phaser from "phaser";

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: "BootScene" });
  }

  preload() {
    // Plan B will add asset loading here
    const centerX = 480;
    const centerY = 270;
    this.add.text(centerX, centerY, "SCOUTS", {
      fontFamily: "Georgia, serif",
      fontSize: "32px",
      color: "#c9a96e",
      fontStyle: "bold",
    }).setOrigin(0.5);
    this.add.text(centerX, centerY + 40, "Loading...", {
      fontFamily: "Georgia, serif",
      fontSize: "16px",
      color: "#f8f0e3",
    }).setOrigin(0.5).setAlpha(0.5);
  }

  create() {
    // Start at CampfireScene (first scene in SCENE_ORDER)
    this.scene.start("CampfireScene");
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: wire all scenes to SceneDirector for full play orchestration"
```

---

## Task 14: First Playable Scene Script (Oath)

**Files:**
- Create: `game/data/scenes/scene1-oath.ts`

- [ ] **Step 1: Create game/data/scenes/scene1-oath.ts** -- The first interactive scene

```typescript
import { SceneScript } from "../types";

export const SCRIPT: SceneScript = {
  id: "scene1-oath",
  title: "The Oath",
  beats: [
    {
      id: "oath-start",
      location: "CampfireScene",
      lines: [
        { speaker: null, text: "Somewhere in the woods of a boy scout camp. The dead of night. Stars, crickets." },
        { speaker: null, text: "Six boys stand in line. Arms at ninety degree angles, holding up three fingers." },
        { speaker: null, text: "The leader, BRENT, 16, paces back and forth. Sizing them up." },
      ],
      nextBeat: "oath-recite",
      onEnter: { addItem: "neckerchief" },
    },
    {
      id: "oath-recite",
      location: "CampfireScene",
      lines: [
        { speaker: null, text: "ALL: A SCOUT IS: TRUSTWORTHY, LOYAL, HELPFUL, FRIENDLY, COURTEOUS, KIND, OBEDIENT, CHEERFUL, THRIFTY, BRAVE, CLEAN, AND REVERENT." },
        { speaker: "brent", text: "NOW THE SCOUT OATH!" },
        { speaker: null, text: "ALL: ON MY HONOR I WILL DO MY BEST TO DO MY DUTY TO GOD AND MY COUNTRY TO OBEY THE SCOUT LAW; TO HELP OTHER PEOPLE AT ALL TIMES; TO KEEP MYSELF PHYSICALLY STRONG, MENTALLY AWAKE, AND MORALLY STRAIGHT." },
      ],
      nextBeat: "oath-motto",
    },
    {
      id: "oath-motto",
      location: "CampfireScene",
      lines: [
        { speaker: "brent", text: "SIMON, SCOUT MOTTO." },
        { speaker: "simon", text: "BE PREPARED!" },
        { speaker: "brent", text: "THE SLOGAN?" },
      ],
      choices: [
        {
          id: "slogan-dont-know",
          text: "I don't think I know... sir.",
          type: "authentic",
          fractureDelta: 0.02,
          context: "dangerous",
          nextBeat: "slogan-phone-friend",
        },
        {
          id: "slogan-know-it",
          text: "DO A GOOD TURN DAILY, SIR.",
          type: "performed",
          fractureDelta: 0.03,
          context: "dangerous",
          nextBeat: "slogan-impressed",
        },
        {
          id: "slogan-silence",
          text: "...",
          type: "deflect",
          fractureDelta: 0.01,
          context: "dangerous",
          nextBeat: "slogan-phone-friend",
        },
      ],
      timer: 15,
    },
    {
      id: "slogan-phone-friend",
      location: "CampfireScene",
      lines: [
        { speaker: "brent", text: "Umm?" },
        { speaker: "brent", text: "Wanna phone a friend...?" },
        { speaker: "simon", text: "YES SIR. SAM." },
        { speaker: null, text: "Simon steps back. Brent walks over to Sam." },
        { speaker: "sam", text: "DO A GOOD TURN DAILY, SIR." },
      ],
      nextBeat: "outdoor-code",
    },
    {
      id: "slogan-impressed",
      location: "CampfireScene",
      lines: [
        { speaker: "brent", text: "Wow Simon, I'm impressed. I don't even know the slogan." },
        { speaker: null, text: "Brent walks over to Sam." },
      ],
      nextBeat: "outdoor-code",
    },
    {
      id: "outdoor-code",
      location: "CampfireScene",
      lines: [
        { speaker: "brent", text: "Outdoor code?" },
        { speaker: "sam", text: "As an American, I will do my best to be clean in my outdoor manners, be careful with fire, be considerate in the outdoors, and be conservation minded." },
        { speaker: "brent", text: "Wow Sam, I'm impressed. I don't even know the outdoor code.." },
        { speaker: "sam", text: "You should learn it. Our climate is changing." },
        { speaker: "brent", text: "Hmmph..." },
        { speaker: "sam", text: "You should learn the outdoor code. The Earth is dying, sir." },
      ],
      nextBeat: "brent-mocks-sam",
    },
    {
      id: "brent-mocks-sam",
      location: "CampfireScene",
      lines: [
        { speaker: "brent", text: "\"THE EARTH IS DYING, SIR.\"" },
        { speaker: "sam", text: "Excuse me?" },
        { speaker: "brent", text: "\"tHe EaRth iS dYinG SiR!!!1!1! ThE EArTh Is DyInG!1!1!!! MY NAME'S SAM!!!!!! I'M A FAGGOT that believes in cLimAte cHAngE!!!\"" },
        { speaker: "sam", text: "Ummm. Our climate is changing, I think it's important and very scoutsmenly to be environmentally conscious, sir... Don't hit me." },
        { speaker: "brent", text: "You know, I thought knowing the outdoor code made you a fag. But now that you're talking about \"climate change,\" I think you're a MEGA FAG." },
      ],
      choices: [
        {
          id: "mock-sam-support",
          text: "(whisper to Sam) You were right.",
          type: "authentic",
          fractureDelta: 0.03,
          context: "dangerous",
          nextBeat: "sam-steps-back",
        },
        {
          id: "mock-sam-laugh",
          text: "(laugh along with Brent)",
          type: "performed",
          fractureDelta: 0.05,
          context: "dangerous",
          nextBeat: "sam-steps-back",
        },
        {
          id: "mock-sam-quiet",
          text: "(stay quiet, look at the ground)",
          type: "deflect",
          fractureDelta: 0.01,
          context: "dangerous",
          nextBeat: "sam-steps-back",
        },
      ],
      timer: 12,
    },
    {
      id: "sam-steps-back",
      location: "CampfireScene",
      lines: [
        { speaker: "sam", text: "Right." },
        { speaker: null, text: "Sam steps back in line." },
      ],
      nextBeat: "end",
    },
  ],
};

export default SCRIPT;
```

- [ ] **Step 2: Test the game boots and shows dialogue**

```bash
cd /c/Users/cjpmu/SCOUTS
npm run dev
```

Open http://localhost:3000/play. Should see the campfire scene with dialogue playing through the oath sequence, then choices appearing for the slogan question, then Sam's interrogation with Brent mocking him and Simon's reaction choice.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: first playable scene -- the oath and Sam's interrogation with 5 player choices"
```

---

## Task 15: Landing Page Update

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Update the landing page with content warning and Begin button**

```tsx
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#f8f0e3] flex flex-col items-center justify-center p-8">
      <h1 className="font-serif text-6xl font-bold text-[#c9a96e] mb-6 tracking-wide">
        SCOUTS
      </h1>
      <p className="text-lg text-[#f8f0e3]/70 mb-2 text-center max-w-md font-serif">
        An interactive narrative game based on the play
      </p>
      <p className="text-sm text-[#f8f0e3]/40 mb-10 text-center font-serif">
        by Ryann Lynn Murphy
      </p>

      <div className="max-w-lg text-center mb-10 px-6 py-4 border border-[#333] rounded-lg bg-[#111]/50">
        <p className="text-xs text-[#f8f0e3]/50 uppercase tracking-widest mb-3">
          Content Warning
        </p>
        <p className="text-sm text-[#f8f0e3]/60 leading-relaxed font-serif">
          Misogyny, homophobia, transphobia, f-slurs, depictions of animal violence,
          depictions of violence, depictions of hazing, mentions of abuse, mentions of
          negative body image, mentions of gender dysphoria, mentions of depression.
        </p>
      </div>

      <Link
        href="/play"
        className="px-10 py-4 bg-[#c9a96e] text-[#1a1714] font-bold rounded-md hover:bg-[#b8955a] transition-colors text-lg font-serif tracking-wide"
      >
        Begin
      </Link>

      <p className="text-xs text-[#f8f0e3]/20 mt-16 font-serif">
        Best experienced with headphones.
      </p>
    </main>
  );
}
```

- [ ] **Step 2: Build and verify**

```bash
cd /c/Users/cjpmu/SCOUTS
npm run build
```

- [ ] **Step 3: Commit and push**

```bash
git add -A
git commit -m "feat: SCOUTS game engine foundation -- Phaser 3, dialogue, choices, fracture, inventory"
git push origin master
```

---

## Summary

| Task | What It Builds | Files |
|------|---------------|-------|
| 1 | Strip old app, install Phaser | package.json, cleanup |
| 2 | Phaser config + React mount + 6 stub scenes | game/config.ts, Game.tsx, 6 scenes |
| 3 | Data types + characters + items | game/data/*.ts |
| 4 | Fracture system | game/systems/FractureManager.ts |
| 5 | Choice tracking | game/systems/ChoiceTracker.ts |
| 6 | Inventory system | game/systems/InventoryManager.ts |
| 7 | Dialogue box UI | game/ui/DialogueBox.ts |
| 8 | Choice buttons UI | game/ui/ChoiceButtons.ts |
| 9 | Inventory bar UI | game/ui/InventoryBar.ts |
| 10 | Scene transitions | game/ui/TransitionOverlay.ts |
| 11 | Dialogue manager (core loop) | game/systems/DialogueManager.ts |
| 12 | Scene director + play sequence | game/systems/SceneDirector.ts |
| 13 | Wire scenes to director | all 6 scene files |
| 14 | First playable scene script | game/data/scenes/scene1-oath.ts |
| 15 | Landing page | app/page.tsx |

**After Plan A:** The game engine is fully functional. You can play through the oath scene with choices, see fracture change the screen, and pick up the neckerchief. Everything is ready for:
- **Plan B:** Pixel art assets (swap colored rectangles for real sprites)
- **Plan C:** All 65 choices across 18 scene scripts (plug into the engine)
- **Plan D:** Audio + visual polish (Howler ambient, tinnitus, particles)
