import Phaser from "phaser";
import { sceneDirector } from "../systems/SceneDirector";

export class LakeScene extends Phaser.Scene {
  constructor() {
    super({ key: "LakeScene" });
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
    this.cameras.main.setBackgroundColor("#0a1a2a");

    this.add.text(480, 40, "~ The Lake ~", {
      fontFamily: "Georgia, serif",
      fontSize: "14px",
      color: "#f8f0e3",
    }).setOrigin(0.5).setAlpha(0.3);

    sceneDirector.attachToScene(this);
    sceneDirector.startCurrentScene(this);
  }
}
