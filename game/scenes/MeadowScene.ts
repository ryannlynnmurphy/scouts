import Phaser from "phaser";

export class MeadowScene extends Phaser.Scene {
  constructor() {
    super({ key: "MeadowScene" });
  }

  create() {
    this.cameras.main.setBackgroundColor("#1a2a1a");
    this.add.text(480, 270, "The Meadow", {
      fontFamily: "Georgia, serif",
      fontSize: "20px",
      color: "#f8f0e3",
    }).setOrigin(0.5);
  }
}
