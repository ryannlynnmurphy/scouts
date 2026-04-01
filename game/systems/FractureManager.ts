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
