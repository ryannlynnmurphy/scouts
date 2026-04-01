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
    if (this.textures.exists("bg-campfire")) {
      this.add.image(480, 270, "bg-campfire").setDisplaySize(960, 540);
    }

    sceneDirector.attachToScene(this);
    sceneDirector.startCurrentScene(this);
  }
}
