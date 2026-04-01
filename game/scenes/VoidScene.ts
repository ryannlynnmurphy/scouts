import Phaser from "phaser";
import { sceneDirector } from "../systems/SceneDirector";

export class VoidScene extends Phaser.Scene {
  constructor() {
    super({ key: "VoidScene" });
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
    this.cameras.main.setBackgroundColor("#000000");

    sceneDirector.attachToScene(this);
    sceneDirector.startCurrentScene(this);
  }
}
