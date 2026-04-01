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
