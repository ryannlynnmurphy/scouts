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
