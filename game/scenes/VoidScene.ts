import Phaser from "phaser";

export class VoidScene extends Phaser.Scene {
  constructor() {
    super({ key: "VoidScene" });
  }

  create() {
    this.cameras.main.setBackgroundColor("#000000");
    this.add.text(480, 270, "The Void", {
      fontFamily: "Georgia, serif",
      fontSize: "20px",
      color: "#f8f0e3",
    }).setOrigin(0.5);
  }
}
