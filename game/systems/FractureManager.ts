import Phaser from "phaser";
import { ChoiceType, FractureContext } from "../data/types";
import { audioManager } from "./AudioManager";
import type { CharacterSprites } from "../ui/CharacterSprites";

export class FractureManager {
  private _fracture: number = 0;
  private scene: Phaser.Scene;
  private vignette: Phaser.GameObjects.Graphics | null = null;
  private colorMatrix: Phaser.FX.ColorMatrix | null = null;
  private blackBars: Phaser.GameObjects.Graphics | null = null;
  private characterSprites: CharacterSprites | null = null;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  /** Provide a CharacterSprites instance so posture can be updated on fracture changes. */
  setCharacterSprites(sprites: CharacterSprites): void {
    this.characterSprites = sprites;
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
    audioManager.updateFracture(this._fracture);
  }

  /** Call when entering a Gay Shit scene */
  applyGayShitHealing(act: 1 | 2 | 3): void {
    const healing = { 1: -0.08, 2: -0.10, 3: -0.12 };
    this.changeFracture(healing[act]);

    // Tween camera zoom back to 1.0 — the screen physically opens up
    const camera = this.scene.cameras.main;
    this.scene.tweens.add({
      targets: camera,
      zoom: 1.0,
      duration: 2000,
      ease: "Sine.easeOut",
    });

    // Fade black bars out over the same duration
    if (this.blackBars) {
      this.scene.tweens.add({
        targets: this.blackBars,
        alpha: 0,
        duration: 2000,
        ease: "Sine.easeOut",
      });
    }

    // Reset Simon's posture smoothly
    if (this.characterSprites) {
      this.characterSprites.resetSimonPosture();
    }
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

    // Create a fixed-camera graphics layer for black bars (depth 95, above gameplay, below HUD)
    if (this.blackBars) {
      this.blackBars.destroy();
    }
    this.blackBars = this.scene.add.graphics().setDepth(95).setScrollFactor(0);

    this.updateVisuals();
  }

  /** Returns the target camera zoom for the current fracture level. */
  private getTargetZoom(): number {
    if (this._fracture <= 0.25) return 1.0;
    if (this._fracture <= 0.5) return 1.04;
    if (this._fracture <= 0.75) return 1.1;
    return 1.2;
  }

  /** Returns the black bar thickness (pixels) for the current fracture level. */
  private getBarThickness(): number {
    if (this._fracture <= 0.25) return 0;
    if (this._fracture <= 0.5) return 12;
    if (this._fracture <= 0.75) return 30;
    return 60;
  }

  private updateVisuals(): void {
    // --- Color matrix (desaturation + contrast) ---
    if (this.colorMatrix) {
      this.colorMatrix.reset();
      const sat = this.getSaturation();
      if (sat < 1) {
        this.colorMatrix.saturate(sat - 1); // saturate takes -1 to 0 for desaturation
      }
      const contrast = 1 + this._fracture * 0.3;
      this.colorMatrix.contrast(contrast - 1);
    }

    // --- Camera zoom ---
    const camera = this.scene.cameras.main;
    if (camera) {
      camera.setZoom(this.getTargetZoom());
    }

    // --- Black bars ---
    if (this.blackBars) {
      const thickness = this.getBarThickness();
      const gw = this.scene.scale.width;
      const gh = this.scene.scale.height;
      this.blackBars.clear().setAlpha(1);

      if (thickness > 0) {
        this.blackBars.fillStyle(0x000000, 1);
        // Top bar
        this.blackBars.fillRect(0, 0, gw, thickness);
        // Bottom bar
        this.blackBars.fillRect(0, gh - thickness, gw, thickness);
        // Left bar
        this.blackBars.fillRect(0, 0, thickness, gh);
        // Right bar
        this.blackBars.fillRect(gw - thickness, 0, thickness, gh);
      }
    }

    // --- Simon's posture ---
    if (this.characterSprites) {
      this.characterSprites.updateSimonPosture(this._fracture);
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
