import Phaser from "phaser";

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: "BootScene" });
  }

  preload() {
    // Plan B will add asset loading here
    const centerX = 480;
    const centerY = 270;
    this.add.text(centerX, centerY, "SCOUTS", {
      fontFamily: "Georgia, serif",
      fontSize: "32px",
      color: "#c9a96e",
      fontStyle: "bold",
    }).setOrigin(0.5);
    this.add.text(centerX, centerY + 40, "Loading...", {
      fontFamily: "Georgia, serif",
      fontSize: "16px",
      color: "#f8f0e3",
    }).setOrigin(0.5).setAlpha(0.5);
  }

  create() {
    // Start at CampfireScene (first scene in SCENE_ORDER)
    this.scene.start("CampfireScene");
  }
}
