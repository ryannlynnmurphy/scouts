import Phaser from "phaser";

// Predefined positions for different scene configurations
const CAMPFIRE_POSITIONS: Record<string, { x: number; y: number }> = {
  brent: { x: 480, y: 395 },   // Center front, feet on dirt
  simon: { x: 270, y: 410 },   // Left side, slightly back, close to Sam
  sam:   { x: 330, y: 408 },   // Right next to Simon
  josh:  { x: 590, y: 405 },   // Right side
  noah:  { x: 660, y: 408 },   // Right of Josh
  lucas: { x: 730, y: 412 },   // Far right, slightly back
};

const CLIFF_POSITIONS: Record<string, { x: number; y: number }> = {
  simon: { x: 400, y: 420 },   // On the rock
  sam:   { x: 500, y: 415 },   // Right beside, close
};

const MEADOW_POSITIONS: Record<string, { x: number; y: number }> = {
  simon: { x: 420, y: 410 },   // In the flowers
  sam:   { x: 510, y: 405 },   // Close by
};

const LAKE_POSITIONS: Record<string, { x: number; y: number }> = {
  simon: { x: 440, y: 415 },   // On the rock
  sam:   { x: 510, y: 412 },   // Right beside, intimate
};

const VOID_POSITIONS: Record<string, { x: number; y: number }> = {
  _default: { x: 480, y: 380 }, // Centered in spotlight
};

const SCENE_POSITIONS: Record<string, Record<string, { x: number; y: number }>> = {
  CampfireScene: CAMPFIRE_POSITIONS,
  CliffScene:    CLIFF_POSITIONS,
  MeadowScene:   MEADOW_POSITIONS,
  LakeScene:     LAKE_POSITIONS,
  VoidScene:     VOID_POSITIONS,
};

// Scale overrides per character
const CHAR_SCALE: Record<string, number> = {
  brent: 3.5,
  simon: 2.8,
};
const DEFAULT_SCALE = 3;

// Simon posture states keyed by fracture level
interface PostureState {
  scale: number;
  yOffset: number;    // additional y offset in pixels (positive = lower / more hunched)
  rotation: number;   // degrees
}

const SIMON_POSTURES: Record<"intact" | "cracking" | "fracturing" | "shattered", PostureState> = {
  intact:     { scale: 2.8,  yOffset: 0,  rotation: 0  },
  cracking:   { scale: 2.75, yOffset: 2,  rotation: 0  },
  fracturing: { scale: 2.65, yOffset: 4,  rotation: -2 },
  shattered:  { scale: 2.5,  yOffset: 8,  rotation: -4 },
};

function fractureToPostureKey(fracture: number): keyof typeof SIMON_POSTURES {
  if (fracture <= 0.25) return "intact";
  if (fracture <= 0.5)  return "cracking";
  if (fracture <= 0.75) return "fracturing";
  return "shattered";
}

export class CharacterSprites {
  private scene: Phaser.Scene;
  private sprites: Map<string, Phaser.GameObjects.Image> = new Map();
  private idleTweens: Map<string, Phaser.Tweens.Tween> = new Map();
  private activeSpeaker: string | null = null;
  private sceneKey: string;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.sceneKey = scene.scene.key;
  }

  /** Place characters for the current scene */
  setupForScene(characters: string[]): void {
    this.clear();
    const positions = SCENE_POSITIONS[this.sceneKey] || {};

    for (const charKey of characters) {
      const spriteKey = `${charKey}-sprite`;
      if (!this.scene.textures.exists(spriteKey)) {
        console.warn(`CharacterSprites: texture not found for ${spriteKey}`);
        continue;
      }

      const pos =
        positions[charKey] ||
        (positions as Record<string, { x: number; y: number }>)["_default"] ||
        { x: 480, y: 300 };

      const scale = CHAR_SCALE[charKey] ?? DEFAULT_SCALE;

      const sprite = this.scene.add
        .image(pos.x, pos.y, spriteKey)
        .setScale(scale)
        .setDepth(10)
        .setOrigin(0.5, 1); // anchor at feet

      this.sprites.set(charKey, sprite);

      // Idle breathing tween — offset by random phase so they don't all sway in sync
      const tween = this.scene.tweens.add({
        targets: sprite,
        y: pos.y - 2,
        duration: 1500 + Math.random() * 500,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
        delay: Math.random() * 800,
      });
      this.idleTweens.set(charKey, tween);
    }
  }

  /** Highlight the speaking character; dim the rest. Pass null to reset all. */
  setSpeaker(charKey: string | null): void {
    const key = charKey?.toLowerCase() ?? null;

    this.sprites.forEach((sprite, k) => {
      sprite.setAlpha(key && k !== key ? 0.5 : 1);
    });

    if (key) {
      const speaker = this.sprites.get(key);
      if (speaker) {
        // Small bounce to draw attention
        this.scene.tweens.add({
          targets: speaker,
          scaleX: speaker.scaleX * 1.05,
          scaleY: speaker.scaleY * 1.05,
          duration: 120,
          yoyo: true,
          ease: "Sine.easeOut",
        });
      }
    }

    this.activeSpeaker = key;
  }

  /**
   * Apply posture transforms to Simon's sprite based on the current fracture level.
   * Called by FractureManager whenever fracture changes.
   */
  updateSimonPosture(fracture: number): void {
    const simon = this.sprites.get("simon");
    if (!simon) return;

    const key = fractureToPostureKey(fracture);
    const posture = SIMON_POSTURES[key];

    // Determine Simon's base Y from the scene positions
    const positions = SCENE_POSITIONS[this.sceneKey] || {};
    const basePos = positions["simon"] || { x: 480, y: 300 };

    simon.setScale(posture.scale);
    simon.setY(basePos.y + posture.yOffset);
    simon.setAngle(posture.rotation);
  }

  /**
   * Smoothly tween Simon back to the Intact posture (used during Gay Shit scenes).
   */
  resetSimonPosture(): void {
    const simon = this.sprites.get("simon");
    if (!simon) return;

    const positions = SCENE_POSITIONS[this.sceneKey] || {};
    const basePos = positions["simon"] || { x: 480, y: 300 };
    const intact = SIMON_POSTURES.intact;

    this.scene.tweens.add({
      targets: simon,
      scaleX: intact.scale,
      scaleY: intact.scale,
      y: basePos.y + intact.yOffset,
      angle: intact.rotation,
      duration: 2000,
      ease: "Sine.easeOut",
    });
  }

  /** Remove all sprites from the scene */
  clear(): void {
    this.idleTweens.forEach((t) => t.destroy());
    this.idleTweens.clear();
    this.sprites.forEach((s) => s.destroy());
    this.sprites.clear();
    this.activeSpeaker = null;
  }

  destroy(): void {
    this.clear();
  }
}
