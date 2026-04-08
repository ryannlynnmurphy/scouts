import Phaser from "phaser";
import { audioManager } from "../systems/AudioManager";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload(): void {
    // Assets will be loaded as they're added
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
      this.scene.start("CampfireScene");
    });
  }
}
