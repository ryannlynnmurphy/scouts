# SCOUTS Dream Sequences -- Implementation Plan (Plan B of 4)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build 7 interactive dream/memory sequences that replace the current void-spotlight monologues with fully playable mini-worlds, each with unique mechanics embodying how toxic masculinity breaks that specific boy.

**Architecture:** Each dream is its own Phaser Scene class extending a shared `BaseDreamScene` that provides common utilities (interactable objects, dream dialogue, timed exits, fade transitions). The SceneDirector gains a `isDream` flag on scene entries and routes dream entries to their dedicated scenes instead of loading scripts through DialogueManager. Dreams are self-contained -- they do not modify fracture or suspicion.

**Tech Stack:** Phaser 3.80+ (scenes, tweens, input, graphics, text), TypeScript, Howler.js (dream ambient audio)

**Source spec:** `docs/superpowers/specs/2026-04-02-scouts-plans-b-e-design.md` (Plan B section)

---

## File Structure

```
game/
  constants.ts                          -- (modify) Add dream scene keys
  config.ts                             -- (modify) Register 7 new dream scenes
  data/
    types.ts                            -- (modify) Add dream SceneKeys
    scene-order.ts                      -- (modify) Point monologues to dream scenes
  scenes/
    BootScene.ts                        -- (modify) Preload dream placeholder assets
    dreams/
      BaseDreamScene.ts                 -- Shared dream utilities (interactables, dialogue, exit)
      DreamNoahScene.ts                 -- Noah's Room: The Grind
      DreamSimonScene.ts                -- Simon's Sky: Reaching
      DreamLucasScene.ts                -- Lucas's Collection: Disappearing
      DreamJoshScene.ts                 -- Josh's Garage: The Drill
      DreamTheaterScene.ts              -- Simon & Sam: The Performance
      DreamSamScene.ts                  -- Sam's Bedroom: The Prayer
      DreamBrentScene.ts                -- Brent's Empty House: The Cage
  systems/
    SceneDirector.ts                    -- (modify) Route dream entries, add dreamComplete()
    AudioManager.ts                     -- (modify) Add dream ambient keys
```

---

## Task 1: Types, Config, and Dream Routing

**Files:**
- Modify: `game/data/types.ts`
- Modify: `game/config.ts`
- Modify: `game/systems/SceneDirector.ts`
- Modify: `game/data/scene-order.ts`
- Modify: `game/systems/AudioManager.ts`

- [ ] **Step 1: Add dream SceneKeys to types.ts**

Open `game/data/types.ts`. Add the 7 dream scene keys to the `SceneKey` union:

```typescript
export type SceneKey =
  | "CampfireScene"
  | "CliffScene"
  | "MeadowScene"
  | "LakeScene"
  | "VoidScene"
  | "DreamNoahScene"
  | "DreamSimonScene"
  | "DreamLucasScene"
  | "DreamJoshScene"
  | "DreamTheaterScene"
  | "DreamSamScene"
  | "DreamBrentScene";
```

- [ ] **Step 2: Add `isDream` flag to SceneEntry in scene-order.ts**

Open `game/data/scene-order.ts`. Add `isDream` to the interface and update all monologue entries to point to dream scenes:

```typescript
import { SceneKey } from "./types";

export interface SceneEntry {
  scriptId: string;
  location: SceneKey;
  startBeat: string;
  isGayShit?: boolean;
  gayShitAct?: 1 | 2 | 3;
  isDream?: boolean;
}

export const SCENE_ORDER: SceneEntry[] = [
  { scriptId: "scene1-oath", location: "CampfireScene", startBeat: "oath-start" },
  { scriptId: "monologue-noah", location: "DreamNoahScene", startBeat: "noah-start", isDream: true },
  { scriptId: "monologue-simon", location: "DreamSimonScene", startBeat: "simon-mono-start", isDream: true },
  { scriptId: "scene1-sacrifice", location: "CampfireScene", startBeat: "sacrifice-start" },
  { scriptId: "monologue-lucas", location: "DreamLucasScene", startBeat: "lucas-start", isDream: true },
  { scriptId: "scene1-kiss-test", location: "CampfireScene", startBeat: "kiss-test-start" },
  { scriptId: "monologue-josh", location: "DreamJoshScene", startBeat: "josh-start", isDream: true },
  { scriptId: "scene1-pickup-lines", location: "CampfireScene", startBeat: "pickup-start" },
  { scriptId: "scene1-resistance", location: "CampfireScene", startBeat: "resistance-start" },
  { scriptId: "monologue-simon-sam", location: "DreamTheaterScene", startBeat: "simon-sam-start", isDream: true },
  { scriptId: "gay-shit-anthem", location: "CampfireScene", startBeat: "anthem-start" },
  { scriptId: "gay-shit-act1", location: "CliffScene", startBeat: "act1-start", isGayShit: true, gayShitAct: 1 },
  { scriptId: "gay-shit-act2", location: "MeadowScene", startBeat: "act2-start", isGayShit: true, gayShitAct: 2 },
  { scriptId: "gay-shit-act3", location: "LakeScene", startBeat: "act3-start", isGayShit: true, gayShitAct: 3 },
  { scriptId: "monologue-sam", location: "DreamSamScene", startBeat: "sam-mono-start", isDream: true },
  { scriptId: "ceremony", location: "CampfireScene", startBeat: "ceremony-start" },
  { scriptId: "monologue-brent", location: "DreamBrentScene", startBeat: "brent-mono-start", isDream: true },
  { scriptId: "ending", location: "VoidScene", startBeat: "ending-start" },
];
```

- [ ] **Step 3: Update SceneDirector to route dreams**

Open `game/systems/SceneDirector.ts`. Add a `dreamComplete()` method and modify `startCurrentScene()` to skip dialogue loading for dream entries:

At the top of the class, add the public method:

```typescript
/** Called by dream scenes when they finish. Advances to the next scene in SCENE_ORDER. */
dreamComplete(currentScene: Phaser.Scene): void {
  this.advanceToNextScene(currentScene);
}
```

In `startCurrentScene()`, add a dream check right after the Gay Shit healing block (after line ~116 in the current file). Insert before the character sprites setup:

```typescript
// Dream scenes handle their own logic -- just fade in and return
const entry = SCENE_ORDER[this.currentIndex];
if (entry.isDream) {
  if (this.transition) {
    await this.transition.fadeIn(800);
  }
  return; // Dream scene's create() handles everything
}
```

Also change `advanceToNextScene` from `private` to `public` so dream scenes can call it:

```typescript
public async advanceToNextScene(currentScene: Phaser.Scene): Promise<void> {
```

- [ ] **Step 4: Add dream ambient keys to AudioManager**

Open `game/systems/AudioManager.ts`. Add dream ambient keys to the `AmbientKey` type:

```typescript
export type AmbientKey = "forest" | "cliff" | "meadow" | "lake" | "silence"
  | "dream-room" | "dream-sky" | "dream-garage" | "dream-theater" | "dream-bedroom" | "dream-house";
```

In the `init()` method, add dream ambient sources after the existing ambient entries:

```typescript
// Dream ambient loops
const dreamAmbients: Record<string, string> = {
  "dream-room":    "assets/audio/ambience/dream-room.wav",
  "dream-sky":     "assets/audio/ambience/dream-sky.wav",
  "dream-garage":  "assets/audio/ambience/dream-garage.wav",
  "dream-theater": "assets/audio/ambience/dream-theater.wav",
  "dream-bedroom": "assets/audio/ambience/dream-bedroom.wav",
  "dream-house":   "assets/audio/ambience/dream-house.wav",
};

for (const [key, src] of Object.entries(dreamAmbients)) {
  this.ambientLoops.set(
    key,
    new Howl({ src: [src], loop: true, volume: 0, preload: true }),
  );
}
```

- [ ] **Step 5: Commit**

```bash
cd /c/Users/cjpmu/SCOUTS
git add game/data/types.ts game/data/scene-order.ts game/systems/SceneDirector.ts game/systems/AudioManager.ts
git commit -m "feat: dream scene routing -- types, scene order, director, audio keys"
```

---

## Task 2: BaseDreamScene + Placeholder Assets

**Files:**
- Create: `game/scenes/dreams/BaseDreamScene.ts`
- Modify: `game/scenes/BootScene.ts`

- [ ] **Step 1: Create BaseDreamScene**

This is the shared base class for all 7 dream scenes. It provides:
- State restoration from SceneDirector (same pattern as VoidScene)
- Interactable object creation (click targets with hover effects)
- Dream dialogue (simple text display with typewriter, no portrait)
- Timed exit with fade
- Dream-to-campfire transition

Create `game/scenes/dreams/BaseDreamScene.ts`:

```typescript
import Phaser from "phaser";
import { GAME_WIDTH, GAME_HEIGHT } from "../../constants";
import { sceneDirector } from "../../systems/SceneDirector";
import { audioManager } from "../../systems/AudioManager";
import { AmbientKey } from "../../systems/AudioManager";

export interface Interactable {
  gameObject: Phaser.GameObjects.GameObject;
  hoverTint?: number;
  onClick: () => void;
  enabled: boolean;
}

export abstract class BaseDreamScene extends Phaser.Scene {
  protected interactables: Interactable[] = [];
  protected dialogueText: Phaser.GameObjects.Text | null = null;
  protected dialogueBox: Phaser.GameObjects.Graphics | null = null;
  protected isShowingDialogue = false;
  protected overlay: Phaser.GameObjects.Graphics | null = null;
  private typewriterTimer: Phaser.Time.TimerEvent | null = null;
  private dialogueResolve: (() => void) | null = null;

  init(data: any) {
    if (data.fractureState) {
      sceneDirector.fracture.fromJSON(data.fractureState);
    }
    if (data.inventoryState) {
      sceneDirector.inventory.fromJSON(data.inventoryState);
    }
    if (data.suspicionState) {
      sceneDirector.suspicion.fromJSON(data.suspicionState);
    }
  }

  /** Subclasses call this in create() after setting up their scene */
  protected setupDreamUI(): void {
    // Fade overlay (starts black, fades in)
    this.overlay = this.add.graphics().setDepth(500);
    this.overlay.fillStyle(0x000000);
    this.overlay.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    this.overlay.setAlpha(1);

    // Dialogue box at bottom of screen
    this.dialogueBox = this.add.graphics().setDepth(400);
    this.dialogueBox.fillStyle(0x000000, 0.85);
    this.dialogueBox.fillRoundedRect(40, GAME_HEIGHT - 100, GAME_WIDTH - 80, 80, 8);
    this.dialogueBox.setVisible(false);

    // Dialogue text
    this.dialogueText = this.add.text(60, GAME_HEIGHT - 90, "", {
      fontFamily: "Georgia, serif",
      fontSize: "16px",
      color: "#f8f0e3",
      wordWrap: { width: GAME_WIDTH - 120 },
      lineSpacing: 4,
    }).setDepth(401).setVisible(false);
  }

  /** Fade the scene in from black */
  protected fadeIn(duration: number = 1000): Promise<void> {
    return new Promise((resolve) => {
      if (!this.overlay) { resolve(); return; }
      this.tweens.add({
        targets: this.overlay,
        alpha: 0,
        duration,
        ease: "Power2",
        onComplete: () => resolve(),
      });
    });
  }

  /** Fade the scene out to black */
  protected fadeOut(duration: number = 1000): Promise<void> {
    return new Promise((resolve) => {
      if (!this.overlay) { resolve(); return; }
      this.tweens.add({
        targets: this.overlay,
        alpha: 1,
        duration,
        ease: "Power2",
        onComplete: () => resolve(),
      });
    });
  }

  /**
   * Show a line of dream dialogue with typewriter effect.
   * Returns a promise that resolves when the player clicks to dismiss.
   */
  protected showDreamLine(text: string, color: string = "#f8f0e3"): Promise<void> {
    return new Promise((resolve) => {
      if (!this.dialogueText || !this.dialogueBox) { resolve(); return; }

      this.isShowingDialogue = true;
      this.dialogueBox.setVisible(true);
      this.dialogueText.setVisible(true);
      this.dialogueText.setColor(color);
      this.dialogueText.setText("");

      let charIndex = 0;
      const fullText = text;
      let skipped = false;

      this.typewriterTimer = this.time.addEvent({
        delay: 30,
        repeat: fullText.length - 1,
        callback: () => {
          if (skipped) return;
          charIndex++;
          this.dialogueText!.setText(fullText.substring(0, charIndex));
        },
      });

      const clickHandler = () => {
        if (charIndex < fullText.length && !skipped) {
          // Skip to full text
          skipped = true;
          if (this.typewriterTimer) this.typewriterTimer.destroy();
          this.dialogueText!.setText(fullText);
          charIndex = fullText.length;
        } else {
          // Dismiss
          this.input.off("pointerdown", clickHandler);
          this.dialogueBox!.setVisible(false);
          this.dialogueText!.setVisible(false);
          this.isShowingDialogue = false;
          resolve();
        }
      };

      this.input.on("pointerdown", clickHandler);
    });
  }

  /**
   * Show a stage direction (italicized, dimmed).
   */
  protected showStageDirection(text: string): Promise<void> {
    return this.showDreamLine(text, "#a0a0a0");
  }

  /**
   * Show 2-3 choice buttons. Returns the index of the chosen option.
   */
  protected showDreamChoices(options: string[], colors?: string[]): Promise<number> {
    return new Promise((resolve) => {
      const startY = GAME_HEIGHT - 40 - (options.length * 50);
      const buttons: Phaser.GameObjects.Container[] = [];

      options.forEach((text, i) => {
        const btnColor = colors?.[i] ?? "#f8f0e3";
        const y = startY + i * 50;

        const bg = this.add.graphics().setDepth(400);
        bg.fillStyle(0x1a1714, 0.9);
        bg.fillRoundedRect(80, y, GAME_WIDTH - 160, 42, 6);

        const label = this.add.text(GAME_WIDTH / 2, y + 21, text, {
          fontFamily: "Georgia, serif",
          fontSize: "14px",
          color: btnColor,
          wordWrap: { width: GAME_WIDTH - 200 },
          align: "center",
        }).setOrigin(0.5).setDepth(401);

        const hitZone = this.add.zone(GAME_WIDTH / 2, y + 21, GAME_WIDTH - 160, 42)
          .setInteractive({ useHandCursor: true })
          .setDepth(402);

        hitZone.on("pointerover", () => { label.setAlpha(0.7); });
        hitZone.on("pointerout", () => { label.setAlpha(1); });
        hitZone.on("pointerdown", () => {
          // Clean up all buttons
          buttons.forEach((btn) => btn.destroy());
          resolve(i);
        });

        const container = this.add.container(0, 0, [bg, label, hitZone]).setDepth(400);
        buttons.push(container);
      });
    });
  }

  /**
   * Create a clickable interactable object.
   * Returns the Phaser text/image so the dream can track it.
   */
  protected createInteractableRect(
    x: number, y: number, width: number, height: number,
    fillColor: number, label: string, onClick: () => void
  ): { rect: Phaser.GameObjects.Graphics; text: Phaser.GameObjects.Text; zone: Phaser.GameObjects.Zone } {
    const rect = this.add.graphics();
    rect.fillStyle(fillColor, 1);
    rect.fillRoundedRect(x - width / 2, y - height / 2, width, height, 4);

    const text = this.add.text(x, y, label, {
      fontFamily: "Georgia, serif",
      fontSize: "12px",
      color: "#f8f0e3",
      align: "center",
    }).setOrigin(0.5);

    const zone = this.add.zone(x, y, width, height)
      .setInteractive({ useHandCursor: true });

    zone.on("pointerover", () => { text.setAlpha(0.7); });
    zone.on("pointerout", () => { text.setAlpha(1); });
    zone.on("pointerdown", onClick);

    return { rect, text, zone };
  }

  /**
   * Helper: wait for a duration (ms).
   */
  protected wait(ms: number): Promise<void> {
    return new Promise((resolve) => {
      this.time.delayedCall(ms, resolve);
    });
  }

  /** End this dream and return to the play flow. */
  protected async endDream(): Promise<void> {
    audioManager.setAmbient("silence");
    await this.fadeOut(1200);
    sceneDirector.dreamComplete(this);
  }
}
```

- [ ] **Step 2: Add dream placeholder assets to BootScene**

Open `game/scenes/BootScene.ts`. Add dream background preloads after the existing background loading block:

```typescript
// Dream backgrounds (placeholder colored rectangles -- Plan D replaces these)
const dreamBgs = [
  "dream-noah", "dream-simon", "dream-lucas", "dream-josh",
  "dream-theater", "dream-sam", "dream-brent",
];
for (const bg of dreamBgs) {
  this.load.image(`bg-${bg}`, `assets/sprites/backgrounds/${bg}.png`);
}
```

- [ ] **Step 3: Create placeholder dream background images**

Generate 7 colored placeholder PNGs (960x540) so the scenes don't crash on missing textures. These are temporary -- Plan D replaces them.

```bash
cd /c/Users/cjpmu/SCOUTS
mkdir -p public/assets/sprites/backgrounds
# Create minimal placeholder PNGs using Node.js (1x1 colored pixels scaled by Phaser)
node -e "
const fs = require('fs');
// Minimal 1x1 PNG generator (colored pixel)
function png1x1(r, g, b) {
  // Minimal valid PNG: 8-byte header + IHDR + IDAT + IEND
  const { createCanvas } = require('canvas');
  // Fallback: just create empty files that Phaser will fail gracefully on
  return Buffer.alloc(0);
}
// Just touch the files so Phaser's preloader doesn't error fatally
const bgs = ['dream-noah','dream-simon','dream-lucas','dream-josh','dream-theater','dream-sam','dream-brent'];
for (const bg of bgs) {
  const path = 'public/assets/sprites/backgrounds/' + bg + '.png';
  if (!fs.existsSync(path)) {
    // Copy the void background as placeholder if it exists, otherwise create empty
    try {
      fs.copyFileSync('public/assets/sprites/backgrounds/void.png', path);
    } catch(e) {
      fs.writeFileSync(path, '');
    }
  }
}
console.log('Placeholder dream backgrounds created');
"
```

If this fails (no canvas module), just copy the void background manually:

```bash
cd /c/Users/cjpmu/SCOUTS/public/assets/sprites/backgrounds
for bg in dream-noah dream-simon dream-lucas dream-josh dream-theater dream-sam dream-brent; do
  cp void.png "${bg}.png" 2>/dev/null || touch "${bg}.png"
done
```

- [ ] **Step 4: Commit**

```bash
cd /c/Users/cjpmu/SCOUTS
git add game/scenes/dreams/BaseDreamScene.ts game/scenes/BootScene.ts public/assets/sprites/backgrounds/dream-*.png
git commit -m "feat: BaseDreamScene class + placeholder dream backgrounds"
```

---

## Task 3: Dream 1 -- Noah's Room (The Grind)

**Files:**
- Create: `game/scenes/dreams/DreamNoahScene.ts`
- Modify: `game/config.ts`

**Mechanic:** Two zones (desk, XBOX). Studying raises PSAT score but drains warmth. Playing restores warmth but drops score. Room punishes you either way. 90-second timer, then exit.

- [ ] **Step 1: Create DreamNoahScene.ts**

Create `game/scenes/dreams/DreamNoahScene.ts`:

```typescript
import Phaser from "phaser";
import { BaseDreamScene } from "./BaseDreamScene";
import { GAME_WIDTH, GAME_HEIGHT } from "../../constants";
import { audioManager } from "../../systems/AudioManager";

/**
 * Noah's Room: The Grind
 *
 * Two interactable zones -- desk (study) and XBOX (play).
 * Studying raises PSAT score, drains room warmth/color.
 * Playing XBOX restores warmth, drops PSAT score.
 * You can't do both. The room punishes you either way.
 * After ~90 seconds, the room freezes and Noah exits.
 */
export class DreamNoahScene extends BaseDreamScene {
  private psatScore = 1200;
  private warmth = 0.5; // 0 = clinical cold, 1 = full warmth
  private roomTint!: Phaser.GameObjects.Graphics;
  private psatText!: Phaser.GameObjects.Text;
  private momText!: Phaser.GameObjects.Text;
  private activity: "idle" | "studying" | "playing" = "idle";
  private activityTimer: Phaser.Time.TimerEvent | null = null;
  private dreamTimer: Phaser.Time.TimerEvent | null = null;
  private frozen = false;

  constructor() {
    super({ key: "DreamNoahScene" });
  }

  create() {
    // Background
    this.cameras.main.setBackgroundColor("#2a2420");
    if (this.textures.exists("bg-dream-noah")) {
      this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, "bg-dream-noah")
        .setDisplaySize(GAME_WIDTH, GAME_HEIGHT);
    }

    // Room warmth overlay (tints the whole scene)
    this.roomTint = this.add.graphics().setDepth(50);
    this.updateRoomTint();

    // PSAT score on the wall
    this.psatText = this.add.text(GAME_WIDTH - 120, 60, `PSAT: ${this.psatScore}`, {
      fontFamily: "Georgia, serif",
      fontSize: "20px",
      color: "#d4a44a",
      fontStyle: "bold",
    }).setOrigin(0.5).setDepth(100);

    // Mom's voice (text that fades in/out)
    this.momText = this.add.text(GAME_WIDTH / 2, 40, "", {
      fontFamily: "Georgia, serif",
      fontSize: "13px",
      color: "#f8f0e3",
      fontStyle: "italic",
      align: "center",
    }).setOrigin(0.5).setAlpha(0).setDepth(100);

    // --- Interactable: Desk (left side) ---
    const desk = this.createInteractableRect(
      260, 320, 180, 120, 0x4a3a2a, "DESK\n[Study]",
      () => this.startStudying()
    );

    // --- Interactable: XBOX (right side) ---
    const xbox = this.createInteractableRect(
      680, 380, 140, 80, 0x2a6a2a, "XBOX\n[Play]",
      () => this.startPlaying()
    );

    // Window (dark, non-interactive visual element)
    const window = this.add.graphics();
    window.fillStyle(0x0a0a1a, 1);
    window.fillRect(420, 80, 120, 100);
    window.lineStyle(2, 0x6a5a4a);
    window.strokeRect(420, 80, 120, 100);

    // Door crack with mom silhouette hint
    const door = this.add.graphics();
    door.fillStyle(0x3a3020, 1);
    door.fillRect(0, 100, 15, 300);

    // Setup dream UI (overlay, dialogue box)
    this.setupDreamUI();

    // Set ambient
    audioManager.setAmbient("dream-room");

    // Start the dream
    this.startDream();
  }

  private async startDream(): Promise<void> {
    await this.fadeIn(1500);

    await this.showStageDirection("(Noah's bedroom. Warm light. A desk piled with books. An XBOX on the floor, its power light glowing orange.)");
    await this.showStageDirection("(Mom's voice drifts from another room. The PSAT score on the wall reads 1200.)");

    // Start the 90-second dream timer
    this.dreamTimer = this.time.delayedCall(90000, () => {
      this.freezeRoom();
    });

    // Periodic mom voice
    this.time.addEvent({
      delay: 12000,
      loop: true,
      callback: () => this.showMomVoice(),
    });
  }

  private startStudying(): void {
    if (this.frozen || this.isShowingDialogue) return;
    if (this.activity === "studying") return;

    this.activity = "studying";
    if (this.activityTimer) this.activityTimer.destroy();

    this.activityTimer = this.time.addEvent({
      delay: 2000,
      loop: true,
      callback: () => {
        if (this.frozen) return;
        // Score climbs
        this.psatScore = Math.min(1600, this.psatScore + 20);
        this.psatText.setText(`PSAT: ${this.psatScore}`);

        // Room gets colder
        this.warmth = Math.max(0, this.warmth - 0.06);
        this.updateRoomTint();
        this.updateMomDistance();
      },
    });
  }

  private startPlaying(): void {
    if (this.frozen || this.isShowingDialogue) return;
    if (this.activity === "playing") return;

    this.activity = "playing";
    if (this.activityTimer) this.activityTimer.destroy();

    // Show notification on first play
    this.showNotification("noah ur gonna waste ur potential");

    this.activityTimer = this.time.addEvent({
      delay: 2000,
      loop: true,
      callback: () => {
        if (this.frozen) return;
        // Score drops
        this.psatScore = Math.max(800, this.psatScore - 15);
        this.psatText.setText(`PSAT: ${this.psatScore}`);

        // Room gets warmer
        this.warmth = Math.min(1, this.warmth + 0.08);
        this.updateRoomTint();
        this.updateMomDistance();
      },
    });
  }

  private updateRoomTint(): void {
    this.roomTint.clear();
    // Warm = amber tint. Cold = blue-white tint.
    if (this.warmth < 0.5) {
      // Cold: blue overlay increases
      const coldAlpha = (0.5 - this.warmth) * 0.5;
      this.roomTint.fillStyle(0x4060a0, coldAlpha);
      this.roomTint.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    } else {
      // Warm: amber overlay
      const warmAlpha = (this.warmth - 0.5) * 0.25;
      this.roomTint.fillStyle(0xd4a44a, warmAlpha);
      this.roomTint.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    }
  }

  private updateMomDistance(): void {
    // Mom's voice proximity tracks warmth
    // High warmth = mom feels close, low warmth = distant
    const momAlpha = this.warmth * 0.8;
    this.momText.setAlpha(momAlpha);
  }

  private showMomVoice(): void {
    if (this.frozen) return;
    const phrases = this.warmth > 0.5
      ? ["Noah, honey, dinner's almost ready.", "Are you having fun up there?", "Love you, sweetie."]
      : ["Noah, are you studying?", "Your father and I expect results.", "Don't waste your potential."];
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];
    this.momText.setText(phrase);
    this.tweens.add({
      targets: this.momText,
      alpha: this.warmth * 0.8,
      duration: 500,
      yoyo: true,
      hold: 3000,
    });
  }

  private showNotification(text: string): void {
    const notif = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 140, text, {
      fontFamily: "Courier New, monospace",
      fontSize: "12px",
      color: "#ff6666",
      backgroundColor: "#1a1714",
      padding: { x: 8, y: 4 },
    }).setOrigin(0.5).setDepth(200).setAlpha(0);

    this.tweens.add({
      targets: notif,
      alpha: 1,
      duration: 300,
      yoyo: true,
      hold: 2500,
      onComplete: () => notif.destroy(),
    });
  }

  private async freezeRoom(): Promise<void> {
    this.frozen = true;
    if (this.activityTimer) this.activityTimer.destroy();

    // Room freezes -- everything stops
    this.tweens.killAll();

    await this.wait(1000);
    await this.showDreamLine("I got a 1400 on my PSAT. No bitches though.", "#d4a44a");
    await this.wait(800);

    await this.endDream();
  }
}
```

- [ ] **Step 2: Register DreamNoahScene in config.ts**

Open `game/config.ts`. Add the import and registration:

```typescript
import { DreamNoahScene } from "./scenes/dreams/DreamNoahScene";
```

Add `DreamNoahScene` to the scene array:

```typescript
scene: [BootScene, CampfireScene, CliffScene, MeadowScene, LakeScene, VoidScene, DreamNoahScene],
```

- [ ] **Step 3: Verify the build compiles**

```bash
cd /c/Users/cjpmu/SCOUTS
npm run build
```

Expected: Compiles with no TypeScript errors.

- [ ] **Step 4: Commit**

```bash
cd /c/Users/cjpmu/SCOUTS
git add game/scenes/dreams/DreamNoahScene.ts game/config.ts
git commit -m "feat: Dream 1 -- Noah's Room (The Grind)"
```

---

## Task 4: Dream 2 -- Simon's Sky (Reaching)

**Files:**
- Create: `game/scenes/dreams/DreamSimonScene.ts`
- Modify: `game/config.ts`

**Mechanic:** Beautiful things drift past. Click to catch them. Then the red truck. After the truck, catching things makes FAGGOT pulse brighter. Ends with a 3-way choice.

- [ ] **Step 1: Create DreamSimonScene.ts**

Create `game/scenes/dreams/DreamSimonScene.ts`:

```typescript
import Phaser from "phaser";
import { BaseDreamScene } from "./BaseDreamScene";
import { GAME_WIDTH, GAME_HEIGHT } from "../../constants";
import { audioManager } from "../../systems/AudioManager";

interface DriftingThing {
  text: Phaser.GameObjects.Text;
  speed: number;
  kind: string;
}

/**
 * Simon's Sky: Reaching
 *
 * Beautiful things (dolphins, mermaids, butterflies) drift past.
 * Click to catch them -- warmth fills. Then the red truck comes.
 * After: catching things makes the word FAGGOT pulse brighter.
 * Ends with the strawberry/tomato choice.
 */
export class DreamSimonScene extends BaseDreamScene {
  private drifters: DriftingThing[] = [];
  private warmth = 0;
  private truckHasCome = false;
  private faggotText!: Phaser.GameObjects.Text;
  private faggotAlpha = 0;
  private spawnTimer: Phaser.Time.TimerEvent | null = null;
  private reachPhaseComplete = false;

  constructor() {
    super({ key: "DreamSimonScene" });
  }

  create() {
    // Pastel sky gradient background
    this.cameras.main.setBackgroundColor("#c4a0d8");
    if (this.textures.exists("bg-dream-simon")) {
      this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, "bg-dream-simon")
        .setDisplaySize(GAME_WIDTH, GAME_HEIGHT);
    }

    // Hidden FAGGOT text (appears after truck)
    this.faggotText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, "", {
      fontFamily: "Impact, sans-serif",
      fontSize: "72px",
      color: "#ff2222",
      fontStyle: "bold",
    }).setOrigin(0.5).setAlpha(0).setDepth(50);

    this.setupDreamUI();
    audioManager.setAmbient("dream-sky");

    this.startDream();
  }

  private async startDream(): Promise<void> {
    await this.fadeIn(1500);

    await this.showStageDirection("(Open sky. Pastels. Dolphins, mermaids, butterflies swimming through the air.)");
    await this.showStageDirection("(Reach for them.)");

    // Start spawning beautiful things
    this.spawnTimer = this.time.addEvent({
      delay: 1800,
      loop: true,
      callback: () => this.spawnDrifter(),
    });

    // Spawn a few immediately
    this.spawnDrifter();
    this.time.delayedCall(400, () => this.spawnDrifter());
    this.time.delayedCall(800, () => this.spawnDrifter());

    // After ~25 seconds of catching, the truck comes
    this.time.delayedCall(25000, () => {
      if (!this.reachPhaseComplete) this.triggerTruck();
    });
  }

  private spawnDrifter(): void {
    if (this.reachPhaseComplete) return;

    const kinds = ["🐬", "🧜‍♀️", "🦋", "✨", "🌊"];
    const kind = kinds[Math.floor(Math.random() * kinds.length)];
    const y = 80 + Math.random() * (GAME_HEIGHT - 200);
    const speed = 0.3 + Math.random() * 0.5;
    const startX = GAME_WIDTH + 30;

    const text = this.add.text(startX, y, kind, {
      fontSize: "32px",
    }).setDepth(100).setInteractive({ useHandCursor: true });

    const drifter: DriftingThing = { text, speed, kind };
    this.drifters.push(drifter);

    // Float from right to left
    this.tweens.add({
      targets: text,
      x: -40,
      duration: (GAME_WIDTH + 70) / speed * 16,
      ease: "Linear",
      onComplete: () => {
        text.destroy();
        this.drifters = this.drifters.filter((d) => d !== drifter);
      },
    });

    // Gentle bobbing
    this.tweens.add({
      targets: text,
      y: y + (Math.random() * 30 - 15),
      duration: 2000 + Math.random() * 1000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Click to catch
    text.on("pointerdown", () => {
      if (this.truckHasCome) {
        // After truck: catching makes FAGGOT pulse
        this.faggotAlpha = Math.min(1, this.faggotAlpha + 0.12);
        this.faggotText.setAlpha(this.faggotAlpha);
        this.tweens.add({
          targets: this.faggotText,
          scaleX: 1.1,
          scaleY: 1.1,
          duration: 150,
          yoyo: true,
        });
        // Thing flinches away faster
        this.tweens.add({
          targets: text,
          y: text.y - 60,
          alpha: 0,
          duration: 400,
          onComplete: () => text.destroy(),
        });
      } else {
        // Before truck: catching feels good
        this.warmth = Math.min(1, this.warmth + 0.1);
        this.tweens.add({
          targets: text,
          scaleX: 1.5,
          scaleY: 1.5,
          alpha: 0,
          duration: 300,
          onComplete: () => text.destroy(),
        });
      }
      this.drifters = this.drifters.filter((d) => d.text !== text);
    });
  }

  private async triggerTruck(): Promise<void> {
    // Stop spawning briefly
    if (this.spawnTimer) this.spawnTimer.destroy();

    // Scatter all current drifters
    this.drifters.forEach((d) => {
      this.tweens.add({
        targets: d.text,
        y: d.text.y - 200,
        alpha: 0,
        duration: 500,
      });
    });

    // Red truck text tears across the screen
    const truck = this.add.text(-200, GAME_HEIGHT / 2, "🚛", {
      fontSize: "64px",
    }).setDepth(200);

    this.tweens.add({
      targets: truck,
      x: GAME_WIDTH + 200,
      duration: 1500,
      ease: "Power1",
      onComplete: () => truck.destroy(),
    });

    // FAGGOT appears letter by letter
    await this.wait(600);
    const letters = "FAGGOT";
    for (let i = 0; i < letters.length; i++) {
      await this.wait(200);
      this.faggotText.setText(letters.substring(0, i + 1));
      this.faggotText.setAlpha(0.6);
    }

    this.truckHasCome = true;

    // Resume spawning -- things come back but flinch
    await this.wait(1500);
    this.spawnTimer = this.time.addEvent({
      delay: 2200,
      loop: true,
      callback: () => this.spawnDrifter(),
    });

    // After 20 more seconds of post-truck play, show the choice
    this.time.delayedCall(20000, () => this.showFinalChoice());
  }

  private async showFinalChoice(): Promise<void> {
    this.reachPhaseComplete = true;
    if (this.spawnTimer) this.spawnTimer.destroy();

    // Clear remaining drifters
    this.drifters.forEach((d) => {
      this.tweens.add({ targets: d.text, alpha: 0, duration: 500, onComplete: () => d.text.destroy() });
    });

    await this.wait(1000);
    await this.showDreamLine("And these guys passed me. It was this big red truck...", "#d4a0d0");

    const choice = await this.showDreamChoices([
      "They screamed FAGGOT. And... I think I am one.",
      "They screamed FAGGOT. But whatever. It doesn't bother me.",
      "They screamed FAGGOT. I don't want to think about it.",
    ], ["#d4a0d0", "#a0a0a0", "#808080"]);

    if (choice === 0) {
      // Authentic: beautiful things return, come to Simon
      this.faggotText.setAlpha(0);
      for (let i = 0; i < 5; i++) {
        const kinds = ["🐬", "🧜‍♀️", "🦋"];
        const t = this.add.text(
          Math.random() * GAME_WIDTH,
          Math.random() * GAME_HEIGHT,
          kinds[i % kinds.length],
          { fontSize: "32px" }
        ).setDepth(100);
        this.tweens.add({
          targets: t,
          x: GAME_WIDTH / 2 + (Math.random() * 60 - 30),
          y: GAME_HEIGHT / 2 + (Math.random() * 60 - 30),
          duration: 1500,
          ease: "Sine.easeInOut",
        });
      }
      await this.wait(2500);
    } else if (choice === 1) {
      // Performed: things freeze mid-air, lifeless
      await this.showStageDirection("(Everything freezes. Lifeless. Suspended.)");
      await this.wait(1500);
    } else {
      // Deflect: everything drifts away
      await this.showStageDirection("(Everything slowly drifts away. The sky empties.)");
      await this.wait(1500);
    }

    await this.endDream();
  }
}
```

- [ ] **Step 2: Register in config.ts**

Add import and scene registration:

```typescript
import { DreamSimonScene } from "./scenes/dreams/DreamSimonScene";
```

Add `DreamSimonScene` to the scene array after `DreamNoahScene`.

- [ ] **Step 3: Verify build**

```bash
cd /c/Users/cjpmu/SCOUTS && npm run build
```

- [ ] **Step 4: Commit**

```bash
cd /c/Users/cjpmu/SCOUTS
git add game/scenes/dreams/DreamSimonScene.ts game/config.ts
git commit -m "feat: Dream 2 -- Simon's Sky (Reaching)"
```

---

## Task 5: Dream 3 -- Lucas's Collection (Disappearing)

**Files:**
- Create: `game/scenes/dreams/DreamLucasScene.ts`
- Modify: `game/config.ts`

**Mechanic:** Room full of things Lucas loves. Examine them to hear him talk about them. After examination, a mocking voice plays and the item vanishes. "Masculine" items survive. The room shrinks as items disappear.

- [ ] **Step 1: Create DreamLucasScene.ts**

Create `game/scenes/dreams/DreamLucasScene.ts`:

```typescript
import Phaser from "phaser";
import { BaseDreamScene } from "./BaseDreamScene";
import { GAME_WIDTH, GAME_HEIGHT } from "../../constants";
import { audioManager } from "../../systems/AudioManager";

interface CollectionItem {
  name: string;
  label: string;
  x: number;
  y: number;
  color: number;
  description: string; // What Lucas says about it
  mockLine: string;    // What the mocking voice says
  survives: boolean;   // "Masculine" items survive examination
  examined: boolean;
  destroyed: boolean;
  rect?: Phaser.GameObjects.Graphics;
  text?: Phaser.GameObjects.Text;
  zone?: Phaser.GameObjects.Zone;
  dustOutline?: Phaser.GameObjects.Graphics;
}

/**
 * Lucas's Collection: Disappearing
 *
 * A room full of things Lucas loves. Examine them to hear him talk.
 * After examining, items may vanish. The mocking voice: "That's weird, bro."
 * The room shrinks as items disappear. Protecting items = silence.
 */
export class DreamLucasScene extends BaseDreamScene {
  private items: CollectionItem[] = [];
  private wallLeft = 40;
  private wallRight = GAME_WIDTH - 40;
  private wallTop = 60;
  private wallBottom = GAME_HEIGHT - 120;
  private lastExaminedItem: string = "";

  constructor() {
    super({ key: "DreamLucasScene" });
  }

  create() {
    this.cameras.main.setBackgroundColor("#2a3428");
    if (this.textures.exists("bg-dream-lucas")) {
      this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, "bg-dream-lucas")
        .setDisplaySize(GAME_WIDTH, GAME_HEIGHT);
    }

    // Define collection items
    this.items = [
      {
        name: "dinosaur", label: "🦕 Dino\nFigures", x: 120, y: 120,
        color: 0x5a9a5a, survives: false, examined: false, destroyed: false,
        description: "These are my T-Rex and Triceratops. Did you know the T-Rex had feathers? Most people don't know that. I think feathers are cool.",
        mockLine: "Dude, dinosaurs? What are you, five?",
      },
      {
        name: "bugs", label: "🐛 Bug\nTerrarium", x: 350, y: 130,
        color: 0x4a8a6a, survives: false, examined: false, destroyed: false,
        description: "This is my beetle collection. I caught every one myself. The blue one is a jewel beetle -- they're actually iridescent. Nature is insane.",
        mockLine: "That's so weird, bro. You collect BUGS?",
      },
      {
        name: "butterflies", label: "🦋 Butterfly\nPoster", x: 580, y: 110,
        color: 0x9a6aaa, survives: false, examined: false, destroyed: false,
        description: "Butterflies are basically just beautiful bugs. I drew all of these myself. The Monarch migrates 3,000 miles. THREE THOUSAND.",
        mockLine: "That's kinda gay.",
      },
      {
        name: "spiderman", label: "🕷️ Spider-Man\nPoster", x: 780, y: 120,
        color: 0xaa3030, survives: true, examined: false, destroyed: false,
        description: "Spider-Man is the greatest superhero because he's just a regular guy. He gets nervous around MJ just like I get nervous around... everyone.",
        mockLine: "",
      },
      {
        name: "memes", label: "📱 Meme\nPrintouts", x: 200, y: 300,
        color: 0x8a8a4a, survives: false, examined: false, destroyed: false,
        description: "I print out the ones that make me actually laugh. My mom thinks it's a waste of ink but comedy is art.",
        mockLine: "Why do you print memes? That's weird.",
      },
      {
        name: "flowers", label: "🌸 Pressed\nFlowers", x: 470, y: 280,
        color: 0xd490a0, survives: false, examined: false, destroyed: false,
        description: "I pressed these at camp last summer. This one's a wildflower. I don't know the name but I liked the color.",
        mockLine: "Flowers? Really? What are you, someone's girlfriend?",
      },
      {
        name: "weights", label: "🏋️ Dad's\nWeights", x: 700, y: 310,
        color: 0x6a6a6a, survives: true, examined: false, destroyed: false,
        description: "These are my dad's. He said I should start lifting. They're really heavy. I can kind of do one curl if I use both hands.",
        mockLine: "",
      },
    ];

    // Render all items
    this.items.forEach((item) => this.renderItem(item));

    this.setupDreamUI();
    audioManager.setAmbient("silence");

    this.startDream();
  }

  private renderItem(item: CollectionItem): void {
    const w = 120;
    const h = 80;

    item.rect = this.add.graphics();
    item.rect.fillStyle(item.color, 1);
    item.rect.fillRoundedRect(item.x - w / 2, item.y - h / 2, w, h, 6);

    item.text = this.add.text(item.x, item.y, item.label, {
      fontFamily: "Georgia, serif",
      fontSize: "12px",
      color: "#f8f0e3",
      align: "center",
    }).setOrigin(0.5);

    item.zone = this.add.zone(item.x, item.y, w, h)
      .setInteractive({ useHandCursor: true });

    item.zone.on("pointerover", () => { if (item.text) item.text.setAlpha(0.7); });
    item.zone.on("pointerout", () => { if (item.text) item.text.setAlpha(1); });
    item.zone.on("pointerdown", () => this.examineItem(item));
  }

  private async startDream(): Promise<void> {
    await this.fadeIn(1500);
    await this.showStageDirection("(Lucas's room. Every surface covered. Dinosaurs, bugs, memes, flowers, posters. Everything he loves, displayed proudly.)");
    await this.showStageDirection("(Examine them.)");
  }

  private async examineItem(item: CollectionItem): Promise<void> {
    if (item.examined || item.destroyed || this.isShowingDialogue) return;
    item.examined = true;
    this.lastExaminedItem = item.name;

    // Lucas talks about it
    await this.showDreamLine(item.description, "#5a9a8a");

    if (!item.survives) {
      // Mocking voice
      await this.wait(400);
      await this.showDreamLine(item.mockLine, "#aa4444");

      // Item vanishes
      item.destroyed = true;
      if (item.zone) item.zone.disableInteractive();

      // Shrink and fade
      if (item.text && item.rect) {
        this.tweens.add({ targets: item.text, alpha: 0, scaleX: 0.3, scaleY: 0.3, duration: 800 });
        this.tweens.add({
          targets: item.rect,
          alpha: 0,
          duration: 800,
          onComplete: () => {
            // Leave dust outline
            item.dustOutline = this.add.graphics();
            item.dustOutline.lineStyle(1, 0x5a5a4a, 0.3);
            item.dustOutline.strokeRoundedRect(item.x - 60, item.y - 40, 120, 80, 6);
          },
        });
      }

      // Walls close in
      this.wallLeft += 15;
      this.wallRight -= 15;
      this.shrinkRoom();

      // Check if all non-surviving items are destroyed
      this.checkEnd();
    } else {
      // Item survives -- it stays
      await this.showStageDirection("(It stays.)");
    }
  }

  private shrinkRoom(): void {
    // Darken the edges to simulate walls closing in
    const edgeLeft = this.add.graphics().setDepth(30);
    edgeLeft.fillStyle(0x000000, 0.7);
    edgeLeft.fillRect(0, 0, this.wallLeft, GAME_HEIGHT);

    const edgeRight = this.add.graphics().setDepth(30);
    edgeRight.fillStyle(0x000000, 0.7);
    edgeRight.fillRect(this.wallRight, 0, GAME_WIDTH - this.wallRight, GAME_HEIGHT);
  }

  private async checkEnd(): Promise<void> {
    const destroyedCount = this.items.filter((i) => i.destroyed).length;
    const destroyable = this.items.filter((i) => !i.survives).length;

    if (destroyedCount >= destroyable) {
      // All non-masculine items gone
      await this.wait(1200);
      await this.showStageDirection("(The room is mostly empty. Dust outlines on the shelves where things used to be.)");

      // Lucas picks up whatever was examined last
      const lastItem = this.items.find((i) => i.name === this.lastExaminedItem);
      const itemName = lastItem ? lastItem.label.replace(/\n/g, " ").replace(/[^\w\s]/g, "").trim() : "something";

      await this.showDreamLine(`I think it's about serving women.`, "#5a9a8a");
      await this.wait(800);

      await this.endDream();
    }
  }
}
```

- [ ] **Step 2: Register in config.ts**

Add import and scene:

```typescript
import { DreamLucasScene } from "./scenes/dreams/DreamLucasScene";
```

Add `DreamLucasScene` to the scene array.

- [ ] **Step 3: Verify build**

```bash
cd /c/Users/cjpmu/SCOUTS && npm run build
```

- [ ] **Step 4: Commit**

```bash
cd /c/Users/cjpmu/SCOUTS
git add game/scenes/dreams/DreamLucasScene.ts game/config.ts
git commit -m "feat: Dream 3 -- Lucas's Collection (Disappearing)"
```

---

## Task 6: Dream 4 -- Josh's Garage (The Drill)

**Files:**
- Create: `game/scenes/dreams/DreamJoshScene.ts`
- Modify: `game/config.ts`

**Mechanic:** Button-mash pushups. Stop = dad's voice. Keep going = body breaks. Pizza is unreachable. Belt resets you. Recruitment poster is the only escape.

- [ ] **Step 1: Create DreamJoshScene.ts**

Create `game/scenes/dreams/DreamJoshScene.ts`:

```typescript
import Phaser from "phaser";
import { BaseDreamScene } from "./BaseDreamScene";
import { GAME_WIDTH, GAME_HEIGHT } from "../../constants";
import { audioManager } from "../../systems/AudioManager";

/**
 * Josh's Garage: The Drill
 *
 * Button mash to do pushups. Counter climbs. Stop = dad yells.
 * Keep going = screen tunnels. Pizza unreachable. Belt = flinch + reset.
 * Recruitment poster = brief brightness. Ends when Josh collapses
 * or endures dad's voice for 10 seconds.
 */
export class DreamJoshScene extends BaseDreamScene {
  private pushupCount = 0;
  private countText!: Phaser.GameObjects.Text;
  private dadText!: Phaser.GameObjects.Text;
  private tunnel!: Phaser.GameObjects.Graphics;
  private tunnelStrength = 0;
  private lastMashTime = 0;
  private idleTime = 0;
  private dadSpeaking = false;
  private collapsed = false;
  private mashZone!: Phaser.GameObjects.Zone;
  private mashPrompt!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: "DreamJoshScene" });
  }

  create() {
    this.cameras.main.setBackgroundColor("#1a1a18");
    if (this.textures.exists("bg-dream-josh")) {
      this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, "bg-dream-josh")
        .setDisplaySize(GAME_WIDTH, GAME_HEIGHT);
    }

    // Pushup counter
    this.countText = this.add.text(GAME_WIDTH / 2, 60, "0", {
      fontFamily: "Impact, sans-serif",
      fontSize: "48px",
      color: "#8a9a5a",
    }).setOrigin(0.5).setDepth(100);

    // Dad's voice text (top)
    this.dadText = this.add.text(GAME_WIDTH / 2, 30, "", {
      fontFamily: "Georgia, serif",
      fontSize: "14px",
      color: "#cc6644",
      fontStyle: "italic",
      align: "center",
    }).setOrigin(0.5).setAlpha(0).setDepth(100);

    // Tunnel vision overlay
    this.tunnel = this.add.graphics().setDepth(60);

    // --- Interactable: Mash zone (center -- the pushup area) ---
    this.mashPrompt = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 40, "[ CLICK TO DO PUSHUPS ]", {
      fontFamily: "Georgia, serif",
      fontSize: "16px",
      color: "#f8f0e3",
    }).setOrigin(0.5).setDepth(100);

    this.mashZone = this.add.zone(GAME_WIDTH / 2, GAME_HEIGHT / 2, 400, 200)
      .setInteractive({ useHandCursor: true }).setDepth(101);

    this.mashZone.on("pointerdown", () => this.doPushup());

    // --- Interactable: Pizza (bottom-right) ---
    this.createInteractableRect(
      800, 420, 100, 60, 0x8a6a3a, "🍕 Pizza",
      () => this.touchPizza()
    );

    // --- Interactable: Belt (left side) ---
    this.createInteractableRect(
      80, 250, 50, 100, 0x5a4030, "Belt",
      () => this.touchBelt()
    );

    // --- Interactable: Recruitment poster (top-right) ---
    this.createInteractableRect(
      820, 120, 120, 80, 0x3a3a8a, "🇺🇸 MARINES\nRecruit",
      () => this.touchPoster()
    );

    this.setupDreamUI();
    audioManager.setAmbient("dream-garage");

    // Idle check timer
    this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => this.checkIdle(),
    });

    this.startDream();
  }

  private async startDream(): Promise<void> {
    await this.fadeIn(1500);
    await this.showStageDirection("(A garage. Cold fluorescent light. Concrete floor. A punching bag. Dad's belt on a hook by the door.)");
    await this.showStageDirection("(Do pushups.)");
    this.lastMashTime = this.time.now;
  }

  private doPushup(): void {
    if (this.collapsed || this.isShowingDialogue) return;

    this.pushupCount++;
    this.countText.setText(`${this.pushupCount}`);
    this.lastMashTime = this.time.now;
    this.idleTime = 0;
    this.dadSpeaking = false;
    this.dadText.setAlpha(0);

    // Bounce animation on counter
    this.tweens.add({
      targets: this.countText,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 80,
      yoyo: true,
    });

    // Mash prompt pulses
    this.tweens.add({
      targets: this.mashPrompt,
      alpha: 0.4,
      duration: 60,
      yoyo: true,
    });

    // Tunnel vision increases with count
    this.tunnelStrength = Math.min(0.8, this.pushupCount / 100);
    this.updateTunnel();

    // Collapse at 80 pushups
    if (this.pushupCount >= 80) {
      this.collapse();
    }
  }

  private updateTunnel(): void {
    this.tunnel.clear();
    if (this.tunnelStrength <= 0) return;

    // Vignette effect -- black edges closing in
    const s = this.tunnelStrength;
    const edgeW = s * 120;
    const edgeH = s * 80;

    this.tunnel.fillStyle(0x000000, s * 0.7);
    this.tunnel.fillRect(0, 0, edgeW, GAME_HEIGHT);
    this.tunnel.fillRect(GAME_WIDTH - edgeW, 0, edgeW, GAME_HEIGHT);
    this.tunnel.fillRect(0, 0, GAME_WIDTH, edgeH);
    this.tunnel.fillRect(0, GAME_HEIGHT - edgeH, GAME_WIDTH, edgeH);
  }

  private checkIdle(): void {
    if (this.collapsed || this.isShowingDialogue) return;

    const elapsed = this.time.now - this.lastMashTime;
    if (elapsed > 2000) {
      this.idleTime += 1;
      this.showDadVoice();

      // If idle for 10 seconds, end
      if (this.idleTime >= 10) {
        this.endureAndExit();
      }
    }
  }

  private showDadVoice(): void {
    if (this.dadSpeaking) return;
    this.dadSpeaking = true;

    const phrases = [
      "GET UP.", "YOU'RE SOFT.", "MY SON ISN'T A QUITTER.",
      "YOUR MOTHER RAISED A QUITTER.", "PUSH. THROUGH. IT.",
      "YOU THINK THE MARINES TAKE QUITTERS?",
    ];
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];
    this.dadText.setText(phrase);
    this.tweens.add({
      targets: this.dadText,
      alpha: 1,
      duration: 300,
      hold: 2000,
      yoyo: true,
      onComplete: () => { this.dadSpeaking = false; },
    });

    // Belt swings slightly
    // (visual hint -- the belt object gets a subtle rotation tween)
  }

  private async touchPizza(): Promise<void> {
    if (this.collapsed || this.isShowingDialogue) return;
    await this.showDreamLine("Real men don't eat when they're training.", "#cc6644");
    await this.showDreamLine("You want to be fat like your mother?", "#cc6644");
  }

  private async touchBelt(): Promise<void> {
    if (this.collapsed || this.isShowingDialogue) return;
    // Josh flinches. No dialogue. Just a flinch.
    this.cameras.main.shake(200, 0.005);
    this.pushupCount = 0;
    this.countText.setText("0");
    this.tunnelStrength = 0;
    this.updateTunnel();
  }

  private async touchPoster(): Promise<void> {
    if (this.collapsed || this.isShowingDialogue) return;
    // Brief brightness
    this.cameras.main.flash(300, 255, 255, 255, false);
    await this.showDreamLine("Eagle Scout. Then Marines. Then maybe dad will...", "#8a9a5a");
    // Sentence never finishes
  }

  private async collapse(): Promise<void> {
    this.collapsed = true;
    this.mashZone.disableInteractive();

    this.cameras.main.shake(500, 0.01);
    this.mashPrompt.setText("[ COLLAPSED ]");
    this.mashPrompt.setColor("#aa4444");

    await this.wait(1500);
    await this.showDreamLine("I'm gonna be a Marine. That's not... that's not nothing.", "#8a9a5a");
    await this.wait(800);
    await this.endDream();
  }

  private async endureAndExit(): Promise<void> {
    this.collapsed = true;
    this.mashZone.disableInteractive();

    await this.wait(500);
    await this.showDreamLine("I'm gonna be a Marine. That's not... that's not nothing.", "#8a9a5a");
    await this.wait(800);
    await this.endDream();
  }
}
```

- [ ] **Step 2: Register in config.ts**

Add import and scene:

```typescript
import { DreamJoshScene } from "./scenes/dreams/DreamJoshScene";
```

Add `DreamJoshScene` to the scene array.

- [ ] **Step 3: Verify build**

```bash
cd /c/Users/cjpmu/SCOUTS && npm run build
```

- [ ] **Step 4: Commit**

```bash
cd /c/Users/cjpmu/SCOUTS
git add game/scenes/dreams/DreamJoshScene.ts game/config.ts
git commit -m "feat: Dream 4 -- Josh's Garage (The Drill)"
```

---

## Task 7: Dream 5 -- Simon & Sam: The Performance (Theater)

**Files:**
- Create: `game/scenes/dreams/DreamTheaterScene.ts`
- Modify: `game/config.ts`

**Mechanic:** A liminal theater. Props (mask, mirror, script) that explore authenticity vs. performance. Sam breaks the fourth wall. Ends with the identity choice.

- [ ] **Step 1: Create DreamTheaterScene.ts**

Create `game/scenes/dreams/DreamTheaterScene.ts`:

```typescript
import Phaser from "phaser";
import { BaseDreamScene } from "./BaseDreamScene";
import { GAME_WIDTH, GAME_HEIGHT } from "../../constants";
import { audioManager } from "../../systems/AudioManager";

/**
 * Simon & Sam -- The Performance
 *
 * A theater stage. Three props: MASK, MIRROR, SCRIPT.
 * Each explores authenticity vs performance.
 * Sam breaks the fourth wall. Ends with the identity choice.
 */
export class DreamTheaterScene extends BaseDreamScene {
  private maskUsed = false;
  private mirrorUsed = false;
  private scriptUsed = false;
  private propsExamined = 0;

  constructor() {
    super({ key: "DreamTheaterScene" });
  }

  create() {
    this.cameras.main.setBackgroundColor("#0a0a0a");
    if (this.textures.exists("bg-dream-theater")) {
      this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, "bg-dream-theater")
        .setDisplaySize(GAME_WIDTH, GAME_HEIGHT);
    }

    // Spotlight cone (gold circle on black)
    const spotlight = this.add.graphics();
    spotlight.fillStyle(0xd4a44a, 0.08);
    spotlight.fillCircle(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 20, 200);

    // Stage floor line
    const floor = this.add.graphics();
    floor.lineStyle(2, 0x4a3a2a, 0.5);
    floor.lineBetween(100, GAME_HEIGHT - 130, GAME_WIDTH - 100, GAME_HEIGHT - 130);

    // Red curtain hints (left and right edges)
    const curtainL = this.add.graphics();
    curtainL.fillStyle(0x8a2020, 0.6);
    curtainL.fillRect(0, 0, 40, GAME_HEIGHT);

    const curtainR = this.add.graphics();
    curtainR.fillStyle(0x8a2020, 0.6);
    curtainR.fillRect(GAME_WIDTH - 40, 0, 40, GAME_HEIGHT);

    // --- Prop: MASK (left) ---
    this.createInteractableRect(
      240, 300, 100, 70, 0x3a3a4a, "🎭 MASK",
      () => this.useMask()
    );

    // --- Prop: MIRROR (center) ---
    this.createInteractableRect(
      480, 280, 80, 100, 0x6a7a8a, "🪞 MIRROR",
      () => this.useMirror()
    );

    // --- Prop: SCRIPT (right) ---
    this.createInteractableRect(
      720, 300, 100, 70, 0x5a4a3a, "📜 SCRIPT",
      () => this.useScript()
    );

    this.setupDreamUI();
    audioManager.setAmbient("dream-theater");

    this.startDream();
  }

  private async startDream(): Promise<void> {
    await this.fadeIn(1500);
    await this.showStageDirection("(A theater. Curtain behind them. Audience seats visible but empty. A single gold spotlight.)");
    await this.showDreamLine("You know this is a performance, right?", "#7eb8c9");
    await this.showStageDirection("(Three props sit on the stage. A mask. A mirror. A script.)");
  }

  private async useMask(): Promise<void> {
    if (this.maskUsed || this.isShowingDialogue) return;
    this.maskUsed = true;
    this.propsExamined++;

    await this.showDreamLine("Put it on?", "#f8f0e3");

    const choice = await this.showDreamChoices([
      "Put the mask on.",
      "Leave it.",
    ]);

    if (choice === 0) {
      await this.showStageDirection("(The mask fits perfectly. Your voice is muffled. But you feel... safer.)");
      await this.showDreamLine("Is this real? Are we real? Or are we just doing what they wrote for us?", "#7eb8c9");
    } else {
      await this.showStageDirection("(You leave the mask on the ground. It stares up at you.)");
      await this.showDreamLine("Brave. Or stupid. Same thing sometimes.", "#7eb8c9");
    }

    this.checkAllPropsUsed();
  }

  private async useMirror(): Promise<void> {
    if (this.mirrorUsed || this.isShowingDialogue) return;
    this.mirrorUsed = true;
    this.propsExamined++;

    await this.showDreamLine("Look?", "#f8f0e3");

    const choice = await this.showDreamChoices([
      "Look at your reflection.",
      "Turn the mirror around.",
    ]);

    if (choice === 0) {
      await this.showStageDirection("(You see Simon. But the reflection doesn't quite match. It's... who you've been tonight. Every choice is on that face.)");
      await this.showDreamLine("That person in the mirror -- is that who you chose to be? Or who they made you?", "#7eb8c9");
    } else {
      await this.showStageDirection("(The mirror faces the empty audience. Reflecting nothing back to no one.)");
      await this.showDreamLine("If nobody's watching, does the performance still matter?", "#7eb8c9");
    }

    this.checkAllPropsUsed();
  }

  private async useScript(): Promise<void> {
    if (this.scriptUsed || this.isShowingDialogue) return;
    this.scriptUsed = true;
    this.propsExamined++;

    await this.showDreamLine("Read the next line?", "#f8f0e3");

    const choice = await this.showDreamChoices([
      "Read what's written.",
      "Improvise.",
    ]);

    if (choice === 0) {
      await this.showStageDirection("(The script says exactly what you've been saying all night. Word for word. It was always written.)");
      await this.showDreamLine("Good. You followed the script. Everyone does.", "#7eb8c9");
    } else {
      await this.showStageDirection("(You open your mouth. Nothing comes out. Improvising requires knowing who you are.)");
      await this.showDreamLine("What would you even say? If you could say anything?", "#7eb8c9");
    }

    this.checkAllPropsUsed();
  }

  private async checkAllPropsUsed(): Promise<void> {
    if (this.propsExamined < 2) return; // Need at least 2 of 3

    await this.wait(800);
    await this.showDreamLine("This is one big performance. The more you pretend, the more you start to believe it.", "#7eb8c9");

    await this.wait(600);

    // The identity choice
    const choice = await this.showDreamChoices([
      "Do I like guys?",
      "I AM A GUY. And I'm secure in that.",
      "I feel different. I don't know why.",
    ], ["#d4a0d0", "#a0a0a0", "#808080"]);

    if (choice === 0) {
      await this.showStageDirection("(The spotlight widens. Just for a moment. Like the theater is making room for you.)");
    } else if (choice === 1) {
      await this.showStageDirection("(The spotlight holds. Steady. The same size it's always been.)");
    } else {
      await this.showStageDirection("(The spotlight flickers. Not sure what to illuminate.)");
    }

    await this.wait(600);
    await this.showStageDirection("(The theater goes dark.)");

    await this.endDream();
  }
}
```

- [ ] **Step 2: Register in config.ts**

Add import and scene:

```typescript
import { DreamTheaterScene } from "./scenes/dreams/DreamTheaterScene";
```

Add `DreamTheaterScene` to the scene array.

- [ ] **Step 3: Verify build**

```bash
cd /c/Users/cjpmu/SCOUTS && npm run build
```

- [ ] **Step 4: Commit**

```bash
cd /c/Users/cjpmu/SCOUTS
git add game/scenes/dreams/DreamTheaterScene.ts game/config.ts
git commit -m "feat: Dream 5 -- Simon & Sam Theater (The Performance)"
```

---

## Task 8: Dream 6 -- Sam's Bedroom (The Prayer)

**Files:**
- Create: `game/scenes/dreams/DreamSamScene.ts`
- Modify: `game/config.ts`

**Mechanic:** Sam prays. Choose prayer words (all versions of "don't let me be gay"). Between prayers, interact with tender things (moonlight, pillow) -- raises guilt glow. Bible lowers glow but kills warmth.

- [ ] **Step 1: Create DreamSamScene.ts**

Create `game/scenes/dreams/DreamSamScene.ts`:

```typescript
import Phaser from "phaser";
import { BaseDreamScene } from "./BaseDreamScene";
import { GAME_WIDTH, GAME_HEIGHT } from "../../constants";
import { audioManager } from "../../systems/AudioManager";

/**
 * Sam's Bedroom: The Prayer
 *
 * Sam is in bed, praying. Choose prayer words -- all versions of
 * "please don't let me be gay." Tender interactions (moonlight, pillow)
 * raise guilt glow. Bible lowers it but the room gets cold.
 * The glow never goes away.
 */
export class DreamSamScene extends BaseDreamScene {
  private guilt = 0.2; // starts with a little
  private roomWarmth = 0.7;
  private guiltGlow!: Phaser.GameObjects.Graphics;
  private moonlight!: Phaser.GameObjects.Graphics;
  private prayerRound = 0;
  private maxPrayers = 4;

  constructor() {
    super({ key: "DreamSamScene" });
  }

  create() {
    this.cameras.main.setBackgroundColor("#0a0a2a");
    if (this.textures.exists("bg-dream-sam")) {
      this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, "bg-dream-sam")
        .setDisplaySize(GAME_WIDTH, GAME_HEIGHT);
    }

    // Moonlight beam from window (right side)
    this.moonlight = this.add.graphics().setDepth(10);
    this.drawMoonlight();

    // Bed area (center-left)
    const bed = this.add.graphics();
    bed.fillStyle(0x2a2a4a, 1);
    bed.fillRoundedRect(150, 280, 300, 150, 8);

    // Guilt glow around Sam's position
    this.guiltGlow = this.add.graphics().setDepth(20);
    this.updateGuiltGlow();

    // --- Interactable: Pillow ---
    this.createInteractableRect(
      240, 320, 100, 50, 0x4a4a6a, "Pillow",
      () => this.touchPillow()
    );

    // --- Interactable: Moonlight (window) ---
    this.createInteractableRect(
      780, 200, 80, 120, 0x3a3a6a, "🌙\nWindow",
      () => this.touchMoonlight()
    );

    // --- Interactable: Bible ---
    this.createInteractableRect(
      520, 340, 80, 50, 0x4a3a2a, "📖 Bible",
      () => this.touchBible()
    );

    this.setupDreamUI();
    audioManager.setAmbient("dream-bedroom");

    this.startDream();
  }

  private async startDream(): Promise<void> {
    await this.fadeIn(1500);
    await this.showStageDirection("(Sam's bedroom. Night. Blue moonlight through the window. A Bible on the nightstand. A pillow held tight.)");

    await this.nextPrayer();
  }

  private async nextPrayer(): Promise<void> {
    if (this.prayerRound >= this.maxPrayers) {
      await this.endSequence();
      return;
    }

    this.prayerRound++;

    // Choose how to pray
    const prayers = this.getPrayerOptions(this.prayerRound);
    await this.showDreamLine("Pray.", "#7eb8c9");

    const choice = await this.showDreamChoices(prayers, ["#7eb8c9", "#7eb8c9", "#7eb8c9"]);
    const chosenPrayer = prayers[choice];

    await this.showDreamLine(chosenPrayer, "#7eb8c9");
    await this.wait(800);

    // After prayer, player can interact with objects before next prayer
    await this.showStageDirection("(The room is quiet. The moonlight shifts.)");

    // Wait for player to interact with something or auto-advance after 12 seconds
    await Promise.race([
      this.waitForInteraction(),
      this.wait(12000),
    ]);

    await this.nextPrayer();
  }

  private getPrayerOptions(round: number): string[] {
    const sets = [
      [
        "Lord, please take this away from me.",
        "Lord, please make me normal.",
        "Lord, please don't let anyone find out.",
      ],
      [
        "Lord, please let me like girls.",
        "Lord, I don't want to be a sinner.",
        "Lord, please make it stop.",
      ],
      [
        "Lord, I promise I'll be good.",
        "Lord, please don't let mom be right about me.",
        "Lord, I can't help it. I'm sorry.",
      ],
      [
        "Lord, please don't let me be gay.",
        "Lord, why did you make me this way?",
        "Lord... are you even listening?",
      ],
    ];
    return sets[Math.min(round - 1, sets.length - 1)];
  }

  private waitForInteraction(): Promise<void> {
    return new Promise((resolve) => {
      // Resolve on next object interaction
      const checkInterval = this.time.addEvent({
        delay: 500,
        loop: true,
        callback: () => {
          if (this.isShowingDialogue) {
            checkInterval.destroy();
            // Wait for dialogue to finish, then resolve
            const waitForDialogue = this.time.addEvent({
              delay: 500,
              loop: true,
              callback: () => {
                if (!this.isShowingDialogue) {
                  waitForDialogue.destroy();
                  resolve();
                }
              },
            });
          }
        },
      });
    });
  }

  private async touchPillow(): Promise<void> {
    if (this.isShowingDialogue) return;
    this.guilt = Math.min(1, this.guilt + 0.15);
    this.updateGuiltGlow();
    await this.showDreamLine("It's warm. It feels like someone is holding you.", "#c4a0d8");
  }

  private async touchMoonlight(): Promise<void> {
    if (this.isShowingDialogue) return;
    this.guilt = Math.min(1, this.guilt + 0.1);
    this.updateGuiltGlow();
    await this.showDreamLine("The moonlight is beautiful. You don't deserve beautiful things.", "#c4a0d8");
  }

  private async touchBible(): Promise<void> {
    if (this.isShowingDialogue) return;
    this.guilt = Math.max(0.1, this.guilt - 0.12);
    this.roomWarmth = Math.max(0.1, this.roomWarmth - 0.15);
    this.updateGuiltGlow();
    this.drawMoonlight();
    await this.showDreamLine("The pages are cold. The words are clear. The room gets darker.", "#8a7a6a");
  }

  private updateGuiltGlow(): void {
    this.guiltGlow.clear();
    // Lavender-pink glow around Sam's chest area -- Simon's color
    const alpha = this.guilt * 0.4;
    this.guiltGlow.fillStyle(0xd4a0d0, alpha);
    this.guiltGlow.fillCircle(280, 340, 60 + this.guilt * 30);
  }

  private drawMoonlight(): void {
    this.moonlight.clear();
    const alpha = this.roomWarmth * 0.3;
    this.moonlight.fillStyle(0x6080c0, alpha);
    // Moonbeam triangle from window
    this.moonlight.fillTriangle(
      GAME_WIDTH - 80, 160,
      GAME_WIDTH - 200, GAME_HEIGHT - 130,
      GAME_WIDTH - 50, GAME_HEIGHT - 130,
    );
  }

  private async endSequence(): Promise<void> {
    await this.wait(600);
    await this.showStageDirection("(Sam buries his face in the pillow.)");
    await this.showDreamLine("Please Lord don't let me be gay.", "#7eb8c9");
    await this.wait(800);
    await this.showStageDirection("(The glow doesn't go away. It never goes away.)");
    await this.wait(1500);
    await this.endDream();
  }
}
```

- [ ] **Step 2: Register in config.ts**

Add import and scene:

```typescript
import { DreamSamScene } from "./scenes/dreams/DreamSamScene";
```

Add `DreamSamScene` to the scene array.

- [ ] **Step 3: Verify build**

```bash
cd /c/Users/cjpmu/SCOUTS && npm run build
```

- [ ] **Step 4: Commit**

```bash
cd /c/Users/cjpmu/SCOUTS
git add game/scenes/dreams/DreamSamScene.ts game/config.ts
git commit -m "feat: Dream 6 -- Sam's Bedroom (The Prayer)"
```

---

## Task 9: Dream 7 -- Brent's Empty House (The Cage)

**Files:**
- Create: `game/scenes/dreams/DreamBrentScene.ts`
- Modify: `game/config.ts`

**Mechanic:** You are Brent. Everything is something he wants but can't have. Touch flowers = he slaps them away. Dad's chair is empty. San Francisco on the map. Mirror shows the bad guy. No exit. The longest silence.

- [ ] **Step 1: Create DreamBrentScene.ts**

Create `game/scenes/dreams/DreamBrentScene.ts`:

```typescript
import Phaser from "phaser";
import { BaseDreamScene } from "./BaseDreamScene";
import { GAME_WIDTH, GAME_HEIGHT } from "../../constants";
import { audioManager } from "../../systems/AudioManager";

/**
 * Brent's Empty House: The Cage
 *
 * You are Brent. A living room. Dad's chair (empty). San Francisco
 * on the map. Flowers in a vase. A mirror.
 * Every object is something Brent wants but can't have.
 * Touch flowers = slaps them away. No exit. No door.
 * Ends with the longest silence in the game.
 */
export class DreamBrentScene extends BaseDreamScene {
  private flowersDestroyed = false;
  private chairUsed = false;
  private mapUsed = false;
  private mirrorUsed = false;
  private flowersUsedTwice = false;
  private interactionsComplete = 0;
  private vaseShards: Phaser.GameObjects.Graphics | null = null;
  private waterStain: Phaser.GameObjects.Graphics | null = null;

  constructor() {
    super({ key: "DreamBrentScene" });
  }

  create() {
    this.cameras.main.setBackgroundColor("#2a2820");
    if (this.textures.exists("bg-dream-brent")) {
      this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, "bg-dream-brent")
        .setDisplaySize(GAME_WIDTH, GAME_HEIGHT);
    }

    // Overhead light (too bright)
    const light = this.add.graphics().setDepth(5);
    light.fillStyle(0xfff8e0, 0.06);
    light.fillCircle(GAME_WIDTH / 2, 0, 400);

    // Beige walls
    const walls = this.add.graphics().setDepth(1);
    walls.fillStyle(0xd4c8a8, 0.3);
    walls.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT - 130);

    // --- Interactable: Dad's chair (center-left) ---
    this.createInteractableRect(
      300, 300, 120, 100, 0x6a5a4a, "Dad's\nChair",
      () => this.touchChair()
    );

    // --- Interactable: Flowers (left, on windowsill) ---
    this.createInteractableRect(
      120, 200, 80, 80, 0xd490a0, "🌸 Flowers",
      () => this.touchFlowers()
    );

    // --- Interactable: Map with San Francisco (right wall) ---
    this.createInteractableRect(
      700, 180, 140, 100, 0x8aaa9a, "🗺️ Map\n(San Francisco ⭕)",
      () => this.touchMap()
    );

    // --- Interactable: Mirror (center-right) ---
    this.createInteractableRect(
      580, 300, 80, 110, 0x8a9aaa, "🪞 Mirror",
      () => this.touchMirror()
    );

    this.setupDreamUI();
    audioManager.setAmbient("dream-house");

    this.startDream();
  }

  private async startDream(): Promise<void> {
    await this.fadeIn(1500);
    await this.showStageDirection("(A living room. Beige walls. Overhead light that's too bright. Dad's chair sits empty in the middle of the room.)");
    await this.showStageDirection("(There is no door.)");
  }

  private async touchFlowers(): Promise<void> {
    if (this.isShowingDialogue) return;

    if (!this.flowersDestroyed) {
      this.flowersDestroyed = true;
      this.interactionsComplete++;

      // Brent reaches, then slaps
      await this.showStageDirection("(Your hand reaches toward the flowers. Then —)");
      this.cameras.main.shake(300, 0.008);
      await this.showDreamLine("Flowers are for fags.", "#ff4444");

      // Destroy the flower rect, show broken glass + water
      // (The createInteractableRect objects are in the scene graph)
      this.vaseShards = this.add.graphics().setDepth(100);
      this.vaseShards.fillStyle(0x8a8a8a, 0.5);
      // Scattered shards
      for (let i = 0; i < 6; i++) {
        const sx = 100 + Math.random() * 60;
        const sy = 260 + Math.random() * 30;
        this.vaseShards.fillTriangle(sx, sy, sx + 8, sy - 5, sx + 5, sy + 8);
      }

      // Water stain (permanent)
      this.waterStain = this.add.graphics().setDepth(2);
      this.waterStain.fillStyle(0x6a8aaa, 0.15);
      this.waterStain.fillEllipse(120, 280, 80, 30);

      await this.showStageDirection("(But his eyes linger where the vase was.)");

      this.checkEnd();
    } else if (!this.flowersUsedTwice) {
      this.flowersUsedTwice = true;
      await this.showStageDirection("(They're gone. Just broken glass and water on the floor. You can't go back.)");
    }
  }

  private async touchChair(): Promise<void> {
    if (this.chairUsed || this.isShowingDialogue) return;
    this.chairUsed = true;
    this.interactionsComplete++;

    await this.showStageDirection("(You sit in dad's chair.)");
    await this.showDreamLine("He's not coming back.", "#ff4444");
    await this.showStageDirection("(Brent stands up immediately. The chair rocks, empty.)");

    this.checkEnd();
  }

  private async touchMap(): Promise<void> {
    if (this.mapUsed || this.isShowingDialogue) return;
    this.mapUsed = true;
    this.interactionsComplete++;

    await this.showStageDirection("(You look at San Francisco, circled in red on the map.)");
    await this.showDreamLine("Your daddy's a faggot.", "#ff4444");
    this.cameras.main.shake(200, 0.006);
    await this.showStageDirection("(Brent's fist goes through the map. The hole stays.)");

    this.checkEnd();
  }

  private async touchMirror(): Promise<void> {
    if (this.mirrorUsed || this.isShowingDialogue) return;
    this.mirrorUsed = true;
    this.interactionsComplete++;

    await this.showStageDirection("(You look in the mirror.)");
    await this.wait(800);
    await this.showDreamLine("It's me. The bad guy.", "#ff4444");
    await this.showStageDirection("(The reflection doesn't move when Brent moves. It just stares.)");

    this.checkEnd();
  }

  private async checkEnd(): Promise<void> {
    if (this.interactionsComplete < 3) return;

    await this.wait(1200);
    await this.showStageDirection("(The room has no exit. No door. No window that opens. Brent is trapped in a space full of things he destroyed.)");
    await this.wait(1000);
    await this.showStageDirection("(Brent stands in the middle of the empty room.)");

    await this.showDreamLine("Do I have to be a man?", "#ff4444");

    // The longest silence in the game
    await this.wait(6000);

    await this.showStageDirection("(No answer.)");
    await this.wait(3000);

    await this.endDream();
  }
}
```

- [ ] **Step 2: Register in config.ts**

Add import and scene:

```typescript
import { DreamBrentScene } from "./scenes/dreams/DreamBrentScene";
```

Add `DreamBrentScene` to the scene array.

- [ ] **Step 3: Verify build**

```bash
cd /c/Users/cjpmu/SCOUTS && npm run build
```

- [ ] **Step 4: Commit**

```bash
cd /c/Users/cjpmu/SCOUTS
git add game/scenes/dreams/DreamBrentScene.ts game/config.ts
git commit -m "feat: Dream 7 -- Brent's Empty House (The Cage)"
```

---

## Task 10: Final Wiring + Smoke Test

**Files:**
- Modify: `game/config.ts` (final state with all 7 dream scenes)
- Modify: `game/systems/SceneDirector.ts` (SCENE_CHARACTERS entries for dreams)

- [ ] **Step 1: Verify config.ts has all 7 dream scenes**

The final `game/config.ts` scene array should be:

```typescript
import { DreamNoahScene } from "./scenes/dreams/DreamNoahScene";
import { DreamSimonScene } from "./scenes/dreams/DreamSimonScene";
import { DreamLucasScene } from "./scenes/dreams/DreamLucasScene";
import { DreamJoshScene } from "./scenes/dreams/DreamJoshScene";
import { DreamTheaterScene } from "./scenes/dreams/DreamTheaterScene";
import { DreamSamScene } from "./scenes/dreams/DreamSamScene";
import { DreamBrentScene } from "./scenes/dreams/DreamBrentScene";

// In createGameConfig:
scene: [
  BootScene, CampfireScene, CliffScene, MeadowScene, LakeScene, VoidScene,
  DreamNoahScene, DreamSimonScene, DreamLucasScene, DreamJoshScene,
  DreamTheaterScene, DreamSamScene, DreamBrentScene,
],
```

- [ ] **Step 2: Add dream entries to SCENE_CHARACTERS in SceneDirector**

Open `game/systems/SceneDirector.ts`. Add character entries for dream scenes (dreams don't show campfire sprites, so empty arrays):

```typescript
// Dream scenes -- no world sprites (dreams have their own visuals)
"monologue-noah":     [],
"monologue-simon":    [],
"monologue-lucas":    [],
"monologue-josh":     [],
"monologue-simon-sam":[],
"monologue-sam":      [],
"monologue-brent":    [],
```

Replace the old monologue entries that had single characters with empty arrays, since dream scenes handle their own visuals.

- [ ] **Step 3: Full build verification**

```bash
cd /c/Users/cjpmu/SCOUTS
npm run build
```

Expected: Clean compile, no TypeScript errors, all 3 routes generated (`/`, `/play`, `/_not-found`).

- [ ] **Step 4: Run dev server and playtest**

```bash
cd /c/Users/cjpmu/SCOUTS
npm run dev
```

Open `http://localhost:3000/play` in browser. Verify:
- Game loads to CampfireScene
- After first campfire script completes, transitions to DreamNoahScene (not VoidScene)
- Noah's room renders: desk, XBOX, PSAT score, dark window
- Clicking desk starts study mode (score climbs, room cools)
- Clicking XBOX starts play mode (score drops, room warms)
- After 90 seconds, Noah speaks and scene fades to black
- Transitions back to next scene in SCENE_ORDER

If dream transitions fail, check:
1. SceneDirector's `startCurrentScene()` has the `isDream` early return
2. `advanceToNextScene` is `public`
3. `dreamComplete()` exists and calls `advanceToNextScene()`
4. Dream scene's `endDream()` in BaseDreamScene calls `sceneDirector.dreamComplete(this)`

- [ ] **Step 5: Final commit**

```bash
cd /c/Users/cjpmu/SCOUTS
git add -A
git commit -m "feat: wire all 7 dream scenes into game flow"
```
