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
