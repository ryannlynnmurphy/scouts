import Phaser from "phaser";

export class LakeScene extends Phaser.Scene {
  constructor() {
    super({ key: "LakeScene" });
  }

  create() {
    this.cameras.main.setBackgroundColor("#0a1a2a");
    this.add.text(480, 270, "The Lake", {
      fontFamily: "Georgia, serif",
      fontSize: "20px",
      color: "#f8f0e3",
    }).setOrigin(0.5);
  }
}
