import Phaser from "phaser";

export class CampfireScene extends Phaser.Scene {
  constructor() {
    super({ key: "CampfireScene" });
  }

  create() {
    this.cameras.main.setBackgroundColor("#0d1a0d");
    this.add.text(480, 270, "Campfire Clearing", {
      fontFamily: "Georgia, serif",
      fontSize: "20px",
      color: "#f8f0e3",
    }).setOrigin(0.5);
  }
}
