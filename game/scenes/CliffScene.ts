import Phaser from "phaser";

export class CliffScene extends Phaser.Scene {
  constructor() {
    super({ key: "CliffScene" });
  }

  create() {
    this.cameras.main.setBackgroundColor("#1a1a2a");
    this.add.text(480, 270, "The Cliff", {
      fontFamily: "Georgia, serif",
      fontSize: "20px",
      color: "#f8f0e3",
    }).setOrigin(0.5);
  }
}
