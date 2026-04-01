import Phaser from "phaser";
import { sceneDirector } from "../systems/SceneDirector";

export class CampfireScene extends Phaser.Scene {
  constructor() {
    super({ key: "CampfireScene" });
  }

  init(data: any) {
    if (data.fractureState) {
      sceneDirector.fracture.fromJSON(data.fractureState);
    }
    if (data.inventoryState) {
      sceneDirector.inventory.fromJSON(data.inventoryState);
    }
  }

  create() {
    this.cameras.main.setBackgroundColor("#0d1a0d");

    // Placeholder background -- will be replaced by pixel art in Plan B
    this.add.text(480, 40, "~ The Campfire Clearing ~", {
      fontFamily: "Georgia, serif",
      fontSize: "14px",
      color: "#f8f0e3",
    }).setOrigin(0.5).setAlpha(0.3);

    sceneDirector.attachToScene(this);
    sceneDirector.startCurrentScene(this);
  }
}
