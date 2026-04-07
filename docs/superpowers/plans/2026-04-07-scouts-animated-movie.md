# SCOUTS Animated Movie Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the SCOUTS interactive game into a linear cinematic playback of the six-person script, with theatrical lighting, click-to-advance dialogue, and no game mechanics.

**Architecture:** Phaser 3 game engine embedded in Next.js. Strip choices/fracture/inventory systems. New simplified DialogueManager for linear playback, new LightingDirector for theatrical lighting cues. All 18 scenes transcribed from `scouts-choices.txt` with Simon->Quinn, Sam->Matt renames.

**Tech Stack:** Next.js 16, React 19, Phaser 3.90, Howler.js, TypeScript, Tailwind CSS 4

**Source script:** `C:/Users/cjpmu/scouts-choices.txt` (2551 lines, six-person version)

---

## Task 1: New Type System

**Files:**
- Rewrite: `game/data/types.ts`

- [ ] **Step 1: Replace the type system**

Replace the entire contents of `game/data/types.ts` with the cinematic types. Remove all choice/fracture/inventory types.

```typescript
// game/data/types.ts

export type SceneKey =
  | "CampfireScene"
  | "CliffScene"
  | "MeadowScene"
  | "LakeScene"
  | "VoidScene";

export type CharacterKey =
  | "quinn"
  | "matt"
  | "brent"
  | "josh"
  | "noah"
  | "lucas";

export interface LightingCue {
  tint: string;         // hex color for scene tint overlay
  intensity: number;    // 0-1
  transition: number;   // ms to fade to this state
}

export interface StageDirection {
  enter?: string[];
  exit?: string[];
  position?: Record<string, { x: number; y: number }>;
  effect?: "shake" | "flash" | "blood" | "fadeCharacter";
}

export interface CinematicLine {
  speaker: string | null;       // character key or null for stage direction
  text: string;
  autoAdvance?: number;         // ms — auto-advance without click
  pause?: number;               // ms — pause before showing
  lighting?: LightingCue;
  direction?: StageDirection;
  overlap?: boolean;            // show simultaneously with following lines
  expression?: string;
}

export interface CinematicScene {
  id: string;
  title: string;
  location: SceneKey;
  characters: string[];
  lines: CinematicLine[];
  ambientKey?: "forest" | "cliff" | "meadow" | "lake" | "silence";
  initialLighting?: LightingCue;
}

export interface Character {
  key: CharacterKey;
  name: string;
  age: string;
  color: string;
  expressions: string[];
}
```

- [ ] **Step 2: Commit**

```bash
git add game/data/types.ts
git commit -m "Replace game types with cinematic playback types"
```

---

## Task 2: Characters Data (Quinn/Matt rename)

**Files:**
- Rewrite: `game/data/characters.ts`

- [ ] **Step 1: Replace characters**

```typescript
// game/data/characters.ts
import { Character } from "./types";

export const CHARACTERS: Record<string, Character> = {
  quinn: {
    key: "quinn",
    name: "QUINN",
    age: "12",
    color: "#d4a0d0",
    expressions: ["neutral", "scared", "defiant", "hurt", "tender", "shattered"],
  },
  matt: {
    key: "matt",
    name: "MATT",
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

- [ ] **Step 2: Commit**

```bash
git add game/data/characters.ts
git commit -m "Rename Simon->Quinn, Sam->Matt, update character data"
```

---

## Task 3: Scene Order (linear, 18 scenes)

**Files:**
- Rewrite: `game/data/scene-order.ts`
- Delete: `game/data/items.ts`

- [ ] **Step 1: Replace scene order with linear cinematic sequence**

```typescript
// game/data/scene-order.ts
import { SceneKey } from "./types";

export interface SceneEntry {
  sceneId: string;
  location: SceneKey;
}

export const SCENE_ORDER: SceneEntry[] = [
  { sceneId: "prelude", location: "VoidScene" },
  { sceneId: "scene1-oath", location: "CampfireScene" },
  { sceneId: "different-noah", location: "VoidScene" },
  { sceneId: "scene1-sacrifice", location: "CampfireScene" },
  { sceneId: "different-quinn", location: "VoidScene" },
  { sceneId: "scene1-kiss-test", location: "CampfireScene" },
  { sceneId: "different-lucas", location: "VoidScene" },
  { sceneId: "scene1-pickup-lines", location: "CampfireScene" },
  { sceneId: "scene1-resistance", location: "CampfireScene" },
  { sceneId: "different-josh", location: "VoidScene" },
  { sceneId: "gay-shit-anthem", location: "CampfireScene" },
  { sceneId: "gay-shit-act1", location: "CliffScene" },
  { sceneId: "gay-shit-act2", location: "MeadowScene" },
  { sceneId: "gay-shit-act3", location: "LakeScene" },
  { sceneId: "different-matt", location: "VoidScene" },
  { sceneId: "ceremony", location: "CampfireScene" },
  { sceneId: "different-brent", location: "VoidScene" },
  { sceneId: "ending", location: "VoidScene" },
];
```

- [ ] **Step 2: Delete items.ts**

```bash
rm game/data/items.ts
```

- [ ] **Step 3: Commit**

```bash
git add game/data/scene-order.ts
git rm game/data/items.ts
git commit -m "Linear scene order, remove inventory items"
```

---

## Task 4: LightingDirector (new system)

**Files:**
- Create: `game/systems/LightingDirector.ts`

- [ ] **Step 1: Create the LightingDirector**

```typescript
// game/systems/LightingDirector.ts
import Phaser from "phaser";
import { LightingCue } from "../data/types";

export class LightingDirector {
  private scene: Phaser.Scene;
  private overlay: Phaser.GameObjects.Rectangle;
  private currentTint: number = 0x000000;
  private currentAlpha: number = 0;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.overlay = scene.add.rectangle(
      scene.cameras.main.width / 2,
      scene.cameras.main.height / 2,
      scene.cameras.main.width,
      scene.cameras.main.height,
      0x000000,
      0
    );
    this.overlay.setDepth(5);
    this.overlay.setScrollFactor(0);
  }

  applyCue(cue: LightingCue): void {
    const color = Phaser.Display.Color.HexStringToColor(cue.tint).color;
    this.overlay.setFillStyle(color, cue.intensity);

    if (cue.transition > 0) {
      this.overlay.setAlpha(this.currentAlpha);
      this.scene.tweens.add({
        targets: this.overlay,
        alpha: cue.intensity,
        duration: cue.transition,
        ease: "Sine.easeInOut",
      });
    } else {
      this.overlay.setAlpha(cue.intensity);
    }

    this.currentTint = color;
    this.currentAlpha = cue.intensity;
  }

  setImmediate(tintHex: string, intensity: number): void {
    const color = Phaser.Display.Color.HexStringToColor(tintHex).color;
    this.overlay.setFillStyle(color, intensity);
    this.overlay.setAlpha(intensity);
    this.currentTint = color;
    this.currentAlpha = intensity;
  }

  clear(): void {
    this.overlay.setAlpha(0);
    this.currentAlpha = 0;
  }

  destroy(): void {
    this.overlay.destroy();
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add game/systems/LightingDirector.ts
git commit -m "Add LightingDirector for theatrical lighting cues"
```

---

## Task 5: Simplified AudioManager

**Files:**
- Rewrite: `game/systems/AudioManager.ts`

- [ ] **Step 1: Strip fracture-driven audio, keep ambients and transitions**

```typescript
// game/systems/AudioManager.ts
import { Howl } from "howler";

export type AmbientKey = "forest" | "cliff" | "meadow" | "lake" | "silence";

export class AudioManager {
  private ambientLoops: Map<string, Howl> = new Map();
  private transition: Howl | null = null;
  private currentAmbient: string | null = null;
  private initialized = false;

  init(): void {
    if (this.initialized) return;
    this.initialized = true;

    const ambients: Record<string, string> = {
      forest: "assets/audio/forest-ambient.wav",
      cliff: "assets/audio/cliff-wind.wav",
      meadow: "assets/audio/meadow-birds.wav",
      lake: "assets/audio/lake-water.wav",
    };

    for (const [key, src] of Object.entries(ambients)) {
      this.ambientLoops.set(
        key,
        new Howl({ src: [src], loop: true, volume: 0, preload: true })
      );
    }

    this.transition = new Howl({
      src: ["assets/audio/transition.wav"],
      volume: 0.3,
      preload: true,
    });
  }

  setAmbient(key: AmbientKey): void {
    if (!this.initialized) this.init();

    if (this.currentAmbient && this.ambientLoops.has(this.currentAmbient)) {
      const current = this.ambientLoops.get(this.currentAmbient)!;
      current.fade(current.volume(), 0, 1000);
      setTimeout(() => current.stop(), 1000);
    }

    if (key === "silence") {
      this.currentAmbient = null;
      return;
    }

    const next = this.ambientLoops.get(key);
    if (next) {
      next.play();
      next.fade(0, 0.3, 1500);
      this.currentAmbient = key;
    }
  }

  playTransition(): void {
    if (this.transition) this.transition.play();
  }

  stopAll(): void {
    this.ambientLoops.forEach((h) => h.stop());
    this.currentAmbient = null;
  }
}

export const audioManager = new AudioManager();
```

- [ ] **Step 2: Commit**

```bash
git add game/systems/AudioManager.ts
git commit -m "Simplify AudioManager — remove fracture audio, keep ambients"
```

---

## Task 6: Linear DialogueManager

**Files:**
- Rewrite: `game/systems/DialogueManager.ts`
- Delete: `game/systems/FractureManager.ts`
- Delete: `game/systems/InventoryManager.ts`
- Delete: `game/systems/ChoiceTracker.ts`

- [ ] **Step 1: Rewrite DialogueManager for linear cinematic playback**

```typescript
// game/systems/DialogueManager.ts
import Phaser from "phaser";
import { CinematicLine, CinematicScene } from "../data/types";
import { DialogueBox } from "../ui/DialogueBox";
import { LightingDirector } from "./LightingDirector";

export class DialogueManager {
  private scene: Phaser.Scene;
  private dialogueBox: DialogueBox;
  private lighting: LightingDirector;
  private lines: CinematicLine[] = [];
  private currentIndex: number = 0;
  private onSceneComplete: (() => void) | null = null;
  private waitingForClick: boolean = false;
  private autoAdvanceTimer: Phaser.Time.TimerEvent | null = null;

  public onSpeakerChange: ((charKey: string | null) => void) | null = null;
  public onStageDirection: ((dir: CinematicLine["direction"]) => void) | null = null;

  constructor(scene: Phaser.Scene, lighting: LightingDirector) {
    this.scene = scene;
    this.dialogueBox = new DialogueBox(scene);
    this.lighting = lighting;
  }

  loadScene(script: CinematicScene): void {
    this.lines = script.lines;
    this.currentIndex = 0;

    if (script.initialLighting) {
      this.lighting.applyCue(script.initialLighting);
    }
  }

  start(onComplete: () => void): void {
    this.onSceneComplete = onComplete;
    this.showLine();
  }

  advance(): void {
    if (!this.waitingForClick) {
      // If typewriter is still running, skip to end
      if (this.dialogueBox.isTyping()) {
        this.dialogueBox.skipTypewriter();
        return;
      }
      return;
    }

    this.waitingForClick = false;
    this.currentIndex++;
    this.showLine();
  }

  private showLine(): void {
    if (this.currentIndex >= this.lines.length) {
      this.dialogueBox.hide();
      if (this.onSceneComplete) this.onSceneComplete();
      return;
    }

    const line = this.lines[this.currentIndex];

    // Apply lighting cue
    if (line.lighting) {
      this.lighting.applyCue(line.lighting);
    }

    // Apply stage direction
    if (line.direction && this.onStageDirection) {
      this.onStageDirection(line.direction);
    }

    // Notify speaker change
    if (this.onSpeakerChange) {
      this.onSpeakerChange(line.speaker ? line.speaker.toLowerCase() : null);
    }

    // Handle pause before line
    const showAfterPause = () => {
      this.dialogueBox.showLine(line.speaker, line.text, () => {
        // Typewriter finished
        if (line.autoAdvance !== undefined) {
          this.autoAdvanceTimer = this.scene.time.delayedCall(
            line.autoAdvance,
            () => {
              this.currentIndex++;
              this.showLine();
            }
          );
        } else {
          this.waitingForClick = true;
        }
      });
    };

    if (line.pause && line.pause > 0) {
      this.scene.time.delayedCall(line.pause, showAfterPause);
    } else {
      showAfterPause();
    }
  }

  isWaitingForClick(): boolean {
    return this.waitingForClick;
  }

  getDialogueBox(): DialogueBox {
    return this.dialogueBox;
  }

  destroy(): void {
    if (this.autoAdvanceTimer) this.autoAdvanceTimer.destroy();
    this.dialogueBox.destroy();
  }
}
```

- [ ] **Step 2: Delete removed systems**

```bash
rm game/systems/FractureManager.ts
rm game/systems/InventoryManager.ts
rm game/systems/ChoiceTracker.ts
```

- [ ] **Step 3: Commit**

```bash
git add game/systems/DialogueManager.ts
git rm game/systems/FractureManager.ts game/systems/InventoryManager.ts game/systems/ChoiceTracker.ts
git commit -m "Rewrite DialogueManager for linear playback, remove game systems"
```

---

## Task 7: Simplified SceneDirector

**Files:**
- Rewrite: `game/systems/SceneDirector.ts`

- [ ] **Step 1: Rewrite SceneDirector for linear scene progression**

```typescript
// game/systems/SceneDirector.ts
import Phaser from "phaser";
import { SCENE_ORDER } from "../data/scene-order";
import { DialogueManager } from "./DialogueManager";
import { LightingDirector } from "./LightingDirector";
import { TransitionOverlay } from "../ui/TransitionOverlay";
import { CharacterSprites } from "../ui/CharacterSprites";
import { SceneKey, CinematicScene } from "../data/types";
import { audioManager } from "./AudioManager";

const AMBIENT_MAP: Record<SceneKey, "forest" | "cliff" | "meadow" | "lake" | "silence"> = {
  CampfireScene: "forest",
  CliffScene: "cliff",
  MeadowScene: "meadow",
  LakeScene: "lake",
  VoidScene: "silence",
};

export class SceneDirector {
  private currentIndex: number = 0;
  private dialogueManager: DialogueManager | null = null;
  private lighting: LightingDirector | null = null;
  private transition: TransitionOverlay | null = null;
  private characterSprites: CharacterSprites | null = null;

  attachToScene(scene: Phaser.Scene): void {
    this.lighting = new LightingDirector(scene);
    this.dialogueManager = new DialogueManager(scene, this.lighting);
    this.transition = new TransitionOverlay(scene);

    this.characterSprites?.destroy();
    this.characterSprites = new CharacterSprites(scene);

    // Wire speaker highlighting
    this.dialogueManager.onSpeakerChange = (charKey) => {
      this.characterSprites?.setSpeaker(charKey);
    };

    // Wire stage directions
    this.dialogueManager.onStageDirection = (dir) => {
      if (!dir) return;
      if (dir.effect === "shake") {
        scene.cameras.main.shake(300, 0.01);
      }
      if (dir.effect === "flash") {
        scene.cameras.main.flash(200, 255, 255, 255);
      }
    };

    // Click to advance
    scene.input.on("pointerdown", () => {
      this.dialogueManager?.advance();
    });
  }

  async startCurrentScene(scene: Phaser.Scene): Promise<void> {
    if (!this.dialogueManager || !this.transition) return;

    const entry = SCENE_ORDER[this.currentIndex];
    if (!entry) {
      console.log("Play complete.");
      return;
    }

    // Load script
    const script: CinematicScene | null = await this.loadScript(entry.sceneId);
    if (!script) {
      console.error(`Script not found: ${entry.sceneId}`);
      return;
    }

    // Set up characters
    if (this.characterSprites) {
      this.characterSprites.setupForScene(script.characters);
    }

    // Set ambient audio
    const ambient = script.ambientKey || AMBIENT_MAP[entry.location];
    audioManager.setAmbient(ambient);

    // Load and start dialogue
    this.dialogueManager.loadScene(script);
    await this.transition.fadeIn(800);

    this.dialogueManager.start(() => {
      this.advanceToNext(scene);
    });
  }

  private async advanceToNext(currentScene: Phaser.Scene): Promise<void> {
    this.currentIndex++;
    if (this.currentIndex >= SCENE_ORDER.length) {
      console.log("Play complete.");
      return;
    }

    const next = SCENE_ORDER[this.currentIndex];
    const currentKey = currentScene.scene.key;

    if (next.location !== currentKey) {
      await this.transitionToScene(currentScene, next.location);
    } else {
      // Same Phaser scene, just load next script
      await this.transition?.fadeOut(800);
      await new Promise((r) => setTimeout(r, 400));
      await this.startCurrentScene(currentScene);
    }
  }

  private async transitionToScene(
    currentScene: Phaser.Scene,
    targetKey: SceneKey
  ): Promise<void> {
    if (this.transition) {
      await this.transition.fadeOut(800);
    }
    audioManager.playTransition();
    currentScene.scene.start(targetKey, { director: this });
  }

  private async loadScript(sceneId: string): Promise<CinematicScene | null> {
    try {
      const module = await import(`../data/scenes/${sceneId}`);
      return module.default || module.SCRIPT;
    } catch (e) {
      console.error(`Failed to load: ${sceneId}`, e);
      return null;
    }
  }

  getCurrentIndex(): number {
    return this.currentIndex;
  }

  destroy(): void {
    this.dialogueManager?.destroy();
    this.lighting?.destroy();
    this.transition?.destroy();
    this.characterSprites?.destroy();
  }
}

export const sceneDirector = new SceneDirector();
```

- [ ] **Step 2: Commit**

```bash
git add game/systems/SceneDirector.ts
git commit -m "Rewrite SceneDirector for linear scene progression"
```

---

## Task 8: UI — DialogueBox (strip choices, keep typewriter)

**Files:**
- Rewrite: `game/ui/DialogueBox.ts`
- Delete: `game/ui/ChoiceButtons.ts`
- Delete: `game/ui/InventoryBar.ts`

- [ ] **Step 1: Rewrite DialogueBox**

```typescript
// game/ui/DialogueBox.ts
import Phaser from "phaser";
import { CHARACTERS, STAGE_DIRECTION_COLOR, STAGE_DIRECTION_ALPHA } from "../data/characters";
import { GAME_WIDTH, GAME_HEIGHT } from "../constants";

const BOX_HEIGHT = 160;
const PADDING = 20;
const TYPEWRITER_SPEED = 30; // ms per character

export class DialogueBox {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private background: Phaser.GameObjects.Rectangle;
  private nameText: Phaser.GameObjects.Text;
  private bodyText: Phaser.GameObjects.Text;
  private typing: boolean = false;
  private typewriterTimer: Phaser.Time.TimerEvent | null = null;
  private fullText: string = "";
  private displayedChars: number = 0;
  private onComplete: (() => void) | null = null;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    const y = GAME_HEIGHT - BOX_HEIGHT;

    this.background = scene.add.rectangle(
      GAME_WIDTH / 2, y + BOX_HEIGHT / 2,
      GAME_WIDTH, BOX_HEIGHT,
      0x000000, 0.75
    );

    this.nameText = scene.add.text(PADDING, y + 12, "", {
      fontFamily: "Playfair Display, serif",
      fontSize: "20px",
      color: "#ffffff",
      fontStyle: "bold",
    });

    this.bodyText = scene.add.text(PADDING, y + 42, "", {
      fontFamily: "Lora, serif",
      fontSize: "16px",
      color: "#f8f0e3",
      wordWrap: { width: GAME_WIDTH - PADDING * 2, useAdvancedWrap: true },
      lineSpacing: 6,
    });

    this.container = scene.add.container(0, 0, [
      this.background,
      this.nameText,
      this.bodyText,
    ]);
    this.container.setDepth(100);
    this.container.setScrollFactor(0);
    this.container.setVisible(false);
  }

  showLine(speaker: string | null, text: string, onComplete: () => void): void {
    this.container.setVisible(true);
    this.onComplete = onComplete;
    this.fullText = text;
    this.displayedChars = 0;
    this.typing = true;

    if (speaker) {
      const char = CHARACTERS[speaker.toLowerCase()];
      this.nameText.setText(char?.name || speaker.toUpperCase());
      this.nameText.setColor(char?.color || "#ffffff");
      this.nameText.setAlpha(1);
      this.bodyText.setColor("#f8f0e3");
      this.bodyText.setAlpha(1);
      this.bodyText.setFontStyle("normal");
    } else {
      // Stage direction
      this.nameText.setText("");
      this.bodyText.setColor(STAGE_DIRECTION_COLOR);
      this.bodyText.setAlpha(STAGE_DIRECTION_ALPHA);
      this.bodyText.setFontStyle("italic");
    }

    this.bodyText.setText("");

    if (this.typewriterTimer) this.typewriterTimer.destroy();

    this.typewriterTimer = this.scene.time.addEvent({
      delay: TYPEWRITER_SPEED,
      repeat: text.length - 1,
      callback: () => {
        this.displayedChars++;
        this.bodyText.setText(this.fullText.substring(0, this.displayedChars));
        if (this.displayedChars >= this.fullText.length) {
          this.typing = false;
          if (this.onComplete) this.onComplete();
        }
      },
    });
  }

  skipTypewriter(): void {
    if (!this.typing) return;
    if (this.typewriterTimer) this.typewriterTimer.destroy();
    this.bodyText.setText(this.fullText);
    this.displayedChars = this.fullText.length;
    this.typing = false;
    if (this.onComplete) this.onComplete();
  }

  isTyping(): boolean {
    return this.typing;
  }

  hide(): void {
    this.container.setVisible(false);
  }

  destroy(): void {
    if (this.typewriterTimer) this.typewriterTimer.destroy();
    this.container.destroy();
  }
}
```

- [ ] **Step 2: Delete old UI components**

```bash
rm game/ui/ChoiceButtons.ts
rm game/ui/InventoryBar.ts
```

- [ ] **Step 3: Commit**

```bash
git add game/ui/DialogueBox.ts
git rm game/ui/ChoiceButtons.ts game/ui/InventoryBar.ts
git commit -m "Rewrite DialogueBox, remove ChoiceButtons and InventoryBar"
```

---

## Task 9: UI — CharacterSprites (keep, simplify)

**Files:**
- Rewrite: `game/ui/CharacterSprites.ts`

- [ ] **Step 1: Rewrite CharacterSprites — keep positioning and speaker highlighting, remove fracture**

```typescript
// game/ui/CharacterSprites.ts
import Phaser from "phaser";
import { CHARACTERS } from "../data/characters";
import { GAME_WIDTH, GAME_HEIGHT } from "../constants";

// Predefined positions per scene type
const GROUP_POSITIONS: { x: number; y: number }[] = [
  { x: 120, y: 280 },
  { x: 280, y: 290 },
  { x: 440, y: 280 },
  { x: 600, y: 290 },
  { x: 720, y: 280 },
  { x: 840, y: 290 },
];

const DUO_POSITIONS: { x: number; y: number }[] = [
  { x: 360, y: 280 },
  { x: 600, y: 280 },
];

const SOLO_POSITION = { x: GAME_WIDTH / 2, y: 280 };

export class CharacterSprites {
  private scene: Phaser.Scene;
  private sprites: Map<string, Phaser.GameObjects.Rectangle> = new Map();
  private labels: Map<string, Phaser.GameObjects.Text> = new Map();
  private breathingTweens: Phaser.Tweens.Tween[] = [];
  private currentSpeaker: string | null = null;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  setupForScene(characterKeys: string[]): void {
    this.clearAll();

    const positions =
      characterKeys.length === 1
        ? [SOLO_POSITION]
        : characterKeys.length === 2
        ? DUO_POSITIONS
        : GROUP_POSITIONS;

    characterKeys.forEach((key, i) => {
      const pos = positions[i % positions.length];
      const char = CHARACTERS[key];
      if (!char) return;

      const color = Phaser.Display.Color.HexStringToColor(char.color).color;

      // Character body (placeholder rectangle — will be replaced with sprites)
      const sprite = this.scene.add.rectangle(pos.x, pos.y, 48, 80, color, 0.9);
      sprite.setDepth(10);

      // Name label above
      const label = this.scene.add.text(pos.x, pos.y - 52, char.name, {
        fontFamily: "Lora, serif",
        fontSize: "12px",
        color: char.color,
        align: "center",
      });
      label.setOrigin(0.5);
      label.setDepth(11);

      this.sprites.set(key, sprite);
      this.labels.set(key, label);

      // Idle breathing animation
      const tween = this.scene.tweens.add({
        targets: [sprite, label],
        y: `-=3`,
        duration: 2000 + Math.random() * 1000,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
        delay: Math.random() * 1000,
      });
      this.breathingTweens.push(tween);
    });
  }

  setSpeaker(charKey: string | null): void {
    this.currentSpeaker = charKey;

    this.sprites.forEach((sprite, key) => {
      const label = this.labels.get(key);
      if (key === charKey) {
        sprite.setAlpha(1);
        if (label) label.setAlpha(1);
        // Speaker bounce
        this.scene.tweens.add({
          targets: [sprite, label].filter(Boolean),
          y: "-=6",
          duration: 150,
          yoyo: true,
          ease: "Quad.easeOut",
        });
      } else {
        sprite.setAlpha(charKey ? 0.4 : 0.9);
        if (label) label.setAlpha(charKey ? 0.4 : 0.9);
      }
    });
  }

  private clearAll(): void {
    this.breathingTweens.forEach((t) => t.destroy());
    this.breathingTweens = [];
    this.sprites.forEach((s) => s.destroy());
    this.sprites.clear();
    this.labels.forEach((l) => l.destroy());
    this.labels.clear();
  }

  destroy(): void {
    this.clearAll();
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add game/ui/CharacterSprites.ts
git commit -m "Simplify CharacterSprites — remove fracture, keep speaker highlighting"
```

---

## Task 10: TransitionOverlay (keep, minor cleanup)

**Files:**
- Modify: `game/ui/TransitionOverlay.ts`

- [ ] **Step 1: Rewrite TransitionOverlay — remove fracture/audio coupling**

```typescript
// game/ui/TransitionOverlay.ts
import Phaser from "phaser";
import { GAME_WIDTH, GAME_HEIGHT } from "../constants";

export class TransitionOverlay {
  private scene: Phaser.Scene;
  private overlay: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.overlay = scene.add.rectangle(
      GAME_WIDTH / 2, GAME_HEIGHT / 2,
      GAME_WIDTH, GAME_HEIGHT,
      0x000000, 1
    );
    this.overlay.setDepth(1000);
    this.overlay.setScrollFactor(0);
  }

  fadeIn(duration: number = 800): Promise<void> {
    return new Promise((resolve) => {
      this.overlay.setAlpha(1);
      this.scene.tweens.add({
        targets: this.overlay,
        alpha: 0,
        duration,
        ease: "Sine.easeInOut",
        onComplete: () => resolve(),
      });
    });
  }

  fadeOut(duration: number = 800): Promise<void> {
    return new Promise((resolve) => {
      this.overlay.setAlpha(0);
      this.scene.tweens.add({
        targets: this.overlay,
        alpha: 1,
        duration,
        ease: "Sine.easeInOut",
        onComplete: () => resolve(),
      });
    });
  }

  destroy(): void {
    this.overlay.destroy();
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add game/ui/TransitionOverlay.ts
git commit -m "Clean up TransitionOverlay"
```

---

## Task 11: Phaser Scenes (BootScene + 5 gameplay scenes)

**Files:**
- Rewrite: `game/scenes/BootScene.ts`
- Rewrite: `game/scenes/CampfireScene.ts`
- Rewrite: `game/scenes/CliffScene.ts`
- Rewrite: `game/scenes/MeadowScene.ts`
- Rewrite: `game/scenes/LakeScene.ts`
- Rewrite: `game/scenes/VoidScene.ts`

- [ ] **Step 1: Rewrite BootScene — simplified preload, first-click audio init**

```typescript
// game/scenes/BootScene.ts
import Phaser from "phaser";
import { audioManager } from "../systems/AudioManager";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload(): void {
    // Placeholder: audio files will be loaded when they exist
    // For now we just initialize and move on
  }

  create(): void {
    const text = this.add.text(480, 270, "Click to begin", {
      fontFamily: "Playfair Display, serif",
      fontSize: "24px",
      color: "#c9a96e",
    });
    text.setOrigin(0.5);

    this.input.once("pointerdown", () => {
      audioManager.init();
      this.scene.start("CampfireScene", { director: null });
    });
  }
}
```

- [ ] **Step 2: Create a base scene template and write all 5 gameplay scenes**

Each gameplay scene follows the same pattern: receive the sceneDirector, set background color, attach, and start.

```typescript
// game/scenes/CampfireScene.ts
import Phaser from "phaser";
import { sceneDirector } from "../systems/SceneDirector";

export class CampfireScene extends Phaser.Scene {
  constructor() {
    super("CampfireScene");
  }

  init(data: { director?: typeof sceneDirector }): void {
    // Scene director passed during transitions
  }

  create(): void {
    this.cameras.main.setBackgroundColor("#0d1a0d");
    sceneDirector.attachToScene(this);
    sceneDirector.startCurrentScene(this);
  }
}
```

```typescript
// game/scenes/CliffScene.ts
import Phaser from "phaser";
import { sceneDirector } from "../systems/SceneDirector";

export class CliffScene extends Phaser.Scene {
  constructor() {
    super("CliffScene");
  }

  create(): void {
    this.cameras.main.setBackgroundColor("#1a1a2a");
    sceneDirector.attachToScene(this);
    sceneDirector.startCurrentScene(this);
  }
}
```

```typescript
// game/scenes/MeadowScene.ts
import Phaser from "phaser";
import { sceneDirector } from "../systems/SceneDirector";

export class MeadowScene extends Phaser.Scene {
  constructor() {
    super("MeadowScene");
  }

  create(): void {
    this.cameras.main.setBackgroundColor("#1a2a1a");
    sceneDirector.attachToScene(this);
    sceneDirector.startCurrentScene(this);
  }
}
```

```typescript
// game/scenes/LakeScene.ts
import Phaser from "phaser";
import { sceneDirector } from "../systems/SceneDirector";

export class LakeScene extends Phaser.Scene {
  constructor() {
    super("LakeScene");
  }

  create(): void {
    this.cameras.main.setBackgroundColor("#0a1a2a");
    sceneDirector.attachToScene(this);
    sceneDirector.startCurrentScene(this);
  }
}
```

```typescript
// game/scenes/VoidScene.ts
import Phaser from "phaser";
import { sceneDirector } from "../systems/SceneDirector";

export class VoidScene extends Phaser.Scene {
  constructor() {
    super("VoidScene");
  }

  create(): void {
    this.cameras.main.setBackgroundColor("#000000");
    sceneDirector.attachToScene(this);
    sceneDirector.startCurrentScene(this);
  }
}
```

- [ ] **Step 3: Update config.ts — same scenes, no FX changes**

```typescript
// game/config.ts
import Phaser from "phaser";
import { BootScene } from "./scenes/BootScene";
import { CampfireScene } from "./scenes/CampfireScene";
import { CliffScene } from "./scenes/CliffScene";
import { MeadowScene } from "./scenes/MeadowScene";
import { LakeScene } from "./scenes/LakeScene";
import { VoidScene } from "./scenes/VoidScene";
import { GAME_WIDTH, GAME_HEIGHT } from "./constants";

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootScene, CampfireScene, CliffScene, MeadowScene, LakeScene, VoidScene],
  audio: {
    disableWebAudio: true, // Howler handles audio
  },
};
```

- [ ] **Step 4: Commit**

```bash
git add game/scenes/ game/config.ts
git commit -m "Rewrite all Phaser scenes for cinematic playback"
```

---

## Task 12: Title Screen Update

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Update title screen — remove game language, keep dark/gold aesthetic**

```tsx
// app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#1a1714] text-[#f8f0e3] px-8">
      <div className="text-center max-w-xl">
        <h1 className="font-['Playfair_Display'] text-7xl font-bold text-[#c9a96e] mb-4 tracking-wide">
          SCOUTS
        </h1>
        <p className="font-['Lora'] text-lg text-[#c9a96e] opacity-70 mb-12">
          by Ryann Lynn Murphy
        </p>

        <div className="text-sm text-[#f8f0e3] opacity-50 mb-12 leading-relaxed text-left">
          <p className="font-['Lora'] italic mb-2">Content Warning:</p>
          <p className="font-['Lora']">
            Misogyny, homophobia, transphobia, f-slurs, depictions of animal
            violence, violence, murder, hazing, mentions of abuse, negative body
            image, gender dysphoria, depression, intrusive thoughts.
          </p>
        </div>

        <Link
          href="/play"
          className="inline-block font-['Playfair_Display'] text-xl text-[#c9a96e] border border-[#c9a96e] px-12 py-4 hover:bg-[#c9a96e] hover:text-[#1a1714] transition-all duration-300"
        >
          Begin
        </Link>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/page.tsx
git commit -m "Update title screen — cinematic presentation, no game language"
```

---

## Task 13: Script Transcription — Prelude + Scene One: Oath

**Files:**
- Create: `game/data/scenes/prelude.ts`
- Rewrite: `game/data/scenes/scene1-oath.ts`

Transcribe from `scouts-choices.txt` lines 77-265. Replace all instances of "SIMON" with "quinn" (speaker key) / "QUINN" (in text). Replace "SAM" with "matt" / "MATT".

- [ ] **Step 1: Transcribe the Different Prelude (lines 77-186)**

Read `scouts-choices.txt` lines 77-186 and transcribe every line into `CinematicLine[]` format. The prelude has overlapping monologues — use `autoAdvance` for rapid-fire lines from Brent/Lucas/Noah/Josh, and slower pacing for Quinn and Matt.

- [ ] **Step 2: Transcribe Scene One: The Oath (lines 187-265)**

Read `scouts-choices.txt` lines 187-265 and transcribe. This covers the scout oath/law recitation through Brent mocking Matt for climate change.

- [ ] **Step 3: Commit**

```bash
git add game/data/scenes/prelude.ts game/data/scenes/scene1-oath.ts
git commit -m "Transcribe Prelude and Scene One: The Oath"
```

---

## Task 14: Script Transcription — Different Noah + Scene One: Sacrifice

**Files:**
- Create: `game/data/scenes/different-noah.ts`
- Rewrite: `game/data/scenes/scene1-sacrifice.ts`

- [ ] **Step 1: Transcribe Different 1: Noah**

Noah's monologue about girls, the Xbox, calling his mom a slur.

- [ ] **Step 2: Transcribe Scene One: The Sacrifice**

Brent's "glories of manhood" speech, the squirrel sacrifice, the blood.

- [ ] **Step 3: Commit**

```bash
git add game/data/scenes/different-noah.ts game/data/scenes/scene1-sacrifice.ts
git commit -m "Transcribe Different Noah and Scene One: Sacrifice"
```

---

## Task 15: Script Transcription — Different Quinn + Scene One: Kiss Test

**Files:**
- Create: `game/data/scenes/different-quinn.ts`
- Rewrite: `game/data/scenes/scene1-kiss-test.ts`

- [ ] **Step 1: Transcribe Different 2: Quinn**

Quinn's monologue about dolphins, the tote bag, being called a slur from the truck, the strawberry metaphor.

- [ ] **Step 2: Transcribe Scene One: The Kiss Test**

The anti-gay oath, boys kissing in pairs, the "tingle" / mosquito rationalization.

- [ ] **Step 3: Commit**

```bash
git add game/data/scenes/different-quinn.ts game/data/scenes/scene1-kiss-test.ts
git commit -m "Transcribe Different Quinn and Scene One: Kiss Test"
```

---

## Task 16: Script Transcription — Different Lucas + Pickup Lines + Resistance

**Files:**
- Create: `game/data/scenes/different-lucas.ts`
- Rewrite: `game/data/scenes/scene1-pickup-lines.ts`
- Rewrite: `game/data/scenes/scene1-resistance.ts`

- [ ] **Step 1: Transcribe Different 3: Lucas**

Lucas's body image monologue (adapted from Will in the 8-person version).

- [ ] **Step 2: Transcribe Scene One: Pickup Lines**

The sex doll, pickup line drills, Lucas arguing men should serve women.

- [ ] **Step 3: Transcribe Scene One: The Resistance**

Noah pushing back, therapy suggestion, Brent's meltdown.

- [ ] **Step 4: Commit**

```bash
git add game/data/scenes/different-lucas.ts game/data/scenes/scene1-pickup-lines.ts game/data/scenes/scene1-resistance.ts
git commit -m "Transcribe Different Lucas, Pickup Lines, and Resistance"
```

---

## Task 17: Script Transcription — Different Josh + Gay Shit Anthem

**Files:**
- Create: `game/data/scenes/different-josh.ts`
- Rewrite: `game/data/scenes/gay-shit-anthem.ts`

- [ ] **Step 1: Transcribe Different 4: Josh**

Josh's marine/pizza/belt monologue.

- [ ] **Step 2: Transcribe The National Anthem**

Every word is "gay." Auto-advancing lines to create the anthem rhythm.

- [ ] **Step 3: Commit**

```bash
git add game/data/scenes/different-josh.ts game/data/scenes/gay-shit-anthem.ts
git commit -m "Transcribe Different Josh and The Gay Shit National Anthem"
```

---

## Task 18: Script Transcription — Gay Shit Acts 1-3

**Files:**
- Rewrite: `game/data/scenes/gay-shit-act1.ts`
- Rewrite: `game/data/scenes/gay-shit-act2.ts`
- Rewrite: `game/data/scenes/gay-shit-act3.ts`

- [ ] **Step 1: Transcribe Act 1 — The Cliff**

Quinn and Matt on the mountaintop. Matt kisses Quinn's cheek. Quinn runs.

- [ ] **Step 2: Transcribe Act 2 — The Meadow**

Flower picking. "Just a joke." Matt's Jesus boner story. Kiss on the lips.

- [ ] **Step 3: Transcribe Act 3 — The Stars**

I-spy. "You're my girl." Quinn's gender confession. The real kiss.

- [ ] **Step 4: Commit**

```bash
git add game/data/scenes/gay-shit-act1.ts game/data/scenes/gay-shit-act2.ts game/data/scenes/gay-shit-act3.ts
git commit -m "Transcribe Gay Shit Acts 1-3"
```

---

## Task 19: Script Transcription — Different Matt + Ceremony

**Files:**
- Create: `game/data/scenes/different-matt.ts`
- Rewrite: `game/data/scenes/ceremony.ts`

- [ ] **Step 1: Transcribe Different 5: Matt**

Matt's pillow monologue, prayer not to be gay.

- [ ] **Step 2: Transcribe The Ceremony**

Alpha male ceremony, chanting, running in circles, howling, pledges, slapping escalation, Quinn kills Brent.

- [ ] **Step 3: Commit**

```bash
git add game/data/scenes/different-matt.ts game/data/scenes/ceremony.ts
git commit -m "Transcribe Different Matt and The Ceremony"
```

---

## Task 20: Script Transcription — Different Brent + Ending

**Files:**
- Create: `game/data/scenes/different-brent.ts`
- Rewrite: `game/data/scenes/ending.ts`

- [ ] **Step 1: Transcribe Different 6: Brent (the ghost)**

Brent's posthumous monologue. Blood-soaked. "Do I have to be a man?"

- [ ] **Step 2: Transcribe the Ending**

Final stage directions and END PLAY.

- [ ] **Step 3: Commit**

```bash
git add game/data/scenes/different-brent.ts game/data/scenes/ending.ts
git commit -m "Transcribe Different Brent and Ending — play complete"
```

---

## Task 21: Delete Old Scene Files

**Files:**
- Delete: any old scene files that were replaced by new filenames

- [ ] **Step 1: Remove old scene data files that have been superseded**

Check for any files in `game/data/scenes/` that are not in the new scene order (e.g., `monologue-noah.ts`, `monologue-simon.ts`, `monologue-sam.ts`, `monologue-lucas.ts`, `monologue-josh.ts`, `monologue-brent.ts`, `monologue-simon-sam.ts`). Delete them.

```bash
cd game/data/scenes
rm -f monologue-noah.ts monologue-simon.ts monologue-sam.ts monologue-lucas.ts monologue-josh.ts monologue-brent.ts monologue-simon-sam.ts scene1-resistance.ts
```

(Note: `scene1-resistance.ts` was rewritten in Task 16, so it stays. Only delete files with old names that have been replaced by `different-*.ts` names.)

- [ ] **Step 2: Commit**

```bash
git add -A game/data/scenes/
git commit -m "Remove old scene data files replaced by cinematic versions"
```

---

## Task 22: Integration Test — Full Playthrough

**Files:** None (testing only)

- [ ] **Step 1: Install dependencies and build**

```bash
cd /c/Users/cjpmu/SCOUTS
npm install
npm run build
```

Fix any TypeScript compilation errors.

- [ ] **Step 2: Run dev server and test**

```bash
npm run dev
```

Open in browser. Click through the entire play from Prelude to END PLAY. Verify:
- Title screen loads with content warning
- Click "Begin" starts the game
- Dialogue advances on click
- Typewriter effect works, click skips it
- Speaker names show with correct colors
- Character sprites appear and highlight on speak
- Scene transitions fade properly between locations
- Auto-advance lines play without clicking (prelude, anthem, chants)
- All 18 scenes play in order
- Play reaches "END PLAY"

- [ ] **Step 3: Fix any issues found during playthrough**

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "SCOUTS animated movie — complete cinematic playback"
```
