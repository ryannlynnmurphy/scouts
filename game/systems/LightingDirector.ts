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
